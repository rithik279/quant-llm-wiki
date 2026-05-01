# Portfolio Agent System
## AGI Infrastructure Growth Equity Agent
**Theme**: Situational Awareness (Leopold Aschenbrenner)

---

## Overview

This is a **daily automated portfolio agent** that monitors your AGI infrastructure growth equity portfolio and generates trade suggestions based on:

1. **News Sentiment** - Market sentiment for portfolio holdings & themes
2. **Technical Screening** - Momentum & technicals (your TradingView screener criteria)
3. **Bottleneck Detection** - Emerging infrastructure opportunities
4. **Weekly Ranking** - Comprehensive scoring of candidates

### Your Portfolio Thesis

You're betting on **infrastructure bottlenecks for AGI buildout**:

- **Power Generation** (BE) - Renewable energy for massive compute clusters
- **Compute Infrastructure** (CRWV) - GPU availability and data center capacity
- **Memory** (MU) - DRAM and HBM demand from AI systems
- **Storage** (SNDK) - Flash memory for AI model weights and data
- **Optical Interconnects** (LITE) - Coherent transceiver demand
- **Hedge** (SPY) - Broad market exposure

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE AGENT (Core)                      │
│  - News sentiment analysis                                  │
│  - Screener candidate ranking                               │
│  - Bottleneck detection                                     │
│  - Trade suggestion generation                              │
└─────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │  News  │    │  IBKR  │    │Trading │    │Market  │
    │ Module │    │ Module │    │View MCP│    │ Data   │
    └────────┘    └────────┘    └────────┘    └────────┘
         ↓              ↓              ↓              ↓
    NewsAPI      TWS/Gateway    Chrome MCP     Finnhub
    (Top 10 sources)
```

### File Structure

```
.
├── portfolio-agent-system.js    # Core agent + Claude API integration
├── scheduler.js                  # Daily/Weekly job runner (node-schedule)
├── news-module.js                # NewsAPI integration & sentiment
├── ibkr-module.js                # IBKR position management
├── package.json                  # Dependencies
├── .env.example                  # Configuration template
└── agent-data/
    ├── suggestions.json          # Daily trade suggestions
    ├── weekly-ranks.json         # Weekly screener rankings
    ├── news-cache/               # Cached news articles
    ├── portfolio-snapshot-*.json  # Daily IBKR snapshots
    └── logs/
        └── errors.json           # Error logs
```

---

## Setup & Installation

### 1. Prerequisites

- **Node.js 18+** (for async/await and modern JavaScript)
- **Anthropic API Key** (Claude Sonnet 4)
- **NewsAPI Key** (free tier: newsapi.org)
- **IBKR TWS or Gateway** (running locally on default port 7497)

### 2. Clone & Install

```bash
# Clone or copy files to your working directory
cd ~/portfolio-agent

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### 3. Configure Environment

Edit `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-...your-key...
NEWSAPI_KEY=your-newsapi-key
IBKR_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

### 4. Verify Installation

```bash
# Test agent (dry run)
npm run daily

# Should output: Agent analysis with suggestions
# Creates: ./agent-data/suggestions.json
```

---

## Usage

### Manual Runs

```bash
# Run daily agent (market open/close analysis)
npm run daily

# Run weekly screener ranking
npm run weekly

# View latest suggestion
cat ./agent-data/suggestions.json

# View latest rankings
cat ./agent-data/weekly-ranks.json
```

### Automated Scheduling

```bash
# Start scheduler (runs daily at 9:30 AM & 4 PM ET, weekly Friday 5 PM)
npm run schedule

# Output: Runs daily at market hours, saves results to agent-data/
```

### With TradingView MCP (Optional)

If you have TradingView MCP server running, the agent can validate technicals:

```bash
# Update portfolio-agent-system.js to include TradingView tools
# Agent will fetch VWAP, RSI, divergences, etc. from TradingView

# Example: Agent validates LITE momentum before suggesting accumulation
```

---

## Agent Behavior

### Daily Agent (9:30 AM & 4 PM ET)

**Inputs**:
- News for portfolio tickers (BE, CRWV, LITE, MU, SNDK)
- Infrastructure theme news (power, compute, memory, storage, optical)
- Market sentiment & catalysts

**Process**:
1. Fetch daily news (last 24 hours)
2. Analyze sentiment & catalysts for each theme
3. Check for emerging bottlenecks
4. Score new opportunities in screener universe
5. Generate trade suggestions (HOLD, ACCUMULATE, EXIT, ADD_NEW)

**Output**: `./agent-data/suggestions.json`

Example:
```json
{
  "timestamp": "2024-04-25T16:00:00Z",
  "analysis": "CRWV: Strong compute buildout signals, hold core. BE: Power generation bottleneck emerging, ACCUMULATE. LITE: Good technicals but wait for VWAP confirmation. New opportunity: CEG (utility + nuclear) fits power thesis.",
  "suggestions": [
    {
      "action": "HOLD_CORE",
      "tickers": ["CRWV", "MU"],
      "conviction": "high"
    },
    {
      "action": "ACCUMULATE",
      "tickers": ["BE"],
      "conviction": "medium"
    },
    {
      "action": "MONITOR",
      "tickers": ["LITE"],
      "conviction": "medium"
    },
    {
      "action": "ADD_NEW",
      "new_tickers": ["CEG"],
      "rationale": "Power generation bottleneck, utility upside",
      "conviction": "low"
    }
  ]
}
```

### Weekly Screener Ranking (Friday 5 PM ET)

**Inputs**:
- All screener candidates from TradingView
- Last week's market data & technicals
- Sentiment trends
- Catalyst pipeline

**Process**:
1. Screen candidates by theme (power, compute, memory, storage, optical)
2. Score each candidate:
   - **Technical** (30%): SMA alignment, new highs, momentum
   - **Momentum** (25%): Price strength, volume
   - **Sentiment** (25%): News bullish/bearish ratio
   - **Catalyst** (20%): Earnings, product releases, supply shifts
3. Rank top 3-5 per theme

**Output**: `./agent-data/weekly-ranks.json`

Example:
```json
{
  "week_of": "2024-04-25",
  "rankings": {
    "power": [
      {
        "ticker": "CEG",
        "score": 8.7,
        "rank": 1,
        "technical": 8.5,
        "momentum": 8.9,
        "sentiment": 8.2,
        "catalyst": 9.1,
        "recommendation": "BUY"
      },
      {
        "ticker": "AEE",
        "score": 8.1,
        "rank": 2
      }
    ],
    "compute": [
      {
        "ticker": "NVDA",
        "score": 9.2,
        "rank": 1,
        "recommendation": "HOLD"
      }
    ]
  }
}
```

---

## Integration with IBKR

### Enabling Real Position Management

Currently, the system uses **mock data**. To connect real IBKR:

1. **Start IBKR TWS or Gateway**:
   - Download from: https://www.interactivebrokers.com/
   - Enable API: Settings → API → Enable socket clients
   - Default port: 7497

2. **Install IBKR SDK** (optional, for richer API):
   ```bash
   npm install ib-sdk
   ```

3. **Update ibkr-module.js**:
   ```javascript
   const IB = require('ib-sdk');
   this.client = new IB.Client({...});
   await this.client.connect();
   ```

4. **Use real methods**:
   ```javascript
   // Fetch live positions
   const portfolio = await ibkrClient.getPortfolio();
   
   // Place trades (dry run by default)
   await ibkrClient.placeOrder('CRWV', 100, 'BUY', dryRun=true);
   ```

---

## Integration with TradingView MCP

### Monitor Technical Confirmations

If you have a TradingView MCP server running:

```javascript
// In portfolio-agent-system.js, add TradingView tools:

const tools = [
  {
    name: "tradingview_chart_analysis",
    description: "Fetch VWAP, RSI, MACD from TradingView",
    input_schema: {
      ticker: "string",
      timeframe: "1D|1H|4H"
    }
  },
  // ... more tools
];

// Agent uses this to validate entry points
// Example: "Before accumulating BE, check weekly VWAP..."
```

---

## Monitoring & Alerts

### Logs

All runs are logged:
```bash
tail -f ./agent-data/logs/errors.json
```

### Email Alerts (Optional)

To enable email notifications on high-conviction suggestions:

```javascript
// In scheduler.js
const nodemailer = require('nodemailer');

async function sendAlert(suggestion) {
  if (suggestion.conviction === 'high') {
    await transporter.sendMail({
      to: process.env.ALERT_EMAIL,
      subject: 'High-Conviction Portfolio Signal',
      text: JSON.stringify(suggestion, null, 2)
    });
  }
}
```

---

## Customization

### Change Screener Criteria

Edit `CONFIG.screener` in `portfolio-agent-system.js`:

```javascript
screener: {
  marketCapMin: 2000000000, // $2B+
  perfYTD: 0,
  priceVolume1M: 200000000, // $200M+
  // ... add your own filters
}
```

### Change Portfolio Weights

Edit `CONFIG.portfolio`:

```javascript
portfolio: {
  BE: { weight: 0.25, ... },  // Increase power exposure
  CRWV: { weight: 0.40, ... }, // Core compute
  // ...
}
```

### Change Scoring Weights

In agent call, adjust emphasis:

```javascript
// Daily agent focuses on sentiment
// Weekly ranker uses balanced scoring
// Edit tool weights in processTool() function
```

### Add New Themes

```javascript
themes: [
  {
    id: "cooling",  // New theme
    keywords: ["cooling", "thermal", "liquid cooling"],
    tickers: ["LIAN", "CRWV"]  // Relevant plays
  }
]
```

---

## API Usage Notes

### NewsAPI

- **Free tier**: 100 requests/day
- **Rate limit**: ~1 request/second
- Agent caches results (5-min TTL) to minimize calls
- Alternative: Use Perplexity API for better analysis

### Anthropic API

- **Model**: Claude Sonnet 4 (optimized for tool use)
- **Usage**: ~1-2k tokens per daily run
- **Cost**: ~$0.10-0.20/day at current pricing

### IBKR

- **No cost** (already included in account)
- **Latency**: ~50-100ms for position fetches
- **Rate limits**: 100 requests/second (plenty)

---

## Troubleshooting

### "NEWSAPI_KEY not set"

```bash
# Check .env file
grep NEWSAPI_KEY .env

# Get free key at https://newsapi.org/
# Update .env with your key
```

### "Failed to connect to IBKR"

```bash
# Check TWS/Gateway is running
nc -zv localhost 7497

# Check port in .env
# Default: 7497 for live, 7498 for paper trading
```

### Agent runs but no suggestions generated

```bash
# Check agent-data/ directory exists
mkdir -p ./agent-data/{logs,news-cache}

# Check Claude API key is valid
echo $ANTHROPIC_API_KEY | wc -c  # Should be 50+ chars

# Run in debug mode
DEBUG=* npm run daily
```

### High API costs

**Solution**: Increase cache TTL

```javascript
// In news-module.js
cacheTime: 60 * 60 * 1000  // 1 hour instead of 5 min
```

---

## Advanced: Multi-Agent Collaboration

You can extend this to coordinate multiple specialized agents:

```javascript
// Agent 1: Daily sentiment
// Agent 2: Weekly technical ranking
// Agent 3: Risk management & position sizing
// Agent 4: Earnings calendar & catalyst planning

// Coordinating agent reconciles all inputs
```

---

## Next Steps

1. **Set up credentials**: Add API keys to `.env`
2. **Test daily agent**: `npm run daily`
3. **Enable scheduler**: `npm run schedule`
4. **Review suggestions**: Check `./agent-data/suggestions.json` daily
5. **Connect IBKR**: Update `ibkr-module.js` for real positions
6. **Add TradingView**: Optional MCP integration for technical validation
7. **Fine-tune scoring**: Adjust weights based on historical performance

---

## Support

For issues or customizations:
1. Check logs: `./agent-data/logs/errors.json`
2. Run tests: `npm run test`
3. Review Claude output: Last suggestion in `./agent-data/suggestions.json`

---

**Built with**: Claude Sonnet 4, Node.js, Anthropic API
**Theme**: Situational Awareness (Leopold Aschenbrenner)
**Portfolio**: AGI Infrastructure Growth Equities
