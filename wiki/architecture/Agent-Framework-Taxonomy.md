---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 5
related_pages: [RocketShip-Framework, Agent-Tools, Agilith-Alpha-Stack-System, Leopold-thesis, 4-Month-Build-Plan]
status: active
tags: [architecture, agents, taxonomy, unified, framework]
---

# Agent Framework: Unified Taxonomy

Three agent frameworks exist across docs. This doc maps them all.

## The Three Frameworks

| Framework | Source | Agents/Tools | Purpose |
|-----------|--------|-------------|---------|
| Proposal | Executive OnePager | 3 agents | MVP execution |
| Execution | Agent-Tools.md | 6 tools | Daily ops |
| Reasoning | RocketShip | 10 tools | Deep analysis |

## Framework 1: Proposal (3 Agents)

```
DATA → [Revision Agent] → [Constraint Agent] → [Regime Agent] → SIGNALS → OUTPUT
```

### Agent 1: Revision Agent
**Input:** Earnings, estimates, revisions
**Output:** Analyst revision momentum signals
**Alpha connection:** Alpha 4 (Analyst Revision Diffusion + Tone Gating)
**Leopold connection:** Indirect — revisions reveal which bottleneck plays gaining traction

### Agent 2: Constraint Agent
**Input:** Infrastructure data, grid reports, news
**Output:** Bottleneck severity + emerging constraint signals
**Alpha connection:** Alpha 1 (Infrastructure Constraint Nowcast)
**Leopold connection:** DIRECT — Constraint Agent IS Leopold thesis execution
**What it does:** Monitors power/compute/memory/storage/optical constraints, detects when one becomes critical

### Agent 3: Regime Agent
**Input:** VIX, spreads, index data, macro calendar
**Output:** Market state classification
**Alpha connection:** Alpha 5 (Regime-Conditioned Sentiment)
**Leopold connection:** Regimes condition when Leopold signals fire

## Framework 2: Execution Tools (6 Tools)

Deployed by Claude during daily ops. Mapped to Proposal agents:

| Tool | Calls Agent | Purpose |
|------|------------|---------|
| fetch_portfolio_news | Regime Agent | News → sentiment → market state |
| analyze_sentiment | Revision Agent | Quantify catalyst bullishness |
| screen_candidates | Constraint Agent | Find plays matching bottleneck thesis |
| rank_and_score_candidates | Constraint Agent | Cross-theme ranking |
| detect_bottleneck_emergence | Constraint Agent | Second-order bottleneck detection |
| suggest_trades | All agents | Final trade recommendation |

**Bottleneck detection is the alpha.** detect_bottleneck_emergence is the key tool.

## Framework 3: Reasoning Tools (10 Tools from RocketShip)

Used during deep analysis. Layer above execution tools.

### Reasoning Tools (maps to Proposal agents)

| Tool | Agent | Purpose |
|------|-------|---------|
| fetch_thesis_alignment | Constraint Agent | Is market in Leopold state? |
| compute_bottleneck_severity | Constraint Agent | Quantify supply/demand gap |
| fetch_sentiment_signals | Revision Agent | Media + social + technical sentiment |
| estimate_market_timing | Regime Agent | Entry/exit confidence |
| reason_to_trade | All | Final decision engine |
| compute_portfolio_snapshot | All | Current state before new decisions |

### Learning Tools

| Tool | Purpose |
|------|---------|
| post_trade_reflection | Was thesis correct? |
| identify_failure_patterns | Recurring mistakes |
| adjust_factor_weights | Regime-conditional factor emphasis |

### Conviction Tool

| Tool | Purpose |
|------|---------|
| evaluate_conviction_level | Quantify confidence (80+=HIGH execute, 50-79=consider, <50=skip) |

## Unified Architecture

```
PROPOSAL (3 agents)
    ↓ maps to
EXECUTION TOOLS (6 tools)
    ↓ feeds
ROCKETSHIP REASONING (10 tools)
    ↓ outputs
TRADE DECISIONS
    ↓ feeds
LEARNING LOOP (post_trade_reflection, identify_failure_patterns, adjust_factor_weights)
```

**Key insight:** Proposal agents → Execution tools → Reasoning tools is evolution, not contradiction. Each layer adds capability.

## Leopold in Framework

Leopold thesis maps to each layer:

### Proposal Layer
- **Constraint Agent:** Directly monitors 5 bottlenecks (power/compute/memory/storage/optical)
- **Revision Agent:** Tracks analyst revisions on bottleneck plays
- **Regime Agent:** RISK_ON = full Leopold exposure, RISK_OFF = Leopold thesis paused

### Execution Layer
- **detect_bottleneck_emergence:** Primary Leopold monitoring tool
- **screen_candidates:** Finds bottleneck beneficiaries matching criteria

### Reasoning Layer
- **fetch_thesis_alignment:** Checks if market in Leopold state before trade
- **compute_bottleneck_severity:** Quantifies which bottleneck is critical

### Alpha Stack Layer
- **Alpha 1:** Infrastructure Constraint Nowcast = Leopold execution
- **Alpha 4:** Analyst Revision Diffusion = Leopold confirmation
- **Alpha 5:** Regime-Conditioned = Leopold timing

## Leopold Ideology (Not Named, But Present)

Proposal doesn't use "Leopold" or "bottleneck rotation" — but ideology is there:

### What Proposal Says
> "An agent-based quantitative system for US growth equities, combining momentum signals with fundamental analysis."
> "Analyst revision momentum + margin-based signals + regime detection = systematic alpha generation."

### What It Means (Leopold framing)
> "A system that identifies infrastructure bottlenecks in the AI buildout and trades the constraint rotation."
> "Revision momentum reveals which bottleneck plays are gaining traction. Margin signals show who wins before revenue. Regime detection times when to act."

### Gap
Proposal's framing is generic "growth equities + momentum". Doesn't capture the specific thesis: AI infrastructure buildout creates 5 bottleneck rotation opportunities.

**Fix:** Update proposal framing to: "Agent-based system for US infrastructure equities, trading the AI buildout bottleneck rotation."

## Regime Conditioning Map

| Regime | Leopold Action | Proposal Agent | Tool |
|--------|---------------|----------------|------|
| RISK_ON | Full exposure | All agents active | compute_bottleneck_severity (critical) |
| TRANSITION | Reduce, wait | Regime agent dominant | estimate_market_timing (mixed signals) |
| RISK_OFF | SPY hedge, exit | Agents reduce activity | fetch_thesis_alignment (low) |
| RECOVERY | Rebuild positions | Constraint agent first | detect_bottleneck_emergence (watching) |

## See Also
- [[RocketShip-Framework]] — 10 reasoning tools details
- [[Agent-Tools]] — 6 execution tools details
- [[Agilith-Alpha-Stack-System]] — Alpha layers map to agents
- [[Leopold-thesis]] — Core thesis (not named in proposal but executed)
- [[4-Month-Build-Plan]] — Month 1 MVP builds Proposal agents, Month 2 extends to RocketShip
- [[Failure-Patterns]] — Post-trade reflection + failure pattern tools