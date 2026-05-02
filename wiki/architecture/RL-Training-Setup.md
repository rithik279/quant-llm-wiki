---
date_created: 2026-05-01
date_updated: 2026-05-02
source_count: 2
source_files: [4-Month-Build-Plan, raw/books/GenerativeAIForTradingChan.pdf]
related_pages: [4-Month-Build-Plan, Regime-modeling, Agilith-System-Architecture, RocketShip-Framework, Chan-Chapter4-8-Generative-Models, Chan-Agilith-Integration]
status: active
tags: [architecture, rl, training, hud-ai, scenarios, GenAI, VAE, GAN, WGAN, synthetic-data]
---

# RL Training Setup

## Overview

Reinforcement learning training pipeline for the Agilith Trading System. Uses HUD.ai to remove 180+ hours of custom RL infrastructure work.

## Why RL?

**Baseline:** Traditional systematic strategies achieve ~12% annual return.

**Target:** RL training aims for 14-15% annual return, Sharpe 1.4-1.5.

**Key insight:** RL can learn regime-conditioned positioning that static rules miss.

## RL Framework: HUD.ai

**HUD.ai** removes the need to build custom RL infrastructure from scratch.

Benefits:
- Pre-built RL training loop
- Managed compute
- Experiment tracking
- No 180+ hours of custom infrastructure work

**Alternative:** Build from scratch with stable-baselines3 or Ray RLlib.

## State Space

```
state = {
    regime: RISK_ON | RISK_OFF | TRANSITION | RECOVERY,
    features: {
        bottleneck_score: float,      # 0-1
        margin_leadership: float,    # 0-1
        narrative_vs_numbers: float, # 0-1
        analyst_revisions: float,    # 0-1
        timing_signal: float          # 0-1
    },
    positions: {
        BE: float,   # position size
        CRWV: float,
        LITE: float,
        MU: float,
        SNDK: float,
        SPY: float
    },
    portfolio_value: float,
    cash: float
}
```

## Action Space

For each ticker: buy/sell/hold with position size adjustment.

```
action = {
    BE: {-1, 0, 1},    # sell, hold, buy
    CRWV: {-1, 0, 1},
    LITE: {-1, 0, 1},
    MU: {-1, 0, 1},
    SNDK: {-1, 0, 1},
    SPY: {-1, 0, 1}
}
```

## Reward Function

```python
def reward(state, action, next_state):
    portfolio_return = (next_state.portfolio_value - state.portfolio_value) / state.portfolio_value
    regime_penalty = 0 if regime_aligned(action, state.regime) else -0.01
    turnover_penalty = -0.001 * abs(turnover(action))
    return portfolio_return + regime_penalty + turnover_penalty
```

## Training Scenarios

### Distribution

| Regime | Weight | Count |
|--------|--------|-------|
| RISK_ON | 70% | 70+ |
| TRANSITION | 20% | 20+ |
| RISK_OFF | 5% | 5+ |
| RECOVERY | 5% | 5+ |

### Scenario Types

**RISK_ON Scenarios:**
- Power shortage accelerating → Accumulate BE, CEG
- GPU demand surging → Accumulate CRWV, NVDA
- Memory tight → Accumulate MU
- Optical demand emerging → Monitor LITE
- Storage constrained → Accumulate SNDK

**TRANSITION Scenarios:**
- Fed policy shift → Reduce equity exposure
- Earnings season → Volatility spike
- Regime indicators mixed → Reduce position sizes
- Leadership rotation → Shift to defensive

**RISK_OFF Scenarios:**
- Market selloff → Increase SPY hedge
- Recession signal → Exit growth positions
- Geopolitical shock → Cash defensive
- Credit stress → Reduce leverage

**RECOVERY Scenarios:**
- Market bottoming → Begin accumulation
- Policy support → Increase risk exposure
- Sentiment improving → Add to core positions
- Trend reversal → Build new positions

## Training Process

### Phase 1: Offline Training
```
1. Collect historical data (5+ years)
2. Generate scenarios from historical regimes
3. Pre-train RL agent on historical data
4. Validate against holdout period
```

### Phase 2: Simulation
```
1. Run agent in paper trading simulation
2. Generate synthetic scenarios (regime transitions)
3. Fine-tune agent on simulated data
4. Measure performance
```

### Phase 3: Online Learning
```
1. Deploy agent in paper trading
2. Track real performance
3. Retrain periodically on new data
4. Gradually increase position sizes
```

## Backtest Framework

**Baseline metrics:**
- Annual return: ~12%
- Sharpe ratio: ~1.0
- Max drawdown: TBD

**Target metrics:**
- Annual return: 14-15%
- Sharpe ratio: 1.4-1.5
- Max drawdown: < baseline

## Local Training (Blackwell 1000 GPU)

For development and experimentation:
- Mistral 7B: Fast iteration
- Qwen: Good quality/speed balance
- 13B: Higher quality, slower

```python
# Local RL training with Blackwell 1000
from hud_ai import RL Trainer

trainer = RL Trainer(
    model="qwen-13b",
    gpu="blackwell-1000",
    scenarios=100,
    epochs=50
)

agent = trainer.train(state_space, action_space, reward_fn)
```

---

## Synthetic Scenario Generation (GenAI)

From [[Chan-Chapter4-8-Generative-Models]] Ch4-8:

### Why Synthetic Data?

- RL agents need 100K+ scenarios
- Real market data limited, especially for rare regimes
- [[Leopold-thesis]]: bottleneck rotations produce asymmetric, fat-tail events
- Need diverse state space coverage for robust training

### Model Selection

| Model | Application | Finance Use |
|-------|-------------|-------------|
| **VAE** | Anomaly detection, representation learning | Bottleneck signal compression, synthetic scenario generation |
| **Flow** | Exact density estimation | Regime-conditioned return distributions P(r_t \| RISK_ON) |
| **WGAN** | Implicit generative modeling | Synthetic market scenario generation for stress testing |

### Synthetic Data Pipeline

```
Real bottleneck data (5+ years)
    ↓
Train VAE: learn bottleneck latent space
Train WGAN: learn regime-specific return distributions
    ↓
Generate 100K+ synthetic scenarios
    ↓
RL Training → RL agent
    ↓
Validate against holdout (2020-2024)
```

### Scenario Distribution

From [[Chan-Agilith-Integration]]:

| Regime | Weight | Count |
|--------|--------|-------|
| RISK_ON | 70% | 70K+ |
| TRANSITION | 20% | 20K+ |
| RISK_OFF | 5% | 5K+ |
| RECOVERY | 5% | 5K+ |

### Bottleneck → Regime Mapping

- Power (BE) constraint → RISK_ON
- Compute (CRWV) supply catching up → TRANSITION
- Memory (MU) normalization → RECOVERY
- RISK_OFF → Black swan (regulatory block, tech disruption)

### HMM vs GMM Contradiction

From [[Chan-Chapter4-8-Generative-Models]]:

- Ch3: "HMM seductive but fictional" → Hidden states not directly useful
- Ch6: Two Sigma uses GMM for regime detection → Works with observable indicators

**Resolution:** Use GMM with observable indicators for [[Regime-modeling]], not pure HMM hidden states. GMM posterior → regime probability.

### RL Training Integration

From [[RocketShip-Framework]]:

```
post_trade_reflection → identify_failure_patterns
         ↑                    ↓
    CAI metalabeling    WGAN synthetic scenarios
         ↑                    ↓
    RL agent ← ← ← ← ← ← ← ← ← ←
```

### Key Formulas

From [[Chan-Agilith-Integration]]:

**Half-life for bottleneck plays:**
```
Half-life = -log(2) / λ
```
If margin expansion half-life = 30 days, hold period = 30 days for Alpha 2 (Margin Before Revenue)

**Kelly fraction (Half-Kelly for fat tails):**
```
f* = m / s^2  (Kelly fraction)
g = r + S^2/2  (max growth rate)
```
Use Half-Kelly (50% reduction) due to fat tails: regulatory block, tech disruption.

---

## Related

- [[4-Month-Build-Plan]] — Month 3 covers RL training
- [[Regime-modeling]] — Regime framework RL conditions on (GMM, not HMM)
- [[Agilith-System-Architecture]] — System RL agent integrates with
- [[RocketShip-Framework]] — 10 tools with generative model connections
- [[Chan-Chapter4-8-Generative-Models]] — VAE, Flow, WGAN for synthetic data
- [[Chan-Agilith-Integration]] — Half-life, Kelly formula, regime mapping
