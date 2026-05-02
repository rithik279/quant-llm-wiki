---
date_created: 2026-05-02
date_updated: 2026-05-02
status: active
tags: [meta, ingestion, process, documentation]
---

# Book Ingestion Process

Process for ingesting books/papers into the wiki knowledge base.

## Overview

LLM Wiki pattern: Drop sources → Ingest → Wiki with cross-references + contradictions.

## Step 1: Extract Source

### PDF via Python/pdfplumber

```bash
py -c "
import pdfplumber

with pdfplumber.open('raw/books/BookName.pdf') as pdf:
    with open('raw/books/BookName_full.txt', 'w', encoding='utf-8') as f:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                f.write(text + '\n\n')
"
```

### HTML via BeautifulSoup (if needed)

```python
from bs4 import BeautifulSoup

with open('source.html', 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')
```

## Step 2: Create Summary Pages

### Per-Chapter Pages

For multi-chapter books, create one page per chapter:
- `wiki/reading-notes/BookName-ChapterN-Title.md`
- Include: date_updated, source_count, related_pages, tags

### Full Summary Page

- `wiki/reading-notes/BookName-Full-Summary.md`
- 3 sections: Overview, Chapter-by-chapter summary, Key insights
- Table: Concept → Application → Page reference

### Integration Page

- `wiki/reading-notes/BookName-Agilith-Integration.md`
- Cross-reference to core thesis (Leopold, Agilith, Regime modeling)
- Key quotes applied to specific use cases
- Quick reference table for all concepts

## Step 3: Cross-Reference

### Update Related Pages

Add new page to related_pages in:
- Core thesis pages (Leopold-thesis, Bottleneck-analysis)
- System pages (Agilith-Alpha-Stack-System, RocketShip-Framework)
- Implementation pages (RL-Training-Setup, Regime-modeling)

### Update Index

Add new pages to `wiki/_meta/index.md`:
- Reading notes section for book chapters
- Cross-reference section for connections

## Step 4: Document Contradictions

If conflicting information found:
1. Document in `wiki/_meta/contradictions.md`
2. State old claim vs new claim
3. Include resolution if available

## Step 5: Update Log

Add entry to `wiki/_meta/log.md`:
- Date
- Source file
- Key content summary
- Pages created
- Cross-reference work
- Contradictions found

## File Naming Convention

```
wiki/reading-notes/BookName-Section-Name.md
wiki/reading-notes/Chan-BookName-ChapterN-Title.md
```

Examples:
- `Chan-GanAI-Full-Summary.md`
- `Chan-Chapter4-8-Generative-Models.md`
- `Agilith-OnePager-Ingest.md`

## Frontmatter Template

```markdown
---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_files: [raw/books/BookName.pdf]
related_pages: [Related-Page1, Related-Page2]
status: active
tags: [tag1, tag2, book-name]
---

# Page Title

## Section

Content...

## See Also
- [[Related-Page]] — Description
- [[Another-Page]] — Description
```

## Quality Checks

1. **Completeness:** All chapters covered
2. **Cross-references:** All links resolve
3. **Leopold connections:** Bottleneck thesis linked where relevant
4. **Agilith integration:** System pages updated
5. **Contradictions:** Any conflicts with existing wiki noted

## Sources Ingested

| Date | Source | Pages |
|------|--------|-------|
| 2026-04-30 | Situational Awareness (Aschenbrenner) | 19 |
| 2026-04-30 | Agilith Capital PDFs | 9 |
| 2026-05-01 | ChatGPT Exports (5 chats) | 5 |
| 2026-05-01 | Claude Artifact Exports | 5 |
| 2026-05-01 | Claude Session Transcripts | 11 |
| 2026-05-01 | Planning Artifacts | 2 |
| 2026-05-02 | Machine Trading (Chan) | 3 |
| 2026-05-02 | Quantitative Trading (Chan) | 4 |
| 2026-05-02 | Algorithmic Trading (Chan) | 5 |
| 2026-05-02 | Generative AI for Trading (Chan) | 5 |

## Notes

- Wiki link syntax: `[[Page-Name]]` (no path for same-level)
- Subfolder: `[[reading-notes/Page-Name]]`
- _meta files: `[[index]]`, `[[log]]`, `[[contradictions]]`
- Date format: YYYY-MM-DD
- Use `py` command on Windows for Python scripts