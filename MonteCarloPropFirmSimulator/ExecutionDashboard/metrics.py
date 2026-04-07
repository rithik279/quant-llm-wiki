import re
import pandas as pd

# Dollar value per 1 point move, per contract
# slippage_pnl = qty × slippage_pts × POINT_VALUES[root_symbol]
POINT_VALUES: dict[str, float] = {
    'ES':  50.0,    # E-mini S&P 500  — $12.50/tick (0.25pt tick)
    'MES': 5.0,     # Micro E-mini S&P — $1.25/tick
    'NQ':  20.0,    # E-mini Nasdaq   — $5.00/tick (0.25pt tick)
    'MNQ': 2.0,     # Micro E-mini NQ — $0.50/tick
    'YM':  5.0,     # E-mini Dow      — $5.00/tick (1pt tick) ✓ user confirmed
    'MYM': 0.5,     # Micro E-mini Dow
    'RTY': 50.0,    # E-mini Russell  — $5.00/tick (0.10pt tick)
    'M2K': 5.0,     # Micro Russell
}

# Futures month codes used to strip contract suffix
_MONTH_CODES = 'FGHJKMNQUVXZ'


def get_root_symbol(symbol: str) -> str:
    """ESM2026 → ES, ESH6 → ES, YMH6 → YM, NQ1! → NQ"""
    s = str(symbol).upper().strip()
    s = re.sub(rf'[{_MONTH_CODES}]\d+[!]?$', '', s)   # strip month code + year
    s = re.sub(r'\d+[!]?$', '', s)                      # strip bare digits / !
    return s


def get_point_value(symbol: str) -> float:
    return POINT_VALUES.get(get_root_symbol(symbol), 50.0)


def compute_metrics(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # --- Fill latency: PMT alert receipt → Tradeovate entry fill ---
    df['fill_latency_sec'] = (
        df['tov_entry_time'] - df['pmt_trade_time']
    ).dt.total_seconds()

    # --- Entry slippage (points) ---
    # LONG:  tov_entry_price − pmt_signal_price  (+ = paid more = bad)
    # SHORT: pmt_signal_price − tov_entry_price  (+ = sold less = bad)
    df['entry_slippage'] = df.apply(
        lambda r: r['tov_entry_price'] - r['pmt_signal_price'] if r['direction'] == 'LONG'
             else r['pmt_signal_price'] - r['tov_entry_price'],
        axis=1,
    )

    # --- Slippage P&L cost ($) ---
    # Positive = money lost to slippage; negative = favorable fill
    df['slippage_pnl'] = df.apply(
        lambda r: r['tov_qty'] * r['entry_slippage'] * get_point_value(r['pmt_symbol']),
        axis=1,
    )

    return df


OUTPUT_COLUMNS = [
    'pmt_symbol',
    'tov_symbol',
    'symbol_match',
    'direction',
    'pmt_trade_time',
    'pmt_signal_price',
    'tov_entry_time',
    'tov_entry_price',
    'tov_exit_time',
    'tov_exit_price',
    'tov_qty',
    'tov_pnl',
    'fill_latency_sec',
    'entry_slippage',
    'slippage_pnl',
]


def select_output_columns(df: pd.DataFrame) -> pd.DataFrame:
    cols = [c for c in OUTPUT_COLUMNS if c in df.columns]
    return df[cols]
