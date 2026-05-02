---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Agilith-Research-Plan, Agilith-Strat-Priorities]
status: active
tags: [agilith-capital, alpha-stack, system-design, leopold-connection]
---

# Agilith Alpha Stack System

The real insight: these alpha ideas are not separate — they stack in a pipeline.

## The Five-Layer Stack

```
Macro Layer (Infrastructure Constraint)
    ↓
Micro Fundamentals (Margin)
    ↓
Behavioral Filter (Narrative vs Numbers)
    ↓
Confirmation Layer (Analyst Revisions)
    ↓
Timing Layer (Regime Conditioning)
```

### Layer 1: Macro → Infrastructure Constraint Nowcast
AI demand hits physical bottlenecks → buy shovel sellers.

**Edge**: Detect supply shortages before earnings reflect them. Bottleneck moves: power → compute → memory → storage → optical.

**Leopold connection**: Directly maps to [[Bottleneck-analysis]] — 5-bottleneck rotation creates systematic alpha opportunities. BE = power, CRWV = compute, MU = memory, SNDK = storage, LITE = optical.

**GenAI integration** (from [[Chan-Chapter4-8-Generative-Models]]):
- VAE for bottleneck signal anomaly detection: high reconstruction error → supply/demand imbalance
- Flow models for regime-conditioned return distributions (RISK_ON vs RISK_OFF bottleneck behavior)
- [[Chan-Chapter10-Efficient-Inference]]: Knowledge distillation for compute-constrained local inference

**Long**: bottleneck beneficiaries with confirmed orders/pricing power.
**Short**: overhyped names where transition is not confirmed.

### Layer 2: Micro → Margin Before Revenue
AI cuts costs first (support, coding, sales), profits improve before revenue.

**Edge**: Screens misread AI productivity as maturity or cyclical leverage. The actual signal is margin expansion + confirmed AI deployment.

**Leopold connection**: When bottleneck is tight, whoever has operational leverage (margin) wins before revenue shows. Early indicator of competitive positioning in constrained environment.

**Key features**: SG&A/revenue trend, revenue per employee, R&D/revenue.

**GenAI integration** (from [[Chan-Chapter4-8-Generative-Models]]):
- Flow models for margin expansion half-life estimation: P(margin_expansion | bottleneck_state)
- [[Chan-Chapter1-3-NoCode-ML]]: ChatGPT for SG&A trend analysis, revenue per employee screening
- [[Chan-RiskManagement]]: Kelly-based sizing calibrated to margin signal confidence

### Layer 3: Behavioral → Narrative vs Numbers Divergence
"Loud storytellers vs quiet executors."

**Edge**: Markets reward good stories, especially in growth stocks. Over time, results matter more than words. Hype gets punished if it doesn't convert.

**Signal**: Narrative acceleration - delivery acceleration. Detect via: specific vs vague language, pilot vs scaled language, concreteness score.

**Long**: low narrative / high delivery (quiet executors).
**Short**: high narrative / low delivery (story sellers).

**GenAI integration** (from [[Chan-Chapter9-LLM-Sentiment]]):
- Whisper + FinBERT pipeline for earnings call sentiment analysis
- [[Chan-Chapter4-8-Generative-Models]]: RAG retrieval for narrative tracking across time
- VAE for anomaly detection: narrative quality scores with high reconstruction error → hype signals
- [[Chan-Agilith-Integration]]: "Forced sales = main driver of stock momentum" → narrative forces buying

### Layer 4: Confirmation → Analyst Revision Diffusion + Tone Gating
"Is the market catching on?"

**Edge**: Slow-moving analyst updates + confirmation from management language = powerful signal. Markets underreact to revision acceleration.

**Signal**: Revision momentum + acceleration (1st + 2nd derivative) + dispersion (do analysts agree?) filtered by management tone specificity.

**This is Tier 1 if you have data.** If you have LSEG access, this becomes one of your best signals — historically validated.

**GenAI integration** (from [[Chan-Chapter1-3-NoCode-ML]]):
- CAI (Corrective AI) metalabeling: ML predicts PoP of own revision decisions
- [[Chan-Chapter1-3-NoCode-ML]]: CPO (Conditional Portfolio Optimization) by regime for revision-weighted allocation
- [[Chan-Agilith-Integration]]: HRP for revision-signal portfolio allocation across bottlenecks

### Layer 5: Timing → Regime-Conditioned Sentiment
"When should I act?"

**Edge**: Same headline = different signal depending on regime. Sentiment works better in certain macro states.

**This is a multiplier, not standalone alpha.** Improves every other signal. Build early, not as main strategy.

**Regime tags**: VIX, trend, liquidity, macro windows (CPI, FOMC).

**GenAI integration** (from [[Chan-Chapter4-8-Generative-Models]]):
- Flow models for regime-conditioned return distributions: P(r_t | RISK_ON) vs P(r_t | RISK_OFF)
- GMM for regime probability (observable indicators, not hidden states)
- [[Chan-Chapter10-Efficient-Inference]]: Quantization for local inference under compute constraints
- [[Chan-Agilith-Integration]]: Regime switching QTB Ch7 → Markov HMM vs turning points (use GMM)

## System Architecture

```
Screener → Agents → Ranking → Strategy → Portfolio
```

**Screener**: Filter by liquidity, size, trend, growth → tradable universe

**Agents**:
- Fundamental Agent: margin, efficiency, capex
- Technical Agent: trend, momentum, regime
- Sentiment Agent: narrative, voice stress, revision diffusion

**Ranking**: Multi-factor feature set → rank stocks daily → select top N

**Strategy**:
- Long top-ranked names
- Exit: stops, time-based, rank deterioration

**Portfolio**: Equal or score-weighted + risk constraints

## Honest Signal Ranking

**Tier A** (generalizable, economically grounded):
1. Infrastructure Constraint Nowcast — strongest macro signal, best Leopold connection
2. Margin Before Revenue Recognition — fundamental alpha, screens misread it
3. Transformer/Interconnection Delay — timing edge, hardest data-wise

**Tier B** (good but secondary):
4. AI Engagement Surprise — crowded raw buzz, surprise > buzz
5. Liquid Cooling Inflection — timing-dependent, crowded obvious names

**Next 5 Priority** (advanced, layer after foundation):
6. Narrative vs Numbers Divergence
7. Voice Stress Underreaction (low priority — data friction high)
8. Analyst Revision Diffusion + Tone Gating (strong if data available)
9. Regime-Conditioned Sentiment (multiplier — build early)
10. CPI/FOMC Second-Order Trades (noisy — supporting overlay)

## See Also
- [[Agilith-Research-Plan]] — Tier A/B alpha ideas with test steps
- [[Agilith-Strat-Priorities]] — Next 5 advanced ideas
- [[Bottleneck-analysis]] — Leopold thesis, 5 bottlenecks with tickers
- [[Leopold-thesis]] — Core trading thesis
- [[Regime-modeling]] — RISK_ON/OFF framework
- [[Chan-Chapter4-8-Generative-Models]] — VAE, Flow, GAN for anomaly detection + synthetic data
- [[Chan-Chapter9-LLM-Sentiment]] — Whisper + FinBERT pipeline for earnings sentiment
- [[Chan-Chapter10-Efficient-Inference]] — Distillation, quantization for local inference
- [[Chan-Chapter1-3-NoCode-ML]] — HRP, CAI, CPO for portfolio optimization
- [[Chan-Agilith-Integration]] — Full Chan → Leopold/Agilith cross-reference with contradictions
- [[RocketShip-Framework]] — 10 tools with GenAI model applications
- [[RL-Training-Setup]] — Synthetic scenario generation pipeline