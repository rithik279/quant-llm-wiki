---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Internship-Overview]
status: active
tags: [agilith-capital, learning-system, research-loop, curriculum]
---

# Agilith Learning System

16-week learning structure for quant research internship.

## The Research Loop

1. Learn concept
2. Rebuild example from scratch
3. Modify it
4. Test it on financial data
5. Write a short research memo explaining results

## Core Resources (5 books)

| Resource | Type | Author |
|----------|------|--------|
| Statistical Inference | Statistics | Casella & Berger |
| Introductory Time Series with R | Time Series | Cowpertwait |
| Expected Returns | Finance | Antti Ilmanen |
| Hands-On AI Trading | Practical Quant | Ernest Chan |
| Generative AI for Trading | AI Applications | Ernest Chan |

## Phase Structure

| Phase | Weeks | Focus | Chan Chapter |
|-------|-------|-------|--------------|
| Phase 1 | 1-3 | Statistics Foundation | [[Chan-Chapter1-Backtesting]] (Sharpe, drawdown) |
| Phase 2 | 4-6 | Regression and Factor Modeling | [[QTB-Chapter7-SpecialTopics]] (factor models), [[Chan-Chapter1-Backtesting]] (data-snooping) |
| Phase 3 | 7-9 | Time Series Modeling | [[Chan-Chapter2-MeanReversion]] (ADF, Hurst, cointegration) |
| Phase 4 | 10-12 | Strategy Construction (Chan books heavily) | [[Chan-Chapter2-MeanReversion]], [[Chan-Chapter6-Momentum]], [[Chan-RiskManagement]], [[QTB-Full-Summary]] |
| Phase 5 | 13-16 | Regime Modeling | [[Chan-Chapter1-Backtesting]] (regime shifts), [[QTB-Chapter7-SpecialTopics]] (regime switching) |

## Daily Learning Structure (3 hours)

- **Block 1** (45 min): Concept learning — read, write one-page explanation
- **Block 2** (60 min): Rebuild example from scratch — regression, signal generation, factor construction
- **Block 3** (45 min): Modification experiment — change lookback, weighting, definition
- **Block 4** (30 min): Research note — memo with hypothesis, method, results, interpretation

## Key Insight

> "What makes you stand out? Not coding. Not AI. Your value will come from being able to say: 'Here is the hypothesis, here is the statistical evidence, and here is the portfolio implication.'"

## Expected Outputs

5-10 research memos:
- Momentum Predictability in US Equities → [[Chan-Chapter6-Momentum]] (t-statistic for momentum)
- Mean Reversion in Large Cap Stocks → [[Chan-Chapter2-MeanReversion]] (ADF, half-life)
- Factor Interaction Between Value and Momentum → [[QTB-Chapter7-SpecialTopics]] (factor models)
- Volatility Regimes and Strategy Performance → [[QTB-Chapter7-SpecialTopics]] (regime switching)
- Dynamic Factor Allocation → [[Chan-RiskManagement]] (Kelly), [[Regime-modeling]]

## See Also
- [[Agilith-Internship-Overview]]
- [[Chan-Agilith-Integration]] — Full cross-reference of all Chan concepts → Agilith
- [[Chan-Chapter1-Backtesting]] through [[Chan-RiskManagement]] — Individual chapters