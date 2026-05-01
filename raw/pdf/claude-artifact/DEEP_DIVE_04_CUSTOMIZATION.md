# Deep Dive 4: Configuration & Customization

The system is designed to be **modular and flexible**. Let's customize it for different use cases.

---

## Customization 1: Your Portfolio Weights

**Current setup**:
```javascript
portfolio: {
  BE: { weight: 0.2174, price: 50.55, theme: "power" },
  CRWV: { weight: 0.4307, price: 47.44, theme: "compute" },
  LITE: { weight: 0.0586, price: 51.39, theme: "optical" },
  MU: { weight: 0.0442, price: 21.85, theme: "memory" },
  SNDK: { weight: 0.0654, price: 64.74, theme: "storage" },
  SPY: { weight: 0.1416, price: 101.10, theme: "hedge" }
}
```

**Problem**: Weights are snapshot from when you provided them. They drift as prices move.

**Solution**: Use real IBKR positions

```javascript
// Option 1: Update weights monthly manually
portfolio: {
  BE: { weight: 0.25, ... },    // Increase power
  CRWV: { weight: 0.40, ... },  // Slight decrease
  // ... rest
}

// Option 2: Fetch dynamically from IBKR
async function getPortfolioWeights() {
  const ibkr = new IBKRClient()
  const portfolio = await ibkr.getPortfolio()
  
  const totalValue = portfolio.summary.totalMarketValue
  
  const weights = {}
  for (const holding of portfolio.holdings) {
    weights[holding.ticker] = {
      name: holding.name,
      weight: holding.marketValue / totalValue,
      price: holding.price,
      theme: getTheme(holding.ticker)
    }
  }
  
  return weights
}

// Option 3: Use adaptive weighting
// If compute is outperforming, automatically reduce CRWV weight
// If power is underperforming, automatically increase BE weight
// This requires more sophisticated logic
```

### Example: Rebalancing

```javascript
// You decide: "Power is the most critical bottleneck. 
// Let me increase BE from 22% to 35% of portfolio."

// Current allocation (by weight):
// BE: $232 (22.1%)
// CRWV: $117 (11.2%)
// ... total: $1,045

// Desired allocation:
// BE: 35%
// CRWV: 30% (reduce from 43%)
// LITE: 10% (maintain 8.2%, increase slightly)
// MU: 10%
// SNDK: 10%
// SPY: 5% (reduce from 13.5%)

// To rebalance:
// 1. Calculate target values
// 2. Generate orders
// 3. Execute via IBKR

// Update CONFIG:
portfolio: {
  BE: { weight: 0.35, ... },      // Up from 0.22
  CRWV: { weight: 0.30, ... },    // Down from 0.43
  LITE: { weight: 0.10, ... },    // Up from 0.06
  MU: { weight: 0.10, ... },      // Up from 0.04
  SNDK: { weight: 0.10, ... },    // Up from 0.07
  SPY: { weight: 0.05, ... }      // Down from 0.14
}
```

---

## Customization 2: Screener Criteria

**Current setup**:
```javascript
screener: {
  marketCapMin: 2000000000,           // $2B+
  perfYTD: 0,                         // YTD > 0%
  priceVolume1M: 200000000,           // Price * Vol(1M) > $200M
  betaMin: 1.0,                       // Beta > 1.0
  smaCriteria: {
    sma200LtPrice: true,              // Price > SMA(200)
    sma150GtSma200: true,             // SMA(150) > SMA(200)
    sma50GtSma150: true,              // SMA(50) > SMA(150)
    sma20GtSma50: true                // SMA(20) > SMA(50)
  },
  highBelow52W: { minPct: 0, maxPct: 5 },  // Price within 5% of 52W high
  newHigh52W: true,                  // In new 52W high
  adr: 0.02                           // Average daily range > 2%
}
```

### Scenario 1: You Want Lower Volatility

```javascript
// Change these:
screener: {
  betaMin: 0.8,              // From 1.0 → allow less volatile stocks
  
  highBelow52W: {
    minPct: -20,             // Can be 20% below 52W high
    maxPct: 5
  },
  
  adr: 0.01,                 // From 0.02 → less volatile daily moves
  
  // Keep SMA criteria (these already imply stability)
}
```

### Scenario 2: You Want More Growth (Higher Beta)

```javascript
screener: {
  betaMin: 1.5,              // From 1.0 → only high-beta stocks
  
  highBelow52W: {
    minPct: 0,
    maxPct: 2                // From 5% → must be near all-time highs
  },
  
  adr: 0.03,                 // From 0.02 → more volatile = more moves
  
  perfYTD: 10,               // From 0% → YTD performance > 10%
}
```

### Scenario 3: You Want Smaller Cap Stocks

```javascript
screener: {
  marketCapMin: 500000000,   // From $2B → $500M+
  
  priceVolume1M: 100000000,  // From $200M → $100M+ (smaller = less liquid)
  
  adr: 0.03,                 // Smaller caps more volatile
}
```

---

## Customization 3: Add a New Theme

Let's say you want to add **"Cooling"** as a theme (next bottleneck).

**Step 1**: Add to CONFIG.themes

```javascript
themes: [
  // ... existing themes ...
  {
    id: "cooling",
    keywords: [
      "cooling",
      "thermal management",
      "liquid cooling",
      "immersion cooling",
      "data center cooling",
      "AI infrastructure cooling"
    ],
    tickers: ["LIAN", "CRWV"]  // Companies involved in cooling
  }
]
```

**Step 2**: Claude will automatically call fetch_portfolio_news("cooling")

The agent will:
- Fetch news about cooling
- Analyze sentiment
- Screen for cooling-related candidates
- Detect if cooling bottleneck is emerging

**Step 3**: Optional - Add cooling-specific handling

```javascript
// In suggest_trades tool output, Claude might say:
// "EMERGING: Cooling as next bottleneck. Watch: LIAN, companies with liquid cooling."

// Or create a separate tracking section:
recommendations: {
  portfolio: [...],
  emerging_themes: [
    {
      theme: "cooling",
      severity: "medium",
      candidates: ["LIAN", "CRWV"],
      timeline: "Critical by 2025"
    }
  ]
}
```

---

## Customization 4: Change Scoring Weights

**Current scoring**:
```javascript
weights: {
  technical: 0.30,
  momentum: 0.25,
  sentiment: 0.25,
  catalyst: 0.20
}
```

### Scenario 1: You Trust News Sentiment More

```javascript
weights: {
  technical: 0.20,
  momentum: 0.15,
  sentiment: 0.45,    // Up from 0.25 (heavily weight sentiment)
  catalyst: 0.20
}
```

**Why**: If you've found news sentiment is your best predictor, increase its weight.

### Scenario 2: You Trust Technicals More

```javascript
weights: {
  technical: 0.50,    // Up from 0.30
  momentum: 0.25,
  sentiment: 0.15,    // Down from 0.25
  catalyst: 0.10
}
```

**Why**: If you're a technical trader, weight chart patterns heavily.

### Scenario 3: Catalyst-Driven Strategy

```javascript
weights: {
  technical: 0.15,
  momentum: 0.15,
  sentiment: 0.20,
  catalyst: 0.50      // Heavy catalyst weighting
}
```

**Why**: If you play earnings, policy changes, product launches, weight catalysts heavily.

### How to Update

In `portfolio-agent-system.js`, in the `rank_and_score_candidates` tool:

```javascript
case "rank_and_score_candidates": {
  const weights = toolInput.weights || {
    technical: 0.30,
    momentum: 0.25,
    sentiment: 0.25,
    catalyst: 0.20
  }
  
  // Change defaults here if you want different weights
  // Or Claude can pass custom weights
}
```

---

## Customization 5: Change News Sources

**Current sources**:
```javascript
sources: "techcrunch,theverge,cnbc,reuters,bloomberg"
```

**Available sources** (from NewsAPI):
- `techcrunch` - Tech industry focus
- `theverge` - Tech + consumer
- `cnbc` - Business/finance
- `reuters` - General news
- `bloomberg` - Business/finance
- `hackernews` - Tech/startup community
- `cryptopanic` - Crypto news
- `marketwatch` - Financial analysis
- `investopedia` - Educational
- `seeking-alpha` - Investment research

**Option 1: More Financial Focus**

```javascript
sources: "cnbc,reuters,bloomberg,marketwatch,seekingalpha"
```

**Option 2: More Tech Focus**

```javascript
sources: "techcrunch,theverge,hackernews,venturebeat,forbes"
```

**Option 3: Everything**

```javascript
sources: "techcrunch,theverge,cnbc,reuters,bloomberg,hackernews,marketwatch"
```

### Custom Keywords Per Theme

```javascript
themes: [
  {
    id: "power",
    keywords: [
      "power generation",
      "electricity production",
      "grid",
      "renewable energy",
      "solar farms",      // Add specific
      "wind farms",       // Add specific
      "nuclear power"     // Add specific
    ]
  }
]
```

---

## Customization 6: Alert Thresholds

**Scenario**: You only want alerts for HIGH-conviction signals.

```javascript
// In suggest_trades tool, after generating suggestions:

const suggestions = [...]

// Filter for high conviction only
const highConviction = suggestions.filter(s => s.conviction === "high")

if (highConviction.length > 0) {
  // Send alert (email, Slack, etc.)
  await sendAlert(highConviction)
}
```

**Or**: Filter by action type

```javascript
// Only alert on ACCUMULATE or BUY actions
const buyActions = suggestions.filter(s => 
  s.action === "ACCUMULATE" || s.action === "ADD_NEW_POSITIONS"
)

if (buyActions.length > 0) {
  await sendAlert(buyActions)
}
```

---

## Customization 7: Change Scheduling

**Current schedule**:
```javascript
dailyOpen: "30 9 * * 1-5",    // 9:30 AM ET Mon-Fri
dailyClose: "0 16 * * 1-5",   // 4:00 PM ET Mon-Fri
weeklyRank: "0 17 * * 5"      // 5:00 PM ET Friday
```

### Scenario 1: More Frequent (Testing)

```javascript
dailyOpen: "*/30 * * * *",    // Every 30 minutes
dailyClose: "*/30 * * * *",   // Every 30 minutes
weeklyRank: "*/30 * * * *"    // Every 30 minutes
```

### Scenario 2: Less Frequent

```javascript
dailyOpen: "30 9 * * 1-5",    // Keep 9:30 AM
dailyClose: null,              // Remove 4:00 PM run
weeklyRank: "0 17 * * 5"      // Keep Friday ranking
```

### Scenario 3: Your Timezone (PT instead of ET)

```javascript
// Add 3 hours to ET times (ET is 3 hours ahead of PT)
dailyOpen: "30 6 * * 1-5",    // 6:30 AM PT = 9:30 AM ET
dailyClose: "0 13 * * 1-5",   // 1:00 PM PT = 4:00 PM ET
weeklyRank: "0 14 * * 5"      // 2:00 PM PT = 5:00 PM ET
```

Or set timezone:
```javascript
process.env.TZ = "America/Los_Angeles"  // PT
// Then use same times
```

---

## Customization 8: Real-World Example - Scenario

Let's build a **conservative, dividend-focused** variant of your system.

### Problem
You want to balance growth (Leopold thesis) with dividend income.

### Solution

```javascript
// 1. Add dividend theme
themes: [
  {
    id: "power",
    keywords: [...existing...],
    tickers: ["BE", "CEG"]
  },
  {
    id: "dividends",  // NEW
    keywords: ["dividend", "yield", "payout", "income"],
    tickers: ["CEG", "NEE", "AEE", "O", "SCHD"]
  }
]

// 2. Add dividend screening criteria
screener: {
  marketCapMin: 5000000000,  // $5B+ (stability)
  betaMin: 0.8,              // Lower volatility
  dividend: {
    minYield: 0.03,          // 3%+ dividend yield
    growthRate: 0.05         // 5%+ dividend growth
  },
  adr: 0.01,                 // Lower volatility
  perfYTD: -5                // Allow some downside (established companies)
}

// 3. Adjust scoring weights
weights: {
  technical: 0.25,
  momentum: 0.15,
  sentiment: 0.25,
  catalyst: 0.15,
  dividend: 0.20  // NEW - weight dividend yield
}

// 4. Rebalance portfolio
portfolio: {
  BE: { weight: 0.10, theme: "power" },        // Reduce
  CRWV: { weight: 0.10, theme: "compute" },    // Reduce
  CEG: { weight: 0.20, theme: "power" },       // Add (utility with dividend)
  O: { weight: 0.25, theme: "dividends" },     // Add (REIT, 3.5% yield)
  SCHD: { weight: 0.25, theme: "dividends" },  // Add (dividend ETF)
  SPY: { weight: 0.10, theme: "hedge" }        // Reduce
}

// Result: Portfolio now gets ~3% dividend yield
// + growth upside from power/compute
// + lower volatility from established dividend payers
```

---

## Customization 9: Testing & Backtesting

### Dry-Run Testing

```bash
# Run without any real actions
npm run daily

# Outputs suggestions but:
# - Doesn't place orders (IBKR in dryRun mode)
# - Doesn't send alerts
# - Doesn't move money
# Great for testing logic!
```

### Paper Trading Mode

```javascript
// In .env
IBKR_PORT=7498  // Paper trading port instead of 7497

// All orders go to paper account (simulated)
// See results without real money at risk
```

### Backtest Scoring Weights

```javascript
// Save suggestions for past 30 days
// Manually check how many were right

// Example:
// Day 1: Agent suggested "ACCUMULATE BE" (medium conviction)
// Day 8: BE up 12% ✓ (correct)

// Day 3: Agent suggested "MONITOR LITE" (medium conviction)
// Day 25: LITE down 8% ✗ (wrong)

// Scoring:
// 20 suggestions over month
// 14 were correct (70% accuracy)
// 6 were wrong (30% error)

// Conclusion: Medium conviction has ~70% accuracy
// HIGH conviction probably higher (~85%)
// LOW conviction probably lower (~45%)

// Use this to refine: Only execute HIGH conviction signals
```

---

## Customization 10: Connect Real Data Sources

### NewsAPI → Perplexity API

```javascript
// Perplexity provides better analysis than NewsAPI

async fetchThemeNews(theme, keywords) {
  const response = await axios.post(
    'https://api.perplexity.ai/chat/completions',
    {
      model: 'ppl-70b-online',
      messages: [{
        role: 'user',
        content: `Find latest news about: ${keywords.join(', ')}.
                 Summarize sentiment for investment purposes.`
      }]
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      }
    }
  )
  
  return response.data.choices[0].message.content
}
```

### TradingView MCP → Real Technical Data

```javascript
// If you have TradingView MCP server, add tools:

const tools = [
  {
    name: "tradingview_analysis",
    description: "Get real technical analysis from TradingView",
    input_schema: {
      ticker: "string",
      timeframe: "1D|1H|4H|weekly"
    }
  },
  // ... rest of tools
]

// Claude will call this to validate entries:
// "Before suggesting CEG, let me check TradingView for VWAP level..."
```

### Finnhub API → Real Screening Data

```javascript
// Replace mock screener with real Finnhub data

async screenCandidates(theme) {
  const keywords = getKeywordsForTheme(theme)
  
  // Finnhub screener API
  const candidates = await axios.get(
    'https://finnhub.io/api/v1/stock/screener/basic',
    {
      params: {
        q: `marketCapMoreThan=${this.marketCapMin} AND ...`,
        token: process.env.FINNHUB_API_KEY
      }
    }
  )
  
  // Filter by screener criteria
  return filterByCriteria(candidates)
}
```

---

## Integration Checklist

### Phase 1: Test & Tune (Current State)
- ✅ Agent logic works with mock data
- ✅ Scoring weights can be adjusted
- ✅ Scheduling works
- ⏳ Replace mock news with real NewsAPI data

### Phase 2: Add Real Data (Next)
- ⏳ Connect real NewsAPI (free tier)
- ⏳ Connect TradingView screener (export CSV daily)
- ⏳ Add IBKR integration (paper trading)

### Phase 3: Production (When Ready)
- ⏳ Real IBKR orders (dryRun=false)
- ⏳ Real money trading
- ⏳ Live alerts (email/Slack)
- ⏳ Cloud deployment (AWS Lambda/Google Cloud)

---

## Real-World Usage Examples

### Example 1: Monday Morning (Start of Week)

```
8:00 AM: You wake up, check slack
9:30 AM: Agent runs automatically
  └─ Fetches weekend news
  └─ Analyzes sentiment
  └─ Generates suggestions

9:35 AM: You check suggestions.json
  "HOLD CRWV (core position)
   ACCUMULATE BE (power shortage signals)
   MONITOR LITE (optical demand emerging)
   NEW: CEG (utility play, high scores)"

9:40 AM: You review & decide
  "Agree on BE. Disagree on CEG (too new).
   Add 50 shares of BE (check broker limit first).
   Research CEG more before adding.
   LITE looks good, add on 2% dip."

9:50 AM: You place orders manually
  (Or set to auto-execute if conviction is HIGH)
```

### Example 2: Friday Afternoon (Weekly Ranking)

```
2:00 PM Friday: You review week's suggestions
  20 daily suggestions received
  - 12 were for existing positions (hold/accumulate)
  - 8 were for new candidates

3:00 PM: Agent runs weekly ranking
  └─ Scores all 50 power candidates
  └─ Scores all 30 compute candidates
  └─ etc.

3:15 PM: You check weekly-ranks.json
  "Top Power Plays:
   1. CEG (8.57) - Added to portfolio this week, confirming
   2. AEE (8.12) - Hold
   3. NEE (7.95) - Monitor

   Top Compute Plays:
   1. NVDA (9.2) - Hold position, core
   2. RKLB (8.1) - Accumulate on dips
   3. ORCL (7.8) - Watch list"

3:30 PM: You update your watchlist
  "For next week, focus on power (CEG, AEE).
   No new positions unless high conviction.
   Monitor cooling sector for entry points."
```

### Example 3: Emergency Situation

```
News breaks: "Data center power crisis in California"

9:00 AM: News breaks via Reuters alert
10:00 AM: Agent runs early (manual trigger)
  └─ Fetches breaking news
  └─ Analyzes impact on power stocks
  └─ Detects high sentiment for BE, CEG

10:15 AM: Suggestions show:
  "URGENT OPPORTUNITY: Power shortage confirmed.
   BUY SIGNAL: BE (high conviction)
   BUY SIGNAL: CEG (medium conviction)
   Stock prices up 5% on news."

10:20 AM: You decide
  "Power move is real. Add 200 shares BE.
   But wait on CEG (already up too much).
   Check if any weakness in next 1-2 hours
   before buying."

10:30 AM: You place order
  "Buying 200 BE at market, execute now."

Outcome: You caught the wave before mainstream caught on.
This is what the agent does—detects signals early.
```

---

## Next Steps

1. **Review** your current portfolio composition
2. **Decide** on screening criteria (volatility, size, etc.)
3. **Set weights** for scoring (what matters most to you?)
4. **Test** with daily runs for 2 weeks
5. **Track accuracy** - did suggestions make money?
6. **Iterate** - adjust weights based on results
7. **Deploy** - when confident, enable scheduler + IBKR

That's how you build a thesis-driven portfolio agent.

**You're now equipped to customize every aspect of this system.**

Next: Any questions on specific customizations?
