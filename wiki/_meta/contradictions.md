---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 0
related_pages: []
status: active
tags: [meta, contradictions, conflicts]
---

# Contradictions

## Contradiction 1: Data Stack Scope
- **Old claim:** 4-Month-Build-Plan Week 1 only mentions FMP API, SEC EDGAR, FRED
- **New claim:** Agilith Executive OnePager lists 8 data sources (Alpha Vantage, Financial Modeling Prep, SEC EDGAR, FRED, Quantpedia, 13Radar, Predmktdata, Quant Investing)
- **Source:** Agilith-OnePager-Ingest.md
- **Pages affected:** [[4-Month-Build-Plan]], [[Agilith_OnePager]]
- **Status:** Pending — needs resolution on which data stack to use

## Contradiction 2: Agent/Tool Taxonomy Confusion — RESOLVED
- **Old claim:** Three different docs show different counts (3 agents vs 6 tools vs 10 tools)
- **Resolution:** Created [[Agent-Framework-Taxonomy]] — unified mapping showing evolution not contradiction
- **Source:** Agent-Framework-Taxonomy.md
- **Pages affected:** [[4-Month-Build-Plan]], [[Agent-Tools]], [[RocketShip-Framework]]
- **Status:** Resolved — Proposal (3 agents) → Execution (6 tools) → Reasoning (10 tools) is progression

## Contradiction 3: Leopold Thesis Naming Gap
- **Old claim:** Agilith-Alpha-Stack-System explicitly names "Leopold Infrastructure Bottleneck Rotation" as Alpha Layer 1
- **New claim:** Agilith Executive OnePager doesn't mention "Leopold thesis", "bottleneck rotation", or explicitly name the core infrastructure thesis
- **Source:** Agilith-Alpha-Stack-System vs. Agilith Executive OnePager
- **Pages affected:** [[Leopold-thesis]], [[Agilith-Alpha-Stack-System]], [[Agilith-OnePager-Ingest]]
- **Status:** Pending — core thesis unnamed in proposal itself

## Contradiction 4: HMM vs GMM for Regime Detection
- **Old claim (Ch3):** "HMM seductive but fictional" for regime detection. Hidden states not directly useful.
- **New claim (Ch6):** Two Sigma uses GMM for regime detection. GMM posterior → regime probability.
- **Source:** [[Chan-Chapter1-3-NoCode-ML]] vs [[Chan-Chapter4-8-Generative-Models]]
- **Resolution:** Use **GMM with observable indicators** for regime detection, not pure HMM hidden states.
- **Pages affected:** [[Regime-modeling]], [[Agilith-Alpha-Stack-System]] Layer 5, [[RL-Training-Setup]]
- **Status:** Resolved — [[Chan-Agilith-Integration]] documents resolution

---

When contradictions are found, document them here with:
- Old claim vs new claim
- Source of each
- Status: resolved / pending
- How resolved
- Pages affected