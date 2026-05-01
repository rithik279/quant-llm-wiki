---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Research-Plan]
status: active
tags: [agilith-capital, strategy, alpha, ideas, five-ideas]
---

# Agilith Research Plan

Five alpha ideas for the Agilith Capital quant fund.

## Tier A (Best)

### 1. Infrastructure Constraint Nowcast
**Thesis**: AI demand runs into physical traffic jams → buy the "shovel sellers"

**Key insight**: Not the flashy AI app companies. Companies that already own or sell the scarce equipment (electricity, transformers, switchgear, cooling, grid connection).

**Test steps**:
1. Build constraint score from company text + public data
2. Link each stock to bottleneck (beneficiary vs victim)
3. Backtest: long highest-quality beneficiaries, short overassumed winners
4. Validate: hit rate, spread return, factor exposure

**Tools**: SEC EDGAR, transcripts, DOE/CISA grid reports, keyword dictionaries

### 2. Margin Before Revenue Recognition
**Thesis**: AI cuts costs first (support, coding, sales), profits improve before revenue.

**Key insight**: Screens may misread AI productivity as maturity or cyclical leverage.

**Test steps**:
1. Build productivity features (SG&A/revenue, R&D/revenue, revenue per employee)
2. Add text evidence (pilot → scaled language)
3. Exclude fake cases (layoffs, restructuring)
4. Backtest post-earnings over 8-16 weeks

### 3. Transformer/Interconnection Delay
**Thesis**: Timing mismatch trade — market prices "AI capex is big" but real earnings depend on when projects energize.

**Key insight**: Some companies priced like lights turn on soon, but delays push that out by quarters.

**Test steps**:
1. Build delay-risk score from transcript mentions + grid queue data
2. Split into Group A (assumes near-term ramp) vs Group B (bottleneck winners)
3. Pair trade or basket trade
4. Test timing windows: 1, 3, 6 months

## Tier B

### 4. AI Engagement Surprise
**Thesis**: Not who talks most about AI, but who changed their AI talk relative to own past and peers.

**Signal**: "surprise" not raw buzz.

**Test**: Build surprise score, add confirmation filter (capex, R&D, margin shift).

### 5. Liquid Cooling Inflection
**Thesis**: Detect the exact moment when customers go from "maybe liquid cooling" to "we now need it."

**Key insight**: The edge is detecting the inflection quarter from customer language before revenue fully shows.

**Risk**: Timing matters a lot, crowded obvious names may already price it.

## Research Foundation Stack

Before building strategies, build reusable modules:

1. **Module 1**: Filing + transcript ingestion (SEC filings, earnings calls, company-quarter DB)
2. **Module 2**: Text feature engine (keyword counts, sentiment, classifiers)
3. **Module 3**: Structured feature engine (margins, SG&A, capex, backlog)
4. **Module 4**: Event-study harness (earnings windows, 20/40/60 day returns)
5. **Module 5**: False positive control (walk-forward, holdout, negative-result log)

## See Also
- [[Agilith-Internship-Overview]]
- [[Agilith-Learning-System]]