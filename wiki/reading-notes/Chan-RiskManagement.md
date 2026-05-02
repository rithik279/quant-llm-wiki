---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/AlgorithmicTradingChan.pdf
related_pages: [Agilith-Research-Plan, 4-Month-Build-Plan, RL-Training-Setup, Agilith-Alpha-Stack-System]
status: active
tags: [chan, Kelly-formula, risk-management, leverage, position-sizing, Agilith-connection]
---

# Chan Ch8: Risk Management → Agilith Internship

**Connection to Agilith:** Every alpha from [[Agilith-Research-Plan]] needs proper position sizing. RL agent in [[RL-Training-Setup]] must learn risk management.

## How Chan Ch8 Maps to Agilith Goals

### Kelly Formula for Agilith Portfolio

**Single strategy:**
```
f* = m / s^2
```

**Agilith application:**
- [[Agilith-Alpha-Stack-System]] Layer 5 (Timing) uses Kelly for position sizing
- Each alpha idea gets Kelly fraction based on Sharpe ratio
- [[4-Month-Build-Plan]] Month 4: live trading with Kelly-based sizing

### RL Training Risk Metrics

[[RL-Training-Setup]] reward function should include:
- Kelly-based position sizing
- Drawdown penalty
- Sharpe ratio as optimization target

**Chan formula:**
```
g = r + S^2/2
```
Where g = max growth rate, S = Sharpe ratio

**RL reward:**
- Sharpe > 1.4 (target from [[4-Month-Build-Plan]])
- Max drawdown < 20%
- Calmar ratio > 1.5

### Regime-Conditioned Risk

**Chan insight:** "Always better to be underleveraged than overleveraged"

**Agilith [[Regime-modeling]] integration:**
| Regime | Leverage | Notes |
|--------|----------|-------|
| RISK_ON | Higher | Momentum works, accept more risk |
| RISK_OFF | Lower | Reduce exposure |
| TRANSITION | 70% normal | VIX 20-30 |
| RECOVERY | 50% | VIX declining from peak |

### Black Swan Protection

**Chan tools:**
- Stop losses per position
- Position limits per alpha idea
- Diversification across regimes

**Agilith application:**
- Infrastructure alpha (Transformer Delay): high tail risk → smaller positions
- AI Engagement Surprise: moderate tail risk → standard sizing

## 4-Month Build Plan Connection

| Month | Risk Activity |
|-------|--------------|
| Month 1 | Data + signal quality → no risk without clean data |
| Month 2 | Backtesting with Kelly sizing |
| Month 3 | RL training with risk metrics in reward |
| Month 4 | Live trading with regime-adjusted leverage |

## Key Formulas

**Kelly fraction:**
```
f* = m / s^2
```

**Max growth:**
```
g = r + S^2/2
```

**Position sizing:**
```
Position $ = Kelly_fraction * Equity / ATR
```
Where ATR = Average True Range

**Vol-adjusted Sharpe:**
```
S_adj = (mean - rf) / std * sqrt(252)
```

## See Also

- [[Agilith-Research-Plan]] — 5 alpha ideas requiring risk management
- [[4-Month-Build-Plan]] — Month 4 live trading with Kelly/2 conservative leverage
- [[RL-Training-Setup]] — Sharpe > 1.4, max drawdown < 20% in RL reward
- [[Agilith-Alpha-Stack-System]] — Layer 5 (Timing) uses Kelly-based position sizing
- [[Regime-modeling]] — RISK_ON (higher leverage) vs RISK_OFF (lower leverage)
- [[Agilith-Learning-System]] — Phase 5 regime modeling uses risk metrics
- [[Chan-Agilith-Integration]] — Full cross-reference of all Chan concepts → Agilith
- [[Chan-Chapter1-Backtesting]] — Backtest metrics (Sharpe, drawdown) precede risk management