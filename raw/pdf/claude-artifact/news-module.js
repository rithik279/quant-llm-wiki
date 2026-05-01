/**
 * News Module
 * Fetch news from NewsAPI for portfolio tickers and infrastructure themes
 */

const axios = require("axios");
const fs = require("fs");

// ============================================================================
// CONFIG
// ============================================================================

const NEWS_CONFIG = {
  // Get from https://newsapi.org/ (free tier available)
  apiKey: process.env.NEWSAPI_KEY || "YOUR_NEWSAPI_KEY_HERE",

  // News sources focused on tech/finance
  sources:
    "techcrunch,theverge,cnbc,reuters,bloomberg,hackernews,cryptopanic",

  // Cache time (5 minutes)
  cacheTime: 5 * 60 * 1000,
};

// ============================================================================
// NEWS FETCHER
// ============================================================================

class NewsModule {
  constructor() {
    this.cache = {};
    this.cacheDir = "./agent-data/news-cache";

    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    this.loadCache();
  }

  loadCache() {
    try {
      const cacheFile = `${this.cacheDir}/news-cache.json`;
      if (fs.existsSync(cacheFile)) {
        this.cache = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
      }
    } catch (e) {
      console.warn("Failed to load news cache:", e.message);
    }
  }

  saveCache() {
    const cacheFile = `${this.cacheDir}/news-cache.json`;
    fs.writeFileSync(cacheFile, JSON.stringify(this.cache, null, 2));
  }

  isCacheValid(key) {
    return (
      this.cache[key] &&
      Date.now() - this.cache[key].timestamp < NEWS_CONFIG.cacheTime
    );
  }

  /**
   * Fetch news for a ticker
   */
  async fetchTickerNews(ticker, days = 7) {
    const cacheKey = `ticker-${ticker}-${days}d`;

    if (this.isCacheValid(cacheKey)) {
      console.log(`[NEWS] Using cached results for ${ticker}`);
      return this.cache[cacheKey].data;
    }

    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const fromDateStr = fromDate.toISOString().split("T")[0];

      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: ticker,
          sortBy: "publishedAt",
          language: "en",
          from: fromDateStr,
          apiKey: NEWS_CONFIG.apiKey,
        },
      });

      const articles = response.data.articles.slice(0, 20); // Top 20

      this.cache[cacheKey] = {
        timestamp: Date.now(),
        data: articles,
      };

      this.saveCache();

      return articles;
    } catch (error) {
      console.error(`Failed to fetch news for ${ticker}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch news for a theme/keyword
   */
  async fetchThemeNews(theme, keywords, days = 1) {
    const cacheKey = `theme-${theme}-${days}d`;

    if (this.isCacheValid(cacheKey)) {
      console.log(`[NEWS] Using cached theme results for ${theme}`);
      return this.cache[cacheKey].data;
    }

    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const fromDateStr = fromDate.toISOString().split("T")[0];

      // Search for combined keywords
      const query = keywords.join(" OR ");

      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: query,
          sortBy: "publishedAt",
          language: "en",
          from: fromDateStr,
          pageSize: 30,
          apiKey: NEWS_CONFIG.apiKey,
        },
      });

      const articles = response.data.articles.slice(0, 15); // Top 15

      this.cache[cacheKey] = {
        timestamp: Date.now(),
        data: articles,
      };

      this.saveCache();

      return articles;
    } catch (error) {
      console.error(`Failed to fetch theme news for ${theme}:`, error.message);
      return [];
    }
  }

  /**
   * Summarize articles for sentiment/catalyst extraction
   */
  summarizeArticles(articles) {
    if (!articles || articles.length === 0) {
      return {
        count: 0,
        headlines: [],
        sources: [],
        sentiment_keywords: [],
      };
    }

    const bullishKeywords = [
      "surge",
      "soar",
      "beat",
      "growth",
      "strong",
      "bullish",
      "demand",
      "deal",
      "investment",
      "expansion",
      "record",
    ];
    const bearishKeywords = [
      "plunge",
      "crash",
      "miss",
      "decline",
      "weak",
      "bearish",
      "supply",
      "pressure",
      "risk",
      "shortage",
      "delay",
    ];

    let bullishCount = 0;
    let bearishCount = 0;

    const headlines = articles.map((a) => ({
      title: a.title,
      source: a.source.name,
      published: a.publishedAt,
    }));

    const combinedText = articles
      .map((a) => (a.title + " " + (a.description || "")).toLowerCase())
      .join(" ");

    bullishKeywords.forEach((kw) => {
      bullishCount += (combinedText.match(new RegExp(kw, "g")) || []).length;
    });

    bearishKeywords.forEach((kw) => {
      bearishCount += (combinedText.match(new RegExp(kw, "g")) || []).length;
    });

    const sentiment =
      bullishCount > bearishCount ? "bullish" : bearishCount > bullishCount ? "bearish" : "neutral";
    const sentimentScore = (bullishCount - bearishCount) / (bullishCount + bearishCount || 1);

    return {
      count: articles.length,
      headlines: headlines.slice(0, 10),
      sources: [...new Set(headlines.map((h) => h.source))],
      bullish_signals: bullishCount,
      bearish_signals: bearishCount,
      sentiment,
      sentiment_score: sentimentScore.toFixed(2),
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = NewsModule;

// ============================================================================
// STANDALONE USAGE
// ============================================================================

if (require.main === module) {
  (async () => {
    const news = new NewsModule();

    console.log("Fetching news for portfolio tickers...\n");

    // Fetch ticker news
    const crwvNews = await news.fetchTickerNews("CRWV", 3);
    console.log("CRWV News Summary:");
    console.log(JSON.stringify(news.summarizeArticles(crwvNews), null, 2));

    console.log("\nFetching theme news (Compute Infrastructure)...\n");

    // Fetch theme news
    const computeNews = await news.fetchThemeNews("compute", [
      "GPU",
      "data center",
      "AI compute",
      "H100",
    ]);
    console.log("Compute Theme Summary:");
    console.log(JSON.stringify(news.summarizeArticles(computeNews), null, 2));
  })();
}
