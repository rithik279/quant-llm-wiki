# schema.md — Wiki Maintenance Rules

This file defines how the wiki is structured, maintained, and evolved. Claude reads this before every operation. You and Claude update this as you discover what works.

---

## I. PURPOSE & PRINCIPLES

**The Domain Wiki is NOT:**
- A RAG system (don't just retrieve and answer)
- A document dump
- A static knowledge base

**The Domain Wiki IS:**
- A persistent, synthesized representation of your understanding
- An evolving system that compiles knowledge once, keeps it current
- A maintained artifact that grows richer with every source
- Your persistent memory across sessions

**Core Rule:** The LLM maintains the wiki; you curate sources and direct analysis.

---

## II. DIRECTORY STRUCTURE

```
leopold-trading-system/
├─ raw/                          # Immutable sources
├─ wiki/                         # LLM-maintained synthesis
├─ schema.md                      # This file
└─ README.md                      # Quick start
```

See `FOLDER_STRUCTURE.md` for full layout.

**Sacred rule:** Never modify files in `raw/`. The LLM reads only, never writes.

---

## III. PAGE NAMING CONVENTIONS

### Format
```
CamelCase-with-hyphens.md
```

### Examples (Good)
```
Leopold-thesis.md
Regime-modeling.md
RISK_ON.md
RL-concepts.md
Architecture-overview.md
Decisions.md
2026-04-20_regime-count-decision.md
```

### Examples (Bad)
```
Regime modeling.md              # Use hyphens, not spaces
regime_modeling.md              # Use hyphens, not underscores (except dates)
the regime modeling page.md     # Too long, too descriptive
```

### Page Types & Naming

**Core Concept Pages:**
- `Leopold-thesis.md` — The main thesis
- `Bottleneck-analysis.md` — Detailed bottleneck analysis
- `Regime-modeling.md` — Regime framework overview

**Regime Pages:**
- `RISK_ON.md` — VIX<20, spreads<400bps
- `TRANSITION.md` — VIX 20-30
- `RISK_OFF.md` — VIX>30
- `RECOVERY.md` — Declining from peak

**Decision Pages:**
- `Decisions.md` — Index of all decisions
- `YYYY-MM-DD_TOPIC-decision.md` — Individual decision (e.g., `2026-04-20_regime-count-decision.md`)

**Source Summary Pages:**
- `Source-summaries.md` — Index
- `claude-chat-2026-04-20-regime-modeling.md` — Summary of specific source

---

## IV. PAGE STRUCTURE & TEMPLATES

### All Pages Must Have:

1. **Frontmatter** (YAML at top)
```yaml
---
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
source_count: N
related_pages: [Page1, Page2, Page3]
status: "active" or "draft" or "archived"
tags: [tag1, tag2]
---
```

2. **Title** (H1)
```markdown
# Page Title
```

3. **Purpose Statement** (one sentence)
```markdown
Brief statement of what this page is about and why it matters.
```

4. **Body** (content organized by H2 sections)

5. **Related Pages** (at bottom)
```markdown
## See Also
- [[Page-Name]]
- [[Another-Page]]
```

### Example: Core Concept Page

```markdown
---
date_created: 2026-04-20
date_updated: 2026-04-22
source_count: 5
related_pages: [Bottleneck-analysis, Portfolio-holdings, Architecture-overview]
status: active
tags: [core, thesis, trading]
---

# Leopold Thesis

The Leopold thesis identifies five critical infrastructure bottlenecks in the AI boom and seeks to identify which are least obvious and most impactful for equity returns.

## Five Bottlenecks

1. **Power** — Most obvious
2. **Compute** — GPU supply
3. **Memory** — HBM, DRAM
4. **Storage** — NAND, SSD
5. **Optical** — Least obvious, interconnects

## Why This Matters

[Content explaining thesis]

## Current Status

[Where this thesis is in validation/testing]

## See Also
- [[Bottleneck-analysis]]
- [[Portfolio-holdings]]
```

### Example: Decision Page

```markdown
---
date_created: 2026-04-20
date_updated: 2026-04-20
source_count: 2
related_pages: [Regime-modeling, Architecture-overview]
status: active
tags: [decision, regime-modeling]
---

# Decision: Why 4 Regimes, Not 3 (2026-04-20)

## The Decision
Chose 4 regimes (RISK_ON, TRANSITION, RISK_OFF, RECOVERY) instead of 3 or 5.

## Why
[Reasoning from sources, thesis, testing]

## Alternatives Considered
[What else was tried]

## When Decided
2026-04-20

## Impact
[How this affects architecture, backtesting, etc.]

## See Also
- [[Regime-modeling]]
- [[RISK_ON]]
- [[TRANSITION]]
```

---

## V. OPERATIONS: HOW THE LLM MAINTAINS THE WIKI

### A. INGEST OPERATION

**Trigger:** "Please ingest [source name]"

**Process:**
1. Read the source from `raw/`
2. Extract key takeaways (discuss with human)
3. Identify which wiki pages this affects
4. Write summary page in `wiki/sources/`
5. Update affected pages in `wiki/`
6. Update `wiki/_meta/index.md`
7. Add entry to `wiki/_meta/log.md`
8. Flag any contradictions in `wiki/_meta/contradictions.md`
9. Report to human with summary of changes

**Output Example:**
```
## [2026-04-20] ingest | claude-chat-2026-04-20-regime-modeling

Source: raw/claude-chats/2026-04-20_regime-modeling.txt

Key takeaways:
- Regime transitions are faster during volatility spikes
- RECOVERY regime needs separate logic from RISK_OFF
- VIX 20-30 is ambiguous transition zone

Pages updated:
- Regime-modeling.md (added transition speed observation)
- RISK_OFF.md (clarified distinction from RECOVERY)
- Regime-indicators.md (noted VIX 20-30 ambiguity)
- contradictions.md (flagged: old notes said RECOVERY = RISK_OFF, now separated)

Status: Complete. Recommend review of RECOVERY regime definition.
```

### B. QUERY OPERATION

**Trigger:** User asks a question about the wiki

**Process:**
1. Read `wiki/_meta/index.md` to find relevant pages
2. Read relevant pages from `wiki/`
3. Synthesize answer using wiki content
4. Cite sources (e.g., [[Regime-modeling]] says X)
5. If answer valuable, suggest adding to wiki as new page
6. Add entry to `log.md`

**Important:** Query answers should be grounded in the wiki, not re-derived from raw sources.

### C. LINT OPERATION

**Trigger:** "Please lint the wiki"

**Process:**
1. Check for contradictions between pages
2. Identify stale claims (contradicted by newer sources)
3. Find orphan pages (no inbound links)
4. Find important concepts mentioned but lacking own page
5. Identify missing cross-references
6. Spot data gaps
7. Suggest new questions to investigate
8. Report findings with recommendations

**Output Example:**
```
## Lint Report

### Contradictions Found (2)
1. Regime-modeling.md says RECOVERY always follows RISK_OFF, but 2026-03-15 chat says RECOVERY can follow TRANSITION. Recommend clarification.
2. Old notes say VIX threshold is 25, new notes say 20. Recommend update.

### Stale Claims (1)
- Architecture-overview.md says "using RocketShip unmodified" but decisions.md says "forked RocketShip on 2026-04-15". Recommend update.

### Orphan Pages (1)
- Mistral-7B.md has no inbound links. Either delete or link from RL-training or Architecture.

### Concepts Mentioned But Not Paged (3)
- "Extended thinking" mentioned in 3 pages but no dedicated page
- "Backtesting strategy" mentioned but no deep page
- "Alpha threshold" mentioned but not defined

### Missing Cross-References (5)
[List of likely connections not yet made]

### Recommended Actions
1. Create [[Extended-thinking]] page
2. Update threshold definitions in [[Regime-indicators]]
3. Add missing links from [[RL-training]] to [[Mistral-7B]]
4. Clarify RECOVERY definition in [[Regime-modeling]]
```

---

## VI. MAINTENANCE RULES

### When Updating Pages

**Rule 1: Always update frontmatter**
```yaml
date_updated: YYYY-MM-DD  # Change this every edit
```

**Rule 2: Add to log.md on significant updates**
```markdown
## [2026-04-22] update | Regime-modeling.md

Added: RECOVERY regime definition
Reason: Source clarification from 2026-04-20 chat
Status: Requires human review
```

**Rule 3: Flag contradictions immediately**
If new information contradicts old:
1. Add to `contradictions.md`
2. Note both claims
3. Mark as "resolved" or "pending review"

**Rule 4: Cross-reference aggressively**
When updating a page, scan related pages and link them:
```markdown
See also: [[Related-Page1]] and [[Related-Page2]]
```

### When Creating New Pages

**Rule 1: Start with frontmatter**
```yaml
---
date_created: YYYY-MM-DD
date_updated: YYYY-MM-DD
source_count: 1
related_pages: []
status: "draft"
tags: []
---
```

**Rule 2: Move to "active" only after human review**
```yaml
status: "draft"  # ← Start here
status: "active" # ← Move here after approval
```

**Rule 3: Add entry to log.md**
```markdown
## [2026-04-22] create | New-Page-Name.md

Reason: [Why this page was needed]
Sources: [Which sources informed it]
Status: Draft, awaiting review
```

---

## VII. CONTRADICTION HANDLING

**File:** `wiki/_meta/contradictions.md`

**Format:**
```markdown
## Contradiction: RECOVERY Regime Definition

**Old Claim:** RECOVERY is a faster version of RISK_OFF
Source: Google Docs brainstorm (2026-03-10)

**New Claim:** RECOVERY is a separate regime that follows VIX peak
Source: Claude chat (2026-04-20)

**Status:** Resolved
**Resolution:** They are separate. Old thinking was incomplete. RECOVERY has different thresholds.
**Updated:** 2026-04-20
**Pages Affected:** Regime-modeling.md, RECOVERY.md, RISK_OFF.md

---
```

**Rule:** Never delete contradictions. Mark them "resolved" and explain the resolution. This is your audit trail.

---

## VIII. CROSS-REFERENCING RULES

### How to Link Pages

Use wiki-style links:
```markdown
[[Page-Name]]
```

Obsidian will auto-complete. When you see a concept mentioned that has its own page, link it.

### Link Density

**Good:**
- 3-5 links per 200-word page
- Links point to truly related concepts
- Each link adds context, not noise

**Bad:**
- 10+ links (too many, hard to follow)
- Linking unrelated pages (confuses graph view)
- Linking the same page repeatedly

### Graph View

Regularly check Obsidian's graph view:
1. Open Obsidian → Graph view
2. Look for clusters (good, shows related concepts)
3. Look for isolated pages (orphans, need links)
4. Look for over-connected hubs (check if still coherent)

---

## IX. INDEX & LOG FILES

### index.md (Content Catalog)

**Purpose:** Searchable catalog of all pages, helps Claude find relevant content

**Format:**
```markdown
# Wiki Index

## Core Concepts
- [[Leopold-thesis]] — What you know about bottlenecks
- [[Bottleneck-analysis]] — Power, compute, memory, storage, optical
- [[Portfolio-holdings]] — BE, CRWV, LITE, MU, SNDK, SPY

## Regime Modeling
- [[Regime-modeling]] — Overview of 4 regimes (primary page)
- [[RISK_ON]] — VIX<20, spreads<400bps
- [[TRANSITION]] — VIX 20-30, spreads 400-600bps
- [[RISK_OFF]] — VIX>30, spreads>600bps
- [[RECOVERY]] — VIX declining from peak
- [[Regime-indicators]] — Detectors: VIX, spreads, correlations, put/call, yield curve

## RL Training
- [[RL-concepts]] — RL overview for trading
- [[HUD-ai-integration]] — Using HUD.ai
- [[Mistral-7B]] — Model specs
- [[Reward-function]] — How rewards work
- [[Training-data]] — Dataset needs

## Architecture
- [[Architecture-overview]] — System design
- [[RocketShip-fork]] — Customization
- [[Tool-design]] — 10 tools
- [[Scenario-design]] — 30 test scenarios
- [[Backtesting-setup]] — 2000-2024 testing

## Decisions
- [[Decisions]] — Index of decisions
- [[2026-04-20_regime-count-decision]] — Why 4 regimes
- [[2026-04-22_recovery-separation-decision]] — Why RECOVERY is separate

[Etc...]
```

**Rule:** LLM updates index.md on every ingest. This is the search index.

### log.md (Audit Trail)

**Purpose:** Append-only record of everything that happened

**Format:**
```markdown
# Wiki Changelog

## [2026-04-20] ingest | claude-chat-2026-04-20-regime-modeling
- Processed regime modeling conversation
- Created [[RECOVERY]] page
- Updated [[Regime-modeling]] with separation logic
- Status: Complete

## [2026-04-21] update | Regime-modeling.md
- Added RECOVERY regime definition
- Clarified TRANSITION zone ambiguity
- Status: Approved

## [2026-04-22] lint | Full wiki health check
- Found 2 contradictions (flagged in contradictions.md)
- Found 1 orphan page (Mistral-7B.md)
- Recommended 3 new concepts to page
- Status: Complete, awaiting action

[Etc...]
```

**Rule:** Entries prefixed with `## [YYYY-MM-DD]` so they're parseable by simple tools.

---

## X. WORKFLOW CHECKLIST

### Before Ingesting a Source
- [ ] Source exported to `raw/`
- [ ] File named `YYYY-MM-DD_TOPIC.ext`
- [ ] You've read the source (or know what it contains)
- [ ] You have a sense of what should change

### During Ingest
- [ ] LLM reads source
- [ ] LLM discusses key takeaways with you
- [ ] You guide what to emphasize
- [ ] LLM writes/updates pages
- [ ] LLM updates index.md
- [ ] LLM updates log.md
- [ ] Contradictions flagged

### After Ingest
- [ ] Review wiki updates in Obsidian
- [ ] Check graph view for new connections
- [ ] Approve or request revisions
- [ ] Mark pages as "active"

### Weekly Maintenance
- [ ] Run lint operation (find gaps, contradictions, orphans)
- [ ] Review contradictions.md (ensure they're resolved)
- [ ] Check log.md (confirm recent activity)
- [ ] Ask: "What questions should we investigate next?"

---

## XI. SPECIAL RULES FOR LEOPOLD SYSTEM

### Regimes Are Sacred
- Every regime change goes to `Decisions.md`
- Regime definitions must be precise (VIX thresholds, spreads, etc.)
- Changes to regimes require approval before wiki update

### Architecture Must Be Current
- If design decisions change, `Architecture-overview.md` updates immediately
- If tools change, `Tool-design.md` updates
- Log all architecture changes

### Decisions Are Timestamped
- Every major decision gets own page with date
- Include: what was decided, why, alternatives considered, impact
- These become your audit trail

---

## XII. WHEN TO CONSULT THIS FILE

**Claude should check `schema.md`:**
- Before every ingest operation
- Before creating new pages
- Before updating pages
- Before running lint

**You should check `schema.md`:**
- Before your first ingest
- When adding new page types
- When maintaining becomes unclear
- Before major wiki restructuring

---

## XIII. CO-EVOLUTION

**This schema is not fixed.** As you use the wiki:
- You may discover better naming conventions
- You may find page structures that work better
- You may want new metadata fields
- You may want to reorganize folders

**Process:**
1. You notice something isn't working
2. You suggest a change to schema.md
3. Claude incorporates change
4. All future operations follow new rules
5. Optionally, retroactively update existing pages

Example:
```
You: "I notice contradictions.md is getting hard to scan. 
     Should we add a 'resolution_date' field?"

Claude: "Good idea. Let me update schema.md to add that field,
        then retroactively add it to existing entries."

Result: schema.md evolved, wiki improved.
```

---

## 🎬 NEXT STEPS

1. Review this schema
2. Customize for your preferences (if any)
3. Export all sources (using `EXPORT_INSTRUCTIONS.md`)
4. Create folder structure (using `FOLDER_STRUCTURE.md`)
5. Run first ingest (we'll walk through this)

You ready?
