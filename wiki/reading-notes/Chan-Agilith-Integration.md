---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 2
source_files: [raw/books/AlgorithmicTradingChan.pdf, raw/books/Quantitative Trading.pdf]
related_pages: [Leopold-thesis, Bottleneck-analysis, Agilith-Research-Plan, Agilith-Alpha-Stack-System, 4-Month-Build-Plan, RL-Training-Setup, Regime-modeling, Agilith-Momentum-System, Agilith-Learning-System]
status: active
tags: [Chan, Agilith, Leopold, cross-reference, thesis-connection, full-integration]
---

# Chan Books → Leopold/Agilith: Query-Answer Guide

**Purpose:** Answer questions like "How does Chan momentum apply to trading infrastructure bottleneck rotation?" by connecting Chan concepts to the Leopold thesis + Agilith thesis.

## THE LEOPOLD THESIS (Core Context)

**Thesis:** AI infrastructure buildout hits physical bottlenecks in rotation:
```
Power (BE) → Compute (CRWV) → Memory (MU) → Storage (SNDK) → Optical (LITE)
```

**The opportunity:** Bottleneck beneficiaries get pricing power + margins expand before revenue shows.

**Key question for Chan:** Are infrastructure plays momentum or mean reversion? When do they switch?

See: [[Leopold-thesis]], [[Bottleneck-analysis]]

---

## HOW TO USE THIS GUIDE

When asking a question like:
- "When do infrastructure stocks revert?"
- "How do I size positions for bottleneck plays?"
- "When does momentum break in AI buildout?"

→ Find the relevant section below for Chan-based answer applied to Leopold/Agilith context.

---

## 1. INFRASTRUCTURE BOTTENECKS → WHEN MOMENTUM OR MEAN REVERSION?

### Leopold Context
Bottleneck rotation creates both:
- **Momentum:** When bottleneck tightens, beneficiary prices run
- **Mean Reversion:** When bottleneck clears, prices revert

### Chan Answer

| Bottleneck Phase | Chan Strategy | Leopold Application |
|------------------|---------------|---------------------|
| **Bottleneck tightening** | Momentum (Ch6) | Buy beneficiaries, ride forced buying |
| **Bottleneck peak** | Regime switch (QTB Ch7) | Transition to RISK_OFF, reduce exposure |
| **Bottleneck clearing** | Mean Reversion (Ch2) | Short overextended names, pairs trading |
| **Between bottlenecks** | Cross-sectional MR | Long cheap, short expensive within sector |

**Key insight from Chan Ch6:** "Forced asset sales is the main driver of stock and ETF momentum."

→ When bottleneck forces buying (AI capex mandates), momentum continues.
→ When bottleneck clears, forced buying stops → momentum breaks → mean reversion.

### Leopold Connection
- **Power (BE):** Sustained momentum when power grid constrained
- **Compute (CRWV):** Momentum breaks when supply catches demand
- **Memory (MU):** Depends on AI training cycles (coincident with compute)

---

## 2. MARGIN EXPANSION IN CONSTRAINED ENVIRONMENT

### Leopold Context
Agilith thesis: AI cuts costs → margins expand → stocks run

### Chan Answer

**Chan Ch6 (Forced Sales):** Margin compression → forced selling → oversold → bounce
**Chan Ch2 (Half-life):** How long until margin reversion?

| Scenario | Chan Method | Application |
|----------|-------------|-------------|
| AI cuts support costs | Mean Reversion (Ch2) | Margins expand → price catches up |
| Forced capacity additions | Momentum (Ch6) | Capex crushes margins short-term |
| AI productivity gains | Half-life | 20-60 day hold period for margin alpha |

**Key formula:** `Half-life = -log(2) / λ`

→ If margin expansion half-life = 30 days, hold period = 30 days for Alpha 2 (Margin Before Revenue)

See: [[Agilith-Research-Plan]] Alpha 2

---

## 3. REGIME SWITCHING → BOTTLENECK TRANSITIONS

### Leopold Context
Bottleneck rotation = regime change. When one clears and another tightens.

### Chan Answer

**QTB Ch7 (Regime Switching):** Markov HMM vs turning points

| Regime | Bottleneck State | Agilith Action |
|--------|------------------|----------------|
| **RISK_ON** | Active bottleneck | Higher leverage, momentum works |
| **RISK_OFF** | Bottleneck peak/crash | Lower leverage, mean reversion |
| **TRANSITION** | Bottleneck clearing | 70% exposure, pairs trading |
| **RECOVERY** | New bottleneck forming | 50% exposure, accumulate winners |

**Chan warning:** "Regime shifts can spoil everything."

→ Backtest Alpha 1 (Infrastructure) across all 4 regimes, not just RISK_ON.

See: [[Regime-modeling]], [[Bottleneck-analysis]]

---

## 4. COINTEGRATION → BENEFICIARY/VICTIM PAIRS

### Leopold Context
When one bottleneck clears (victim), another tightens (beneficiary).

### Chan Answer

**Chan Ch2 (Cointegration):** CADF + Johansen tests for pairs

| Pair | Cointegration Test | Application |
|------|-------------------|-------------|
| **BE vs CRWV** | CADF | Power → Compute transition |
| **CRWV vs MU** | CADF | Compute → Memory correlation |
| **SNDK vs LITE** | CADF | Storage → Optical transition |
| **Beneficiary vs Victim** | Johansen | Long winner, short loser in rotation |

**Pairs trade:** Long BE (power winner) / Short prior winner (when rotation starts)

---

## 5. POSITION SIZING → KELLY FOR BOTTLENECK PLAYS

### Leopold Context
Bottleneck plays have fat tails (black swan = regulatory block, tech disruption).

### Chan Answer

**Chan Ch8 (Risk Management):** Kelly formula
```
f* = m / s^2  (Kelly fraction)
g = r + S^2/2  (max growth rate)
```

**For bottleneck plays:**
- Use Half-Kelly (reduce 50%) due to fat tails
- ATR-based sizing: `Position $ = f * Equity / ATR`
- Regime-adjusted: RISK_ON = full Kelly, RISK_OFF = Kelly/4

**Black swan protection:**
- Stop losses per position (infrastructure = high vol)
- Max 10% portfolio per bottleneck bet
- Diversify across 5 bottlenecks

See: [[Agilith-Alpha-Stack-System]] Layer 5 (Timing)

---

## 6. DATA-SNOOPING → ALPHA VALIDATION

### Leopold Context
5 alpha ideas from [[Agilith-Research-Plan]] need validation before RL training.

### Chan Answer

**Chan Ch1 (Backtest Pitfalls):**
- Look-ahead: Grid queue data published → use yesterday's data only
- Data-snooping: 5 bottlenecks = 5 features max, not 50
- Survivorship: Missing acquired small caps

**Validation checklist per alpha:**
| Alpha | Chan Test | Leopold-Specific Risk |
|-------|----------|----------------------|
| Infrastructure | Monte Carlo | Rare bottleneck announcements |
| Margin | ADF (stationarity) | AI cost cuts not persistent |
| Transformer Delay | Regime backtest | Regulatory uncertainty |
| AI Engagement | Cross-sectional momentum | Too many "AI" claims |
| Liquid Cooling | Half-life | Timing-sensitive, crowded |

---

## 7. LEARNING SYSTEM → CHAN CHAPTER SEQUENCE

### Leopold Context
16-week curriculum in [[Agilith-Learning-System]] uses Chan books in Phase 4.

### Chan Connection

| Phase | Weeks | Learn This First | Then Apply to Leopold |
|-------|-------|------------------|----------------------|
| Phase 1 | 1-3 | Stats (Sharpe, drawdown) | Measure bottleneck alpha quality |
| Phase 2 | 4-6 | Factor models | Score beneficiaries vs victims |
| Phase 3 | 7-9 | Time series (ADF, Hurst) | Detect bottleneck stationarity |
| Phase 4 | 10-12 | **Chan books here** | Build bottleneck strategy |
| Phase 5 | 13-16 | Regime modeling | Map bottleneck → RISK_ON/OFF |

---

## 8. RL TRAINING → CHAN RISK METRICS

### Leopold Context
RL agent in [[RL-Training-Setup]] must learn bottleneck rotation.

### Chan Answer

**State space:**
- Regime (RISK_ON/OFF/TRANSITION/RECOVERY)
- Bottleneck position (Power/Compute/Memory/Storage/Optical)
- Margin metrics (SG&A/revenue, R&D/revenue)
- Half-life of current alpha

**Action space:**
- Kelly-based position sizing per bottleneck
- Scale leverage by regime

**Reward function:**
- Sharpe ratio (target > 1.4)
- Max drawdown (< 20%)
- Regime-adjusted returns

---

## QUICK REFERENCE: CHAN → LEOPOLD/AGILITH

| Chan Concept | Leopold Application | Agilith Page |
|--------------|-------------------|--------------|
| **Forced sales (Ch6)** | Bottleneck forces buying → momentum | Alpha 2 (Margin) |
| **Half-life (Ch2)** | How long to hold margin expansion | Layer 5 (Timing) |
| **Cointegration (Ch2)** | Beneficiary/victim pairs | Bottleneck rotation |
| **Regime switching (QTB Ch7)** | Bottleneck transitions | RISK_ON/OFF |
| **Kelly (Ch8)** | Position sizing for fat-tail plays | Layer 5, RL reward |
| **Data-snooping (Ch1)** | Validate 5 alphas, avoid overfit | Research Plan |
| **Survivorship bias** | Missing small-cap bottleneck plays | Data stack |
| **Hurst exponent** | Detect trending vs mean-reverting bottleneck | Momentum system |
| **HRP (Ch3)** | Portfolio allocation for bottleneck beneficiaries | Layer 4 (Portfolio) |
| **CAI metalabeling (Ch3)** | RL agent predicts PoP of own decisions | RL-Training-Setup |
| **CPO (Ch3)** | Conditional portfolio optimization by regime | Layer 5 (Timing) |
| **VAE (Ch6)** | Bottleneck anomaly detection, synthetic scenarios | RL-Training-Setup |
| **Flow models (Ch7)** | Regime-conditioned return distributions | Regime-modeling |
| **WGAN (Ch8)** | Synthetic scenario generation for RL training | RL-Training-Setup |
| **Whisper+FinBERT (Ch9)** | Fed speech sentiment → RISK_ON/OFF signal | Layer 3 (Behavioral) |
| **Knowledge distillation (Ch10)** | Compute/memory bottleneck → local inference | Leopold-thesis |
| **Quantization (Ch10)** | Smaller models for local deployment | Bottleneck-analysis |

---

## KEY QUOTES APPLIED TO LEOPOLD

> "Forced asset sales is the main driver of stock and ETF momentum."
> → Bottleneck forcing = forced buying of infrastructure → momentum in beneficiaries

> "It is always better to be underleveraged than overleveraged."
> → Infrastructure plays have regulatory/tech black swans → Half-Kelly

> "Regime shifts can spoil everything."
> → When bottleneck rotates (power → compute), prior winners may crash

> "Linear models are more robust than nonlinear."
> → 5-bottleneck rotation = 5 features, not 50 → avoid overfitting

> "Predicting stock returns = worst ML use case. Arbitrage → alpha decay."
> → Use CAI metalabeling instead: ML predicts PoP of bottleneck strategy, not returns

> "GenAI, despite its success in other domains, may require more empirical work to achieve similar results in finance."
> → Leopold thesis: GenAI for infrastructure signals (Whisper, FinBERT) more applicable than return prediction

> "HMM seductive but fictional for regimes."
> → Use GMM with observable indicators for [[Regime-modeling]] RISK_ON/OFF

---

## See Also

**Leopold thesis:**
- [[Leopold-thesis]] — Core trading thesis
- [[Bottleneck-analysis]] — 5 bottlenecks with tickers

**Agilith system:**
- [[Agilith-Research-Plan]] — 5 alpha ideas to implement
- [[Agilith-Alpha-Stack-System]] — 5-layer pipeline
- [[Agilith-Momentum-System]] — Breakout scoring
- [[Regime-modeling]] — 4-state regime framework

**Chan chapters:**
- [[Chan-Chapter1-Backtesting]] — Backtest validation
- [[Chan-Chapter2-MeanReversion]] — Half-life, cointegration
- [[Chan-Chapter6-Momentum]] — 4 drivers, forced sales
- [[Chan-RiskManagement]] — Kelly formula
- [[QTB-Chapter7-SpecialTopics]] — Regime switching