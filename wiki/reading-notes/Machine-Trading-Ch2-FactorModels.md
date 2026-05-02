---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/Machine Trading_ Deploying Computer Algorithms to Conquer The Markets (Ernest Chan 2017).pdf
related_pages: [Leopold-thesis, Bottleneck-analysis, Agilith-Research-Plan, Agilith-Alpha-Stack-System, Agilith-Momentum-System, 4-Month-Build-Plan, Agilith-Data-Stack, Agilith-Investment-Philosophy, RL-Training-Setup, Chan-Agilith-Integration]
status: active
tags: [chan, Machine-Trading, factor-models, Leopold-connection, Agilith-research]
---

# Machine Trading Ch2: Factor Models

**Leopold thesis:** Factor models score bottleneck beneficiaries vs victims. [[Leopold-thesis]] → [[Bottleneck-analysis]].

**Agilith research plan:** [[Agilith-Research-Plan]] Module 3 builds factor features for 5 alpha ideas.

## Key Content

### Types of Factors

1. **Fundamental factors:** Book-to-price, earnings yield, cash flow yield
2. **Technical factors:** Moving average, RSI, momentum
3. **Options-derived factors:** Implied vol, put/call ratio, vol skew

### Factor Construction

**Sector-relative formulation:**
```
w_i = (r_i - ⟨r⟩) / Σ|r_i - ⟨r⟩|
```
Long stocks above sector mean, short stocks below.

**Example:** Computer hardware stocks (AAPL, EMC, HPQ, NTAP, SNDK) — 48% annualized return, Sharpe 0.9.

### Options Market Factors

- **Implied vol as sentiment:** High IV = fear = potential bounce
- **Put/call ratio:** Contrarian indicator
- **Volatility skew:** Which strikes are most expensive = hedging demand

**Leopold application:** Bottleneck plays often have elevated vol (uncertainty). Options data can signal when to enter/exit bottleneck trades.

## Connection to Agilith System

### Alpha Stack System Layers

| Alpha Stack Layer | MT Ch2 Factor | Agilith Use |
|-------------------|---------------|-------------|
| [[Agilith-Alpha-Stack-System]] Layer 1 (Macro) | Options-derived (IV, skew) | Infrastructure constraint sentiment |
| Layer 2 (Micro) | Fundamental (margin, capex) | [[Agilith-Research-Plan]] Alpha 2 (Margin) |
| Layer 3 (Behavioral) | Technical (momentum, RSI) | [[Agilith-Research-Plan]] Alpha 4 (AI Engagement) |
| Layer 4 (Confirmation) | Cross-sectional scoring | Analyst revision confirmation |
| Layer 5 (Timing) | Factor scores → position sizing | [[Agilith-Momentum-System]] scoring |

### 4-Month Build Plan Connection

| Month | MT Ch2 Activity |
|-------|------------------|
| Month 1 (Foundation) | Build factor engine → [[Agilith-Data-Stack]] |
| Month 2 (Regime) | Cross-regime factor testing |
| Month 3 (Backtesting) | Factor backtest with [[RL-Training-Setup]] |

### Research Plan Alpha Ideas

| Alpha | Factor Application |
|-------|-------------------|
| [[Agilith-Research-Plan]] Alpha 1 (Infrastructure) | Options vol factors → bottleneck uncertainty |
| Alpha 2 (Margin Before Revenue) | Fundamental factors → margin expansion |
| Alpha 3 (Transformer Delay) | Technical factors → delay detection |
| Alpha 4 (AI Engagement) | Behavioral factors → engagement signals |
| Alpha 5 (Liquid Cooling) | Cross-sectional scoring → inflection detection |

### Momentum System Connection

[[Agilith-Momentum-System]] uses factor-like scoring:
- 35% Trend Strength (technical)
- 30% Relative Strength (fundamental)
- 20% Confirmation (technical)
- 15% Growth (fundamental)

MT Ch2 factor models → enhance this scoring system.

### Investment Philosophy

[[Agilith-Investment-Philosophy]] three-layer framework:
- Quantitative (short-term): Factor-based signals
- LLM (medium-term): Factor aggregation
- Fundamental (long-term): Core thesis alignment

## Backtesting Factor Models

**Key issues:**
- **Univariate vs multivariate:** Multivariate finds hidden factors
- **Look-ahead bias:** Use only available data at signal time
- **Survivorship bias:** Include delisted stocks

**Connection to [[Agilith-Data-Stack]]:** Survivorship-bias-free data critical for factor backtests.

## See Also

**Leopold thesis:**
- [[Leopold-thesis]] — Core thesis
- [[Bottleneck-analysis]] — 5 bottlenecks with tickers

**Agilith research:**
- [[Agilith-Research-Plan]] — 5 alpha ideas, Module 3 factor construction
- [[Agilith-Alpha-Stack-System]] — 5-layer pipeline
- [[Agilith-Momentum-System]] — Breakout scoring (uses factors)
- [[Agilith-Investment-Philosophy]] — Three-layer framework

**Implementation:**
- [[4-Month-Build-Plan]] — Month 1 factor engine, Month 3 backtesting
- [[Agilith-Data-Stack]] — Data quality for factor construction
- [[RL-Training-Setup]] — Factor-based state space

**Integration:**
- [[Machine-Trading-Leopold-Integration]] — Full thesis integration
- [[Chan-Agilith-Integration]] — Cross-book synthesis