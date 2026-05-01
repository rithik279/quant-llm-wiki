#!/usr/bin/env node

/**
 * Test Suite for Portfolio Agent
 * Validates setup and tests core functionality
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// TEST UTILITIES
// ============================================================================

class Tester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async test(name, fn) {
    try {
      await fn();
      this.passed++;
      console.log(`✓ ${name}`);
    } catch (error) {
      this.failed++;
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}`);
    }
  }

  summary() {
    console.log("\n" + "=".repeat(60));
    console.log(`Tests: ${this.passed + this.failed} | ✓ ${this.passed} | ✗ ${this.failed}`);
    console.log("=".repeat(60));
    return this.failed === 0;
  }
}

// ============================================================================
// TESTS
// ============================================================================

async function runTests() {
  const tester = new Tester();

  console.log("╔" + "═".repeat(58) + "╗");
  console.log("║" + "  Portfolio Agent - Test Suite".padEnd(59) + "║");
  console.log("╚" + "═".repeat(58) + "╝\n");

  // Test 1: Environment
  console.log("Environment Tests:");
  console.log("-".repeat(60));

  await tester.test("Node.js version check", async () => {
    const version = process.version;
    const major = parseInt(version.split(".")[0].substring(1));
    if (major < 18) throw new Error(`Node.js 18+ required, found ${version}`);
  });

  await tester.test(".env file exists", async () => {
    if (!fs.existsSync(".env")) throw new Error(".env not found");
  });

  await tester.test(".env has ANTHROPIC_API_KEY", async () => {
    const env = fs.readFileSync(".env", "utf-8");
    if (!env.includes("ANTHROPIC_API_KEY")) {
      throw new Error("ANTHROPIC_API_KEY not in .env");
    }
  });

  console.log("\n");

  // Test 2: Dependencies
  console.log("Dependency Tests:");
  console.log("-".repeat(60));

  await tester.test("package.json exists", async () => {
    if (!fs.existsSync("package.json")) throw new Error("package.json not found");
  });

  await tester.test("node_modules exists", async () => {
    if (!fs.existsSync("node_modules")) {
      throw new Error("node_modules not found - run npm install");
    }
  });

  await tester.test("@anthropic/sdk installed", async () => {
    const pkgPath = path.join(
      process.cwd(),
      "node_modules",
      "@anthropic-ai",
      "sdk"
    );
    if (!fs.existsSync(pkgPath)) {
      throw new Error("@anthropic-ai/sdk not installed");
    }
  });

  console.log("\n");

  // Test 3: File Structure
  console.log("File Structure Tests:");
  console.log("-".repeat(60));

  const requiredFiles = [
    "portfolio-agent-system.js",
    "scheduler.js",
    "news-module.js",
    "ibkr-module.js",
    "package.json",
    "README.md",
  ];

  for (const file of requiredFiles) {
    await tester.test(`${file} exists`, async () => {
      if (!fs.existsSync(file)) throw new Error(`${file} not found`);
    });
  }

  console.log("\n");

  // Test 4: Data Directories
  console.log("Data Directory Tests:");
  console.log("-".repeat(60));

  await tester.test("./agent-data directory exists", async () => {
    if (!fs.existsSync("agent-data")) fs.mkdirSync("agent-data", { recursive: true });
  });

  await tester.test("./agent-data/logs exists", async () => {
    if (!fs.existsSync("agent-data/logs"))
      fs.mkdirSync("agent-data/logs", { recursive: true });
  });

  await tester.test("./agent-data/news-cache exists", async () => {
    if (!fs.existsSync("agent-data/news-cache"))
      fs.mkdirSync("agent-data/news-cache", { recursive: true });
  });

  console.log("\n");

  // Test 5: Configuration
  console.log("Configuration Tests:");
  console.log("-".repeat(60));

  await tester.test("Load portfolio config", async () => {
    const agent = require("./portfolio-agent-system.js");
    // Just check it imports without error
    if (!agent) throw new Error("Failed to load agent");
  });

  await tester.test("Load news module", async () => {
    const NewsModule = require("./news-module.js");
    const news = new NewsModule();
    if (!news) throw new Error("Failed to load news module");
  });

  await tester.test("Load IBKR module", async () => {
    const IBKRClient = require("./ibkr-module.js");
    const ibkr = new IBKRClient();
    if (!ibkr) throw new Error("Failed to load IBKR module");
  });

  console.log("\n");

  // Test 6: Anthropic API (if key provided)
  console.log("API Integration Tests:");
  console.log("-".repeat(60));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey && apiKey !== "sk-ant-...your-api-key...") {
    await tester.test("Anthropic API key is valid", async () => {
      if (!apiKey.startsWith("sk-ant-")) {
        throw new Error("Invalid API key format");
      }
    });

    // Optional: Test API connection
    // (Commented out to avoid unnecessary API calls)
    // await tester.test('Connect to Anthropic API', async () => {
    //   const Anthropic = require('@anthropic-ai/sdk');
    //   const client = new Anthropic({apiKey});
    //   // Don't actually call - just verify client creation
    //   if (!client) throw new Error('Failed to create API client');
    // });
  } else {
    console.log("⚠ Anthropic API key not configured (skipping API tests)");
  }

  console.log("\n");

  // Test 7: Utilities
  console.log("Utility Tests:");
  console.log("-".repeat(60));

  await tester.test("Can read portfolio file", async () => {
    if (!fs.existsSync("README.md")) throw new Error("README.md not found");
    const content = fs.readFileSync("README.md", "utf-8");
    if (content.length < 100) throw new Error("README.md seems empty");
  });

  await tester.test("Can write to agent-data", async () => {
    const testFile = "agent-data/test.json";
    fs.writeFileSync(testFile, JSON.stringify({ test: true }));
    const content = fs.readFileSync(testFile, "utf-8");
    if (!content.includes("test")) throw new Error("Write test failed");
    fs.unlinkSync(testFile);
  });

  console.log("\n");

  // Summary
  if (tester.summary()) {
    console.log("\n✓ All tests passed! You're ready to go.\n");
    console.log("Quick start:");
    console.log("  npm run daily      # Run daily agent");
    console.log("  npm run weekly     # Run weekly ranker");
    console.log("  npm run schedule   # Enable scheduler\n");
    process.exit(0);
  } else {
    console.log(
      "\n✗ Some tests failed. Please review errors above and fix.\n"
    );
    process.exit(1);
  }
}

// ============================================================================
// MAIN
// ============================================================================

runTests().catch((error) => {
  console.error("Test runner error:", error);
  process.exit(1);
});
