# Leopold Trading System: Domain Wiki Setup

You're about to build a **persistent, evolving knowledge base** for your 4-month internship. This document explains what you're doing and how to get started.

---

## 🎯 What You're Building

A **Domain Wiki** that:
- ✅ Synthesizes all your scattered brainstorming (Claude chats, ChatGPT, Google Docs)
- ✅ Organizes knowledge by concept, not by source
- ✅ Maintains cross-references automatically
- ✅ Evolves as you learn (adds pages, updates thinking, flags contradictions)
- ✅ Becomes your persistent memory across all Claude sessions
- ✅ Gives you an audit trail of decisions and how thinking evolved

**Why this matters:**
By month 3, when you ask Claude "design regime detection", it won't re-derive from raw brainstorming. It'll read your synthesized `Regime-modeling.md` and answer in minutes instead of hours. And you'll know exactly when/why you made each decision.

---

## 📚 Your Documents (In This Folder)

You now have these files. Use them in order:

### 1. **EXPORT_INSTRUCTIONS.md** (Read first)
**What:** Step-by-step to get sources out of Claude, ChatGPT, Google Docs

**Time:** 1-2 hours (depends on how many chats you have)

**Next:** Do this first. Get all your scattered knowledge into `raw/` folder.

---

### 2. **FOLDER_STRUCTURE.md** (Create folders)
**What:** Exact folder layout for your wiki

**Time:** 15 minutes

**Do:** Create the folder structure using the exact layout provided

**Why:** The LLM needs this structure to maintain the wiki correctly

---

### 3. **schema.md** (The config file)
**What:** Rules for how the wiki is organized and maintained

**Time:** Read once, reference often

**Do NOT:** Modify this yet. Just read to understand.

**Why:** This is what you'll paste to Claude before every ingest. It tells Claude HOW to maintain your wiki.

---

### 4. **FIRST_INGEST_WALKTHROUGH.md** (The actual process)
**What:** Step-by-step walkthrough of your first ingest

**Time:** 30-45 min (first time)

**Do:** Follow this exactly. It's your template for all future ingests.

**Why:** Walks you through turning 3-5 source files into structured wiki pages

---

## 🚀 Your Step-by-Step Timeline

### **Phase 1: Setup (2-3 hours)**

```
1. Read EXPORT_INSTRUCTIONS.md                     (15 min)
2. Export sources from Claude, ChatGPT, Google     (1-2 hours)
3. Create folder structure from FOLDER_STRUCTURE.md (15 min)
4. Organize exported files into raw/ folder        (15 min)
5. Verify everything is in place                   (10 min)
```

**Deliverable:** All sources exported and organized in `raw/` folder

**Estimate:** Today or tomorrow

---

### **Phase 2: First Ingest (45 min)**

```
1. Open Claude chat
2. Paste schema.md to load rules into Claude context
3. Provide Leopold system context
4. Request ingest of first batch (3-5 sources)
5. Paste sources one by one
6. Review Claude's generated wiki pages
7. Approve and save to Obsidian
```

**Deliverable:** 6-8 wiki pages in Obsidian (Leopold thesis, bottleneck analysis, portfolio, etc.)

**Estimate:** 45 minutes

---

### **Phase 3: Subsequent Ingests (10-30 min each)**

```
Second batch (regime modeling): 20 min
Third batch (RL concepts): 20 min
Fourth batch (architecture): 20 min
Fifth batch (Skilljar techniques): 15 min
```

**Deliverable:** By end of Phase 3, all your knowledge is synthesized in wiki

**Estimate:** 4-5 days of part-time work

---

### **Phase 4: Ongoing (5 min per session)**

```
Every time you learn something new:
- Tell Claude: "Ingest this new source" or "Update this page"
- Claude updates wiki automatically
- You review in Obsidian
```

**Deliverable:** Living, evolving knowledge base

**Estimate:** 5 min per new source

---

## 📖 How to Use This System

### **During Your Work**

```
Day-to-day (4-month build):
┌─────────────────────────────────────┐
│ You're building the trading system  │
│ (Month 1-4 from your 4-month plan)  │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    Learn something       Have a question
        │                     │
        ↓                     ↓
    "Claude, ingest      "How should I
     this new idea"      design X?"
        │                     │
        ↓                     ↓
    Wiki updates         Claude reads wiki
    (synthetic)          (fast, accurate answer)
```

### **Typical Session (Month 2)**

```
You: "I need to design regime detection logic"

Claude: Reads wiki (pre-synthesized knowledge):
- regime-modeling.md (what you know about regimes)
- Leopold-thesis.md (why this matters)
- decisions.md (why you chose 4 regimes)
- architecture-overview.md (how it fits)

→ Gives better answer in 5 min vs 30 min if reading raw brainstorming
```

### **When You Get Stuck**

```
You: "I'm confused about RECOVERY vs RISK_OFF"

Claude: Checks contradictions.md
→ Finds you already resolved this on [date]
→ Shows you the decision + reasoning
→ You remember, move on
```

---

## 🎁 What You Get By End of Ingest Phase

**In Obsidian:**
- 30+ structured wiki pages
- Organized by concept, not by source
- Cross-referenced and linked
- Searchable (via Obsidian graph/search)

**In `wiki/_meta/`:**
- `index.md` — Searchable catalog of all pages
- `log.md` — Timeline of when you learned what
- `contradictions.md` — Your resolved conflicts (audit trail)

**In your brain:**
- Clear understanding of your own thinking
- Timeline of decisions
- Patterns in your analysis

**Bonus:**
- Mentors impressed with your organizational skills
- When writing up your internship: "Here's how I evolved my thinking..." (with timeline)
- Template for future projects (build more wikis using this schema)

---

## ⚡ Why This System Works (vs Just Using Claude Projects)

| | Claude Projects | Domain Wiki |
|---|---|---|
| **Static or Dynamic?** | Static (doesn't evolve) | Dynamic (compounds over time) |
| **Finds contradictions?** | No (you hunt manually) | Yes (LLM flags automatically) |
| **Cross-references?** | Manual | Automatic |
| **Audit trail?** | No | Yes (log.md) |
| **By Month 3...** | Still re-deriving knowledge | Wiki does the work |

---

## 🎯 What NOT to Do

❌ **Don't** export everything and ingest all at once
- Start with 3-5 sources, master the flow
- Batch 2-3 sources per ingest session
- By 5th ingest, you'll be fast

❌ **Don't** modify files in `raw/` folder
- `raw/` is immutable (source of truth)
- Only `wiki/` changes

❌ **Don't** ingest without reviewing output
- Always check what Claude created
- Give feedback
- Approve before saving

❌ **Don't** skip the schema.md step
- Paste it to Claude before every ingest
- It's what makes Claude a disciplined maintainer

❌ **Don't** treat contradictions as failures
- They're normal, expected, valuable
- Flag them, resolve them, document resolution
- This is your audit trail

---

## ✅ Checklist: Before You Start

- [ ] Read `EXPORT_INSTRUCTIONS.md`
- [ ] Read `FOLDER_STRUCTURE.md`
- [ ] Skim `schema.md` (understand the concept)
- [ ] Read `FIRST_INGEST_WALKTHROUGH.md`
- [ ] Ready to export your sources
- [ ] Ready to create folder structure
- [ ] Obsidian installed (or equivalent markdown viewer)

---

## 🚀 Next Action

**RIGHT NOW:**
1. Open `EXPORT_INSTRUCTIONS.md`
2. Start exporting your sources
3. Organize them in the `raw/` folder structure

**Target:** Complete by end of day or tomorrow

**Then:** Come back and we'll do your first ingest

---

## ❓ FAQ

### **Q: How many sources should I ingest per session?**
A: 3-5. First batch might take 45 min, second batch 20 min, third 15 min.

### **Q: Can I ingest all sources at once?**
A: Technically yes, but not recommended. Start small, see how Claude maintains the wiki, learn the flow.

### **Q: Will this slow down my actual work?**
A: No. First week is setup (2-3 hours). By week 2, ingesting takes 5-10 min and saves 30 min elsewhere.

### **Q: What if a source contradicts what I already have in the wiki?**
A: Flag it in `contradictions.md`. Resolve it. Document the resolution. This is good—it means you're learning.

### **Q: Can I modify wiki pages manually?**
A: Yes, but do it carefully. Ideally let Claude maintain it. If you manually edit, update log.md to note the change.

### **Q: What if I realize the folder structure is wrong?**
A: It's fine. You can reorganize. The wiki is just markdown files in folders. Restructure, update schema.md, continue.

### **Q: Can I use this for my tool knowledge (Claude operating manual) too?**
A: Not recommended. Keep domain wiki (Leopold system) separate from tool knowledge (how to use Claude). Use Claude Projects for tool knowledge.

---

## 📞 Support

You have these files. You understand the flow. You know how to:
1. Export sources
2. Create folder structure
3. Follow the ingest walkthrough
4. Review in Obsidian

If you get stuck:
1. Re-read the relevant document
2. Check `schema.md` for rules
3. Ask Claude for help (it has the schema loaded)

---

## 🎬 Let's Go

You're building something valuable here. By end of this 4-month internship:
- You'll have a structured wiki of everything you learned
- You'll have timestamps on every decision
- You'll have contradictions flagged and resolved
- You'll have proof of learning and growth

**Start with Phase 1 (exporting sources). Target: today or tomorrow.**

When you've got all sources exported and organized in `raw/`, come back here and we'll do your first ingest together.

Good luck! 🚀
