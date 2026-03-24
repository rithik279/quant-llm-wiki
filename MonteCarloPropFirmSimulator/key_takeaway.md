# Key Takeaways From the MT5 HFT Debugging Session

This note captures the main things we learned while fixing the MT5 upload and simulation flow for the high-frequency bot.

## 1. The first bug was not the backend logic, it was the frontend route

The simulator UI was not always pointing at the same backend that we were editing.

- The browser was loading `simulator-ui.html`
- The app was initially checking `https://sim.creditus.ca/healthz`
- The upload flow also tried `https://sim.creditus.ca/upload/mt5`
- Those requests produced `404` and made it look like the system was broken

The important lesson:

- Before changing simulation logic, always confirm which HTML asset the browser is actually loading
- In this project, the live simulator asset and the backend repo were not the same thing
- Cache busting mattered too, because the browser could keep using an older iframe URL even after a deploy

## 2. Opening a POST endpoint in the browser is not a valid test

We saw an error page when visiting:

`https://sim.creditus.ca/api-backend/upload/mt5`

That was misleading because:

- `upload/mt5` is a `POST` endpoint
- Visiting it directly with a browser sends a `GET`
- A proxy or hosting layer can show a `502` or application error page even when the real issue is just that the endpoint is not meant for direct navigation

The practical lesson:

- Use the browser network tab or `curl` with the right HTTP method
- Do not judge an upload endpoint by typing it into the address bar

## 3. The MT5 workbook was high-frequency, not low-frequency

The sample workbook had a lot more activity than a normal day-trade file.

What we saw from the file:

- about `26,600` trades
- across about `22` trading days
- roughly `1,200+` trades per day on average
- some days with well over `2,000` trades

That matters because:

- daily aggregation can hide intraday risk
- a bot can experience long losing streaks inside one day even if the daily total looks fine
- HFT strategies should not be judged like a one-trade-per-day system

The key lesson:

- When the trade density is this high, daily P&L alone is too coarse
- Trade-level sampling is the better default for HFT

## 4. The parser was already giving us the raw ingredients

The MT5 ingestion path turned out to be more capable than we first assumed.

We confirmed that the parser could:

- read realized trade rows
- preserve timestamps when they are present
- sort trade records chronologically
- write a canonical CSV that keeps the original close time where possible

That let us do two things:

- keep an accurate trade sequence for Monte Carlo sampling
- still derive daily summaries when we want a higher-level report

The lesson:

- When debugging data pipelines, check whether the parser already contains the information you need before inventing a workaround

## 5. Daily summary and trade-level simulation are different tools

We learned that both views are useful, but they answer different questions.

### Trade-level simulation

Best for:

- HFT bots
- intraday drawdown risk
- loss streak analysis
- path-dependent behavior

Why it is better here:

- it samples the actual trade list
- it preserves the bot’s granular behavior
- it is less likely to understate risk

### Daily-summary simulation

Best for:

- reporting
- dashboard charts
- quick human-readable summaries
- rules that are truly evaluated on a calendar-day basis

Why it is still useful:

- it gives an easy-to-read summary layer
- it helps compare daily trade density and daily P&L behavior

The main takeaway:

- For MT5 HFT, trade-level should be the default
- Daily summary should be a reporting mode, not the primary risk model

## 6. We had to separate HFT from the old “personal” assumptions

The old simulator logic was built around shared prop-style defaults.

That caused a few hidden assumptions:

- low trade counts per day
- day-based limits as the main driver
- “personal” naming that did not clearly say “HFT”

We fixed this by making the MT5 path explicit:

- `mt5_hft` became the named profile
- MT5 defaults got their own config
- the UI was updated to recognize the new HFT label

The lesson:

- If a strategy type has different behavior, it deserves its own profile name and its own defaults
- Shared defaults are convenient, but they can hide the wrong assumptions

## 7. The simulator needed an explicit mode switch

We added a `mt5_simulation_mode` concept so MT5 can run in either:

- `trade_level`
- `daily_summary`

Why this matters:

- the default should be the most realistic mode for the bot
- the fallback mode should still exist for comparison and reporting
- keeping both paths makes the system easier to validate

The lesson:

- When a simulator can be interpreted in more than one valid way, expose that choice clearly instead of burying it in heuristics

## 8. Keepalive fixes help, but they do not replace correct routing

We also learned that warmup and pinging are separate from routing correctness.

We added:

- a GitHub Actions keepalive workflow that hits `/healthz`
- a Render health ping target
- browser-side warmup checks to avoid cold-start failures

But the big lesson was:

- A keepalive only helps if it points at the correct backend
- It cannot fix a frontend that is still calling the wrong origin

## 9. The debugging order mattered

The work only got stable once we solved the problems in the right order:

1. Fix the frontend to point at the right backend
2. Remove the accidental fallback to the wrong origin
3. Make the MT5 parser preserve timestamps
4. Switch MT5 defaults to HFT-friendly settings
5. Move MT5 simulation to trade-level sampling
6. Keep daily summary as a reporting fallback

The lesson:

- In a system like this, routing, parsing, and simulation logic all depend on each other
- If you fix them in the wrong order, the old assumptions keep leaking back in

## 10. Final conclusion

For this MT5 HFT bot, the simulator should be thought of as:

- a trade-level risk engine first
- a daily-summary reporting layer second

That gives us a model that is:

- closer to the real trading behavior
- less likely to understate intraday risk
- easier to compare against the workbook data
- more honest about what the bot is actually doing

In short:

- the old daily-only approximation was too coarse for HFT
- explicit HFT defaults make the code easier to reason about
- trade-level sampling is the right default for this bot
