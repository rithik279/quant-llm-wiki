---
date_created: 2026-04-30
date_updated: 2026-05-02
source_count: 2
source_files: [Leopold-thesis, raw/books/GenerativeAIForTradingChan.pdf]
related_pages: [Regime-indicators, TRANSITION, RISK_OFF, RECOVERY, RISK_ON, Agilith-Alpha-Stack-System, RL-Training-Setup, RocketShip-Framework, Chan-Chapter4-8-Generative-Models, Chan-Agilith-Integration]
status: active
tags: [regime-modeling, GMM, HMM, GenAI, risk-management]
---

# Regime Modeling

The framework for dynamically adjusting portfolio exposure based on market conditions.

## Why Regime Modeling?

AI infrastructure stocks are highly correlated to broad market risk sentiment. During RISK_OFF events:
- All assets sell off (correlation to SPY spikes)
- Credit markets seize
- Positioning doesn't matter

Regime modeling lets us:
1. Reduce exposure before major drawdowns
2. Preserve capital to buy dips
3. Reposition during recovery

## The Four Regimes

| Regime | Conditions | Position | Description |
|--------|-------------|----------|-------------|
| [[RISK_ON]] | VIX<20, spreads<400bps | 100% | Full throttle, uptrend confirmed |
| [[TRANSITION]] | VIX 20-30, spreads 400-600bps | 70% | Mixed signals, reduce conviction |
| [[RISK_OFF]] | VIX>30, spreads>600bps | 20% | Defensive, preserve capital |
| [[RECOVERY]] | VIX declining from peak | 50% | Early repositioning, mixed signals |

## Signal Logic

Composite regime = max(VIX regime, Spread regime)

Higher signal wins (conservative interpretation).

## Signal Logic

Composite regime = max(VIX regime, Spread regime)

Higher signal wins (conservative interpretation).

---

## GMM vs HMM Regime Detection

From [[Chan-Chapter4-8-Generative-Models]] Ch6:

**Two Sigma approach:** GMM posterior → regime probability
- 4 clusters: Crisis, Steady State, Inflation, Walking on Ice
- Use observable indicators (VIX, spreads) rather than hidden states

**Contradiction from [[Chan-Agilith-Integration]]:**

| Source | Recommendation | Reason |
|--------|---------------|--------|
| Ch3 | "HMM seductive but fictional" | Hidden states not directly useful |
| Ch6 | GMM works | Observable indicators + cluster posteriors |

**Resolution:** Use **GMM with observable indicators** for regime detection, not pure HMM hidden states.

### Implementation

From [[Chan-Chapter4-8-Generative-Models]]:
- GMM posterior → regime probability
- Features: VIX, credit spreads, momentum, macro indicators
- Map to 4-regime labels: RISK_ON, TRANSITION, RISK_OFF, RECOVERY

### Connection to [[Agilith-Alpha-Stack-System]]

Layer 5 (Timing) uses:
- Flow models for regime-conditioned return distributions: P(r_t | RISK_ON) vs P(r_t | RISK_OFF)
- [[Chan-Agilith-Integration]]: Regime switching QTB Ch7 → use GMM, not HMM

### Connection to [[RocketShip-Framework]]

Tool 4 (`estimate_market_timing`) uses regime for entry/exit confidence:
- ADX, Hurst exponent, VIX regime tags
- GMM posterior feeds into timing signal

### Bottleneck → Regime Mapping

From [[Chan-Agilith-Integration]]:
- Power (BE) constraint → RISK_ON
- Compute (CRWV) supply catching up → TRANSITION
- Memory (MU) normalization → RECOVERY
- RISK_OFF → Black swan (regulatory block, tech disruption)

---

## See Also
- [[Regime-indicators]] — indicator details
- [[RISK_ON]] — bullish regime
- [[TRANSITION]] — uncertainty
- [[RISK_OFF]] — defensive
- [[RECOVERY]] — repositioning
- [[Agilith-Alpha-Stack-System]] — Layer 5 timing with regime conditioning
- [[RL-Training-Setup]] — GMM-based synthetic scenario generation
- [[RocketShip-Framework]] — 10 tools with regime-aware timing
- [[Chan-Chapter4-8-Generative-Models]] — Ch6 GMM for regime detection
- [[Chan-Agilith-Integration]] — Full HMM vs GMM contradiction resolution