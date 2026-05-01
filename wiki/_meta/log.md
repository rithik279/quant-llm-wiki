---
date_created: 2026-04-30
date_updated: 2026-05-01
source_count: 1
related_pages: [index]
status: active
tags: [meta, log, changelog, audit]
---

# Wiki Changelog

All ingests in reverse-chronological order (most recent first).

---

## [2026-05-01] ingest | Planning Artifacts + Agent Framework Taxonomy

**Sources:**
- `raw/pdf/claude-planning-artifacts/Agilith_Executive_OnePager_v4.pdf` — Proposal document
- `raw/pdf/claude-planning-artifacts/Agilith_OnePager.html` — Same as v4 PDF

**Key NEW content:**

*Leopold Connections (drilled):*
- 16 connections added to [[Leopold-thesis]] → shows keystone role
- Leopold maps to every component: Infrastructure Buildout → Alpha Stack → RocketShip → Agent Tools → Regime Modeling → RL Training → Post-Trade Reflection
- Every component feeds or derives from Leopold

*Agent Framework Taxonomy (unified):*
- Created [[Agent-Framework-Taxonomy]] — maps 3 frameworks
- Proposal (3 agents) → Execution (6 tools) → Reasoning (10 tools) = evolution not contradiction
- Revision Agent → Alpha 4 (analyst revisions)
- Constraint Agent → Alpha 1 (Leopold execution) — directly monitors 5 bottlenecks
- Regime Agent → Alpha 5 (regime conditioning)

*Leopold Ideology in Proposal (not named but present):*
- "Infrastructure Constraint Nowcast" = bottleneck rotation thesis
- Proposal framing: "growth equities + momentum" — generic, misses specific thesis
- Fix: "Agent-based system for US infrastructure equities, trading AI buildout bottleneck rotation"

*Contradictions Found (3):*
1. Data stack scope (Plan vs Proposal) — Pending
2. Agent/tool taxonomy — RESOLVED via [[Agent-Framework-Taxonomy]]
3. Leopold naming gap in proposal — Pending

*4-Month-Build-Plan updated:* Week 1 now includes full proposal data stack

**Pages created:** 2
- [[Agent-Framework-Taxonomy]] — Unified agent/tool taxonomy
- [[Agilith-OnePager-Ingest]] — Planning artifacts analysis

**Pages expanded:** 2
- [[Leopold-thesis]] — 16 new connections to wiki pages
- [[4-Month-Build-Plan]] — Data stack scope fix

**Status:** Complete

---

## [2026-05-01] ingest | Claude Session Transcripts (domain wiki + intern journey)

**Sources:**
- `raw/claude/2026-05-01_domain-wiki-design-and-setup-FULL-CHAT.txt` — Domain wiki design session, LLM Wiki pattern, three-layer system, master prompt creation
- `raw/claude/Agilith_Full_Transcript.txt` — Full internship journey: call prep → offer → hardware → academic strategy → career vision
- `raw/claude/ROCKETSHIP_FRAMEWORK_ANALYSIS.txt` — Deep dive: RocketShip decision rationale, 10 tools, monthly success criteria

**Key NEW content:**

*Domain Wiki Design:*
- Three-layer system: Domain Wiki (trading knowledge) + Tool Knowledge (Claude usage) + Desk Manual (quick ref)
- LLM Wiki pattern compounds knowledge; Claude Projects re-derives each time — LLM Wiki wins for 4-month project
- Master prompt approach: one self-contained prompt with schema + Leopold context + folder structure + page templates
- 8 artifacts created: DOMAIN_WIKI_README, EXPORT_INSTRUCTIONS, FOLDER_STRUCTURE, schema, FIRST_INGEST_WALKTHROUGH, QUICK_REFERENCE, HOW_TO_USE_MASTER_PROMPT, MASTER_PROMPT
- Ingest order: meta-sources first (how wiki was built), then domain knowledge
- Claude Code can read raw/ directly and write wiki/ automatically — cleaner than chat copy-paste
- Separation rule: domain wiki ≠ tool knowledge; they evolve at different rates

*RocketShip Deep Dive (thinking process captured):*
- 5 reasons to fork: Time efficiency (100-150hr saved), proven architecture, maintenance via open source, scalability to RL, HUD.ai integration
- 10 RocketShip-specific tools (distinct from 6 execution agent tools):
  1. fetch_thesis_alignment — checks if market aligns with Leopold
  2. fetch_sentiment_signals — media/social/technical sentiment
  3. compute_bottleneck_severity — supply/demand imbalance per bottleneck
  4. estimate_market_timing — entry/exit confidence
  5. reason_to_trade — final decision
  6. compute_portfolio_snapshot — current holdings/P&L
  7. evaluate_conviction_level — confidence score 0-100
  8. post_trade_reflection — learn from own trades
  9. identify_failure_patterns — avoid repeating mistakes
  10. adjust_factor_weights — adapt to regime
- Monthly success metrics: Month 1 (baseline 40-60% win rate), Month 2 (-45%→-12% max DD, Sharpe 0.8→1.4), Month 3 (100k+ scenarios, 95%+ alpha confidence), Month 4 (Mistral 7B trained, 14% return, -10% DD, 1.8+ Sharpe)
- Why not alternatives: Build from scratch (150+hr, maintenance forever), LangChain (overkill, abstracts understanding), Hard-coded rules (fragile, can't adapt)
- Alternatives considered against: AgentKit, LangChain, Trading Bots (MetaTrader), hard-coded if-then

*Internship Journey (call prep → outcome):*
- Aiden's email signals: "expand into concrete plan" = execution test, "work together" = collaboration not competition
- Call structure: Opening (3-5min) → Substance (20-25min) → Logistics (5-10min)
- Key phrases scripted: opening anchor, value signal, comp anchor
- SF startup handling: don't volunteer, use as negotiation leverage
- Post-call signals: "very interested," "flexible on comp," "define what you need," "long-term if it works"
- Hardware spec: Dell Pro Max 16 Plus, RTX PRO 1000 (8GB GDDR7), 32GB DDR5 — signals serious commitment
- Compensation: $1,000 CAD/week, 3 months (~CAD 13,000)
- Negotiation strategy: SF number first → anchor with both in hand

*Academic Strategy:*
- Management Specialist + Finance Focus > Finance & Economics Specialist
- Finance access identical in both paths; Finance & Econ adds ECO208Y + five irrelevant ECO electives
- Management frees 2.5 FCE = room for CSC148, CSC207, MAT223, MAT235, STA237/238
- CR/NCR strategy: reserve for hard upper-year technical courses (MAT237, CSC311, CSC413, STA302, STA414)
- Degree marketing: "Finance & Statistics" or "Quantitative Finance & Statistics" — never "Management Specialist"
- Year 2 plan: MAT223 + CSC148 + STA257 (Fall), MAT235 + CSC207 + STA261 (Winter)
- Rotman peers vs Waterloo friends: benchmark against technical ambition, not commerce average

*Career Paths:*
- Builder path: AI engineer in finance → SF → founding/early equity (asymmetric upside)
- Allocator path: Excel at Agilith → learn fund ops → launch own fund (carry on AUM)
- Why Builder > Allocator now: AI+finance intersection early, code scales infinitely, 18 years old = can absorb risk
- SF strategy: Year 1-2 (stack + Agilith + ship projects), Year 2 Summer (SF fintech internship), Year 3 (deepen AI/ML), Year 4 (decide direction)
- Distribution channels: X, LinkedIn, GitHub, personal site, hackathons, trading competitions
- CFM reframe: "custom path > conveyor belt"; Agilith internship in first year already exceeds most CFM outcomes by Year 2-3

*Alpha Math:*
- $10M AUM context: +0.5% alpha = $50K impact = $5K spend justified
- 20% probability of adding 1% alpha = strongly positive expected value for $2K experiment
- Anything under $5,000 = "cheap" per Aiden; $50,000 range justifiable with 5% alpha proof

*AI Supply Chain Universe (new stocks not in portfolio):*
- Advanced Packaging: CoWoS sold out through 2027 → AMKR, ASX
- Power/Grid: 5-year interconnect queues → VRT, ETN
- Liquid Cooling: 1000W+ GPUs require it → VRT, MOD
- Nuclear/Uranium: Hyperscalers signing PPAs → CCJ, CEG
- Copper: 500k+ tons/year demand by 2030 → FCX

*Tech Stack (new details):*
- Signals: ta-lib, pandas-ta, numpy, scipy
- ML/Regime: hmmlearn, scikit-learn, statsmodels
- Backtesting: vectorbt, quantstats, backtrader
- Simulation: numpy, scipy.stats, joblib, ray
- Options: py_vollib, mibian
- Visualization: plotly, matplotlib, streamlit/dash

*LEAP Options Overlay (Week 15 hypothesis):*
- Structure: 70% core equity, 25% satellite, 5% LEAP calls
- Parameters: 12-18 month expiry, 10-20% OTM, delta 0.30-0.50
- Deploy only when conviction >= 7/10

**Pages created:** 11
- [[RocketShip-Framework]] (major expansion) — 10 tools, 5-reason decision rationale, monthly success criteria, why-not-alternatives
- [[RocketShip-Decision]] — Why fork RocketShip (time/proven/maintenance/scale/integration), decision matrix, impact on schedule/quality/career narrative
- [[Domain-Wiki-System]] — Three-layer system, LLM Wiki vs Projects, master prompt approach, 8 artifacts, Claude Code integration
- [[Intern-Journey]] — Complete journey from first call to offer accepted, key decisions, outcomes
- [[Academic-Strategy]] — Management Specialist decision, 5 freed courses, CR/NCR strategy, degree marketing
- [[Negotiation-Strategy]] — SF startup leverage, two offers in hand, anchoring approach
- [[Alpha-Math]] — $10M AUM context, expected value framework, resource justification
- [[AI-Supply-Chain]] — New stock universe beyond 5 core holdings, semiconductor universe
- [[LEAP-Options]] — Week 15 options overlay hypothesis, structure and parameters
- [[Tool-Comparison]] — Alternatives to RocketShip: why not LangChain, custom build, hard-coded rules
- [[Failure-Patterns]] — Post-trade reflection, pattern identification, learning loop

**Status:** Complete

---

## [2026-05-01] ingest | Claude Artifact Exports (claude-artifact folder)

**Sources:**
- `raw/pdf/claude-artifact/4_MONTH_BUILD_PLAN.md` — Full 4-month build plan
- `raw/pdf/claude-artifact/DEEP_DIVE_01_ARCHITECTURE.md` — System philosophy, agentic loop
- `raw/pdf/claude-artifact/DEEP_DIVE_02_TOOLS.md` — 6 agent tools
- `raw/pdf/claude-artifact/DEEP_DIVE_03_MODULES.md` — NewsAPI, IBKR, scheduler
- `raw/pdf/claude-artifact/DEEP_DIVE_04_CUSTOMIZATION.md` — Customization guide
- `raw/pdf/claude-artifact/ROCKETSHIP_ANALYSIS.md` — RocketShip multi-agent framework
- `raw/pdf/claude-artifact/DOMAIN_WIKI_README.md` — Wiki setup guide

**Key NEW content:**
- 4-month timeline: Foundation → Regime → Backtesting+RL → Training+Deploy
- RocketShip framework (ammar-adam/rocketship) — multi-agent debate system
- HUD.ai — removes 180+ hours of custom RL infrastructure work
- 6 agent tools: fetch_portfolio_news, analyze_sentiment, screen_candidates, rank_and_score_candidates, detect_bottleneck_emergence, suggest_trades
- Scoring: 30% technical, 25% momentum, 25% sentiment, 20% catalyst
- Conviction levels: HIGH (execute), MEDIUM (consider), LOW (skip)
- Monthly metrics: baseline 12% annual → RL target 14-15%, Sharpe 1.4-1.5
- RL training: 100+ scenarios (RISK_ON 70%, TRANSITION 20%, RISK_OFF 5%, RECOVERY 5%)
- Tool design > prompt engineering — "Tasksets are the moat"
- Blackwell 1000 GPU — local training capable (Mistral 7B, Qwen, 13B)
- Mentorship: PM (market/thesis) + Queen's AI engineer (technical/ML)
- Chan books: "Generative AI for Trading" + "Hands-On AI"
- Friend's agent traces — study before designing own tools
- Domain Wiki concept — persistent evolving knowledge base
- IBKR integration — paper trading mode available

**Pages created:** 5
- [[4-Month-Build-Plan]] — Month-by-month milestones, success metrics, mentorship, toolset
- [[Agent-Tools]] — 6 tools with input/output schemas, orchestration, conviction levels
- [[System-Architecture]] — Agentic loop, daily/weekly flow, cost comparison, implementation
- [[RL-Training-Setup]] — HUD.ai RL framework, state/action space, 100+ scenarios
- [[RocketShip-Framework]] — Multi-agent debate fork, custom agents, hybrid approach (now expanded)

**Contradictions flagged:** None
- Agent scoring (30% technical / 25% momentum / 25% sentiment / 20% catalyst) operates at ranking layer — distinct from momentum system scoring (Trend 35% / RS 30% / Confirmation 20% / Growth 15%) which operates at signal-extraction layer. No conflict.
- All other concepts consistent with prior ingests.

**Status:** Complete

---

## [2026-05-01] ingest | ChatGPT Exports (5 chats)

**Sources:**
- `raw/chatgpt/chat1.txt` — Agent-assisted systematic framework (architecture)
- `raw/chatgpt/chat2 - momentumsystem.txt` — Momentum system design + evaluation
- `raw/chatgpt/chat3 - aidrivenhedgefund.txt` — Hedge fund data stack deep dive
- `raw/chatgpt/Chat4 - planning discussion.txt` — System decomposition, agent roles, tools comparison
- `raw/chatgpt/Chat5 - tools.txt` — Investment philosophy, three-layer framework

**Key NEW content:**
- Momentum scoring dimensions: Trend 35%, RS 30%, Confirmation 20%, Growth 15%
- Agent scenarios: Ranking Explanation, Trade Decision (BUY/WATCH/SKIP), Factor Weighting, Post-Trade Reflection
- HMM inputs for regime classification (index returns, volatility, breadth, breakout returns)
- Six breakout quality scenarios for eval (clean, fake, late-stage, earnings-driven, leader breakdown, growth trap)
- Money Flow Analysis concept — large players act before price reflects it
- Overfitting as feature — identify conditions that made strategy work → reuse when repeat
- Custom momentum indicator: EMA derivatives (slope = 1st derivative, acceleration = 2nd derivative)
- Three-layer investment framework: Quantitative (short) + LLM (mid) + Fundamental (5-8yr)
- Barbel structure: Infrastructure vs Agent/application
- Alpha Strategy Design: Signal Engine + Regime Engine + Scenario Engine
- LLM Wiki conversion process: Raw dump → structured extraction → markdown → chunking → embeddings → vector DB
- System decomposition: Theme ID → Universe → Features → Alpha → Regime → Scenario → Portfolio
- Tool comparison: Claude for architecture, Cursor for implementation
- Reference frameworks: Alpha-GPT, Increase Alpha, 3AI

**REPEATED (high confidence — strengthened):**
- Agent generates features, NOT decisions
- Point-in-time correctness mandatory
- 5-layer alpha stack (Macro→Micro→Behavioral→Confirmation→Timing)
- Bottleneck shift = alpha source
- Regime-aware positioning

**Pages created:** 5
- [[Agilith-System-Architecture]], [[Agilith-Momentum-System]], [[Agilith-Data-Stack-Deep]], [[Agilith-Custom-Indicators]], [[Agilith-Investment-Philosophy]]

**Status:** Complete

---

## [2026-04-30] ingest | Agilith Capital PDFs

**Sources:**
- `raw/pdf/Agilith Capital Quantitative Fund Research Proposal (2).pdf` — 1 page, internship focus
- `raw/pdf/Agilith Capital Internship (2).pdf` — 110 pages, call notes, learning system, research plan
- `raw/pdf/Agilith Capital - Infrastructure Proposal (2).pdf` — 1 page (mostly empty)

**Key Takeaways:**
- 16-week learning curriculum: Stats → Regression → Time Series → Strategy Construction → Regime Modeling
- 5 core resources: Casella & Berger, Cowpertwait, Ilmanen, Ernest Chan ×2
- Five alpha ideas ranked Tier A/B:
  - Tier A: Infrastructure Constraint Nowcast, Margin Before Revenue, Transformer Delay
  - Tier B: AI Engagement Surprise, Liquid Cooling Inflection
- Three research streams: Factor research, Regime detection, Portfolio construction
- Patrick: value-based, 30 years experience, wants AI as opportunity
- Key thesis: "The bottleneck has moved from chips to infrastructure"

**Pages created:** 9
- [[Agilith-Internship-Overview]], [[Agilith-Learning-System]], [[Agilith-Research-Plan]], [[Agilith-Investment-Thesis]], [[Agilith-Strat-Priorities]], [[Agilith-Call-Notes]], [[Agilith-Alpha-Stack-System]], [[Agilith-Data-Stack]], [[Agilith-Tooling-Stack]]

**Status:** Complete

---

## [2026-04-30] ingest | Situational Awareness (Aschenbrenner)

**Source:** `raw/pdf/situationalawareness (1).pdf`

**Key Takeaways:**
- AGI by 2025-27 based on OOM counting (compute + algorithmic ~1 OOM/year)
- Intelligence explosion: AGI automates AI research → 5+ OOMs compressed into 1 year → superintelligence
- $1T individual training clusters by 2030, 100GW power (>20% US electricity)
- Government involvement by 2027-28 ("The Project")
- Superalignment: unsolved technical problem, catastrophic failure possible
- Security: labs handing AGI secrets to CCP, national security threat

**Pages created:** 19
- Reading notes: [[Situational-Awareness]], [[AI-AGI-Timeline]], [[Intelligence-Explosion]], [[Intelligence-Explosion-Mechanism]], [[Superalignment]], [[Scalable-Oversight]], [[The-Project]], [[The-Project-Detail]], [[Security-for-AGI]], [[Compute-Scaling]], [[Compute-Appendix]], [[Unhobbling]], [[Situational-Awareness-Cultural]]
- Core: [[Leopold-thesis]], [[Bottleneck-analysis]]
- Architecture: [[Infrastructure-Buildout]]
- Regime modeling: [[Regime-modeling]], [[Regime-indicators]], [[RISK_ON]], [[TRANSITION]], [[RISK_OFF]], [[RECOVERY]]

**Contradictions flagged:** None

**Status:** Complete

---

## [2026-04-30] init | Wiki structure created

**Action:** Created folder structure following MASTER_PROMPT.md schema

**Folders created:**
- `wiki/_meta/` — index, log, contradictions
- `wiki/core/` — Leopold thesis, bottlenecks
- `wiki/regime-modeling/` — RISK_ON, TRANSITION, etc
- `wiki/reading-notes/` — Source analyses
- `wiki/architecture/` — Infrastructure notes
- `wiki/decisions/` — Decision log
- `wiki/sources/` — Source summaries
- `raw/chatgpt/`, `raw/claude/`, `raw/google-docs/`, `raw/pdf/` — Source directories

**Status:** Complete
