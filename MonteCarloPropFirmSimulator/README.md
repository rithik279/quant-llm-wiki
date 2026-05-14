# Monte Carlo Prop Firm Simulator

**Rules-aware account simulator for evaluating trading strategies against proprietary firm constraints.**

Daily backtesting is insufficient for prop-firm accounts. Your strategy might be profitable in aggregate, but fail under intraday loss limits, trailing drawdown mechanics, or green-day eligibility gates. This simulator answers the critical questions: What's my probability of payout? Of blowout? Of being eligible within 21 days? It encodes real Apex 50K rules and runs 10,000+ Monte Carlo paths to give you statistical confidence, not just point estimates.

Designed for prop traders, quants, and portfolio managers evaluating single strategies or screening dozens at once.

---

## Quick Start

### Path A: Web UI (Non-Technical)

1. Start the backend: `python api_server.py` (port 8000)
2. Start the frontend: `cd profitplan-web && npm run dev` (port 3000)
3. Visit `http://localhost:3000/home`
4. Upload a CSV export from MetaTrader 5, NinjaTrader, or TradingView
5. Click "Run Simulation" → See payout probability, equity paths, risk breakdown

### Path B: REST API (Developers)

```python
import requests

# Upload a strategy CSV
with open("my_strategy.csv", "rb") as f:
    resp = requests.post(
        "http://localhost:8000/strategies/upload",
        files={"file": f}
    )
strategy_id = resp.json()["strategy_id"]

# Run until-payout simulation (no time limit)
result = requests.post(
    "http://localhost:8000/analyze/until_payout",
    json={
        "strategy_id": strategy_id,
        "n_sims": 20000,
        "max_days": 90
    }
).json()

print(f"Payout probability: {result['payout_probability']:.1%}")
print(f"Expected payout: ${result['mean_payout']:.2f}")
print(f"Blowout risk: {result['blowout_probability']:.1%}")
```

Or via curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"strategy_id":"abc123","n_sims":20000}' \
  http://localhost:8000/analyze/until_payout
```

---

## What This Simulator Does

### Core Engine

The Monte Carlo simulator samples historical daily P&L and runs each sampled sequence through a complete rules engine. Unlike daily backtests, it produces probability distributions — 10,000 possible account trajectories, each subject to real constraints:

- **Trailing drawdown:** Max $2,500 loss from peak; floor locks at $50,100
- **Daily loss limit:** Hard cap of -$700/day
- **Daily profit cap:** Hard cap of $1,050/day
- **Green-day gate:** Need 5 days with $50+ profit before eligibility
- **Payout threshold:** Account must reach $52,600 to withdraw
- **Concentration rule:** No single day > 30% of total profit

For each sampled path, it tracks: balance, peak, days elapsed, green days, and the outcome (payout, blowout, timeout). Aggregating 10,000 paths gives you precise probabilities and distributions.

### Simulation Modes

- **Until-Payout:** No time pressure. Simulates indefinitely until the account either qualifies for payout or blows up. Answers: "What fraction of traders with my P&L would eventually get approved?"

- **Full-Period:** Realistic 21-day monthly window. Three outcomes: payout, blowout, or still alive at day 21. Answers: "Can I hit the payout target within a single evaluation cycle?"

- **Batch:** Screen multiple CSVs at once. Ranks each by full-period monthly EV (expected value per cycle). Answers: "Which of my 10 strategy variants is most likely to pass?"

- **Portfolio:** Multi-account simulation with optimal allocation search. Answers: "How much capital should I allocate to each strategy to maximize total payout probability?"

### Who Uses It

- **Prop traders:** Evaluating a single strategy before committing to an evaluation account ($5-10K prop company fee)
- **Quant teams:** Screening dozens of variants; automating the "is this worth testing on live account?" decision
- **Portfolio managers:** Allocating capital across multiple approved traders
- **HFT developers:** Testing trade-level (not daily-aggregate) P&L; accounts that scalp 50-100 times per day

### Key Features

- **3 Sampling modes:** Uniform (classical), recency-weighted (favor recent performance), recent-only (last N days only)
- **Trade-level & daily-summary:** MT5 HFT bots sampled per-trade; other strategies aggregated daily
- **Multi-strategy portfolio:** Correlation analysis + allocation optimizer + stress testing
- **Execution quality tracking:** Parse PMT + Tradeovate CSVs; measure slippage, latency, fill rates
- **Automated scoring:** ELITE/STRONG/ACCEPTABLE/MARGINAL/REJECT tier ratings

---

## Core Concepts

### Monte Carlo Sampling

Daily backtests show one historical path; Monte Carlo shows what could happen if your P&L sequence shuffled.

**Why?** Because prop firms care about robustness. Your strategy might be profitable left-to-right but collapse if you happened to trade that sequence in reverse order. Monte Carlo answers: "Under all plausible reshuffles, how often do you still pass the test?"

**Trade-level vs daily-summary:**
- **Daily-summary:** Each day's aggregate PnL is one data point (simplest, fastest)
- **Trade-level:** Each individual trade is sampled independently (critical for HFT; 100+ trades/day can look like monthly aggregates statistically)

**Sampling modes:**

1. **Uniform** — All historical days equally likely. Classic approach.
2. **Recency-weighted** — Recent days are more probable (exponential weight). Your strategy improved lately? This mode assumes it's more likely to repeat. Tuning: `weight_strength=3` (mild), `=6` (strong), `=10` (extreme)
3. **Recent-only** — Sample only from last N days (e.g., last 20 trading days). For strategies that are trending.

### Apex 50K Rules Breakdown

| Rule | Value | Meaning |
|------|-------|---------|
| **Account Size** | $50,000 | Starting capital |
| **Trailing Drawdown** | $2,500 | Max loss from peak balance |
| **Trailing DD Floor** | $50,100 | Lowest point the floor ever goes; locks here |
| **Daily Loss Limit** | -$700 | Single day can't lose more |
| **Daily Profit Cap** | $1,050 | Single day can't gain more |
| **Min Trading Days** | 8 | Total days active before eligible for payout |
| **Min Green Days** | 5 | Days with $50+ profit |
| **Green Day Minimum** | $50 | Minimum to count as a "green day" |
| **Payout Threshold** | $52,600 | Balance must reach this |
| **Max Single Payout** | $2,000 | First withdrawal capped; subsequent payouts allowed |
| **Concentration Rule** | ≤30% | No single day > 30% of total profit |

### Key Output Metrics

After running 10,000 simulations:

- **Payout Probability** — % of paths that reach payout threshold
- **Blowout Probability** — % that hit trailing drawdown floor and fail
- **Timeout Probability** — % still alive at day 21 (unresolved in full-period mode)
- **Expected Payout** — Mean $ value when payout occurs (if it occurs)
- **Days to Payout** — Distribution of how long it took (histogram)
- **Monthly EV** — Gross payout value × payout probability × cycles per month

Example: "Payout prob 72%, Expected payout $1,850 in 18 days" means 7 out of 10 traders with your P&L would pass; those that do withdraw about $1,850 after ~3 weeks.

### Strategy Scoring

Automated tier assignment based on probabilities:

| Tier | Until-Payout | Full-Period | Interpretation |
|------|--------------|-------------|-----------------|
| **ELITE** | >75% | >50% | Strong. Likely to qualify. |
| **STRONG** | 65-75% | 40-50% | Solid. Good odds. |
| **ACCEPTABLE** | 55-65% | 30-40% | Marginal edge. Evaluate variance. |
| **MARGINAL** | 45-55% | 20-30% | Risky. Consider refinement. |
| **REJECT** | <45% | <20% | Not ready for live account. |

---

## Installation & Setup

### Prerequisites

- Python 3.10+ (3.11 recommended)
- Node.js 18+ (LTS)
- PostgreSQL 14+ or Supabase account (for production; SQLite works locally)
- Git

### Backend Setup (FastAPI + Simulation Engine)

```bash
# Clone repository
git clone https://github.com/your-username/MonteCarloPropFirmSimulator.git
cd MonteCarloPropFirmSimulator

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env to add:
#   DATABASE_URL=postgresql://user:password@localhost/simulator
#   ALLOWED_ORIGINS=http://localhost:3000

# Start backend
python api_server.py
```

Backend runs at `http://localhost:8000`. Interactive API docs: `http://localhost:8000/docs`

### Frontend Setup (Next.js + React)

```bash
cd profitplan-web

# Install Node dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Database Setup

**Local Development (SQLite):**
- Strategy registry lives in `strategies.db` (auto-created)
- No external database needed; suitable for testing

**Production (Supabase):**
1. Create Supabase account at https://supabase.com
2. Create a new project
3. Copy connection string (PostgreSQL format)
4. Set `DATABASE_URL` in `.env`
5. Run migrations:
   ```bash
   python -c "import strategy_db; strategy_db.initialize_db()"
   ```

### Deployment (Render.com Example)

**Backend Service:**
- Runtime: Python 3.11
- Build: `pip install -r requirements.txt`
- Start: `python api_server.py`
- Environment: `DATABASE_URL` (Supabase), `ALLOWED_ORIGINS` (frontend URL)

**Frontend Service:**
- Runtime: Node 18
- Build: `npm install && npm run build`
- Start: `npm run start`
- Environment: `NEXT_PUBLIC_API_URL` (backend URL)

**Keepalive:**
- GitHub Actions workflow that pings `/healthz` every hour (prevents cold-start timeouts)

---

## API Endpoints

All endpoints accept JSON request bodies and return JSON. Interactive Swagger docs at `http://localhost:8000/docs`.

### Strategy Management

#### `POST /strategies/upload`
Upload a strategy CSV file and register it.

**Request:**
```bash
curl -F "file=@strategy.csv" http://localhost:8000/strategies/upload
```

**Response:**
```json
{
  "strategy_id": "abc123def456",
  "filename": "strategy.csv",
  "uploaded_at": "2025-05-13T10:30:00Z",
  "source": "mt5"
}
```

#### `GET /strategies`
List all registered strategies.

**Response:**
```json
{
  "strategies": [
    {
      "strategy_id": "abc123def456",
      "filename": "my_scalper.csv",
      "uploaded_at": "2025-05-13T10:30:00Z",
      "source": "mt5",
      "num_trades": 1250
    }
  ]
}
```

#### `GET /strategies/{strategy_id}/features`
Get calculated statistics (win rate, Sharpe, profit factor, etc.).

#### `DELETE /strategies/{strategy_id}`
Remove a strategy and its CSV file from disk.

---

### Single-Account Analysis

#### `POST /analyze/until_payout`
Run Monte Carlo until first payout or blowout (no time limit).

**Request:**
```json
{
  "strategy_id": "abc123def456",
  "n_sims": 20000,
  "max_days": 90,
  "sampling_mode": "recency_weighted",
  "weight_strength": 6
}
```

**Response:**
```json
{
  "payout_probability": 0.72,
  "blowout_probability": 0.18,
  "timeout_probability": 0.10,
  "mean_payout": 1850.50,
  "mean_days": 18.3,
  "equity_paths": [[50000, 50300, 49800, ...], ...],
  "histogram": {
    "payout_days": [0, 0, 0, 100, 250, 400, ...],
    "payout_amounts": [0, 0, 50, 200, 800, ...]
  }
}
```

#### `POST /analyze/full_period`
Run Monte Carlo for fixed 21-day window (realistic monthly evaluation).

**Request:**
```json
{
  "strategy_id": "abc123def456",
  "n_sims": 10000
}
```

**Response:**
```json
{
  "payout_probability": 0.54,
  "blowout_probability": 0.32,
  "timeout_probability": 0.14,
  "mean_payout_if_success": 1620.00,
  "monthly_ev": 870.00
}
```

---

### Multi-Strategy Tools

#### `POST /analyze/batch`
Screen multiple strategy CSVs, ranked by expected monthly value.

**Request:**
```json
{
  "csv_paths": ["strategy1.csv", "strategy2.csv", "strategy3.csv"],
  "n_sims": 5000
}
```

**Response:**
```json
{
  "ranked": [
    {
      "csv_path": "strategy2.csv",
      "payout_prob_until": 0.68,
      "payout_prob_full": 0.51,
      "monthly_ev": 920.00,
      "tier": "STRONG"
    },
    {
      "csv_path": "strategy1.csv",
      "payout_prob_until": 0.62,
      "payout_prob_full": 0.45,
      "monthly_ev": 780.00,
      "tier": "ACCEPTABLE"
    }
  ]
}
```

#### `POST /portfolio/correlation`
Pairwise correlation analysis across multiple strategies.

#### `POST /portfolio/multi_account`
Run N concurrent Apex accounts on one strategy, independent P&L paths.

#### `POST /portfolio/optimize`
Tournament search for optimal capital allocation across strategies.

---

### Execution & Journal

#### `POST /execution/upload`
Upload PMT (order source) and Tradeovate (execution) CSVs. Matches fills, measures slippage and latency.

#### `GET /execution/sessions`
List all execution analysis sessions with metrics.

#### `GET /journal`
Retrieve trade history (opens, closes, P&L).

---

## Usage Examples

### Python — Analyze a Single Strategy

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# 1. Upload CSV
with open("my_scalper.csv", "rb") as f:
    upload_resp = requests.post(
        f"{BASE_URL}/strategies/upload",
        files={"file": f}
    )
strategy_id = upload_resp.json()["strategy_id"]
print(f"Uploaded as: {strategy_id}")

# 2. Run until-payout simulation
sim_resp = requests.post(
    f"{BASE_URL}/analyze/until_payout",
    json={
        "strategy_id": strategy_id,
        "n_sims": 20000,
        "max_days": 60,
        "sampling_mode": "uniform"
    }
)
result = sim_resp.json()

# 3. Interpret results
print(f"Payout probability: {result['payout_probability']:.1%}")
print(f"Blowout risk: {result['blowout_probability']:.1%}")
print(f"Expected payout: ${result['mean_payout']:.2f}")
print(f"Days to payout (mean): {result['mean_days']:.1f}")

# 4. Save equity paths for charting
with open("equity_paths.json", "w") as f:
    json.dump(result["equity_paths"], f)
```

### Batch Screening — Find Best Variant

```python
import requests

BASE_URL = "http://localhost:8000"

# Analyze multiple strategy CSV files
csv_files = [
    "scalper_v1.csv",
    "scalper_v2.csv",
    "scalper_v3.csv"
]

batch_resp = requests.post(
    f"{BASE_URL}/analyze/batch",
    json={
        "csv_paths": csv_files,
        "n_sims": 5000
    }
)

ranked = batch_resp.json()["ranked"]

# Print ranked by monthly EV
for i, strategy in enumerate(ranked, 1):
    print(f"{i}. {strategy['csv_path']}")
    print(f"   Full-period pass: {strategy['payout_prob_full']:.1%}")
    print(f"   Monthly EV: ${strategy['monthly_ev']:.0f}")
    print(f"   Tier: {strategy['tier']}")
```

### Next.js Frontend — Upload & Simulate

```typescript
// profitplan-web/app/simulator/page.tsx (simplified)
export default function Simulator() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const uploadResp = await fetch("http://localhost:8000/strategies/upload", {
      method: "POST",
      body: formData,
    });
    const { strategy_id } = await uploadResp.json();
    
    // Run simulation
    const simResp = await fetch("http://localhost:8000/analyze/full_period", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strategy_id, n_sims: 10000 }),
    });
    const result = await simResp.json();
    
    // Display results
    setResults(result);
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {results && (
        <>
          <p>Payout: {(results.payout_probability * 100).toFixed(1)}%</p>
          <p>Blowout: {(results.blowout_probability * 100).toFixed(1)}%</p>
          <EquityChart paths={results.equity_paths} />
        </>
      )}
    </div>
  );
}
```

---

## Project Structure

```
MonteCarloPropFirmSimulator/
├── apex_engine_v3_1.py              # Core Monte Carlo simulator
│   └─ Apex 50K rules, daily PnL sampling, path simulation
├── apex_engine_v2_0.py              # Legacy trade-level engine (for HFT)
├── api_server.py                    # FastAPI REST layer
│   └─ Endpoint definitions, schema validation, request routing
├── engine_interface.py              # Pure interface (no side effects)
│   └─ analyze_until_payout, analyze_batch, run_multi_account, etc.
├── portfolio_optimizer.py           # Multi-strategy allocation search
│   └─ Tournament search, correlation analysis, stress testing
├── strategy_analyzer.py             # Feature extraction & scoring
│   └─ Win rate, Sharpe, profit factor, tier assignment
├── strategy_db.py                   # Strategy registry (Postgres/SQLite)
│   └─ CRUD operations, deduplication, leaderboard queries
├── strategy_correlation_analyzer.py # Pairwise correlation metrics
├── rulesets.py                      # Ruleset definitions
│   └─ APEX_50K_LEGACY, APEX_50K_EOD, ALPHA_FUTURES_50K_ZERO
├── routers/                         # Modular FastAPI routes
│   ├── upload_mt5.py               # MetaTrader 5 CSV ingestion
│   ├── upload_ninjatrader.py       # NinjaTrader CSV ingestion
│   ├── execution.py                # Execution quality analysis
│   └── journal.py                  # Trade journal CRUD
├── services/                        # Business logic services
│   └── monte_carlo_service.py      # Configuration-driven simulator
├── strategies/                      # Directory for uploaded CSV files
├── profitplan-web/                 # Next.js frontend
│   ├── app/
│   │   ├── simulator/page.tsx      # Main simulator UI
│   │   ├── home/page.tsx           # Landing page
│   │   ├── execution/page.tsx      # Execution dashboard
│   │   └── journal/page.tsx        # Trading journal viewer
│   ├── components/                 # Reusable React components
│   ├── public/                     # Static assets
│   └── package.json
├── requirements.txt                # Python dependencies
├── VERSION_HISTORY.md              # Detailed changelog (61KB+)
├── codebase_overview_and_skills.md # Architecture deep dive
├── key_takeaway.md                 # MT5 HFT learnings
└── README.md                       # This file
```

---

## Architecture Overview

```
┌──────────────────────────────────────┐
│  Web Browser / REST Client           │
└─────────────────────┬────────────────┘
                      │ HTTP/JSON
                      ▼
┌──────────────────────────────────────┐
│  FastAPI Server (api_server.py)      │
│  ├─ /strategies/*                    │
│  ├─ /analyze/*                       │
│  ├─ /portfolio/*                     │
│  ├─ /execution/*                     │
│  └─ /journal/*                       │
└─────────────────────┬────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌────────────┐ ┌──────────┐ ┌─────────────┐
   │  engine_   │ │portfolio_│ │ strategy_   │
   │interface.py│ │optimizer │ │analyzer.py  │
   └─────┬──────┘ └──────────┘ └─────────────┘
         │
         ▼
   ┌────────────────────────────────────┐
   │  Simulation Engines                │
   │  ├─ apex_engine_v3_1.py           │
   │  │  └─ Monte Carlo + rule logic   │
   │  └─ apex_engine_v2_0.py           │
   │     └─ Trade-level sampling (HFT)│
   └────────────────────────────────────┘
                      │
        ┌─────────────┼──────────────┐
        │             │              │
        ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐ ┌─────────────┐
   │strategy_ │  │strategy_ │ │execution_db │
   │db.py     │  │ csv CSVs │ │(exec data)  │
   │(registry)│  │(uploaded)│ │             │
   └────┬─────┘  └──────────┘ └─────────────┘
        │
        ▼
   ┌──────────────────┐
   │  PostgreSQL      │
   │  (Supabase)      │
   │  or SQLite       │
   └──────────────────┘
```

**Data Flow:**

1. **CSV Upload** → Parsed into daily P&L array (or trade-level for MT5)
2. **Simulation** → 10,000 Monte Carlo paths through rule engine
3. **Aggregation** → Probabilities, distributions, metrics
4. **Response** → JSON with equity paths, histograms, tier rating
5. **Persistence** → Strategy metadata + results stored in database for leaderboard/comparison

---

## Related Documentation

- **[codebase_overview_and_skills.md](codebase_overview_and_skills.md)** — Complete architectural reference. All modules, classes, and functions explained. Read this to understand how pieces fit together.

- **[VERSION_HISTORY.md](VERSION_HISTORY.md)** — 61KB changelog. Chronological history from v1.0.0 to present. Use this to find when a feature was added, or debug across versions.

- **[key_takeaway.md](key_takeaway.md)** — HFT and MetaTrader 5 learnings. Why trade-level sampling matters for scalpers. Account lockout mechanics. Essential reading if you run MT5 bots.

---

## Troubleshooting

### Backend not running / "Connection refused"
- Ensure `python api_server.py` started successfully (watch for errors)
- Check that port 8000 is not in use: `lsof -i :8000` (Mac/Linux) or `netstat -ano | findstr :8000` (Windows)
- Verify CORS: if frontend is on different origin, ensure `ALLOWED_ORIGINS` is set in `.env`

### "Database connection error"
- If using Postgres: verify `DATABASE_URL` in `.env` is correct format (`postgresql://user:pass@host/db`)
- If using SQLite: ensure `strategies.db` file exists (created on first run)
- Check file permissions: `strategies.db` must be readable/writable

### CSV parsing fails / "Invalid CSV format"
- Ensure CSV has columns: `Type`, `Date and time`, `Net P&L USD` (whitespace-stripped)
- MetaTrader 5: Export trades as CSV from History tab
- NinjaTrader: Use "Order List" export, not "Trade P&L"
- TradingView: Export via "Download Trades" button

### Cold-start latency on Render.com
- First request after idle period will be slow (Render spins down services)
- Use GitHub Actions keepalive: run `curl http://api.yourdomain.com/healthz` every 60 minutes
- See deployment section above for example

---

## FAQ

### What's the difference between "until-payout" and "full-period"?

**Until-Payout:** Runs indefinitely (up to `max_days`, default 90) until either the account qualifies for payout OR blows up. Useful for edge-case analysis: "In the best case, how likely am I to eventually pass?" No time constraint.

**Full-Period:** Realistic 21-day window (one evaluation cycle). Three outcomes: payout, blowout, or timeout (still alive at day 21). Useful for real-world planning: "Can I hit the target within one monthly cycle?"

### Why does my profitable strategy show low payout probability?

Common reasons:
1. **Drawdown mechanics:** High peak-to-valley swings trigger trailing drawdown floor too early
2. **Daily caps:** Volatile days that exceed ±$1,050 are clamped, changing distribution shape
3. **Green-day gate:** Need 5 days with $50+ profit; your strategy clusters large wins (fewer days)
4. **Sampling noise:** With short history (10-20 days), Monte Carlo variance is high
5. **Concentration rule:** One day > 30% of total profit disqualifies you

**Solution:** Review equity paths histogram. If most paths blow up on day 2-3, you have an early drawdown problem (not fixable by simulator). If you timeout frequently, you need faster capital growth or fewer big loss days.

### How do I compare strategies fairly?

Use **full-period mode + batch endpoint**. It ranks by "monthly EV" = payout probability × expected payout × cycles per month. This accounts for both reliability (pass rate) and return (payout size).

Avoid "until-payout" mode for comparison; it's biased toward strategies with long tails that eventually spike.

### Can I run this locally without PostgreSQL?

Yes. SQLite works out-of-the-box. Set `DATABASE_URL` to `sqlite:///strategies.db` or leave it empty (defaults to SQLite). Performance is fine for local development and small batches. For production or concurrent requests, upgrade to Postgres/Supabase.

### My strategy has 10,000 trades. Should I use trade-level sampling?

Use trade-level sampling (MT5 HFT mode) if your account takes >50 trades/day. The engine will sample individual trades and group them by date, preserving daily P&L distribution. Useful for scalpers. If your strategy averages <10 trades/day, daily-summary mode is fine and faster.

---

## Contributing & Development

### Adding a New Simulation Mode

1. Define rules in `rulesets.py`:
   ```python
   MY_NEW_FIRM = {
       "name": "My New Firm 50K",
       "account_size": 50_000.0,
       "trailing_dd": 2_000.0,
       # ... other parameters
   }
   ```

2. Register it:
   ```python
   _REGISTRY["my_new_firm"] = MY_NEW_FIRM
   ```

3. Use it in simulation:
   ```python
   result = simulate_path(daily_pnl, ruleset=MY_NEW_FIRM)
   ```

### Adding a New CSV Ingestion Format

1. Create `routers/upload_myformat.py`:
   ```python
   from fastapi import APIRouter, File, UploadFile
   from pathlib import Path
   
   router = APIRouter(prefix="/strategies")
   
   @router.post("/upload/myformat")
   async def upload_myformat(file: UploadFile):
       # Parse file → DataFrame with columns [date, pnl]
       # Save to strategies/ directory
       # Return {"strategy_id": ..., "filename": ...}
       pass
   ```

2. Mount in `api_server.py`:
   ```python
   from routers.upload_myformat import router as upload_myformat_router
   app.include_router(upload_myformat_router)
   ```

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit with conventional commits: `git commit -m "feat: add new endpoint"`
3. Open PR, ensure tests pass
4. Merge to `main`
5. GitHub Actions automatically deploys to Render

---

## License & Support

This project is open-source under the MIT License.

For issues, feature requests, or questions:
- GitHub Issues: [your-repo]/issues
- Discussions: [your-repo]/discussions

---

**Built for traders who take statistics seriously.**
