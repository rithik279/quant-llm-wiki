# Deep Dive 1: Architecture & Core Concepts

## The Big Picture: What Problem Does This Solve?

### Traditional Portfolio Management
```
You (manually):
1. Read financial news
2. Check portfolio positions
3. Run screeners
4. Calculate scores
5. Decide on trades
6. Execute orders
7. Repeat daily
```

**Time**: 1-2 hours/day
**Errors**: High (human bias, missed catalysts)
**Bottleneck**: You're the limiting factor

### With Your Agent
```
Agent (automated):
1. Fetches news 24/7
2. Monitors positions live
3. Runs screeners continuously
4. Claude calculates weighted scores
5. Generates daily suggestions
6. You review in 5 minutes
7. You decide to execute or ignore
```

**Time**: 5 minutes/day (to review)
**Errors**: Low (systematic, thesis-aligned)
**Bottleneck**: News quality + screener criteria

---

## The Philosophy: Agentic Loop

Your agent uses **Claude's tool use** feature to think step-by-step:

```
┌─────────────────┐
│ User Request    │
│ "Review         │
│ portfolio &     │
│ find trades"    │
└────────┬────────┘
         ↓
┌──────────────────────┐
│ Claude reads request │
│ + system prompt      │
│ (your portfolio      │
│  thesis)            │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Claude decides:      │
│ "I need news data"   │
│ → calls fetch_news   │
│ "I need screener     │
│  candidates"         │
│ → calls screen       │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Tools execute,       │
│ return data          │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Claude analyzes      │
│ results:             │
│ "Power news is       │
│  bullish, compute    │
│  supply is tight..." │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Claude decides:      │
│ "Need to rank        │
│ candidates"          │
│ → calls rank_score   │
└────────┬─────────────┘
         ↓
┌──────────────────────┐
│ Claude generates     │
│ final suggestions    │
│ with reasoning       │
└────────┬─────────────┘
         ↓
┌─────────────────┐
│ Suggestions     │
│ saved to file   │
└─────────────────┘
```

### Why This Is Better Than Static Scoring

**Static scoring** (traditional):
```
Score = 0.3×Technical + 0.25×Momentum + 0.25×Sentiment + 0.2×Catalyst

Problems:
- Ignores context (are catalysts coming or going?)
- Can't handle novel situations (new bottleneck types)
- Mechanical (doesn't reason about thesis)
- Weights are fixed (can't adapt)
```

**Agentic scoring** (your system):
```
Claude reads news → "Power is a bottleneck"
Claude reads screener → "These 5 utilities match"
Claude reads sentiment → "Policy tailwinds are bullish"
Claude reasons → "This combo = high conviction"
Claude explains → "Why you should buy"

Advantages:
- Context-aware (understands Leopold thesis)
- Adaptive (can discover new opportunities)
- Explainable (Claude tells you the reasoning)
- Flexible (can weight factors differently for different situations)
```

---

## The System: Data Flow

### Daily Flow (9:30 AM)

```
START: Market Open
  ↓
Agent spawns with system prompt:
  "You monitor AGI infrastructure portfolio. 
   Themes: power, compute, memory, storage, optical.
   Portfolio: BE, CRWV, LITE, MU, SNDK, SPY.
   Thesis: Leopold Aschenbrenner's bottleneck framework."
  ↓
Claude decides to call tools:
  ├─ fetch_portfolio_news("power") 
  │  → Returns: [5 articles about utilities, power shortages]
  ├─ fetch_portfolio_news("compute")
  │  → Returns: [5 articles about GPU availability, data centers]
  ├─ fetch_portfolio_news("memory")
  │  → Returns: [5 articles about DRAM, HBM demand]
  ├─ fetch_portfolio_news("storage")
  │  → Returns: [5 articles about NAND supply, SSD demand]
  └─ fetch_portfolio_news("optical")
     → Returns: [5 articles about interconnect demand]
  ↓
Claude analyzes news:
  "Power theme: 2 bullish, 1 neutral → net bullish
   Compute theme: 4 bullish → strongly bullish
   Memory theme: 2 bullish, 2 neutral → slightly bullish
   Storage theme: 3 neutral → no signal
   Optical theme: 1 bullish → slightly bullish"
  ↓
Claude calls analyze_sentiment for top catalysts:
  analyze_sentiment("power", ["new solar capacity", "grid constraints"])
  → "Bullish: supply constraints creating pricing power for generators"
  ↓
Claude calls detect_bottleneck_emergence:
  detect_bottleneck_emergence("power", "Grid capacity becoming limiting...")
  → "Emerging bottleneck: power delivery to chip fab clusters"
  ↓
Claude calls screen_candidates:
  screen_candidates("power") → [CEG, AEE, NEE, ...]
  screen_candidates("compute") → [RKLB, NVIDIA, ...]
  ↓
Claude calls rank_and_score_candidates:
  rank_and_score_candidates(["CEG", "AEE", "NEE", "RKLB", ...])
  → Ranked list with scores
  ↓
Claude generates final analysis:
  "BE: Core position, hold. Power bottleneck strengthening.
   CRWV: Core position, hold. Compute demand accelerating.
   LITE: Monitor technicals before adding. Optical demand visible.
   NEW OPPORTUNITY: CEG - Power generation play fits thesis perfectly.
   NEW OPPORTUNITY: NVDA - Compute foundational, but already large cap."
  ↓
Suggestions saved to: ./agent-data/suggestions.json
END: Market Open Analysis Complete (took ~20-30 seconds)
```

### Weekly Flow (Friday 5 PM)

```
START: End of Week Analysis
  ↓
Claude calls screen_candidates for each theme:
  ├─ screen_candidates("power", exclude_holdings=true)
  ├─ screen_candidates("compute", exclude_holdings=true)
  ├─ screen_candidates("memory", exclude_holdings=true)
  ├─ screen_candidates("storage", exclude_holdings=true)
  └─ screen_candidates("optical", exclude_holdings=true)
  ↓
Returns top candidates per theme:
  Power: [CEG, AEE, NEE, ... (20+ candidates)]
  Compute: [RKLB, ORCL, DELL, ... (20+ candidates)]
  Memory: [SK, TSM, HIMX, ... (20+ candidates)]
  Storage: [WDC, KIOXIA, ... (15+ candidates)]
  Optical: [AAOI, JDSU, VIAV, ... (10+ candidates)]
  ↓
Claude calls rank_and_score_candidates with all candidates:
  Input: 80+ candidates
  Scoring weights:
    - Technical: 30% (SMA alignment, momentum, new highs)
    - Momentum: 25% (price strength, volume)
    - Sentiment: 25% (news bullish/bearish)
    - Catalyst: 20% (upcoming earnings, policy, supply shifts)
  ↓
Returns ranked list:
  POWER Rankings:
    1. CEG (score: 8.7) - "Buy" - Utilities + nuclear upside
    2. AEE (score: 8.1) - "Buy" - Renewable infrastructure
    3. NEE (score: 7.9) - "Hold" - Large cap, stable
  
  COMPUTE Rankings:
    1. NVDA (score: 9.2) - "Hold" - Core position, size it
    2. RKLB (score: 8.1) - "Buy" - New entrant, explosive growth
    3. ORCL (score: 7.8) - "Hold" - Cloud exposure
  
  MEMORY Rankings:
    1. TSM (score: 8.7) - "Buy" - Foundational play
    2. SK (score: 8.3) - "Buy" - HBM momentum
    3. MU (score: 8.0) - "Hold" - Your position
  
  ... (similar for storage, optical)
  ↓
Rankings saved to: ./agent-data/weekly-ranks.json
END: Weekly Ranking Complete (took ~40-50 seconds)
```

---

## Key Concepts

### 1. System Prompt (Your Thesis)

The system prompt tells Claude **what to think about**:

```
"You are a portfolio agent focused on AGI infrastructure bottlenecks.

Your portfolio (concentrated):
- BE (Bloom Energy): Power generation for compute clusters
- CRWV (CoreWeave): GPU compute infrastructure
- LITE (Lumentum): Optical interconnects
- MU (Micron): Memory for AI systems
- SNDK (SanDisk): Storage for model weights
- SPY: Broad market hedge

Your thesis (Leopold Aschenbrenner - Situational Awareness):
- AGI buildout requires massive compute infrastructure
- This creates bottlenecks in: power, GPU availability, memory, storage, optical
- Your job: Find companies solving these bottlenecks
- Find new bottlenecks before they're obvious

Your daily task:
1. Monitor news sentiment for each bottleneck theme
2. Screen for new opportunities matching your criteria
3. Rank candidates by thesis-alignment + technicals
4. Suggest trades with conviction levels"
```

This context means Claude will:
- ✅ Suggest power companies when it sees grid strain news
- ✅ Suggest optical plays when it sees interconnect bottleneck signals
- ❌ NOT suggest consumer discretionary stocks (not on thesis)
- ❌ NOT suggest boring dividend plays (not growth-focused)

### 2. Tool Use (The Agent's Decision-Making)

Claude doesn't execute code directly. Instead it says:
```
"I need to fetch news about the power theme to understand current sentiment.
I'll call the fetch_portfolio_news tool with theme_id='power'."
```

Then:
1. Your code executes the tool
2. Claude gets the results back
3. Claude decides what to do next
4. If needed, calls another tool
5. Eventually reaches a conclusion

This is **agentic** because Claude is making decisions about which tools to call, not just executing a fixed workflow.

### 3. Conviction Levels

Not all suggestions are equal. Claude rates conviction:

```
HIGH conviction:
- Multiple corroborating signals (news + technicals + catalyst + sentiment)
- Clear thesis alignment
- Example: "Power shortage + BE showing strong technicals + new policy = HIGH"

MEDIUM conviction:
- 2-3 signals aligned
- Some execution risk
- Example: "LITE showing momentum but optical demand still emerging = MEDIUM"

LOW conviction:
- Single signal or noisy data
- Speculative opportunity
- Example: "New company entering power market, thesis fits but unproven = LOW"
```

You then decide:
- **HIGH** → Execute immediately or add to watchlist
- **MEDIUM** → Monitor, wait for confirmation
- **LOW** → Research more before committing

---

## Why This Works for Your Use Case

Your portfolio is **concentrated** (6 positions) not **diversified** (100+ positions).

This means:
- You need **high-conviction ideas** (not "slightly bullish")
- You need **thesis alignment** (must fit infrastructure story)
- You need **emerging signals** (before they're priced in)

Traditional robo-advisors handle diversified portfolios poorly (too many positions to reason about).

Your agent is built for concentrated, thesis-driven portfolios because:
- ✅ Claude can reason about your specific thesis
- ✅ Can explain why each suggestion fits (or doesn't fit)
- ✅ Can detect emerging bottlenecks (new themes, new plays)
- ✅ Can weight signals differently (conviction levels)

---

## The Cost & Performance Trade-off

### Cost
- Claude API: ~2,000 tokens/day = **$0.006/day** (~$2/month)
- NewsAPI: Free tier (100/day) or **$1/month**
- IBKR API: Included with account
- **Total: ~$3/month**

### Performance
- Daily run: ~20-30 seconds (network I/O bound, not compute bound)
- Weekly run: ~40-50 seconds
- Scheduling overhead: <1 second
- **Real-time impact: None** (runs async while you sleep/trade)

### Why This Model
- You don't need millisecond latency (not a quant trading strategy)
- You need thoughtful analysis (not raw speed)
- You're willing to wait 20 seconds for day's first suggestion
- You review before executing anyway (human loop)

---

## Comparison to Alternatives

### Option 1: Manual Screening (What You Were Doing)
- Time: 1-2 hours/day
- Consistency: Low (depends on mood, sleep, etc.)
- Scalability: Doesn't scale (can't manage 50+ candidates)
- Cost: Your time (~$100/hour = $20+/day for you)

### Option 2: Traditional Robo-Advisor (e.g., Betterment, Wealthfront)
- Time: 0 (fully automated)
- Consistency: High
- Scalability: Excellent (handles 1000s of users)
- Cost: 0.25% AUM (~$25/year on $10k)
- **Problem**: Generic (doesn't know your thesis)

### Option 3: Your Agent (Agentic AI)
- Time: 5 minutes/day (review only)
- Consistency: High (systematic)
- Scalability: Excellent (can handle 100+ candidates)
- Cost: $3/month
- **Advantage**: Thesis-aware, explainable, customizable

---

## What's Happening Under the Hood

When you run `npm run daily`, here's what actually executes:

```javascript
// 1. Load configuration (portfolio, themes, screener criteria)
const CONFIG = {
  portfolio: { BE, CRWV, LITE, MU, SNDK, SPY },
  themes: [power, compute, memory, storage, optical],
  screener: { marketCapMin: $2B, ... }
}

// 2. Create Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// 3. Set up system prompt with your portfolio + thesis
const systemPrompt = "You are a portfolio agent focused on..."

// 4. Send initial request to Claude
const messages = [{
  role: "user",
  content: "Review daily portfolio and find trade opportunities"
}]

// 5. Claude responds with tool calls
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  system: systemPrompt,
  tools: tools,  // 6 tools defined
  messages: messages
})

// 6. Loop: Process tool calls until Claude stops
while (response.stop_reason === "tool_use") {
  // Extract tool calls from Claude's response
  const toolCalls = response.content
    .filter(b => b.type === "tool_use")
  
  // Execute each tool
  const toolResults = []
  for (const toolCall of toolCalls) {
    const result = await processTool(
      toolCall.name,
      toolCall.input
    )
    toolResults.push({
      type: "tool_result",
      tool_use_id: toolCall.id,
      content: JSON.stringify(result)
    })
  }
  
  // Send results back to Claude
  messages.push({
    role: "assistant",
    content: response.content  // Claude's tool calls
  })
  messages.push({
    role: "user",
    content: toolResults  // Tool execution results
  })
  
  // Claude responds again (possibly calling more tools)
  response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: tools,
    messages: messages
  })
}

// 7. Extract final response (no more tool calls)
const finalResponse = response.content
  .filter(b => b.type === "text")
  .map(b => b.text)
  .join("\n")

// 8. Save to file
fs.writeFileSync(
  "agent-data/suggestions.json",
  JSON.stringify({
    timestamp: new Date().toISOString(),
    analysis: finalResponse
  }, null, 2)
)
```

This is the **agentic loop**: Claude decides what tools to call, tools execute, Claude sees results and decides next action, repeat until Claude reaches a conclusion.

---

## Next: The Tools

The 6 tools are the "muscles" of your agent. They do actual work:
- Fetch real news data
- Screen real candidates
- Score real rankings
- Detect real bottlenecks

Let's deep dive into each tool next.
