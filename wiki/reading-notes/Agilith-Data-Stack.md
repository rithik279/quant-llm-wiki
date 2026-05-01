---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Alpha-Stack-System]
status: active
tags: [agilith-capital, data-stack, mvp, infrastructure]
---

# Agilith Data Stack (MVP)

MVP data infrastructure for the Agilith quant system.

## Core Stack Summary

| Component | Provider | Cost | Role |
|-----------|----------|------|------|
| Market Data | FMP | ~$49/mo | Prices, fundamentals, revisions |
| Screener | Quant Investing | ~£36/mo | Point-in-time universe |
| Filings | SEC EDGAR | Free | Deep financial analysis |
| Macro | FRED | Free | Inflation, rates, employment |
| Alpha Vantage | Alpha Vantage | Free tier | Intraday data for prototyping |

## Market Data & Screener

**FMP (Financial Modeling Prep)**
- Best balance of coverage, flexibility, cost for MVP
- Supports: price, fundamentals, analyst revisions
- ~$49/month
- Enables multiple alpha signals in single API

**Quant Investing Screener**
- Point-in-time universe construction
- Reduces survivorship bias in backtests
- ~$45/month
- Critical for realistic historical testing

**Alpha Vantage** (free tier for prototyping)
- Intraday (1-min) time series
- Fast iteration, low cost
- Upgrade path to Polygon/LSEG/Bloomberg

## Filings (Point-in-Time)

**SEC EDGAR via Python → MCP → Agent pipeline**
- $0 cost
- Source-of-truth financial validation
- Deeper financial context beyond standardized metrics
- Critical: prevents lookahead bias when ingested properly

**Earnings Call Transcripts via FMP**
- Management discussion + Q&A
- LLM processing for: tone analysis, concreteness detection, narrative evolution
- Used for: management credibility, revision tone gating, narrative shifts

## Text Data Pipeline

**NLP Processing** (Claude/OpenAI APIs, usage-based)
- Converts text → structured features
- Enables: sentiment, concreteness, keyword extraction

**Key text use cases**:
- Infrastructure Constraint Nowcast: supply bottlenecks, capacity language
- Narrative vs Numbers: hype vs execution detection
- Analyst Revision + Tone Gating: confirmation via management language

## Macro Data (Regime Input)

**FRED (Federal Reserve Economic Data)** — $0
- Inflation (CPI), rates, employment
- Enables: regime classification, signal timing
- VIX + credit spreads → RISK_ON/OFF/TRANSITION/RECOVERY

## Alternative Data (Post-MVP)

**Tier 2 — Use after core validated**:
- Prediction markets (Predmktdata, ~$49/mo)
- Insider trading data (Form 4 via 13Radar)
- Quantpedia (~$33/mo) — strategy idea discovery
- Valyu API (~$0-10) — agent-native data enrichment

**Tier 3 — Nice to have**:
- 3ai.co — AI-focused financial research
- HUD.ai — agent training scenarios
- avanzai_open — infrastructure data

## Decision Notes

**Core principles**:
- FMP as primary provider (unified pipeline)
- SEC EDGAR for point-in-time accuracy
- FRED for regime classification
- LLM processing for text → structured signals

**NOT required for MVP**:
- RAG / advanced retrieval systems (intentionally excluded)
- Bloomberg/LSEG (upgrade path only)
- Prediction markets / insider data (post-validation)

## See Also
- [[Agilith-Alpha-Stack-System]] — How signals fit together
- [[Agilith-Tooling-Stack]] — Development environment
- [[Regime-modeling]] — Regime classification inputs