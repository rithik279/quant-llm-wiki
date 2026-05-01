#!/usr/bin/env node

/**
 * Portfolio Agent System
 * Daily monitoring + weekly ranking for growth equity portfolio
 * Theme: Compute infrastructure bottlenecks (Leopold Aschenbrenner - Situational Awareness)
 */

const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const client = new Anthropic();

// ============================================================================
// CONFIG
// ============================================================================

const CONFIG = {
  // Portfolio holdings (from your IBKR)
  portfolio: {
    BE: { name: "Bloom Energy", weight: 0.2174, price: 50.55, theme: "power" },
    CRWV: {
      name: "CoreWeave",
      weight: 0.4307,
      price: 47.44,
      theme: "compute",
    },
    LITE: {
      name: "Lumentum",
      weight: 0.0586,
      price: 51.39,
      theme: "optical",
    },
    MU: { name: "Micron", weight: 0.0442, price: 21.85, theme: "memory" },
    SNDK: { name: "SanDisk", weight: 0.0654, price: 64.74, theme: "storage" },
    SPY: { name: "S&P 500", weight: 0.1416, price: 101.1, theme: "hedge" },
  },

  // Screener criteria (from your TradingView setup)
  screener: {
    marketCapMin: 2000000000, // $2B+
    perfYTD: 0,
    priceVolume1M: 200000000, // $200M+
    betaMin: 1.0,
    smaCriteria: {
      sma200LtPrice: true,
      sma150GtSma200: true,
      sma50GtSma150: true,
      sma20GtSma50: true,
    },
    highBelow52W: { minPct: 0, maxPct: 5 },
    newHigh52W: true,
    adr: 0.02, // 2%+
  },

  // Themes to monitor (bottlenecks)
  themes: [
    {
      id: "power",
      keywords: [
        "power generation",
        "electricity production",
        "grid",
        "renewable energy",
      ],
      tickers: ["BE"],
    },
    {
      id: "compute",
      keywords: [
        "GPU",
        "compute cluster",
        "data center",
        "AI infrastructure",
        "H100",
      ],
      tickers: ["CRWV"],
    },
    {
      id: "memory",
      keywords: [
        "DRAM",
        "memory chips",
        "semiconductor",
        "HBM",
        "packaging",
      ],
      tickers: ["MU"],
    },
    {
      id: "storage",
      keywords: ["flash memory", "SSD", "NAND", "storage", "data"],
      tickers: ["SNDK"],
    },
    {
      id: "optical",
      keywords: [
        "optical",
        "interconnect",
        "coherent",
        "transceiver",
        "fiber",
      ],
      tickers: ["LITE"],
    },
  ],

  // Data files
  dataDir: "./agent-data",
  portfolioHistoryFile: "./agent-data/portfolio-history.json",
  newsHistoryFile: "./agent-data/news-history.json",
  ranksFile: "./agent-data/weekly-ranks.json",
  suggestionsFile: "./agent-data/suggestions.json",
};

// ============================================================================
// TOOLS FOR CLAUDE AGENT
// ============================================================================

const tools = [
  {
    name: "fetch_portfolio_news",
    description:
      "Fetch recent news for portfolio tickers and infrastructure themes (power, compute, memory, storage, optical)",
    input_schema: {
      type: "object",
      properties: {
        theme_id: {
          type: "string",
          enum: ["power", "compute", "memory", "storage", "optical"],
          description: "Infrastructure theme to search news for",
        },
        days_back: {
          type: "integer",
          description: "Number of days back to search (default 1)",
          default: 1,
        },
      },
      required: ["theme_id"],
    },
  },
  {
    name: "analyze_sentiment",
    description:
      "Analyze sentiment of news/events for a specific ticker or theme",
    input_schema: {
      type: "object",
      properties: {
        ticker_or_theme: {
          type: "string",
          description: "Ticker or theme ID (e.g., BE, CRWV, power, compute)",
        },
        events: {
          type: "array",
          description: "List of news events or catalysts",
          items: { type: "string" },
        },
      },
      required: ["ticker_or_theme", "events"],
    },
  },
  {
    name: "screen_candidates",
    description:
      "Find candidates matching screener criteria in a given theme. Returns filtered list with technical scores.",
    input_schema: {
      type: "object",
      properties: {
        theme_id: {
          type: "string",
          enum: ["power", "compute", "memory", "storage", "optical"],
          description: "Theme to screen within",
        },
        exclude_holdings: {
          type: "boolean",
          description: "Exclude current holdings from results",
          default: true,
        },
      },
      required: ["theme_id"],
    },
  },
  {
    name: "rank_and_score_candidates",
    description:
      "Score candidates based on screener criteria, momentum, sentiment, and bottleneck relevance. Used for weekly ranking.",
    input_schema: {
      type: "object",
      properties: {
        candidates: {
          type: "array",
          description: "List of candidate tickers to score",
          items: { type: "string" },
        },
        weights: {
          type: "object",
          description:
            "Scoring weights (technical, momentum, sentiment, catalyst)",
          properties: {
            technical: { type: "number", default: 0.3 },
            momentum: { type: "number", default: 0.25 },
            sentiment: { type: "number", default: 0.25 },
            catalyst: { type: "number", default: 0.2 },
          },
        },
      },
      required: ["candidates"],
    },
  },
  {
    name: "detect_bottleneck_emergence",
    description:
      "Identify emerging bottlenecks or new opportunities not yet in mainstream radar based on news analysis and infrastructure trends",
    input_schema: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          description:
            'Theme to analyze (e.g., "power", "memory", "packaging", "cooling")',
        },
        recent_news_summary: {
          type: "string",
          description: "Summary of recent news and catalysts in this theme",
        },
      },
      required: ["theme", "recent_news_summary"],
    },
  },
  {
    name: "suggest_trades",
    description:
      "Generate trade suggestions based on analysis (buy, hold, reduce, exit)",
    input_schema: {
      type: "object",
      properties: {
        analysis: {
          type: "object",
          description: "Consolidated analysis including sentiment, technicals, catalysts",
          properties: {
            portfolio_catalyst_summary: { type: "string" },
            top_candidate_tickers: { type: "array", items: { type: "string" } },
            emerging_themes: { type: "array", items: { type: "string" } },
            risk_factors: { type: "array", items: { type: "string" } },
          },
        },
      },
      required: ["analysis"],
    },
  },
];

// ============================================================================
// TOOL IMPLEMENTATIONS (MOCK/SIMULATED)
// ============================================================================

async function processTool(toolName, toolInput) {
  console.log(`\n[TOOL] ${toolName}`, JSON.stringify(toolInput, null, 2));

  switch (toolName) {
    case "fetch_portfolio_news": {
      // Simulate fetching news from NewsAPI or similar
      const theme = CONFIG.themes.find((t) => t.id === toolInput.theme_id);
      return {
        theme: theme.id,
        news_summary: `Recent developments in ${theme.id}:
        - 2024-04-24: Global AI data center buildout accelerates, enterprise GPU demand up 40% YoY
        - 2024-04-23: US grid capacity constraints easing with new solar/wind projects
        - 2024-04-22: Memory shortage risks declining as TSMC capacity expands
        - 2024-04-20: Optical interconnect demand from AI cluster builders reaching critical mass
        - 2024-04-18: Power consumption of next-gen GPUs forcing data center redesigns`,
        sentiment: "bullish",
        catalysts: [
          "AI buildout acceleration",
          "Infrastructure investment",
          "Supply chain normalization",
        ],
      };
    }

    case "analyze_sentiment": {
      const tickerOrTheme = toolInput.ticker_or_theme;
      const eventCount = toolInput.events.length;
      return {
        subject: tickerOrTheme,
        events_analyzed: eventCount,
        sentiment_score: 0.7, // -1 to 1, higher is bullish
        sentiment: "bullish",
        key_drivers: [
          "AGI infrastructure buildout demand",
          "Supply constraints creating pricing power",
          "Government investment signals",
        ],
        risks: ["Competition from new entrants", "Execution risks"],
      };
    }

    case "screen_candidates": {
      const theme = CONFIG.themes.find((t) => t.id === toolInput.theme_id);
      // Simulate screener results
      const mockCandidates =
        {
          power: [
            { ticker: "AEE", name: "Ameren", score: 8.2 },
            { ticker: "NEE", name: "NextEra Energy", score: 7.9 },
            { ticker: "CEG", name: "Constellation Energy", score: 8.5 },
          ],
          compute: [
            { ticker: "NVDA", name: "Nvidia", score: 9.1 },
            { ticker: "RKLB", name: "Rocket Lab", score: 7.3 },
          ],
          memory: [
            { ticker: "SK", name: "SK Hynix", score: 8.3 },
            { ticker: "TSM", name: "TSMC", score: 8.7 },
          ],
          storage: [
            { ticker: "WDC", name: "Western Digital", score: 7.8 },
            { ticker: "KIOXIA", name: "Kioxia", score: 7.5 },
          ],
          optical: [
            { ticker: "JDSU", name: "Viavi Solutions", score: 7.6 },
            { ticker: "AAOI", name: "Applied Optoelectronics", score: 7.2 },
          ],
        }[theme.id] || [];

      return {
        theme: theme.id,
        candidates_found: mockCandidates.length,
        candidates: mockCandidates,
        screener_criteria_met:
          "Market cap > $2B, YTD > 0%, Price*Vol > $200M, Beta > 1, SMA alignment, new highs, ADR > 2%",
      };
    }

    case "rank_and_score_candidates": {
      const candidates = toolInput.candidates || [];
      const weights = toolInput.weights || {
        technical: 0.3,
        momentum: 0.25,
        sentiment: 0.25,
        catalyst: 0.2,
      };

      const ranks = candidates.map((ticker) => ({
        ticker,
        technical_score: Math.random() * 10,
        momentum_score: Math.random() * 10,
        sentiment_score: Math.random() * 10,
        catalyst_score: Math.random() * 10,
        composite_score:
          Math.random() * 10,
        rank_position: Math.floor(Math.random() * candidates.length) + 1,
        recommendation:
          Math.random() > 0.5 ? "BUY" : "ACCUMULATE",
      }));

      return {
        week_of: new Date().toISOString().split("T")[0],
        candidates_ranked: ranks.length,
        ranks: ranks.sort((a, b) => b.composite_score - a.composite_score),
      };
    }

    case "detect_bottleneck_emergence": {
      const theme = toolInput.theme;
      return {
        detected_theme: theme,
        emerging_bottlenecks: [
          {
            name: "Power delivery to GPUs",
            severity: "high",
            affected_areas: [
              "Power distribution",
              "Cooling solutions",
              "Packaging",
            ],
            candidate_plays: ["BE", "CEG", "CRWV"],
          },
          {
            name: "AI memory bandwidth constraints",
            severity: "high",
            affected_areas: ["HBM packaging", "Memory controllers", "Interconnects"],
            candidate_plays: ["MU", "SK", "LITE"],
          },
        ],
        timeline: "Critical by Q4 2024",
      };
    }

    case "suggest_trades": {
      const analysis = toolInput.analysis;
      return {
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            action: "HOLD_CORE",
            tickers: ["CRWV", "MU"],
            rationale: "Compute and memory are central to buildout; no sell signals",
            conviction: "high",
          },
          {
            action: "ACCUMULATE",
            tickers: ["BE"],
            rationale: "Power generation bottleneck intensifying",
            conviction: "medium",
          },
          {
            action: "MONITOR",
            tickers: ["LITE"],
            rationale: "Optical interconnect demand visible but execution risk",
            conviction: "medium",
          },
          {
            action: "ADD_NEW_POSITIONS",
            new_tickers: ["CEG", "NVDA"],
            rationale: "Power generation and compute foundational plays",
            conviction: "medium",
          },
        ],
        portfolio_health: "Aligned with infrastructure theme; concentrated positions appropriate",
      };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ============================================================================
// CLAUDE AGENT ORCHESTRATION
// ============================================================================

async function runDailyAgent() {
  console.log("\n" + "=".repeat(80));
  console.log("DAILY PORTFOLIO AGENT - " + new Date().toISOString());
  console.log("=".repeat(80));

  const systemPrompt = `You are a sophisticated portfolio agent for a concentrated growth equity portfolio focused on AGI infrastructure bottlenecks (Leopold Aschenbrenner - Situational Awareness thesis).

Your portfolio:
${Object.entries(CONFIG.portfolio)
  .map(
    ([ticker, data]) =>
      `- ${ticker}: ${data.name} (${data.theme}, weight: ${(data.weight * 100).toFixed(1)}%)`
  )
  .join("\n")}

Your mandate:
1. Monitor daily news for portfolio tickers and infrastructure themes (power, compute, memory, storage, optical)
2. Detect sentiment shifts and emerging catalysts
3. Identify bottleneck plays not yet on mainstream radar
4. Generate daily trade suggestions (hold/accumulate/reduce/exit)
5. Flag emerging opportunities aligned with situational awareness thesis

Use tools to:
- Fetch news for each theme and portfolio holding
- Analyze sentiment and catalyst impact
- Screen for new opportunities matching criteria
- Rank candidates by conviction
- Suggest tactical adjustments

Provide a structured daily brief with key takeaways, risk factors, and actionable suggestions.`;

  const messages = [
    {
      role: "user",
      content: `Run daily portfolio review. 

Focus on:
1. News sentiment for all portfolio themes (power, compute, memory, storage, optical)
2. Any emerging bottlenecks or new opportunities
3. Scoring top screener candidates for next week
4. Trade suggestions for today

Use tools to gather analysis, then provide consolidated recommendations.`,
    },
  ];

  let response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: tools,
    messages: messages,
  });

  // Agentic loop: process tool calls until no more
  while (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use"
    );

    // Process all tool calls and collect results
    const toolResults = [];
    for (const toolUse of toolUseBlocks) {
      const result = await processTool(toolUse.name, toolUse.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    // Continue conversation with tool results
    messages.push({
      role: "assistant",
      content: response.content,
    });

    messages.push({
      role: "user",
      content: toolResults,
    });

    response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: tools,
      messages: messages,
    });
  }

  // Extract final text response
  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  console.log("\n" + "=".repeat(80));
  console.log("AGENT ANALYSIS & RECOMMENDATIONS");
  console.log("=".repeat(80));
  console.log(finalResponse);

  // Save to file
  if (!fs.existsSync(CONFIG.dataDir)) {
    fs.mkdirSync(CONFIG.dataDir, { recursive: true });
  }

  const suggestion = {
    timestamp: new Date().toISOString(),
    analysis: finalResponse,
  };

  fs.writeFileSync(
    CONFIG.suggestionsFile,
    JSON.stringify(suggestion, null, 2)
  );

  return suggestion;
}

async function runWeeklyRanker() {
  console.log("\n" + "=".repeat(80));
  console.log("WEEKLY SCREENER RANKER - " + new Date().toISOString());
  console.log("=".repeat(80));

  const systemPrompt = `You are a weekly portfolio optimizer. Your task:

1. Screen for high-quality growth candidates in AGI infrastructure themes
2. Rank by composite score (technical, momentum, sentiment, catalysts)
3. Identify top 5-10 candidates per theme for weekly rebalancing consideration
4. Assess portfolio concentration vs opportunity cost

Use screening and ranking tools to find next-week opportunities.`;

  const messages = [
    {
      role: "user",
      content: `Execute weekly screener ranking. 

For each theme (power, compute, memory, storage, optical):
1. Screen for candidates matching our criteria
2. Rank them by composite score (30% technical, 25% momentum, 25% sentiment, 20% catalyst)
3. Identify top 3 opportunities per theme
4. Flag any emerging bottleneck plays

Provide weekly rankings with conviction levels.`,
    },
  ];

  let response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: tools,
    messages: messages,
  });

  while (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use"
    );

    const toolResults = [];
    for (const toolUse of toolUseBlocks) {
      const result = await processTool(toolUse.name, toolUse.input);
      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({
      role: "assistant",
      content: response.content,
    });

    messages.push({
      role: "user",
      content: toolResults,
    });

    response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools: tools,
      messages: messages,
    });
  }

  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  console.log("\n" + "=".repeat(80));
  console.log("WEEKLY RANKINGS");
  console.log("=".repeat(80));
  console.log(finalResponse);

  if (!fs.existsSync(CONFIG.dataDir)) {
    fs.mkdirSync(CONFIG.dataDir, { recursive: true });
  }

  const ranks = {
    week_of: new Date().toISOString().split("T")[0],
    analysis: finalResponse,
  };

  fs.writeFileSync(CONFIG.ranksFile, JSON.stringify(ranks, null, 2));

  return ranks;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || "daily";

  try {
    if (mode === "daily") {
      await runDailyAgent();
    } else if (mode === "weekly") {
      await runWeeklyRanker();
    } else {
      console.log("Usage: node portfolio-agent-system.js [daily|weekly]");
    }
  } catch (error) {
    console.error("Agent error:", error);
    process.exit(1);
  }
}

main();
