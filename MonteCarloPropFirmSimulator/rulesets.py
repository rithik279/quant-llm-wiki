"""
rulesets.py
===========
Prop firm account ruleset definitions for the Monte Carlo simulator.

Each ruleset is a plain dict consumed by simulate_path() and run_simulations()
in apex_engine_v3_1.  Add new firms/account types here — no engine changes needed.

Available rulesets
------------------
  APEX_50K_LEGACY         — Apex 50K trailing DD, 30% concentration, legacy rules
  APEX_50K_EOD            — Apex 50K EOD, 50% consistency, tiered payouts (new rules)
  ALPHA_FUTURES_50K_ZERO  — Alpha Futures 50K Zero, $2K static DD, 40% consistency

Usage
-----
  from rulesets import APEX_50K_LEGACY, APEX_50K_EOD, ALPHA_FUTURES_50K_ZERO, get_ruleset

  ruleset = get_ruleset("alpha_futures_50k_zero")
  result  = simulate_path(daily_pnl, ruleset=ruleset)
"""

from __future__ import annotations
from typing import Any


# ─────────────────────────────────────────────────────────────────────────────
# APEX 50K LEGACY  (original rules — 30% concentration, $2,500 trailing DD)
# ─────────────────────────────────────────────────────────────────────────────

APEX_50K_LEGACY: dict[str, Any] = {
    "name":               "Apex 50K Legacy",
    "key":                "apex_50k_legacy",

    # Account geometry
    "account_size":       50_000.0,
    "trailing_dd":        2_500.0,
    "trail_stop_level":   50_100.0,    # DD floor locks here and never goes higher
    "payout_threshold":   52_600.0,    # balance must reach this to be eligible

    # Daily caps
    "daily_loss_limit":   -700.0,
    "daily_profit_cap":   1_050.0,

    # Qualifying day
    "green_day_min":      50.0,        # min daily profit to count as green day

    # Payout eligibility
    "min_trading_days":   8,           # total trading days before eligible
    "min_green_days":     5,           # green days required
    "min_payout":         500.0,
    "concentration_rule": 0.30,        # no single day > 30% of total profit
    "consistency_rule":   None,        # legacy uses concentration, not consistency

    # Payout mechanics
    "payout_mode":        "single",    # single payout then stop
    "max_payouts":        1,
    "payout_caps":        [2_000.0],   # max per payout
    "payout_floor_offset": 500.0,      # balance floor = payout_threshold - this

    # After payout
    "dd_resets_after_payout": False,   # DD floor stays at trail_stop_level
}


# ─────────────────────────────────────────────────────────────────────────────
# APEX 50K EOD  (new rules — 50% consistency, tiered payouts, EOD trailing DD)
# ─────────────────────────────────────────────────────────────────────────────

APEX_50K_EOD: dict[str, Any] = {
    "name":               "Apex 50K EOD",
    "key":                "apex_50k_eod",

    # Account geometry
    "account_size":       50_000.0,
    "trailing_dd":        2_000.0,
    "trail_stop_level":   50_100.0,    # safety net floor = account_size + 100; never moves
    "payout_threshold":   52_600.0,    # safety net ($52,100) + min payout ($500)

    # Daily caps
    "daily_loss_limit":   -1_000.0,
    "daily_profit_cap":   1_300.0,     # sim-only: 50% of profit target ($2,600)

    # Qualifying day
    "green_day_min":      250.0,       # each qualifying day must have >= $250 profit

    # Payout eligibility
    "min_trading_days":   0,           # total days don't count — qualifying days do
    "min_green_days":     5,           # must have 5 qualifying days (>= green_day_min each)
    "min_payout":         500.0,
    "concentration_rule": None,        # EOD uses consistency rule, not concentration
    "consistency_rule":   0.50,        # no single day >= 50% of total profit since last payout

    # Payout mechanics
    "payout_mode":        "tiered",    # multiple payouts per account lifecycle
    "max_payouts":        6,
    "payout_caps":        [1_500.0, 1_500.0, 2_000.0, 2_500.0, 2_500.0, 3_000.0],
    "payout_floor_offset": 500.0,      # withdrawable = balance - (trail_stop_level + 100 + offset)

    # After payout
    "dd_resets_after_payout": False,   # DD floor stays at trail_stop_level ($50,100)
}


# ─────────────────────────────────────────────────────────────────────────────
# ALPHA FUTURES 50K ZERO  (static $2K DD, 40% consistency, 5 qualifying days)
# ─────────────────────────────────────────────────────────────────────────────

ALPHA_FUTURES_50K_ZERO: dict[str, Any] = {
    "name":               "Alpha Futures 50K Zero",
    "key":                "alpha_futures_50k_zero",

    # Account geometry
    # Static (non-trailing) $2,000 max drawdown — hard floor at $48,000
    "account_size":       50_000.0,
    "trailing_dd":        2_000.0,
    "trail_stop_level":   48_000.0,   # hard floor = account_size - drawdown; never moves
    "payout_threshold":   48_200.0,   # floor + min qualifying payout ($200)

    # Daily caps
    "daily_loss_limit":   -1_000.0,   # Daily Loss Guard
    "daily_profit_cap":   1_300.0,    # sim-only soft cap

    # Qualifying day
    "green_day_min":      200.0,      # qualifying day = >= $200 profit

    # Payout eligibility
    "min_trading_days":   0,
    "min_green_days":     5,          # 5 qualifying days per payout cycle
    "min_payout":         200.0,
    "concentration_rule": None,
    "consistency_rule":   0.40,       # no single day >= 40% of total profit since last payout

    # Payout mechanics — up to 50% of profit per request, $1,500 max on 50K account
    "payout_mode":        "tiered",   # unlimited repeating payouts
    "max_payouts":        999,
    "payout_caps":        [1_500.0],  # flat $1,500 max per payout (50K account)
    "payout_floor_offset": 200.0,     # min payout = $200

    # After payout
    "dd_resets_after_payout": False,  # DD floor stays fixed at $48,000
}


# ─────────────────────────────────────────────────────────────────────────────
# Registry + helper
# ─────────────────────────────────────────────────────────────────────────────

_REGISTRY: dict[str, dict] = {
    r["key"]: r for r in [APEX_50K_LEGACY, APEX_50K_EOD, ALPHA_FUTURES_50K_ZERO]
}


def get_ruleset(key: str) -> dict[str, Any]:
    """
    Retrieve a ruleset by key string.

    Parameters
    ----------
    key : str
        One of: "apex_50k_legacy", "apex_50k_eod", "alpha_futures_50k_zero"

    Raises
    ------
    KeyError if the key is not found.
    """
    key = key.strip().lower()
    if key not in _REGISTRY:
        available = ", ".join(_REGISTRY.keys())
        raise KeyError(f"Unknown ruleset '{key}'. Available: {available}")
    return _REGISTRY[key]


def list_rulesets() -> list[dict[str, str]]:
    """Return a list of {key, name} for all registered rulesets."""
    return [{"key": r["key"], "name": r["name"]} for r in _REGISTRY.values()]
