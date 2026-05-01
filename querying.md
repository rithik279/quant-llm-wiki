---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [SYSTEM, index, log]
status: active
tags: [meta, querying, how-to, workflow, daily-use]
---

# How to Query This Wiki

This wiki follows the LLM Wiki pattern: knowledge compounds, cross-references exist, contradictions flagged. Don't re-derive — ask.

---

## Core Principles

1. **Don't re-derive** — ask instead of reconstructing from scratch
2. **Start broad** — use index, then drill into specific pages
3. **File answers back** — good syntheses become new pages
4. **Trigger maintenance** — flag contradictions, update cross-refs

---

## Query Patterns

### Pattern 1: Before Starting Work

```
"I'm working on [X] today" → I surface relevant pages + remind connections
```

| Task | What I pull |
|------|-------------|
| Month 1 agent build | Agent-Framework-Taxonomy, System-Architecture, Agent-Tools |
| Month 2 regime detection | Regime-modeling, RL-Training-Setup, Agilith-Custom-Indicators |
| Month 3 backtesting | 4-Month-Build-Plan, RocketShip-Framework, Failure-Patterns |
| Month 4 RL training | RL-Training-Setup, HUD.ai notes, scenario framework |
| Pitching Patrick | Agilith-Investment-Thesis, key phrases, call flow |
| Debugging tools | Agent-Tools, Tool-Comparison, 6-tool schema |
| Writing code | CLAUDE.md schema, page structure conventions |

### Pattern 2: During Work

```
"How do I [specific thing]?" → I search wiki + synthesize
```

**Example queries:**
- "What's the current regime framework?" → RISK_ON/OFF/TRANSITION/RECOVERY
- "Leopold bottleneck rotation — what stocks?" → BE, CRWV, MU, SNDK, LITE
- "How do I set up RL training?" → RL-Training-Setup state/action space
- "What's the timeline for Month 3?" → 4-Month-Build-Plan week-by-week
- "Agent tool input/output schemas?" → Agent-Tools with JSON specs
- "Conviction levels for trades?" → Agent-Tools: HIGH (80%+), MEDIUM (50-79%), LOW (<50%)
- "Why RocketShip over alternatives?" → Tool-Comparison decision matrix
- "What's the alpha stack order?" → Macro→Micro→Behavioral→Confirmation→Timing

### Pattern 3: After Work Session

```
"Done with [X]" → I log what changed, update relevant pages
```

### Pattern 4: Lint Pass (Periodic)

```
"Health check the wiki" → I check for:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Concepts mentioned but lacking own page
- Missing cross-references
- Data gaps fillable via web search
```

---

## Use Cases by Scenario

### Scenario 1: Building Code in Another Project

**Context:** You're in `passplan-web/` or `profitplan-web/` working on something that touches the trading system.

**Query:**
```
"I'm implementing the screen_candidates function. What are the screener criteria and ticker universe?"
```

**What I do:**
- Pull [[Agent-Tools]] screener criteria table
- Pull [[Bottleneck-analysis]] for bottleneck-to-ticker mapping
- Show how this connects to [[Agilith-Alpha-Stack-System]] Layer 1

---

### Scenario 2: Preparing for Mentor Meeting

**Context:** Call with Patrick or Aiden in 30 minutes.

**Query:**
```
"Prep me for the call. Key phrases, current status, open questions."
```

**What I do:**
- Pull [[Agilith-Investment-Thesis]] call flow
- Pull [[Agilith-Strat-Priorities]] for new alpha ideas to pitch
- Pull recent [[log]] entries to see what's changed
- Show any unresolved contradictions to discuss

---

### Scenario 3: Debugging a Broken Trade

**Context:** A position moved against you. Want to understand why.

**Query:**
```
"BE dropped 5% today. What's the power bottleneck thesis? Any regime signals that might explain this?"
```

**What I do:**
- Pull [[Leopold-thesis]] power section
- Pull [[Bottleneck-analysis]] for current power status
- Pull [[Regime-modeling]] for today's regime state
- Pull [[Failure-Patterns]] to see if this matches a known failure pattern

---

### Scenario 4: Learning a New Component

**Context:** Reading RocketShip code, want to understand how it fits.

**Query:**
```
"How does RocketShip's 10 reasoning tools map to the 3-agent proposal structure?"
```

**What I do:**
- Pull [[Agent-Framework-Taxonomy]] unified mapping
- Show evolution: Proposal (3) → Execution (6) → Reasoning (10)
- Show which RocketShip tools map to which agents

---

### Scenario 5: Designing a New Feature

**Context:** Want to add "insider activity signals" to the system.

**Query:**
```
"I want to add insider activity as Alpha 11. How do I integrate a new alpha into the 5-layer stack?"
```

**What I do:**
- Pull [[Agilith-Alpha-Stack-System]] full stack diagram
- Pull [[Agilith-Strat-Priorities]] next-5 list (includes Insider Activity as alt data)
- Pull [[4-Month-Build-Plan]] to see if this fits current phase
- Show where it would slot: probably layer 4 (Confirmation) or alt data

---

### Scenario 6: Comparing Approaches

**Context:** Debating whether to use HMM vs k-means for regime detection.

**Query:**
```
"Regime detection: HMM vs k-means. What does the wiki say about each?"
```

**What I do:**
- Pull [[Agilith-Custom-Indicators]] for HMM details
- Pull [[Agilith-Data-Stack]] for what's available
- Pull [[Regime-modeling]] for current implementation choice + rationale
- Check [[log]] for any past discussion on this

---

### Scenario 7: Onboarding to a New Topic

**Context:** Haven't touched RL training in 2 weeks. Need to re-enter.

**Query:**
```
"RL training refresher. State space, action space, reward function, scenario distribution."
```

**What I do:**
- Pull [[RL-Training-Setup]] full spec
- Show scenario distribution (RISK_ON 70%, TRANSITION 20%, etc.)
- Pull [[4-Month-Build-Plan]] Month 3 milestones
- Show connection to [[RocketShip-Framework]] Month 4 target metrics

---

## Connecting to Claude Code

### Method 1: In-repo (quant-llm-wiki)

When Claude Code opens this repo, it reads `CLAUDE.md` automatically.

**CLAUDE.md contains:**
- Wiki location
- Key page catalog by task
- Schema structure (meta, core, architecture, etc.)
- How to query pattern

### Method 2: Cross-project reference

From any other project, tell me:
```
"I'm working on [X]. The quant wiki has relevant info at wiki/[page]."
```

I read that page + related pages, apply to your current context.

### Method 3: Memory persistence

Memory at `MEMORY.md` saves:
- Wiki location for cross-project reference
- Leopold thesis as keystone concept
- Agent framework key points

Claude Code loads this on startup → knows to reference wiki when relevant.

---

## Maintenance Triggers

| Trigger | Action |
|---------|--------|
| New source ingested | I update index, log, cross-refs, contradictions |
| Contradiction found | Logged in `_meta/contradictions.md` |
| New connection discovered | Added to relevant pages' "See Also" |
| Page becomes stale | Flagged in lint pass |
| Large refactor | New decision page in `wiki/decisions/` |

---

## Index Quick Reference

```
wiki/_meta/index.md     — Full page catalog (start here for unknown topic)
wiki/_meta/log.md       — Reverse-chronological ingest history
wiki/_meta/contradictions.md — Flagged conflicts, pending resolution

wiki/core/Leopold-thesis.md — Keystone. Start here if lost.
wiki/SYSTEM.md          — Complete system overview
wiki/CLAUDE.md          — This file (Claude Code integration)
```

---

## Query Templates

Use these directly:

```
"What's the current state of [bottleneck/regime/alpha]?"
"How does [A] connect to [B]?"
"What's the timeline for Month [N]?"
"What are the conviction levels and when do I use each?"
"Why did we choose [X] over [alternatives]?"
"What failed last time we did [Y]?"
"Is there a contradiction between [page A] and [page B]?"
"What changed since [date]?"
```

---

## The Feedback Loop

```
Work session → new understanding
    ↓
File as wiki page (via me)
    ↓
Next session → ask question → wiki answers
    ↓
Answers compound → less re-derivation
    ↓
Knowledge base grows → faster onboarding to any topic
```

The wiki gets more valuable with every session. Ask instead of reconstructing.