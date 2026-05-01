# How to Use the Master Prompt

**This is simple. 3 steps.**

---

## 📋 STEP 1: Copy the Master Prompt

Open `MASTER_PROMPT.md` (the file I just created).

Copy **the entire thing**.

---

## 🔗 STEP 2: Paste into Claude (Chat or Code)

**Option A: Claude.ai (Web Chat)**
1. Go to claude.ai
2. Start a new chat
3. Paste the master prompt
4. Send

**Option B: Claude Code (Terminal)**
1. Open terminal
2. `cd` to your `leopold-trading-system/` folder
3. Run `claude`
4. Paste the master prompt
5. Send

**Either works. Claude Code is slightly better (handles files), but chat works fine too.**

---

## 📤 STEP 3: Upload Your Sources & Ingest

Claude will say: "Ready to ingest sources. What do you have?"

Then you do this:

```
I have sources to ingest. Here they are:

[Either paste the content directly, OR]
[Upload the files if using Claude Code]

Files:
- claude-chat-2026-04-10-leopold-thesis.txt
- claude-chat-2026-04-12-bottleneck-analysis.txt
- google-doc-2026-04-15-portfolio-rationale.txt

Please ingest all three and create the initial wiki pages.
```

Claude will:
1. Read your sources
2. Create wiki pages
3. Update index.md
4. Add to log.md
5. Flag contradictions (if any)
6. Report summary

---

## 🎁 What You Get

After first ingest, Claude will show you:

```
## Ingest Complete

Pages created:
- Leopold-thesis.md
- Bottleneck-analysis.md
- Portfolio-holdings.md

Pages updated:
- index.md
- log.md

Contradictions: None

Recommendation: Next, ingest regime modeling sources
```

---

## 💾 Saving to Obsidian (Optional)

**If you want to see the wiki in Obsidian:**

1. Create the folder structure (from `FOLDER_STRUCTURE.md`)
2. Ask Claude: "Show me the content of [[Leopold-thesis.md]]"
3. Copy the markdown
4. Paste into `wiki/core/Leopold-thesis.md` in Obsidian
5. Repeat for all pages

OR (better): If using Claude Code with the folder already created, Claude can write directly to files.

---

## 🔄 Future Ingests (Super Simple)

After the first one, just:

```
Claude, I have new sources to ingest:
- [paste or upload new sources]

Please ingest and update the wiki accordingly.
```

Claude handles it automatically.

---

## ⚡ That's It

**You don't need:**
- EXPORT_INSTRUCTIONS.md (optional - for context)
- FOLDER_STRUCTURE.md (optional - for context)
- FIRST_INGEST_WALKTHROUGH.md (optional - for context)
- schema.md (already embedded in master prompt)

**The master prompt is self-contained.** Just:
1. Copy it
2. Paste to Claude
3. Upload sources
4. Claude builds the wiki

---

## 📝 What Sources to Give Claude

You can give Claude any of these:

✅ **Direct text:**
```
Here's a Claude chat transcript:
[paste full text of conversation]

Here's my brainstorming notes:
[paste notes]
```

✅ **File contents (pasted):**
```
File: claude-chat-2026-04-10-leopold-thesis.txt
[paste entire file contents]

File: google-doc-2026-04-15-portfolio.md
[paste entire doc contents]
```

✅ **File uploads (Claude Code only):**
```
I'm uploading these source files:
[upload files from raw/ folder]

Please ingest them.
```

**Easiest for first time:** Just paste the text content directly.

---

## 🎯 Recommended First Ingest

Give Claude 3 sources about the **Leopold thesis**:

1. Any early brainstorming about "what is Leopold?"
2. Any thinking about "which bottlenecks matter?"
3. Any notes about "why this portfolio fits the thesis?"

This creates your foundation. Then future ingests build on it.

---

## ✅ You're Done Setting Up

That's actually it.

1. **Copy MASTER_PROMPT.md**
2. **Paste to Claude**
3. **Upload sources**
4. **Watch Claude build the wiki**

No complicated setup, no folder structure to create manually, no schema to understand. Claude handles all the rules automatically.

---

## 🆘 If Something Goes Wrong

**Claude made pages but they don't look right:**
- Give feedback: "Actually, this page should include X"
- Claude revises

**I want to ingest more sources later:**
- Just paste the master prompt again (or reference previous context)
- Upload new sources
- Claude continues building/updating

**I want to lint the wiki:**
- Ask: "Please lint the wiki and report any issues"
- Claude checks for orphans, contradictions, gaps

**I want to manually edit pages:**
- You can! Just edit in Obsidian
- Tell Claude next time you ingest: "Note: I manually updated this page"
- Claude will incorporate that into future work

---

## 🚀 Go

1. Open `MASTER_PROMPT.md`
2. Copy everything
3. Paste to Claude (chat.ai or `claude` in terminal)
4. Wait for Claude to say "Ready"
5. Give it your sources
6. Watch it build the wiki

That's it. You're done setting up. Now you just use it.

Good luck! 🚀
