---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [Agilith-System-Architecture, RL-Training-Setup, Regime-modeling]
status: active
tags: [architecture, build-plan, timeline, milestones]
---

# 4-Month Build Plan

## Overview

Full implementation timeline for the Agilith Trading System. Foundation → Regime → Backtesting+RL → Training+Deploy.

## Month 1: Foundation

**Goal:** Core data pipeline operational

### Week 1: Data Stack
- [ ] Set up FMP API (fundamental data) OR Financial Modeling Prep ($49/mo) — see contradictions
- [ ] Set up Alpha Vantage + yfinance (market data, $0-50/mo)
- [ ] Set up SEC EDGAR integration (filings)
- [ ] Set up FRED API (macro signals)
- [ ] Set up Quantpedia (~33/mo, strategy research)
- [ ] Set up Quant Investing screener (~45/mo, survivorship-free universe)
- [ ] Define data schema for holdings
- [ ] Set up TradingView Pro for technicals ($50/mo)
- [ ] Optional: Predmktdata (~$49/mo, prediction markets), 13Radar ($0-12/mo, insider activity)

### Week 2: System Architecture
- [ ] Implement 5-layer alpha stack
- [ ] Build 3 core agents (Revision, Constraint, Regime) per proposal
- [ ] Map agents to 6 execution tools (Agent-Tools.md)
- [ ] Build signal engine
- [ ] Build regime engine
- [ ] Build scenario engine
- [ ] Connect data sources to pipeline

> **Note:** See [[Agent-Framework-Taxonomy]] for unified agent/tool mapping. Proposal uses 3 agents (Revision/Constraint/Regime). RocketShip extends to 10 reasoning tools. Month 1 MVP uses proposal's 3-agent structure.

### Week 3: Feature Engineering
- [ ] Engineer bottleneck detection features
- [ ] Engineer margin/leadership features
- [ ] Engineer narrative vs numbers features
- [ ] Engineer analyst revision features
- [ ] Engineer timing features

### Week 4: MVP Integration
- [ ] Connect agent tools to feature store
- [ ] Test end-to-end pipeline
- [ ] Validate signal quality
- [ ] Document feature definitions

**Deliverable:** Working data pipeline with all 5 alpha layers producing signals

## Month 2: Regime Detection

**Goal:** 4-regime framework operational with HMM

### Week 1: Regime Framework
- [ ] Implement RISK_ON logic
- [ ] Implement RISK_OFF logic
- [ ] Implement TRANSITION logic
- [ ] Implement RECOVERY logic
- [ ] Define regime indicators

### Week 2: HMM Integration
- [ ] Train Hidden Markov Model on historical data
- [ ] Define HMM inputs (index returns, volatility, breadth, breakout returns)
- [ ] Backtest HMM regime classification
- [ ] Validate regime signals

### Week 3: ADX + Hurst Integration
- [ ] Add ADX for trend detection
- [ ] Add Hurst exponent for mean-reversion
- [ ] Combine regime signals with technicals
- [ ] Build regime-conditioned positioning rules

### Week 4: Backtesting Framework
- [ ] Set up backtest infrastructure
- [ ] Test regime-aware strategies
- [ ] Measure performance vs buy-and-hold
- [ ] Document backtest results

**Deliverable:** Regime engine classifying market state and conditioning positioning

## Month 3: Backtesting + RL

**Goal:** RL training pipeline ready, 100+ scenarios

### Week 1: Scenario Design
- [ ] Define RISK_ON scenarios (70% of training)
- [ ] Define TRANSITION scenarios (20%)
- [ ] Define RISK_OFF scenarios (5%)
- [ ] Define RECOVERY scenarios (5%)
- [ ] Build scenario evaluation framework

### Week 2: Backtesting Expansion
- [ ] Run backtests across all scenarios
- [ ] Measure Sharpe ratio per regime
- [ ] Measure max drawdown per regime
- [ ] Measure win rate per regime
- [ ] Generate performance attribution

### Week 3: RL Training Setup (HUD.ai)
- [ ] Integrate HUD.ai (removes 180+ hours custom RL infrastructure)
- [ ] Define RL state space (regime + features + positions)
- [ ] Define RL action space (buy/sell/hold per ticker)
- [ ] Define reward function
- [ ] Train baseline model

### Week 4: RL Training + Iteration
- [ ] Train RL agent on 100+ scenarios
- [ ] Measure RL performance vs baseline
- [ ] Tune hyperparameters
- [ ] Validate out-of-sample

**Deliverable:** RL agent trained on 100+ scenarios, ready for deployment

## Month 4: Training + Deploy

**Goal:** Agent deployed and producing quality signals

### Week 1: Agent Refinement
- [ ] Integrate RL agent with agentic loop
- [ ] Refine conviction levels based on backtest
- [ ] Tune scoring weights
- [ ] Add post-trade reflection

### Week 2: Deployment Infrastructure
- [ ] Set up scheduling (daily 9:30 AM, 4:00 PM, Friday 5 PM)
- [ ] Set up IBKR paper trading
- [ ] Set up logging and monitoring
- [ ] Deploy to production

### Week 3: Live Testing
- [ ] Run in paper trading mode
- [ ] Track all signals and executions
- [ ] Measure accuracy
- [ ] Gather mentor feedback

### Week 4: Optimization
- [ ] Adjust based on paper trading results
- [ ] Refine agent prompts
- [ ] Optimize scoring weights
- [ ] Prepare final presentation

**Deliverable:** Production agent running with mentor review

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Annual return | 12% | 14-15% |
| Sharpe ratio | ~1.0 | 1.4-1.5 |
| Max drawdown | TBD | TBD |
| Regime accuracy | TBD | >70% |

## Mentorship

- **PM mentor:** Market expertise, investment thesis
- **Queen's AI engineer:** Technical and ML expertise

## Toolset

- **HUD.ai:** RL training (avoids 180+ hours custom infrastructure work)
- **Friend's agent traces:** Study before designing own tools
- **Chan books:** "Generative AI for Trading" + "Hands-On AI"
- **Blackwell 1000 GPU:** Local training capable (Mistral 7B, Qwen, 13B)

## Related

- [[Agilith-System-Architecture]] — Architecture this plan implements
- [[RL-Training-Setup]] — RL training details
- [[Regime-modeling]] — Regime framework this plan builds
