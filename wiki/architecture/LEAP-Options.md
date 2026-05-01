---
date_created: 2026-05-01
date_updated: 2026-05-01
source_count: 1
related_pages: [Agilith-Momentum-System, Agilith-Investment-Philosophy]
status: active
tags: [architecture, options, leaps, overlay, leverage]
---

# LEAP Options Overlay

## Hypothesis

Week 15 of the 16-week learning curriculum introduces an options overlay to the core equity strategy.

## Portfolio Structure

| Component | Allocation | Purpose |
|----------|-----------|---------|
| Core Equity | 70% | Main positions in bottleneck plays |
| Satellite | 25% | Higher-conviction smaller positions |
| LEAP Calls | 5% | Asymmetric upside, defined risk |

## LEAP Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Expiry | 12-18 months | Long enough for thesis to develop |
| Strike | 10-20% OTM | Asymmetric payoff, not paying full premium |
| Delta | 0.30-0.50 | Balance between leverage and probability |
| Position size | 5% max | Defined risk, asymmetric upside |

## Why This Structure

### Core Equity (70%)

The 5 core holdings (BE, CRWV, LITE, MU, SNDK) provide:
- Thesis exposure to infrastructure buildout
- Regime-aware positioning
- Systematic rules-based management

### Satellite (25%)

Smaller positions in:
- Emerging bottleneck plays
- Supply chain opportunities
- Higher-conviction shorter-term trades

### LEAP Calls (5%)

Asymmetric exposure:
- Limited downside (paid premium only)
- Unlimited upside (in theory)
- Thesis leverage without full equity risk

## Deployment Condition

**Only deploy LEAP position when conviction score >= 7/10.**

This prevents over-leveraging during low-confidence periods.

## Conviction Score Framework

| Score | Conviction | LEAP Action |
|-------|-----------|-------------|
| 9-10 | Very high | Deploy LEAP |
| 7-8 | High | Deploy LEAP |
| 5-6 | Medium | No LEAP |
| <5 | Low | No position |

## Options Tools

From the tech stack:
- **py_vollib** — Options pricing (Black-Scholes, Greeks)
- **mibian** — Options library for Python

## Connection to Regime Awareness

LEAP overlay is regime-conditional:
- RISK_ON: Conviction threshold met → deploy LEAP
- RISK_OFF: Conviction threshold may not be met → no LEAP
- TRANSITION: Partial conviction → satellite only, no LEAP

## Related

- [[Agilith-Momentum-System]] — Momentum scoring and conviction framework
- [[Agilith-Investment-Philosophy]] — Three-layer investment framework
