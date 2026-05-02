---
date_created: 2026-05-02
date_updated: 2026-05-02
status: active
tags: [meta, housekeeping, wiki-maintenance]
---

# Wiki Housekeeping

Housekeeping process for maintaining wiki integrity.

## Process

### 1. Check for Empty Files

```bash
find wiki -name "*.md" -empty
```

Action: Delete or fill empty files.

**Findings:**
- `wiki/Agilith_OnePager.md` — Empty placeholder, deleted
- `wiki/Chan-Chapter4-StocksETFs.md` — Empty placeholder, deleted

### 2. Check for Broken Links

```bash
# Find all wiki links
grep -r '\[\[' wiki --include="*.md" | sed 's/\[\[\(.*\)\]\]/\1/' | sed 's/|.*//' | sort -u

# Verify each exists
find wiki -name "*.md" -exec grep -o '\[\[[^]]*\]\]' {} \; | sed 's/\[\[\(.*\)\]\]/\1/' | sed 's/|.*//' | while read link; do
  if ! find wiki -name "${link}.md" -o -d wiki/_meta | grep -q .; then
    echo "MISSING: $link"
  fi
done
```

**Findings:**
- `[[Chan-Chapter3]]` → Changed to `[[Chan-Chapter1-3-NoCode-ML]]` in `Agilith-Alpha-Stack-System.md`
- `[[_meta/contradictions]]` → Changed to `[[contradictions]]` in `Agilith-OnePager-Ingest.md` (wiki links don't use path prefixes)

### 3. Check Index vs Actual Files

```bash
# Get all wiki files
find wiki -name "*.md" > /tmp/wiki_files.txt

# Check index.md
grep '\[\[' wiki/_meta/index.md | sed 's/\[\[\([^]]*\)\]\]/\1/' | while read page; do
  if ! grep -q "^\*\*$page\*\*" wiki/_meta/index.md; then
    echo "Not in index: $page"
  fi
done
```

### 4. Update Log

Check `wiki/_meta/log.md` for:
- Recent ingests not logged
- Pages created that aren't in log

### 5. Update Contradictions

Check `wiki/_meta/contradictions.md` for:
- New contradictions found
- Resolutions applied

## Checklist

- [ ] Run empty file check
- [ ] Run broken link check
- [ ] Verify index.md completeness
- [ ] Update log.md with any new work
- [ ] Document any new contradictions
- [ ] Git commit all changes

## Notes

Wiki links use page names only, not paths. Link format: `[[Page-Name]]`

Subfolder pages: `[[reading-notes/Agilith-Alpha-Stack-System]]` (path in link)

Top-level `_meta` files: `[[index]]`, `[[log]]`, `[[contradictions]]` (no path)