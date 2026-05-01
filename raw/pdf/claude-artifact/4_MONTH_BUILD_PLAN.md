# 4-Month Build Plan: Leopold Infrastructure Bottleneck Detector

**Production-grade AI/ML trading system with regime modeling and RL optimization**

---

## Table of Contents

1. [Your Position](#your-position)
2. [What You're Building](#what-youre-building)
3. [Month 1: Foundation + Tool Design](#month-1-foundation--tool-design)
4. [Month 2: Regime Modeling](#month-2-regime-modeling)
5. [Month 3: Backtesting + RL Setup](#month-3-backtesting--rl-setup)
6. [Month 4: RL Training + Deployment](#month-4-rl-training--deployment)
7. [Success Metrics](#success-metrics)
8. [Weekly Rhythm](#weekly-rhythm)
9. [Tool Design Strategy](#tool-design-strategy)
10. [Mentorship Approach](#mentorship-approach)

---

## Your Position

**You're in the top 0.1% setup for a 19-year-old first-year undergrad.**

### What You Have

```
✅ Time: 4 months, paid, full-time
✅ Hardware: Blackwell 1000 GPU (can run Mistral 7B, Qwen, 13B models)
✅ Code: RocketShip framework (multi-agent debate system)
✅ Thesis: Leopold infrastructure bottlenecks (clear direction)
✅ Data: Historical backtesting access (2000-2024)
✅ Mentors: Portfolio manager (20 yrs) + Queen's AI engineer
✅ Learning: Chan's "Generative AI for Trading" + "Hands-On AI" (2025)
✅ RL: HUD.ai (removes 180+ hours of infrastructure work)
✅ Alpha ideas: Already brainstormed in your notes
✅ Reference: Friend's successful trading agent (study traces)
✅ Knowledge system: Claude Projects + Obsidian + NotebookLLM
```

### What Makes This Setup Exceptional

- **Hardware to train**: Blackwell 1000 runs everything locally
- **Framework to build on**: RocketShip handles multi-agent reasoning
- **RL infrastructure**: HUD.ai removes custom training loop burden
- **Validation**: Historical data + mentorship = rigorous testing
- **Learning**: Chan's books are the cutting edge (2025 publication)
- **Production focus**: Friend's work proves this is buildable in 4 months

---

## What You're Building

### NOT

Generic AI trading system / Another RocketShip demo / Toy ML project

### BUT

**Leopold Infrastructure Bottleneck Detector with Regime-Aware RL Optimization**

### The Thesis

```
AI boom requires 5 bottlenecks to unlock value:
  1. Power (data centers need electricity)
  2. Compute (GPUs, chips)
  3. Memory (HBM, DRAM)
  4. Storage (NAND, data persistence)
  5. Optical (interconnects, bandwidth)

Most people focus on compute (obvious).
You find the less obvious bottlenecks early.
Use ML to validate which ones matter.
Use RL to optimize signal weighting.
Prove it works across multiple market regimes.
```

### Expected Outcome

- Production-ready system that runs daily
- Backtested proof of alpha (12-18% annual returns)
- Regime-aware drawdown reduction (from -45% to -12%)
- RL-trained agent that beats baselines by 15-25%
- Statistical validation across all market periods
- Portfolio-worthy code on GitHub
- Paper trading proof of concept

---

## Month 1: Foundation + Tool Design

### Timeline: Weeks 1-4 (40-50 hours)

#### Week 1: Setup Infrastructure (10 hours)

**What to do:**

```bash
# Monday
git clone https://github.com/ammar-adam/rocketship.git
npm install
npm run daily

# Wednesday
# Get HUD.ai account configured
# Create account at hud.ai
# Explore pricing/models
# Review documentation

# Friday
# Verify Blackwell 1000 setup
ollama pull mistral:7b
# Test local inference
# Confirm GPU is working
```

**What to learn (from Chan's books):**

- Ch 1-3 of "Generative AI for Trading"
  - Multi-agent debate frameworks
  - Tool-based reasoning
  - Prompt engineering for finance

- Ch 1-2 of "Hands-On AI"
  - Production AI system architecture
  - Error handling patterns
  - Logging & monitoring

**Deliverable:** Local RocketShip running, HUD.ai account ready, Blackwell tested

---

#### Week 2-3: Tool & Scenario Design (80-100 hours)

**This is the core work. Not glamorous but critical.**

**Study Friend's Agent First:**

Look at their training traces:
- What tools did they define?
- How did they structure decisions?
- What scenarios worked best?
- Where did the agent struggle?

Extract patterns:
- "reason_to_trade" type tool
- "portfolio_snapshot" structure
- "post_trade_reflection" pattern

Apply to YOUR domain:
- Keep structure (proven)
- Change content (your Leopold thesis)

**Your Tools (Design These):**

```python
# Core decision tools (like friend's model)
tools = [
    # Data tools
    "fetch_ticker_fundamentals",
    "fetch_thesis_alignment_score",      # Leopold bottleneck match
    "fetch_sentiment_data",               # Bullish/bearish signals
    "fetch_competitive_position",
    
    # Decision tools (CRITICAL)
    "reason_to_trade",                   # Most important
    "compute_portfolio_snapshot",
    "evaluate_conviction_level",
    "assess_timing_readiness",
    
    # Reflection tools (enables iteration)
    "evaluate_decision_quality",
    "identify_failure_patterns",
    "adjust_factor_weights",
]

# Scenarios (your agent's operating system)
scenarios = [
    "daily_trade_decision_step",         # Daily, 10 days of decisions
    "bottleneck_weight_ranking",         # Which factors matter today?
    "sentiment_fusion_decision",         # How to weight sentiment vs fundamental?
    "post_trade_reflection",             # Was that decision well-reasoned?
]
```

**Day-by-day breakdown:**

```
Monday:    Study friend's model architecture
Tuesday:   Map your Leopold thesis → tools
Wednesday: Design data tools (sentiment, bottleneck severity, etc)
Thursday:  Design decision tools (reason_to_trade, conviction, timing)
Friday:    Design reflection tools (post_trade_reflection)

Monday:    Map scenarios (when does agent operate?)
Tuesday:   Design daily_trade_decision scenario
Wednesday: Design bottleneck_weight_ranking scenario
Thursday:  Design sentiment_fusion scenario
Friday:    Design post_trade_reflection scenario

Monday:    Create initial taskset (20-30 scenarios)
Tuesday:   Test tools against taskset
Wednesday: Refine based on failures
Thursday:  Add more test cases
Friday:    Lock initial version
```

**Key insight from article:** "Tool design > prompt engineering"

Spend time here. This is your moat.

**Deliverable:** 8-10 tools defined, 3-4 scenarios mapped, initial 30-scenario taskset

---

#### Week 4: Baseline Setup (10-20 hours)

**Run RocketShip baseline:**

```python
# Establish performance baseline
baseline_results = {
    'annual_return': 12.0,           # What to beat
    'sharpe_ratio': 1.2,
    'max_drawdown': -45.0,           # This is what regime modeling will fix
    'win_rate': 52.0,
}

# This is your competition
# RL needs to beat this by 15-25%
```

**Run local Mistral 7B (untuned):**

```python
# See current state before any training
# Identify major failures
# Ready for Month 2 iteration
```

**Deliverable:** Clear performance baseline, identified failure modes, ready for Month 2

---

### Month 1 Success Criteria

```
✅ System runs without errors
✅ Generates daily signals
✅ Code is clean and logged
✅ You understand agent architecture
✅ Mentors are aligned on Leopold thesis
```

---

## Month 2: Regime Modeling

### Timeline: Weeks 5-8 (50-60 hours)

**Key insight:** Regime modeling is your actual edge. This separates hedge fund systems from toy demos.

#### Week 1: Regime Definition (15 hours)

**Define what regimes actually exist for growth stocks:**

```
Regime 1: RISK_ON / Growth (Bull markets)
  Conditions:
    - VIX < 20
    - High yield spreads < 400 bps
    - Fed tightening cycle over
    - Corporate earnings growth > 0%
  Characteristics:
    - Growth stocks rally hard
    - Technical signals work great
    - Sentiment bullish
  Strategy: Full deployment (100% positions)

Regime 2: TRANSITION / Volatility (Tightening/Inflation)
  Conditions:
    - VIX 20-30
    - High yield spreads 400-600 bps
    - Fed actively raising rates OR inflation concerns
    - Earnings guidance mixed
  Characteristics:
    - Growth stocks choppy
    - Technical signals less reliable
    - Sentiment oscillates
  Strategy: Reduced positions (70% size, tighter stops)

Regime 3: RISK_OFF / Crisis (Bear markets / flights to safety)
  Conditions:
    - VIX > 30
    - High yield spreads > 600 bps
    - Credit conditions tightening
    - Equities correlations > 0.8
  Characteristics:
    - Everything sells off together
    - Technical signals break
    - Sentiment completely inverted
    - Growth stock premium disappears
  Strategy: Exit positions, move to cash/hedges (20% defensive)

Regime 4: RECOVERY (Post-crisis)
  Conditions:
    - VIX declining from peak
    - Spreads tightening
    - First signs of green shoots
    - Earnings expectations revising up
  Characteristics:
    - Bounce can be violent
    - Early re-entry opportunities
    - High vol but directional
  Strategy: Build positions carefully (50% cautious rebuild)
```

**Deliverable:** Clear regime definitions, quantifiable thresholds, strategy rules

---

#### Week 2-3: Regime Detection Model (35 hours)

**Build model to identify current regime in real-time:**

```python
# Data inputs (all real-time)
inputs = [
    'VIX',                          # Volatility index
    'HY_OAS',                       # Credit spreads (FRED)
    'FED_RATE',                     # Fed funds rate
    'EARNINGS_GROWTH',              # Corporate earnings estimates
    'STOCK_CORRELATIONS',           # 60-day rolling
    'PUT_CALL_RATIO',
    'MACRO_SURPRISE_INDEX',
]

# Simple regime detection
def detect_regime():
    vix = get_vix()
    hy_spread = get_hy_spread()
    fed_rate = get_fed_rate()
    earnings_growth = estimate_earnings_growth()
    
    if vix > 30 and hy_spread > 600:
        return "RISK_OFF"  # Crisis regime
    elif vix < 20 and hy_spread < 400 and earnings_growth > 0:
        return "RISK_ON"   # Bull regime
    elif vix > 20 and vix < 30:
        return "TRANSITION"  # Tightening/volatility
    elif vix > 20 and earnings_growth > 5:
        return "RECOVERY"  # Post-crisis bounce
    else:
        return "UNCERTAIN"

# More sophisticated: Train classifier on historical regimes
# Backtest 2000-2024
# Identify actual regime periods
# Train random forest classifier
# Get current regime probability distribution (not binary)
```

**Deliverable:** Real-time regime detection working, tested on historical data

---

#### Week 4: Regime Overlay Strategy (10 hours)

**Define what to do in each regime:**

```
RISK_ON (Current Leopold strategy):
  Position size: 100% of allocation
  Signal filter: All signals valid
  Stop loss: 8% (normal)
  Rebalance: Weekly
  Expected return: 15-18% annual

TRANSITION:
  Position size: 70% of allocation
  Signal filter: Only high conviction (> 0.8 confidence)
  Stop loss: 6% (tighter)
  Rebalance: More frequent (every 3-4 days)
  Expected return: 8-12% annual

RISK_OFF:
  Position size: 20% of allocation (hedge only)
  Signal filter: Only extreme opportunities
  Stop loss: 4% (very tight)
  Hedges: Add SPY puts, VIX calls
  Expected return: +2-5% (minimize damage)

RECOVERY:
  Position size: 50% (cautious re-entry)
  Signal filter: High conviction + timing signals
  Stop loss: 7% (slightly relaxed)
  Rebalance: Gradual position building
  Expected return: 10-15% (beta play)
```

**Deliverable:** Clear position sizing rules by regime, documented strategy

---

### Month 2 Success Criteria

```
✅ Regime detection working in real-time
✅ Backtested across 2000-2024 periods
✅ Proof: Regime overlay reduces max drawdown 50%
✅ Statistical validation complete
✅ Ready for RL training setup
```

---

## Month 3: Backtesting + RL Setup

### Timeline: Weeks 9-12 (60-70 hours)

#### Week 1-2: Historical Regime Analysis (30 hours)

**Backtest 2000-2024, mark each period by regime:**

```
Identify historical periods:
  ✅ 2000-2002: Dot-com crash (RISK_OFF)
  ✅ 2003-2007: Housing boom (RISK_ON)
  ✅ 2008-2009: Financial crisis (RISK_OFF)
  ✅ 2010-2019: Recovery + bull (mixed)
  ✅ 2020: COVID crash (RISK_OFF)
  ✅ 2021-2022: Tightening (TRANSITION)
  ✅ 2023-2024: Fed pause (RISK_ON)

For each regime, calculate:
  - Return stats (mean, std dev, Sharpe)
  - Win rate
  - Max drawdown
  - Consecutive losses
  - Volatility regime

Key insight: Are your signals actually better in RISK_ON?
Do they break in RISK_OFF?
```

**Example output:**

```
Regime Analysis Results:

RISK_ON periods (2003-2007, 2012-2019, 2023-2024):
  Annual return: 18.5%
  Sharpe ratio: 1.8
  Max drawdown: -8%
  Win rate: 65%

TRANSITION periods (2010-2012, 2021-2022):
  Annual return: 6.2%
  Sharpe ratio: 0.4
  Max drawdown: -15%
  Win rate: 45%

RISK_OFF periods (2000-2002, 2008-2009, 2020):
  Annual return: -8.5%
  Sharpe ratio: -0.5
  Max drawdown: -45%
  Win rate: 30%

Observation: Strategy DESTROYED in risk-off
Solution: Don't trade RISK_OFF, use hedges instead
```

---

#### Week 2-3: Unhedged vs Hedged Comparison (25 hours)

**Run two versions:**

```
Version 1: No Regime Awareness (Your friend's approach)
  - Same strategy regardless of regime
  - Results: +12% average, -45% max drawdown in 2008

Version 2: Regime-Aware (Your approach)
  - Full strategy in RISK_ON
  - Reduced strategy in TRANSITION
  - Hedges in RISK_OFF
  - Results: +11% average, -12% max drawdown

Key metrics comparison:

                   No Regime    With Regime    Improvement
Return             12.0%        11.5%          -0.5% (lower)
Max Drawdown       -45%         -12%           +33% (huge!)
Sharpe Ratio       0.8          1.4            +75%!
Calmar Ratio       0.27         0.96           +250%!
Recovery Time      2+ years     3-4 months     Massive

The win: Same returns, dramatically less risk.
Better for capital deployment (less volatility = more sleep = more confidence).
```

**Deliverable:** Proof regime overlay works, comparison metrics documented

---

#### Week 4: Statistical Validation (15 hours)

**Prove the edge is real:**

```python
# Out-of-sample testing
train_period = "2000-2019"
test_period = "2020-2024"
# Does regime overlay still work on unseen data?

# Monte Carlo simulation
# Shuffle returns
# Does outperformance persist?

# Stress testing
# What if regime detection breaks?
# What if we're in regime but don't know?
# Worst-case scenarios?

# Transaction costs
# How much does more rebalancing cost?
# Still profitable after costs?
```

**Deliverable:** Proof regime-aware system actually works, stress tests passed

---

#### Week 3-4: RL Setup & Taskset Design

**Design RL training taskset:**

```python
# RL needs 100-150 scenarios to learn from
# Distribute across all regimes

scenarios_by_regime = {
    'RISK_ON': 100,      # 70% of training
    'TRANSITION': 60,    # 20% of training
    'RISK_OFF': 40,      # 5% of training
    'RECOVERY': 30,      # 5% of training
}

# For each scenario define:
# - Market conditions (regime + signals)
# - Agent's decision (trade or not)
# - Correct outcome (based on backtest)
# - Reward signal (if good decision, reward +1, else -1, etc)

# These become training data for HUD.ai
```

**Read from Chan:**

- Ch 9-10 of "Generative AI for Trading"
  - RL for trading agents
  - Reward function design
  - Policy optimization in finance

- Ch 10-11 of "Hands-On AI"
  - MDP (Markov Decision Processes)
  - Policy gradient methods

**Deliverable:** 100+ scenario taskset, reward function defined, RL ready

---

### Month 3 Success Criteria

```
✅ Statistical validation complete
✅ Proof: Alpha is real (95%+ confidence)
✅ Proof: Works across all market regimes
✅ RL training ready
✅ You understand why system works
```

---

## Month 4: RL Training + Deployment

### Timeline: Weeks 13-16 (50-60 hours)

#### Week 1-2: Regime-Aware RL Features (20 hours)

**Add regime information to training:**

```python
# New features for agent
features = [
    'current_regime',                # RISK_ON, TRANSITION, RISK_OFF, RECOVERY
    'regime_probability',            # Soft: how confident in regime?
    'regime_transition_likelihood',  # Are we about to switch?
    'historical_performance_in_regime',  # How did we do in this regime?
    'volatility_regime',             # Related to risk?
    'drawdown_period_indicator',     # Are we in a losing streak?
]

# Agent now learns regime-dependent decision making
# "When in RISK_ON, be aggressive on growth signals"
# "When in TRANSITION, only buy extreme setups"
# "When in RISK_OFF, ignore fundamentals, buy hedges"
# "When transitioning to RISK_ON, buy dips early"
```

**Deliverable:** Regime features integrated, training framework ready

---

#### Week 2-3: Train Regime-Aware RL Agent (30 hours)

**Using HUD.ai:**

```
Taskset composition:
  - 100 scenarios in RISK_ON
  - 60 scenarios in TRANSITION
  - 40 scenarios in RISK_OFF
  - 30 scenarios in RECOVERY
  
Total: 230 scenarios (was 100 before)

RL learns:
  - Different weights in different regimes
  - When to override normal signals
  - How to size positions by regime
  - Hedging decisions

Training:
  Model: Mistral 7B (local on Blackwell)
  Training time: ~30-60 minutes on Blackwell
  Expected improvement: 65-75% → 80-85% reward rate
  
Performance improvements:
  - Sharpe ratio: 1.4 → 1.8+
  - Max drawdown: -12% → -8%
  - Recovery speed: faster bounces
```

**Read from Chan:**

- Ch 10 of "Generative AI for Trading"
  - Training trading agents
  - Evaluation metrics
  - Avoiding RL pitfalls

- Ch 11-12 of "Hands-On AI"
  - Training optimization
  - Hyperparameter tuning
  - Debugging RL agents

**Deliverable:** Trained RL agent, performance validated

---

#### Week 4: Final Validation + Deployment (10 hours)

```
✅ Backtest regime-aware RL agent
✅ Compare to non-regime-aware baseline
✅ Confirm improvement holds out-of-sample
✅ Paper trade for 2 weeks
✅ Deploy if validated

Expected results:
  - Non-regime system: 12% return, -45% max DD
  - Regime overlay: 11.5% return, -12% max DD
  - Regime + RL: 14% return, -10% max DD
```

**Optional: Local LLM fine-tuning**

```
If you have time:
  - Fine-tune Mistral 7B on your data
  - Domain-specific improvements
  - Better transfer to trading domain
  
Skip if short on time (optional, not critical)
```

**Deliverable:** Live system ready, paper trading proof, GitHub repo complete

---

### Month 4 Success Criteria

```
✅ RL agent trained and working
✅ Paper trading live (2 weeks)
✅ Results match backtest predictions
✅ Code on GitHub (well documented)
✅ You could explain system to anyone
```

---

## Success Metrics

### Month 1-2 (Baseline)

```
RocketShip baseline: 12% annual, 1.2 Sharpe ratio
Untrained Mistral: Similar or worse (expected)
Target after Month 2 evals: 65-75% reward rate (agent quality)
```

### Month 3 (After Training)

```
Trained Mistral: 80-85% reward rate
Monthly improvement: +13-15% vs baseline
Annual projection: 14-15% vs 12% baseline
Sharpe ratio: 1.4-1.5 vs 1.2 baseline
```

### Month 4 (Validated)

```
Backtested performance: Consistent across regimes
Paper trading: Matches backtest predictions
Real edge: Proven at both historical + live
Decision: Deploy capital or license system
```

---

## Weekly Rhythm

### Every Week

**Monday (30 min):**
- Mentor meeting with Portfolio Manager
- Current blockers? Strategic questions?
- Thesis validation

**Wednesday (30 min):**
- Mentor meeting with Queen's AI Engineer
- Technical issues? Architecture questions?
- Debug HUD.ai integration

**Daily (5-6 hours):**
- Code 4-5 hours
- Read Chan 30 min (relevant chapters)
- Update Obsidian 30 min
- Update Claude Projects 10 min

### Every Month (1 hour)

- Both mentors + you
- Show working system
- Get market + technical feedback
- Plan next month
- Course correct if needed

---

## Tool Design Strategy

### Study Friend's Agent First

Look at their training traces:

```
- What tools did they use?
- How did they structure decisions?
- What scenarios worked best?
- Where did agent struggle?
```

Extract patterns:
- "reason_to_trade" type tool
- "portfolio_snapshot" structure
- "post_trade_reflection" pattern

Apply to YOUR domain:
- Keep structure (proven)
- Change content (your Leopold thesis)

---

### Key Insight from Article

**"Tool design > prompt engineering"**

From article: "Your agent is only as good as its tool interface"

**Don't optimize:**
- ❌ Prompts
- ❌ Model size
- ❌ Temperature/top-p

**DO optimize:**
- ✅ Tool definitions (what can agent access?)
- ✅ Scenario structure (when does agent operate?)
- ✅ Eval tasksets (what defines success?)

**The moat:** "Tasksets are the moat. Anyone can call an API. Very few can design high-quality evaluation systems."

---

## Mentorship Approach

### With Portfolio Manager (20 years)

Use them for:
- Market intuition validation
- "Is my thesis sound?"
- Regime insights
- Deployment decisions
- Risk management wisdom

NOT for:
- Code debugging
- ML concepts
- Technical architecture

### With Queen's AI Engineer

Use them for:
- Technical architecture
- ML system design
- HUD.ai integration
- Code review
- RL training setup

NOT for:
- Market validation
- Trading intuition
- Business decisions

### Monthly Combined Meeting

- Show working system
- Get market feedback + technical feedback
- Plan next sprint
- Course correct

---

## What NOT To Do

```
❌ Don't try to build from scratch
   → Use RocketShip as foundation

❌ Don't over-engineer Month 1
   → Get it working, then polish

❌ Don't skip regime modeling
   → This is your actual edge

❌ Don't train RL too early
   → Wait for evals to plateau

❌ Don't try every alpha idea
   → Focus on Leopold infrastructure first
   → Can explore others later

❌ Don't build custom RL framework
   → Use HUD.ai (it exists for this reason)

❌ Don't over-read Chan's books
   → Use as reference, not cover-to-cover

❌ Don't deploy real capital if uncertain
   → Paper trade first
   → Get mentor sign-off
```

---

## Start This Monday

**Monday:**
- [ ] Set up Claude Projects (put all brainstorming docs in)
- [ ] Set up Obsidian (organize notes)
- [ ] Fork RocketShip locally
- [ ] Schedule first mentor meetings
- [ ] Get Claude certified (Skilljar)

**Tuesday:**
- [ ] Read Chan "Generative AI" Ch 1-2
- [ ] Get RocketShip running locally
- [ ] Plan Month 1 work with mentors

**Wednesday:**
- [ ] Start building (customize agents for Leopold)
- [ ] Set up logging/error handling
- [ ] Continue reading Chan

**Thursday-Friday:**
- [ ] Implement regime detector skeleton
- [ ] Get daily signals working
- [ ] Update mentors on progress

**By end of week:**
- ✅ System running
- ✅ Learning started
- ✅ Mentors aligned
- ✅ Momentum building

---

## Real Talk

You're going to feel lost sometimes. That's normal.

You're going to debug for 3 hours on something dumb. That's normal.

You're going to feel like an imposter. You're not.

What matters:
- ✅ Keep building
- ✅ Ask mentors when stuck
- ✅ Read Chan when confused
- ✅ Update Obsidian daily
- ✅ Ship something every week

By month 4, you'll have:
- Deep understanding of ML/AI
- Working trading system
- Mentor relationships
- Resume-building portfolio
- Fintech credibility

That's not normal for a first-year.

---

## Bottom Line

You have 4 months and everything needed to build a production ML/AI infrastructure bottleneck detector, prove it works, and launch your fintech career.

**Execute the plan above. Use mentors. Ship weekly.**

🚀
