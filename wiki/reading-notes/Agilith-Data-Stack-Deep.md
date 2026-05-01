---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 4
related_pages: [Agilith-Data-Stack, Agilith-System-Architecture, Agilith-Momentum-System]
status: active
tags: [data-stack, infrastructure, hedge-fund, lseg, alternative-data]
---

# Hedge Fund Data Stack (Deep Dive)

Complete input specification for production-ready hedge fund data infrastructure.

## Data Categories

### 1. Market Data
- Tick data
- Order book
- OHLCV
- Options data

### 2. Alternative Data
- Satellite imagery
- Credit card transactions
- Web scraping
- Social sentiment
- App usage
- Geolocation

### 3. Fundamental Data
- Financial statements
- Analyst estimates
- Macro data

### 4. Proprietary Data
- Trade logs
- Execution data
- Feature stores

### 5. Compute Infrastructure
- CPU clusters
- GPU clusters
- FPGA (HFT)
- Cloud systems

### 6. Data Engineering
- Data lakes
- ETL pipelines
- Streaming systems

## Minimum vs Full Stack

**MVP (minimum viable):**
- LSEG structured data
- Basic macro data
- Earnings transcripts
- News sentiment (basic)
- Python-based backtesting
- Light cloud usage

**Full institutional stack:**
- Bloomberg / Refinitiv / FactSet
- Alternative datasets
- Distributed compute
- Real-time pipelines
- Proprietary feature stores

## Security Master (Critical)

Point-in-time correctness requires:
- Symbol history
- Identifiers
- Listing/delisting dates

Must reconstruct historically — no survivorship bias.

## Feature Layer (Derived Inputs)

**Core features:**
- Momentum (multi-horizon)
- Volatility
- Liquidity metrics
- Growth rates
- Margins
- Capital allocation metrics

**Alpha-specific features:**
- Earnings surprise
- Revision acceleration
- AI exposure score
- Narrative change score
- Constraint nowcast
- Regime classification

## Input Specification

### Security Master
- symbol history, identifiers, listing/delisting dates

### Market Data
- OHLCV, corporate actions, intraday (optional)

### Fundamentals
- Income statement, balance sheet, cash flow

### Analyst Estimates
- EPS forecasts, revisions, dispersion

### Text Data
- 10-K, 10-Q, earnings transcripts, news

### Event Data
- Earnings, CPI, FOMC

### Alternative Constraint Data
- Power markets
- Supply chain indices
- Interconnection queues

## Alpha Strategy Design

**Signal Engine:**
- Momentum
- Earnings revisions
- AI exposure

**Regime Engine:**
- Volatility regimes
- Trend regimes
- Liquidity regimes

**Scenario Engine:**
- CPI reactions
- Earnings reactions
- Fed decisions

## AI Research Frameworks (References)

**Alpha-GPT:** LLM generates strategies, backtests automatically, iterates on results

**Increase Alpha:** Extracts signals from SEC filings using sentiment and language change

**3AI:** ML models on LSEG data

## MCP Integration

**Potential MCP servers:**
- SEC ingestion
- Market data access
- Database access
- Feature computation
- TradingView
- Backtesting engine
- Filesystem, GitHub, browser/fetch
- Alerting systems

**TradingView MCP (81 tools):**
- Chart reading, indicator values, OHLCV retrieval
- Pine script execution, replay mode, alerts
- Watchlist management, multi-pane control

**Architecture:** Claude Code ↔ MCP Server ↔ TradingView Desktop

**Limitation:** Not a full historical data backbone. Not survivorship-safe. Not suited for institutional backtesting.

## Tool Stack

**Claude Code:** High-level system execution, multi-file generation

**Cursor:** Fast iteration, debugging, precise edits

**Recommendation:** Claude for architecture, Cursor for implementation

## Data Source Procurement

Categories to evaluate:
- Market data
- Fundamentals
- Analyst data
- Text data
- Macro data
- NLP tools
- Storage and pipeline tools
- Backtesting frameworks
- Universe reconstruction

Compare: free vs premium vs institutional
Evaluate: cost, quality, MCP compatibility

## Point-in-Time Requirements

Key constraints:
- Use `available_time`, not `event_time`
- No lookahead bias
- Store all versions of data
- Align macro events to release time
- Handle corporate actions properly

**Failure modes:**
- Survivorship bias
- Restatement leakage
- Incorrect time alignment
- Stale data

## See Also
- [[Agilith-Data-Stack]] — MVP data stack (simpler version)
- [[Agilith-System-Architecture]] — System this feeds into
- [[Agilith-Tooling-Stack]] — Tool selection