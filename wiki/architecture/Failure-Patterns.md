---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [Agilith-Momentum-System, Agilith-System-Architecture]
status: active
tags: [architecture, learning, feedback, post-trade, patterns]
---

# Post-Trade Learning: Failure Patterns and Reflection

## The Learning Loop

Trading without learning = running in circles. The system needs to:
1. Record every trade decision
2. Evaluate the outcome
3. Identify patterns in mistakes
4. Adjust behavior

## Agent Scenarios: Post-Trade Reflection

One of the four agent scenarios is specifically for learning:

> "What worked? What didn't? How does it update my thesis?"

After each trade, the agent reflects:
- Was the thesis correct?
- Did the signal quality match conviction?
- Was the regime assumption right?
- What would I change?

## Failure Pattern Identification

### Types of Failure Patterns

**Thesis Failure:**
- Bottleneck analysis was wrong
- The company doesn't actually solve the bottleneck
- Market didn't care about the thesis

**Timing Failure:**
- Right thesis, wrong time
- Entry too early or too late
- Didn't wait for confirmation

**Regime Failure:**
- Treat signals the same in all regimes
- Didn't condition on market state
- Position size not adjusted for regime

**Signal Failure:**
- False breakout
- Fake momentum
- Sentiment didn't translate to price action

**Size Failure:**
- Position too large → forced exit
- Position too small → didn't matter
- Didn't adjust for conviction

## Tool: identify_failure_patterns

From RocketShip's 10 tools:

**Input:** Trade history
**Output:** Patterns in losing trades

```python
{
  "pattern_type": "regime_failure",
  "frequency": "3 of last 5 RISK_OFF trades",
  "description": "Taking same signals during RISK_OFF as RISK_ON",
  "recommendation": "Require 8/10 conviction during RISK_OFF before entering"
}
```

## Tool: post_trade_reflection

**Input:** Trade just executed
**Output:** Was it wise? What would you change?

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

## Tool: adjust_factor_weights

**Input:** Regime, signal quality
**Output:** New weights for Leopold factors

Different regimes call for different factor emphasis:

| Regime | Technical Weight | Sentiment Weight | Catalyst Weight |
|--------|----------------|-----------------|----------------|
| RISK_ON | 35% | 20% | 20% |
| TRANSITION | 25% | 30% | 25% |
| RISK_OFF | 20% | 35% | 15% |
| RECOVERY | 30% | 25% | 25% |

## The Overfitting Insight

> "Overfitting as feature — identify conditions that made strategy work → reuse when repeat"

This applies to failure patterns too:
- When did the strategy fail?
- Under what conditions?
- What was different about those periods?

Understanding failure conditions is as valuable as understanding success conditions.

## Building the Pattern Library

Over time, the system accumulates:
- Common failure modes
- Regime-specific pitfalls
- Signal quality patterns
- Size management errors

This library becomes a checklist the agent runs before entering new positions.

## Related

- [[Agilith-System-Architecture]] — System this fits into
- [[Agilith-Momentum-System]] — Momentum system this feeds back into
