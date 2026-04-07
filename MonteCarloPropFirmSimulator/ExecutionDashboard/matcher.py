import logging
import pandas as pd

log = logging.getLogger(__name__)


PMT_TO_TOV_DIRECTION = {'BUY': 'LONG', 'SELL': 'SHORT'}


def match_pmt_to_tradeovate(
    pmt: pd.DataFrame,
    tov: pd.DataFrame,
    tolerance_sec: int = 60,
    require_symbol_match: bool = True,
) -> pd.DataFrame:
    """
    Match each PickMyTrade alert to the closest Tradeovate fill.

    Matching criteria:
      - Direction must match (PMT BUY → TOV LONG, PMT SELL → TOV SHORT)
      - Symbol must match when require_symbol_match=True (avoids cross-contract
        rollover noise, e.g. ESH vs ESM)
      - |tov.entry_time - pmt.trade_time| <= tolerance_sec
      - Closest match wins; each Tradeovate trade used at most once
    """
    # Normalise symbols for comparison: strip trailing digit suffix so
    # ESH6 matches ESH2026, ESM6 matches ESM2026, etc.
    def _root(sym: str) -> str:
        return str(sym).rstrip('0123456789')

    rows = []
    used_tov_idx = set()

    for _, alert in pmt.iterrows():
        tov_direction = PMT_TO_TOV_DIRECTION.get(alert['direction'])
        if tov_direction is None:
            log.warning(f"[MATCH PMT→TOV] Unknown PMT direction '{alert['direction']}', skipping")
            continue

        # Filter Tradeovate to matching direction (and optionally symbol) and unused trades
        mask = (tov['direction'] == tov_direction) & (~tov.index.isin(used_tov_idx))
        if require_symbol_match:
            mask &= tov['symbol'].apply(_root) == _root(alert['symbol'])

        candidates = tov[mask].copy()

        if candidates.empty:
            log.warning(
                f"[MATCH PMT→TOV] No {tov_direction} candidates for "
                f"PMT {alert['direction']} alert @ {alert['trade_time']}"
            )
            continue

        # Match on entry_time (direction-aware, already set in normalizer)
        time_diffs = (candidates['entry_time'] - alert['trade_time']).abs()
        closest_idx = time_diffs.idxmin()
        closest_sec = time_diffs[closest_idx].total_seconds()

        if closest_sec > tolerance_sec:
            log.warning(
                f"[MATCH PMT→TOV] PMT {alert['direction']} @ {alert['trade_time']}: "
                f"closest TOV {tov_direction} fill is {closest_sec:.1f}s away (>{tolerance_sec}s), skipping"
            )
            continue

        used_tov_idx.add(closest_idx)
        fill = candidates.loc[closest_idx]

        rows.append({
            # PMT (signal source)
            'pmt_symbol':      alert['symbol'],
            'direction':       alert['direction'],
            'pmt_trade_time':  alert['trade_time'],
            'pmt_signal_price':alert['signal_price'],
            # Tradeovate (actual fill)
            'tov_symbol':      fill['symbol'],
            'tov_entry_time':  fill['entry_time'],
            'tov_entry_price': fill['entry_price'],
            'tov_exit_time':   fill['exit_time'],
            'tov_exit_price':  fill['exit_price'],
            'tov_buy_price':   fill['buy_price'],
            'tov_sell_price':  fill['sell_price'],
            'tov_qty':         fill['qty'],
            'tov_pnl':         fill['pnl'],
            # Audit: did the symbols match (same contract root)?
            'symbol_match':    _root(alert['symbol']) == _root(fill['symbol']),
        })

    result = pd.DataFrame(rows).reset_index(drop=True)
    log.info(f"[MATCH PMT→TOV] {len(result)}/{len(pmt)} alerts matched")
    return result


# --- TV pipeline kept for future use ---

TV_TO_PMT = {'long': 'BUY', 'short': 'SELL'}


def match_tv_to_pmt(tv: pd.DataFrame, pmt: pd.DataFrame, tolerance_sec: int = 30) -> pd.DataFrame:
    rows = []
    used_pmt_idx = set()

    for _, sig in tv.iterrows():
        pmt_direction = TV_TO_PMT[sig['direction']]
        candidates = pmt[
            (pmt['direction'] == pmt_direction) &
            (~pmt.index.isin(used_pmt_idx))
        ].copy()

        if candidates.empty:
            log.warning(f"[MATCH TV→PMT] No {pmt_direction} candidates for trade {sig['trade_num']} @ {sig['signal_time']}")
            continue

        time_diffs = (candidates['trade_time'] - sig['signal_time']).abs()
        closest_idx = time_diffs.idxmin()
        closest_sec = time_diffs[closest_idx].total_seconds()

        if closest_sec > tolerance_sec:
            log.warning(
                f"[MATCH TV→PMT] trade {sig['trade_num']} @ {sig['signal_time']}: "
                f"closest PMT is {closest_sec:.1f}s away (>{tolerance_sec}s), skipping"
            )
            continue

        used_pmt_idx.add(closest_idx)
        pmt_row = candidates.loc[closest_idx]

        rows.append({
            'trade_num':        sig['trade_num'],
            'direction':        sig['direction'],
            'signal_time':      sig['signal_time'],
            'signal_price':     sig['signal_price'],
            'tv_exit_time':     sig['tv_exit_time'],
            'tv_exit_price':    sig['tv_exit_price'],
            'tv_pnl':           sig['tv_pnl'],
            'pmt_symbol':       pmt_row['symbol'],
            'pmt_trade_time':   pmt_row['trade_time'],
            'pmt_signal_price': pmt_row['signal_price'],
            'pmt_latency_sec':  (pmt_row['trade_time'] - sig['signal_time']).total_seconds(),
        })

    result = pd.DataFrame(rows).reset_index(drop=True)
    log.info(f"[MATCH TV→PMT] {len(result)}/{len(tv)} signals matched")
    return result
