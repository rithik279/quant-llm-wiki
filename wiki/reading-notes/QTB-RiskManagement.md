---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 2
source_files: [raw/books/Quantitative Trading.pdf, raw/books/AlgorithmicTradingChan.pdf]
related_pages: [Chan-RiskManagement, QTB-Chapter7-SpecialTopics, Agilith-Alpha-Stack-System, 4-Month-Build-Plan]
status: active
tags: [chan, Kelly-formula, risk-management, leverage, position-sizing, psychological]
---

# QTB Ch6: Money and Risk Management

Kelly formula as central tool. More detailed derivation than Algorithmic Trading.

## Kelly Formula

**Multi-strategy allocation:**
```
F* = C^(-1) * M
```
- F* = optimal leverage vector for each strategy
- C = covariance matrix of returns
- M = mean excess returns vector

**Single strategy (diagonal C):**
```
f* = m / s^2
```
- f* = Kelly fraction (optimal leverage)
- m = mean excess return
- s^2 = variance

**Key insight:** `g = r + S^2/2` where g = max growth rate, S = Sharpe ratio.

## Why Risk Is Bad

Random walk with zero mean:
- Arithmetic mean = 0
- Geometric mean = m - s^2/2 < 0
→ Even fair game → expected loss (volatility drag)

**Example:** 50/50 chance ±1% per minute → lose 0.5bp per minute (geometric mean < 0).

**Lesson:** Risk always decreases long-term growth. Risk management critical.

## Practical Application

**Half-Kelly:** Reduce recommended leverage by 50% for safety (estimation error, non-Gaussian returns).

**Leverage constraints:** Retail accounts limited to 2x (overnight) or 4x (intraday). Scale down all f accordingly.

**Rebalancing:** Update allocation daily as equity changes.

**Lookback period:** 6 months for 1-day holding period. Shorter = faster adaptation to regime changes.

## Risk Management

### Position Sizing
```
Position $ = Kelly_fraction * Equity / ATR
```

Where ATR = Average True Range (volatility proxy).

### Drawdown Management
- Optimal leverage reduces but doesn't eliminate drawdowns
- Equity stops (halt trading if equity falls below threshold)
- Stop losses per position

## Black Swans + Fat Tails

**Problem:** Gaussian assumes normal events. Real markets have fat tails (extreme events more frequent).

**Chan personal story:** Lost $1M adding $100M to portfolio based on 6-month performance. Greed + lack of Kelly discipline.

**Amaranth Advisors:** $6B loss on natural gas spread due to single trader overleveraging.

**Lessons:**
- Never overleverage a single strategy
- "Superbly performing model at greatest risk of huge loss" (overconfidence)
- Keep portfolio size under control at all times

## Psychological Pitfalls

### Endowment Effect / Loss Aversion
- Hold losing positions too long (status quo bias)
- Exit profitable positions too soon (fear of losing profits)
- "The pain from possibly losing outweighs the pleasure from gaining"

### Representativeness Bias
- Too much weight on recent experience
- Tweak parameters after big loss (invites other losses)
- Must backtest modifications over sufficient period

### Despair + Greed
- **Despair:** Shut down model during prolonged drawdown (rational = gradually reduce allocation)
- **Greed:** Increase leverage after wins (superprofitable model most dangerous)

**Golden rule:** Keep portfolio under control. Large funds fail from overleverage, not bad models.

## Connection to Agilith

| Topic | Agilith Connection |
|-------|-------------------|
| Kelly formula | [[Chan-RiskManagement]] same content |
| Leverage | [[4-Month-Build-Plan]] Month 4 live trading |
| Position sizing | [[Agilith-Alpha-Stack-System]] Layer 5 (Timing) |
| Drawdown | RL reward function in [[RL-Training-Setup]] |
| Psych discipline | [[Failure-Patterns]] post-trade reflection |

## Key Formulas

**Kelly fraction (single strategy):**
```
f* = m / s^2
```

**Max growth rate:**
```
g = r + S^2/2
```

**Volatility-based position sizing:**
```
Position $ = f * Equity / ATR
```

## See Also

- [[Chan-RiskManagement]] — Extended version with regime adjustment
- [[QTB-Chapter7-SpecialTopics]] — Exit strategies, factor models
- [[Agilith-Alpha-Stack-System]] — Layer 5 timing/position sizing
- [[4-Month-Build-Plan]] — Month 4 deployment with risk controls
- [[Failure-Patterns]] — Post-trade reflection for psych discipline