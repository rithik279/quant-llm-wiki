"""
routers/execution.py
====================
FastAPI router for execution quality analysis.

Endpoints
---------
  POST /execution/upload              — upload PMT + Tradeovate CSVs, run analysis, persist
  GET  /execution/sessions            — list all sessions (summary)
  GET  /execution/sessions/{id}       — full session data (summary + trades)
"""

from __future__ import annotations

import io
import logging
import sys
from datetime import timezone
from pathlib import Path
from typing import Optional
from uuid import uuid4

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

# Make ExecutionDashboard importable regardless of working directory
_EXEC_DIR = Path(__file__).parent.parent / "ExecutionDashboard"
if str(_EXEC_DIR) not in sys.path:
    sys.path.insert(0, str(_EXEC_DIR))

from normalizers import normalize_pickmytrade, normalize_tradeovate
from matcher import match_pmt_to_tradeovate
from metrics import compute_metrics, select_output_columns

import execution_db
import journal_db

log = logging.getLogger(__name__)

router = APIRouter(prefix="/execution", tags=["execution"])

# Matching tolerance: PMT alert → Tradeovate fill (seconds)
PMT_TOV_TOLERANCE_SEC = 60


@router.on_event("startup")
def _init():
    execution_db.init_db()
    journal_db.init_db()  # ensure journal tables exist even if /journal endpoint is never hit


# ---------------------------------------------------------------------------
# POST /execution/upload
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_execution(
    pmt_file: UploadFile = File(..., description="PickMyTrade alerts CSV"),
    tov_file: UploadFile = File(..., description="Tradeovate Performance CSV"),
    account_id: Optional[str] = Form(None, description="Tradeovate account ID — if provided, trades are also saved to the journal"),
):
    pmt_bytes = await pmt_file.read()
    tov_bytes = await tov_file.read()

    try:
        pmt = normalize_pickmytrade(io.StringIO(pmt_bytes.decode("utf-8")))
        tov = normalize_tradeovate(io.StringIO(tov_bytes.decode("utf-8")))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        log.exception("CSV parse error")
        raise HTTPException(status_code=400, detail=f"CSV parse error: {e}")

    matched = match_pmt_to_tradeovate(pmt, tov, tolerance_sec=PMT_TOV_TOLERANCE_SEC)
    unmatched_pmt = len(pmt) - len(matched)

    if matched.empty:
        raise HTTPException(
            status_code=422,
            detail="No trades matched between PMT and Tradeovate. "
                   "Check that the CSVs cover the same trading session.",
        )

    result = compute_metrics(matched)
    output = select_output_columns(result)

    # Determine session date from the latest trade entry time
    session_date = (
        output["tov_entry_time"].max().date().isoformat()
        if not output["tov_entry_time"].empty
        else pd.Timestamp.now().date().isoformat()
    )

    session_id = str(uuid4())
    trades_list = _df_to_trades(output)

    execution_db.save_session(
        session_id=session_id,
        session_date=session_date,
        pmt_filename=pmt_file.filename or "pmt.csv",
        tov_filename=tov_file.filename or "tov.csv",
        trades=trades_list,
        unmatched_pmt=unmatched_pmt,
    )

    # Auto-save to journal if account_id provided
    journal_saved = False
    journal_error = None
    if account_id and account_id.strip():
        try:
            journal_trades = _tov_to_journal_trades(tov)
            if journal_trades:
                journal_db.upsert_account(account_id.strip())
                journal_db.save_trades(
                    account_id=account_id.strip(),
                    trades=journal_trades,
                    filename=tov_file.filename or "tov.csv",
                )
                journal_saved = True
                log.info("[execution] journal auto-saved %d trades for account %s",
                         len(journal_trades), account_id.strip())
        except Exception as e:
            log.exception("Journal auto-save failed")
            journal_error = str(e)

    resp = _session_response(session_id, session_date, trades_list, unmatched_pmt,
                             pmt_file.filename, tov_file.filename)
    resp["journal_saved"] = journal_saved
    if journal_error:
        resp["journal_error"] = journal_error
    return resp


# ---------------------------------------------------------------------------
# GET /execution/sessions
# ---------------------------------------------------------------------------

@router.get("/sessions")
def list_sessions():
    sessions = execution_db.get_sessions()
    return {"sessions": sessions}


# ---------------------------------------------------------------------------
# GET /execution/sessions/{session_id}
# ---------------------------------------------------------------------------

@router.get("/sessions/{session_id}")
def get_session(session_id: str):
    session = execution_db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _df_to_trades(df: pd.DataFrame) -> list[dict]:
    records = []
    for _, row in df.iterrows():
        records.append({
            "pmt_symbol":       _safe(row.get("pmt_symbol")),
            "tov_symbol":       _safe(row.get("tov_symbol")),
            "symbol_match":     bool(row.get("symbol_match", False)),
            "direction":        _safe(row.get("direction")),
            "pmt_trade_time":   _ts(row.get("pmt_trade_time")),
            "pmt_signal_price": _float(row.get("pmt_signal_price")),
            "tov_entry_time":   _ts(row.get("tov_entry_time")),
            "tov_entry_price":  _float(row.get("tov_entry_price")),
            "tov_exit_time":    _ts(row.get("tov_exit_time")),
            "tov_exit_price":   _float(row.get("tov_exit_price")),
            "tov_qty":          int(row["tov_qty"]) if pd.notna(row.get("tov_qty")) else None,
            "tov_pnl":          _float(row.get("tov_pnl")),
            "fill_latency_sec": _float(row.get("fill_latency_sec")),
            "entry_slippage":   _float(row.get("entry_slippage")),
            "slippage_pnl":     _float(row.get("slippage_pnl")),
        })
    return records


def _session_response(session_id, session_date, trades, unmatched_pmt,
                      pmt_filename, tov_filename) -> dict:
    n = len(trades)
    return {
        "session_id":          session_id,
        "session_date":        session_date,
        "pmt_filename":        pmt_filename,
        "tov_filename":        tov_filename,
        "matched_count":       n,
        "unmatched_pmt":       unmatched_pmt,
        "avg_slippage_pts":    round(sum(t["entry_slippage"] for t in trades) / n, 4) if n else None,
        "avg_latency_sec":     round(sum(t["fill_latency_sec"] for t in trades) / n, 3) if n else None,
        "total_slippage_pnl":  round(sum(t["slippage_pnl"] for t in trades), 2) if n else None,
        "total_tov_pnl":       round(sum(t["tov_pnl"] for t in trades), 2) if n else None,
        "trades":              trades,
    }


def _tov_to_journal_trades(tov: pd.DataFrame) -> list[dict]:
    """Convert normalized Tradeovate DataFrame into journal_db.save_trades() format."""
    records = []
    for _, row in tov.iterrows():
        entry_time = row.get("entry_time")
        exit_time  = row.get("exit_time")
        if not hasattr(entry_time, "date"):
            continue
        duration_sec = None
        if hasattr(entry_time, "timestamp") and hasattr(exit_time, "timestamp"):
            try:
                duration_sec = (exit_time - entry_time).total_seconds()
            except Exception:
                pass
        records.append({
            "trade_date":   entry_time.date().isoformat(),
            "symbol":       str(row["symbol"]) if pd.notna(row.get("symbol")) else None,
            "direction":    str(row["direction"]) if pd.notna(row.get("direction")) else None,
            "entry_time":   entry_time.isoformat(),
            "entry_price":  float(row["entry_price"]) if pd.notna(row.get("entry_price")) else None,
            "exit_time":    exit_time.isoformat() if pd.notna(exit_time) else None,
            "exit_price":   float(row["exit_price"]) if pd.notna(row.get("exit_price")) else None,
            "qty":          int(row["qty"]) if pd.notna(row.get("qty")) else None,
            "pnl":          float(row["pnl"]) if pd.notna(row.get("pnl")) else None,
            "duration_sec": duration_sec,
        })
    return records


def _safe(v):
    return str(v) if v is not None and not (isinstance(v, float) and pd.isna(v)) else None

def _float(v):
    if v is None:
        return None
    try:
        f = float(v)
        return None if pd.isna(f) else round(f, 4)
    except (TypeError, ValueError):
        return None

def _ts(v):
    if v is None:
        return None
    if hasattr(v, "isoformat"):
        return v.isoformat()
    return str(v)
