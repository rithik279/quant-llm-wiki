---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 15
related_pages: [Leopold-thesis, Bottleneck-analysis, Agilith-System-Architecture, Regime-modeling, Agilith-Alpha-Stack-System, Agilith-Momentum-System, Agilith-Investment-Philosophy, System-Architecture, Agent-Tools, 4-Month-Build-Plan, RL-Training-Setup, RocketShip-Framework, RocketShip-Decision, Intern-Journey, Alpha-Math, LEAP-Options, Failure-Patterns, AI-Supply-Chain]
status: active
tags: [master, summary, system, overview, quick-reference]
---

# System Master Summary

## The One-Line Thesis

**AGI infrastructure buildout creates predictable bottlenecks in power, compute, memory, storage, and optical — invest in companies solving those bottlenecks, conditioned on market regime.**

Everything below flows from this.

---

## The Investment Thesis (Leopold Aschenbrenner)

### Why This Matters

- AGI by 2025-27: OOM counting (compute + algorithmic ~1 OOM/year)
- Intelligence explosion: AGI automates AI research → 5+ OOMs compressed into 1 year → superintelligence
- $1T individual training clusters by 2030, 100GW power (>20% US electricity)
- Government involvement by 2027-28 ("The Project")
- Superalignment: unsolved technical problem, catastrophic failure possible

### The Five Bottlenecks

| Bottleneck | Ticker | Why It's a Bottleneck |
|------------|--------|----------------------|
| Power generation | BE | Data center demand > grid supply |
| GPU compute | CRWV | H100 clusters scarce, buildout accelerating |
| Memory/HBM | MU | HBM3 needed for training, limited SK Hynix/Samsung capacity |
| Storage/NAND | SNDK | Model weights + training data explosion |
| Optical interconnects | LITE | Data center interconnects, latency-critical |

### The Bottleneck Shift

Bottlenecks migrate over time. Primary (GPU, memory) already priced in. Second-order (power delivery, liquid cooling, packaging) are the alpha source.

> "The bottleneck has moved from chips to infrastructure" — Patrick, Agilith Capital

### Extended AI Supply Chain Universe

Beyond the 5 core holdings, 5 additional layers:

| Layer | Bottleneck | Tickers |
|-------|-----------|---------|
| Advanced Packaging | CoWoS sold out through 2027 | AMKR, ASX |
| Power/Grid | 5-year interconnect queues | VRT, ETN |
| Liquid Cooling | 1000W+ GPUs require it | VRT, MOD |
| Nuclear/Uranium | Hyperscalers signing PPAs | CCJ, CEG |
| Copper | 500k+ tons/year by 2030 | FCX |

---

## The Three-Layer Investment Framework

| Layer | Timeframe | Role |
|-------|-----------|------|
| Quantitative | Short (days-weeks) | Systematic, momentum-driven, breakout-based |
| LLM/Agent | Medium (weeks-months) | Theme detection, regime conditioning, narrative analysis |
| Fundamental | Long (5-8 years) | AGI buildout thesis, infrastructure investment |

**The LLM/Agent layer bridges quantitative signals and fundamental thesis.**

---

## The 5-Layer Alpha Stack

Signals flow top to bottom, each adding precision:

1. **Macro (Infrastructure Constraint):** Is the bottleneck tightening or easing?
2. **Micro (Margin/Leadership):** Is this company gaining share or losing?
3. **Behavioral (Narrative vs Numbers):** Does the story match the fundamentals?
4. **Confirmation (Analyst Revisions):** Are professionals increasing estimates?
5. **Timing (Regime Conditioning):** Does the signal work in the current regime?

---

## The Four-Regime Framework

Position sizing conditioned on market regime:

| Regime | VIX | Credit Spreads | Exposure |
|--------|-----|---------------|----------|
| RISK_ON | <20 | <400bps | 100% |
| TRANSITION | 20-30 | 400-600bps | 70% |
| RISK_OFF | >30 | >600bps | 20% |
| RECOVERY | Declining from peak | — | 50% |

**Regime detection inputs:** HMM on index returns, volatility, breadth, breakout returns. ADX for trend. Hurst for mean-reversion.

---

## The Momentum System

### Breakout Foundation

A breakout is "price moving away from equilibrium with volume confirming." Breakouts work because large players (smart money) accumulate positions over time. Price moves before the crowd notices.

### Six Breakout Quality Scenarios

| Scenario | Description | Expected Behavior |
|----------|-------------|-------------------|
| Clean breakout | Strong volume, no resistance | High probability continuation |
| Fake breakout | Quick spike then reversal | Stop-loss triggered, range-bound |
| Late-stage breakout | Multiple tests before break | Exhaustion signal, reducing |
| Earnings-driven | Volatility spike, not trend | Fade after |
| Leader breakdown | Market leader reverses | Sell signal for sector |
| Growth trap | Fundamentals deteriorate but price rises | Short signal |

### Momentum Scoring

| Dimension | Weight | What it Measures |
|-----------|--------|------------------|
| Trend | 35% | Price vs SMAs, ADX strength |
| Relative Strength | 30% | vs sector, market |
| Confirmation | 20% | Volume, breadth |
| Growth | 15% | Earnings, revenue acceleration |

---

## The Agent System

### What It Does

An agent reviews your portfolio daily (5 min review) instead of you spending 1-2 hours manually. Claude orchestrates 6 tools to:
1. Fetch news for each bottleneck theme
2. Analyze sentiment on catalysts
3. Screen for candidates matching criteria
4. Rank candidates across themes
5. Detect emerging bottlenecks (before mainstream)
6. Suggest trades with conviction levels

### The 6 Execution Tools

| Tool | Purpose | Key Output |
|------|---------|------------|
| fetch_portfolio_news | Theme-level news sentiment | Bullish/bearish + catalysts |
| analyze_sentiment | Quantify specific catalysts | Sentiment score (-1 to +1) |
| screen_candidates | Find thesis-aligned stocks | 8 candidates per theme |
| rank_and_score_candidates | Cross-theme ranking | Composite score (0-10) |
| detect_bottleneck_emergence | Find next bottleneck | Emerging plays + timeline |
| suggest_trades | Final recommendations | BUY/WATCH/SKIP with conviction |

### Scoring Weights (rank_and_score_candidates)

| Factor | Weight | Measures |
|--------|--------|----------|
| Technical | 30% | SMA alignment, new highs, ADR |
| Momentum | 25% | Price acceleration, volume |
| Sentiment | 25% | News bullish/bearish |
| Catalyst | 20% | Earnings, policy, supply shifts |

### Conviction Levels

| Level | Probability | Signals Needed |
|-------|-------------|----------------|
| HIGH | 80%+ | News + technicals + catalyst + sentiment all aligned |
| MEDIUM | 50-80% | 2-3 signals aligned |
| LOW | <50% | Single signal, speculative |

### Trade Actions

| Action | When | Conviction |
|--------|------|-----------|
| HOLD_CORE | Structural, thesis-aligned | HIGH |
| ACCUMULATE | Bullish, add on weakness | MEDIUM |
| MONITOR | Wait for confirmation | MEDIUM |
| REDUCE | Thesis changed | varies |
| ADD_NEW | New fit, 1-2% start | LOW |
| WATCH_NEW_BOTTLENECK | Too early, research first | null |

---

## RocketShip: The Multi-Agent Reasoning Layer

**Decision:** Fork RocketShip (ammar-adam/rocketship), don't build from scratch.

### Why Fork (5 Reasons)

1. **Time efficiency:** 100-150 hours saved vs building custom
2. **Proven architecture:** Tested by other traders, solid agentic loop
3. **Maintenance:** Open source, community support, upstream bug fixes
4. **Scalability:** Designed for Month 3-4 RL training
5. **HUD.ai integration:** Natural fit for RL optimization phase

### Why Not Alternatives

| Alternative | Why Not |
|------------|---------|
| Build custom | 150+ hours, maintain forever |
| LangChain/AgentKit | Overkill, abstracts away understanding |
| Trading bots (MetaTrader) | Can't do LLM reasoning |
| Hard-coded if-then | Can't adapt, fragile to regime changes |

### The 10 RocketShip Reasoning Tools

These sit above the 6 execution tools — they are the reasoning layer Claude uses to decide how to use the execution tools:

| Tool | Purpose |
|------|---------|
| fetch_thesis_alignment | Checks if market aligns with Leopold |
| fetch_sentiment_signals | Media/social/technical sentiment |
| compute_bottleneck_severity | Supply/demand imbalance per bottleneck |
| estimate_market_timing | Entry/exit confidence |
| reason_to_trade | Final decision |
| compute_portfolio_snapshot | Holdings, P&L, exposure |
| evaluate_conviction_level | Confidence score 0-100 |
| post_trade_reflection | Learn from own trades |
| identify_failure_patterns | Avoid repeating mistakes |
| adjust_factor_weights | Adapt to regime |

### Monthly Success Criteria

| Month | Success Criteria |
|-------|----------------|
| 1 | Fork running, 10 tools integrated, 30 scenarios, 40-60% baseline win rate |
| 2 | 4 regimes, backtests: max DD -45%→-12%, Sharpe 0.8→1.4 |
| 3 | 2000-2024 backtest, 100k+ scenarios, 95%+ alpha confidence |
| 4 | Mistral 7B trained, 14% return, -10% DD, 1.8+ Sharpe |

---

## LEAP Options Overlay (Week 15)

### Portfolio Structure

| Component | Allocation | Purpose |
|----------|-----------|---------|
| Core Equity | 70% | Main bottleneck positions |
| Satellite | 25% | Higher-conviction smaller positions |
| LEAP Calls | 5% | Asymmetric upside, defined risk |

### Parameters

- **Expiry:** 12-18 months
- **Strike:** 10-20% OTM
- **Delta:** 0.30-0.50
- **Deploy only when conviction >= 7/10**

---

## Post-Trade Learning

### Failure Pattern Types

- **Thesis failure:** Bottleneck analysis wrong, market didn't care
- **Timing failure:** Right thesis, wrong time
- **Regime failure:** Same signals in RISK_OFF as RISK_ON
- **Signal failure:** False breakout, fake momentum
- **Size failure:** Position too large → forced exit

### Regime-Conditional Factor Weights

| Regime | Technical | Sentiment | Catalyst |
|--------|-----------|-----------|---------|
| RISK_ON | 35% | 20% | 20% |
| TRANSITION | 25% | 30% | 25% |
| RISK_OFF | 20% | 35% | 15% |
| RECOVERY | 30% | 25% | 25% |

---

## Alpha Math: Resource Justification

**$10M AUM context:**

| Alpha Generated | Dollar Impact | Justifiable Spend |
|----------------|-------------|------------------|
| +0.5% | $50,000 | $5,000 |
| +1.0% | $100,000 | $10,000 |
| +5.0% | $500,000 | $50,000 |

**Key formula:** 20% probability of adding 1% alpha = strongly positive EV for $2,000 experiment.

**Aiden's ranges:** Under $5,000 = cheap. $50,000 justifiable with 5% alpha proof.

---

## The 4-Month Build Plan

| Month | Focus | Deliverable |
|-------|-------|-------------|
| 1: Foundation | Data pipeline, feature engineering, RocketShip fork | 5-layer alpha stack producing signals |
| 2: Regime | HMM, ADX, Hurst, backtest | Regime engine classifying market state |
| 3: RL | HUD.ai, 100+ scenarios, training | RL agent trained, validated |
| 4: Deploy | Paper trading, refine, mentor review | Production agent running |

### Success Metrics

| Metric | Baseline | Target |
|--------|---------|--------|
| Annual return | 12% | 14-15% |
| Sharpe ratio | ~1.0 | 1.4-1.5 |

### Key Tools

| Tool | Purpose |
|------|---------|
| HUD.ai | RL training, removes 180+ hours infrastructure |
| RocketShip | Multi-agent debate, forked for thesis |
| Blackwell 1000 GPU | Local RL training (Mistral 7B, Qwen, 13B) |
| Chan books | "Generative AI for Trading" + "Hands-On AI" |

---

## Internship Outcomes

- **Role:** Investment Management Intern, Agilith Capital
- **Compensation:** CAD $1,000/week (~$4,333/month)
- **Duration:** 3 months (May-July 2026), potential extension to August
- **Hardware:** Dell Pro Max 16 Plus + RTX PRO 1000 (8GB GDDR7) + 32GB DDR5 = $4,650 CAD
- **Work setup:** Remote

### Academic Strategy

- **Choice:** Management Specialist with Finance Focus
- **Why:** Same finance access, 2.5 FCE freed for CSC148, CSC207, MAT223, MAT235, STA237/238
- **Year 2 plan:** Fall (MAT223 + CSC148 + STA257), Winter (MAT235 + CSC207 + STA261)
- **Degree marketing:** "Finance & Statistics" — never "Management Specialist"

### Career Paths

| Path | Mechanism | Why Now |
|------|----------|---------|
| Builder | AI engineer → SF → founding equity | AI+finance intersection early, code scales |
| Allocator | Agilith → fund ops → own fund | Carry on AUM |

---

## Three-Layer Knowledge System

NOT one mega-wiki. Three separate systems:

| Layer | What | Where |
|-------|------|-------|
| Domain Wiki | Trading system knowledge | Obsidian (LLM-maintained) |
| Tool Knowledge | How to use Claude | Claude Project |
| Desk Manual | Quick reference | Printed |

**Separation rule:** Domain knowledge ≠ Tool knowledge. They evolve at different rates.

---

## Key Design Principles

1. **Agent generates features, NOT decisions.** You decide. Agent surfaces signals.
2. **Point-in-time correctness mandatory.** Backtest must use only info available at the time.
3. **Tool design > prompt engineering.** "Tasksets are the moat."
4. **Overfitting as feature.** Identify conditions that made strategy work → reuse when conditions repeat.
5. **Bottleneck shift = alpha source.** Primary bottlenecks get priced in. Second-order are the edge.
6. **Fork proven, don't rebuild.** 100-150 hours saved, better architecture.
7. **Learn from failures.** Pattern library becomes checklist before entering positions.

---

## Related Pages

**Core thesis:** [[Leopold-thesis]], [[Bottleneck-analysis]], [[AI-Supply-Chain]]

**Architecture:** [[Agilith-System-Architecture]], [[System-Architecture]], [[Agent-Tools]], [[RocketShip-Framework]], [[RocketShip-Decision]]

**Alpha system:** [[Agilith-Alpha-Stack-System]], [[Agilith-Momentum-System]], [[Regime-modeling]], [[LEAP-Options]], [[Failure-Patterns]]

**Build plan:** [[4-Month-Build-Plan]], [[RL-Training-Setup]]

**Internship:** [[Intern-Journey]], [[Academic-Strategy]], [[Alpha-Math]], [[Negotiation-Strategy]], [[Domain-Wiki-System]], [[Tool-Comparison]]

**Meta:** [[SYSTEM]] — This file. Start here.
