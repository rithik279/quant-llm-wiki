---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/Machine Trading_ Deploying Computer Algorithms to Conquer The Markets (Ernest Chan 2017).pdf
related_pages: [Leopold-thesis, Bottleneck-analysis, Agilith-Research-Plan, Agilith-Alpha-Stack-System, Agilith-Momentum-System, Agilith-Custom-Indicators, RL-Training-Setup, 4-Month-Build-Plan, Regime-modeling, Agilith-Investment-Philosophy, Chan-Agilith-Integration, Machine-Trading-Leopold-Integration]
status: active
tags: [chan, Machine-Trading, AI, ML, neural-networks, random-forest, overfitting, regime-detection, Leopold-connection, Agilith-research]
---

# Machine Trading Ch4: AI/ML Techniques

**Leopold connection:** ML for bottleneck detection. Which features predict infrastructure constraint emergence?

**Agilith connection:** [[RL-Training-Setup]] uses ML methods. Ch4 covers ML for trading specifically.

## Key Content

### Overfitting: The Core Problem

**Chan quote:** "The simplest way to avoid overfitting: use simpler models with fewer parameters."

**Overfitting detection:**
- In-sample Sharpe >> out-of-sample Sharpe
- Many parameters → fits noise
- Cross-validation failure

### ML Methods Covered

1. **k-Nearest Neighbors (kNN)**
   - Classify regime (RISK_ON/OFF)
   - Predict discrete outcomes

2. **Linear Discriminant Analysis (LDA)**
   - Separate classes with linear boundary
   - Fast, interpretable

3. **Random Forests**
   - Ensemble of decision trees
   - Good for feature importance
   - Handles nonlinear relationships

4. **Neural Networks**
   - Backpropagation
   - Deep learning for high-dimensional data
   - Warning: prone to overfitting

5. **Support Vector Machines (SVM)**
   - Kernel methods
   - Good for small datasets

### Reducing Overfitting Techniques

| Technique | What | Agilith Use |
|-----------|------|------------|
| **Cross-validation** | Test on held-out data | Validate alpha ideas |
| **Regularization** | Penalize complexity | RL reward includes simplicity |
| **Feature selection** | Use few, important features | 5 bottleneck features |
| **Early stopping** | Stop before overfit | RL training epoch limit |

### Regime Detection with ML

**Key insight:** ML can find hidden states in market data.

**Ch4 approach:**
1. Collect features (technical, fundamental, macro)
2. Train classifier to predict regime
3. Test on out-of-sample data

**Agilith [[Regime-modeling]] connection:**
- Hidden Markov Models (HMM) = state space models
- ML for turning point detection
- [[Agilith-Custom-Indicators]] uses HMM

## Leopold Bottleneck Detection with ML

**ML for bottleneck rotation:**
1. **Features:** Grid queue length, spot prices, capacity utilization
2. **Target:** Bottleneck phase (Power/Compute/Memory/etc.)
3. **Model:** Random forest or SVM

**Challenge:** Rare events + limited history → prone to overfitting

**Solutions:**
- Use cross-validation with time-series split
- Regularization
- Keep features simple (5 bottlenecks = 5 features)

## Connection to Agilith System

### Alpha Stack System Layers

| Alpha Stack Layer | MT Ch4 ML | Agilith Use |
|-------------------|-----------|-------------|
| [[Agilith-Alpha-Stack-System]] Layer 1 (Macro) | Regime classifier | Infrastructure sentiment |
| Layer 2 (Micro) | Random Forest | Margin expansion prediction |
| Layer 3 (Behavioral) | kNN classifier | AI engagement signals |
| Layer 4 (Confirmation) | Feature importance | Analyst revision ML |
| Layer 5 (Timing) | Neural Networks | Momentum timing |

### 4-Month Build Plan Connection

| Month | MT Ch4 Activity |
|-------|------------------|
| Month 1 (Foundation) | Feature selection → [[Agilith-Data-Stack]] |
| Month 2 (Regime) | ML regime detection → [[Regime-modeling]] |
| Month 3 (Backtesting) | Cross-validation → [[RL-Training-Setup]] |
| Month 4 (Deploy) | Feature importance → Alpha validation |

### Research Plan Alpha Ideas

| Alpha | ML Application |
|-------|----------------|
| [[Agilith-Research-Plan]] Alpha 1 (Infrastructure) | Random Forest → bottleneck phase prediction |
| Alpha 2 (Margin Before Revenue) | LDA → margin expansion classifier |
| Alpha 3 (Transformer Delay) | kNN → delay detection |
| Alpha 4 (AI Engagement) | Neural Networks → engagement prediction |
| Alpha 5 (Liquid Cooling) | SVM → inflection detection |

### Momentum System Connection

[[Agilith-Momentum-System]] uses ML for breakout classification:
- kNN for regime classification
- Random Forests for feature importance
- Neural Networks for timing

Ch4 ML methods → enhance this classification system.

### Custom Indicators Connection

[[Agilith-Custom-Indicators]] uses Ch4 ML for:
- Hidden Markov Models (HMM) → regime detection
- Kalman filter → trend estimation
- Feature importance → indicator selection

### Investment Philosophy

[[Agilith-Investment-Philosophy]] three-layer framework:
- Quantitative (short-term): ML classification
- LLM (medium-term): Feature aggregation
- Fundamental (long-term): Bottleneck thesis alignment

Ch4 overfitting prevention → validate alpha ideas without overfitting.

## Backtesting ML Models

**Key issues:**
- **Time-series cross-validation:** Must preserve temporal order
- **Survivorship bias:** Include delisted infrastructure stocks
- **Regime shift:** ML fails when regime changes mid-training

**Connection to [[4-Month-Build-Plan]]:** Month 3 backtesting uses Ch4 cross-validation to prevent RL agent overfitting.

**Connection to [[Regime-modeling]]:** Regime shifts break ML assumptions → use Ch4 early stopping when regime changes detected.

## Key Quotes

> "The best guard against overfitting is to have fewer free parameters than data points."

> "The simplest model that works is better than a complex one that fails."

## See Also

**Leopold thesis:**
- [[Leopold-thesis]] — Core thesis
- [[Bottleneck-analysis]] — 5 bottlenecks with tickers

**Agilith research:**
- [[Agilith-Research-Plan]] — 5 alpha ideas, Module 3 ML validation
- [[Agilith-Alpha-Stack-System]] — 5-layer pipeline with ML integration
- [[Agilith-Momentum-System]] — Breakout classification with ML
- [[Agilith-Custom-Indicators]] — HMM, Kalman filter for regime
- [[Regime-modeling]] — 4-state regime with ML detection
- [[4-Month-Build-Plan]] — Month 3 ML backtesting
- [[Agilith-Investment-Philosophy]] — Three-layer framework
- [[Agilith-Data-Stack]] — Feature data for ML models

**Implementation:**
- [[RL-Training-Setup]] — ML state space, overfitting prevention
- [[Chan-Agilith-Integration]] — Cross-book synthesis
- [[Machine-Trading-Leopold-Integration]] — Full thesis integration