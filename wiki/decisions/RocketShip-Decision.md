---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [RocketShip-Framework, Agilith-System-Architecture, 4-Month-Build-Plan]
status: active
tags: [decisions, architecture, rocketship, framework, reasoning]
---

# RocketShip Decision: Why Fork vs Build

## The Decision

**Decision:** Fork RocketShip (ammar-adam/rocketship), don't build from scratch.

**Date:** Before April 20, 2026

**Decision maker:** Intern with Portfolio Manager mentor

**Impact:** High — determines agent loop structure, tool design, scalability path

## Five Reasons to Fork

### 1. Time Efficiency

Building agentic loop from scratch = 100-150 hours of infrastructure work.

Forking RocketShip:
- Don't rebuild agentic loop (already done correctly)
- Don't reinvent tool integration pattern
- Don't debug basic reasoning flow
- Save 100-150 hours
- Focus effort on domain logic (Leopold thesis)

**Result:** 4-month internship becomes achievable. Custom build = 6+ months.

### 2. Proven Architecture

RocketShip has been tested by other traders. Agentic loop is solid. Tool framework is robust.

> "Better to start proven than custom."

Building from scratch means debugging the same problems RocketShip already solved. Reinventing the wheel when the wheel already works.

### 3. Maintenance Burden

Custom solution = you maintain it forever. No community, no updates, no bug fixes unless you do them.

RocketShip:
- Open source project
- Active maintenance
- Community support
- Bug fixes happen upstream
- You benefit automatically

**Tradeoff:** You accept RocketShip's architecture constraints. In exchange, you get maintenance-free infrastructure.

### 4. Scalability

RocketShip designed for iterative reasoning. Handles complex tool chains. Can scale agent complexity.

This matters for Month 3-4:
- RL training needs structured agent decisions
- RocketShip's architecture supports this
- Custom build would need re-architecting for RL

### 5. HUD.ai Integration

RocketShip designed to work with LLM training. HUD.ai can train on RocketShip decisions. Natural fit for RL optimization phase.

Not forcing incompatible architectures together. The framework supports the goal.

## Why Not Alternatives

### Alternative 1: Build Custom Agent Loop

**Pros:** Full control

**Cons:** 150+ hours, error-prone, maintains forever

**Verdict:** Not worth it. RocketShip solves this.

### Alternative 2: Use AgentKit / LangChain

**Pros:** Lots of documentation

**Cons:** Overkill for trading, abstracts away understanding

**Verdict:** Could work, but RocketShip is simpler.

### Alternative 3: Use Trading Bots (MetaTrader, etc.)

**Pros:** Ready-made platform

**Cons:** Can't do LLM reasoning, proprietary, expensive

**Verdict:** Wrong tool. Need agentic reasoning.

### Alternative 4: Hard-Coded Rules (If-Then)

**Pros:** Fast, simple

**Cons:** Can't adapt, can't learn, fragile to market changes

**Verdict:** Works until it doesn't. RocketShip + rules = better.

## Why RocketShip Is the Right Fit

- Right level of abstraction: agentic loop + tool framework, not too high or too low
- Designed for reasoning-based trading
- Not too high-level: you still control reasoning
- Not too low-level: don't rebuild basics
- Scales from Month 1 evals to Month 4 RL training

## Decision Impact

### Schedule Impact

- Fork RocketShip: 4-month plan achievable
- Build custom: Would need 6+ months (too long for internship)

### Quality Impact

- RocketShip: Battle-tested agentic loop
- Custom: Would have bugs, takes weeks to debug

### Scalability Impact

- RocketShip: Designed to scale to RL training
- Custom: Would need rearchitecture for RL

### Mentorship Impact

- Portfolio manager can advise on Leopold logic
- Queen's AI engineer can advise on RocketShip/RL
- Both have familiarity with RocketShip patterns

### Career Narrative Impact

> "I built a regime-aware trading agent using RocketShip framework"
> "I trained Mistral 7B to improve trading decisions"
> "System achieved 14% returns, -10% max drawdown in backtests"

Strong story for interviews.

## Monthly Success Criteria

By forking RocketShip, each month's deliverable becomes measurable:

| Month | Success Criteria |
|-------|-----------------|
| Month 1 | Fork running, 10 tools integrated, 30 scenarios, baseline 40-60% win rate |
| Month 2 | 4 regimes implemented, backtests show RISK_ON: -45%→-12% max DD, Sharpe 0.8→1.4 |
| Month 3 | 2000-2024 backtest complete, 100k+ scenarios, 95%+ alpha confidence |
| Month 4 | Mistral 7B trained, inference faster than Claude, paper trading 14% return |

## Related

- [[RocketShip-Framework]] — Framework architecture, 10 tools, comparison to alternatives
- [[4-Month-Build-Plan]] — Month 1 starts with RocketShip fork
- [[Agilith-System-Architecture]] — System this fits into
