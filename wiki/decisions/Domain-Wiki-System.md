---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [SYSTEM]
status: active
tags: [decisions, wiki, knowledge-base, llm, pattern]
---

# Domain Wiki System Design

## The Problem

Scattered knowledge across multiple platforms:
- Google Docs (brainstorming)
- ChatGPT (earlier exploration)
- Claude (current work)
- Skilljar (technique library)
- Ernest Chan books
- Friend's agent traces
- Mentor notes

Each time asking Claude a question = Claude re-derives from scattered raw sources. Takes 30+ minutes. Synthesized knowledge evaporates between sessions.

## The Solution: LLM Wiki Pattern

**Source:** Karpathy's LLM Wiki framework

Instead of RAG (retrieve chunks, re-synthesize each query), build a persistent wiki between user and raw sources. LLM incrementally maintains it.

### Three Layers

```
Layer 1: Raw Sources — immutable, never modified by LLM
Layer 2: Wiki — LLM-maintained synthesis (structured markdown)
Layer 3: Schema — configuration file (rules for maintenance)
```

### Operations

- **INGEST:** Add new source, LLM reads, extracts, integrates into wiki
- **QUERY:** Ask questions against wiki (not raw sources)
- **LINT:** Health-check for contradictions, orphan pages, gaps

## Three-Layer Personal System

NOT one mega-wiki. Three separate systems with different purposes:

### Layer 1: Domain Wiki (Obsidian)

**What:** Everything about the trading system
- Leopold thesis
- Regime modeling
- RL concepts
- Architecture decisions
- Decision log
- Contradictions

**Maintained by:** LLM (Obsidian in background)

**Changes when:** You learn something new about trading

### Layer 2: Tool Knowledge (Claude Project)

**What:** How to use Claude effectively
- 4D Framework
- When to use Plan Mode vs Code vs Chat vs Cowork vs Research
- Prompt templates
- Skilljar techniques

**Maintained by:** You + Claude

**Changes when:** You discover what works

### Layer 3: Desk Manual (Printed)

**What:** Emergency reference for you
- Problem triggers
- Suggested tools
- Quick shortcuts

**Reads by:** You (glancing, 1 second)

**Changes when:** Never (template)

## Why Separation Matters

Domain wiki changes as you learn about trading. Tool knowledge changes as you discover what works. They're consulted for different reasons, evolve at different rates.

> "Domain wiki = What you know about trading. Tool knowledge = How to use Claude. Desk manual = Quick reference when stuck."

Mixing them = wiki grows unbounded, context gets noisy, value drops.

## LLM Wiki vs Claude Projects

| | LLM Wiki | Claude Projects |
|--|----------|----------------|
| Knowledge | Persistent, compounding | Static, re-derived |
| Evolution | Tracks contradictions | No evolution tracking |
| Cross-refs | Automatic | Manual |
| Best for | 4-month build with evolving understanding | Quick questions |

**For 4-month internship building something novel:** LLM Wiki wins.

## Master Prompt Approach

One self-contained prompt containing:
- All schema rules
- Leopold system context
- Folder structure
- Page templates
- Operation instructions

Claude Code reads raw/ folder directly, writes wiki/ folder automatically. No manual copy-paste. Files saved in place. Obsidian sees updates in real time.

## 8 Artifacts Created

1. `DOMAIN_WIKI_README.md` — Complete overview, timeline, FAQ
2. `EXPORT_INSTRUCTIONS.md` — Export from Claude, ChatGPT, Google Docs
3. `FOLDER_STRUCTURE.md` — Exact directory layout
4. `schema.md` — Rules for wiki maintenance
5. `FIRST_INGEST_WALKTHROUGH.md` — First ingest step-by-step
6. `QUICK_REFERENCE.md` — One-page cheat sheet
7. `HOW_TO_USE_MASTER_PROMPT.md` — Usage instructions
8. `MASTER_PROMPT.md` — Self-contained prompt for Claude

## Ingest Order

1. Meta-sources first (how wiki was built — this session)
2. Leopold thesis sources (core concept)
3. Bottleneck analysis (thesis validation)
4. Regime modeling sources
5. RL training sources
6. Architecture sources
7. Skilljar notes (techniques — goes to Tool Knowledge, not Domain Wiki)

## Key Principles

1. **Raw sources are sacred.** Never modify. Immutable source of truth.
2. **Humans curate, LLMs maintain.** Your job: direct analysis. LLM's job: summarize, cross-reference, update.
3. **Knowledge compounds.** Not re-derived on every query. Maintained and evolved.
4. **Audit trail matters.** Log.md shows when you learned what. Contradictions show evolution.
5. **Separation of concerns.** Domain knowledge ≠ Tool knowledge. Different purposes, different evolution rates.

## Time Investment

| Phase | Time |
|-------|------|
| Setup | 2-3 hours |
| First ingest | 45 min |
| Subsequent ingests | 10-20 min |
| By week 3 | Claude answers 5x faster |
| By week 8 | Claude answers 10x faster |
| By month 4 | Complete audit trail, timeline of decisions |

**Net result:** Saves ~30 hours over 4-month internship while improving learning quality.

## Related

- [[SYSTEM]] — Master summary linking this system to everything else
