---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 2
source_files: [raw/books/Quantitative Trading.pdf, raw/books/AlgorithmicTradingChan.pdf]
related_pages: [Chan-Chapter2-MeanReversion, Chan-Chapter6-Momentum, Chan-RiskManagement, QTB-Backtesting-Start, Regime-modeling, Agilith-Alpha-Stack-System]
status: active
tags: [chan, mean-reversion, momentum, regime-switching, cointegration, factor-models, stationarity]
---

# QTB Ch7: Special Topics in Quantitative Trading

Most important chapter in QTB. Covers advanced concepts that other books skip.

## MR vs Momentum: When Each Works

**Mean Reversion:**
- Stock prices tend to revert to some reference price
- Works when expected earnings unchanged
- Short-term reversal: profitable for decades (Khandani & Lo 2007)
- Risk: Arbitrage opportunities gradually disappear

**Momentum:**
- Prices continue in same direction
- Driven by: slow info diffusion, institutional liquidity needs, herd behavior
- Risk: Time horizon unpredictable (when does trend end?)
- Competition reduces horizon over time

**Key insight:** Prices can be BOTH MR and momentum depending on time horizon.

## Regime Switching

Regimes = market states (bull/bear, high/low vol, MR/trending).

### Markov Regime Switching (HMM)
- Assumes constant transition probabilities
- Problem: Doesn't predict WHEN transitions happen
- Useful for volatility (GARCH), less for price direction

### Turning Points Models
- Data mining approach
- Inputs: volatility, returns, macro data, earnings announcements
- Find conditions that predict regime changes

### Connection to Agilith
[[Regime-modeling]] uses VIX + credit spreads to classify RISK_ON/OFF/TRANSITION/RECOVERY.
Chan's HMM approach → [[Agilith-Custom-Indicators]] (HMM for regime detection).

## Stationarity + Cointegration

**Stationarity:** Time series reverts to constant mean.
- ADF test (see [[Chan-Chapter2-MeanReversion]])
- H < 0.5 (Hurst exponent) = mean-reverting

**Cointegration:** Two or more series move together.
- CADF test for pairs
- Johansen test for multiple series
- Example: XLE (energy ETF) vs crude oil futures (CL)

**Why it matters:**
- Stationary series → MR strategies work
- Non-stationary → requires cointegration modeling
- [[Agilith-Alpha-Stack-System]] Layer 1-2 likely uses stationarity tests

## Factor Models

Multi-factor risk management.

**Common factors:**
- Market (beta)
- Size (small vs big cap)
- Value (book/price)
- Momentum
- Quality

**Application:** Portfolio construction, risk attribution.

**Connection:** Agilith's 5-layer alpha stack uses factor-like scoring (Trend, RS, Confirmation, Growth).

## Other Topics

### Exit Strategies
- Time-based (hold N days)
- Profit target (stop gain)
- Trailing stop
- MRS signal (opposite regime triggers exit)

### Seasonal Strategies
- January effect (small caps)
- Earnings seasons
- Macro events (FOMC, CPI)

### High-Frequency Strategies
- Order book imbalance
- Coherence of price series
- Latency arbitrage

### Leverage vs Beta
Higher leverage = higher risk, not higher return.
Higher beta stocks = higher systematic risk.
Answer: Lower beta + moderate leverage often better.

## Agilith Connections

| Topic | Agilith Connection |
|-------|-------------------|
| Regime switching | [[Regime-modeling]] 4-state system |
| Stationarity | [[Chan-Chapter2-MeanReversion]] ADF/Hurst |
| Cointegration | Pairs trading in Layer 2-3 |
| Factor models | [[Agilith-Alpha-Stack-System]] scoring layers |
| HMM | [[Agilith-Custom-Indicators]] |
| Exit strategies | [[Agilith-Momentum-System]] (40-day hold period) |
| Seasonal | CPI/FOMC second-order trades |
| HF strategies | [[Agent-Tools]] intraday capabilities |

## Cross-Book Synthesis

**Mean Reversion:**
- QTB Ch7: Stationarity, cointegration basics
- [[Chan-Chapter2-MeanReversion]]: Full statistical tests (ADF, Hurst, Johansen)
- [[Chan-Chapter4-StocksETFs]]: Implementation in equities

**Momentum:**
- QTB Ch7: Drivers, time horizons
- [[Chan-Chapter6-Momentum]]: Full treatment (4 drivers, time vs cross-sectional)

**Risk:**
- QTB Ch6: Kelly formula, leverage
- [[Chan-RiskManagement]]: Extended with black swan protection

## See Also

- [[Chan-Chapter2-MeanReversion]] — Statistical tests (ADF, Hurst, cointegration)
- [[Chan-Chapter6-Momentum]] — Momentum strategies
- [[Chan-RiskManagement]] — Risk management
- [[Regime-modeling]] — Agilith's 4-regime framework
- [[Agilith-Alpha-Stack-System]] — 5-layer signal pipeline
- [[Agilith-Custom-Indicators]] — HMM for regime detection