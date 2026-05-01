---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 4
related_pages: [Agilith-System-Architecture, Agilith-Alpha-Stack-System, Regime-modeling, Leopold-thesis]
status: active
tags: [momentum, strategy, breakout, evaluation, system-design]
---

# Momentum System Design (ChatGPT Sources)

Breakout-based momentum strategy for US growth equities. Foundation for the Agilith systematic engine.

## Breakout Strategy Foundation

**Initial system:**
- Breakout screener identifies stocks making new highs
- Outputs different tickers daily (rolling signals)
- Each (date, ticker) = one independent trade

**Baseline test:**
- Entry: buy on signal day (close or next open)
- Exit: fixed holding period (~40 trading days / 2 months)

**Dataset structure:**
```
date, ticker, entry_price, exit_price, return
```

## Evaluation Framework

### Signal-Level Evaluation

- Mean return
- Median return
- Win rate
- Return distribution
- Tail behavior

### Portfolio-Level Simulation

- Max positions constraint (e.g., 10)
- Equal weighting
- Rolling entries/exits
- Daily rebalancing
- Track: portfolio value, drawdown, Sharpe

### Time Segmentation

Evaluate across:
- Bull markets
- Bear markets
- Sideways regimes

### Time Decay Analysis

Returns at: 5, 10, 20, 40 days

**Key observation:** Distribution more important than mean. Momentum expected to have fat tails. Signals overlap (non-independent).

## Post-Screener Scoring (4 Dimensions)

Upgrade from "list of breakouts" → "ranked + filtered breakout candidates"

| Dimension | Weight | Components |
|-----------|--------|------------|
| Trend Strength | 35% | 20D/60D return, distance from MAs, price structure |
| Relative Strength | 30% | vs QQQ, vs sector, leadership detection |
| Confirmation | 20% | volume spike, follow-through, consolidation quality, rejection behavior |
| Growth/Fundamentals | 15% | EPS revisions, revenue growth, earnings surprises, guidance |

## Agent Scenarios (Tool-Based)

Agent operates using structured tools, not raw data.

### Tool Examples
- `get_momentum_profile`
- `get_relative_strength`
- `get_breakout_quality`
- `get_growth_snapshot`
- `get_risk_flags`

### Five Agent Scenarios

**1. Ranking Explanation**
- Explain why top candidates rank highly
- Identify key drivers
- Identify invalidation conditions

**2. Trade Decision**
- Output: BUY / WATCH / SKIP
- Include: reasoning, risk level, expected continuation

**3. Factor Weighting**
- Adjust importance of factors based on regime
- Example: strong trend → momentum weight high; chop → confirmation weight high

**4. Post-Trade Reflection**
- Evaluate: entry quality, regime alignment, cause of outcome

**5. Regime Classification**
- Identify: trend, chop, risk-off

## Regime Classification

**Three-state model:**
- Trend (risk-on)
- Chop (mean-reversion)
- Risk-off (downtrend)

**Rule-based approach (initial):**
- Index vs 50DMA / 200DMA
- Breadth (% above MA)
- Volatility
- Breakout performance

**HMM approach (later):**
- Inputs: index returns, volatility, breadth, momentum factor returns, breakout strategy returns
- Output: latent states mapped to regimes

**Alternative:** Classify regimes directly from strategy performance ("when breakouts work vs fail")

**Usage:**
- Adjust position sizing
- Adjust trade frequency
- Adjust entry strictness

## Scenario-Based Evaluation

Evaluation is scenario-based, not just PnL.

**Six eval scenarios:**
1. Clean breakout
2. Fake breakout
3. Late-stage extension
4. Earnings-driven breakout
5. Leader breakdown
6. Low-quality growth trap

**Goal:** Train system to classify breakout quality.

**Reward design:**
- Forward return (risk-adjusted)
- Drawdown penalty
- Overextension penalty
- Regime alignment
- Reasoning quality

## AI Paper Insights (Leopold Connection)

**Three drivers of AI progress:**
- Compute scaling
- Algorithmic improvements
- "Unhobbling" (agents vs chat models)

**Full-stack economic shift:**
- Value distributed across layers: infrastructure, algorithms, deployment

**Key insight:** Bottlenecks shift over time. Edge comes from tracking bottleneck movement.

**Barbell structure:**
- Side 1: infrastructure / picks-and-shovels
- Side 2: agent / application / asymmetric upside

## System Integration

**Call structure (for Patrick presentation):**
1. AI framework (three drivers, shifting stack)
2. Design principles (system-based, multi-layer, adaptive)
3. Alpha ideas (momentum, breakout ranking, regime filtering)
4. Tools (data sources, agent systems, LLM workflows)
5. Role discussion

## See Also
- [[Agilith-System-Architecture]] — Full pipeline this is foundation for
- [[Agilith-Alpha-Stack-System]] — 5-layer alpha pipeline
- [[Regime-modeling]] — RISK_ON/CHOP/RISK_OFF framework
- [[Bottleneck-analysis]] — Bottleneck tracking thesis