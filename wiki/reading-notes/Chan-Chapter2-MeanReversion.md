---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/AlgorithmicTradingChan.pdf
related_pages: [Agilith-Research-Plan, Agilith-Alpha-Stack-System, Regime-modeling, RL-Training-Setup]
status: active
tags: [chan, mean-reversion, ADF, Hurst, half-life, cointegration, Agilith-connection]
---

# Chan Ch2: Mean Reversion → Agilith Internship

**Connection to Agilith:** Mean reversion is one of two strategy camps (MR vs momentum). Agilith momentum system needs MR as counterbalance.

## How Chan Ch2 Maps to Agilith Goals

### Half-Life → Agilith Timing Layer

**Core equation:**
```
Half-life = -log(2) / λ
```
Where λ from: `dy_t = λ(y_{t-1} - μ)dt + dW`

**Agilith use:**
- [[Agilith-Alpha-Stack-System]] Layer 5 (Timing) — when to enter/exit
- If half-life = 20 days → expect half reversion in 20 days → hold period guidance
- For earnings-driven signals (Margin Before Revenue): half-life of margin expansion?

### Stationarity Tests → Alpha Validation

| Test | What it tells | Agilith Application |
|------|---------------|---------------------|
| ADF | Stationary? → MR works | Test if Margin Before Revenue signal mean-reverts |
| Hurst | H<0.5 → MR, H>0.5 → trending | Use for [[Agilith-Momentum-System]] |
| Variance Ratio | <1 → MR, >1 → momentum | Confirm momentum in RISK_ON regime |

### Cointegration → Pairs Trading

**CADF / Johansen tests** for pairs trading.

**Agilith application:**
- Infrastructure plays: pairs of companies that should move together (beneficiary + victim)
- Margin signals: companies with similar leverage profiles

## Connection to Agilith Learning System

From [[Agilith-Learning-System]] Phase 3 (Time Series):
- ADF, Hurst, cointegration = core time series methods
- "Build mean reversion features for backtesting"

Phase 4 Strategy Construction:
- Mean reversion strategies from Chan books
- [[Agilith-Research-Plan]] Module 3: structured features (margins, capex)

## Connection to RL Training

[[RL-Training-Setup]] state space design:
- Mean reversion half-life → position holding time in state
- Stationarity → regime classification features
- Cointegration → pair relationship features

## Key Formulas for Agilith

**Half-life estimation (Ornstein-Uhlenbeck):**
```python
# From Chan: dy_t = λ(y_{t-1} - μ)dt + dW
# Estimate λ via regression, then half-life = -log(2)/λ
```

**ADF test interpretation:**
- t-stat < critical value → reject unit root → stationary → MR works
- t-stat > critical value → cannot reject → non-stationary → MR fails

**Hurst exponent:**
- H < 0.5 → mean-reverting (antipersistent)
- H = 0.5 → random walk
- H > 0.5 → trending (persistent)

## See Also

- [[Agilith-Research-Plan]] — Alpha ideas requiring mean reversion (Margin Before Revenue, Liquid Cooling)
- [[Agilith-Alpha-Stack-System]] — Layer 5 (Timing) uses half-life for hold period
- [[Agilith-Learning-System]] — Phase 3 (Time Series) covers ADF, Hurst, cointegration
- [[Chan-Agilith-Integration]] — Full cross-reference of all Chan concepts → Agilith goals
- [[Chan-Chapter1-Backtesting]] — Backtest pitfalls for MR strategies
- [[Agilith-Momentum-System]] — Uses Hurst for regime classification
- [[Regime-modeling]] — When MR strategies work (non-RISK_ON regimes)