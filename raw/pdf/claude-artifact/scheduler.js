#!/usr/bin/env node

/**
 * Scheduler for Portfolio Agent
 * - Daily run at market open + end of day
 * - Weekly ranking on Friday close
 */

const schedule = require("node-schedule");
const { spawn } = require("child_process");
const fs = require("fs");

// ============================================================================
// SCHEDULING CONFIG
// ============================================================================

const SCHEDULE = {
  // Daily agent: 9:30 AM ET (market open)
  dailyOpen: "30 9 * * 1-5", // Mon-Fri 9:30 AM
  // Daily agent: 4:00 PM ET (market close)
  dailyClose: "0 16 * * 1-5", // Mon-Fri 4:00 PM
  // Weekly ranker: Friday 5:00 PM ET (after market close)
  weeklyRank: "0 17 * * 5", // Friday 5:00 PM
};

// ============================================================================
// JOB RUNNERS
// ============================================================================

function runAgent(mode) {
  return new Promise((resolve, reject) => {
    console.log(
      `\n[${new Date().toISOString()}] Starting ${mode} agent...`
    );

    const proc = spawn("node", ["portfolio-agent-system.js", mode], {
      stdio: "inherit",
    });

    proc.on("exit", (code) => {
      if (code === 0) {
        console.log(`\n[${new Date().toISOString()}] ${mode} agent completed`);
        resolve();
      } else {
        reject(new Error(`Agent exited with code ${code}`));
      }
    });

    proc.on("error", reject);
  });
}

async function dailyOpenJob() {
  try {
    await runAgent("daily");
  } catch (error) {
    console.error("Daily (open) job failed:", error.message);
    logError("daily-open", error);
  }
}

async function dailyCloseJob() {
  try {
    await runAgent("daily");
  } catch (error) {
    console.error("Daily (close) job failed:", error.message);
    logError("daily-close", error);
  }
}

async function weeklyRankJob() {
  try {
    await runAgent("weekly");
  } catch (error) {
    console.error("Weekly rank job failed:", error.message);
    logError("weekly", error);
  }
}

function logError(jobName, error) {
  const logDir = "./agent-data/logs";
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    job: jobName,
    error: error.message,
    stack: error.stack,
  };

  fs.appendFileSync(
    `${logDir}/errors.json`,
    JSON.stringify(logEntry) + "\n"
  );
}

// ============================================================================
// SCHEDULER INITIALIZATION
// ============================================================================

function initScheduler() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║          Portfolio Agent Scheduler Initialized                 ║
╚════════════════════════════════════════════════════════════════╝

Schedule:
  Daily (Market Open):   ${SCHEDULE.dailyOpen}  (9:30 AM ET, Mon-Fri)
  Daily (Market Close):  ${SCHEDULE.dailyClose} (4:00 PM ET, Mon-Fri)
  Weekly Ranking:        ${SCHEDULE.weeklyRank} (Friday 5:00 PM ET)

Log files: ./agent-data/logs/
Suggestions: ./agent-data/suggestions.json
Rankings: ./agent-data/weekly-ranks.json

Press Ctrl+C to stop.
  `);

  // Schedule daily jobs
  schedule.scheduleJob(SCHEDULE.dailyOpen, dailyOpenJob);
  schedule.scheduleJob(SCHEDULE.dailyClose, dailyCloseJob);

  // Schedule weekly ranking
  schedule.scheduleJob(SCHEDULE.weeklyRank, weeklyRankJob);

  console.log(
    `Scheduler ready at ${new Date().toISOString()}\n`
  );
}

// ============================================================================
// MAIN
// ============================================================================

initScheduler();

// Keep process running
process.on("SIGINT", () => {
  console.log("\nScheduler stopped.");
  process.exit(0);
});
