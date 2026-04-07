"""
execution_db.py
===============
SQLite persistence layer for execution quality sessions and trades.

Tables
------
  execution_sessions  — one row per uploaded daily session
  execution_trades    — one row per matched PMT→Tradeovate trade
"""

from __future__ import annotations

import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

DB_PATH = Path(__file__).parent / "strategies" / "execution.db"


def _connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS execution_sessions (
                session_id        TEXT PRIMARY KEY,
                uploaded_at       TEXT NOT NULL,
                session_date      TEXT NOT NULL,
                pmt_filename      TEXT,
                tov_filename      TEXT,
                matched_count     INTEGER NOT NULL DEFAULT 0,
                unmatched_pmt     INTEGER NOT NULL DEFAULT 0,
                avg_slippage_pts  REAL,
                avg_latency_sec   REAL,
                total_slippage_pnl REAL,
                total_tov_pnl     REAL
            );

            CREATE TABLE IF NOT EXISTS execution_trades (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id       TEXT NOT NULL REFERENCES execution_sessions(session_id),
                pmt_symbol       TEXT,
                tov_symbol       TEXT,
                symbol_match     INTEGER,
                direction        TEXT,
                pmt_trade_time   TEXT,
                pmt_signal_price REAL,
                tov_entry_time   TEXT,
                tov_entry_price  REAL,
                tov_exit_time    TEXT,
                tov_exit_price   REAL,
                tov_qty          INTEGER,
                tov_pnl          REAL,
                fill_latency_sec REAL,
                entry_slippage   REAL,
                slippage_pnl     REAL
            );

            CREATE INDEX IF NOT EXISTS idx_trades_session
                ON execution_trades(session_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_date
                ON execution_sessions(session_date);
        """)
    log.info("[execution_db] initialised at %s", DB_PATH)


def save_session(
    session_id: str,
    session_date: str,
    pmt_filename: str,
    tov_filename: str,
    trades: list[dict[str, Any]],
    unmatched_pmt: int = 0,
) -> None:
    """Persist a full session (summary + all trades) atomically."""
    now = datetime.now(timezone.utc).isoformat()

    matched = len(trades)
    avg_slip = sum(t["entry_slippage"] for t in trades) / matched if matched else None
    avg_lat  = sum(t["fill_latency_sec"] for t in trades) / matched if matched else None
    total_slip_pnl = sum(t["slippage_pnl"] for t in trades) if matched else None
    total_pnl      = sum(t["tov_pnl"] for t in trades) if matched else None

    with _connect() as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO execution_sessions
                (session_id, uploaded_at, session_date, pmt_filename, tov_filename,
                 matched_count, unmatched_pmt, avg_slippage_pts, avg_latency_sec,
                 total_slippage_pnl, total_tov_pnl)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """,
            (session_id, now, session_date, pmt_filename, tov_filename,
             matched, unmatched_pmt, avg_slip, avg_lat, total_slip_pnl, total_pnl),
        )

        # Delete existing trades for this session (idempotent re-upload)
        conn.execute("DELETE FROM execution_trades WHERE session_id = ?", (session_id,))

        conn.executemany(
            """
            INSERT INTO execution_trades
                (session_id, pmt_symbol, tov_symbol, symbol_match, direction,
                 pmt_trade_time, pmt_signal_price,
                 tov_entry_time, tov_entry_price, tov_exit_time, tov_exit_price,
                 tov_qty, tov_pnl, fill_latency_sec, entry_slippage, slippage_pnl)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            [
                (
                    session_id,
                    t.get("pmt_symbol"), t.get("tov_symbol"),
                    int(t.get("symbol_match", False)),
                    t.get("direction"),
                    _ts(t.get("pmt_trade_time")), t.get("pmt_signal_price"),
                    _ts(t.get("tov_entry_time")), t.get("tov_entry_price"),
                    _ts(t.get("tov_exit_time")),  t.get("tov_exit_price"),
                    t.get("tov_qty"), t.get("tov_pnl"),
                    t.get("fill_latency_sec"), t.get("entry_slippage"),
                    t.get("slippage_pnl"),
                )
                for t in trades
            ],
        )

    log.info("[execution_db] saved session %s (%d trades)", session_id, matched)


def get_sessions() -> list[dict[str, Any]]:
    """Return all sessions ordered by session_date desc."""
    with _connect() as conn:
        rows = conn.execute(
            "SELECT * FROM execution_sessions ORDER BY session_date DESC, uploaded_at DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def get_session(session_id: str) -> dict[str, Any] | None:
    """Return session summary + all trades for one session."""
    with _connect() as conn:
        session_row = conn.execute(
            "SELECT * FROM execution_sessions WHERE session_id = ?", (session_id,)
        ).fetchone()

        if not session_row:
            return None

        trade_rows = conn.execute(
            "SELECT * FROM execution_trades WHERE session_id = ? ORDER BY pmt_trade_time",
            (session_id,),
        ).fetchall()

    session = dict(session_row)
    session["trades"] = [dict(r) for r in trade_rows]
    return session


def _ts(val: Any) -> str | None:
    """Coerce a timestamp value to ISO string for storage."""
    if val is None:
        return None
    if hasattr(val, "isoformat"):
        return val.isoformat()
    return str(val)
