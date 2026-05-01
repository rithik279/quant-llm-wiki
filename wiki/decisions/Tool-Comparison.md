---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [RocketShip-Framework, Agilith-System-Architecture]
status: active
tags: [decisions, tools, comparison, langchain, custom-build]
---

# Tool Comparison: Why RocketShip over Alternatives

## The Options

| Option | Why Not |
|--------|--------|
| Build custom agent loop | 150+ hours, maintain forever, reinvent wheel |
| Use AgentKit / LangChain | Overkill for trading, abstracts away understanding |
| Use trading bots (MetaTrader) | Can't do LLM reasoning, proprietary, expensive |
| Hard-coded if-then rules | Can't adapt, can't learn, fragile to market changes |

## Option 1: Build Custom Agent Loop

**Pros:**
- Full control
- Everything custom to your needs

**Cons:**
- 150+ hours of infrastructure work
- Error-prone (debugging agentic loops is hard)
- Maintain it forever (no community, no upstream fixes)
- Takes time away from domain logic (Leopold thesis)

**Verdict:** Not worth it. RocketShip solves this.

## Option 2: Use AgentKit / LangChain

**Pros:**
- Lots of documentation
- Popular ecosystem

**Cons:**
- Overkill for trading use case
- Abstracts away understanding of what agents are doing
- Complex for simple trading logic
- You still build the domain logic anyway

**Verdict:** Could work, but RocketShip is simpler and more focused on trading.

## Option 3: Use Trading Bots (MetaTrader, etc.)

**Pros:**
- Ready-made platform
- Already built

**Cons:**
- Can't do LLM reasoning
- Proprietary (locked to their ecosystem)
- Expensive
- Built for forex/传统 trading, not LLM-augmented investing

**Verdict:** Wrong tool. Need agentic reasoning that can understand thesis.

## Option 4: Hard-Coded Rules (If-Then)

**Pros:**
- Fast to implement
- Simple to understand

**Cons:**
- Can't adapt to changing conditions
- Can't learn from outcomes
- Fragile — works until regime changes then breaks
- No reasoning capability

**Verdict:** Works until it doesn't. RocketShip + rules is better (rules as tools within agentic framework).

## Why RocketShip Wins

- **Right level of abstraction:** Agentic loop + tool framework, not too high or too low
- **Designed for trading:** Not a general-purpose agent framework
- **Not too high-level:** You still control the reasoning
- **Not too low-level:** You don't rebuild basic infrastructure
- **Scales:** Works from Month 1 evals to Month 4 RL training
- **Transparent:** Claude explains reasoning at each step
- **Testable:** Scenario framework makes eval easy

## The Hybrid Approach

RocketShip + hard-coded rules:

```
RocketShip (reasoning)
    ↓
Calls rules-based tools:
├─ fetch_portfolio_news (tool)
├─ screen_candidates (tool)
├─ compute_regime (rules-based)
├─ evaluate_conviction (rules-based)
    ↓
Claude reasons over results
```

Rules as tools within agentic framework = best of both. Structured reasoning with domain-specific logic.

## Related

- [[RocketShip-Framework]] — Framework details, 10 tools
- [[Agilith-System-Architecture]] — System architecture this fits into
