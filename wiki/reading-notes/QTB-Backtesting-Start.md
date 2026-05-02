---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 2
source_files: [raw/books/Quantitative Trading.pdf, raw/books/AlgorithmicTradingChan.pdf]
related_pages: [Chan-Chapter1-Backtesting, Chan-RiskManagement, Chan-Chapter2-MeanReversion, QTB-Chapter7-SpecialTopics, Agilith-System-Architecture, 4-Month-Build-Plan]
status: active
tags: [chan, backtesting, execution, survivorship-bias, data-quality, strategy-selection]
---

# QTB Ch1-3: Getting Started + Backtesting

QTB = entry-level version of Chan material. More basic than "Algorithmic Trading."

## Strategy Selection (Ch1)

**Find strategy that suits you:**
- Working hours (intraday vs overnight)
- Programming skills (Excel → MATLAB → C++)
- Trading capital ($30K min, $100K recommended)
- Goal (income vs wealth accumulation)

**Strategy quality checklist:**
1. Compare to benchmark? Consistent returns?
2. Max drawdown — depth and duration?
3. Transaction costs impact?
4. Survivorship bias in data?
5. Performance over years — stable or decay?
6. Data-snooping bias?
7. Capacity — "fly under radar" of institutions?

## Backtesting Pitfalls (Ch3)

### Survivorship Bias
Data missing delisted/bankrupt stocks.

**Impact:** MR strategies short acquired (price spike) + buy bankrupt (price zero) — both lose. But these stocks missing from biased data → backtest looks better than reality.

**Fix:** Use survivorship-bias-free databases (Table 3.1 lists sources).

### Look-Ahead Bias
Uses future data for current signal.

**Fix:** Same code for backtest + live. Only diff = data source.

### Data-Snooping Bias
Too many parameters → fits random noise.

**Fix:** Out-of-sample testing. Cross-validation. Simple/linear models preferred.

### Transaction Costs
Often underestimated.

**Impact:** MR strategies particularly vulnerable (many trades, small profits).

**Fix:** Factor 0.1-0.5% round-trip cost minimum.

## Performance Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| Sharpe Ratio | (mean - rf) / std | > 1.0 |
| Max Drawdown | max(peak-trough)/peak | < 20% |
| Calmar Ratio | annual return / MDD | > 1.5 |
| Win Rate | wins / total trades | > 50% (for MR) |

## Backtesting Platforms

- Excel: Good for beginners, slow for large data
- MATLAB: Chan preferred, good for prototyping
- TradeStation: Good for intraday, limited to certain markets
- High-end: Deltix, custom C++ for production

## Connection to Agilith

- [[4-Month-Build-Plan]] Month 1 Week 1 → data stack includes survivorship-bias-free data
- [[Chan-Chapter1-Backtesting]] → same pitfalls expanded in Algorithmic Trading
- [[Agilith-Data-Stack]] → data quality checks (split/dividend adjusted, survivorship-free)
- [[RL-Training-Setup]] → data-snooping awareness critical for RL training
- [[Chan-RiskManagement]] → Kelly formula + leverage discussed

## Cross-Book Notes

**QTB vs Algorithmic Trading:**
- QTB: Entry-level, Excel/MATLAB focus, basic examples
- Algorithmic: Advanced, covers more strategies, more mathematical depth
- Ch3 in QTB = Ch1 in Algorithmic Trading (both on backtesting)

**Consistent across both:**
- Same pitfalls emphasized (look-ahead, data-snooping, survivorship)
- Simple/linear models preferred
- Regime shifts can invalidate backtests

## See Also

- [[Chan-Chapter1-Backtesting]] — Full backtesting chapter from Algorithmic Trading
- [[Chan-RiskManagement]] — Risk management (Kelly, leverage)
- [[QTB-Chapter7-SpecialTopics]] — Mean reversion vs momentum, regime switching, cointegration
- [[Agilith-Data-Stack]] — Data sources and quality requirements
- [[4-Month-Build-Plan]] — Implementation timeline