"""
execution_db.py
===============
Postgres persistence layer for execution quality sessions and trades (via Supabase).

Tables
------
  execution_sessions  — one row per uploaded daily session
  execution_trades    — one row per matched PMT→Tradeovate trade
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from db import get_conn, rows_as_dicts

log = logging.getLogger(__name__)


def init_db() -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS execution_sessions (
                    session_id         TEXT PRIMARY KEY,
                    uploaded_at        TEXT NOT NULL,
                    session_date       TEXT NOT NULL,
                    pmt_filename       TEXT,
                    tov_filename       TEXT,
                    matched_count      INTEGER NOT NULL DEFAULT 0,
                    unmatched_pmt      INTEGER NOT NULL DEFAULT 0,
                    avg_slippage_pts   REAL,
                    avg_latency_sec    REAL,
                    total_slippage_pnl REAL,
                    total_tov_pnl      REAL
                )
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS execution_trades (
                    id               SERIAL PRIMARY KEY,
                    session_id       TEXT NOT NULL REFERENCES execution_sessions(session_id),
                    pmt_symbol       TEXT,
                    tov_symbol       TEXT,
                    symbol_match     BOOLEAN,
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
                )
            """)

            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_exec_trades_session
                    ON execution_trades(session_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_exec_sessions_date
                    ON execution_sessions(session_date)
            """)

    log.info("[execution_db] Postgres tables ready")


def save_session(
    session_id: str,
    session_date: str,
    pmt_filename: str,
    tov_filename: str,
    trades: list[dict[str, Any]],
    unmatched_pmt: int = 0,
) -> None:
    now = datetime.now(timezone.utc).isoformat()
    n = len(trades)

    avg_slip       = sum(t["entry_slippage"] for t in trades) / n if n else None
    avg_lat        = sum(t["fill_latency_sec"] for t in trades) / n if n else None
    total_slip_pnl = sum(t["slippage_pnl"] for t in trades) if n else None
    total_pnl      = sum(t["tov_pnl"] for t in trades) if n else None

    with get_conn() as conn:
        with conn.cursor() as cur:
            # Upsert session
            cur.execute(
                """
                INSERT INTO execution_sessions
                    (session_id, uploaded_at, session_date, pmt_filename, tov_filename,
                     matched_count, unmatched_pmt, avg_slippage_pts, avg_latency_sec,
                     total_slippage_pnl, total_tov_pnl)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (session_id) DO UPDATE SET
                    uploaded_at=EXCLUDED.uploaded_at,
                    matched_count=EXCLUDED.matched_count,
                    unmatched_pmt=EXCLUDED.unmatched_pmt,
                    avg_slippage_pts=EXCLUDED.avg_slippage_pts,
                    avg_latency_sec=EXCLUDED.avg_latency_sec,
                    total_slippage_pnl=EXCLUDED.total_slippage_pnl,
                    total_tov_pnl=EXCLUDED.total_tov_pnl
                """,
                (session_id, now, session_date, pmt_filename, tov_filename,
                 n, unmatched_pmt, avg_slip, avg_lat, total_slip_pnl, total_pnl),
            )

            # Replace trades for this session
            cur.execute("DELETE FROM execution_trades WHERE session_id = %s", (session_id,))

            cur.executemany(
                """
                INSERT INTO execution_trades
                    (session_id, pmt_symbol, tov_symbol, symbol_match, direction,
                     pmt_trade_time, pmt_signal_price,
                     tov_entry_time, tov_entry_price, tov_exit_time, tov_exit_price,
                     tov_qty, tov_pnl, fill_latency_sec, entry_slippage, slippage_pnl)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                [
                    (
                        session_id,
                        t.get("pmt_symbol"),    t.get("tov_symbol"),
                        t.get("symbol_match"),  t.get("direction"),
                        _ts(t.get("pmt_trade_time")), t.get("pmt_signal_price"),
                        _ts(t.get("tov_entry_time")), t.get("tov_entry_price"),
                        _ts(t.get("tov_exit_time")),  t.get("tov_exit_price"),
                        t.get("tov_qty"),   t.get("tov_pnl"),
                        t.get("fill_latency_sec"), t.get("entry_slippage"),
                        t.get("slippage_pnl"),
                    )
                    for t in trades
                ],
            )

    log.info("[execution_db] saved session %s (%d trades)", session_id, n)


def get_sessions() -> list[dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM execution_sessions ORDER BY session_date DESC, uploaded_at DESC"
            )
            return rows_as_dicts(cur)


def get_session(session_id: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM execution_sessions WHERE session_id = %s",
                (session_id,),
            )
            sessions = rows_as_dicts(cur)
            if not sessions:
                return None

            cur.execute(
                "SELECT * FROM execution_trades WHERE session_id = %s ORDER BY pmt_trade_time",
                (session_id,),
            )
            trades = rows_as_dicts(cur)

    session = sessions[0]
    session["trades"] = trades
    return session


def _ts(val: Any) -> str | None:
    if val is None:
        return None
    if hasattr(val, "isoformat"):
        return val.isoformat()
    return str(val)
