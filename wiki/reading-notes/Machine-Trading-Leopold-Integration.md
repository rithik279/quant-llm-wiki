---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/Machine Trading_ Deploying Computer Algorithms to Conquer The Markets (Ernest Chan 2017).pdf
related_pages: [Leopold-thesis, Bottleneck-analysis, Agilith-Research-Plan, Agilith-Alpha-Stack-System, Agilith-Momentum-System, RL-Training-Setup, Regime-modeling, Chan-Agilith-Integration]
status: active
tags: [chan, Machine-Trading, Leopold, Agilith, factor-models, VAR, AI, ML, overfitting, options, intraday]
---

# Machine Trading → Leopold/Agilith: Full Integration

**Book:** Machine Trading: Deploying Computer Algorithms to Conquer the Markets (Chan, 2017)
**Pages:** 267
**Chapters:** 8 (Basics, Factor Models, Time Series, AI/ML, Options, Intraday, Bitcoin, Good for Body/Soul)

**Purpose:** Query-ready connections. Example: "How do I use ML to detect bottleneck rotation?"

## THE LEOPOLD THESIS (Context)

**Thesis:** AI infrastructure buildout hits bottlenecks in rotation:
```
Power (BE) → Compute (CRWV) → Memory (MU) → Storage (SNDK) → Optical (LITE)
```

**Key question:** Can Chan methods (factor models, ML, time series) detect/trade bottleneck rotation?

## HOW TO USE THIS GUIDE

When asking:
- "When do factor models predict bottleneck winners?"
- "Use ML to detect infrastructure regime shifts?"
- "Time series for AI capex cycles?"

→ Find relevant section below.

---

## 1. FACTOR MODELS → BOTTLENECK SCORING

### MT Ch2 Core
Factor models score stocks relative to sector. Sector-relative formulation:
```
w_i = (r_i - ⟨r⟩) / Σ|r_i - ⟨r⟩|
```

### Leopold Application

| Factor Type | Bottleneck Use |
|-------------|----------------|
| **Fundamental** | Book/price, earnings yield for infrastructure winners |
| **Technical** | Momentum for beneficiary price runs |
| **Options-derived** | IV skew for bottleneck uncertainty signals |

**Example:** Compute sector-relative scores for AI infrastructure names. Long winners (high score), short victims (low score).

### Agilith Connection
[[Agilith-Alpha-Stack-System]] Layer 1-3 uses factor-like scoring:
- Layer 1 (Macro): Options vol factors
- Layer 2 (Micro): Fundamental factors (margin, capex)
- Layer 3 (Behavioral): Technical factors

---

## 2. TIME SERIES → BOTTLENECK ROTATION

### MT Ch3 Core
VAR(p) — Vector Autoregression models for multiple correlated time series.

**Key example:** Computer hardware stocks (AAPL, EMC, HPQ, NTAP, SNDK) → VAR(1) with 48% annualized return, Sharpe 0.9.

### Leopold Application

**Bottleneck rotation = regime change in correlated stocks:**
- BE (power) → CRWV (compute) transition
- Use VEC (vector error correction) model to detect
- Error correction matrix C shows mean-reversion speed

**Formula:**
```
ΔY(t) = M + CY(t-1) + AΔY(t-1) + ... + ε
```

**Matrix C interpretation:**
- Negative diagonal → mean reversion
- Positive off-diagonal → cross-correlation

### Agilith Connection
[[Regime-modeling]] uses similar concepts:
- State space models for hidden regimes
- [[Agilith-Custom-Indicators]] Kalman filter for regime detection

---

## 3. AI/ML → BOTTLENECK DETECTION

### MT Ch4 Core
ML methods for trading. Focus: reducing overfitting.

**Methods:**
- kNN (classification)
- LDA (linear discriminant)
- Random Forests (feature importance)
- Neural Networks (deep learning)
- SVM (kernel methods)

**Overfitting prevention:**
| Technique | Application |
|-----------|-------------|
| Cross-validation | Test alpha ideas on held-out data |
| Regularization | Penalize complex models |
| Feature selection | 5 bottleneck features (not 50) |
| Early stopping | Stop RL training before overfit |

### Leopold Application

**ML for bottleneck detection:**
```
Features: [grid_queue, spot_price, capacity_util, order_backlog, pricing_power]
Target: bottleneck_phase (Power/Compute/Memory/Storage/Optical)
Model: Random Forest (handles nonlinearity, feature importance)
```

**Challenge:** Limited history for rare bottleneck events → overfitting risk

**Solution:** Use cross-validation with time-series split, keep features simple

### Agilith Connection
[[RL-Training-Setup]] state space design:
- Regime features from ML
- [[Agilith-Research-Plan]] alpha validation with ML

---

## 4. OPTIONS → BOTTLENECK VOLATILITY

### MT Ch5 Core
Options strategies. Volatility trading.

**Key insight:** Options market contains information about future uncertainty.

### Leopold Application

**Bottleneck plays = high vol:**
- When bottleneck forms → uncertainty spikes → IV rises
- Options can hedge bottleneck trades
- Vol surface shows market fear/reward expectations

**Strategies:**
| Strategy | Bottleneck Use |
|----------|----------------|
| Straddle/Strangle | Bet on bottleneck announcement |
| Put spread | Hedge downside in RISK_OFF |
| Ratio spread | Finance long position in beneficiary |

---

## 5. INTRADAY → TICK DATA

### MT Ch6 Core
Intraday trading. Market microstructure. Dark pools. Order flow.

**Key insight:** High-frequency signals from tick data.

### Leopold Application

**Intraday AI infrastructure plays:**
- Earnings reactions (margin beats/misses)
- Options expiration effects
- Dark pool activity for large positions

**Regime timing:** Intraday signals for regime transitions.

---

## 6. BITCOIN → EMERGING ASSETS

### MT Ch7 Core
Applying techniques to new asset class (Bitcoin).

### Leopold Application

**Crypto infrastructure plays:**
- Mining companies (similar to power infrastructure)
- Data center REITs
- GPU/cloud computing stocks

---

## QUICK REFERENCE: MT → LEOPOLD/AGILITH

| MT Chapter | Leopold Application | Agilith Page |
|------------|-------------------|--------------|
| **Ch1 Basics** | Platform selection, data quality | [[Agilith-Data-Stack]] |
| **Ch2 Factors** | Bottleneck scoring, sector relative | [[Agilith-Alpha-Stack-System]] |
| **Ch3 Time Series** | VAR for rotation detection | [[Regime-modeling]] |
| **Ch4 AI/ML** | ML for bottleneck detection | [[RL-Training-Setup]] |
| **Ch5 Options** | Vol trading for uncertainty | Research Plan Alpha |
| **Ch6 Intraday** | Tick data for regime timing | Momentum System |
| **Ch7 Bitcoin** | Emerging infrastructure assets | Portfolio holdings |
| **Ch8 Career** | Staying current, career paths | Internship goals |

---

## KEY QUOTES FOR LEOPOLD

> "Simpler models with fewer parameters avoid overfitting."
> → 5 bottleneck features > 50 features

> "Options market contains information about future uncertainty."
> → Bottleneck uncertainty → IV signal for entry timing

> "Random forests good for feature importance."
> → Identify which bottleneck signals matter most

---

## GAPS TO FILL

| Question | MT Chapter | Next Step |
|----------|------------|-----------|
| "How to score infrastructure factors?" | Ch2 | [[Agilith-Research-Plan]] Module 3 |
| "VAR for bottleneck rotation?" | Ch3 | Test on 5 bottleneck stocks |
| "ML for regime detection?" | Ch4 | [[Agilith-Custom-Indicators]] |
| "Options for bottleneck hedges?" | Ch5 | Backtest vol strategies |

---

## See Also

**Leopold thesis:**
- [[Leopold-thesis]] — Core thesis
- [[Bottleneck-analysis]] — 5 bottlenecks with tickers

**Agilith system:**
- [[Agilith-Research-Plan]] — 5 alpha ideas
- [[Agilith-Alpha-Stack-System]] — 5-layer pipeline
- [[Regime-modeling]] — 4-state regime
- [[RL-Training-Setup]] — RL with ML
- [[Chan-Agilith-Integration]] — Existing integration (QTB + Algorithmic)

**Machine Trading chapters:**
- [[Machine-Trading-Ch2-FactorModels]] — Factor models
- [[Machine-Trading-Ch4-AI-ML]] — AI/ML techniques