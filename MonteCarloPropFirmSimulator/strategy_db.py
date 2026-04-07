"""
strategy_db.py
==============
Postgres-backed strategy registry for PassPlan (via Supabase).

Public API — Strategies
-----------------------
  initialize_db()
  insert_strategy(id, filename, path, uploaded_at, file_hash)
  get_strategy(strategy_id)
  find_by_hash(file_hash)
  list_strategies(source=None)
  delete_strategy(strategy_id)
  migrate_from_json(registry_path)

Public API — Leaderboard
------------------------
  insert_simulation_result(...)
  get_leaderboard(simulation_type, metric, limit)
  get_strategy_performance(strategy_id)
  delete_simulation_results(strategy_id)

Public API — Strategy Features
------------------------------
  insert_strategy_features(strategy_id, features)
  get_strategy_features(strategy_id)
  list_all_strategy_features()
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from db import get_conn, rows_as_dicts

log = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def infer_strategy_source(strategy_id: str) -> str:
    if strategy_id.startswith("mt5_"):
        return "mt5"
    if strategy_id.startswith("ninjatrader_"):
        return "ninjatrader"
    return "tradingview"


def _attach_source(row: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(row)
    out["source"] = infer_strategy_source(str(out.get("strategy_id", "")))
    return out


# ─────────────────────────────────────────────────────────────────────────────
# Initialisation
# ─────────────────────────────────────────────────────────────────────────────

def initialize_db() -> None:
    """Create all tables if they don't exist. Safe to call on every startup."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS strategies (
                    strategy_id TEXT PRIMARY KEY,
                    filename    TEXT NOT NULL,
                    path        TEXT NOT NULL,
                    uploaded_at TEXT NOT NULL,
                    file_hash   TEXT
                )
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS simulation_results (
                    id                       SERIAL PRIMARY KEY,
                    strategy_id              TEXT    NOT NULL,
                    simulation_type          TEXT    NOT NULL,
                    pass_probability         REAL,
                    fail_probability         REAL,
                    expected_resets          REAL,
                    expected_cost            REAL,
                    expected_monthly_payout  REAL,
                    max_drawdown             REAL,
                    sharpe                   REAL,
                    profit_factor            REAL,
                    num_simulations          INTEGER,
                    created_at               TEXT    NOT NULL,
                    recent_pass_probability  REAL,
                    probability_delta        REAL,
                    recency_status           TEXT
                )
            """)

            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_simres_strategy
                    ON simulation_results (strategy_id)
            """)
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_simres_type
                    ON simulation_results (simulation_type)
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS strategy_features (
                    strategy_id      TEXT PRIMARY KEY,
                    num_trades       INTEGER,
                    win_rate         REAL,
                    avg_win          REAL,
                    avg_loss         REAL,
                    rr_ratio         REAL,
                    expectancy       REAL,
                    profit_factor    REAL,
                    std_dev          REAL,
                    variance         REAL,
                    skew             REAL,
                    kurtosis         REAL,
                    max_drawdown     REAL,
                    max_win_streak   INTEGER,
                    max_loss_streak  INTEGER,
                    created_at       TEXT NOT NULL
                )
            """)

    log.info("[strategy_db] Postgres tables ready")


# ─────────────────────────────────────────────────────────────────────────────
# Strategies CRUD
# ─────────────────────────────────────────────────────────────────────────────

def insert_strategy(
    strategy_id: str,
    filename: str,
    path: str,
    uploaded_at: str,
    file_hash: Optional[str] = None,
) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO strategies (strategy_id, filename, path, uploaded_at, file_hash)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (strategy_id, filename, path, uploaded_at, file_hash),
            )


def get_strategy(strategy_id: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM strategies WHERE strategy_id = %s",
                (strategy_id,),
            )
            rows = rows_as_dicts(cur)
    return _attach_source(rows[0]) if rows else None


def find_by_hash(file_hash: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM strategies WHERE file_hash = %s LIMIT 1",
                (file_hash,),
            )
            rows = rows_as_dicts(cur)
    return _attach_source(rows[0]) if rows else None


def find_by_hash_and_source(file_hash: str, source: str) -> Optional[Dict[str, Any]]:
    rows = list_strategies(source=source)
    for row in rows:
        if row.get("file_hash") == file_hash:
            return row
    return None


def list_strategies(source: Optional[str] = None) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM strategies ORDER BY uploaded_at DESC")
            rows = rows_as_dicts(cur)
    out = [_attach_source(r) for r in rows]
    if not source:
        return out
    source_norm = source.strip().lower()
    return [r for r in out if r.get("source") == source_norm]


def delete_strategy(strategy_id: str) -> bool:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM strategies WHERE strategy_id = %s",
                (strategy_id,),
            )
            return cur.rowcount > 0


# ─────────────────────────────────────────────────────────────────────────────
# Leaderboard — simulation results
# ─────────────────────────────────────────────────────────────────────────────

_METRIC_CONFIG: Dict[str, tuple] = {
    "pass_probability":         ("pass_probability",         True),
    "expected_monthly_payout":  ("expected_monthly_payout",  True),
    "sharpe":                   ("sharpe",                   True),
    "profit_factor":            ("profit_factor",            True),
    "max_drawdown":             ("max_drawdown",             False),
    "recent_pass_probability":  ("recent_pass_probability",  True),
    "probability_delta":        ("probability_delta",        True),
}

_VALID_SIM_TYPES = {"until_payout", "full_period", "batch", "multi_account"}


def insert_simulation_result(
    strategy_id: str,
    simulation_type: str,
    *,
    pass_probability: Optional[float] = None,
    fail_probability: Optional[float] = None,
    expected_resets: Optional[float] = None,
    expected_cost: Optional[float] = None,
    expected_monthly_payout: Optional[float] = None,
    max_drawdown: Optional[float] = None,
    sharpe: Optional[float] = None,
    profit_factor: Optional[float] = None,
    num_simulations: Optional[int] = None,
    recent_pass_probability: Optional[float] = None,
    probability_delta: Optional[float] = None,
    recency_status: Optional[str] = None,
    created_at: Optional[str] = None,
) -> int:
    if created_at is None:
        created_at = datetime.now(timezone.utc).isoformat()

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO simulation_results (
                    strategy_id, simulation_type,
                    pass_probability, fail_probability,
                    expected_resets, expected_cost,
                    expected_monthly_payout, max_drawdown,
                    sharpe, profit_factor,
                    num_simulations, created_at,
                    recent_pass_probability, probability_delta, recency_status
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id
                """,
                (
                    strategy_id, simulation_type,
                    pass_probability, fail_probability,
                    expected_resets, expected_cost,
                    expected_monthly_payout, max_drawdown,
                    sharpe, profit_factor,
                    num_simulations, created_at,
                    recent_pass_probability, probability_delta, recency_status,
                ),
            )
            return cur.fetchone()[0]


def get_leaderboard(
    simulation_type: str = "until_payout",
    metric: str = "pass_probability",
    limit: int = 20,
) -> List[Dict[str, Any]]:
    if simulation_type not in _VALID_SIM_TYPES:
        return []
    if metric not in _METRIC_CONFIG:
        return []

    col, desc = _METRIC_CONFIG[metric]
    direction = "DESC" if desc else "ASC"

    # Column names are whitelisted above — safe to interpolate
    sql = f"""
        SELECT
            s.strategy_id, s.filename,
            r.pass_probability, r.fail_probability,
            r.expected_monthly_payout, r.max_drawdown,
            r.sharpe, r.profit_factor,
            r.num_simulations, r.simulation_type, r.created_at,
            r.recent_pass_probability, r.probability_delta, r.recency_status
        FROM simulation_results r
        JOIN strategies s ON r.strategy_id = s.strategy_id
        WHERE r.simulation_type = %s
          AND r.{col} IS NOT NULL
          AND r.id = (
              SELECT id FROM simulation_results r2
              WHERE r2.strategy_id = r.strategy_id
                AND r2.simulation_type = r.simulation_type
              ORDER BY r2.id DESC LIMIT 1
          )
        ORDER BY r.{col} {direction}
        LIMIT %s
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (simulation_type, limit))
            rows = rows_as_dicts(cur)

    return [{**r, "rank": i + 1} for i, r in enumerate(rows)]


def get_strategy_performance(strategy_id: str) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM simulation_results WHERE strategy_id = %s ORDER BY id DESC",
                (strategy_id,),
            )
            return rows_as_dicts(cur)


def delete_simulation_results(strategy_id: str) -> int:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM simulation_results WHERE strategy_id = %s",
                (strategy_id,),
            )
            return cur.rowcount


# ─────────────────────────────────────────────────────────────────────────────
# Strategy features
# ─────────────────────────────────────────────────────────────────────────────

def insert_strategy_features(strategy_id: str, features: Dict[str, Any]) -> None:
    created_at = datetime.now(timezone.utc).isoformat()
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO strategy_features
                    (strategy_id, num_trades, win_rate, avg_win, avg_loss,
                     rr_ratio, expectancy, profit_factor,
                     std_dev, variance, skew, kurtosis,
                     max_drawdown, max_win_streak, max_loss_streak, created_at)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON CONFLICT (strategy_id) DO UPDATE SET
                    num_trades=EXCLUDED.num_trades, win_rate=EXCLUDED.win_rate,
                    avg_win=EXCLUDED.avg_win, avg_loss=EXCLUDED.avg_loss,
                    rr_ratio=EXCLUDED.rr_ratio, expectancy=EXCLUDED.expectancy,
                    profit_factor=EXCLUDED.profit_factor, std_dev=EXCLUDED.std_dev,
                    variance=EXCLUDED.variance, skew=EXCLUDED.skew,
                    kurtosis=EXCLUDED.kurtosis, max_drawdown=EXCLUDED.max_drawdown,
                    max_win_streak=EXCLUDED.max_win_streak,
                    max_loss_streak=EXCLUDED.max_loss_streak,
                    created_at=EXCLUDED.created_at
                """,
                (
                    strategy_id,
                    features.get("num_trades"), features.get("win_rate"),
                    features.get("avg_win"),    features.get("avg_loss"),
                    features.get("rr_ratio"),   features.get("expectancy"),
                    features.get("profit_factor"), features.get("std_dev"),
                    features.get("variance"),   features.get("skew"),
                    features.get("kurtosis"),   features.get("max_drawdown"),
                    features.get("max_win_streak"), features.get("max_loss_streak"),
                    created_at,
                ),
            )
    log.info("[strategy_db] features stored for %s", strategy_id)


def get_strategy_features(strategy_id: str) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM strategy_features WHERE strategy_id = %s",
                (strategy_id,),
            )
            rows = rows_as_dicts(cur)
    return rows[0] if rows else None


def list_all_strategy_features() -> List[Dict[str, Any]]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM strategy_features ORDER BY created_at DESC")
            return rows_as_dicts(cur)


# ─────────────────────────────────────────────────────────────────────────────
# One-shot migration from legacy registry.json (local dev only)
# ─────────────────────────────────────────────────────────────────────────────

def migrate_from_json(registry_path: Path) -> None:
    if not registry_path.exists():
        return
    backup_path = registry_path.parent / "registry_migrated_backup.json"
    if backup_path.exists():
        return

    log.info("[strategy_db] migrating %s → Postgres …", registry_path)
    try:
        with registry_path.open(encoding="utf-8") as fh:
            data: Dict[str, Any] = json.load(fh)
    except Exception as exc:
        log.warning("[strategy_db] could not read registry.json (%s) — skipping", exc)
        return

    migrated = 0
    for strategy_id, entry in data.items():
        if get_strategy(strategy_id) is not None:
            continue
        try:
            insert_strategy(
                strategy_id=strategy_id,
                filename=entry.get("filename", "unknown.csv"),
                path=entry.get("path", ""),
                uploaded_at=entry.get("uploaded_at", ""),
                file_hash=entry.get("file_hash"),
            )
            migrated += 1
        except Exception as exc:
            log.warning("[strategy_db] skipping %s (%s)", strategy_id, exc)

    registry_path.rename(backup_path)
    log.info("[strategy_db] migrated %d entries", migrated)
