"""
routers/journal.py
==================
FastAPI router for the trading journal.

Endpoints
---------
  POST /journal/upload              — upload Tradeovate CSV + account_id, persist trades
  GET  /journal/accounts            — list all accounts
  GET  /journal/calendar            — daily P&L for a month  (?account_id=&year=&month=)
  GET  /journal/day                 — all trades for one day (?account_id=&date=)
  GET  /journal/stats               — lifetime stats for an account (?account_id=)
"""

from __future__ import annotations

import io
import logging
import sys
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile

import journal_db

# Make ExecutionDashboard importable
_EXEC_DIR = Path(__file__).parent.parent / "ExecutionDashboard"
if str(_EXEC_DIR) not in sys.path:
    sys.path.insert(0, str(_EXEC_DIR))

from normalizers import normalize_tradeovate

log = logging.getLogger(__name__)

router = APIRouter(prefix="/journal", tags=["journal"])


@router.on_event("startup")
def _init():
    journal_db.init_db()


# ---------------------------------------------------------------------------
# POST /journal/upload
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_journal(
    account_id: str = Form(..., description="Tradeovate account ID (copy-paste from Tradeovate)"),
    account_name: Optional[str] = Form(None, description="Optional friendly account name"),
    tov_file: UploadFile = File(..., description="Tradeovate Performance CSV"),
):
    tov_bytes = await tov_file.read()

    try:
        tov = normalize_tradeovate(io.StringIO(tov_bytes.decode("utf-8")))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        log.exception("CSV parse error")
        raise HTTPException(status_code=400, detail=f"CSV parse error: {e}")

    if tov.empty:
        raise HTTPException(status_code=422, detail="No trades found in CSV.")

    # Build trade records
    trades = []
    for _, row in tov.iterrows():
        entry_time = row.get("entry_time")
        exit_time  = row.get("exit_time")

        duration_sec: Optional[float] = None
        if pd.notna(entry_time) and pd.notna(exit_time):
            try:
                duration_sec = (exit_time - entry_time).total_seconds()
            except Exception:
                pass

        trade_date = entry_time.date().isoformat() if pd.notna(entry_time) else None
        if not trade_date:
            continue

        trades.append({
            "trade_date":   trade_date,
            "symbol":       str(row["symbol"]) if pd.notna(row.get("symbol")) else None,
            "direction":    str(row["direction"]) if pd.notna(row.get("direction")) else None,
            "entry_time":   entry_time.isoformat() if pd.notna(entry_time) else None,
            "entry_price":  float(row["entry_price"]) if pd.notna(row.get("entry_price")) else None,
            "exit_time":    exit_time.isoformat() if pd.notna(exit_time) else None,
            "exit_price":   float(row["exit_price"]) if pd.notna(row.get("exit_price")) else None,
            "qty":          int(row["qty"]) if pd.notna(row.get("qty")) else None,
            "pnl":          float(row["pnl"]) if pd.notna(row.get("pnl")) else None,
            "duration_sec": duration_sec,
        })

    if not trades:
        raise HTTPException(status_code=422, detail="Could not extract trade dates from CSV.")

    journal_db.upsert_account(account_id, account_name)
    upload_id = journal_db.save_trades(
        account_id=account_id,
        trades=trades,
        filename=tov_file.filename or "tradeovate.csv",
    )

    dates = sorted({t["trade_date"] for t in trades})
    total_pnl = sum(t["pnl"] for t in trades if t["pnl"] is not None)

    return {
        "upload_id":   upload_id,
        "account_id":  account_id,
        "trade_count": len(trades),
        "date_from":   dates[0],
        "date_to":     dates[-1],
        "total_pnl":   round(total_pnl, 2),
    }


# ---------------------------------------------------------------------------
# GET /journal/accounts
# ---------------------------------------------------------------------------

@router.get("/accounts")
def get_accounts():
    return {"accounts": journal_db.list_accounts()}


# ---------------------------------------------------------------------------
# GET /journal/calendar
# ---------------------------------------------------------------------------

@router.get("/calendar")
def get_calendar(
    account_id: str = Query(...),
    year:  int = Query(...),
    month: int = Query(...),
):
    if not (1 <= month <= 12):
        raise HTTPException(status_code=422, detail="month must be 1–12")
    days = journal_db.get_calendar(account_id, year, month)
    return {"account_id": account_id, "year": year, "month": month, "days": days}


# ---------------------------------------------------------------------------
# GET /journal/day
# ---------------------------------------------------------------------------

@router.get("/day")
def get_day(
    account_id: str = Query(...),
    date: str = Query(..., description="YYYY-MM-DD"),
):
    trades = journal_db.get_day_trades(account_id, date)
    total_pnl = sum(t["pnl"] for t in trades if t.get("pnl") is not None)
    return {
        "account_id": account_id,
        "date":       date,
        "trade_count": len(trades),
        "total_pnl":  round(total_pnl, 2),
        "trades":     trades,
    }


# ---------------------------------------------------------------------------
# GET /journal/calendar/master  — combined P&L across ALL accounts
# ---------------------------------------------------------------------------

@router.get("/calendar/master")
def get_calendar_master(year: int = Query(...), month: int = Query(...)):
    if not (1 <= month <= 12):
        raise HTTPException(status_code=422, detail="month must be 1–12")
    days = journal_db.get_calendar_master(year, month)
    return {"year": year, "month": month, "days": days}


# ---------------------------------------------------------------------------
# GET /journal/day/master  — all trades across ALL accounts for one day
# ---------------------------------------------------------------------------

@router.get("/day/master")
def get_day_master(date: str = Query(..., description="YYYY-MM-DD")):
    trades = journal_db.get_day_trades_master(date)
    total_pnl = sum(t["pnl"] for t in trades if t.get("pnl") is not None)
    return {"date": date, "trade_count": len(trades), "total_pnl": round(total_pnl, 2), "trades": trades}


# ---------------------------------------------------------------------------
# GET /journal/stats
# ---------------------------------------------------------------------------

@router.get("/stats")
def get_stats(account_id: str = Query(...)):
    stats = journal_db.get_account_stats(account_id)
    return {"account_id": account_id, **stats}
