---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_files: [raw/books/GenerativeAIForTradingChan.pdf]
related_pages: [Chan-GanAI-Full-Summary, Chan-Agilith-Integration, RocketShip-Framework, Agilith-Tooling-Stack]
status: active
tags: [Chan, GenAI, no-code, ChatGPT, code-generation, prompt-engineering, automation]
---

# Chan-Ch1-3: No-code GenAI + ML Tour

**Part I content:** Basic tasks → Strategy development → ML fundamentals. Unique: prompt engineering for finance code generation.

---

## Ch 1: No-code GenAI for Basic Quant Finance

ChatGPT (GPT-4o, Copilot, Gemini, DeepSeek) for:
- Retrieve adjusted historical prices (yfinance)
- Compute daily returns from adjusted prices
- Compute Sharpe ratio
- Analyze Excel spreadsheets
- Translate Matlab → Python (efficient frontier, tangency portfolio)
- Plot annualized returns

### Key Finding: ChatGPT Best at Code, Not Numbers

> "While we can enter English instructions into ChatGPT, its best output is often code rather than numerical answers."

### Prompt Engineering Insights

- "ChatGPT is like a mediocre and inexperienced intern" — requires patience
- Self-consistency failures: LightGBM handles NaN → ChatGPT said ML can't handle NaN → contradicted itself
- Code errors require human fix-up
- Indeterministic + irreproducible results

### Specific Errors Found

1. Annualized returns: multiplied by 252 instead of 365
2. Date/time parsing: YYYY-MM-DD hh:mm:ss-05:00 format confusion
3. scipy import errors
4. ModuleNotFoundError handling

### Application to Agilith

**RocketShip tool generation:** ChatGPT could generate boilerplate for agent tools, but requires human review.

**Code templates:** Standard backtest code structure, data loading, Sharpe computation.

---

## Ch 2: No-code GenAI for Strategy Development

### Tasks Attempted

a. Create backtest code for long-short equity strategy using Fama-French factors
b. Backtest hedged VIX futures carry strategy from published paper
c. Literature search for portfolio optimization with deep RL (regime adaptation)
d. Exploratory analysis of SPX options calendar spread

### Fama-French Factor Setup

```
r_{i,t+1} = α_i + β_{i1} × Mkt-RF_t + β_{i2} × SMB_t + β_{i3} × HML_t + ε_{i,t}
```

- Predict next-day returns, not contemporaneous
- Cross-sectional model per stock
- First half training, second half testing

### Key Prompt Engineering Lessons

- Need to specify "time-series features" vs "cross-sectional features"
- Generic predict() method for model deployment
- Data format: long format (stacked) vs wide format
- NaN handling: dropna() + minimum threshold

### Application to Agilith

**[[Chan-Agilith-Integration]]:** Factor models → beneficiary/victim scoring for bottleneck rotation.

**Bottleneck factors:**
- Power constraint → grid queue data
- Compute lead times → supply chain indicators
- Memory prices → HBM/GDDR demand

**Literature search for RL:** Deep RL for regime adaptation → connects to [[RL-Training-Setup]].

---

## Ch 3: Whirlwind Tour of ML in Asset Management

### Unsupervised Learning

#### HRP (Hierarchical Risk Parity)

López de Prado 2020. Three steps:
1. Hierarchical clustering on covariance matrix
2. Intra-cluster risk parity allocation
3. Inter-cluster Kelly allocation

Solves mean-variance instability. HRP allocation:
```
w_cluster_k = Kelly_fraction × r_k / σ_k
w_final = Σ w_cluster_k
```

**Agilith connection:** [[Agilith-Alpha-Stack-System]] Layer 4 (Portfolio Construction). Before mean-variance optimization, cluster bottleneck beneficiaries/victims.

#### PCA (Statistical Factors)

- Top eigenvectors of returns covariance matrix
- Denoising + feature selection
- vs Fama-French (observable factors) → PCA finds "statistical" factors

**Agilith connection:** [[Machine-Trading-Ch2-FactorModels]] — sector-relative scoring using PCA components.

#### cMDA (Cluster-based Mean Decrease Accuracy)

Feature importance ranking using clusters:
- Cluster correlated features
- Rank clusters, not individual features
- Found: fundamental (d/p, e/p, b/m, ntis, tbl, lty, dfy, dfr, infl) vs technical (d/e, svar, ltr, tms)

**Agilith connection:** Bottleneck feature selection — cluster power queue, compute lead times, memory prices → rank importance.

#### HMM (Hidden Markov Model)

> "Seductive but fictional" for regime detection. Chan 2017 found HMM fails for SPY. More parameters ≠ better fit.

**[[Regime-modeling]] connection:** Use GMM (Ch6) + observable regime indicators instead of HMM hidden states.

### Supervised Learning

#### CAI (Corrective AI) / Metalabeling

ML as corrective layer on human expert system:
- Predict probability of profit (PoP)
- Labels: profitable (1) vs nonprofitable (0)
- NOT subject to arbitrage (expert system is proprietary)

**[[Machine-Trading-Ch4-AI-ML]] connection:** Metalabeling = RL agent self-evaluation.

#### CPO (Conditional Portfolio Optimization)

Predict portfolio performance under various allocations → pick best:
- Sharpe, max DD as prediction targets
- Adapts to regime
- Not subject to arbitrage (unique optimization objective)

**[[Agilith-Alpha-Stack-System]] Layer 5 (Timing) connection:** CPO → conditional allocation given RISK_ON/OFF.

### Key Warning

> "Predicting stock returns = worst ML use case. Arbitrage → alpha decay. Feedback loop changes target behavior."

→ RL needed to solve feedback loop problem.

### RL Mention

Deep RL → solution to feedback loop in predicting markets. Connects to [[RL-Training-Setup]] state/action/reward design.

---

## Agilith Cross-Reference

| Concept | Agilith Page | Application |
|---------|-------------|-------------|
| HRP clustering | [[Agilith-Alpha-Stack-System]] L4 | Portfolio construction for bottleneck beneficiaries |
| PCA statistical factors | [[Machine-Trading-Ch2-FactorModels]] | Factor construction |
| cMDA feature ranking | [[Bottleneck-analysis]] | Bottleneck feature importance |
| HMM warning | [[Regime-modeling]] | Use observable indicators instead |
| CAI metalabeling | [[Machine-Trading-Ch4-AI-ML]] | RL agent PoP prediction |
| CPO | [[Agilith-Alpha-Stack-System]] L5 | Conditional timing allocation |
| RL feedback loop | [[RL-Training-Setup]] | State/action/reward design |

---

## RocketShip Connections

**Tool generation (Ch1-2):**
- ChatGPT for boilerplate code
- Prompt templates for agent tools
- Requires human review

**Knowledge retrieval:**
- RAG (Ch4 later) → semantic search
- [[RocketShip-Framework]] tool: fetch_thesis_alignment

**Portfolio construction:**
- HRP (Ch3) → Layer 4 allocation
- [[RocketShip-Framework]] tool: compute_portfolio_snapshot

---

## See Also

- [[Chan-GanAI-Full-Summary]] — Full book summary
- [[Chan-Agilith-Integration]] — Leopold/Agilith connections
- [[Machine-Trading-Ch4-AI-ML]] — Overfitting, CAI, CPO
- [[Agilith-Alpha-Stack-System]] — 5-layer pipeline
- [[Regime-modeling]] — Observable regime indicators
- [[RL-Training-Setup]] — RL state/action/reward
