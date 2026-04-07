"""
journal_db.py
=============
Postgres persistence layer for the trading journal (via Supabase).

Tables
------
  journal_accounts  — one row per tracked account
  journal_trades    — one row per Tradeovate trade
  journal_uploads   — one row per upload batch (supports future agent automation)

Design goals
------------
  • account_id from Tradeovate drives multi-account support from day one
  • upload_id links every trade to the batch that created it (agent-friendly)
  • Re-upload replaces all trades for the affected (account_id, date) pairs atomically
  • trade_date stored as TEXT 'YYYY-MM-DD' for easy calendar queries
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from db import get_conn, rows_as_dicts

log = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Initialisation
# ─────────────────────────────────────────────────────────────────────────────

def init_db() -> None:
    """Create all journal tables if they don't exist. Safe to call on every startup."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS journal_accounts (
                    account_id   TEXT PRIMARY KEY,
                    account_name TEXT,
                    created_at   TEXT NOT NULL
                )
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS journal_uploads (
                    upload_id    TEXT PRIMARY KEY,
                    account_id   TEXT NOT NULL,
                    uploaded_at  TEXT NOT NULL,
                    filename     TEXT,
                    trade_count  INTEGER NOT NULL DEFAULT 0,
                    date_from    TEXT,
                    date_to      TEXT
                )
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS journal_trades (
                    id            SERIAL PRIMARY KEY,
                    upload_id     TEXT NOT NULL REFERENCES journal_uploads(upload_id),
                    account_id    TEXT NOT NULL,
                    trade_date    TEXT NOT NULL,
                    symbol        TEXT,
                    direction     TEXT,
                    entry_time    TEXT,
                    entry_price   REAL,
                    exit_time     TEXT,
                    exit_price    REAL,
                    qty           INTEGER,
                    pnl           REAL,
                    duration_sec  REAL
                )
            """)

            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_journal_trades_account_date
                    ON journal_trades (account_id, trade_date)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_journal_trades_upload
                    ON journal_trades (upload_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_journal_uploads_account
                    ON journal_uploads (account_id)
            """)

    log.info("[journal_db] Postgres tables ready")


# ─────────────────────────────────────────────────────────────────────────────
# Accounts
# ─────────────────────────────────────────────────────────────────────────────

def upsert_account(account_id: str, account_name: Optional[str] = None) -> None:
    now = datetime.now(timezone.utc).isoformat()
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO journal_accounts (account_id, account_name, created_at)
                VALUES (%s, %s, %s)
                ON CONFLICT (account_id) DO UPDATE SET
                    account_name = COALESCE(EXCLUDED.account_name, journal_accounts.account_name)
                """,
                (account_id, account_name, now),
            )


def list_accounts() -> List[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM journal_accounts ORDER BY created_at DESC")
            return rows_as_dicts(cur)


# ─────────────────────────────────────────────────────────────────────────────
# Trades — save (upsert by date range)
# ─────────────────────────────────────────────────────────────────────────────

def save_trades(
    account_id: str,
    trades: List[Dict[str, Any]],
    filename: str = "",
) -> str:
    """
    Persist a batch of trades for an account.

    For each unique trade_date in `trades`, any existing trades for
    (account_id, trade_date) are deleted before the new rows are inserted.
    This makes re-upload idempotent for the covered dates.

    Returns the upload_id.
    """
    if not trades:
        return ""

    upload_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()

    dates = sorted({t["trade_date"] for t in trades})
    date_from = dates[0]
    date_to   = dates[-1]

    with get_conn() as conn:
        with conn.cursor() as cur:
            # Register upload batch
            cur.execute(
                """
                INSERT INTO journal_uploads
                    (upload_id, account_id, uploaded_at, filename, trade_count, date_from, date_to)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (upload_id, account_id, now, filename, len(trades), date_from, date_to),
            )

            # Delete existing trades for affected dates (idempotent re-upload)
            for d in dates:
                cur.execute(
                    "DELETE FROM journal_trades WHERE account_id = %s AND trade_date = %s",
                    (account_id, d),
                )

            # Insert new trades
            cur.executemany(
                """
                INSERT INTO journal_trades
                    (upload_id, account_id, trade_date, symbol, direction,
                     entry_time, entry_price, exit_time, exit_price,
                     qty, pnl, duration_sec)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                [
                    (
                        upload_id,
                        account_id,
                        t["trade_date"],
                        t.get("symbol"),
                        t.get("direction"),
                        t.get("entry_time"),
                        t.get("entry_price"),
                        t.get("exit_time"),
                        t.get("exit_price"),
                        t.get("qty"),
                        t.get("pnl"),
                        t.get("duration_sec"),
                    )
                    for t in trades
                ],
            )

    log.info("[journal_db] upload %s: %d trades for account %s (%s → %s)",
             upload_id, len(trades), account_id, date_from, date_to)
    return upload_id


# ─────────────────────────────────────────────────────────────────────────────
# Calendar query — daily P&L for a month
# ─────────────────────────────────────────────────────────────────────────────

def get_calendar(account_id: str, year: int, month: int) -> List[Dict[str, Any]]:
    """
    Return one row per trading day in the given month for the account.
    Each row: { trade_date, total_pnl, trade_count, win_count, loss_count }
    """
    month_str = f"{year:04d}-{month:02d}"
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    trade_date,
                    SUM(pnl)                                     AS total_pnl,
                    COUNT(*)                                     AS trade_count,
                    COUNT(*) FILTER (WHERE pnl > 0)              AS win_count,
                    COUNT(*) FILTER (WHERE pnl <= 0)             AS loss_count
                FROM journal_trades
                WHERE account_id = %s
                  AND trade_date LIKE %s
                GROUP BY trade_date
                ORDER BY trade_date
                """,
                (account_id, f"{month_str}-%"),
            )
            return rows_as_dicts(cur)


# ─────────────────────────────────────────────────────────────────────────────
# Day detail — all trades for a specific date
# ─────────────────────────────────────────────────────────────────────────────

def get_day_trades(account_id: str, date: str) -> List[Dict[str, Any]]:
    """Return all trades for (account_id, date) ordered by entry_time."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM journal_trades
                WHERE account_id = %s AND trade_date = %s
                ORDER BY entry_time
                """,
                (account_id, date),
            )
            return rows_as_dicts(cur)


# ─────────────────────────────────────────────────────────────────────────────
# Summary stats — account-level aggregates
# ─────────────────────────────────────────────────────────────────────────────

def get_account_stats(account_id: str) -> Dict[str, Any]:
    """Return lifetime aggregate stats for an account."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    COUNT(*)                        AS total_trades,
                    SUM(pnl)                        AS total_pnl,
                    COUNT(*) FILTER (WHERE pnl > 0) AS wins,
                    COUNT(*) FILTER (WHERE pnl <= 0) AS losses,
                    AVG(pnl)                        AS avg_pnl,
                    MAX(pnl)                        AS best_trade,
                    MIN(pnl)                        AS worst_trade,
                    COUNT(DISTINCT trade_date)      AS trading_days
                FROM journal_trades
                WHERE account_id = %s
                """,
                (account_id,),
            )
            rows = rows_as_dicts(cur)
    return rows[0] if rows else {}
