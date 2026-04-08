import logging
from typing import Union
import pandas as pd

log = logging.getLogger(__name__)

# Accept either a file path string or a file-like object (e.g. io.StringIO from web upload)
PathOrBuffer = Union[str, object]


def normalize_tradingview(path: PathOrBuffer) -> pd.DataFrame:
    """
    Normalize TradingView CSV into one row per trade.
    Groups Entry/Exit rows by Trade # and pivots to wide format.
    Times are already in EST.
    """
    df = pd.read_csv(path, encoding='utf-8-sig')

    required = {'Trade #', 'Type', 'Date and time', 'Price USD', 'Net P&L USD', 'Signal'}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"TradingView CSV missing columns: {missing}")

    entry_mask = df['Type'].str.contains('Entry', case=False, na=False)
    exit_mask  = df['Type'].str.contains('Exit',  case=False, na=False)

    entry = df[entry_mask][['Trade #', 'Date and time', 'Price USD', 'Net P&L USD', 'Signal']].copy()
    exit_ = df[exit_mask][['Trade #', 'Date and time', 'Price USD']].copy()

    entry = entry.rename(columns={
        'Trade #':      'trade_num',
        'Date and time':'signal_time',
        'Price USD':    'signal_price',
        'Net P&L USD':  'tv_pnl',
    })
    exit_ = exit_.rename(columns={
        'Trade #':      'trade_num',
        'Date and time':'tv_exit_time',
        'Price USD':    'tv_exit_price',
    })

    entry['direction']    = entry['Signal'].str.lower().apply(
        lambda s: 'long' if 'long' in s else 'short'
    )
    entry['signal_time']  = pd.to_datetime(entry['signal_time'])
    entry['signal_price'] = entry['signal_price'].astype(float)
    entry['tv_pnl'] = (
        entry['tv_pnl']
        .astype(str)
        .str.strip()
        .apply(lambda v: '-' + v[1:-1] if v.startswith('(') and v.endswith(')') else v)
        .astype(float)
    )

    exit_['tv_exit_time']  = pd.to_datetime(exit_['tv_exit_time'])
    exit_['tv_exit_price'] = exit_['tv_exit_price'].astype(float)

    tv = entry[['trade_num', 'direction', 'signal_time', 'signal_price', 'tv_pnl']].merge(
        exit_[['trade_num', 'tv_exit_time', 'tv_exit_price']],
        on='trade_num',
        how='inner',
    )

    log.info(f"[TV]  {len(tv)} trades normalized")
    return tv.reset_index(drop=True)


def normalize_pickmytrade(path: PathOrBuffer) -> pd.DataFrame:
    """
    Normalize PickMyTrade CSV.
    trade_time = server_date_time converted from UTC to EST (−4h).
    This is the precise millisecond timestamp of when PMT received the alert.
    """
    df = pd.read_csv(path)

    required = {'symbol', 'buy_sell', 'server_date_time', 'user_price'}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"PickMyTrade CSV missing columns: {missing}")

    pmt = pd.DataFrame()
    pmt['symbol']       = df['symbol']
    pmt['direction']    = df['buy_sell'].str.upper()
    pmt['trade_time']   = pd.to_datetime(df['server_date_time']) - pd.Timedelta(hours=4)
    pmt['signal_price'] = df['user_price'].astype(float)

    log.info(f"[PMT] {len(pmt)} alerts normalized")
    return pmt.reset_index(drop=True)


def normalize_tradeovate(path: PathOrBuffer) -> pd.DataFrame:
    """
    Normalize Tradeovate Performance CSV.
    Times are already in EST. PnL stripped of $ sign.

    Direction is inferred from timestamps:
      - bought_time < sold_time  → LONG  (buy to open, sell to close)
      - sold_time   < bought_time → SHORT (sell to open, buy to close)

    entry_time / entry_price / exit_time / exit_price are set accordingly.
    """
    df = pd.read_csv(path)

    required = {'symbol', 'qty', 'buyPrice', 'sellPrice', 'pnl', 'boughtTimestamp', 'soldTimestamp'}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Tradeovate CSV missing columns: {missing}")

    tov = pd.DataFrame()
    tov['symbol']      = df['symbol']
    tov['qty']         = df['qty'].astype(int)
    tov['buy_price']   = df['buyPrice'].astype(float)
    tov['sell_price']  = df['sellPrice'].astype(float)
    tov['pnl']         = (
        df['pnl']
        .astype(str)
        .str.replace('$', '', regex=False)
        .str.replace(',', '', regex=False)
        .astype(float)
    )
    tov['bought_time'] = pd.to_datetime(df['boughtTimestamp'])
    tov['sold_time']   = pd.to_datetime(df['soldTimestamp'])

    # Infer direction from which timestamp comes first
    tov['direction'] = tov.apply(
        lambda r: 'LONG' if r['bought_time'] <= r['sold_time'] else 'SHORT', axis=1
    )

    # Direction-aware entry/exit
    tov['entry_time']  = tov.apply(lambda r: r['bought_time'] if r['direction'] == 'LONG' else r['sold_time'],  axis=1)
    tov['entry_price'] = tov.apply(lambda r: r['buy_price']   if r['direction'] == 'LONG' else r['sell_price'], axis=1)
    tov['exit_time']   = tov.apply(lambda r: r['sold_time']   if r['direction'] == 'LONG' else r['bought_time'],  axis=1)
    tov['exit_price']  = tov.apply(lambda r: r['sell_price']  if r['direction'] == 'LONG' else r['buy_price'],  axis=1)

    log.info(f"[TOV] {len(tov)} trades normalized  (LONG: {(tov['direction']=='LONG').sum()}, SHORT: {(tov['direction']=='SHORT').sum()})")
    return tov.reset_index(drop=True)
