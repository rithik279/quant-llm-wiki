---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/AlgorithmicTradingChan.pdf
related_pages: [Agilith-Research-Plan, Agilith-Learning-System, QTB-Full-Summary]
status: active
tags: [chan, backtesting, look-ahead-bias, data-snooping, regime-shifts, Agilith-connection]
---

# Chan Ch1: Backtesting + Automated Execution → Agilith Internship

**Connection to Agilith internship:** Backtesting is the core skill. Every alpha idea from [[Agilith-Research-Plan]] must be backtested before deployment.

## How Chan Ch1 Maps to Agilith Goals

### Agilith Research Plan → Chan Backtest Pitfalls

| Agilith Alpha Idea | Backtest Danger | Chan Chapter 1 Fix |
|--------------------|-----------------|---------------------|
| Infrastructure Constraint Nowcast | Look-ahead: grid queue data published → signal too late | Same code for backtest + live |
| Margin Before Revenue | Data-snooping: many features → overfit | Simple models, few parameters |
| Transformer Delay | Regime shifts: past bottlenecks may not repeat | Test across regimes |
| AI Engagement Surprise | Survivorship: missing small caps that got acquired | Survivorship-free database |

### Module 4: Event-Study Harness

From [[Agilith-Research-Plan]] Module 4:
- Build event-study harness (earnings windows, 20/40/60 day returns)
- Chan Ch1 gives: performance measurement, statistical significance, Monte Carlo

**Connection:**
- Sharpe ratio → measure alpha quality for each event window
- Monte Carlo → test significance of surprise signal

## Statistical Significance for Agilith Alpha

Chan formula:
```
More round-trip trades → higher statistical significance
```

For Agilith's 5 ideas → need sufficient sample size:
- Infrastructure: rare events (bottleneck announcements) → few trades
- Margin: quarterly events (earnings) → more trades
- AI Engagement: monthly (quarterly reports) → moderate

**Action:** For rare-event alphas (Infrastructure, Transformer Delay), use Monte Carlo to estimate significance with limited history.

## Regime Shifts → Agilith Regime Modeling

Chan warning: "Even if backtest is correct without pitfalls, doesn't mean predictive of future returns. Regime shifts can spoil everything."

**Connection to:**
- [[Regime-modeling]] (RISK_ON/OFF/TRANSITION/RECOVERY)
- [[Agilith-Learning-System]] Phase 5: Regime Modeling

**Action:** Test each alpha idea across all 4 regimes. Some alphas only work in RISK_ON.

## Agilith 16-Week Learning System Connection

| Phase | Focus | Chan Connection |
|-------|-------|-----------------|
| Phase 1 (Stats) | Foundation | Ch1 stats (Sharpe, drawdown) |
| Phase 2 (Regression) | Factor modeling | Data-snooping awareness |
| Phase 3 (Time Series) | Stationarity | Mean reversion tests (Ch2) |
| Phase 4 (Strategy) | Chan books heavily | Ch1-8 all relevant |
| Phase 5 (Regime) | RISK_ON/OFF | Regime shifts (Ch1, Ch7 in QTB) |

## Key Takeaways for Agilith

1. **Same code principle:** Backtest + live execution must share code
2. **Simple beats complex:** Fewer parameters → less data-snooping
3. **Cross-validation:** Test alpha across different regimes
4. **Monte Carlo:** For rare-event alphas (Infrastructure, Transformer Delay)
5. **Survivorship-free data:** Critical for small-cap alpha ideas

## See Also

- [[Agilith-Research-Plan]] — 5 alpha ideas to backtest (with Chan method mapping)
- [[Agilith-Learning-System]] — 16-week curriculum (Phase 4 uses Chan books)
- [[Chan-Agilith-Integration]] — Full cross-reference of all Agilith goals → Chan methods
- [[Chan-Chapter2-MeanReversion]] — Stationarity tests for mean reversion strategies
- [[Chan-RiskManagement]] — Kelly formula + risk management
- [[QTB-Full-Summary]] — Entry-level book context
- [[Regime-modeling]] — RISK_ON/OFF/TRANSITION/RECOVERY framework