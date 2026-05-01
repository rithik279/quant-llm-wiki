# Wiki Schema — Leopold Trading System

## Purpose

This document defines the schema and conventions for the LLM wiki. It is the authoritative reference for wiki structure, page format, and operational rules. This is what CLAUDE.md would be if this were a code repo — it's the living blueprint.

---

## Folder Structure

```
quant-llm-wiki/
├─ wiki/
│  ├─ _meta/
│  │  ├─ index.md          # Catalog of all wiki pages
│  │  ├─ log.md            # Append-only changelog
│  │  └─ contradictions.md # Flagged conflicts between sources
│  ├─ core/
│  │  ├─ Leopold-thesis.md
│  │  ├─ Bottleneck-analysis.md
│  │  └─ Portfolio-holdings.md
│  ├─ regime-modeling/
│  │  ├─ Regime-modeling.md
│  │  ├─ Regime-indicators.md
│  │  ├─ RISK_ON.md
│  │  ├─ TRANSITION.md
│  │  ├─ RISK_OFF.md
│  │  └─ RECOVERY.md
│  ├─ architecture/
│  │  ├─ Architecture-overview.md
│  │  └─ ...
│  ├─ decisions/
│  │  ├─ Decisions.md      # Index
│  │  └─ YYYY-MM-DD_topic.md
│  └─ reading-notes/
│     ├─ Agilith-*.md      # Agilith Capital sources
│     ├─ Leopold-*.md      # Leopold thesis sources
│     └─ ...
├─ raw/
│  ├─ pdf/                  # PDF sources
│  ├─ chatgpt/             # ChatGPT exports
│  ├─ claude/              # Claude chat exports
│  ├─ google-docs/         # Google Docs exports
│  └─ ...
├─ MASTER_PROMPT.md         # Wiki maintainer instructions
└─ llm-wiki.txt            # User's original vision doc
```

---

## Page Format

Every wiki page MUST have this frontmatter:

```markdown
---
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
source_count: N
related_pages: [Page1, Page2, Page3]
status: active | draft
tags: [tag1, tag2]
---

# Page Title

One sentence describing purpose.

## Section 1

Content...

## Section 2

Content...

## See Also
- [[Related-Page-1]]
- [[Related-Page-2]]
```

### Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `date_created` | Yes | ISO date page first created |
| `date_updated` | Yes | ISO date of last edit |
| `source_count` | Yes | Number of raw sources that contributed |
| `related_pages` | Yes | Wiki-links to related pages (3-5 per 200 words) |
| `status` | Yes | `active` = complete, `draft` = incomplete |
| `tags` | Yes | Semantic tags (meta, strategy, agilith-capital, etc) |

---

## Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Wiki pages | CamelCase-with-hyphens | `Leopold-thesis.md`, `RISK_ON.md` |
| Decision pages | `YYYY-MM-DD_topic.md` | `2026-05-01_infra-bottleneck-decision.md` |
| Raw sources | Original format + date | `Agilith Capital Internship (2).pdf` |

---

## Cross-Reference Rules

- Use `[[Page-Name]]` wiki-link syntax
- Every page links to 3-5 related pages
- Link density target: 1 link per 50 words
- Circular references are OK — they indicate strong conceptual connections

---

## Meta Files

### index.md

```markdown
# Wiki Index

## [Category Name]
- [[Page-Name]] — One-line description
- [[Page-Name]] — One-line description

## [Another Category]
...
```

### log.md

```markdown
# Wiki Changelog

## [YYYY-MM-DD] ingest | Source-Name

Source: raw/[path]/[filename]
Key takeaways:
- Point 1
- Point 2

Pages created: [[Page1]], [[Page2]]
Pages updated: [[Page3]]

Status: Complete
---
```

### contradictions.md

```markdown
## Contradiction: [Topic]

**Old Claim:** [Statement]
Source: [Which source, date]

**New Claim:** [Statement]
Source: [Which source, date]

**Status:** Resolved | Pending review
**Resolution:** [How resolved]
**Pages Affected:** [[Page1]], [[Page2]]

---
```

---

## Core System Reference

### Five Bottlenecks

1. **Power** → BE (Bloom Energy)
2. **Compute** → CRWV (CoreWeave)
3. **Memory** → MU (Micron)
4. **Storage** → SNDK (SanDisk)
5. **Optical** → LITE (Lumentum)

### Regime Framework

| Regime | Signals | Position |
|--------|---------|----------|
| RISK_ON | VIX<20, spreads<400bps | 100% |
| TRANSITION | VIX 20-30, spreads 400-600bps | 70% |
| RISK_OFF | VIX>30, spreads>600bps | 20% |
| RECOVERY | VIX declining from peak | 50% |

---

## Operational Rules

### Rule 1: Never Modify raw/

- raw/ is immutable source of truth
- Read from raw/, write to wiki/
- Never edit or delete raw files

### Rule 2: Update Frontmatter on Every Change

When editing a page:
- Update `date_updated` to today's date
- Add any new sources to `source_count`
- Update `related_pages` if content changed significantly

### Rule 3: Cross-Reference Aggressively

When creating a page, link to:
- Related concepts in same category
- Key connections in other categories
- Source pages (if derived from raw source)

### Rule 4: Flag Contradictions Immediately

When ingesting new sources, compare against existing wiki. If conflict:
1. Document in contradictions.md
2. Add `[[contradictions]]` link to affected pages
3. Mark status: `resolved` or `pending review`

### Rule 5: Maintain Audit Trail

- Every ingest appends to log.md
- log.md is append-only (never delete entries)
- Include: sources, key takeaways, pages created/updated

---

## Agilith Capital System Reference

### Alpha Stack (5-Layer Pipeline)

```
Macro Layer → Infrastructure Constraint Nowcast
Micro Layer → Margin Before Revenue
Behavioral → Narrative vs Numbers
Confirmation → Analyst Revision Diffusion + Tone Gating
Timing Layer → Regime-Conditioned Sentiment
```

### MVP Data Stack

| Component | Provider | Cost |
|-----------|----------|------|
| Market Data | FMP | ~$49/mo |
| Screener | Quant Investing | ~$45/mo |
| Filings | SEC EDGAR | Free |
| Macro | FRED | Free |
| Text NLP | Claude/OpenAI | Usage-based |

### Tooling Stack

| Component | Provider | Cost |
|-----------|----------|------|
| LLM Platform | Claude Max | $100/mo |
| Dev Environment | VS Code + GitHub | Free |
| Charting | TradingView Pro | ~$50/mo |
| Cloud (optional) | Runpod | Usage-based |

---

## Next Steps (Schema Updates)

- Add decision log entries as they're made
- Update portfolio holdings as positions change
- Track RL training progress in rl-training/
- Document backtesting results

---

*Schema version: 1.0*
*Last updated: 2026-04-30*