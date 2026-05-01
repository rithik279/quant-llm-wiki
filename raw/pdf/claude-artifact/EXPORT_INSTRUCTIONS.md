# Export Instructions: Getting Your Sources Out

This document walks you through exporting from each platform.

---

## 1. CLAUDE CHATS (Claude.ai)

### Option A: Export Individual Chats (Recommended)
1. Open a chat in claude.ai
2. Click the **three dots (⋯)** in the top right
3. Select **"Share"** → Look for export option (may be "Copy transcript" or similar)
4. If no direct export:
   - Select all (Cmd/Ctrl + A)
   - Copy
   - Paste into a `.txt` file
   - Save to: `raw/claude-chats/CONVERSATION_NAME.txt`

### Option B: Export All Chats at Once
1. Go to claude.ai → **Projects** (if using Projects feature)
2. Look for bulk export or archive option
3. If available, download and organize into `raw/claude-chats/`
4. If not, use Option A for key conversations

### File Naming Convention
```
raw/claude-chats/
├─ 2026-04-20_regime-modeling-exploration.txt
├─ 2026-04-22_rl-training-strategy.txt
├─ 2026-04-25_system-architecture-design.txt
└─ (etc)
```

**Format:** `YYYY-MM-DD_TOPIC.txt`

---

## 2. CHATGPT CHATS (ChatGPT.com)

### How to Export
1. Open ChatGPT → Account icon → **"Settings"** or **"History"**
2. Look for **"Export all"** or similar (OpenAI has conversation export features)
3. If directly available:
   - Download as JSON or PDF
   - Convert to `.txt` if PDF
   - Save to: `raw/chatgpt-chats/`
4. If not available:
   - Open each conversation
   - Select all (Cmd/Ctrl + A)
   - Copy
   - Paste into `.txt` file

### Manual Export (No Bulk Feature)
For each conversation:
1. Click conversation title
2. Select all text (Cmd/Ctrl + A)
3. Copy
4. Paste into `CONVERSATION_NAME.txt`
5. Save to `raw/chatgpt-chats/`

### File Naming
```
raw/chatgpt-chats/
├─ 2026-03-15_bottleneck-analysis.txt
├─ 2026-03-18_quantitative-setup.txt
└─ (etc)
```

**Format:** `YYYY-MM-DD_TOPIC.txt`

---

## 3. GOOGLE DOCS

### How to Export
1. Open the Google Doc
2. **File** → **Download** → Choose format:
   - **Markdown (.md)** (best, if available)
   - **Plain text (.txt)** (second best)
   - **PDF** (last resort, harder to parse)
3. Save to: `raw/google-docs/DOCUMENT_NAME.md` (or `.txt`)

### Batch Export Multiple Docs
1. Go to Google Drive
2. Select multiple docs (Cmd/Ctrl + Click)
3. Right-click → **Download** (if available)
4. If not available, download individually

### File Naming
```
raw/google-docs/
├─ 2026-04-10_leopold-thesis-brainstorm.md
├─ 2026-04-15_regime-detection-notes.md
├─ 2026-04-20_rl-training-planning.md
└─ (etc)
```

**Format:** `YYYY-MM-DD_TOPIC.md`

---

## 4. SKILLJAR NOTES (Already Have as PDF)

Just move/copy to:
```
raw/skilljar-notes/
├─ Anthropic_Skilljar_Courses.pdf
└─ Anthropic_Skilljar_Courses_1.pdf
```

These stay as-is (PDFs are fine).

---

## 5. OTHER SOURCES (Optional)

If you have:
- **Articles/blogs** → Save as `.md` or `.txt` to `raw/articles/`
- **Book notes** → Save as `.md` to `raw/books/`
- **Meeting notes** → Save as `.txt` or `.md` to `raw/meetings/`
- **Code** → Save actual code files to `raw/code/`

Example:
```
raw/books/
└─ 2026-04-20_chan-generative-ai-for-trading-notes.md

raw/articles/
└─ 2026-04-22_regime-detection-research.md
```

---

## 📋 Checklist: Before You Start Ingesting

- [ ] All Claude chats exported to `raw/claude-chats/`
- [ ] All ChatGPT chats exported to `raw/chatgpt-chats/`
- [ ] All Google Docs exported to `raw/google-docs/`
- [ ] Skilljar PDFs moved to `raw/skilljar-notes/`
- [ ] Files are named with format: `YYYY-MM-DD_TOPIC.ext`
- [ ] Total file count noted (you'll reference this)
- [ ] Folder structure matches below

---

## Final Folder Structure Before Ingest

```
leopold-trading-system/
└─ raw/
   ├─ claude-chats/
   │  ├─ 2026-04-20_regime-modeling-exploration.txt
   │  ├─ 2026-04-22_rl-training-strategy.txt
   │  └─ (more files)
   │
   ├─ chatgpt-chats/
   │  ├─ 2026-03-15_bottleneck-analysis.txt
   │  └─ (more files)
   │
   ├─ google-docs/
   │  ├─ 2026-04-10_leopold-thesis-brainstorm.md
   │  ├─ 2026-04-15_regime-detection-notes.md
   │  └─ (more files)
   │
   └─ skilljar-notes/
      ├─ Anthropic_Skilljar_Courses.pdf
      └─ Anthropic_Skilljar_Courses_1.pdf
```

---

## 🎯 Next Steps

1. **Complete this export** (aim for today)
2. **Create folder structure** (10 min)
3. **Place all files** in correct directories
4. **Run first ingest** (we'll do this together)

**Estimated time: 1-2 hours** (depending on volume)

Once all files are organized, come back and we'll:
1. Create `schema.md`
2. Create initial wiki pages
3. Run first ingest batch
