---
date_created: 2026-05-02
date_updated: 2026-05-02
source_count: 1
source_file: raw/books/Quantitative Trading_ How to Build Your Own Algorithmic Trading Business-Wiley.pdf
related_pages: [Chan-Chapter1-Backtesting, Chan-Chapter2-MeanReversion, Chan-RiskManagement, QTB-Chapter7-SpecialTopics, Agilith-System-Architecture, 4-Month-Build-Plan]
status: active
tags: [chan, QTB, full-book, strategy-selection, backtesting, execution, risk-management, regime-switching]
---

# QTB Full Book Summary

"Quantitative Trading: How to Build Your Own Algorithmic Trading Business" — 204 pages. Entry-level Chan book.

## Chapter 1: The Whats, Whos, and Whys

**Key insights:**
- Quantitative trading = algorithmic trading = computer algorithms based on historical performance
- NOT just technical analysis — includes fundamental data, news events
- PhD physics → lost money at institutions. Quit. Traded simplest strategies → profitable.
- "Make everything as simple as possible. But not simpler." — Einstein

**Who can become a quant trader:**
- No advanced degree needed for statistical arbitrage (stocks, futures, currencies)
- Basic high school math/stats/programming sufficient
- Requires: savings to withstand losses, emotional balance between fear/greed

**Business case:**
- Scalable (just change leverage number, no banker needed)
- Low time demand (automation)
- Start small ($50K), scale as you learn
- NOT get-rich-quick

## Chapter 2: Fishing for Ideas

**Find strategy that suits you:**
| Factor | Consideration |
|--------|--------------|
| Working hours | Intraday vs overnight? |
| Programming skills | Excel → MATLAB → C++ |
| Trading capital | $30K min, $100K recommended |
| Goal | Income vs wealth accumulation |

**Strategy evaluation checklist:**
1. Compare to benchmark? Consistent returns?
2. **Max drawdown** — depth and duration?
3. **Transaction costs** — will it survive fees?
4. **Survivorship bias** in data?
5. Performance over years — stable or decaying?
6. **Data-snooping bias**?
7. Capacity — "fly under radar" of institutions?

**Key quote:** "You should hope to have steadily increasing profits, but most likely it won't be 200 percent a year."

## Chapter 3: Backtesting

**Platform comparison:**
| Platform | Pros | Cons |
|----------|------|------|
| Excel | Good for beginners | Slow for large data |
| MATLAB | Chan's preferred | Expensive |
| TradeStation | Good for intraday | Limited markets |
| High-end | Industrial strength | Expensive/complex |

**Data quality checks:**
- Split/dividend adjusted?
- **Survivorship bias free?** (missing delisted/bankrupt stocks)
- High/low data — survivorship bias affects these especially

**Performance metrics:**
- Sharpe ratio (annualized)
- Max drawdown (depth + duration)
- Win rate, avg profit/loss

**Common pitfalls:**
| Pitfall | What | Fix |
|---------|------|-----|
| Look-ahead bias | Uses future data | Same code for backtest + live |
| Data-snooping | Too many params | Out-of-sample testing, simple models |
| Transaction costs | Underestimated | Factor 0.1-0.5% minimum |
| Survivorship bias | Missing delisted stocks | Use survivorship-free database |

**Performance measurement:**
- Annualized return
- Sharpe ratio
- Max drawdown
- Win rate

**Strategy refinement process:**
1. Run backtest
2. Identify weaknesses
3. Modify (BUT: be careful of data-snooping)
4. Test on out-of-sample data

## Chapter 4: Setting Up Your Business

**Business structure options:**
- Retail trading (individual)
- Proprietary trading firm (lower capital req, higher leverage)

**Choosing a brokerage:**
- For retail: IBKR, Lightspeed, etc.
- For prop: more leverage available
- Consider: commissions, data costs, execution quality

**Infrastructure:**
- Reliable internet connection
- Backup power
- Redundant systems

## Chapter 5: Execution Systems

**Automation levels:**
1. **Semiautomated:** Generate order file manually, upload to basket trader
2. **Fully automated:** Program handles everything

**Automated system benefits:**
- Faithful adherence to backtested strategy
- Run multiple strategies simultaneously
- Speed (critical for HFT)

**Paper trading to discover:**
- Software bugs
- Look-ahead / data-snooping bias
- Operational difficulties
- Transaction cost estimates
- P&L volatility intuition

**Why live performance diverges:**
1. Bugs in strategy/execution
2. Transaction costs higher than expected
3. Strategy has data-snooping bias
4. Regime shift

**Minimizing transaction costs:**
- Order size relative to avg volume (market impact)
- Order size relative to market cap
- Venue selection

## Chapter 6: Money and Risk Management

**Kelly formula derivation:**
```
Multi-strategy: F* = C^(-1) * M
  where C = covariance matrix, M = mean excess returns

Single strategy: f* = m / s^2
  where m = mean return, s^2 = variance
```

**Max growth rate:** `g = r + S^2/2` where S = Sharpe ratio

**Key insight — geometric vs arithmetic mean:**
- Arithmetic mean of random walk = 0
- Geometric mean = m - s^2/2 < 0
- Even fair game → expected loss due to volatility drag
- **Risk always decreases long-term growth**

**Half-Kelly:** Reduce recommended leverage by 50% (estimation error, non-Gaussian returns)

**Leverage constraints:** Retail accounts limited to 2x (overnight) or 4x (intraday)

**Rebalancing:** Update daily as equity changes. 6-month lookback for 1-day holding period.

**Risk management tools:**
- Position limits
- Stop losses
- Equity stops (halt if equity drops below threshold)
- Drawdown limits

**Personal failure story:** Added $100M to portfolio after 6-month good run → $1M loss. "Superbly performing model at greatest risk of huge loss due to overconfidence."

## Chapter 7: Special Topics

See [[QTB-Chapter7-SpecialTopics]] for full details.

**Summary:**
- Mean reversion vs momentum (both can work)
- Regime switching (HMM vs turning points)
- Stationarity + cointegration
- Factor models
- Exit strategies
- Seasonal + HFT strategies

## Chapter 8: Conclusion

**Why independent traders can succeed:**
1. No institutional constraints (leverage limits, position limits, marketing)
2. Can "fly under radar" with small cap strategies
3. Faster decision-making
4. Keep strategy proprietary

**Next steps:**
1. Pick a strategy
2. Backtest
3. Paper trade
4. Start small, scale up

**Key quotes:**
- "Independent traders can challenge powerful industry participants at their own game"
- "Simple but profitable strategies beat complex losing ones"

## Cross-Book Synthesis

| QTB Chapter | Algorithmic Trading Equivalent |
|-------------|-------------------------------|
| Ch1-3 (Start + Backtest) | Ch1 (Backtesting) |
| Ch6 (Risk) | Ch8 (Risk Management) |
| Ch7 (Special Topics) | Ch2 (Mean Reversion) + Ch6 (Momentum) |

**Key differences:**
- QTB = entry-level, Excel/MATLAB focus, basic examples
- Algorithmic = advanced, more math, more strategies

**Consistent across both:**
- Simple/linear models preferred
- Data quality critical
- Regime shifts can invalidate backtests
- Kelly formula as optimal leverage framework

## Agilith Connections

| QTB Topic | Agilith Wiki |
|-----------|-------------|
| Strategy selection | [[Agilith-Research-Plan]] |
| Backtesting pitfalls | [[Chan-Chapter1-Backtesting]] |
| Risk management | [[Chan-RiskManagement]], [[RL-Training-Setup]] |
| Regime switching | [[Regime-modeling]], [[Agilith-Custom-Indicators]] |
| Execution systems | [[Agent-Tools]] |
| Business setup | [[4-Month-Build-Plan]] Month 4 |

## See Also

- [[Chan-Chapter1-Backtesting]] — Advanced backtesting
- [[Chan-Chapter2-MeanReversion]] — Statistical tests
- [[Chan-Chapter6-Momentum]] — Momentum strategies
- [[Chan-RiskManagement]] — Risk management
- [[QTB-Chapter7-SpecialTopics]] — Special topics details
- [[QTB-RiskManagement]] — Kelly derivation
- [[4-Month-Build-Plan]] — Implementation timeline