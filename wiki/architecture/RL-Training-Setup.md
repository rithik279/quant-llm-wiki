---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [4-Month-Build-Plan, Agilith-System-Architecture, Regime-modeling]
status: active
tags: [architecture, rl, training, hud-ai, scenarios]
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

## Related

- [[4-Month-Build-Plan]] — Month 3 covers RL training
- [[Regime-modeling]] — Regime framework RL conditions on
- [[Agilith-System-Architecture]] — System RL agent integrates with
