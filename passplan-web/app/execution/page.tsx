"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart2, Activity, LayoutDashboard, Upload, Clock,
  TrendingDown, DollarSign, ArrowLeft, RefreshCw, ChevronRight,
  CheckCircle, AlertTriangle, X, BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ReferenceLine, Cell,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Trade {
  pmt_symbol: string;
  tov_symbol: string;
  symbol_match: boolean;
  direction: string;
  pmt_trade_time: string;
  pmt_signal_price: number;
  tov_entry_time: string;
  tov_entry_price: number;
  tov_exit_time: string;
  tov_exit_price: number;
  tov_qty: number;
  tov_pnl: number;
  fill_latency_sec: number;
  entry_slippage: number;
  slippage_pnl: number;
}

interface Session {
  session_id: string;
  session_date: string;
  uploaded_at?: string;
  pmt_filename?: string;
  tov_filename?: string;
  matched_count: number;
  unmatched_pmt?: number;
  avg_slippage_pts: number | null;
  avg_latency_sec: number | null;
  total_slippage_pnl: number | null;
  total_tov_pnl: number | null;
  trades?: Trade[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCENT  = "linear-gradient(135deg, #FF7A18 0%, #FFB347 100%)";
const BG      = "#0B0B0F";
const SURFACE = "#0e0e12";
const BORDER  = "rgba(255,255,255,0.06)";
const ACTIVE_BG     = "rgba(255,122,24,0.10)";
const ACTIVE_BORDER = "rgba(255,122,24,0.22)";
const TEXT_DIM = "rgba(255,255,255,0.38)";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = {
  pts:  (v: number | null) => v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(2)} pts`,
  pnl:  (v: number | null) => v == null ? "—" : `${v >= 0 ? "+" : ""}$${Math.abs(v).toFixed(2)}`,
  sec:  (v: number | null) => v == null ? "—" : `${v.toFixed(2)}s`,
  date: (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  time: (s: string) => {
    try { return new Date(s).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); }
    catch { return s; }
  },
};

function slippageColor(v: number) {
  if (v > 1)  return "#f87171";   // bad
  if (v > 0)  return "#fb923c";   // slight
  return "#4ade80";               // favorable
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, sub, color = "#FF7A18" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14,
      padding: "18px 22px", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={14} color={color} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: TEXT_DIM }}>{sub}</span>}
    </div>
  );
}

function SlippageChart({ trades }: { trades: Trade[] }) {
  const data = trades.map((t, i) => ({
    name: `${i + 1} ${t.direction}`,
    slippage: t.entry_slippage,
    pnl_cost: t.slippage_pnl,
  }));
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Entry Slippage per Trade (pts)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: TEXT_DIM }} />
          <YAxis tick={{ fontSize: 10, fill: TEXT_DIM }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
          <Tooltip
            contentStyle={{ background: "#1a1a1f", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
            formatter={(v: unknown) => { const n = Number(v); return [`${n > 0 ? "+" : ""}${n.toFixed(2)} pts`, "Slippage"]; }}
          />
          <Bar dataKey="slippage" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={slippageColor(d.slippage)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LatencyChart({ trades }: { trades: Trade[] }) {
  const data = trades.map((t, i) => ({
    name: `${i + 1}`,
    latency: Math.max(0, t.fill_latency_sec),
  }));
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Fill Latency per Trade (s)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: TEXT_DIM }} />
          <YAxis tick={{ fontSize: 10, fill: TEXT_DIM }} />
          <Tooltip
            contentStyle={{ background: "#1a1a1f", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
            formatter={(v: unknown) => [`${Number(v).toFixed(3)}s`, "Latency"]}
          />
          <Line type="monotone" dataKey="latency" stroke="#FF7A18" strokeWidth={2} dot={{ r: 3, fill: "#FF7A18" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function HistoryChart({ sessions }: { sessions: Session[] }) {
  const data = [...sessions]
    .reverse()
    .map(s => ({
      date: s.session_date,
      slippage: s.avg_slippage_pts ?? 0,
      cost: s.total_slippage_pnl ?? 0,
    }));
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 22px" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Avg Slippage Over Time (pts)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: TEXT_DIM }} />
          <YAxis tick={{ fontSize: 10, fill: TEXT_DIM }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
          <Tooltip
            contentStyle={{ background: "#1a1a1f", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
            formatter={(v: unknown) => { const n = Number(v); return [`${n > 0 ? "+" : ""}${n.toFixed(2)} pts`, "Avg Slippage"]; }}
          />
          <Line type="monotone" dataKey="slippage" stroke="#FF7A18" strokeWidth={2} dot={{ r: 3, fill: "#FF7A18" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function TradeTable({ trades }: { trades: Trade[] }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Trade Detail
        </p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["#", "Symbol", "Dir", "Alert Time", "Signal Px", "Fill Time", "Fill Px", "Exit Px", "Qty", "Latency", "Slippage (pts)", "Slippage ($)", "P&L"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: TEXT_DIM, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${BORDER}`, opacity: t.symbol_match ? 1 : 0.6 }}>
                <td style={{ padding: "8px 12px", color: TEXT_DIM }}>{i + 1}</td>
                <td style={{ padding: "8px 12px", color: "#fff", fontWeight: 600 }}>{t.pmt_symbol}</td>
                <td style={{ padding: "8px 12px" }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700,
                    background: t.direction === "BUY" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                    color: t.direction === "BUY" ? "#4ade80" : "#f87171",
                    border: `1px solid ${t.direction === "BUY" ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
                  }}>
                    {t.direction}
                  </span>
                </td>
                <td style={{ padding: "8px 12px", color: TEXT_DIM, whiteSpace: "nowrap" }}>{fmt.time(t.pmt_trade_time)}</td>
                <td style={{ padding: "8px 12px", color: "#fff" }}>{t.pmt_signal_price?.toFixed(2)}</td>
                <td style={{ padding: "8px 12px", color: TEXT_DIM, whiteSpace: "nowrap" }}>{fmt.time(t.tov_entry_time)}</td>
                <td style={{ padding: "8px 12px", color: "#fff" }}>{t.tov_entry_price?.toFixed(2)}</td>
                <td style={{ padding: "8px 12px", color: "#fff" }}>{t.tov_exit_price?.toFixed(2)}</td>
                <td style={{ padding: "8px 12px", color: TEXT_DIM }}>{t.tov_qty}</td>
                <td style={{ padding: "8px 12px", color: Math.abs(t.fill_latency_sec) < 1 ? "#4ade80" : t.fill_latency_sec > 30 ? "#f87171" : "#fb923c" }}>
                  {fmt.sec(t.fill_latency_sec)}
                </td>
                <td style={{ padding: "8px 12px", color: slippageColor(t.entry_slippage), fontWeight: 600 }}>
                  {fmt.pts(t.entry_slippage)}
                </td>
                <td style={{ padding: "8px 12px", color: slippageColor(t.slippage_pnl), fontWeight: 600 }}>
                  {fmt.pnl(t.slippage_pnl)}
                </td>
                <td style={{ padding: "8px 12px", color: t.tov_pnl >= 0 ? "#4ade80" : "#f87171", fontWeight: 600 }}>
                  {fmt.pnl(t.tov_pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────

function FileZone({ label, file, onFile }: { label: string; file: File | null; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      style={{
        flex: 1, minHeight: 120, border: `2px dashed ${drag ? "#FF7A18" : file ? "rgba(74,222,128,0.4)" : BORDER}`,
        borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 8, cursor: "pointer", padding: 20,
        background: drag ? "rgba(255,122,24,0.05)" : file ? "rgba(74,222,128,0.05)" : "transparent",
        transition: "all 0.15s",
      }}
    >
      <input ref={ref} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
      {file ? (
        <>
          <CheckCircle size={22} color="#4ade80" />
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{file.name}</span>
          <span style={{ fontSize: 10, color: TEXT_DIM }}>{(file.size / 1024).toFixed(1)} KB</span>
        </>
      ) : (
        <>
          <Upload size={22} color={TEXT_DIM} />
          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 10, color: TEXT_DIM }}>Click or drag CSV here</span>
        </>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ExecutionPage() {
  const [tab, setTab] = useState<"analyze" | "history">("analyze");
  const [pmtFile, setPmtFile] = useState<File | null>(null);
  const [tovFile, setTovFile] = useState<File | null>(null);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND}/execution/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions ?? []);
      }
    } catch { /* backend offline */ }
    finally { setHistoryLoading(false); }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  async function handleUpload() {
    if (!pmtFile || !tovFile) return;
    setLoading(true);
    setError(null);
    setSession(null);
    try {
      const form = new FormData();
      form.append("pmt_file", pmtFile);
      form.append("tov_file", tovFile);
      if (accountId.trim()) form.append("account_id", accountId.trim());
      const res = await fetch(`${BACKEND}/execution/upload`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Upload failed");
      }
      const data: Session = await res.json();
      setSession(data);
      loadHistory();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function loadSession(id: string) {
    try {
      const res = await fetch(`${BACKEND}/execution/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedSession(data);
      }
    } catch { /* noop */ }
  }

  const displaySession = tab === "history" ? selectedSession : session;

  // ── Sidebar nav ────────────────────────────────────────────────────────────
  const NAV = [
    { label: "Simulator",  icon: LayoutDashboard, href: "/simulator" },
    { label: "Execution",  icon: Activity,        href: "/execution" },
    { label: "Journal",    icon: BookOpen,        href: "/journal" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 232, flexShrink: 0, background: SURFACE, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,0.35)" }}>
        <div style={{ height: 60, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(255,122,24,0.45)" }}>
            <BarChart2 size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16.5, color: "#fff", letterSpacing: "-0.02em" }}>
            Pass<span style={{ background: "linear-gradient(90deg,#FF7A18,#FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plan</span>
          </span>
        </div>

        <div style={{ padding: "20px 20px 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
          Navigation
        </div>

        <nav style={{ padding: "0 10px", flex: 1 }}>
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = label === "Execution";
            return (
              <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, marginBottom: 3, textDecoration: "none", fontSize: 13.5, fontWeight: active ? 600 : 400, color: active ? "#fff" : TEXT_DIM, background: active ? ACTIVE_BG : "transparent", border: `1px solid ${active ? ACTIVE_BORDER : "transparent"}`, position: "relative", transition: "all 0.15s" }}>
                {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "55%", borderRadius: "0 2px 2px 0", background: ACCENT, boxShadow: "0 0 8px rgba(255,122,24,0.6)" }} />}
                <Icon size={15} color={active ? "#FF7A18" : "rgba(255,255,255,0.28)"} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ margin: "0 10px", height: 1, background: BORDER }} />
        <div style={{ padding: "10px 10px 18px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, textDecoration: "none", fontSize: 12.5, color: "rgba(255,255,255,0.22)", border: "1px solid transparent", transition: "all 0.15s" }}>
            <ArrowLeft size={13} strokeWidth={1.8} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0 }}>Execution Dashboard</h1>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "rgba(255,122,24,0.10)", color: "#FF7A18", border: "1px solid rgba(255,122,24,0.22)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Live
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: "inline-flex", background: "#0B0B0F", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 3, gap: 3 }}>
            {(["analyze", "history"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ border: `1px solid ${tab === t ? ACTIVE_BORDER : "transparent"}`, background: tab === t ? ACTIVE_BG : "transparent", color: tab === t ? "#fff" : TEXT_DIM, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                {t === "analyze" ? "Upload & Analyze" : "History"}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── ANALYZE TAB ── */}
          {tab === "analyze" && (
            <>
              {/* Upload panel */}
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
                <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Upload CSVs
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <FileZone label="PickMyTrade Alerts CSV" file={pmtFile} onFile={setPmtFile} />
                  <FileZone label="Tradeovate Performance CSV" file={tovFile} onFile={setTovFile} />
                </div>

                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Account ID
                  </span>
                  <input
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    placeholder="Tradeovate account ID — saves to journal automatically"
                    style={{
                      flex: 1, background: "#0B0B0F", border: `1px solid ${BORDER}`,
                      borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12.5,
                      outline: "none",
                    }}
                  />
                </div>

                {error && (
                  <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={14} color="#f87171" />
                    <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>
                    <button onClick={() => setError(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: TEXT_DIM }}>
                      <X size={12} />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!pmtFile || !tovFile || loading}
                  style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: pmtFile && tovFile ? ACCENT : "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: pmtFile && tovFile ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, opacity: loading ? 0.7 : 1, transition: "all 0.15s" }}
                >
                  {loading ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Activity size={14} />}
                  {loading ? "Analyzing…" : "Run Analysis"}
                </button>
              </div>

              {/* Session results */}
              {session && <SessionResults session={session} />}
            </>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === "history" && (
            <div style={{ display: "flex", gap: 20 }}>
              {/* Session list */}
              <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Past Sessions</span>
                  <button onClick={loadHistory} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM }}>
                    <RefreshCw size={12} style={{ animation: historyLoading ? "spin 1s linear infinite" : "none" }} />
                  </button>
                </div>

                {sessions.length === 0 && !historyLoading && (
                  <p style={{ fontSize: 12, color: TEXT_DIM, textAlign: "center", marginTop: 32 }}>No sessions yet</p>
                )}

                {sessions.map(s => (
                  <button key={s.session_id} onClick={() => loadSession(s.session_id)} style={{ background: selectedSession?.session_id === s.session_id ? ACTIVE_BG : SURFACE, border: `1px solid ${selectedSession?.session_id === s.session_id ? ACTIVE_BORDER : BORDER}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{fmt.date(s.session_date)}</div>
                      <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 3 }}>
                        {s.matched_count} trades · avg {fmt.pts(s.avg_slippage_pts)}
                      </div>
                      <div style={{ fontSize: 11, color: s.total_slippage_pnl != null && s.total_slippage_pnl > 0 ? "#f87171" : "#4ade80", marginTop: 2, fontWeight: 600 }}>
                        {fmt.pnl(s.total_slippage_pnl)} slippage cost
                      </div>
                    </div>
                    <ChevronRight size={14} color={TEXT_DIM} />
                  </button>
                ))}

                {sessions.length > 1 && (
                  <div style={{ marginTop: 8 }}>
                    <HistoryChart sessions={sessions} />
                  </div>
                )}
              </div>

              {/* Selected session detail */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {selectedSession ? (
                  <SessionResults session={selectedSession} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: TEXT_DIM, fontSize: 13 }}>
                    Select a session to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Session Results (shared between Analyze + History tabs) ─────────────────

function SessionResults({ session }: { session: Session }) {
  const trades = session.trades ?? [];
  const slipColor = (session.avg_slippage_pts ?? 0) > 0 ? "#f87171" : "#4ade80";

  return (
    <>
      {/* Summary header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: TEXT_DIM }}>
          {fmt.date(session.session_date)}
        </span>
        {session.unmatched_pmt != null && session.unmatched_pmt > 0 && (
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)" }}>
            {session.unmatched_pmt} PMT alerts unmatched
          </span>
        )}
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <MetricCard icon={BarChart2} label="Trades Matched" value={String(session.matched_count)} />
        <MetricCard icon={Clock} label="Avg Fill Latency" value={fmt.sec(session.avg_latency_sec)} sub="PMT alert → Tradeovate fill" color="#818cf8" />
        <MetricCard icon={TrendingDown} label="Avg Slippage" value={fmt.pts(session.avg_slippage_pts)} sub="entry price vs signal" color={slipColor} />
        <MetricCard icon={DollarSign} label="Slippage Cost" value={fmt.pnl(session.total_slippage_pnl)} sub={`Actual P&L: ${fmt.pnl(session.total_tov_pnl)}`} color={slipColor} />
      </div>

      {/* Charts row */}
      {trades.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <SlippageChart trades={trades} />
          <LatencyChart trades={trades} />
        </div>
      )}

      {/* Trade table */}
      {trades.length > 0 && <TradeTable trades={trades} />}
    </>
  );
}
