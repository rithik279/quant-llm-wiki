# Book Ingestion Process

## Core Principle

**Every Chan concept → Leopold thesis + Agilith thesis first.** Connections to internship goals come second. The thesis connections are what make the books searchable for your queries.

---

## Step-by-Step Process

### 1. EXTRACT
```
- python pdfplumber → full text
- Save as [bookname]_full.txt
```

### 2. STRUCTURE
```
- Find all chapter markers
- Map chapters to TOC
- Identify key concepts per chapter
```

### 3. CREATE PAGES

**Required pages per book:**
1. `Chan-Chapter[N]-[Topic].md` — One per chapter
2. `QTB-Full-Summary.md` — Comprehensive book summary
3. `Chan-Agilith-Integration.md` — **THE CRITICAL PAGE**

### 4. CROSS-REFERENCE (MOST IMPORTANT)

**For each chapter page, answer:**
- How does this connect to **Leopold thesis** (bottleneck rotation)?
- How does this connect to **Agilith thesis** (5-layer alpha stack)?
- How does this connect to specific **Alpha ideas** (Infrastructure, Margin, etc.)?
- How does this connect to **Regime modeling** (RISK_ON/OFF)?

**Cross-ref matrix:**
```
Chan concept → Leopold (bottleneck rotation)
            → Agilith (alpha stack layers)
            → Agilith-Research-Plan (5 alpha ideas)
            → Regime-modeling (4 states)
            → RL-Training-Setup (if relevant)
```

### 5. AGILITH INTEGRATION PAGE

**Must contain:**
- Leopold thesis core (bottleneck rotation context)
- Agilith thesis core (5-layer alpha stack)
- "How to use this guide" section
- Query-answer format: "How does Chan concept apply to Leopold/Agilith?"
- Quick reference table (Chan → Leopold/Agilith)
- Key quotes applied to thesis

### 6. BACKLINK

**All directions:**
- Agilith pages → Chan pages
- Chan pages → Agilith pages
- Chan pages → Chan-Agilith-Integration
- All pages → relevant thesis pages

### 7. UPDATE META

```
- log.md: document ingest with thesis connections
- index.md: add pages with thesis context
```

---

## Example Query Flow

**User asks:** "When do infrastructure stocks revert?"

**Process:**
1. Search Chan-Agilith-Integration.md for "revert"
2. Find: Mean Reversion + Bottleneck Clearing
3. Answer: Chan Ch2 half-life + regime switch + Leopold context
4. Cross-ref: Agilith-Alpha-Stack-System Layer 5, Bottleneck-analysis

---

## Key Rules

1. **Leopold/Agilith first** — thesis context before internship goals
2. **Every chapter → thesis** — don't skip connections
3. **Query-ready** — structure for natural language questions
4. **Backlink all** — bidirectional links
5. **Ultra caveman** — drop filler, keep technical terms
6. **Update meta** — log + index after each ingest

---

## Required Related Pages (always link to)

**Leopold:**
- [[Leopold-thesis]]
- [[Bottleneck-analysis]]

**Agilith:**
- [[Agilith-Research-Plan]]
- [[Agilith-Alpha-Stack-System]]
- [[Regime-modeling]]
- [[Agilith-Momentum-System]]
- [[4-Month-Build-Plan]]
- [[RL-Training-Setup]]

**Chan chapters:**
- [[Chan-Chapter1-Backtesting]]
- [[Chan-Chapter2-MeanReversion]]
- [[Chan-Chapter6-Momentum]]
- [[Chan-RiskManagement]]