# Quant LLM Wiki — Claude Code Integration

This wiki is the knowledge base for the Agilith Capital trading system.

## Wiki Location
`C:\Users\manmi\GitHub\quant-llm-wiki\wiki\`

## What This Wiki Contains

- **Core thesis:** [[Leopold-thesis]] — AI infrastructure bottleneck rotation
- **Architecture:** Agent frameworks (3→6→10 tools evolution), RocketShip fork, RL training setup
- **Implementation:** [[4-Month-Build-Plan]] — Foundation → Regime → Backtesting → Deploy
- **Alpha system:** 5-layer stack (Macro→Micro→Behavioral→Confirmation→Timing)
- **Regime modeling:** RISK_ON/OFF/TRANSITION/RECOVERY framework

## How to Use in Other Projects

When working on Agilith-related code elsewhere:

1. Read relevant wiki pages directly
2. Don't re-derive knowledge from scratch
3. Cross-reference before implementing

Example queries:
- "What's the current agent tool schema?"
- "How does RL training state space look?"
- "What's the 4-month timeline for Month 3?"

## Key Pages by Task

| Task | Page |
|------|------|
| Agent implementation | [[Agent-Framework-Taxonomy]] |
| RocketShip integration | [[RocketShip-Framework]] |
| Regime detection | [[Regime-modeling]] |
| RL training | [[RL-Training-Setup]] |
| Alpha signals | [[Agilith-Alpha-Stack-System]] |

## Schema

- `wiki/_meta/index.md` — Full page catalog
- `wiki/_meta/log.md` — Ingest history
- `wiki/_meta/contradictions.md` — Contradiction log
- `wiki/core/` — Keystone pages (Leopold, bottlenecks)
- `wiki/architecture/` — Implementation docs
- `wiki/reading-notes/` — Source analyses

## Pattern

LLM Wiki pattern: drop sources → ingest → wiki maintained with cross-references + contradictions.

This wiki compounds knowledge over time. Each ingest touches 10-20 pages.