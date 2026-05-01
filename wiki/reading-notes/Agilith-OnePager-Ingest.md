---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 6
related_pages: [Agilith-Alpha-Stack-System, 4-Month-Build-Plan, RocketShip-Framework, Alpha-Math]
status: active
tags: [agilith-capital, planning, proposal, mvp, infrastructure]
---

# Agilith Proposal: Planning Artifacts Ingest

## Source Files

- `Agilith_Executive_OnePager_v4.pdf` — Core proposal document
- `Agilith_OnePager.html` — Same content as v4 PDF, formatted as web page
- `Agilith_OnePager_Final.pdf` — Same as v4
- `Agilith_Full_Proposal.docx` — Full proposal (binary, unparsed)

## System Overview (from proposal)

**Purpose:** Agent-based quantitative system for US growth equities, combining momentum signals with fundamental analysis.

**Core Thesis:** Analyst revision momentum + margin-based signals + regime detection = systematic alpha generation.

**Design Principle:** Start lean with free/low-cost data, validate signals, scale only after demonstrating edge.

## Architecture (from proposal)

```
DATA → AGENTS → SIGNALS → OUTPUT
(Price • Fundamentals) (Revision • Constraint • Regime) (Momentum • Margin-based • Sentiment) (Alpha Signals • Risk Filters)
```

**Note:** 3 agents (Revision, Constraint, Regime) in proposal vs. 6 tools in Agent-Tools.md vs. 10 tools in RocketShip-Framework.md. Need consolidation mapping.

## Data Stack (from proposal)

| Component | Source | Cost | Alpha Enablement |
|-----------|--------|------|-----------------|
| Market Data | Alpha Vantage + yfinance | $0–50/mo | Price pipelines, rapid backtesting |
| Core Data Layer | Financial Modeling Prep | $49/mo | Fundamentals, estimates, revisions |
| Raw Filings | SEC EDGAR | $0 | Point-in-time accuracy, NLP source |
| Macro Data | FRED API | $0 | Regime classification, timing signals |
| Screener | Quant Investing | ~$45/mo | Survivorship-free universe |
| Alternative: Prediction Markets | Predmktdata | ~$49/mo | Macro expectations, event probabilities |
| Alternative: Insider Activity | 13Radar | $0–12/mo | C-suite sentiment, alignment |
| Alternative: Strategy Research | Quantpedia | ~$33/mo | Accelerated alpha idea generation |

**Contradiction flagged:** 4-Month-Build-Plan Month 1 Week 1 only mentions FMP API, SEC EDGAR, FRED. Proposal lists many more data sources. Plan understates data scope.

## AI & Compute (from proposal)

| Component | Tool | Cost |
|-----------|------|------|
| LLM Platform | Claude Max | $100/mo |
| Charting | TradingView Pro | $50/mo |
| Development | VS Code + GitHub | $0 |
| Local Compute | Laptop (16GB RAM) | One-time |
| Cloud Compute | Runpod / AWS | Usage |

## Cost Summary (from proposal)

| Category | Cost |
|----------|------|
| MVP Monthly | $244–294 |
| Experimental (Alt data) | +$82–94/mo |
| One-time | Laptop |

This matches Alpha-Math: $150/mo AI & Compute + $49-99/mo data = $244-294/mo MVP.

## Proposal Connections to Existing Infrastructure

### Connects to: Agilith-Alpha-Stack-System
Proposal's 3 agents (Revision, Constraint, Regime) map to Alpha Stack layers:
- Revision Agent → Alpha 4 (Analyst Revision Diffusion)
- Constraint Agent → Alpha 1 (Infrastructure Constraint Nowcast = Leopold execution)
- Regime Agent → Alpha 5 (Regime-Conditioned Sentiment)

### Connects to: RocketShip-Framework
Proposal's simple pipeline (DATA → AGENTS → SIGNALS → OUTPUT) is the MVP version. RocketShip extends this with:
- 10 reasoning tools (vs. 3 agents in proposal)
- Multi-agent debate (bull/bear/regime/value/judge)
- More complex portfolio allocation

**Proposal is Month 1 MVP. RocketShip is Month 2+ extension.**

### Connects to: 4-Month-Build-Plan

**Gaps found:**
1. Plan Week 1 mentions FMP API, but proposal uses Financial Modeling Prep ($49/mo) not FMP. Need clarification: which fundamental data provider?
2. Plan doesn't mention Alpha Vantage, yfinance, Quantpedia, 13Radar, Predmktdata. These are in proposal.
3. Plan mentions "Week 1: Set up TradingView Pro" — matches proposal ($50/mo charting).

**Fix needed:** Update 4-Month-Build-Plan Week 1 data stack to include full proposal data stack.

### Connects to: Alpha-Math
Proposal's $244-294/mo matches Alpha-Math exactly. Both cite Aiden's $5k experiment threshold.

### Connects to: Agent-Tools.md
Proposal's 3 agents ≠ Agent-Tools.md 6 tools ≠ RocketShip 10 tools.
- Proposal: 3 agents (Revision, Constraint, Regime)
- Agent-Tools.md: 6 tools (fetch_portfolio_news, analyze_sentiment, screen_candidates, rank_and_score_candidates, detect_bottleneck_emergence, suggest_trades)
- RocketShip: 10 reasoning tools

**Need:** Create unified tool/agent taxonomy mapping all three to avoid confusion.

## Critical Cross-Reference: Leopold Connection

Proposal's "Infrastructure Constraint Nowcast" (Alpha Layer 1) IS Leopold thesis execution:

- **Layer 1 (Proposal):** AI demand → infrastructure bottlenecks → buy shovel sellers
- **Leopold (core):** Power/compute/memory/storage/optical bottlenecks → asymmetric opportunities

**Contradiction to flag:** Proposal says "Analyst revision momentum + margin-based signals + regime detection" — doesn't explicitly mention Leopold thesis or bottleneck rotation. The Alpha-Math and Agilith-Alpha-Stack-System connect these, but the proposal itself doesn't name Leopold.

**Fix:** Add "Leopold Infrastructure Bottleneck Rotation" as core thesis framing in proposal.

## Contradictions Found

1. **Data Stack Gap:** 4-Month-Build-Plan understates data sources vs. proposal
2. **Agent/Tool Taxonomy:** Proposal (3 agents) vs. Agent-Tools (6 tools) vs. RocketShip (10 tools) — no unified mapping
3. **Leopold Naming:** Proposal doesn't mention "Leopold thesis" or "bottleneck rotation" — core thesis unnamed in its own document

## See Also
- [[4-Month-Build-Plan]] — Needs update to include full data stack
- [[Agilith-Alpha-Stack-System]] — Connects proposal to alpha layers
- [[RocketShip-Framework]] — Proposal is MVP, RocketShip is extension
- [[Agent-Tools]] — Needs tool taxonomy consolidation
- [[Alpha-Math]] — Cost justification aligns
- [[_meta/contradictions]] — Full contradiction log