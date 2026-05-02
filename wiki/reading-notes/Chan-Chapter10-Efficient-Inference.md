---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_files: [raw/books/GenerativeAIForTradingChan.pdf]
related_pages: [Chan-GanAI-Full-Summary, Chan-Agilith-Integration, Leopold-thesis, Bottleneck-analysis]
status: active
tags: [Chan, GenAI, inference, distillation, quantization, efficient, LoRA, scaling]
---

# Chan-Ch10: Efficient Inference

**Problem:** Large models (BERT-Large, GPT-3, PaLM) = high inference cost. "Typical ML workflow evolved: train → compress → deploy."

---

## Scaling Laws (Kaplan et al. 2020)

Power-law relationship:
```
performance ∝ (model params)^-α × (data)^-β × (compute)^-γ
```

All three must scale in tandem. Performance gains predictable from scaling alone.

### Emergent Abilities (Wei et al. 2022, 2023)

- "Ability is emergent if not present in smaller models but present in larger models"
- Cannot predict from scaling laws alone
- Chain-of-thought prompting: math reasoning emerges above ~100B params
- Training FLOPs threshold (~10^20) must be reached

Key implication: Larger models = new capabilities. But also = compute/memory bottleneck.

---

## Compression Techniques

### 1. Knowledge Distillation

**Concept:** Small student learns from large teacher.

**Process:**
1. Train teacher (larger, slower)
2. Student learns from data + teacher soft targets
3. Student ≈ teacher performance at higher speed

**Response-based knowledge (Hinton et al. 2015):**
- Teacher softmax probability distribution → soft targets
- Temperature scaling: T > 1 → softer distribution
- KL divergence loss: align student vs teacher distributions

**Formula:**
```
L_total = α × L_ce(hard targets) + (1-α) × T² × KL(teacher soft targets || student soft targets)
```

**Case study:** FinBERT → FinBERT-lite via distillation.

**Analogy:** Textbook (data) + Expert lectures (teacher) → better than either alone.

### 2. Model Quantization

**Types:** FP32 → FP16 → INT8 → INT4

- Reduces weight precision
- Memory footprint ∝ precision reduction
- Speed ∝ bandwidth savings

**Implementation:** Post-training quantization (no fine-tuning needed).

### 3. LoRA (Low-Rank Adaptation)

- Fine-tune only low-rank decomposition of weights
- Leave pre-trained weights frozen
- Reduces trainable parameters significantly

### 4. Parameter Pruning

- Remove redundant weights
- Structured (remove entire neurons) vs unstructured

---

## eBay Case Study (Xue et al. 2023)

- eBERT: BERT fine-tuned on eBay product titles
- Outperformed vanilla BERT on eBay tasks
- Too large for latency requirements
- Applied model compression → met latency specs
- Optimized for CPU inference

---

## Application to Agilith

### [[Leopold-thesis]] Connections

**Compute bottleneck (CRWV):** Large model inference = compute-constrained → distillation = direct solution.

**Memory bottleneck (MU):** Quantization → smaller memory footprint → solves MU constraint.

**Inference cost = alpha killer:** High inference cost per prediction → reduces Sharpe. Compression preserves alpha.

### Practical Use Cases

| Bottleneck | Compression Technique | Benefit |
|-----------|----------------------|---------|
| Compute (CRWV) | Distillation | Smaller model, less FLOPs |
| Memory (MU) | Quantization | Smaller weights, less VRAM |
| Storage (SNDK) | Both | Fewer weights to store |
| Optical (LITE) | LoRA | Less bandwidth for weight updates |

### Implementation

- **Local inference:** Mistral 7B / Qwen on Blackwell GPU → quantized INT8 → fits in VRAM
- **Sentiment pipeline (Ch9):** FinBERT quantized → run locally → no API cost
- **RL agent:** Distilled policy → faster inference → lower latency for trading signals

---

## Key Takeaways

1. **Scaling laws:** Performance ∝ params + data + compute (power law). Must scale all three together.
2. **Emergent abilities:** Appear above threshold scale, cannot predict from scaling laws alone.
3. **Distillation:** Small student learns from large teacher via soft targets + temperature.
4. **Quantization:** FP32 → INT8 → INT4. Memory/bandwidth savings.
5. **LoRA:** Fine-tune only low-rank weights. Efficient domain adaptation.
6. **Direct Leopold fit:** Distillation/quantization solve compute/memory bottlenecks directly.

---

## See Also

- [[Chan-GanAI-Full-Summary]] — Full book summary
- [[Chan-Agilith-Integration]] — Leopold/Agilith connections
- [[Leopold-thesis]] — Bottleneck rotation context
- [[Bottleneck-analysis]] — 5 bottlenecks with compression implications
- [[Agilith-Tooling-Stack]] — Implementation with Mistral 7B
