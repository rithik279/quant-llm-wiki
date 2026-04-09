"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Database,
  FileUp,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  UploadCloud,
  Clock3,
} from "lucide-react";

type TradeSource = "TradingView" | "NinjaTrader";
type Outcome = "Pass" | "Fail" | "Active";

type TradeRow = {
  timestamp: string;
  pnl: number;
  tradeId: string;
  dayId: string;
  source: TradeSource;
};

type DayBucket = { dayId: string; trades: TradeRow[] };

type TrackerEntry = {
  id: string;
  firm: string;
  accountLabel: string;
  attemptedAt: string;
  openedAt: string;
  outcome: Outcome;
  evalCost: number;
  activationFee: number;
  notes: string;
  strategyVersion: string;
  source: TradeSource;
};

type Rules = {
  presetName: string;
  accountSize: number;
  profitTarget: number;
  drawdown: number;
  dailyLossLimit: number;
  drawdownType: "EOD" | "INTRADAY";
  contractsMini: number;
  contractsMicro: number;
  minDaysToPass: number;
  holdThroughNews: boolean;
  evalCost: number;
  activationFee: number;
  fundedAccountValue: number;
  oneDayPass: boolean;
};

type SimulationResult = {
  simulations: number;
  totalDays: number;
  passRate: number;
  zeroPassRate: number;
  expectedPassesPerDay: number;
  costPerFundedAccount: number;
  netEVPerDay: number;
  avgWinsBeforeLoss: number;
  avgPnLBeforeLoss: number;
  avgPassesPerDay: number;
  probabilities: Array<{ threshold: number; rate: number }>;
  passDistribution: Array<{ label: string; value: number }>;
  samplePaths: Array<{ label: string; points: number[] }>;
};

const STORAGE_KEY = "passplan-tracker-v1";

const DEFAULT_RULES: Rules = {
  presetName: "APEX 50K EOD",
  accountSize: 50000,
  profitTarget: 3000,
  drawdown: 2000,
  dailyLossLimit: 1000,
  drawdownType: "EOD",
  contractsMini: 6,
  contractsMicro: 60,
  minDaysToPass: 1,
  holdThroughNews: false,
  evalCost: 149,
  activationFee: 99,
  fundedAccountValue: 1500,
  oneDayPass: true,
};

const RULE_PRESETS: Array<{ id: string; label: string; description: string; rules: Rules }> = [
  {
    id: "apex-50k-intraday",
    label: "APEX 50K Intraday",
    description: "Intraday trailing equity with unrealized PnL included.",
    rules: {
      presetName: "APEX 50K Intraday",
      accountSize: 50000,
      profitTarget: 3000,
      drawdown: 2000,
      dailyLossLimit: 1000,
      drawdownType: "INTRADAY",
      contractsMini: 6,
      contractsMicro: 60,
      minDaysToPass: 1,
      holdThroughNews: false,
      evalCost: 149,
      activationFee: 0,
      fundedAccountValue: 1500,
      oneDayPass: true,
    },
  },
  {
    id: "lucid-50k-eod",
    label: "Lucid 50K EOD",
    description: "EOD trailing drawdown with a lower daily loss cap.",
    rules: {
      presetName: "Lucid 50K EOD",
      accountSize: 50000,
      profitTarget: 3000,
      drawdown: 2000,
      dailyLossLimit: 1200,
      drawdownType: "EOD",
      contractsMini: 4,
      contractsMicro: 40,
      minDaysToPass: 1,
      holdThroughNews: false,
      evalCost: 65,
      activationFee: 0,
      fundedAccountValue: 1500,
      oneDayPass: true,
    },
  },
  {
    id: "apex-50k-eod",
    label: "APEX 50K EOD",
    description: "End-of-day trailing drawdown with intraday loss enforcement.",
    rules: {
      presetName: "APEX 50K EOD",
      accountSize: 50000,
      profitTarget: 3000,
      drawdown: 2000,
      dailyLossLimit: 1000,
      drawdownType: "EOD",
      contractsMini: 6,
      contractsMicro: 60,
      minDaysToPass: 1,
      holdThroughNews: false,
      evalCost: 149,
      activationFee: 0,
      fundedAccountValue: 1500,
      oneDayPass: true,
    },
  },
  {
    id: "alpha-futures-50k",
    label: "Alpha Futures 50K",
    description: "3-contract cap with daily loss guard and news hold enabled.",
    rules: {
      presetName: "Alpha Futures 50K",
      accountSize: 50000,
      profitTarget: 3000,
      drawdown: 2000,
      dailyLossLimit: 1000,
      drawdownType: "EOD",
      contractsMini: 3,
      contractsMicro: 30,
      minDaysToPass: 1,
      holdThroughNews: true,
      evalCost: 109,
      activationFee: 0,
      fundedAccountValue: 1500,
      oneDayPass: true,
    },
  },
];

const SAMPLE_TRADES: TradeRow[] = [
  { timestamp: "2026-03-24T18:14:00-04:00", pnl: 112, tradeId: "TV-001", dayId: "2026-03-24", source: "TradingView" },
  { timestamp: "2026-03-24T19:11:00-04:00", pnl: 138, tradeId: "TV-002", dayId: "2026-03-24", source: "TradingView" },
  { timestamp: "2026-03-24T20:03:00-04:00", pnl: -74, tradeId: "TV-003", dayId: "2026-03-24", source: "TradingView" },
  { timestamp: "2026-03-25T18:12:00-04:00", pnl: 106, tradeId: "TV-004", dayId: "2026-03-25", source: "TradingView" },
  { timestamp: "2026-03-25T18:44:00-04:00", pnl: 129, tradeId: "TV-005", dayId: "2026-03-25", source: "TradingView" },
  { timestamp: "2026-03-25T19:20:00-04:00", pnl: 42, tradeId: "TV-006", dayId: "2026-03-25", source: "TradingView" },
  { timestamp: "2026-03-25T20:12:00-04:00", pnl: -83, tradeId: "TV-007", dayId: "2026-03-25", source: "TradingView" },
  { timestamp: "2026-03-26T18:08:00-04:00", pnl: 96, tradeId: "TV-011", dayId: "2026-03-26", source: "TradingView" },
  { timestamp: "2026-03-26T18:29:00-04:00", pnl: 114, tradeId: "TV-012", dayId: "2026-03-26", source: "TradingView" },
  { timestamp: "2026-03-26T19:14:00-04:00", pnl: 73, tradeId: "TV-013", dayId: "2026-03-26", source: "TradingView" },
  { timestamp: "2026-03-26T19:52:00-04:00", pnl: -61, tradeId: "TV-014", dayId: "2026-03-26", source: "TradingView" },
];

const SAMPLE_TRACKER: TrackerEntry[] = [
  {
    id: "attempt-1",
    firm: "Topstep",
    accountLabel: "50K eval #1",
    attemptedAt: "2026-03-24T18:00",
    openedAt: "2026-03-24T17:40",
    outcome: "Pass",
    evalCost: 149,
    activationFee: 99,
    notes: "Two clustered wins before the first loss.",
    strategyVersion: "PassPlan v1",
    source: "TradingView",
  },
  {
    id: "attempt-2",
    firm: "Apex",
    accountLabel: "75K eval #2",
    attemptedAt: "2026-03-25T18:00",
    openedAt: "2026-03-25T17:55",
    outcome: "Fail",
    evalCost: 167,
    activationFee: 0,
    notes: "Stopped after the first red trade.",
    strategyVersion: "PassPlan v1",
    source: "NinjaTrader",
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

function n(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}

function localDateTime(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function sessionDayId(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value])) as Record<string, string>;
  const bucket = new Date(Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day), 12));
  if (Number(map.hour) < 18) bucket.setUTCDate(bucket.getUTCDate() - 1);
  return bucket.toISOString().slice(0, 10);
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (quoted && next === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (!quoted && (ch === "," || ch === "\t")) {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (!quoted && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += ch;
  }
  row.push(cell.trim());
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

function parseNumber(value: string) {
  const cleaned = value.replace(/[$,]/g, "").replace(/\((.*)\)/, "-$1").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function findColumn(headers: string[], keys: string[]) {
  return headers.findIndex((header) => {
    const value = header.toLowerCase().trim();
    return keys.some((key) => value === key || value.includes(key));
  });
}

function rowValue(row: string[], index: number) {
  return index >= 0 ? row[index] ?? "" : "";
}

function includesAny(value: string, needles: string[]) {
  const normalized = value.toLowerCase();
  return needles.some((needle) => normalized.includes(needle));
}

function normalizeTrades(rows: string[][], source: TradeSource) {
  if (rows.length < 2) return { trades: [] as TradeRow[], warnings: ["CSV did not contain enough rows."] };
  const headers = rows[0];
  const tsIndex = findColumn(headers, ["timestamp", "time", "date and time", "datetime", "fill time", "entry time", "exit time", "date"]);
  const pnlIndex = findColumn(headers, ["pnl", "profit/loss", "profit", "net p&l usd", "net p&l", "net profit", "realized pnl", "cumulative p&l usd", "cum. net profit", "p/l", "pl"]);
  const idIndex = findColumn(headers, ["trade number", "trade #", "trade id", "tradeid", "id", "order id", "execution id"]);
  const typeIndex = findColumn(headers, ["type", "signal", "market pos.", "entry name", "exit name", "action"]);
  const warnings: string[] = [];
  if (tsIndex < 0) warnings.push("Timestamp column was not found.");
  if (pnlIndex < 0) warnings.push("PnL column was not found.");

  const tradeMap = new Map<string, { trade: TradeRow; score: number }>();
  rows.slice(1).forEach((row, index) => {
    const rawType = rowValue(row, typeIndex);
    if (source === "TradingView" && typeIndex >= 0 && !includesAny(rawType, ["exit"])) {
      return;
    }
    const tradeId = idIndex >= 0 ? rowValue(row, idIndex) : `${source}-${index + 1}`;
    const timestamp = rowValue(row, tsIndex);
    const dayId = timestamp ? sessionDayId(timestamp) : "";
    const pnl = pnlIndex >= 0 ? parseNumber(rowValue(row, pnlIndex)) : 0;
    if (!timestamp || !dayId) return;
    const score = includesAny(rawType, ["exit"]) ? 2 : includesAny(rawType, ["entry"]) ? 1 : 0;
    const current = tradeMap.get(tradeId);
    if (!current || score >= current.score) {
      tradeMap.set(tradeId, { trade: { timestamp, pnl, tradeId, dayId, source }, score });
    }
  });
  const trades = Array.from(tradeMap.values()).map(({ trade }) => trade);
  if (!trades.length) warnings.push("No trades were normalized from the selected CSV.");
  return { trades, warnings };
}

function sortTrades(trades: TradeRow[]) {
  return [...trades].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function groupByDay(trades: TradeRow[]) {
  const map = new Map<string, TradeRow[]>();
  sortTrades(trades).forEach((trade) => {
    if (!map.has(trade.dayId)) map.set(trade.dayId, []);
    map.get(trade.dayId)?.push(trade);
  });
  return Array.from(map.entries()).map(([dayId, dayTrades]) => ({ dayId, trades: dayTrades }));
}

function simulateDay(trades: TradeRow[], rules: Rules) {
  let pnl = 0;
  let dayPnl = 0;
  let passes = 0;
  let tradeCount = 0;
  let firstPassAt: number | null = null;

  for (const trade of sortTrades(trades)) {
    pnl += trade.pnl;
    dayPnl += trade.pnl;
    tradeCount += 1;
    if (pnl >= rules.profitTarget) {
      passes += 1;
      firstPassAt ??= tradeCount;
      if (!rules.oneDayPass) break;
      pnl = 0;
      tradeCount = 0;
      continue;
    }
    if (trade.pnl < 0 || pnl <= -rules.drawdown) break;
  }

  return { passes, firstPassAt, dayPnl };
}

function analyze(dayBuckets: DayBucket[], rules: Rules) {
  const perDay = dayBuckets.map((day) => {
    let winsBeforeLoss = 0;
    let pnlBeforeLoss = 0;
    for (const trade of sortTrades(day.trades)) {
      if (trade.pnl < 0) break;
      if (trade.pnl > 0) winsBeforeLoss += 1;
      pnlBeforeLoss += trade.pnl;
    }
    const sim = simulateDay(day.trades, rules);
    return {
      dayId: day.dayId,
      winsBeforeLoss,
      pnlBeforeLoss,
      passes: sim.passes,
    };
  });

  const totalDays = Math.max(perDay.length, 1);
  const avgWinsBeforeLoss = perDay.reduce((sum, item) => sum + item.winsBeforeLoss, 0) / totalDays;
  const avgPnLBeforeLoss = perDay.reduce((sum, item) => sum + item.pnlBeforeLoss, 0) / totalDays;
  const avgPassesPerDay = perDay.reduce((sum, item) => sum + item.passes, 0) / totalDays;
  const passableDays = perDay.filter((item) => item.passes > 0).length;
  const passRate = passableDays / totalDays;
  const zeroPassRate = 1 - passRate;
  const probabilities = [1, 2, 3].map((threshold) => ({
    threshold,
    rate: perDay.filter((item) => item.winsBeforeLoss >= threshold).length / totalDays,
  }));
  const passDistribution = [0, 1, 2, 3, 4].map((bucket) => ({
    label: bucket < 4 ? String(bucket) : "4+",
    value: perDay.filter((item) => (bucket < 4 ? item.passes === bucket : item.passes >= 4)).length,
  }));

  return {
    totalDays,
    avgWinsBeforeLoss,
    avgPnLBeforeLoss,
    avgPassesPerDay,
    passRate,
    zeroPassRate,
    probabilities,
    passDistribution,
  };
}

function lcg(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function monteCarlo(dayBuckets: DayBucket[], rules: Rules, runs = 2000, horizon = 20): SimulationResult {
  if (!dayBuckets.length) {
    return {
      simulations: 0,
      totalDays: 0,
      passRate: 0,
      zeroPassRate: 0,
      expectedPassesPerDay: 0,
      costPerFundedAccount: 0,
      netEVPerDay: 0,
      avgWinsBeforeLoss: 0,
      avgPnLBeforeLoss: 0,
      avgPassesPerDay: 0,
      probabilities: [],
      passDistribution: [],
      samplePaths: [],
    };
  }

  const rand = lcg(918273);
  const dist = new Map<number, number>();
  let totalPasses = 0;
  let zeroPassDays = 0;
  let totalDays = 0;
  let winsBeforeLossSum = 0;
  let pnlBeforeLossSum = 0;
  const samplePaths: Array<{ label: string; points: number[] }> = [];

  for (let run = 0; run < runs; run += 1) {
    let cumulativePnl = 0;
    const points: number[] = [0];
    for (let day = 0; day < horizon; day += 1) {
      const bucket = dayBuckets[Math.floor(rand() * dayBuckets.length)];
      const result = simulateDay(bucket.trades, rules);
      totalPasses += result.passes;
      totalDays += 1;
      if (result.passes === 0) zeroPassDays += 1;
      dist.set(result.passes, (dist.get(result.passes) ?? 0) + 1);
      cumulativePnl += result.dayPnl;
      points.push(cumulativePnl);

      let winsBeforeLoss = 0;
      let pnlBeforeLoss = 0;
      for (const trade of sortTrades(bucket.trades)) {
        if (trade.pnl < 0) break;
        if (trade.pnl > 0) winsBeforeLoss += 1;
        pnlBeforeLoss += trade.pnl;
      }
      winsBeforeLossSum += winsBeforeLoss;
      pnlBeforeLossSum += pnlBeforeLoss;
    }
    samplePaths.push({ label: `Path ${samplePaths.length + 1}`, points });
  }

  const expectedPassesPerDay = totalPasses / totalDays;
  const passRate = 1 - zeroPassDays / totalDays;
  const zeroPassRate = 1 - passRate;
  const costPerFundedAccount =
    expectedPassesPerDay > 0
      ? rules.evalCost / expectedPassesPerDay + rules.activationFee
      : rules.evalCost + rules.activationFee;
  const netEVPerDay =
    expectedPassesPerDay * rules.fundedAccountValue -
    rules.evalCost -
    expectedPassesPerDay * rules.activationFee;

  const passDistribution = Array.from(dist.entries())
    .sort((a, b) => a[0] - b[0])
    .slice(0, 5)
    .map(([key, value]) => ({
      label: key >= 4 ? "4+" : String(key),
      value: Math.round((value / totalDays) * 1000) / 10,
    }));

  return {
    simulations: runs,
    totalDays,
    passRate,
    zeroPassRate,
    expectedPassesPerDay,
    costPerFundedAccount,
    netEVPerDay,
    avgWinsBeforeLoss: winsBeforeLossSum / totalDays,
    avgPnLBeforeLoss: pnlBeforeLossSum / totalDays,
    avgPassesPerDay: totalPasses / totalDays,
    probabilities: analyze(dayBuckets, rules).probabilities,
    passDistribution,
    samplePaths,
  };
}

function outcomeClass(outcome: Outcome) {
  if (outcome === "Pass") return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  if (outcome === "Fail") return "border-rose-400/20 bg-rose-400/10 text-rose-200";
  return "border-white/10 bg-white/[0.03] text-white/60";
}

function nowLabel() {
  return localDateTime();
}

function buildPath(points: number[], width: number, height: number, minY: number, maxY: number) {
  if (points.length === 0) return "";
  const padX = 18;
  const padY = 16;
  const innerWidth = Math.max(width - padX * 2, 1);
  const innerHeight = Math.max(height - padY * 2, 1);
  const scaleMin = minY;
  const scaleMax = Math.max(minY + 1, maxY);
  const stepX = points.length === 1 ? 0 : innerWidth / (points.length - 1);
  return points
    .map((point, index) => {
      const x = padX + stepX * index;
      const y = height - padY - ((point - scaleMin) / (scaleMax - scaleMin)) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function PassPlanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"simulator" | "tracker">("simulator");
  const [source, setSource] = useState<TradeSource>("TradingView");
  const [uploadName, setUploadName] = useState("sample-sequence.csv");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [trades, setTrades] = useState<TradeRow[]>(SAMPLE_TRADES);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [tracker, setTracker] = useState<TrackerEntry[]>(SAMPLE_TRACKER);
  const [hydrated, setHydrated] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [draft, setDraft] = useState<Omit<TrackerEntry, "id">>({
    firm: "Topstep",
    accountLabel: "50K eval",
    attemptedAt: nowLabel(),
    openedAt: nowLabel(),
    outcome: "Active",
    evalCost: 149,
    activationFee: 99,
    notes: "",
    strategyVersion: "PassPlan v1",
    source: "TradingView",
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTracker(JSON.parse(stored) as TrackerEntry[]);
      } catch {
        // Ignore malformed tracker data.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracker));
  }, [tracker, hydrated]);

  const dayBuckets = useMemo(() => groupByDay(trades), [trades]);
  const totalTrackerFees = tracker.reduce((sum, row) => sum + row.evalCost + row.activationFee, 0);
  const passTracker = tracker.filter((row) => row.outcome === "Pass").length;
  const failTracker = tracker.filter((row) => row.outcome === "Fail").length;
  const activeTracker = tracker.filter((row) => row.outcome === "Active").length;

  function handleUpload(file: File | null) {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const normalized = normalizeTrades(parseCsv(text), source);
        setWarnings(normalized.warnings);
        if (normalized.trades.length) {
          setTrades(normalized.trades);
          setUploadName(file.name);
          setSimResult(null);
        }
      })
      .catch(() => setWarnings(["Could not read the selected file."]));
  }

  function handleSimulate() {
    setSimResult(monteCarlo(dayBuckets, rules));
  }

  function loadSample() {
    setTrades(SAMPLE_TRADES);
    setRules(DEFAULT_RULES);
    setWarnings([]);
    setUploadName("sample-sequence.csv");
    setSimResult(null);
  }

  function applyPreset(ruleset: Rules) {
    setRules(ruleset);
    setSimResult(null);
  }

  const showCustomRules = rules.presetName === "Custom";

  function addTrackerEntry() {
    setTracker((current) => [{ id: `attempt-${Date.now()}`, ...draft }, ...current]);
    setDraft((current) => ({ ...current, notes: "", attemptedAt: nowLabel() }));
  }

  function logout() {
    fetch("/api/logout", { method: "POST" }).finally(() => router.push("/login"));
  }

  const result = simResult;

  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link href="/simulator" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to ProfitPlan
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        <section className="rounded-3xl border border-white/8 bg-[#0f1015] p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF7A18]/20 bg-[#FF7A18]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFB347]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Account acquisition engine
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Upload a strategy,{" "}
                <span className="text-gradient">simulate prop stacking</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-white/45 leading-relaxed max-w-2xl">
                PassPlan answers one question: how many evals can a clustered-win strategy acquire before the first loss stops the day?
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("simulator")}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                activeTab === "simulator" ? "bg-white text-black" : "border border-white/10 bg-black/20 text-white/60 hover:text-white"
              }`}
            >
              Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                activeTab === "tracker" ? "bg-white text-black" : "border border-white/10 bg-black/20 text-white/60 hover:text-white"
              }`}
            >
              Tracker
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-white/8 bg-black/20 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">Simulation output</div>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">What the simulator is doing</h2>
                <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed">
                  Click <span className="text-white">Simulate Strategy</span> to see pass probability, 0-pass risk, expected passes per day, and cost per funded account.
                </p>
              </div>
              <Target className="h-6 w-6 text-[#FFB347] shrink-0" />
            </div>
          </div>
        </section>

        {activeTab === "simulator" && (
          <section className="mt-6 rounded-3xl border border-white/8 bg-[#101116] p-5 sm:p-6">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/8 bg-black/20 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">Strategy input</div>
                    <h2 className="mt-2 text-xl font-semibold">Upload then simulate</h2>
                  </div>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65 hover:text-white transition-colors"
                  >
                    Load sample
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/8 bg-[#0e0f13] p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Rule presets</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => applyPreset(DEFAULT_RULES)}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:border-[#FF7A18]/35 hover:bg-[#12141a]"
                      >
                        <div className="text-sm font-semibold text-white">Custom</div>
                        <div className="mt-1 text-xs text-white/40 leading-relaxed">Edit every field manually.</div>
                      </button>
                      {RULE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset.rules)}
                          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition-colors hover:border-[#FF7A18]/35 hover:bg-[#12141a]"
                        >
                          <div className="text-sm font-semibold text-white">{preset.label}</div>
                          <div className="mt-1 text-xs text-white/40 leading-relaxed">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-white/35">
                      Current preset: <span className="text-white">{rules.presetName}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/15 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="text-xs uppercase tracking-[0.18em] text-white/30">Source</label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value as TradeSource)}
                        className="rounded-lg border border-white/10 bg-[#0c0d11] px-3 py-2 text-sm text-white outline-none"
                      >
                        <option value="TradingView">TradingView</option>
                        <option value="NinjaTrader">NinjaTrader</option>
                      </select>
                      <div className="text-xs text-white/30">We normalize columns into a trade sequence.</div>
                    </div>

                    <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#0e0f13] px-6 py-8 text-center hover:border-[#FF7A18]/30 hover:bg-[#11131a]">
                      <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
                      <UploadCloud className="h-8 w-8 text-[#FFB347]" />
                      <div className="mt-3 text-base font-semibold">Upload a strategy CSV</div>
                      <div className="mt-1 text-sm text-white/40">{uploadName}</div>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-white/45">
                        <FileUp className="h-3.5 w-3.5" />
                        TradingView or NinjaTrader
                      </div>
                    </label>

                    {warnings.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {warnings.map((warning) => (
                          <div key={warning} className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {showCustomRules ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Account size</div>
                          <input
                            type="number"
                            value={rules.accountSize}
                            onChange={(e) => setRules((current) => ({ ...current, accountSize: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Profit target</div>
                          <input
                            type="number"
                            value={rules.profitTarget}
                            onChange={(e) => setRules((current) => ({ ...current, profitTarget: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Drawdown</div>
                          <input
                            type="number"
                            value={rules.drawdown}
                            onChange={(e) => setRules((current) => ({ ...current, drawdown: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Daily loss limit</div>
                          <input
                            type="number"
                            value={rules.dailyLossLimit}
                            onChange={(e) => setRules((current) => ({ ...current, dailyLossLimit: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Drawdown type</div>
                          <select
                            value={rules.drawdownType}
                            onChange={(e) => setRules((current) => ({ ...current, drawdownType: e.target.value as Rules["drawdownType"] }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          >
                            <option value="EOD">EOD</option>
                            <option value="INTRADAY">INTRADAY</option>
                          </select>
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Minimum days to pass</div>
                          <input
                            type="number"
                            value={rules.minDaysToPass}
                            onChange={(e) => setRules((current) => ({ ...current, minDaysToPass: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Mini contracts</div>
                          <input
                            type="number"
                            value={rules.contractsMini}
                            onChange={(e) => setRules((current) => ({ ...current, contractsMini: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Micro contracts</div>
                          <input
                            type="number"
                            value={rules.contractsMicro}
                            onChange={(e) => setRules((current) => ({ ...current, contractsMicro: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Eval cost</div>
                          <input
                            type="number"
                            value={rules.evalCost}
                            onChange={(e) => setRules((current) => ({ ...current, evalCost: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Activation fee</div>
                          <input
                            type="number"
                            value={rules.activationFee}
                            onChange={(e) => setRules((current) => ({ ...current, activationFee: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                        <label className="block">
                          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Funded account value</div>
                          <input
                            type="number"
                            value={rules.fundedAccountValue}
                            onChange={(e) => setRules((current) => ({ ...current, fundedAccountValue: Number(e.target.value) }))}
                            className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40"
                          />
                        </label>
                      </div>

                      <label className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <span className="text-sm text-white/70">One-day pass allowed</span>
                        <input
                          type="checkbox"
                          checked={rules.oneDayPass}
                          onChange={(e) => setRules((current) => ({ ...current, oneDayPass: e.target.checked }))}
                          className="h-4 w-4 accent-[#FF7A18]"
                        />
                      </label>

                      <label className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                        <span className="text-sm text-white/70">Hold through news</span>
                        <input
                          type="checkbox"
                          checked={rules.holdThroughNews}
                          onChange={(e) => setRules((current) => ({ ...current, holdThroughNews: e.target.checked }))}
                          className="h-4 w-4 accent-[#FF7A18]"
                        />
                      </label>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-white/8 bg-[#0e0f13] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Preset locked</div>
                          <div className="mt-2 text-lg font-semibold text-white">{rules.presetName}</div>
                        </div>
                        <div className="text-right text-xs text-white/45">
                          <div>Account size: {money(rules.accountSize)}</div>
                          <div>Target: {money(rules.profitTarget)}</div>
                          <div>DD: {money(rules.drawdown)} | Daily loss: {money(rules.dailyLossLimit)}</div>
                          <div>News hold: {rules.holdThroughNews ? "Yes" : "No"}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSimulate}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#FF7A18] to-[#FFB347] px-5 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(255,122,24,0.18)]"
                  >
                    Simulate Strategy
                  </button>
                  <p className="text-xs text-white/35">
                    The simulation groups trades by session day, stops on the first loss, and if a pass occurs it can switch to the next eval inside the same day.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/8 bg-black/20 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">Simulation output</div>
                    <h2 className="mt-2 text-xl font-semibold">Results</h2>
                  </div>
                  <Target className="h-5 w-5 text-[#FFB347]" />
                </div>

                {result ? (
                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Pass rate</div>
                        <div className="mt-2 text-3xl font-bold tabular-nums">{pct(result.passRate * 100)}</div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">0-pass risk</div>
                        <div className="mt-2 text-3xl font-bold tabular-nums">{pct(result.zeroPassRate * 100)}</div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Expected passes/day</div>
                        <div className="mt-2 text-3xl font-bold tabular-nums">{n(result.expectedPassesPerDay, 2)}</div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Cost / funded acct</div>
                        <div className="mt-2 text-3xl font-bold tabular-nums">{money(result.costPerFundedAccount)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Avg wins before loss</div>
                        <div className="mt-2 text-2xl font-bold tabular-nums">{n(result.avgWinsBeforeLoss, 2)}</div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Avg PnL before loss</div>
                        <div className="mt-2 text-2xl font-bold tabular-nums">{money(result.avgPnLBeforeLoss)}</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/28 mb-3">How it works</div>
                      <ul className="space-y-2 text-sm text-white/55 leading-relaxed">
                        <li>1. Trades are grouped into session days from 6 PM ET to 5 PM ET.</li>
                        <li>2. The engine walks the trade sequence in order.</li>
                        <li>3. A win adds PnL toward the eval target.</li>
                        <li>4. A loss stops the day immediately.</li>
                        <li>5. If the target is hit, the eval is marked as passed and, if allowed, the next account can start the same day.</li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/28 mb-3">Pass stack distribution</div>
                      <div className="space-y-2">
                        {result.passDistribution.map((item) => (
                          <div key={item.label} className="flex items-center gap-3 text-xs">
                            <span className="w-8 text-white/45">{item.label}</span>
                            <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full bg-[#74e09d]" style={{ width: `${Math.max(item.value, 6)}%` }} />
                            </div>
                            <span className="w-8 text-right text-white/45 tabular-nums">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#101116] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Monte Carlo paths</div>
                          <div className="mt-1 text-xs text-white/45">Cumulative PnL across every simulated run in the horizon.</div>
                        </div>
                        <div className="text-xs text-white/35">
                          {result.samplePaths.length.toLocaleString()} rendered of {result.simulations.toLocaleString()} simulations
                        </div>
                      </div>

                      {result.samplePaths.length > 0 ? (
                        (() => {
                          const allPoints = result.samplePaths.flatMap((path) => path.points);
                          const minY = Math.min(0, ...allPoints);
                          const maxY = Math.max(0, ...allPoints);
                          const yTicks = Array.from(
                            new Set([minY, 0, Math.max(minY + 1, Math.ceil((minY + maxY) / 2)), maxY].map((tick) => Math.round(tick))),
                          ).sort((a, b) => a - b);
                          return (
                        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-3">
                          <svg viewBox="0 0 640 220" className="h-56 w-full">
                            <rect x="0" y="0" width="640" height="220" fill="transparent" />
                            {yTicks.map((tick) => {
                              const y =
                                184 - ((tick - minY) / Math.max(1, maxY - minY || 1)) * 152;
                              return (
                                <g key={tick}>
                                  <line x1="18" x2="622" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                                  <text x="8" y={y + 4} fill="rgba(255,255,255,0.35)" fontSize="10" textAnchor="start">
                                    {tick}
                                  </text>
                                </g>
                              );
                            })}

                            {0 >= minY && 0 <= maxY && (
                              <line
                                x1="18"
                                x2="622"
                                y1={184 - ((0 - minY) / Math.max(1, maxY - minY || 1)) * 152}
                                y2={184 - ((0 - minY) / Math.max(1, maxY - minY || 1)) * 152}
                                stroke="rgba(255,255,255,0.18)"
                                strokeWidth="1.5"
                              />
                            )}

                            {result.samplePaths.map((path, index) => {
                              const d = buildPath(path.points, 640, 220, minY, maxY);
                              const palette = ["#FFB347", "#74e09d", "#7dd3fc", "#f472b6", "#f59e0b", "#c084fc"];
                              return (
                                <path
                                  key={path.label}
                                  d={d}
                                  fill="none"
                                  stroke={palette[index % palette.length]}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  opacity="0.9"
                                />
                              );
                            })}
                          </svg>
                        </div>
                          );
                        })()
                      ) : (
                        <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-black/15 p-5 text-sm text-white/45">
                          Run the simulation to generate path lines.
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-[#FF7A18]/15 bg-[#FF7A18]/8 p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-[#FFB347] mb-2">Bottom line</div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        This strategy is being treated like a disposable eval machine. We are not measuring normal backtest performance. We are measuring how often the sequence can pass one account, then stack additional accounts in the same day before the first loss ends the run.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/15 p-5 text-sm text-white/45 leading-relaxed">
                    Click <span className="text-white">Simulate Strategy</span> to see pass probability, 0-pass risk, expected passes per day, and cost per funded account.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "tracker" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/8 bg-[#101116] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">Tracker</div>
                <h2 className="mt-2 text-xl font-semibold">Real attempts</h2>
              </div>
              <Database className="h-5 w-5 text-[#FFB347]" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Firm</div>
                <input value={draft.firm} onChange={(e) => setDraft((current) => ({ ...current, firm: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Account label</div>
                <input value={draft.accountLabel} onChange={(e) => setDraft((current) => ({ ...current, accountLabel: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Attempted at</div>
                <input type="datetime-local" value={draft.attemptedAt} onChange={(e) => setDraft((current) => ({ ...current, attemptedAt: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Opened at</div>
                <input type="datetime-local" value={draft.openedAt} onChange={(e) => setDraft((current) => ({ ...current, openedAt: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Outcome</div>
                <select value={draft.outcome} onChange={(e) => setDraft((current) => ({ ...current, outcome: e.target.value as Outcome }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40">
                  <option value="Active">Active</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </label>
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Source</div>
                <select value={draft.source} onChange={(e) => setDraft((current) => ({ ...current, source: e.target.value as TradeSource }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40">
                  <option value="TradingView">TradingView</option>
                  <option value="NinjaTrader">NinjaTrader</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Eval cost</div>
                <input type="number" value={draft.evalCost} onChange={(e) => setDraft((current) => ({ ...current, evalCost: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
              <label className="block">
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Activation fee</div>
                <input type="number" value={draft.activationFee} onChange={(e) => setDraft((current) => ({ ...current, activationFee: Number(e.target.value) }))} className="w-full rounded-xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40" />
              </label>
            </div>

            <label className="block mt-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-white/28">Strategy notes</div>
              <textarea rows={4} value={draft.notes} onChange={(e) => setDraft((current) => ({ ...current, notes: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-[#0c0d11] px-4 py-3 text-white outline-none focus:border-[#FF7A18]/40 resize-none" />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={addTrackerEntry} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB347] px-5 py-3 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                Add attempt
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Passes</div>
                <div className="mt-2 text-2xl font-bold">{passTracker}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Fails</div>
                <div className="mt-2 text-2xl font-bold">{failTracker}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/28">Active</div>
                <div className="mt-2 text-2xl font-bold">{activeTracker}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-[#101116] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/28">Validation log</div>
                <h2 className="mt-2 text-xl font-semibold">What happened in the real world?</h2>
              </div>
              <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs text-white/45">{tracker.length} records</div>
            </div>

            <div className="mt-5 space-y-3">
              {tracker.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold">{entry.firm}</div>
                        <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
                          {entry.accountLabel}
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${outcomeClass(entry.outcome)}`}>
                          {entry.outcome}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-white/40">
                        Attempted {entry.attemptedAt.replace("T", " ")} | Opened {entry.openedAt.replace("T", " ")} | {entry.source}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{money(entry.evalCost + entry.activationFee)}</div>
                      <div className="mt-1 text-xs text-white/35">fees logged</div>
                    </div>
                  </div>

                  {entry.notes && <p className="mt-3 text-sm text-white/42 leading-relaxed">{entry.notes}</p>}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/45">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">Strategy: {entry.strategyVersion}</span>
                    {entry.activationFee > 0 ? (
                      <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">Activation fee {money(entry.activationFee)}</span>
                    ) : (
                      <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1">No activation fee</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/45">Tracker fees logged</span>
                <span className="font-semibold tabular-nums">{money(totalTrackerFees)}</span>
              </div>
            </div>
          </div>
        </section>
        )}

        <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-xs text-white/40 flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-[#FFB347]" />
          PassPlan models sequence behavior, not normal backtesting. It groups trades by session day, stops on the first loss, and can stack the next account only after a pass.
        </div>
      </div>
    </div>
  );
}
