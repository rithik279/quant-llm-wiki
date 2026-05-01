---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [log]
status: active
tags: [meta, index, wiki-root]
---

# Wiki Index

## Reading Notes
- [[Situational-Awareness]] — Leopold Aschenbrenner's public essay on AGI timeline, OOM counting, infrastructure buildout
- [[AI-AGI-Timeline]] — Timeline projections for AGI and superintelligence
- [[Intelligence-Explosion]] — Automated AI research, recursive improvement
- [[Intelligence-Explosion-Mechanism]] — AlphaGo analogy, recursive self-improvement details
- [[Superalignment]] — The unsolved problem of controlling superintelligence
- [[Scalable-Oversight]] — RLHF won't scale, trust handoff problem
- [[The-Project]] — Government involvement in AGI by 2027-28
- [[The-Project-Detail]] — Manhattan Project parallel, wake-up sequence, timeline
- [[Security-for-AGI]] — National security threat, labs treating AGI like SaaS
- [[Compute-Scaling]] — Deep dive on compute driving AI progress
- [[Compute-Appendix]] — Cluster cost calculations, FLOP/$ trends
- [[Unhobbling]] — How models go from chatbot to agent
- [[Situational-Awareness-Cultural]] — SF network, "few hundred who see the future first"

## Core
- [[Leopold-thesis]] — The trading thesis: bottlenecks in AI infrastructure buildout
- [[Bottleneck-analysis]] — The five bottlenecks: power, compute, memory, storage, optical

## Architecture
- [[Infrastructure-Buildout]] — $1T clusters, 100GW power by 2030

## Regime Modeling
- [[Regime-modeling]] — Overview of four-regime framework
- [[Regime-indicators]] — VIX and credit spread signals
- [[RISK_ON]] — Full exposure, VIX<20, spreads<400bps
- [[TRANSITION]] — 70% exposure, VIX 20-30, spreads 400-600bps
- [[RISK_OFF]] — 20% exposure, VIX>30, spreads>600bps
- [[RECOVERY]] — 50% exposure, VIX declining from peak

## Agilith Capital (Internship)
- [[Agilith-Internship-Overview]] — Key people, core thesis, three research streams
- [[Agilith-Learning-System]] — 16-week learning structure and curriculum
- [[Agilith-Research-Plan]] — Tier A/B alpha ideas (Infrastructure, Margin, Delay, AI Surprise, Liquid Cooling)
- [[Agilith-Investment-Thesis]] — Call flow outline, key phrases, pitch strategy
- [[Agilith-Strat-Priorities]] — Next 5 advanced alpha ideas
- [[Agilith-Call-Notes]] — Key quotes from Patrick/Aidan conversations
- [[Agilith-System-Architecture]] — Full system pipeline, agent roles, screener mechanics
- [[Agilith-Data-Stack]] — MVP data infrastructure (FMP, SEC EDGAR, FRED)
- [[Agilith-Tooling-Stack]] — Development stack (Claude Max, VS Code, TradingView)
- [[Agilith-Alpha-Stack-System]] — Signal pipeline: Macro→Micro→Behavioral→Confirmation→Timing
- [[Agilith-Momentum-System]] — Breakout foundation, scoring dimensions, agent scenarios
- [[Agilith-Data-Stack-Deep]] — Full input spec, data categories, point-in-time requirements
- [[Agilith-Custom-Indicators]] — HMM, Hurst, ADX, EMA derivatives
- [[Agilith-Investment-Philosophy]] — Three-layer framework, money flow, overfitting insight

## Architecture (Implementation)
- [[System-Architecture]] — Agentic loop, daily/weekly flow, cost comparison
- [[Agent-Tools]] — 6 tools (fetch_news, sentiment, screen, rank, bottleneck, trades)
- [[4-Month-Build-Plan]] — Foundation → Regime → Backtesting+RL → Deploy
- [[RL-Training-Setup]] — State/action space, reward function, 100+ scenarios
- [[RocketShip-Framework]] — Multi-agent debate fork, 10 tools, monthly success criteria
- [[LEAP-Options]] — Week 15 options overlay, structure, parameters, conviction trigger
- [[Failure-Patterns]] — Post-trade reflection, pattern identification, learning loop

## Decisions (Audit Trail)
- [[RocketShip-Decision]] — Why fork vs build, 5 reasons, alternatives considered
- [[Domain-Wiki-System]] — LLM Wiki pattern, three-layer separation, master prompt approach
- [[Intern-Journey]] — Call prep → offer accepted, key decisions, outcomes
- [[Academic-Strategy]] — Management Specialist decision, 2.5 FCE freed, degree marketing
- [[Alpha-Math]] — $10M AUM context, expected value framework, resource justification
- [[Negotiation-Strategy]] — SF startup leverage, two offers, anchoring approach
- [[Tool-Comparison]] — Why not LangChain, custom build, hard-coded rules
- [[AI-Supply-Chain]] — Extended stock universe beyond 5 core holdings

## System Connections
- [[Agilith-Alpha-Stack-System]] connects Tier A ideas → [[Bottleneck-analysis]]
- [[Agilith-Momentum-System]] connects to [[Agilith-Investment-Philosophy]] (momentum + options)
- [[Agilith-Custom-Indicators]] provides regime detection methods for [[Regime-modeling]]
- [[Agilith-Data-Stack-Deep]] extends [[Agilith-Data-Stack]] with full spec
- [[Agilith-Investment-Philosophy]] connects [[Leopold-thesis]] to three-timeframe approach
- [[System-Architecture]] is the implementation of [[Agilith-System-Architecture]] (Claude agent)
- [[Agent-Tools]] provides the 6 tools powering [[System-Architecture]]
- [[4-Month-Build-Plan]] drives implementation order for [[Agilith-System-Architecture]]
- [[RL-Training-Setup]] is the RL layer from the [[4-Month-Build-Plan]] (Month 3)
- [[RocketShip-Framework]] extends [[Agilith-System-Architecture]] with multi-agent debate
- [[Agent-Tools]] layer feeds into [[Agilith-Alpha-Stack-System]] (signal → rank → trade)
- [[RocketShip-Decision]] documents the fork decision driving [[4-Month-Build-Plan]] Month 1
- [[RocketShip-Framework]] 10 tools are the reasoning layer above [[Agent-Tools]] 6 execution tools
- [[AI-Supply-Chain]] extends [[Bottleneck-analysis]] with 5 additional supply chain layers
- [[LEAP-Options]] connects [[Agilith-Momentum-System]] conviction scoring to options sizing
- [[Failure-Patterns]] closes the loop between [[System-Architecture]] outputs and [[4-Month-Build-Plan]] Month 3 RL training
- [[Alpha-Math]] justifies resource allocation for [[Agilith-Research-Plan]] experiments
- [[Domain-Wiki-System]] is the meta-layer organizing all of the above

## Master Reference
- [[SYSTEM]] — **Start here.** Complete system overview, one doc to understand everything

## Sources
- [[log]] — Append-only changelog
- [[index]] — This file