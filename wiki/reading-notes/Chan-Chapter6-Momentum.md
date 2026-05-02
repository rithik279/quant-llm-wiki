---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/AlgorithmicTradingChan.pdf
related_pages: [Agilith-Research-Plan, Agilith-Momentum-System, Regime-modeling, 4-Month-Build-Plan]
status: active
tags: [chan, momentum, forced-sales, roll-returns, Agilith-connection]
---

# Chan Ch6: Interday Momentum → Agilith Internship

**Connection to Agilith:** [[Agilith-Momentum-System]] is the core strategy. Chan gives the theoretical foundation for momentum drivers.

## How Chan Ch6 Maps to Agilith Goals

### 4 Drivers → Agilith Alpha Layers

| Chan Driver | Agilith Connection | Alpha Layer |
|------------|-------------------|-------------|
| **Forced asset sales/purchases** | Margin expansion = proxy for forced activity. When margin drops, companies forced to cut costs → oversold bounce | Layer 2 (Margin Before Revenue) |
| **Roll returns (futures)** | Infrastructure plays (power, cooling) may benefit from roll | Secondary signal |
| **News/sentiment diffusion** | [[Agilith-Research-Plan]] Layer 3 (Behavioral) — Narrative vs Numbers | Layer 3 (Behavioral) |
| **Order flow / HFT** | Execution quality in [[Agent-Tools]] | Technical layer |

### Forced Sales = Main Driver

**Chan quote:** "Forced asset sales is the main driver of stock/ETF momentum in many diverse circumstances."

**Agilith application:**
- When companies cut AI spending → forced selling of AI infrastructure names
- Short squeeze potential when hedge funds forced to cover
- Margin compression → price weakness → more selling

**Signal detection:**
- [[Agilith-Research-Plan]] Tier A: "Margin Before Revenue Recognition"
- Detect margin compression via SG&A/revenue, R&D/revenue changes

### Cross-Sectional vs Time-Series Momentum

**Chan:** Cross-sectional momentum more robust than time-series.

**Agilith [[Agilith-Momentum-System]] implementation:**
- Cross-sectional: Long top-ranked stocks vs short bottom-ranked (relative)
- Time-series: Yesterday's winners continue today (absolute)

**Scoring dimensions:**
- 35% Trend Strength (time-series)
- 30% Relative Strength (cross-sectional)
- 20% Confirmation
- 15% Growth/Fundamentals

### Regime Dependency

**Chan insight:** Momentum works in some regimes, fails in others.

**Agilith [[Regime-modeling]] integration:**
| Regime | Momentum Expected | Rationale |
|--------|-------------------|-----------|
| RISK_ON | Strong | Trend continuation, risk-on sentiment |
| RISK_OFF | Weak/Fail | Mean reversion dominates |
| TRANSITION | Mixed | Depends on direction |
| RECOVERY | Moderate | Early trend establishment |

**Action:** [[Agilith-Momentum-System]] should adjust position sizing by regime.

## Connection to 4-Month Build Plan

| Phase | Momentum Activity |
|-------|-------------------|
| Month 1 | Build momentum scoring system |
| Month 2 | Backtest momentum across regimes |
| Month 3 | RL training with momentum signals |
| Month 4 | Live trading momentum strategies |

## Key Tests for Agilith

**t-statistic for momentum:**
```
r_{t+1} = α + β * r_t + ε
β > 0 → momentum; β < 0 → mean reversion
```

**Agilith use:**
- Test if past returns predict future returns for each alpha
- Cross-sectional: rank by past returns → long top, short bottom
- Time-series: buy yesterday's winners, sell yesterday's losers

## See Also

- [[Agilith-Momentum-System]] — Breakout ranking (35% Trend, 30% RS, 20% Confirmation, 15% Growth)
- [[Agilith-Research-Plan]] — Alpha 2 (Margin Before Revenue) uses forced sales insight
- [[Agilith-Alpha-Stack-System]] — Layer 2 (Margin) + Layer 3 (Behavioral) both use momentum drivers
- [[Regime-modeling]] — When momentum works (RISK_ON), fails (RISK_OFF)
- [[4-Month-Build-Plan]] — Month 2 momentum backtesting across regimes
- [[Chan-Agilith-Integration]] — Full cross-reference of all Chan concepts → Agilith
- [[Chan-Chapter2-MeanReversion]] — MR as counterbalance to momentum