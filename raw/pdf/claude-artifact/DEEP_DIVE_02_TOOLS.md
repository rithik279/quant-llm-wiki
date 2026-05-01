# Deep Dive 2: The 6 Tools

Each tool does one thing very well. Claude decides **when** to call them and **how to use** the results.

---

## Tool 1: fetch_portfolio_news

**What it does**: Fetches recent news for a specific infrastructure theme

**Input**:
```javascript
{
  theme_id: "power" | "compute" | "memory" | "storage" | "optical",
  days_back: 1  // optional, default 1
}
```

**Output** (example):
```javascript
{
  theme: "power",
  news_summary: `
    - 2024-04-24: US grid capacity constraints easing with new solar/wind projects
    - 2024-04-23: California declares emergency on peak demand
    - 2024-04-22: New nuclear plant comes online, 500 MW capacity
    - 2024-04-20: Data center builders report longer power wait times
    - 2024-04-18: Wind capacity additions accelerate in Texas
  `,
  sentiment: "bullish",
  catalysts: [
    "Grid expansion accelerating",
    "Nuclear renaissance",
    "Policy support for renewable buildout"
  ]
}
```

### How It Works

```
Input: theme_id = "power"

Step 1: Map theme to keywords
  "power" → ["power generation", "electricity production", "grid", "renewable energy"]

Step 2: Fetch from NewsAPI
  GET https://newsapi.org/v2/everything
  params: {
    q: "power generation OR electricity OR grid OR renewable",
    sortBy: "publishedAt",
    language: "en",
    from: "2024-04-24",  // past 1 day
    apiKey: NEWSAPI_KEY
  }

Step 3: Get results (top 20 articles)
  [
    {
      source: { name: "CNBC" },
      title: "US grid capacity easing with new solar projects",
      description: "...",
      publishedAt: "2024-04-24T14:30:00Z",
      url: "...",
      content: "..."
    },
    ... (19 more)
  ]

Step 4: Cache results (5-minute TTL)
  Saves to: ./agent-data/news-cache/news-cache.json
  So next call within 5 min returns immediately (no API call)

Step 5: Return to Claude
  Claude receives news_summary + sentiment + catalysts
  Claude can now reason about power theme
```

### Real Example

**When Claude calls this**:
```
Claude thinks: "I need to understand current sentiment about power generation
because BE is a power company. Let me fetch recent news about power theme."

Claude calls: fetch_portfolio_news(theme_id="power", days_back=1)
```

**What happens next**:
```
Claude reads the news summary:
- "Grid capacity easing" = supply-side positive
- "Nuclear renaissance" = long-term structural tailwind
- "Data center builders report longer wait times" = demand strength

Claude's reasoning:
"Power supply constraints are easing on grid level, but data center power
demand is accelerating faster than supply. This is bullish for power
generation companies like BE. Grid operators are scrambling to expand."

Claude might then call: analyze_sentiment("power", catalysts)
```

### What NOT To Do

❌ Don't call fetch_portfolio_news("CRWV") 
  → Wrong. Theme is "compute", not ticker "CRWV"
  → Tool expects theme IDs: power, compute, memory, storage, optical

❌ Don't call fetch_portfolio_news("power", days_back=30)
  → Inefficient. News from 30 days ago is stale
  → Use days_back=1 for daily runs, maybe 5 for weekly analysis

✅ Do this:
```
// Daily routine
fetch_portfolio_news("power")
fetch_portfolio_news("compute")
fetch_portfolio_news("memory")
fetch_portfolio_news("storage")
fetch_portfolio_news("optical")

// Understand sentiment across all 5 themes each day
```

---

## Tool 2: analyze_sentiment

**What it does**: Analyzes sentiment of specific events/catalysts for a ticker or theme

**Input**:
```javascript
{
  ticker_or_theme: "BE" | "CRWV" | "power" | "compute",
  events: [
    "New solar capacity added in California",
    "Grid operators warning of peak hour constraints",
    "Data center power demand up 40% YoY"
  ]
}
```

**Output**:
```javascript
{
  subject: "power",
  events_analyzed: 3,
  sentiment_score: 0.72,  // -1 (bearish) to +1 (bullish)
  sentiment: "bullish",
  key_drivers: [
    "Demand acceleration exceeding supply growth",
    "Policy tailwinds for renewable expansion",
    "Structural shortage emerging"
  ],
  risks: [
    "Recession could reduce data center buildout",
    "Battery storage competition"
  ]
}
```

### How It Works

```
Input: ticker_or_theme = "power", events = [list of catalysts]

Step 1: Define sentiment keywords
  Bullish: ["surge", "demand", "growth", "acceleration", "positive", "expansion"]
  Bearish: ["decline", "shortage", "weakness", "pressure", "risk", "delay"]

Step 2: Count keyword matches in events
  Event 1: "New solar capacity" → contains "expansion" → +1 bullish
  Event 2: "Grid constraints" → contains "constraints" → +1 bearish
  Event 3: "Data center demand up 40%" → contains "demand" + "40% YoY" → +2 bullish
  
  Total: 3 bullish, 1 bearish

Step 3: Calculate sentiment score
  sentiment_score = (bullish_count - bearish_count) / total
                  = (3 - 1) / 4
                  = 0.5
  
  Interpretation:
    > 0.3 = "bullish"
    0 to 0.3 = "neutral"
    < 0 = "bearish"

Step 4: Identify key drivers & risks
  Key drivers: Themes mentioned multiple times
  Risks: Potential headwinds mentioned

Step 5: Return to Claude
```

### Real Example

**When Claude calls this**:
```
Claude thinks: "I see power news is bullish (utilities rallying, grid expanding).
But I need to understand WHY. What are the actual drivers?
Let me analyze sentiment on specific catalysts."

Claude extracted these catalysts from news:
1. "New solar/wind capacity additions accelerating"
2. "Data center power demand up 40% YoY" 
3. "Grid operators warning of peak hour constraints"
4. "Policy support for renewable buildout"

Claude calls: analyze_sentiment("power", catalysts)
```

**What happens next**:
```
sentiment_score comes back as 0.72 (strongly bullish)

Claude reasons:
"Sentiment is strongly positive. The key driver is DEMAND >> SUPPLY:
data centers need power faster than it can be built. This is structural,
not cyclical. This strongly favors power generation stocks like BE."

Claude's conclusion: Power is a high-conviction bullish theme.
This might lead to: "ACCUMULATE BE" recommendation.
```

### Nuance: Sentiment vs. Price Action

This tool analyzes **news sentiment**, not **price momentum**:

```
News sentiment: "Is this good or bad news for the business?"
Price momentum: "Is this stock going up or down?"

These can diverge:
- Bearish news but stock rallies (market already knew) 
- Bullish news but stock falls (high expectations, missed)

Example:
  News: "Power shortage news is bullish"
  Sentiment_score: +0.7 (very bullish)
  But stock (BE) is down today because broader market is down
  
Claude's job: Separate signal from noise
Says: "Long-term structural bullish despite short-term weakness"
```

---

## Tool 3: screen_candidates

**What it does**: Finds candidate stocks matching your screener criteria in a given theme

**Input**:
```javascript
{
  theme_id: "power",  // or compute, memory, storage, optical
  exclude_holdings: true  // Don't return stocks you already own
}
```

**Output**:
```javascript
{
  theme: "power",
  candidates_found: 8,
  candidates: [
    { ticker: "CEG", name: "Constellation Energy", score: 8.5 },
    { ticker: "AEE", name: "Ameren", score: 8.2 },
    { ticker: "NEE", name: "NextEra Energy", score: 7.9 },
    { ticker: "EXC", name: "Exelon", score: 7.8 },
    // ... more candidates
  ],
  screener_criteria_met: "Market cap > $2B, YTD > 0%, Price*Vol > $200M, Beta > 1, SMA alignment, new highs, ADR > 2%"
}
```

### How It Works (Conceptually)

In reality, this tool would:

```
Step 1: Pull all US stocks (6,000+)

Step 2: Filter by theme-relevant keywords
  Theme: "power"
  Keywords: "utility", "renewable", "energy", "generation", "solar", "wind"
  Filter: Only stocks in utilities/energy sector
  Result: ~200 candidates

Step 3: Apply screener criteria (from your TradingView)
  - Market cap > $2B
  - YTD performance > 0%
  - Price × Volume (1M) > $200M
  - Beta 1Y > 1.0 (higher volatility than market)
  - SMA (200) < Price (above 200-day average)
  - SMA (150) > SMA (200) (150 > 200-day, showing uptrend)
  - SMA (50) > SMA (150) (50 > 150-day, sharper uptrend)
  - SMA (20) > SMA (50) (20 > 50-day, momentum)
  - High is within 0-5% of 52-week high (near recent peak)
  - New 52-week high (showing strength)
  - ADR > 2% (Average Daily Range > 2%)
  - Exclude holdings: Not BE (you already own it)
  
  Result: ~8 candidates that pass all filters

Step 4: Return top candidates with technical scores
  The 8 candidates that passed are ranked by how far above criteria they are
  CEG: 8.5/10 (passes all criteria, strong technicals)
  AEE: 8.2/10
  NEE: 7.9/10
  ... etc

Step 5: Return to Claude
```

### Real Implementation (In practice)

Currently, the tool uses **mock data**:

```javascript
const mockCandidates = {
  power: [
    { ticker: "AEE", name: "Ameren", score: 8.2 },
    { ticker: "NEE", name: "NextEra Energy", score: 7.9 },
    { ticker: "CEG", name: "Constellation Energy", score: 8.5 },
  ],
  compute: [
    { ticker: "NVDA", name: "Nvidia", score: 9.1 },
    { ticker: "RKLB", name: "Rocket Lab", score: 7.3 },
  ],
  // ... etc
}
```

To use **real screener data**, you'd connect to:
1. **TradingView API** (your existing screener)
2. **Finnhub API** (free fundamental data)
3. **IBKR API** (if using for data)
4. **Your own CSV** (export from TradingView screener daily)

### Real Example

**When Claude calls this**:
```
Claude thinks: "I've identified power as a bullish theme.
Now I need to find specific opportunities in the power space.
Let me screen for candidates matching our criteria."

Claude calls: screen_candidates(theme_id="power", exclude_holdings=true)
```

**What happens next**:
```
Claude receives 8 power candidates ranked by score.

Claude examines them:
CEG (8.5): "Constellation Energy - nuclear + utilities. 
  High score = passes all technical + fundamental criteria.
  New to my consideration but fits thesis perfectly."

Claude's next step: Rank these candidates against compute/memory/storage/optical
to understand which themes have best opportunities this week.
```

---

## Tool 4: rank_and_score_candidates

**What it does**: Scores a list of candidates using composite weighting

**Input**:
```javascript
{
  candidates: ["CEG", "AEE", "NEE", "NVDA", "RKLB", "TSM", "AAOI"],
  weights: {  // optional, defaults to balanced
    technical: 0.30,
    momentum: 0.25,
    sentiment: 0.25,
    catalyst: 0.20
  }
}
```

**Output**:
```javascript
{
  week_of: "2024-04-25",
  candidates_ranked: 7,
  ranks: [
    {
      ticker: "NVDA",
      technical_score: 9.2,
      momentum_score: 8.8,
      sentiment_score: 8.5,
      catalyst_score: 9.0,
      composite_score: 8.88,
      rank_position: 1,
      recommendation: "HOLD"  // You already own compute
    },
    {
      ticker: "CEG",
      technical_score: 8.5,
      momentum_score: 8.7,
      sentiment_score: 8.2,
      catalyst_score: 8.9,
      composite_score: 8.57,
      rank_position: 2,
      recommendation: "BUY"
    },
    {
      ticker: "TSM",
      technical_score: 8.9,
      momentum_score: 8.1,
      sentiment_score: 8.6,
      catalyst_score: 8.3,
      composite_score: 8.48,
      rank_position: 3,
      recommendation: "BUY"
    },
    // ... more candidates
  ]
}
```

### How Each Score Works

**Technical Score (30% weight)**:
```
What: How well does technicals match your criteria?
Factors:
  - SMA alignment (50 > 150 > 200 > current price?)
  - New 52-week high proximity (0-5%?)
  - ADR (> 2%?)
  - Relative strength
  
Scoring:
  9+: Perfect alignment, all criteria met, new highs
  8: Strong, most criteria met
  7: Good, meets basic criteria
  6: Fair, borderline criteria
  <6: Weak, doesn't meet criteria well
```

**Momentum Score (25% weight)**:
```
What: Is this stock accelerating upward?
Factors:
  - Price momentum (3-month return)
  - Volume growth
  - Relative momentum (vs. sector)
  - Rate of change
  
Scoring:
  9+: Accelerating strongly, volume expanding
  8: Strong uptrend
  7: Steady uptrend
  6: Modest uptrend
  <6: Weak or declining
```

**Sentiment Score (25% weight)**:
```
What: Is news about this stock/theme bullish or bearish?
Factors:
  - News sentiment (from analyze_sentiment tool)
  - Analyst revisions
  - Insider buying/selling
  - Social sentiment
  
Scoring:
  9+: Overwhelmingly bullish, high insider buying
  8: Strongly bullish news
  7: Moderately bullish
  6: Mixed signals
  <6: Bearish or no interest
```

**Catalyst Score (20% weight)**:
```
What: Are there upcoming catalysts that could move the stock?
Factors:
  - Earnings announcements (upcoming)
  - Product launches
  - Policy changes
  - Supply chain developments
  - Contract wins
  
Scoring:
  9+: Major catalyst imminent (earnings beat expected, product launch)
  8: Significant catalyst coming (policy shift, supply improvement)
  7: Notable catalyst (earnings in 2 weeks, product refresh)
  6: Minor catalyst
  <6: No near-term catalyst
```

### Composite Score Calculation

```
Composite = (Technical × 0.30) + (Momentum × 0.25) + 
            (Sentiment × 0.25) + (Catalyst × 0.20)

Example: CEG
  Technical: 8.5 × 0.30 = 2.55
  Momentum: 8.7 × 0.25 = 2.175
  Sentiment: 8.2 × 0.25 = 2.05
  Catalyst: 8.9 × 0.20 = 1.78
  ─────────────────────────────
  COMPOSITE = 8.745 → rounds to 8.75

This 8.75 score means: "CEG is a strong buy opportunity"
```

### Real Example

**When Claude calls this**:
```
Claude has screened candidates from all 5 themes.
Claude now wants to rank them to understand:
"Which opportunities are best this week?"

Claude calls: rank_and_score_candidates(
  candidates=["CEG", "AEE", "NEE", "NVDA", "RKLB", "TSM", ...],
  weights={technical: 0.3, momentum: 0.25, sentiment: 0.25, catalyst: 0.2}
)
```

**What happens next**:
```
Results come back ranked:
1. NVDA (8.88) - Existing position, strong across board
2. CEG (8.57) - NEW OPPORTUNITY, power play
3. TSM (8.48) - Memory/fab foundry play
4. RKLB (7.89) - Compute infrastructure, but lower catalyst
5. AAOI (7.23) - Optical play, technicals weak

Claude reasons:
"Top new opportunity is CEG (8.57 composite).
Strong technical setup (8.5), momentum accelerating (8.7), 
sentiment bullish (8.2), and catalyst upcoming (8.9 = nuclear policy).

This deserves a BUY recommendation with conviction = MEDIUM
(not HIGH because it's new to portfolio, execution risk)."
```

---

## Tool 5: detect_bottleneck_emergence

**What it does**: Identifies emerging infrastructure bottlenecks not yet on mainstream radar

**Input**:
```javascript
{
  theme: "power",  // or "memory", "cooling", "packaging", etc.
  recent_news_summary: "Grid capacity expanding but data center power demand up 40% YoY. New plants coming online but still can't keep pace with AI infrastructure buildout. Power delivery to chip fabrication plants becoming critical constraint."
}
```

**Output**:
```javascript
{
  detected_theme: "power",
  emerging_bottlenecks: [
    {
      name: "Power delivery to GPU clusters",
      severity: "high",
      affected_areas: ["Power distribution", "Cooling", "Packaging"],
      candidate_plays: ["BE", "CEG", "TSM", "LIAN"],
      timeline: "Critical by Q3 2024"
    },
    {
      name: "Grid-scale backup power for data centers",
      severity: "medium",
      affected_areas: ["Battery storage", "Gas backup", "UPS"],
      candidate_plays: ["VSLR", "RUN"],
      timeline: "Emerging now, critical by 2025"
    }
  ],
  timeline: "Critical by Q4 2024"
}
```

### How It Works

```
Input: news_summary about power theme

Claude analyzes:
"Grid capacity: 500 MW added this quarter
 Data center demand: Up 40% YoY, requiring 1,000+ MW by Q4
 Gap: 500+ MW shortage emerging Q4 2024
 Why: AI infrastructure buildout (H100 clusters, etc.)
 Implication: Power generation stocks will see tailwinds"

Claude thinks deeper:
"But there's a SECOND-ORDER bottleneck:
 Power delivery TO the GPUs (not just generation)
 
 Problem: Older substations can't handle
 100+ GPU clusters pulling 500kW each
 Solution: Needs new power distribution
 Companies: Eaton, Schneider Electric, Eaton
 
 This is the EMERGING bottleneck not yet priced in"

Output: Alerts Claude to power distribution as next bottleneck
```

### Why This Matters

Leopold's thesis is about **bottlenecks**. But which ones?

**Obvious bottlenecks** (already priced in):
- GPU availability → NVDA stock already up 150%
- Memory demand → MU already included in portfolio
- Compute infrastructure → CRWV already included

**Emerging bottlenecks** (NOT yet priced in):
- Power delivery (substations, transformers, power conditioning)
- Cooling systems (liquid cooling, advanced thermal management)
- Memory packaging (HBM vs. GDDR6, interconnects)
- Supply chain logistics (getting equipment to data centers)

This tool finds the *next* bottleneck before Wall Street does.

### Real Example

**When Claude calls this**:
```
Claude has analyzed all the news.
Claude sees power generation is bullish.
Claude thinks: "But what if I'm looking at yesterday's problem?
What's the NEXT bottleneck emerging?"

Claude calls: detect_bottleneck_emergence(
  theme="power",
  recent_news="Grid capacity + data center demand + buildout pace..."
)
```

**What happens next**:
```
Tool returns: Power delivery to GPUs is emerging bottleneck

Claude thinks:
"Aha! Power generation is bullish (BE plays).
But power DISTRIBUTION is the next bottleneck.
Who makes power conditioning, distribution, UPS?

New opportunities:
- Eaton Corp (ETN) - Power distribution
- Schneider Electric (OTCPK: SBEVF) - Critical power
- LIAN Group - Liquid cooling + power

These aren't on my radar but they FIT the thesis."

Claude adds to suggestions:
"Emerging opportunity: Power delivery infrastructure (not generation).
Watch companies that supply transformers, UPS, power conditioning."
```

---

## Tool 6: suggest_trades

**What it does**: Generates final trade suggestions based on complete analysis

**Input**:
```javascript
{
  analysis: {
    portfolio_catalyst_summary: "Power shows bullish signal (grid expansion + data center buildout mismatch). Compute demand remains strong. Memory supply normalizing. Optical interconnects gaining momentum.",
    top_candidate_tickers: ["CEG", "TSM", "RKLB", "AAOI"],
    emerging_themes: ["power delivery", "cooling", "memory packaging"],
    risk_factors: ["Recession would slow buildout", "Policy uncertainty around data centers", "Margin compression from increased competition"]
  }
}
```

**Output**:
```javascript
{
  timestamp: "2024-04-25T16:00:00Z",
  suggestions: [
    {
      action: "HOLD_CORE",
      tickers: ["CRWV", "MU"],
      rationale: "Compute and memory are structural. No sell signals. Core positions.",
      conviction: "high"
    },
    {
      action: "ACCUMULATE",
      tickers: ["BE"],
      rationale: "Power generation bottleneck intensifying. Structural tailwinds. Add on weakness.",
      conviction: "medium"
    },
    {
      action: "MONITOR",
      tickers: ["LITE"],
      rationale: "Optical interconnect demand visible but technicals need confirmation. Wait for VWAP test.",
      conviction: "medium"
    },
    {
      action: "REDUCE",
      tickers: [],  // None today
      rationale: null,
      conviction: null
    },
    {
      action: "ADD_NEW_POSITIONS",
      new_tickers: ["CEG"],
      rationale: "Power generation play. Fits Leopold thesis perfectly. 8.5 composite score.",
      conviction: "low"
    },
    {
      action: "WATCH_NEW_BOTTLENECK",
      emerging_plays: ["Power delivery (ETN, SBEVF)"],
      rationale: "Second-order bottleneck emerging. Monitor. Not ready to buy yet.",
      conviction: null
    }
  ],
  portfolio_health: "Aligned with thesis. Concentrated positions appropriate. No red flags.",
  next_review: "Friday for weekly ranking"
}
```

### Trade Actions Explained

**HOLD_CORE** (Don't touch these)
```
When: Position is structural, thesis-aligned, no sell signals
Reasoning: Core holdings that solve primary bottlenecks
Action: Do nothing. Let them ride.
Example: "CRWV (compute infrastructure) is foundational. Hold."
```

**ACCUMULATE** (Add if opportunity presents)
```
When: Position is bullish but not yet warranting large add
Reasoning: Thesis is valid, sentiment improving, but doesn't need huge size yet
Action: Add on weakness (pull-backs), buy dips, or add on news confirmation
Example: "BE (power) - bullish catalyst emerging. Accumulate on dips to $48."
```

**MONITOR** (Watch closely, wait for confirmation)
```
When: Interesting opportunity but lacking one key signal
Reasoning: Thesis is there, but wait for technical or sentiment confirmation
Action: Don't buy yet. Watch daily. Execute when confirmed.
Example: "LITE (optical) - sector is bullish, but LITE technicals need VWAP confirmation."
```

**REDUCE** (Trim or exit position)
```
When: Position is no longer thesis-aligned OR has achieved target
Reasoning: Either thesis changed or valuation became excessive
Action: Sell partial or full position to lock in gains or reduce thesis risk
Example: "SNDK (storage) - storage is no longer primary bottleneck, reduce 50%"
```

**ADD_NEW_POSITIONS** (New opportunity)
```
When: High-quality candidate matches thesis but new to portfolio
Reasoning: Solves a bottleneck, good technicals, worth diversifying into
Action: Start position (1-2% of portfolio), scale if thesis confirmed
Example: "CEG (utilities + nuclear) - power generation play, add as new position"
Conviction: Usually "low" initially (new = higher execution risk)
```

**WATCH_NEW_BOTTLENECK** (Emerging opportunity)
```
When: New bottleneck detected that isn't obvious yet
Reasoning: Second/third-order effects emerging, not yet reflected in pricing
Action: Research, don't buy yet. Monitor until clearer signal
Example: "Power delivery infrastructure (Eaton, etc.) - emerging bottleneck, watch for entry"
Conviction: Usually null (too early to assign)
```

### Conviction Levels

**HIGH** (80%+ probability I'm right):
- Multiple corroborating signals
- Thesis is clear and undeniable
- Technical setup is perfect
- Example: "Power shortage + technicals perfect + news bullish = BUY with HIGH"

**MEDIUM** (50-80% probability):
- 2-3 signals aligned
- Thesis is clear but execution risk
- Technicals okay but not perfect
- Example: "Emerging bottleneck but not yet mainstream = WATCH with MEDIUM"

**LOW** (<50% probability):
- Single signal or speculative
- Thesis is novel/unproven
- Significant execution risk
- Example: "New company in market, fits thesis but unproven = ADD NEW with LOW"

### Real Example

**Claude generates final suggestions**:
```
Daily review synthesis:

Power theme: BULLISH (↑↑)
  News: Grid constraints + buildout gap
  Sentiment: 0.7 (strongly positive)
  Technicals: Good (new highs, momentum)
  Catalyst: Strong (policy, demand)
  → Action: ACCUMULATE BE (medium conviction)
  → Action: ADD NEW CEG (low conviction)

Compute theme: BULLISH (↑)
  News: Continued demand for GPU
  Sentiment: 0.6 (positive)
  Technicals: Strong (all-time highs)
  Catalyst: Product launches, demand
  → Action: HOLD CRWV (high conviction - core)

Memory theme: NEUTRAL (~)
  News: Supply normalizing
  Sentiment: 0.3 (neutral)
  Technicals: Strong (good chart)
  Catalyst: Earnings next month
  → Action: HOLD MU (high conviction - core)

Optical theme: SLIGHTLY BULLISH (↑)
  News: Demand emerging
  Sentiment: 0.4 (slightly positive)
  Technicals: Fair (VWAP needs test)
  Catalyst: Still forming
  → Action: MONITOR LITE (medium conviction)

Emerging bottlenecks: 
  Power delivery not yet mainstream
  Cooling becoming critical
  → Action: WATCH (emerging plays like ETN)

Final portfolio assessment:
  "Positioned well for AGI infrastructure buildout.
   Power is the near-term focus.
   Memory and compute are core holdings.
   Optical is emerging, monitor.
   Emerging bottlenecks in power delivery and cooling - research but don't buy yet."
```

---

## How Tools Work Together

The real magic is in the **sequence** Claude chooses:

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

Claude doesn't execute this workflow—it **decides** to call tools in this order because it reasons that this sequence makes sense.

That's what makes it agentic.

---

## Next: How To Customize

Want to change how scoring works? Edit the weights in the tool call.
Want to detect new bottlenecks? Add new themes to the config.
Want different news sources? Update the NewsAPI query.

We'll cover customization in Deep Dive 3.
