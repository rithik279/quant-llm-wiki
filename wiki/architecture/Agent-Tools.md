---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [Agilith-System-Architecture, Agilith-Momentum-System]
status: active
tags: [architecture, tools, agent, news, screening, scoring]
---

# Agent Tools

## Overview

6 tools power the agent. Claude orchestrates them based on reasoning. "Tasksets are the moat" — tool design > prompt engineering.

## Tool 1: fetch_portfolio_news

**Input:**
```javascript
{ theme_id: "power" | "compute" | "memory" | "storage" | "optical", days_back?: 1 }
```

**Output:**
```javascript
{
  theme: "power",
  news_summary: "... (5 articles)",
  sentiment: "bullish" | "neutral" | "bearish",
  catalysts: ["Grid expansion", "Nuclear renaissance", ...]
}
```

**How:** NewsAPI → keyword mapping → 5-min cache → return to Claude

**Claude calls when:** Starting daily analysis to understand current sentiment across themes

---

## Tool 2: analyze_sentiment

**Input:**
```javascript
{ ticker_or_theme: "BE" | "power", events: [...] }
```

**Output:**
```javascript
{
  sentiment_score: 0.72,  // -1 to +1
  sentiment: "bullish",
  key_drivers: [...],
  risks: [...]
}
```

**How:** Keyword counting (bullish/bearish) → normalize to score

**Claude calls when:** Needs quantification of specific catalysts

---

## Tool 3: screen_candidates

**Input:**
```javascript
{ theme_id: "power", exclude_holdings?: true }
```

**Output:**
```javascript
{
  theme: "power",
  candidates_found: 8,
  candidates: [
    { ticker: "CEG", name: "Constellation Energy", score: 8.5 },
    ...
  ],
  screener_criteria_met: "Market cap > $2B, YTD > 0%, SMA alignment, ..."
}
```

**Screener criteria:**
- Market cap > $2B
- YTD performance > 0%
- Price × Volume > $200M
- Beta > 1.0
- SMA 50 > 150 > 200 (uptrend alignment)
- Within 5% of 52-week high
- ADR > 2%

**Claude calls when:** Needs specific opportunities matching thesis criteria

---

## Tool 4: rank_and_score_candidates

**Input:**
```javascript
{ candidates: ["CEG", "AEE", "NVDA", ...], weights?: {...} }
```

**Output:**
```javascript
{
  ranks: [
    {
      ticker: "NVDA",
      technical_score: 9.2,  // 30% weight
      momentum_score: 8.8,   // 25% weight
      sentiment_score: 8.5, // 25% weight
      catalyst_score: 9.0,   // 20% weight
      composite_score: 8.88,
      rank_position: 1,
      recommendation: "HOLD"
    },
    ...
  ]
}
```

**Default weights:**
| Factor | Weight | What it measures |
|--------|--------|-----------------|
| Technical | 30% | SMA alignment, new highs, ADR |
| Momentum | 25% | Price acceleration, volume |
| Sentiment | 25% | News bullish/bearish |
| Catalyst | 20% | Earnings, policy, supply shifts |

**Claude calls when:** Needs cross-theme ranking to find best opportunities

---

## Tool 5: detect_bottleneck_emergence

**Input:**
```javascript
{ theme: "power", recent_news_summary: "..." }
```

**Output:**
```javascript
{
  detected_theme: "power",
  emerging_bottlenecks: [
    {
      name: "Power delivery to GPU clusters",
      severity: "high",
      affected_areas: ["Power distribution", "Cooling", "Packaging"],
      candidate_plays: ["BE", "CEG", "ETN"],
      timeline: "Critical by Q3 2024"
    },
    ...
  ]
}
```

**Claude calls when:** Looking for second-order bottlenecks before mainstream prices them in

**Key insight:** Primary bottlenecks (GPU, memory) are priced in. Second-order (power delivery, cooling, packaging) are the alpha.

---

## Tool 6: suggest_trades

**Input:**
```javascript
{
  analysis: {
    portfolio_catalyst_summary: "...",
    top_candidate_tickers: [...],
    emerging_themes: [...],
    risk_factors: [...]
  }
}
```

**Output:**
```javascript
{
  suggestions: [
    { action: "HOLD_CORE", tickers: ["CRWV", "MU"], conviction: "high" },
    { action: "ACCUMULATE", tickers: ["BE"], conviction: "medium" },
    { action: "MONITOR", tickers: ["LITE"], conviction: "medium" },
    { action: "REDUCE", tickers: [], conviction: null },
    { action: "ADD_NEW_POSITIONS", new_tickers: ["CEG"], conviction: "low" },
    { action: "WATCH_NEW_BOTTLENECK", emerging_plays: ["ETN"], conviction: null }
  ]
}
```

**Trade actions:**
| Action | When | Conviction |
|--------|------|------------|
| HOLD_CORE | Structural, thesis-aligned | high |
| ACCUMULATE | Bullish, add on weakness | medium |
| MONITOR | Wait for confirmation | medium |
| REDUCE | Thesis changed or target achieved | varies |
| ADD_NEW_POSITIONS | New fit, 1-2% start | low |
| WATCH_NEW_BOTTLENECK | Too early, research first | null |

**Conviction levels:**
| Level | Probability | Signals |
|-------|-------------|---------|
| HIGH | 80%+ | Multiple corroborating signals |
| MEDIUM | 50-80% | 2-3 signals aligned |
| LOW | <50% | Single signal or speculative |

---

## Tool Orchestration

Claude decides the sequence based on reasoning:

```
Morning Analysis Flow:
1. fetch_portfolio_news (all 5 themes)
   → Understand what's happening

2. analyze_sentiment (on key catalysts)
   → Quantify bullish/bearish

3. screen_candidates (all themes)
   → Find opportunities matching criteria

4. rank_and_score_candidates (all screened candidates)
   → Understand which opportunities are best

5. detect_bottleneck_emergence (on top-ranked themes)
   → What's next? What's emerging?

6. suggest_trades (final synthesis)
   → What should I DO?
```

**Agentic ≠ automated.** Claude reasons about which tools to call, not just executing a fixed workflow.

## Conviction Levels (Per Tool)

**HIGH conviction:**
- Multiple corroborating signals (news + technicals + catalyst + sentiment)
- Clear thesis alignment
- Example: "Power shortage + BE technicals + news bullish = HIGH"

**MEDIUM conviction:**
- 2-3 signals aligned
- Some execution risk
- Example: "LITE momentum but optical demand still emerging = MEDIUM"

**LOW conviction:**
- Single signal or noisy data
- Speculative opportunity
- Example: "New company entering power market = LOW"

## Related

- [[Agilith-System-Architecture]] — How tools fit into agentic loop
- [[Agilith-Momentum-System]] — Scoring system tools use
