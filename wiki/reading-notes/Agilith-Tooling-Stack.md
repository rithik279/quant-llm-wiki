---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Alpha-Stack-System, Agilith-Data-Stack]
status: active
tags: [agilith-capital, tooling, development, stack]
---

# Agilith Tooling Stack

Development environment and tooling for the Agilith quant system.

## Core Stack

| Component | Provider | Cost | Role |
|-----------|----------|------|------|
| LLM Platform | Claude Max | $100/mo | Research, coding, agents, orchestration |
| Dev Environment | VS Code + GitHub | Free | Python pipelines, backtesting, version control |
| Charting | TradingView Pro | ~$50/mo | Real-time monitoring, pattern analysis, MCP with Claude |
| Cloud (Optional) | Runpod / AWS | Usage-based | Large-scale text processing, batch backtesting |

## Claude Max — Central Hub

Role: Single unified interface for:
- Research and analysis
- Coding and debugging
- Agent development
- Workflow orchestration

Rationale: Consolidate workflows into one LLM platform. Prior experience shows strong productivity gains when fully leveraging Claude capabilities.

## Development Environment

**Visual Studio Code + GitHub**
- Standard stack for Python pipelines
- Backtesting frameworks
- Version control

**Local Machine Requirements**
- MacBook Air (M4/M5) with high RAM
- OR Windows laptop: modern processor, 16GB RAM minimum, 24GB+ preferred

Used for: data pipelines, backtesting, simulations (walk-forward, optimization), multi-tab parallel workflows.

## TradingView Pro

Why TradingView:
- Real-time price monitoring
- Chart pattern analysis
- Visual signal validation
- Existing MCP integration with Claude via desktop app

Provides fast feedback loop between systematic signals and real-time market behavior.

**MCP Integration**: TradingView + Claude = desktop app integration. Enables real-time market data in Claude workflow.

## Python Stack

Core libraries:
- pandas, numpy — data manipulation
- requests — API calls
- Standard ML/NLP tooling

Reference repositories:
- alpha-gpt
- TradingAgents (Tauric)
- TradingView MCP + Claude integration

## Cloud Compute (Optional)

**Runpod / AWS**
- Not required for MVP
- Used for: large-scale text processing, batch backtesting, scaling simulations
- Only when necessary

## Research Acceleration Tools

| Tool | Cost | Use |
|------|------|-----|
| Quantpedia | ~$33/mo | Strategy idea discovery, 1000+ validated strategies |
| 3ai.co | TBD | AI-driven research, potential dataset enrichment |
| HUD.ai | TBD | Agent training scenarios |
| avanzai_open | TBD | Infrastructure data |

## System Design Philosophy

"Maximize productivity through a unified AI-first workflow (Claude Max). Lean and focused toolset. Strong local compute for iteration. Cloud only when necessary."

**Goal**: Iterate fast, test wide range of ideas using modern tooling. Single validated strategy or adapted signal from Quantpedia = huge value.

## Development Philosophy

1. Start simple
2. Build one working pipeline: data → features → backtest
3. Validate signals before scaling
4. Add complexity only after proven

**Constraints**:
- DO NOT jump to RL or complex agents first
- DO NOT over-focus on tools
- PRIORITY = validate signals

## See Also
- [[Agilith-Data-Stack]] — Data infrastructure
- [[Agilith-Alpha-Stack-System]] — Signal system
- [[Agilith-Research-Plan]] — Signal ideas