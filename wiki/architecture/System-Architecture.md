---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [Agilith-System-Architecture, Agent-Tools, Agilith-Investment-Philosophy]
status: active
tags: [architecture, agentic, loop, daily-flow, weekly-flow]
---

# System Architecture (Claude Agent)

## The Big Picture

### Traditional Portfolio Management
```
1. Read financial news
2. Check portfolio positions
3. Run screeners
4. Calculate scores
5. Decide on trades
6. Execute orders
7. Repeat daily
```
**Time:** 1-2 hours/day. **Errors:** High (human bias). **Bottleneck:** You.

### With Agent
```
1. Fetches news 24/7
2. Monitors positions live
3. Runs screeners continuously
4. Claude calculates weighted scores
5. Generates daily suggestions
6. You review in 5 minutes
7. You decide to execute or ignore
```
**Time:** 5 minutes/day. **Errors:** Low (systematic). **Bottleneck:** News quality.

---

## The Philosophy: Agentic Loop

**Agentic ≠ automated.** Claude decides which tools to call and in what order.

```
User Request
    ↓
Claude reads request + system prompt (portfolio thesis)
    ↓
Claude decides: "I need news data" → calls fetch_news
Claude decides: "I need screener candidates" → calls screen
    ↓
Tools execute, return data
    ↓
Claude analyzes: "Power news is bullish, compute supply is tight..."
    ↓
Claude decides: "Need to rank candidates" → calls rank_score
    ↓
Claude generates final suggestions with reasoning
    ↓
Suggestions saved to file
```

**Why better than static scoring:**
| Static Scoring | Agentic |
|----------------|---------|
| Fixed weights, ignores context | Context-aware, reasons about thesis |
| Can't handle novel situations | Can discover new opportunities |
| Mechanical | Explains its reasoning |
| Weights don't adapt | Flexible weighting per situation |

---

## System Prompt

```javascript
"You are a portfolio agent focused on AGI infrastructure bottlenecks.

Portfolio (concentrated):
- BE (Bloom Energy): Power generation
- CRWV (CoreWeave): GPU compute infrastructure
- LITE (Lumentum): Optical interconnects
- MU (Micron): Memory for AI systems
- SNDK (SanDisk): Storage for model weights
- SPY: Broad market hedge

Thesis (Leopold Aschenbrenner):
- AGI buildout requires massive compute infrastructure
- Creates bottlenecks: power, GPU, memory, storage, optical
- Your job: Find companies solving these bottlenecks
- Find new bottlenecks before obvious

Daily task:
1. Monitor news sentiment per bottleneck theme
2. Screen for new opportunities
3. Rank candidates by thesis-alignment + technicals
4. Suggest trades with conviction levels"
```

---

## Daily Flow (9:30 AM)

```
START: Market Open
    ↓
Agent spawns with system prompt
    ↓
Claude calls tools:
├─ fetch_portfolio_news("power") → [5 articles]
├─ fetch_portfolio_news("compute") → [5 articles]
├─ fetch_portfolio_news("memory") → [5 articles]
├─ fetch_portfolio_news("storage") → [5 articles]
└─ fetch_portfolio_news("optical") → [5 articles]
    ↓
Claude analyzes sentiment:
"Power: 2 bullish, 1 neutral → net bullish
 Compute: 4 bullish → strongly bullish
 Memory: 2 bullish, 2 neutral → slightly bullish
 Storage: 3 neutral → no signal
 Optical: 1 bullish → slightly bullish"
    ↓
Claude calls analyze_sentiment on top catalysts
    ↓
Claude calls detect_bottleneck_emergence
    ↓
Claude calls screen_candidates per theme
    ↓
Claude calls rank_and_score_candidates
    ↓
Claude generates final analysis
    ↓
Suggestions → ./agent-data/suggestions.json
END: ~20-30 seconds
```

---

## Weekly Flow (Friday 5 PM)

```
Claude calls screen_candidates (exclude_holdings=true) for all themes
    ↓
Returns top candidates per theme:
Power: [CEG, AEE, NEE, ...]
Compute: [RKLB, ORCL, DELL, ...]
Memory: [SK, TSM, HIMX, ...]
Storage: [WDC, KIOXIA, ...]
Optical: [AAOI, JDSU, VIAV, ...]
    ↓
Claude calls rank_and_score_candidates with all ~80 candidates
    ↓
Returns ranked list with composite scores
    ↓
Rankings → ./agent-data/weekly-ranks.json
END: ~40-50 seconds
```

---

## Why Concentrated Portfolios

Your portfolio: 6 positions (not 100+ diversified).

This means:
- Need **high-conviction ideas** (not "slightly bullish")
- Need **thesis alignment** (must fit infrastructure story)
- Need **emerging signals** (before they're priced in)

Traditional robo-advisors handle diversified portfolios. Your agent is built for concentrated, thesis-driven portfolios.

---

## Cost & Performance

| Cost | Amount |
|------|--------|
| Claude API | ~2,000 tokens/day = ~$0.006/day (~$2/month) |
| NewsAPI | Free tier (100/day) or $1/month |
| IBKR API | Included with account |
| **Total** | **~$3/month** |

**Performance:**
- Daily run: ~20-30 seconds
- Weekly run: ~40-50 seconds
- Real-time impact: None (runs async)

---

## Comparison to Alternatives

| | Manual | Robo-Advisor | Your Agent |
|--|--------|--------------|------------|
| Time/day | 1-2 hours | 0 | 5 minutes |
| Consistency | Low | High | High |
| Thesis-aware | You | No | Yes |
| Cost | $100+/hour (your time) | 0.25% AUM | $3/month |

---

## Under the Hood (Implementation)

```javascript
// 1. Load config
const CONFIG = {
  portfolio: { BE, CRWV, LITE, MU, SNDK, SPY },
  themes: [power, compute, memory, storage, optical],
  screener: { marketCapMin: $2B, ... }
}

// 2. Create Claude client
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// 3. Agentic loop
while (response.stop_reason === "tool_use") {
  const toolCalls = response.content.filter(b => b.type === "tool_use")
  const toolResults = toolCalls.map(async toolCall => ({
    type: "tool_result",
    tool_use_id: toolCall.id,
    content: JSON.stringify(await processTool(toolCall.name, toolCall.input))
  }))
  messages.push({ role: "assistant", content: response.content })
  messages.push({ role: "user", content: await Promise.all(toolResults) })
  response = await client.messages.create({ ... })
}
```

---

## Related

- [[Agilith-System-Architecture]] — Full system architecture (data + agents)
- [[Agent-Tools]] — 6 tools powering this agent
- [[Agilith-Investment-Philosophy]] — Investment thesis driving system design
