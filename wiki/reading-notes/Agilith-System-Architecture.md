---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Alpha-Stack-System, Agilith-Data-Stack, Regime-modeling]
status: active
tags: [agilith-capital, system-design, architecture, agent-framework]
---

# Agent-Assisted Systematic US Growth Equities Framework

Systematic long-only US growth equities engine built on deterministic pipeline with agent-assisted feature generation.

## System Architecture

Four primary layers:
1. Universe Definition (Screener)
2. Feature Generation (Agents)
3. Ranking (Alpha Combination)
4. Strategy Execution (Portfolio + Rules)

**Key principle**: Agents generate structured, testable, numeric signals — NOT decisions.

## Full Pipeline

```
Raw Data
→ Feature Engineering
→ Screener (Universe)
→ Agent Feature Layer
→ Feature Store
→ Ranking Engine
→ Selection (Top N)
→ Strategy Rules
→ Portfolio Construction
→ Backtest / Live Execution
```

Each layer must be deterministic, reproducible, and point-in-time correct.

## Universe Layer (Screener)

Defines tradable universe each day.

**Filters:**
- US-listed equities only
- Market cap > $2B
- Dollar volume > $200M
- Trend alignment:
  - price > SMA200
  - SMA50 > SMA150 > SMA200
  - SMA20 > SMA50
- ADR threshold
- 52-week high proximity (0-5%)
- Revenue growth + EPS growth
- Optional: ROE, PEG, beta filters

**Output:** `date, ticker`

**Critical:** Must reconstruct historically using point-in-time data. No survivorship bias, no look-ahead bias.

## Agent Feature Generation Layer

Agents convert raw/unstructured data → structured numeric features.

**Requirements:**
- Output fixed schema
- Deterministic + reproducible
- Point-in-time inputs

**Must NOT:**
- Make discretionary decisions
- Override system logic
- Introduce randomness

### Fundamental Agent

**Inputs:** Financial statements, earnings data, analyst revisions (point-in-time)

**Outputs:**
- `revenue_growth_score`
- `margin_expansion_score`
- `earnings_revision_score`
- `quality_score` (ROE, margins, stability)

**Purpose:** Capture underlying business strength and growth quality.

### Technical Agent

**Inputs:** Price data, volume data

**Outputs:**
- `trend_score` (SMA alignment)
- `momentum_score` (3m/6m/12m returns)
- `breakout_score` (distance to highs)
- `extension_score` (overbought/stretched)

**Purpose:** Capture trend persistence and price behavior.

### Sentiment/NLP Agent

**Inputs:** Earnings transcripts, filings, news

**Outputs:**
- `concreteness_score` (specific vs vague language)
- `sentiment_score` (non-generic tone)
- `narrative_strength_score`
- `AI_execution_score` (if relevant)

**Purpose:** Capture qualitative signals not in structured data.

### Macro/Regime Agent (Optional)

**Inputs:** Index data, VIX, liquidity metrics, macro calendar (FOMC, CPI, earnings)

**Outputs:**
- `regime_state` (trend, volatility, liquidity)
- `regime_score` (favorable vs unfavorable)

**Purpose:** Determine when signals are reliable.

## Feature Store

All features stored as:
```
date, ticker,
fundamental_features,
technical_features,
sentiment_features,
macro_features
```

Requirements: numeric, timestamped, reproducible, point-in-time correct.

## Ranking Engine

Converts features into single score.

```
Final Score = w1 * Fundamental Score
            + w2 * Technical Score
            + w3 * Sentiment Score
```

Daily: rank all stocks → assign score + rank percentile.
Output: `date, ticker, score, rank`

Later stage: rank aggregation or ML models.

## Strategy Rules

**Entry:** Buy top-ranked stocks at next open OR same close.

**Exit:**
- Trailing stop (ATR or percentage)
- Max holding period
- Rank deterioration
- Optional regime filter

## Portfolio Construction

- Number of positions (N)
- Equal weight or score-weighted
- Max position size
- Max % of ADV traded
- Optional sector caps

## Backtest Requirements

Must include:
- Realistic execution (slippage, commissions)
- Walk-forward validation
- Regime-based testing
- Parameter sensitivity testing

**Metrics:** CAGR, Sharpe ratio, max drawdown, turnover, hit rate

## Agent Role Clarification

Agents act as:
- Feature generators
- Data interpreters
- Explanation layer
- Risk validation layer

Agents are NOT:
- Portfolio managers
- Trade decision makers
- Optimization engines

They operate as structured intelligence layer.

## Five Core Alphas

### Alpha 1: Infrastructure Constraint Nowcast
**Signal:** `constraint_score` from transcript language + macro proxies + pricing power
**Edge:** Supply constraints create early winners before market repricing

### Alpha 2: Margin Before Revenue
**Signal:** Margin expansion + productivity metrics + AI deployment confirmation
**Edge:** Markets underreact to early cost improvements

### Alpha 3: Narrative vs Numbers
**Signal:** `Narrative Score − Delivery Score`
**Edge:** Markets misprice credibility

### Alpha 4: Regime Conditioning
**Signal:** Volatility + trend + liquidity + macro attention
**Action:** Enable/disable signals based on regime

### Alpha 5: Analyst Revision Diffusion + Tone Gating
**Signal:** Estimate revisions + derivatives + dispersion + management tone
**Edge:** Improved post-earnings drift capture

## System Integration Stack

```
Step 1: Macro → constraint nowcast
Step 2: Micro fundamentals → margin signal
Step 3: Behavioral filter → narrative divergence
Step 4: Confirmation → analyst revisions
Step 5: Timing → regime conditioning
Step 6: Execution → screener + ranking + portfolio
```

## Core Principles

- Agents generate features, not decisions
- Point-in-time correctness is mandatory
- Signals must be testable and reproducible
- Simplicity > complexity in early stages
- Alpha comes from feature quality, not architecture
- Avoid non-deterministic logic in backtests
- Separate data, features, and decisions cleanly

## See Also
- [[Agilith-Alpha-Stack-System]] — Signal pipeline (same content, less detailed)
- [[Agilith-Data-Stack]] — Data infrastructure for this system
- [[Regime-modeling]] — Regime framework for conditioning
- [[Bottleneck-analysis]] — Infrastructure bottleneck alpha (Alpha 1)