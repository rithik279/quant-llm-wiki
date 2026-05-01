---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Regime-modeling, RISK_ON, TRANSITION, RISK_OFF, RECOVERY]
status: active
tags: [regime-indicators, vix, spreads, risk-management]
---

# Regime Indicators

The quantitative signals that drive regime switching.

## Primary Indicators

### VIX (Volatility Index)
Measures market fear/implied volatility.

| Regime | VIX Range |
|--------|-----------|
| RISK_ON | < 20 |
| TRANSITION | 20-30 |
| RISK_OFF | > 30 |

### Credit Spreads (IG/HY)
Measures stress in credit markets.

| Regime | Spread Range |
|--------|-------------|
| RISK_ON | < 400 bps |
| TRANSITION | 400-600 bps |
| RISK_OFF | > 600 bps |

## Composite Signal

Regime = max(VIX regime, Spreads regime)

Higher signal wins (more conservative).

## Position Sizing by Regime

| Regime | Position Size | Logic |
|--------|---------------|-------|
| RISK_ON | 100% | Full conviction, uptrend |
| RECOVERY | 50% | VIX declining from peak, partial repositioning |
| TRANSITION | 70% | Uncertainty, reduce exposure |
| RISK_OFF | 20% | Defensive, preserve capital |

## See Also
- [[Regime-modeling]]
- [[RISK_ON]]
- [[TRANSITION]]
- [[RISK_OFF]]
- [[RECOVERY]]