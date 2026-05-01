# Deep Dive 3: Supporting Modules

The agent is the brain. But it needs **eyes** (news), **limbs** (IBKR), and **a heartbeat** (scheduler).

---

## Module 1: News Module (news-module.js)

**What it does**: Fetches and analyzes financial news articles

**Where it gets data**: NewsAPI (newsapi.org)

### How NewsAPI Works

```
NewsAPI is a free/paid service that aggregates news from 10,000+ sources.

Pricing:
  Free tier: 100 requests/day, 20 articles per request
  Paid tier: From $1/month ($0.01 per request)

Your usage:
  Daily: 5 calls (5 themes) + weekly: 5 calls = ~60/month
  Cost: ~$6/month paid tier, or just use free tier and limit calls
```

### The NewsModule Class

```javascript
class NewsModule {
  constructor() {
    this.cache = {};           // In-memory cache
    this.cacheDir = "./agent-data/news-cache"  // Persistent cache
  }

  // Main method: Fetch news for a ticker
  async fetchTickerNews(ticker, days = 7) {
    // Check if cached recently
    if (cache is valid) return cached_results

    // Fetch from NewsAPI
    response = GET "https://newsapi.org/v2/everything" {
      q: ticker,
      sortBy: "publishedAt",
      language: "en",
      from: date_X_days_ago,
      apiKey: NEWSAPI_KEY
    }

    // Cache results (5-min TTL)
    save to disk + memory

    // Return top 20 articles
    return response.articles
  }

  // Method 2: Fetch news for a theme/keywords
  async fetchThemeNews(theme, keywords, days = 1) {
    // Same flow as above, but
    // q = "keyword1 OR keyword2 OR keyword3"
    // from = date_X_days_ago
  }

  // Method 3: Analyze articles for sentiment
  summarizeArticles(articles) {
    // Count bullish keywords: surge, soar, beat, growth, etc.
    // Count bearish keywords: plunge, crash, miss, decline, etc.
    // Calculate sentiment_score = (bullish - bearish) / total
    // Extract headlines + sources
    // Return summary
  }
}
```

### Example: Fetching News for Power Theme

```javascript
// Initialize module
const news = new NewsModule()

// Fetch news about power theme
const articles = await news.fetchThemeNews(
  "power",
  ["power generation", "electricity production", "grid", "renewable energy"],
  days = 1  // Last 24 hours
)

// articles = [
//   {
//     source: { name: "CNBC" },
//     title: "US Grid Capacity Expanding with New Solar Projects",
//     description: "...",
//     publishedAt: "2024-04-24T14:30:00Z",
//     url: "https://...",
//     content: "Full article text..."
//   },
//   { ... 19 more articles ... }
// ]

// Summarize sentiment
const summary = news.summarizeArticles(articles)

// summary = {
//   count: 20,
//   headlines: [
//     {title: "US Grid Expanding...", source: "CNBC", published: "2024-04-24T14:30Z"},
//     {title: "Utilities Rally...", source: "Reuters", published: "2024-04-24T13:00Z"},
//     // ... 8 more headlines
//   ],
//   sources: ["CNBC", "Reuters", "Bloomberg", "TheVerge", ...],
//   bullish_signals: 14,  // Count of bullish keywords
//   bearish_signals: 2,
//   sentiment: "bullish",
//   sentiment_score: 0.86  // (14 - 2) / (14 + 2) = 0.857
// }
```

### Caching Strategy

Why caching matters:
```
Without caching:
  8:00 AM: Agent calls fetch_theme_news("power") → API call #1
  8:05 AM: User runs again → API call #2 (same data)
  8:10 AM: Manual test → API call #3 (same data)
  Cost: 3 API calls for 1 day of data = waste

With caching (5-min TTL):
  8:00 AM: Agent calls → API call #1, saved to cache
  8:05 AM: Agent calls → Returns from cache (no API call)
  8:10 AM: User test → Returns from cache (no API call)
  8:06 PM: Evening run → Cache expired, API call #2
  Cost: 2 API calls for entire day = efficient
```

### Cache Storage

```
Location: ./agent-data/news-cache/news-cache.json

Format:
{
  "theme-power-1d": {
    timestamp: 1713951600000,  // When cached
    data: [
      {source: {...}, title: "...", ...},
      {source: {...}, title: "...", ...},
      // ... 20 articles
    ]
  },
  "ticker-CRWV-7d": {
    timestamp: 1713950000000,
    data: [...]
  },
  // ... more cached results
}
```

If the file doesn't exist, it's created. If it does, results are loaded on startup.

### Customizing News

**Change news sources**:
```javascript
// In NEWS_CONFIG
sources: "techcrunch,theverge,cnbc,reuters,bloomberg"
// Add/remove sources by comma-separating

// Find available sources at: https://newsapi.org/sources
```

**Change keywords for a theme**:
```javascript
// In portfolio-agent-system.js, CONFIG.themes
themes: [
  {
    id: "power",
    keywords: [
      "power generation",
      "electricity production",
      "grid capacity",
      "renewable energy"
      // Add new keywords here
    ]
  }
]
```

**Change cache TTL**:
```javascript
// In news-module.js
cacheTime: 5 * 60 * 1000  // 5 minutes (default)
// Change to:
cacheTime: 60 * 60 * 1000  // 1 hour (less API usage)
```

---

## Module 2: IBKR Module (ibkr-module.js)

**What it does**: Manages portfolio positions and orders with Interactive Brokers

**Currently**: Uses mock data for testing
**When ready**: Connect to real IBKR API via ib-sdk

### The IBKRClient Class

```javascript
class IBKRClient {
  constructor() {
    this.connected = false
    this.portfolio = {}
    this.positionCache = null
    this.positionCacheTime = 0
    
    // In production:
    // const IB = require('ib-sdk')
    // this.client = new IB.Client({ host, port, clientId })
  }

  async connect()              // Connect to TWS/Gateway
  async disconnect()           // Close connection
  async getPortfolio()         // Fetch positions
  async getMarketData(ticker)  // Get live quote
  async placeOrder(...)        // Submit order
  async getAccountSummary()    // Fetch cash, buying power
  async savePortfolioSnapshot()// Export portfolio to JSON
}
```

### Method 1: getPortfolio()

**What it returns**:
```javascript
{
  timestamp: "2024-04-25T16:00:00Z",
  accountId: "YOUR_ACCOUNT_ID",
  holdings: [
    {
      ticker: "BE",
      name: "Bloom Energy",
      quantity: 0.2174,
      price: 50.55,
      marketValue: 232.23,
      avgPrice: 50.48,
      unrealizedPnL: 0.06,
      currency: "USD"
    },
    { ... more positions ... }
  ],
  summary: {
    totalMarketValue: "3305.18",
    totalUnrealizedPnL: "+14.02",
    totalUnrealizedPnLPct: "+0.42%",
    numPositions: 6
  }
}
```

**How it's used**:
```javascript
const ibkr = new IBKRClient()
await ibkr.connect()

const portfolio = await ibkr.getPortfolio()
console.log(`Total portfolio value: ${portfolio.summary.totalMarketValue}`)
console.log(`Unrealized P&L: ${portfolio.summary.totalUnrealizedPnL}`)

// Claude could use this in suggestions:
// "Your portfolio is worth $3,305. You have $500 cash available for new positions."
```

### Method 2: getMarketData(ticker)

**What it returns**:
```javascript
{
  ticker: "CRWV",
  price: 47.44,
  bid: 47.42,
  ask: 47.46,
  volume: 2150000,
  high52w: 52.35,
  low52w: 38.10,
  marketCap: 1230000000,  // $1.23B
  pe: 145.2,              // High P/E = growth stock
  dividend: 0             // No dividend
}
```

### Method 3: placeOrder(ticker, quantity, action, dryRun=true)

**With dryRun=true** (default, for safety):
```javascript
await ibkr.placeOrder("CRWV", 100, "BUY", dryRun=true)

// Returns:
{
  status: "dry_run",
  orderId: 123456,
  ticker: "CRWV",
  quantity: 100,
  action: "BUY",
  timestamp: "2024-04-25T16:00:00Z"
}

// No actual order placed. Good for testing!
```

**With dryRun=false** (real execution):
```javascript
await ibkr.placeOrder("CRWV", 100, "BUY", dryRun=false)

// Actually places order on IBKR
// Returns real orderId
// Order executes at market price or sits in queue
```

### Connecting Real IBKR

**Step 1**: Install IBKR SDK
```bash
npm install ib-sdk
```

**Step 2**: Start IBKR TWS or Gateway
- Download from: https://www.interactivebrokers.com/
- Run the application
- Go to: Settings → API → Enable socket clients
- Default port: 7497 (live) or 7498 (paper)

**Step 3**: Update ibkr-module.js
```javascript
const IB = require('ib-sdk')

constructor() {
  this.client = new IB.Client({
    host: process.env.IBKR_HOST || 'localhost',
    port: process.env.IBKR_PORT || 7497,
    clientId: process.env.IBKR_CLIENT_ID || 10
  })
}

async connect() {
  await this.client.connect()
  this.connected = true
}

async getPortfolio(forceRefresh = false) {
  if (cache valid) return this.positionCache
  
  // Real call to IBKR
  const positions = await this.client.getPositions(
    accountId: process.env.IBKR_ACCOUNT_ID
  )
  
  // Process + cache
  this.positionCache = positions
  this.positionCacheTime = Date.now()
  return positions
}
```

**Step 4**: Update .env
```bash
IBKR_HOST=localhost
IBKR_PORT=7497
IBKR_CLIENT_ID=10
IBKR_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

**Step 5**: Use it
```javascript
const ibkr = new IBKRClient()
await ibkr.connect()
const portfolio = await ibkr.getPortfolio()
await ibkr.placeOrder('CRWV', 100, 'BUY', dryRun=false)
await ibkr.disconnect()
```

### Position Caching

```
Why cache?
- IBKR API calls take 50-100ms each
- Positions don't change second-by-second
- Caching reduces latency

Cache TTL: 1 minute
- After 1 minute, fetch fresh data
- Before 1 minute, return cached data

Force refresh:
await ibkr.getPortfolio(forceRefresh=true)  // Always fetch fresh
```

---

## Module 3: Scheduler (scheduler.js)

**What it does**: Automatically runs agent at specific times

**When it runs**:
- Daily 9:30 AM ET (market open)
- Daily 4:00 PM ET (market close)
- Weekly Friday 5:00 PM ET (after hours)

### How Node-Schedule Works

```javascript
const schedule = require('node-schedule')

// Cron syntax: "minute hour day month dayOfWeek"
schedule.scheduleJob('30 9 * * 1-5', dailyOpenJob)
//                    │  │ │ │     │
//                    │  │ │ │     └─ Day of week (1=Mon, 5=Fri)
//                    │  │ │ └─ Month (all)
//                    │  │ └─ Day (all)
//                    │  └─ Hour (9 = 9 AM)
//                    └─ Minute (30)

// Result: Every weekday at 9:30 AM
```

### Cron Syntax Reference

```
"30 9 * * 1-5"    → Monday-Friday 9:30 AM
"0 16 * * 1-5"    → Monday-Friday 4:00 PM
"0 17 * * 5"      → Friday 5:00 PM
"0 0 * * *"       → Every day midnight
"*/5 * * * *"     → Every 5 minutes (for testing)
"0 9-17 * * *"    → Every hour from 9 AM to 5 PM
```

### The Schedule in Your Agent

```javascript
SCHEDULE = {
  dailyOpen: "30 9 * * 1-5",     // Mon-Fri 9:30 AM
  dailyClose: "0 16 * * 1-5",    // Mon-Fri 4:00 PM
  weeklyRank: "0 17 * * 5"       // Friday 5:00 PM
}

schedule.scheduleJob(SCHEDULE.dailyOpen, dailyOpenJob)
schedule.scheduleJob(SCHEDULE.dailyClose, dailyCloseJob)
schedule.scheduleJob(SCHEDULE.weeklyRank, weeklyRankJob)

// Each job:
// 1. Spawns new Node process
// 2. Runs agent (daily or weekly)
// 3. Saves results to file
// 4. Logs errors if anything fails
```

### Running the Scheduler

```bash
# Start scheduler (runs forever)
npm run schedule

# Output:
# ╔════════════════════════════════════════════════════╗
# ║ Portfolio Agent Scheduler Initialized              ║
# ╚════════════════════════════════════════════════════╝
#
# Schedule:
#   Daily (Market Open):   30 9 * * 1-5  (9:30 AM ET, Mon-Fri)
#   Daily (Market Close):  0 16 * * 1-5 (4:00 PM ET, Mon-Fri)
#   Weekly Ranking:        0 17 * * 5 (Friday 5:00 PM ET)
#
# Press Ctrl+C to stop.
```

When scheduler is running:
- 9:30 AM → Automatically runs `npm run daily`
- 4:00 PM → Automatically runs `npm run daily`
- 5:00 PM Friday → Automatically runs `npm run weekly`

### Error Handling

If a job fails:
```javascript
// scheduler.js logs errors
function logError(jobName, error) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    job: jobName,
    error: error.message,
    stack: error.stack
  }
  
  // Save to file
  fs.appendFileSync(
    './agent-data/logs/errors.json',
    JSON.stringify(logEntry) + '\n'
  )
}

// If daily job fails at 9:30 AM, error logged but scheduler keeps running
// 4:00 PM job still runs normally
```

### Customizing Schedule

Want to run at different times?

```javascript
// In scheduler.js, change SCHEDULE
SCHEDULE = {
  dailyOpen: "30 8 * * 1-5",     // 8:30 AM instead of 9:30 AM
  dailyClose: "0 15 * * 1-5",    // 3:00 PM instead of 4:00 PM
  weeklyRank: "0 18 * * 5"       // 6:00 PM Friday instead of 5:00 PM
}
```

Or run every 5 minutes for testing:

```javascript
SCHEDULE = {
  dailyOpen: "*/5 * * * *",      // Every 5 minutes
  dailyClose: "*/10 * * * *",    // Every 10 minutes
  weeklyRank: "*/5 * * * *"      // Every 5 minutes
}
```

---

## How Modules Work Together

### During Daily Run

```
1. Scheduler says: "It's 9:30 AM, run daily agent"
2. Spawns new process: npm run daily

3. Agent starts (portfolio-agent-system.js)
4. Claude is initialized with system prompt

5. Claude calls tools → news-module executes
   news.fetchThemeNews("power") → NewsAPI → Returns articles

6. Claude analyzes → calls rank_and_score_candidates
   Internally uses mock screener data (in production: Finnhub)

7. Claude generates suggestions

8. Results saved to file: ./agent-data/suggestions.json

9. If IBKR is connected, agent could call:
   ibkr.getPortfolio() → Fetch live positions
   ibkr.getMarketData("CRWV") → Fetch live quote
   ibkr.savePortfolioSnapshot() → Archive positions

10. Process exits
11. Scheduler continues running, waiting for next job
```

### Data Ownership

```
news-module:
  Fetches: NewsAPI
  Caches: ./agent-data/news-cache/
  Returns: Articles + sentiment summary

ibkr-module:
  Fetches: IBKR API (or mock)
  Caches: 1-minute position cache (memory)
  Saves: ./agent-data/portfolio-snapshot-YYYY-MM-DD.json

scheduler:
  Logs: ./agent-data/logs/errors.json
  Spawns: portfolio-agent-system.js process

portfolio-agent-system (agent):
  Uses: news-module data + ibkr-module data
  Outputs: ./agent-data/suggestions.json + ./agent-data/weekly-ranks.json
```

---

## Deployment Considerations

### Local Machine
```bash
npm run schedule
# Keep terminal open. Keep Node.js process running.
# If you close terminal, scheduler stops.
```

### Cloud Deployment (Better)
Options:
1. **AWS Lambda** - Run on schedule, pay per execution
2. **Google Cloud Scheduler** - Cron jobs managed
3. **Heroku** - Simple hosting with built-in scheduling
4. **Your VPS** - Self-hosted, full control

Example AWS Lambda:
```javascript
// The function that runs when Lambda is triggered
exports.handler = async (event) => {
  const { spawn } = require('child_process')
  
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['portfolio-agent-system.js', 'daily'])
    proc.on('exit', (code) => {
      if (code === 0) resolve('Success')
      else reject('Agent failed')
    })
  })
}

// AWS Lambda scheduling:
// Trigger 1: EventBridge cron at 9:30 AM
// Trigger 2: EventBridge cron at 4:00 PM
// Trigger 3: EventBridge cron at 5:00 PM Friday
```

---

## Next: Configuration & Customization

Now that you understand each module, let's customize them for your specific needs.

Deep Dive 4 covers how to change portfolio weights, screener criteria, themes, scoring, and more.
