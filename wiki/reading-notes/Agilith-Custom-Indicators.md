---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 4
related_pages: [Agilith-Momentum-System, Regime-modeling, Agilith-System-Architecture]
status: active
tags: [indicators, momentum, custom-indicators, mathematical-methods, hmm,hurst,adx]
---

# Custom Indicators + Mathematical Methods

Technical and mathematical toolkit for the Agilith system.

## Custom Momentum Indicator

**Core idea:** EMA derivatives to detect trend continuation.

**Components:**
- Slope (first derivative of EMA) → trend direction
- Acceleration (second derivative of EMA) → trend momentum
- Signal logic: accelerating trend → continuation expected

**Application:** Applied to exponential moving averages.

## Regime Detection Methods

### Hidden Markov Models (HMM)

**Purpose:** Probabilistic state classification for regime detection.

**Inputs:**
- Index returns
- Volatility
- Breadth
- Momentum factor returns
- Breakout strategy returns

**Output:** Latent states mapped to regimes (trend/chop/risk-off).

### Hurst Exponent

**Purpose:** Measure persistence of time series.

- H < 0.5 → mean-reverting
- H > 0.5 → trending
- H = 0.5 → random walk

**Use:** Identify whether market is trending or mean-reverting → select appropriate strategy.

### ADX (Average Directional Index)

**Purpose:** Trend strength indicator.

- ADX < 20 → weak trend
- ADX 20-40 → moderate trend
- ADX > 40 → strong trend

**Use:** Filter trades based on trend efficiency.

### Moving Average Derivatives

**1st derivative:** EMA slope → direction
**2nd derivative:** Rate of change of slope → acceleration

**Signal:** Accelerating trend → higher probability of continuation.

## Scenario-Based Evaluation

**Six breakout quality scenarios:**

1. Clean breakout — strong volume, follow-through → high probability
2. Fake breakout — rapid reversal → skip
3. Late-stage extension — overstretched → lower probability
4. Earnings-driven breakout — single-event → neutral
5. Leader breakdown — sector rotation → avoid
6. Low-quality growth trap — no support → skip

**Reward design:**
- Forward return (risk-adjusted)
- Drawdown penalty
- Overextension penalty
- Regime alignment
- Reasoning quality

## Overfitting Insight

**Core idea:** If strategy overfits a specific period:
1. Identify conditions of that period
2. Reuse strategy when conditions repeat

**Use:** Build library of condition-strategy pairs. Track when regimes repeat.

## Custom Indicator Development Pattern

1. Define signal logic (slope, acceleration, etc.)
2. Apply to relevant time series (price, EMA)
3. Validate against known regimes
4. Backtest within scenario framework
5. Document invalidation conditions

## See Also
- [[Agilith-Momentum-System]] — Momentum foundation
- [[Regime-modeling]] — Regime framework