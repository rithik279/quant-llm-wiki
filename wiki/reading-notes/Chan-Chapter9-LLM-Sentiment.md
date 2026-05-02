---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_files: [raw/books/GenerativeAIForTradingChan.pdf]
related_pages: [Chan-GanAI-Full-Summary, Chan-Agilith-Integration, Agilith-Alpha-Stack-System, Regime-modeling]
status: active
tags: [Chan, GenAI, NLP, sentiment, Fed, Whisper, FinBERT, alternative-data, layer3]
---

# Chan-Ch9: LLM Sentiment in Trading

**System:** Fed press conference video → audio → Whisper (speech-to-text) → FinBERT (sentiment) → enriched price series → trading signals.

**Results:** 14.14% Pearson correlation with forward SPY returns, p=0.199%.

---

## Architecture

```
Video → pytube → Audio → FFmpeg (60s chunks / 30s stride) → Whisper → Text → FinBERT → Sentiment → Signal
```

### Audio Pipeline (prevent look-ahead bias)

1. **pytube:** YouTube video download
2. **FFmpeg segmentation:** 60-second audio chunks every 30 seconds — NOT relying on Whisper timestamps
3. **Embargo period:** Join price data 15 seconds before audio timestamp

Key insight: Whisper timestamp reliability degrades with audio length. Fed conferences = 45-60 min. Use FFmpeg chunk boundaries as ground truth for alignment.

### Whisper (OpenAI)

- 680K hours multilingual/multitask supervised data
- 5 sizes: tiny/base/small/medium/large + .en English-only variants
- 30-second input chunks
- For English-only: .en models perform better (especially tiny.en, base.en)

```python
import whisper
model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
```

### FinBERT (Araci 2019)

- BERT variant fine-tuned for financial sentiment
- Pre-training (MLM + NSP) → fine-tuning on financial text
- Bidirectional context (vs GPT left-to-right)

Why FinBERT over ChatGPT:
- Cost (economic + computational)
- Runs locally (customization + hands-on learning)
- Post-processing for production

### BERT Architecture

- Encoder-only Transformer
- Input: token embedding + position embedding + segment embedding
- Special tokens: [CLS] (classification), [SEP] (sentence separator), [MASK] (MLM)
- Pre-training tasks: Masked Language Modeling + Next Sentence Prediction

---

## Look-Ahead Bias Prevention

| Problem | Solution |
|---------|----------|
| Whisper timestamps unreliable for long audio | Use FFmpeg chunk boundaries as ground truth |
| Price data might align to future audio | Embargo period: join price data 15s before audio timestamp |
| Audio → price misalignment | Audio segmentation BEFORE transcription |

This is directly applicable to any alternative data ingestion pipeline for [[Agilith-Alpha-Stack-System]] Layer 3 (Behavioral/Narrative).

---

## Application to Agilith

### Layer 3 (Behavioral/Narrative)

- **Fed speeches:** Powell press conferences → sentiment → RISK_ON/OFF signal
- **Earnings calls:** Management tone → margin narrative shifts
- **News headlines:** Sentiment on AI infrastructure → bottleneck narrative

### Layer 5 (Timing)

- Sentiment signal enrichment: OHLCV + sentiment → timing entry/exit
- Forward return correlation (14.14%) → signal strength for conviction scoring

### Regime Modeling

Fed narrative shifts → regime change signal → adjust [[Regime-modeling]] RISK_ON/OFF probabilities.

---

## Key Takeaways

1. **LLM sentiment on Fed speeches correlates with forward returns** (14.14% Pearson, p=0.199%)
2. **Prevent look-ahead bias:** Audio segmentation before Whisper, embargo period
3. **FinBERT vs ChatGPT:** Cost + customization + local deployment
4. **Alternative data pipeline:** Video → Audio → Text → Sentiment → Signal
5. **Domain fine-tuning:** Pre-training + finance fine-tuning → domain expertise

---

## See Also

- [[Chan-GanAI-Full-Summary]] — Full book summary
- [[Chan-Agilith-Integration]] — Leopold/Agilith connections
- [[Agilith-Alpha-Stack-System]] — Layer 3 (Behavioral/Narrative)
- [[Regime-modeling]] — Regime indicators from Fed speeches
- [[Machine-Trading-Ch4-AI-ML]] — CAI (Corrective AI) for metalabeling
