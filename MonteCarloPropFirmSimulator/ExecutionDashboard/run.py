"""
Execution Quality Analysis: PickMyTrade → Tradeovate
-----------------------------------------------------
Flow: TradingView alert → PickMyTrade (receives alert) → Tradeovate (fills order)

PMT is the signal source (trade_time = alert received, signal_price = alert price).
Tradeovate is the actual execution.

Measures:
  - fill_latency_sec:  time from PMT alert receipt → Tradeovate entry fill
  - entry_slippage:    Tradeovate fill price vs PMT signal price
  - tov_pnl:          actual P&L from Tradeovate

Output: execution_comparison.csv
"""

import logging
import os

from normalizers import normalize_pickmytrade, normalize_tradeovate
from matcher import match_pmt_to_tradeovate
from metrics import compute_metrics, select_output_columns

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
log = logging.getLogger(__name__)

BASE = os.path.dirname(os.path.abspath(__file__))

PMT_PATH    = os.path.join(BASE, 'Alerts_data_PickmyTrade_raw.csv')
TOV_PATH    = os.path.join(BASE, 'Performance.csv')
OUTPUT_PATH = os.path.join(BASE, 'execution_comparison.csv')

# PMT alert → Tradeovate fill: should be near-instant (sub-second to ~60s)
PMT_TOV_TOLERANCE_SEC = 60


def main():
    log.info("=== Normalizing ===")
    pmt = normalize_pickmytrade(PMT_PATH)
    tov = normalize_tradeovate(TOV_PATH)

    log.info("=== Matching PMT → Tradeovate ===")
    matched = match_pmt_to_tradeovate(pmt, tov, tolerance_sec=PMT_TOV_TOLERANCE_SEC)

    if matched.empty:
        log.error("No matches found. Check tolerances or data alignment.")
        return

    log.info("=== Computing metrics ===")
    result = compute_metrics(matched)
    output = select_output_columns(result)

    output.to_csv(OUTPUT_PATH, index=False)
    log.info(f"=== Saved → {OUTPUT_PATH} ({len(output)} rows) ===")

    _print_summary(output)


def _print_summary(df):
    log.info("")
    log.info("=================== SUMMARY ===================")
    log.info(f"  Matched trades:        {len(df)}")
    log.info(f"  Avg fill latency:      {df['fill_latency_sec'].mean():.3f}s")
    log.info(f"  Max fill latency:      {df['fill_latency_sec'].max():.3f}s")
    log.info(f"  Min fill latency:      {df['fill_latency_sec'].min():.3f}s")
    log.info(f"  Avg entry slippage:    {df['entry_slippage'].mean():.4f} pts")
    log.info(f"  Total entry slippage:  {df['entry_slippage'].sum():.4f} pts")
    log.info(f"  Total P&L (Tov):       ${df['tov_pnl'].sum():.2f}")
    log.info("================================================")


if __name__ == '__main__':
    main()
