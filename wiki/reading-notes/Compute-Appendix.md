---
date_created: 2026-04-30
date_updated: 2026-04-30
source_count: 1
related_pages: [Compute-Scaling, Infrastructure-Buildout]
status: active
tags: [compute, flops, gpu, h100, economics, numbers]
---

# Compute Appendix Data

Detailed calculations and numbers from Situational Awareness appendix.

## Cluster Cost Calculation

### GPT-4 Cluster
- 25k A100s (public estimates)
- $1/A100-hour × 2-3 years ≈ $500M
- Alternatively: $25k per H100 × 10k H100-eq = $250M (just GPUs)
- Nvidia ~50% of cluster cost, rest = power/datacenter/cooling/networking

### H100 Specs
- 700W per H100
- With datacenter overhead (cooling, networking, storage) ~1,400W per H100
- For rough calc: ~1kW per H100-equivalent

## FLOP/$ Improvements Slowing

| Chip Gen | FLOP/$ Improvement |
|----------|-------------------|
| A100 → H100 | ~1.5x (2x chip, 2x cost) |
| H100 → B100 | ~1.5x (2 H100s stapled, <2x cost) |

### Why Slowing
- Already specialized for Transformers
- Already at fp8/fp4 precision
- Moore's Law glacial
- Memory and interconnect improving slower

> "Less than 10x in FLOP/$ over the past decade for top ML GPUs"

### Future
~35%/year improvement in FLOP/$ gives $1T cost for +4 OOM cluster. But datacenter capex gets more expensive (need new power, upfront capex).

## Power Reference Classes

| Cluster Size | Annual Power | Comparison |
|--------------|-------------|------------|
| 10 GW | 87.6 TWh | Oregon = 27 TWh, Washington = 92 TWh |
| 100 GW | 876 TWh | >20% of US electricity (4,250 TWh total) |

## GPU Shipments (2024 Estimate)

Nvidia shipping large numbers of H100s in 2024. (Specific number cut off in source.)

Source: [[Situational-Awareness]] Appendix, pp.162-165

## See Also
- [[Compute-Scaling]]
- [[Infrastructure-Buildout]]