---
date_created: 2026-05-01
date_updated: 2026-05-02
source_count: 2
source_files: [raw/books/GenerativeAIForTradingChan.pdf, RocketShip GitHub]
related_pages: [Agilith-System-Architecture, 4-Month-Build-Plan, RocketShip-Decision, Failure-Patterns, Chan-Chapter4-8-Generative-Models, Chan-Agilith-Integration, RL-Training-Setup, Regime-modeling]
status: active
tags: [architecture, multi-agent, debate, rocketship, framework, GenAI, generative-models, VAE, GAN, WGAN]
---

# RocketShip Framework

## Source

[ammar-adam/rocketship](https://github.com/ammar-adam/rocketship) — Production-grade multi-agent stock discovery system built by Ammar Adam.

**Status:** Critical foundational decision. Fork, don't build from scratch.

---

## The Decision: Fork vs Build

**Decision:** Fork RocketShip for Month 1 of the 4-month build plan.

**Why not build from scratch:**
- Custom agent loop = 100-150 hours of infrastructure work
- Reinventing wheel when proven architecture already exists
- Maintain it forever (no community, no upstream fixes)
- Takes time away from domain logic (Leopold thesis)

**Why not use alternatives:**

| Alternative | Problem |
|------------|---------|
| LangChain / AgentKit | Overkill for trading, abstracts away understanding |
| Trading bots (MetaTrader) | Can't do LLM reasoning, proprietary, expensive |
| Hard-coded if-then | Can't adapt, can't learn, fragile to regime changes |

---

## Why RocketShip Is Right

Five reasons:

1. **Time efficiency:** 100-150 hours saved. Focus on domain logic.
2. **Proven architecture:** Tested by other traders. Solid agentic loop.
3. **Maintenance:** Open source. Community support. Upstream bug fixes.
4. **Scalability:** Designed for Month 3-4 RL training integration.
5. **HUD.ai fit:** Natural fit for RL optimization phase. Not forcing incompatible architectures.

---

## Architecture

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

**Key insight:** Frontend is thin. Backend is where the reasoning happens.

---

## Pipeline (15-20 minutes)

### Step 1: Discovery (5-10 min)
- Screens all 493 S&P 500 stocks (excluding FAANG)
- Computes 10 technical indicators per stock
- Calculates RocketScore (technical 60% + macro 40%)
- Ranks all stocks

### Step 2: Agent Analysis (3-5 min)
Selects 30 candidates:
- Top 23 by RocketScore
- Edge cases (5)
- Best of worst (2)

Runs 5 AI agents on each:
- **Bull Agent:** finds 2-6x upside with news citations
- **Bear Agent:** identifies risks and fatal flaws
- **Regime Agent:** macro/regime context
- **Value Agent:** valuation + price targets
- **Judge Agent:** ENTER/HOLD/EXIT verdict

### Step 3: Portfolio Allocation (<1 min)
- Filters to ENTER verdicts only
- Allocates $10k portfolio weighted by RocketScore × Conviction
- Applies 5-20% position constraints

---

## The 10 Reasoning Tools

These are the tools Claude calls during the reasoning loop. Distinct from the 6 execution tools — this is the reasoning layer above execution.

### 1. fetch_thesis_alignment

**What it does:** Checks if current market conditions align with the Leopold thesis.

**Input:** Current market conditions (VIX, spreads, sector performance, news flow)

**Output:**
```python
{
  "alignment_score": 0.85,  # 0-1
  "strongest_bottleneck": "power",
  "weakest_bottleneck": "optical",
  "thesis_valid": true,
  "key_signals": ["grid capacity tightening", "GPU supply constrained"]
}
```

**Why it matters:** Before making any trade, Claude checks: is the market in a state where the Leopold thesis is relevant?

---

### 2. fetch_sentiment_signals

**What it does:** Gathers sentiment across media, social, and technical sources.

**Input:** Theme or ticker

**Output:**
```python
{
  "media_sentiment": "bullish",
  "social_sentiment": "neutral",
  "technical_sentiment": "bullish",
  "aggregate": "bullish",
  "key_drivers": ["infrastructure spending", "policy tailwinds"],
  "key_headwinds": ["valuation stretched", "rate sensitivity"]
}
```

---

### 3. compute_bottleneck_severity

**What it does:** Quantifies how severe the supply/demand imbalance is for each bottleneck.

**Input:** Bottleneck type (power/compute/memory/storage/optical)

**Output:**
```python
{
  "bottleneck": "power",
  "severity": "critical",  # mild/moderate/critical/severe
  "supply_demand_gap": "widening",
  "timeline": "Q3 2026",
  "price_implication": "bullish for generation plays",
  "affected_sectors": ["utilities", "infrastructure"]
}
```

**Key insight:** Different bottlenecks are severe at different times. This tool tracks which one matters most.

---

### 4. estimate_market_timing

**What it does:** Produces entry/exit confidence signals based on technicals and regime.

**Input:** Portfolio positions, current regime, technical indicators

**Output:**
```python
{
  "entry_confidence": 0.72,
  "exit_confidence": 0.81,
  "best_entries": ["BE", "CRWV"],
  "best_exits": ["SNDK"],
  "timing_signals": {
    "ADX": "strong trend",
    "Hurst": "trending not mean-reverting",
    "regime": "RISK_ON"
  }
}
```

---

### 5. reason_to_trade

**What it does:** Claude's final decision engine. Takes all gathered signals and produces a recommendation.

**Input:** All signals from previous tool calls

**Output:**
```python
{
  "decision": "BUY",
  "ticker": "CEG",
  "side": "long",
  "size": "2%",
  "thesis_fit": "high",  # high/medium/low
  "reasoning": "Power bottleneck intensifying. CEG nuclear exposure fits. Technical breakout confirmed.",
  "conviction": 0.78
}
```

---

### 6. compute_portfolio_snapshot

**What it does:** Reads current portfolio state before making new decisions.

**Input:** None (reads current state)

**Output:**
```python
{
  "positions": {
    "BE": {"size": 0.15, "pnl": 0.12, "regime_exposure": "overweight"},
    "CRWV": {"size": 0.18, "pnl": 0.08, "regime_exposure": "neutral"},
    "LITE": {"size": 0.10, "pnl": -0.03, "regime_exposure": "underweight"},
    "MU": {"size": 0.15, "pnl": 0.05, "regime_exposure": "neutral"},
    "SNDK": {"size": 0.12, "pnl": 0.02, "regime_exposure": "neutral"},
    "SPY": {"size": 0.30, "pnl": 0.04, "regime_exposure": "hedge"}
  },
  "total_exposure": 1.0,
  "cash": 0.0,
  "regime": "RISK_ON"
}
```

---

### 7. evaluate_conviction_level

**What it does:** Quantifies confidence that a decision is correct.

**Input:** All reasoning so far

**Output:**
```python
{
  "conviction_score": 82,  # 0-100
  "level": "HIGH",
  "signals_aligned": 4,
  "signals_diverging": 1,
  "risk_factors": ["VIX rising", "position already large"],
  "recommendation": "Execute if thesis confirmed"
}
```

**Conviction thresholds:**
- 80+ = HIGH (execute)
- 50-79 = MEDIUM (consider)
- <50 = LOW (skip)

---

### 8. post_trade_reflection

**What it does:** After each trade, records whether it was wise and what would change.

**Input:** Trade that was just executed

**Output:**
```python
{
  "trade_id": "BUY_BE_2026-04-15",
  "thesis_correct": true,
  "timing_correct": false,
  "regime_assumption": "RISK_ON but was TRANSITION",
  "learnings": [
    "VIX was rising but I ignored it",
    "Should have checked regime before entry"
  ],
  "thesis_update": "Add VIX check to entry conditions"
}
```

---

### 9. identify_failure_patterns

**What it does:** Scans trade history for recurring mistake patterns.

**Input:** Trade history

**Output:**
```python
{
  "patterns": [
    {
      "pattern_type": "regime_failure",
      "frequency": "3 of last 5 RISK_OFF trades",
      "description": "Using same signals during RISK_OFF as RISK_ON",
      "recommendation": "Require 8/10 conviction during RISK_OFF before entering"
    },
    {
      "pattern_type": "timing_failure",
      "frequency": "2 of last 5 momentum trades",
      "description": "Entering too early after breakout",
      "recommendation": "Wait for VWAP retest confirmation"
    }
  ]
}
```

---

### 10. adjust_factor_weights

**What it does:** Dynamically adjusts how much each factor matters based on regime and signal quality.

**Input:** Current regime, recent signal quality

**Output:**
```python
{
  "regime": "RISK_ON",
  "adjusted_weights": {
    "technical": 0.35,
    "momentum": 0.30,
    "sentiment": 0.20,
    "catalyst": 0.15
  },
  "rationale": "RISK_ON: technical and momentum matter most. Sentiment less important."
}
```

**Regime-conditional weights:**

| Regime | Technical | Momentum | Sentiment | Catalyst |
|--------|----------|---------|-----------|---------|
| RISK_ON | 35% | 30% | 20% | 15% |
| TRANSITION | 25% | 25% | 30% | 20% |
| RISK_OFF | 20% | 15% | 35% | 30% |
| RECOVERY | 30% | 25% | 25% | 20% |

---

## Month 1: Fork and Customize (40-50 hours)

### Week 1-2: Fork and Understand
- Clone RocketShip from GitHub
- Read codebase (understand agentic loop)
- Review tool interface
- Understand reasoning prompt structure

### Week 3-4: Tool Design and Scenario Build
- Define each of the 10 tools (signatures, inputs, outputs)
- Implement tools using real market data APIs
- Create 30 test scenarios:
  - Different market regimes
  - Different portfolio states
  - Different sentiment signals
  - Edge cases

### DELIVERABLE: RocketShip-based system running with evals
- Fork working locally
- Tools integrated
- 30 scenarios created
- Baseline evals: 40-60% win rate
- Claude explains reasoning

---

## Month 2: Regime Modeling (50-60 hours)

- Extend tools to be regime-aware
- In RISK_ON: Aggressive, no stops
- In RISK_OFF: Conservative, tight stops
- In RECOVERY: Rebuilding positions
- Backtest 2000-2024 with regime logic

### DELIVERABLE: Regime-aware improvement
- 4 regimes implemented
- Backtests: max drawdown -45% → -12%
- Sharpe: 0.8 → 1.4

---

## Month 3: Backtesting and RL Setup (60-70 hours)

- Full backtest 2000-2024
- Capture 100k+ scenarios
- Design reward function for HUD.ai
- Create 230-scenario RL training set

### DELIVERABLE: RL training data ready
- 100k+ scenarios captured
- Alpha proved (95%+ confidence)
- Reward function defined

---

## Month 4: RL Training and Deploy (50-60 hours)

- Train Mistral 7B on RocketShip decisions
- Replace Claude calls with Mistral (cheaper, faster)
- Paper trade 2 weeks with trained model
- Measure: 14% return, -10% max DD, 1.8+ Sharpe

### DELIVERABLE: Live system
- Performance held or improved
- Code on GitHub
- Writeup complete

---

## Limitations and Mitigations

| Limitation | Mitigation |
|-----------|-----------|
| Learning curve (not a tutorial) | Week 1-2: read codebase deeply. Ernest Chan's books cover agentic patterns. |
| Not a complete trading system | IBKR has Python API. Backtesting is standard. RocketShip handles reasoning; you handle infrastructure. |
| Claude API costs for backtesting | Month 1-2: use expensive evals. Month 3: batch API calls. Month 4: train own model (Mistral 7B via HUD.ai). |
| Latency (1-5 seconds) | Not an issue. Trading daily/weekly, not microsecond-scale. |
| Non-deterministic (temp > 0) | Feature for robustness testing. Backtest with multiple runs. Train RL to reduce variance. |

---

## Custom Scoring: RocketScore vs BottleneckScore

**Generic RocketScore:**
```
rocket_score = 0.6 × technical + 0.4 × macro
```

**BottleneckScore (custom):**
```
bottleneck_score = (
    0.4 × technical +      # Chart setup
    0.3 × bottleneck_fit +  # Solves critical constraint
    0.2 × structural +      # Long-term demand
    0.1 × catalyst         # Near-term news
)
```

---

## Integration with Domain Wiki

When building the wiki, RocketShip appears in:

- `wiki/architecture/`: RocketShip-fork.md, tool-design.md, agent-loop.md, scenario-framework.md
- `wiki/decisions/`: 2026-04-20_fork-rocketship-decision.md
- `wiki/_meta/`: Listed as critical source dependency

---

## GenAI Model Connections

From [[Chan-Chapter4-8-Generative-Models]]:

| RocketShip Tool | GenAI Application | Chan Reference |
|----------------|-------------------|----------------|
| **fetch_thesis_alignment** | RAG retrieval (Ch4): semantic search for Leopold thesis alignment | Ch4 RAG pattern |
| **compute_bottleneck_severity** | VAE anomaly detection: high reconstruction error → supply/demand imbalance | Ch6 VAE |
| **estimate_market_timing** | Flow density estimation: P(r_t \| regime) for timing confidence | Ch7 Flow models |
| **post_trade_reflection** | CAI metalabeling: ML predicts PoP of own decisions | Ch3 CAI |
| **identify_failure_patterns** | WGAN synthetic failure scenarios: generate diverse failure modes for RL training | Ch8 WGAN |
| **adjust_factor_weights** | CPO regime adaptation: conditional portfolio optimization by regime | Ch3 CPO |

### Synthetic Data Pipeline

```
Real bottleneck data → Train VAE/GAN → Generate synthetic scenarios
    ↓
RL Training (100K+ scenarios) → RL agent
    ↓
post_trade_reflection → identify_failure_patterns
```

### Bottleneck → Regime Mapping

From [[Chan-Agilith-Integration]]:
- Power (BE) constraint → RISK_ON
- Compute (CRWV) supply catching up → TRANSITION
- Memory (MU) normalization → RECOVERY

### HMM vs GMM Contradiction (from [[Chan-Chapter4-8-Generative-Models]])

Ch3: "HMM seductive but fictional" → Hidden states not directly useful.
Ch6: Two Sigma uses GMM for regime detection → Works with observable indicators.

**Resolution:** Use GMM with observable indicators for [[Regime-modeling]], not pure HMM hidden states.

---

## Key Metrics

| Month | Win Rate / Return | Max Drawdown | Sharpe |
|-------|-----------------|-------------|--------|
| Baseline | 40-60% (evals) | -45% | 0.8 |
| Month 2 | — | -12% target | 1.4 target |
| Month 4 | 14% return | -10% target | 1.8 target |

---

## Related

- [[RocketShip-Decision]] — The decision rationale: 5 reasons to fork, why not alternatives
- [[4-Month-Build-Plan]] — Month-by-month implementation
- [[Agilith-System-Architecture]] — Existing single-agent architecture this extends
- [[Failure-Patterns]] — The post_trade_reflection and identify_failure_patterns tools
- [[Chan-Chapter4-8-Generative-Models]] — Deep generative models (VAE, Flow, GAN) for scenario generation
- [[Chan-Agilith-Integration]] — Full Chan → Leopold/Agilith cross-reference
- [[Chan-Chapter1-3-NoCode-ML]] — HRP, CAI, CPO applications
- [[RL-Training-Setup]] — Synthetic scenario generation with generative models
- [[Regime-modeling]] — GMM-based regime detection (resolve HMM contradiction)
