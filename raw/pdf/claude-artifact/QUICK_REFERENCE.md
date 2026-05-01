# Domain Wiki Quick Reference

**Save this. Print if you want. Reference constantly.**

---

## 🎯 WHAT YOU'RE BUILDING

A **persistent knowledge base** that synthesizes your scattered brainstorming into structured, cross-referenced wiki pages that evolve as you learn.

---

## 📂 FOLDER STRUCTURE (Memorize This)

```
leopold-trading-system/
├─ raw/                    ← IMMUTABLE SOURCES (you put files here)
│  ├─ claude-chats/
│  ├─ chatgpt-chats/
│  ├─ google-docs/
│  └─ skilljar-notes/
│
├─ wiki/                   ← LLM MAINTAINS (pages you read)
│  ├─ _meta/ (index, log, contradictions)
│  ├─ core/ (Leopold thesis, bottlenecks, portfolio)
│  ├─ regime-modeling/ (4 regimes + definitions)
│  ├─ rl-training/ (HUD.ai, Mistral, concepts)
│  ├─ architecture/ (design, tools, scenarios)
│  ├─ decisions/ (why you chose X)
│  ├─ reading-notes/ (Skilljar + Chan)
│  └─ sources/ (summaries of sources)
│
├─ schema.md               ← CONFIGURATION (rules for maintaining)
└─ README.md               ← QUICK START
```

**Sacred rule:** Never modify files in `raw/`. LLM reads only.

---

## 🔄 THE FLOW (What Actually Happens)

```
Step 1: Export sources from Claude/ChatGPT/Google
        ↓
Step 2: Place in raw/ folder (organized by type)
        ↓
Step 3: Open Claude, paste schema.md
        ↓
Step 4: Say "Ingest [source names]"
        ↓
Step 5: Claude reads sources, creates/updates wiki pages
        ↓
Step 6: You review in Obsidian, approve
        ↓
Step 7: Repeat for next batch of sources
        ↓
RESULT: Synthesized, cross-referenced, maintainable knowledge base
```

---

## 📋 YOUR FILES & WHAT THEY DO

| File | Read First | Purpose |
|---|---|---|
| `DOMAIN_WIKI_README.md` | ✅ YES | Overview of everything |
| `EXPORT_INSTRUCTIONS.md` | ✅ YES (do this first) | How to get sources out of each platform |
| `FOLDER_STRUCTURE.md` | ✅ YES (create this) | Exact directory layout to create |
| `schema.md` | ✅ REFERENCE | Config file (paste to Claude before every ingest) |
| `FIRST_INGEST_WALKTHROUGH.md` | ✅ YES (do this second) | Step-by-step first ingest (template for all future ingests) |

---

## ⏱️ TIMELINE

| Phase | What | Time | Deliverable |
|---|---|---|---|
| **1: Setup** | Export sources, create folders | 2-3 hr | All sources in raw/ |
| **2: First Ingest** | Follow walkthrough with 3-5 sources | 45 min | 6-8 wiki pages |
| **3: 4 More Ingests** | Regime, RL, architecture, Skilljar | 1-2 days | ~40 wiki pages total |
| **4: Ongoing** | Each new source or update | 5-10 min | Wiki evolves |

---

## 📖 INGEST CHECKLIST (Do This Each Time)

- [ ] **Identify sources** (which ones to process)
- [ ] **Load schema** (paste schema.md to Claude)
- [ ] **Provide context** (what your system is, state of thinking)
- [ ] **Request ingest** ("Please ingest these 3 sources")
- [ ] **Paste sources** (one by one, let Claude respond)
- [ ] **Review output** (what pages did Claude create?)
- [ ] **Approve or revise** ("Looks good, save" or "Actually, change X")
- [ ] **Save to Obsidian** (copy pages to wiki/ folders)
- [ ] **Review graph** (Obsidian graph view, check connections)
- [ ] **Note any issues** (for next session)

---

## 🎁 WHAT CLAUDE MAINTAINS (After Each Ingest)

**Claude automatically:**
- ✅ Creates/updates wiki pages
- ✅ Adds cross-references ([[links]])
- ✅ Updates `index.md` (searchable catalog)
- ✅ Appends to `log.md` (audit trail)
- ✅ Flags contradictions in `contradictions.md`
- ✅ Maintains frontmatter (dates, tags, status)

**You don't have to do any of this.** It's automatic.

---

## ✨ KEY CONCEPTS

### Raw Layer (Immutable)
- Your source documents
- Claude reads but never modifies
- Organized by source type
- Reference if need original context

### Wiki Layer (Synthesized)
- LLM-maintained pages
- Organized by concept
- Cross-referenced
- Updated automatically

### Schema (Configuration)
- Rules for organization
- Conventions for page format
- Workflows for ingest/query/lint
- Paste to Claude before each operation

### Log (Audit Trail)
- When things happened
- What changed
- Why it changed
- Timeline of your learning

### Contradictions (Resolved Conflicts)
- Old thinking vs new thinking
- Which was wrong, which was right
- When you resolved it
- How you resolved it

---

## 🚀 START HERE

**Right now:**
1. Open `EXPORT_INSTRUCTIONS.md`
2. Start exporting your sources
3. Target: Get all sources into `raw/` folder by end of day

**Tomorrow:**
1. Create folder structure from `FOLDER_STRUCTURE.md`
2. Open `FIRST_INGEST_WALKTHROUGH.md`
3. Follow it step by step
4. Do your first ingest (45 min)

**Result:** You'll have a working wiki with 6-8 pages

---

## ⚡ COMMON MISTAKES (AVOID)

❌ Don't export everything and ingest all at once
→ Do: Batch 3-5 sources per ingest

❌ Don't modify files in raw/
→ Do: Only LLM reads raw, you read wiki

❌ Don't ingest without reviewing output
→ Do: Always check what Claude created, give feedback

❌ Don't skip schema.md
→ Do: Paste it to Claude before every ingest

❌ Don't ignore contradictions
→ Do: Flag, resolve, document (it's your audit trail)

---

## 🎯 SUCCESS LOOKS LIKE (By Week 2)

- [ ] All sources exported to `raw/`
- [ ] Folder structure created
- [ ] First 2-3 batches ingested (20+ wiki pages)
- [ ] Wiki looks organized in Obsidian
- [ ] Graph view shows connections
- [ ] log.md has entries for each ingest
- [ ] contradictions.md is populated (and resolved)
- [ ] You can ask Claude questions and it reads wiki

---

## 🆘 IF YOU GET STUCK

1. **Check the relevant document**
   - Exporting issues? → `EXPORT_INSTRUCTIONS.md`
   - Folder problems? → `FOLDER_STRUCTURE.md`
   - Ingest confusion? → `FIRST_INGEST_WALKTHROUGH.md`

2. **Paste schema.md to Claude**
   - Claude has the rules
   - Ask it for clarification

3. **Review your log.md**
   - See what you've done
   - Pattern might be obvious

4. **Ask yourself:** What am I trying to do right now?
   - Exporting? → Follow instructions
   - Creating folders? → Follow structure
   - Ingesting? → Follow walkthrough

---

## 📞 QUESTIONS ABOUT THIS SYSTEM

**Q: Can I start building the trading system while setting up the wiki?**
A: Yes. Do setup on day 1, start actual build on day 2. Wiki is separate.

**Q: Does the wiki slow down my actual work?**
A: No. By week 2, it saves time (Claude has synthesized knowledge, faster answers).

**Q: Can I go back and ingest sources I missed?**
A: Yes. Anytime. Just add them to raw/ and ingest.

**Q: What if my thinking changes?**
A: Update the wiki. Flag contradiction. Document resolution. This is expected.

**Q: Should I use this for my Claude tool knowledge too?**
A: No. Keep this domain wiki (Leopold system) separate from tool knowledge. Use Claude Projects for tool knowledge.

---

## 🎬 NEXT ACTION

**Do this right now:**

1. Open `EXPORT_INSTRUCTIONS.md`
2. Read the section for your first platform
3. Start exporting

Estimated time: 1-2 hours depending on how many chats you have

**When done:** Tell me you've exported everything, and we'll move to phase 2 (folder creation).

Good luck! 🚀
