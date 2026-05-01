---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Situational-Awareness, Infrastructure-Buildout, Regime-modeling]
status: active
tags: [leopold-thesis, ai-infrastructure, bottleneck]
---

# Leopold Thesis

Quantitative equity research system identifying non-obvious infrastructure bottlenecks in the AI boom and trading on them.

## Thesis Statement

The AI race requires massive infrastructure buildout. The bottlenecks in this buildout — power, compute, memory, storage, optical interconnects — create asymmetric investment opportunities that the market underestimates.

## The Five Bottlenecks

1. **Power** — Grid capacity, voltage transformers, power contracts. "Fierce scramble to secure every power contract still available for the rest of the decade."
2. **Compute** — GPU/TPU supply, cluster construction. Zuck bought 350k H100s. $100B+ clusters by 2028.
3. **Memory** — HBM, DRAM capacity. GPU memory bandwidth is bottleneck for frontier models.
4. **Storage** — NAND, SSD. Training data volumes exploding.
5. **Optical** — Interconnects, fiber. Bandwidth between GPUs/Nodes is critical at scale.

## Key Insight from Situational Awareness

> "By the end of the decade, American electricity production will have grown tens of percent... hundreds of millions of GPUs will hum."

This is the power thesis. This is the compute thesis. This is the memory, storage, optical thesis.

## Timeline Alignment

- **2025-27**: AGI. $100B clusters, 1GW power requirements
- **2027-28**: Government Project begins, more infrastructure
- **2030**: $1T clusters, 100GW power, 100M GPUs

## Why This Matters for Trading

Traditional equity analysis misses this because:
1. They underestimate timeline (think 10+ years not 3-5)
2. They underestimate magnitude (trillions not billions)
3. They underestimate the bottlenecks

## See Also
- [[Bottleneck-analysis]]
- [[Situational-Awareness]]
- [[Infrastructure-Buildout]]
- [[Portfolio-holdings]]
- [[Agilith-Alpha-Stack-System]] — Alpha Layer 1 = direct Leopold execution
- [[RocketShip-Framework]] — BottleneckScore maps Leopold to trading signal
- [[Agent-Tools]] — detect_bottleneck_emergence tool IS Leopold monitoring
- [[Regime-modeling]] — RISK_ON = Leopold uptrend, RISK_OFF = Leopold thesis paused
- [[RL-Training-Setup]] — RL state space includes bottleneck_score, training scenarios rotate through Leopold plays
- [[4-Month-Build-Plan]] — Month 1 builds Leopold-aware pipeline
- [[Agilith-Investment-Thesis]] — "bottleneck moved to infrastructure" = Leopold pitch to Patrick
- [[Alpha-Math]] — $10M AUM opportunity, 5 bottleneck plays justify spend
- [[Tool-Comparison]] — Why RocketShip chosen: focused on thesis (Leopold), not generic agents
- [[Failure-Patterns]] — Post-trade reflection checks bottleneck thesis validity
- [[Agilith-System-Architecture]] — Agent feature layer monitors infrastructure constraints
- [[Agilith-Strat-Priorities]] — Advanced alpha (6-10) builds on Leopold foundation
- [[Agilith-Research-Plan]] — Tier A alpha ideas all derive from Leopold bottleneck rotation

## Leopold as Keystone

Leopold connects everything:
```
Infrastructure Buildout
    ↓ Leopold IS the buildout thesis
Bottleneck Analysis (5 bottlenecks)
    ↓ maps to
Alpha Stack Layer 1 (Infrastructure Constraint Nowcast)
    ↓ feeds
RocketShip BottleneckScore (0.4× technical + 0.3× bottleneck_fit)
    ↓ executed via
Agent Tools (detect_bottleneck_emergence)
    ↓ timed by
Regime Modeling (RISK_ON = full Leopold exposure)
    ↓ trained in
RL Setup (scenarios rotate through bottleneck plays)
    ↓ tracked in
Post-Trade Reflection (checks bottleneck thesis validity)
```

Every component: feeds or derives from Leopold.