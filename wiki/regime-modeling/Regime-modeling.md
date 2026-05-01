---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Regime-indicators, TRANSITION, RISK_OFF, RECOVERY, Regime-indicators]
status: active
tags: [regime-modeling, overview, risk-management]
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

## See Also
- [[Regime-indicators]] — indicator details
- [[RISK_ON]] — bullish regime
- [[TRANSITION]] — uncertainty
- [[RISK_OFF]] — defensive
- [[RECOVERY]] — repositioning