# Folder Structure: Leopold Trading System Wiki

Create this exact structure in Obsidian (or your file system). Copy and paste this layout.

```
leopold-trading-system/
│
├─ README.md                          # Quick start guide (you'll create this)
├─ schema.md                          # Configuration file (we'll provide this)
│
├─ raw/                               # Immutable sources (Claude reads, never modifies)
│  ├─ claude-chats/                   # Exported Claude conversations
│  │  ├─ 2026-04-20_regime-modeling.txt
│  │  ├─ 2026-04-22_rl-strategy.txt
│  │  └─ (etc)
│  │
│  ├─ chatgpt-chats/                  # Exported ChatGPT conversations
│  │  ├─ 2026-03-15_bottleneck-analysis.txt
│  │  └─ (etc)
│  │
│  ├─ google-docs/                    # Exported Google Docs
│  │  ├─ 2026-04-10_leopold-thesis-brainstorm.md
│  │  ├─ 2026-04-15_regime-detection-notes.md
│  │  └─ (etc)
│  │
│  ├─ skilljar-notes/                 # Anthropic Skilljar PDFs
│  │  ├─ Anthropic_Skilljar_Courses.pdf
│  │  └─ Anthropic_Skilljar_Courses_1.pdf
│  │
│  └─ assets/                         # Images, diagrams (optional)
│     └─ (any images you want to reference)
│
├─ wiki/                              # LLM-maintained knowledge base
│  ├─ README.md                       # Overview of the wiki
│  │
│  ├─ _meta/                          # Metadata & maintenance
│  │  ├─ index.md                     # Catalog of all pages
│  │  ├─ log.md                       # Audit trail (append-only)
│  │  └─ contradictions.md            # Flagged conflicts in knowledge
│  │
│  ├─ core/                           # Core concepts (Leopold system)
│  │  ├─ Leopold-thesis.md            # What you know about bottlenecks
│  │  ├─ Bottleneck-analysis.md       # Power, compute, memory, storage, optical
│  │  └─ Portfolio-holdings.md        # BE, CRWV, LITE, MU, SNDK, SPY
│  │
│  ├─ regime-modeling/                # Regime detection framework
│  │  ├─ Regime-modeling.md           # RISK_ON, TRANSITION, RISK_OFF, RECOVERY
│  │  ├─ RISK_ON.md                   # Detailed: VIX<20, spreads<400bps
│  │  ├─ TRANSITION.md                # Detailed: VIX 20-30, spreads 400-600bps
│  │  ├─ RISK_OFF.md                  # Detailed: VIX>30, spreads>600bps
│  │  ├─ RECOVERY.md                  # Detailed: VIX declining from peak
│  │  └─ Regime-indicators.md         # VIX, spreads, correlations, put/call, yield curve
│  │
│  ├─ rl-training/                    # Reinforcement learning concepts
│  │  ├─ RL-concepts.md               # Overview of RL for trading
│  │  ├─ HUD-ai-integration.md        # Using HUD.ai for training
│  │  ├─ Mistral-7B.md                # Model specifications
│  │  ├─ Reward-function.md           # How to define rewards
│  │  └─ Training-data.md             # Dataset requirements
│  │
│  ├─ architecture/                   # System design
│  │  ├─ Architecture-overview.md     # High-level system design
│  │  ├─ RocketShip-fork.md           # RocketShip framework customization
│  │  ├─ Tool-design.md               # 10 tools Claude will use
│  │  ├─ Scenario-design.md           # 30 test scenarios
│  │  └─ Backtesting-setup.md         # 2000-2024 historical testing
│  │
│  ├─ decisions/                      # Decision log (why you chose X)
│  │  ├─ Decisions.md                 # Index of all major decisions
│  │  ├─ 2026-04-20_regime-count.md   # Why 4 regimes, not 3
│  │  ├─ 2026-04-22_rl-vs-rules.md    # Why RL over hardcoded rules
│  │  └─ (etc)
│  │
│  ├─ reading-notes/                  # From Chan's books & Skilljar
│  │  ├─ Chan-generative-ai.md        # Takeaways from Chan's book
│  │  ├─ Chan-hands-on-ai.md          # Takeaways from second book
│  │  ├─ Skilljar-claude-101.md       # Key techniques from Skilljar
│  │  └─ Skilljar-claude-code-101.md  # Key techniques from Skilljar
│  │
│  └─ sources/                        # Summary pages for each source
│     ├─ Source-summaries.md          # Index of source summaries
│     ├─ claude-chat-2026-04-20.md    # Summary of regime modeling chat
│     └─ (etc - one per source)
│
└─ obsidian/                          # Obsidian-specific files (optional)
   ├─ .obsidian/                      # Obsidian configuration
   └─ (auto-created by Obsidian)
```

---

## 🎯 What Each Folder Does

### `raw/` — Read-only sources
- **Never modify these files**
- Immutable record of what you read
- Claude reads from here but doesn't write here
- Organized by source type (claude-chats, chatgpt-chats, google-docs, skilljar-notes)

### `wiki/` — LLM-maintained knowledge base
- **Claude writes here, you read here**
- Organized by concept/domain, not by source
- Cross-referenced and synthesized
- Updated as you learn new things

### `wiki/_meta/` — Metadata files
- `index.md` — Searchable catalog of all wiki pages
- `log.md` — Append-only audit trail (when, what, why)
- `contradictions.md` — Conflicts between sources/understanding

### `wiki/core/` — Core Leopold concepts
- Your thesis about bottlenecks
- Analysis of which ones matter
- Current portfolio holdings

### `wiki/regime-modeling/` — Regime framework
- Definition of each regime (RISK_ON, TRANSITION, RISK_OFF, RECOVERY)
- Thresholds and indicators
- How to detect each regime

### `wiki/rl-training/` — RL concepts
- What RL means for your system
- HUD.ai integration specifics
- Training approach

### `wiki/architecture/` — System design
- High-level architecture
- Tool design (10 tools Claude will use)
- Scenario design (30 test scenarios)
- Backtesting setup

### `wiki/decisions/` — Why you chose things
- Major decision points
- Why 4 regimes vs 3
- Why RL vs hardcoded
- When thinking evolved

### `wiki/reading-notes/` — From external sources
- Key takeaways from Chan's books
- Skilljar techniques
- Important concepts from articles

### `wiki/sources/` — Source metadata
- Summary of what each source contained
- When it was ingested
- Key contributions

---

## 📝 Creating the Folder Structure

### In Obsidian:
1. Create new vault: `leopold-trading-system`
2. Create folders matching above structure
3. Obsidian will auto-create `.obsidian/` folder

### Manually:
```bash
# If using terminal/command line
mkdir -p leopold-trading-system/raw/{claude-chats,chatgpt-chats,google-docs,skilljar-notes}
mkdir -p leopold-trading-system/wiki/{_meta,core,regime-modeling,rl-training,architecture,decisions,reading-notes,sources}
```

### Using Finder/Explorer:
1. Create `leopold-trading-system/` folder
2. Right-click → New Folder → `raw`
3. Inside `raw`, create: `claude-chats`, `chatgpt-chats`, `google-docs`, `skilljar-notes`
4. Back in main folder, create `wiki`
5. Inside `wiki`, create: `_meta`, `core`, `regime-modeling`, `rl-training`, `architecture`, `decisions`, `reading-notes`, `sources`

---

## ✅ Verification Checklist

After creating structure, confirm:

- [ ] `raw/` folder exists with 4 subfolders
- [ ] `raw/` contains exported chats and docs
- [ ] `wiki/` folder exists with 8 subfolders
- [ ] `wiki/` is currently empty (we'll populate in ingest)
- [ ] `schema.md` will go in root (next step)
- [ ] `README.md` will go in root (next step)
- [ ] All files are readable (not locked)

---

## 🎬 Next Steps

1. **Create this folder structure** (15 min)
2. **Export all sources** using `EXPORT_INSTRUCTIONS.md` (1-2 hours)
3. **Place sources in `raw/`** (organized by type)
4. **Come back here, I'll create `schema.md`** (the configuration file)
