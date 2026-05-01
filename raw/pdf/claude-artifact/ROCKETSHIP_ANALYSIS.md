# RocketShip Analysis & Comparison with Your Custom Agent

## Executive Summary

**RocketShip** is a sophisticated, production-grade multi-agent stock discovery system built by Ammar Adam. It's substantially more mature than what I built from scratch.

**Recommendation**: **Yes, forking RocketShip is worth serious consideration.** However, it requires customization for your specific thesis. Let me break down why.

---

## What RocketShip Does

### Core Architecture
```
Vercel (Frontend)
    ↓
Next.js App (UI only)
    ↓ (thin proxy)
Fly.io (Backend)
    ↓
FastAPI Python Service
    ↓
Multi-Agent Debate
    ↓
Portfolio Allocation
```

### The Pipeline (15-20 minutes total)

**Step 1: Discovery (5-10 min)**
- Screens all 493 S&P 500 stocks (excluding FAANG)
- Computes 10 technical indicators per stock
- Calculates **RocketScore** (technical 60% + macro 40%)
- Ranks all stocks

**Step 2: Agent Analysis (3-5 min)**
- Selects 30 candidates:
  - Top 23 by RocketScore
  - Edge cases (5)
  - Best of worst (2)
- Runs 5 AI agents on each:
  - **Bull Agent**: Finds 2-6x upside opportunities with news citations
  - **Bear Agent**: Identifies risks and fatal flaws
  - **Regime Agent**: Macro/regime context
  - **Value Agent**: Valuation analysis + price targets
  - **Judge Agent**: Synthesizes all into ENTER/HOLD/EXIT verdict

**Step 3: Portfolio Allocation (<1 min)**
- Filters to ENTER verdicts only
- Allocates $10k portfolio weighted by RocketScore × Conviction
- Applies 5-20% position constraints

### Output
```
runs/{timestamp}/
├── rocket_scores.json         # All 493 stocks ranked
├── debate_selection.json      # 30 selected candidates
├── debate/
│   ├── AAPL.json             # Full debate transcript (5 agents)
│   ├── debate_summary.json   # All verdicts
├── final_buys.json           # Top BUY candidates
├── portfolio.json            # Optimized allocation
└── status.json               # Progress tracking
```

---

## RocketShip vs Your Custom Agent

### 1. Scope

| Aspect | Your Agent | RocketShip |
|--------|-----------|-----------|
| **Universe** | 6 holdings (your portfolio) | 493 S&P 500 stocks |
| **Selection** | Themes + screener criteria | Discovery engine + ranking |
| **Agent Count** | 1 (Claude) | 5 (Bull/Bear/Regime/Value/Judge) |
| **Debate** | Sequential analysis | Parallel multi-agent debate |
| **Output** | Trade suggestions (daily) | Full portfolio allocation (weekly) |

### 2. Architecture

| Aspect | Your Agent | RocketShip |
|--------|-----------|-----------|
| **Frontend** | None (CLI + JSON output) | Next.js web UI (Vercel) |
| **Backend** | Node.js (scheduler + agent) | FastAPI Python (compute-heavy) |
| **Deployment** | Local or cloud scheduler | Vercel + Fly.io (split stack) |
| **API Model** | Claude (Anthropic) | DeepSeek (open source LLM) |
| **Cost/Run** | ~$0.006 (news + Claude) | ~$0.04 (DeepSeek API) |

### 3. Features Comparison

#### Your Agent Has:
✅ **Thesis-driven**: Built around Leopold bottlenecks  
✅ **News sentiment**: Real NewsAPI integration with caching  
✅ **Customizable scoring**: Weights adjustable (30/25/25/20 default)  
✅ **Bottleneck detection**: Emerges next opportunities  
✅ **Lightweight**: ~1.5 KB of code total  
✅ **Daily automation**: Cron-based scheduling built-in  

#### RocketShip Has:
✅ **Web interface**: Modern UI with live progress  
✅ **Multi-agent debate**: 5 agents argue each stock (vs 1 agent)  
✅ **Full market screening**: All 493 S&P 500 stocks (not just themed)  
✅ **Portfolio allocation**: Automated position sizing  
✅ **Production-ready**: Deployed to Vercel + Fly.io  
✅ **Rich analysis**: Bull/Bear/Value/Regime/Judge perspectives  
✅ **Cost-efficient**: DeepSeek API much cheaper than Claude  
✅ **Error resilience**: Skip/timeout handling, fallback mechanisms  
✅ **Persistent storage**: Runs archived, searchable history  

---

## Hypothesis: Why Fork RocketShip for Your Use Case?

### The Opportunity

RocketShip does **generalized stock discovery** across S&P 500.
Your thesis is **specialized bottleneck investing** (power, compute, memory, storage, optical).

**Insight**: RocketShip's architecture is perfect for this. Instead of:
- Bull/Bear/Regime/Value/Judge (generic perspectives)

You could use:
- **Bull Agent**: "How does this accelerate AGI buildout?"
- **Bear Agent**: "What kills this infrastructure play?"
- **Bottleneck Agent**: "Is this solving a critical constraint?"
- **Structural Agent**: "Is this a structural or cyclical opportunity?"
- **Judge Agent**: "Leopold thesis fit? Buy/hold/exit?"

### What Needs Customization

```
RocketShip (Generic)          Your Thesis (Specialized)
├─ 493 stocks                 └─ 30-50 infrastructure plays
├─ Generic agents (5)         └─ Bottleneck-aligned agents
├─ RocketScore (tech/macro)   └─ Bottleneck score
├─ $10k portfolio             └─ Your position weights
├─ NewsAPI general news       └─ Infrastructure-specific news
└─ ENTER/HOLD/EXIT           └─ ACCUMULATE/HOLD/REDUCE/EXIT
```

**Customization Effort**: Moderate (40-60 hours)
- Modify agent prompts (5 hours)
- Change scoring algorithm (10 hours)
- Adjust universe to infrastructure stocks (10 hours)
- Customize debate selection logic (10 hours)
- Integrate your screener (10 hours)
- Test & iterate (5 hours)

---

## Head-to-Head Comparison

### Your Agent
**Strengths**:
- ✅ Lightweight (easy to understand + modify)
- ✅ Thesis-driven from the ground up
- ✅ Lower cost (~$0.006/run vs ~$0.04)
- ✅ Built for your specific use case
- ✅ I provided comprehensive documentation

**Weaknesses**:
- ❌ No web UI (CLI/JSON only)
- ❌ Single agent (vs multi-agent debate)
- ❌ Only monitors 6 positions (vs full market)
- ❌ Limited deployment infrastructure
- ❌ No persistent run history/analytics

### RocketShip
**Strengths**:
- ✅ Production-grade UI (web interface)
- ✅ Multi-agent debate (richer analysis)
- ✅ Full market coverage (493 stocks)
- ✅ Proven deployment (Vercel + Fly.io)
- ✅ Modular architecture (easy to fork)
- ✅ Run history & analytics
- ✅ Error handling (skip stocks, timeouts)
- ✅ Lower API costs (DeepSeek)

**Weaknesses**:
- ❌ Generic agents (need customization for thesis)
- ❌ Not built for concentrated portfolios
- ❌ Complex codebase (~5,000 lines)
- ❌ Requires Python + JavaScript knowledge
- ❌ Steeper learning curve

---

## The Customization Path

### Option A: Enhance Your Agent
```
Your current system + improvements:
├─ Add web UI (Streamlit or React)
├─ Add multi-agent debate (Claude + tools)
├─ Expand to 50 infrastructure stocks
├─ Add portfolio optimization
└─ Deploy to Vercel + Fly.io

Effort: 80-100 hours
Result: Your system, scaled
```

### Option B: Fork RocketShip (Recommended)
```
RocketShip as foundation:
├─ Keep architecture (Vercel + Fly.io)
├─ Keep deployment (already proven)
├─ Modify agents (Leopold thesis focus)
├─ Customize scoring (bottleneck-aligned)
├─ Adjust universe (infrastructure stocks)
└─ Integrate your screener

Effort: 40-60 hours
Result: RocketShip for bottleneck investing
```

### Option C: Hybrid Approach
```
Your agent for daily monitoring:
├─ Daily news + sentiment (fast, cheap)
├─ Quick suggestions (5-10 min)
├─ Theme-specific focus

+ Weekly RocketShip runs:
├─ Forked for infrastructure thesis
├─ Full market debate analysis
├─ Portfolio allocation
├─ Generate investment ideas

Effort: 60-80 hours total
Result: Best of both worlds
```

---

## Technical Customization Guide

### 1. Agent Customization (Highest Impact)

**Current RocketShip agents**:
```python
# In src/agents.py
class BullAgent(Agent):  # Generic upside analysis
class BearAgent(Agent):  # Generic risk analysis
class RegimeAgent(Agent)  # Macro regime
class ValueAgent(Agent)   # Valuation
class JudgeAgent(Agent)   # Synthesis
```

**Your custom agents**:
```python
class BottleneckBullAgent(Agent):
    """Analyze how stock solves AGI infrastructure bottleneck"""
    
class BottleneckBearAgent(Agent):
    """What breaks this infrastructure solution?"""
    
class LeopoldAgent(Agent):
    """How does this fit situational awareness thesis?"""
    
class StructuralAgent(Agent):
    """Is this structural (10+ years) or cyclical (1-2 years)?"""
    
class JudgeAgent(Agent):
    """Synthesis with Leopold framework"""
```

**System Prompts**:
```python
BULL_PROMPT = """
You are analyzing {ticker} for AGI infrastructure buildout.

Leopold Aschenbrenner identifies critical bottlenecks:
- Power generation (data center demand > supply)
- GPU availability (compute cluster buildout)
- Memory bandwidth (HBM, GDDR6X constraints)
- Data storage (model weights, training data)
- Optical interconnects (data center interconnects)

Analyze:
1. Which bottleneck does {ticker} address?
2. What is the addressable market (2024-2027)?
3. What could make this 2-6x opportunity?
4. News/catalysts supporting this thesis?

Cite sources. Be specific. Avoid generic analysis.
"""
```

### 2. Scoring Customization

**Current RocketScore**:
```python
rocket_score = 0.6 * technical + 0.4 * macro
```

**Your BottleneckScore**:
```python
bottleneck_score = (
    0.4 * technical +              # Chart setup
    0.3 * bottleneck_fit +         # Solves critical constraint
    0.2 * structural_growth +      # Long-term demand
    0.1 * catalyst_pipeline        # Near-term news
)
```

### 3. Universe Customization

**Current RocketShip**:
```python
# Screens all 493 S&P 500 stocks
stocks = get_sp500_universe()
```

**Your infrastructure universe**:
```python
INFRASTRUCTURE_UNIVERSE = {
    "power": ["BE", "CEG", "AEE", "NEE", ...],
    "compute": ["CRWV", "NVDA", "RKLB", "ORCL", ...],
    "memory": ["MU", "SK", "TSM", "HIMX", ...],
    "storage": ["SNDK", "WDC", "KIOXIA", ...],
    "optical": ["LITE", "AAOI", "JDSU", "VIAV", ...],
    "cooling": ["LIAN", "CRWV", ...],
    "packaging": ["TSM", "AAPL", ...],
}

# Filter S&P 500 to infrastructure plays
stocks = filter_universe(infrastructure_universe)
```

### 4. Debate Selection Logic

**Current RocketShip**:
```python
# Select 30: top 23 + edge 5 + worst 2
selection = top_n(scores, 23) + edge_cases(5) + bottom_edge(2)
```

**Your customization**:
```python
# Select 30: top per theme
selection = {}
for theme in ["power", "compute", "memory", "storage", "optical"]:
    stocks_in_theme = filter_by_theme(stocks, theme)
    selection[theme] = top_n(stocks_in_theme, 6)  # 6 × 5 = 30 total

# Plus emerging bottleneck candidates
selection["emerging"] = bottleneck_emergence_detection()
```

### 5. Integration with Your Screener

**Your TradingView screener criteria**:
```python
# Current RocketShip uses yfinance only

# Add your custom scoring:
SCREENER_CRITERIA = {
    "market_cap_min": 2_000_000_000,      # $2B+
    "perf_ytd": 0,                         # YTD > 0%
    "price_volume_1m": 200_000_000,       # $200M+
    "beta_min": 1.0,
    "sma_criteria": {...},
    "high_below_52w": (0, 5),             # Within 5% of high
    "new_high_52w": True,
    "adr": 0.02                            # ADR > 2%
}

# Filter universe by screener
universe = yfinance_filter(universe, SCREENER_CRITERIA)
```

---

## Implementation Roadmap (Fork RocketShip)

### Phase 1: Setup & Understanding (Week 1)
- [ ] Fork RocketShip repo
- [ ] Review codebase structure
- [ ] Understand agent framework
- [ ] Test local deployment
- [ ] Read deployment docs

### Phase 2: Core Customization (Weeks 2-3)
- [ ] Modify agent prompts (Leopold thesis)
- [ ] Create BottleneckScore algorithm
- [ ] Filter universe to infrastructure stocks
- [ ] Test agent outputs locally

### Phase 3: Integration (Week 4)
- [ ] Integrate your TradingView screener
- [ ] Customize debate selection logic
- [ ] Add bottleneck detection agents
- [ ] Test full pipeline locally

### Phase 4: Deployment (Week 5)
- [ ] Deploy backend to Fly.io
- [ ] Deploy frontend to Vercel
- [ ] Test end-to-end
- [ ] Monitor for 1 week
- [ ] Iterate based on results

### Phase 5: Optimization (Ongoing)
- [ ] Track accuracy of debate verdicts
- [ ] Refine agent prompts based on results
- [ ] Adjust scoring weights
- [ ] Add features as needed

---

## Code Changes Required (Overview)

### Backend Changes
```python
# src/agents.py
✏️ Modify 5 agent classes with bottleneck-focused prompts

# src/rocket_score.py
✏️ Create BottleneckScore instead of RocketScore

# src/discovery.py
✏️ Filter universe to infrastructure stocks

# src/agents.py
✏️ Adjust debate selection to pick 30 by theme (not by ranking)

# Add: src/bottleneck_detection.py
✨ New module for emerging bottleneck analysis
```

### Frontend Changes (Minimal)
```typescript
// frontend/src/components/Results.tsx
✏️ Minor UI tweaks to show bottleneck info

// Keep most UI as-is (already great)
```

---

## Cost Comparison

### Your Agent (Standalone)
- Claude API: $0.006/run
- NewsAPI: Free tier (100/day) or $1/month
- **Total**: ~$3/month

### RocketShip (Standalone)
- DeepSeek API: $0.04/run (~3 runs/week)
- Server cost: Free tier Fly.io + Vercel
- **Total**: ~$5/month + free hosting

### Hybrid (Your Agent + RocketShip)
- Your agent daily: $0.006/day
- RocketShip weekly: $0.04/week
- Hosting: ~$0
- **Total**: ~$5/month

---

## Decision Matrix

| Factor | Your Agent | RocketShip | Fork RocketShip |
|--------|-----------|-----------|-----------------|
| **Time to first signal** | 5 min | 15-20 min | 15-20 min |
| **UI/UX** | CLI/JSON | Web UI | Web UI |
| **Customization effort** | None | High | Moderate |
| **Thesis alignment** | High | Low | High (after fork) |
| **Multi-agent debate** | No | Yes | Yes |
| **Market coverage** | 6 holdings | 493 stocks | 30-50 infrastructure |
| **Cost** | $3/month | $5/month | $5/month |
| **Learning curve** | Low | Medium | Medium |
| **Deployment** | Local/Cloud | Vercel+Fly | Vercel+Fly |

---

## My Recommendation

### For You: Hybrid Approach

**Keep your agent** for:
- ✅ Daily monitoring (quick, cheap, thesis-focused)
- ✅ Real-time news sentiment tracking
- ✅ Daily suggestions (5-min review)

**Fork RocketShip** for:
- ✅ Weekly deep-dive analysis
- ✅ Multi-agent debate (richer analysis)
- ✅ Full infrastructure universe screening
- ✅ Portfolio optimization
- ✅ Web UI (better for stakeholders)

**How they complement**:
```
Your Agent (Daily)           RocketShip (Weekly)
├─ News sentiment            ├─ Full debate
├─ Theme tracking            ├─ All infrastructure stocks
├─ Quick signals             ├─ Portfolio allocation
└─ Daily suggestions         └─ Optimization
      ↓                             ↓
      └───────→ Decision Log ←──────┘
                (what to buy/hold/exit)
```

### Why Fork RocketShip Works

1. **Foundation is proven**: RocketShip is deployed, handles errors, scales
2. **Architecture is sound**: Vercel + Fly.io is the right stack
3. **Multi-agent debate is superior**: 5 agents > 1 agent
4. **Customization is straightforward**: Agent prompts + scoring
5. **Cost is low**: DeepSeek much cheaper than OpenAI
6. **Web UI is needed**: For serious execution, you need visibility

---

## Next Steps If You Fork

### Step 1: Fork & Setup (Today)
```bash
git clone https://github.com/ammar-adam/rocketship.git
cd rocketship
# Follow QUICKSTART.md for local setup
```

### Step 2: Understand Codebase (This Week)
- Read `src/agents.py` (understand agent framework)
- Read `src/rocket_score.py` (understand scoring)
- Read `backend/README_DEPLOY.md` (understand deployment)

### Step 3: Create Custom Agents (Next Week)
- Modify 5 agent prompts for Leopold thesis
- Test locally
- Measure quality of outputs

### Step 4: Customize Scoring (Week After)
- Create BottleneckScore
- Test on your portfolio holdings
- Iterate based on results

### Step 5: Deploy (Week 5)
- Follow deployment guide
- Monitor results
- Refine based on real market performance

---

## The Reality Check

**RocketShip is professional code**. It's not perfect, but it:
- ✅ Works
- ✅ Scales
- ✅ Handles errors
- ✅ Is maintainable
- ✅ Is deployed and proven

**My custom system is elegant documentation** of concepts. It:
- ✅ Teaches you how it works
- ✅ Is fully customizable
- ✅ Is lightweight
- ✅ Is thesis-focused
- ❌ Lacks web UI
- ❌ Lacks multi-agent debate
- ❌ Lacks production deployment infrastructure

**Combining them** = Best of both worlds.

---

## Final Verdict

**Should you fork RocketShip?**

**Yes, if**:
- You want a web interface
- You want multi-agent debate
- You're willing to spend 40-60 hours customizing
- You want to scale beyond 6 positions
- You want professional deployment

**No, if**:
- You want something working today (my agent is ready now)
- You want minimal complexity
- You prefer CLI/JSON output
- Your thesis is very different from infrastructure

**My recommendation**: **Do both**.
1. Deploy my agent now (5 min setup)
2. Fork RocketShip in parallel (1-2 hour setup)
3. Customize RocketShip over 4-5 weeks
4. Run both in production (your daily agent + RocketShip weekly)
5. Compare results after 4 weeks

The cost is $5/month. The time is 40-60 hours. The upside is a professional-grade portfolio analysis system.

Worth it? **Absolutely.**

---

## Resources

- **RocketShip Repo**: https://github.com/ammar-adam/rocketship
- **QUICKSTART.md**: Deployment guide
- **DEEPSEEK API**: https://deepseek.com (cheap LLM)
- **Fly.io Docs**: https://fly.io/docs/
- **Vercel Docs**: https://vercel.com/docs

Go fork it. Make it yours. 🚀
