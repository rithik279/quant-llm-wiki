"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart2, Activity, LayoutDashboard, BookOpen,
  Upload, ChevronLeft, ChevronRight, ArrowLeft,
  TrendingUp, TrendingDown, DollarSign, Hash, X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Account {
  account_id: string;
  account_name: string | null;
  created_at: string;
}

interface CalendarDay {
  trade_date: string;
  total_pnl: number;
  trade_count: number;
  win_count: number;
  loss_count: number;
}

interface JournalTrade {
  id: number;
  account_id: string;
  trade_date: string;
  symbol: string;
  direction: string;
  entry_time: string;
  entry_price: number;
  exit_time: string;
  exit_price: number;
  qty: number;
  pnl: number;
  duration_sec: number | null;
}

interface UploadResult {
  upload_id: string;
  account_id: string;
  trade_count: number;
  date_from: string;
  date_to: string;
  total_pnl: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCENT      = "linear-gradient(135deg, #FF7A18 0%, #FFB347 100%)";
const BG          = "#0B0B0F";
const SURFACE     = "#0e0e12";
const SURFACE2    = "#13131a";
const BORDER      = "rgba(255,255,255,0.06)";
const ACTIVE_BG   = "rgba(255,122,24,0.10)";
const ACTIVE_BORDER = "rgba(255,122,24,0.22)";
const TEXT_DIM    = "rgba(255,255,255,0.38)";
const GREEN       = "#4ade80";
const RED         = "#f87171";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = {
  pnl:  (v: number | null) => v == null ? "—" : `${v >= 0 ? "+" : "-"}$${Math.abs(v).toFixed(2)}`,
  time: (s: string | null) => {
    if (!s) return "—";
    try { return new Date(s).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); }
    catch { return s; }
  },
  dur: (sec: number | null) => {
    if (sec == null) return "—";
    if (sec < 60) return `${Math.round(sec)}s`;
    return `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s`;
  },
};

function pnlColor(v: number | null) {
  if (v == null) return "#fff";
  return v >= 0 ? GREEN : RED;
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

const NAV = [
  { label: "Simulator", icon: LayoutDashboard, href: "/simulator" },
  { label: "Execution", icon: Activity,        href: "/execution" },
  { label: "Journal",   icon: BookOpen,        href: "/journal"   },
];

function Sidebar() {
  return (
    <aside style={{
      width: 232, flexShrink: 0, background: SURFACE,
      borderRight: `1px solid ${BORDER}`, display: "flex",
      flexDirection: "column", boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
    }}>
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
          const active = label === "Journal";
          return (
            <Link key={label} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, marginBottom: 3,
              textDecoration: "none", fontSize: 13.5,
              fontWeight: active ? 600 : 400,
              color: active ? "#fff" : TEXT_DIM,
              background: active ? ACTIVE_BG : "transparent",
              border: `1px solid ${active ? ACTIVE_BORDER : "transparent"}`,
              position: "relative", transition: "all 0.15s ease",
            }}>
              {active && (
                <div style={{
                  position: "absolute", left: 0, top: "50%",
                  transform: "translateY(-50%)",
                  width: 3, height: "55%", borderRadius: "0 2px 2px 0",
                  background: ACCENT, boxShadow: "0 0 8px rgba(255,122,24,0.6)",
                }} />
              )}
              <Icon size={15} color={active ? "#FF7A18" : "rgba(255,255,255,0.28)"} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ margin: "0 10px", height: 1, background: BORDER }} />
      <div style={{ padding: "10px 10px 18px" }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 10, textDecoration: "none",
          fontSize: 12.5, color: "rgba(255,255,255,0.22)",
          border: "1px solid transparent", transition: "all 0.15s",
        }}>
          <ArrowLeft size={13} strokeWidth={1.8} />
          Back to site
        </Link>
      </div>
    </aside>
  );
}

// ─── Upload panel ─────────────────────────────────────────────────────────────

function UploadPanel({ onUploaded }: { onUploaded: (r: UploadResult) => void }) {
  const [accountId, setAccountId]   = useState("");
  const [accountName, setAccountName] = useState("");
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [result, setResult]         = useState<UploadResult | null>(null);

  async function handleUpload() {
    if (!accountId.trim() || !file) return;
    setLoading(true); setError(null); setResult(null);
    const fd = new FormData();
    fd.append("account_id", accountId.trim());
    if (accountName.trim()) fd.append("account_name", accountName.trim());
    fd.append("tov_file", file);
    try {
      const res = await fetch(`${BACKEND}/journal/upload`, { method: "POST", body: fd });
      if (!res.ok) { const j = await res.json(); throw new Error(j.detail ?? res.statusText); }
      const data: UploadResult = await res.json();
      setResult(data);
      onUploaded(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0B0B0F", border: `1px solid ${BORDER}`,
    borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "24px 28px", maxWidth: 520 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 20px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Upload Tradeovate CSV
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Account ID <span style={{ color: RED }}>*</span>
          </label>
          <input
            style={inputStyle}
            placeholder="e.g. 123456 (copy from Tradeovate)"
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Account Name (optional)
          </label>
          <input
            style={inputStyle}
            placeholder="e.g. Apex 50k #1"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Tradeovate Performance CSV <span style={{ color: RED }}>*</span>
          </label>
          <label style={{
            display: "flex", alignItems: "center", gap: 10,
            border: `1px dashed ${file ? "rgba(255,122,24,0.4)" : BORDER}`,
            borderRadius: 8, padding: "12px 16px", cursor: "pointer",
            background: file ? "rgba(255,122,24,0.04)" : "transparent",
            transition: "all 0.15s",
          }}>
            <Upload size={16} color={file ? "#FF7A18" : TEXT_DIM} strokeWidth={1.8} />
            <span style={{ fontSize: 13, color: file ? "#FF7A18" : TEXT_DIM }}>
              {file ? file.name : "Click to select CSV"}
            </span>
            <input type="file" accept=".csv" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!accountId.trim() || !file || loading}
          style={{
            marginTop: 4,
            padding: "11px 0", borderRadius: 10, border: "none",
            background: (!accountId.trim() || !file || loading) ? "rgba(255,122,24,0.25)" : ACCENT,
            color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: (!accountId.trim() || !file || loading) ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
          }}
        >
          {loading ? "Uploading…" : "Upload & Save"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)", color: RED, fontSize: 12.5 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)" }}>
          <p style={{ margin: 0, fontSize: 13, color: GREEN, fontWeight: 600 }}>Uploaded successfully</p>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {result.trade_count} trades · {result.date_from} → {result.date_to} · Total P&L: <span style={{ color: pnlColor(result.total_pnl) }}>{fmt.pnl(result.total_pnl)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Day detail modal ─────────────────────────────────────────────────────────

function DayModal({
  accountId, date, onClose,
}: { accountId: string; date: string; onClose: () => void }) {
  const [data, setData] = useState<{ trades: JournalTrade[]; total_pnl: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/journal/day?account_id=${encodeURIComponent(accountId)}&date=${date}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [accountId, date]);

  const wins   = data?.trades.filter(t => t.pnl > 0).length ?? 0;
  const losses = data?.trades.filter(t => t.pnl <= 0).length ?? 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: SURFACE2, border: `1px solid ${BORDER}`,
          borderRadius: 18, width: "min(860px, 92vw)", maxHeight: "80vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{date}</p>
            {data && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: TEXT_DIM }}>
                {data.trades.length} trades · {wins}W / {losses}L · Total: <span style={{ color: pnlColor(data.total_pnl), fontWeight: 600 }}>{fmt.pnl(data.total_pnl)}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_DIM, display: "flex", alignItems: "center" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <p style={{ textAlign: "center", color: TEXT_DIM, padding: "32px 0", fontSize: 13 }}>Loading…</p>
          ) : !data || data.trades.length === 0 ? (
            <p style={{ textAlign: "center", color: TEXT_DIM, padding: "32px 0", fontSize: 13 }}>No trades found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: SURFACE }}>
                  {["Symbol","Dir","Entry Time","Entry","Exit Time","Exit","Qty","Duration","P&L"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 10, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.trades.map((t, i) => (
                  <tr key={t.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)", borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "10px 16px", color: "#fff", fontWeight: 600 }}>{t.symbol}</td>
                    <td style={{ padding: "10px 16px", color: t.direction === "LONG" ? GREEN : RED, fontWeight: 600, fontSize: 11 }}>{t.direction}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.6)" }}>{fmt.time(t.entry_time)}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.8)" }}>{t.entry_price?.toFixed(2) ?? "—"}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.6)" }}>{fmt.time(t.exit_time)}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.8)" }}>{t.exit_price?.toFixed(2) ?? "—"}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.6)" }}>{t.qty}</td>
                    <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.5)" }}>{fmt.dur(t.duration_sec)}</td>
                    <td style={{ padding: "10px 16px", color: pnlColor(t.pnl), fontWeight: 700 }}>{fmt.pnl(t.pnl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  accountId, year, month,
  onDayClick,
}: {
  accountId: string;
  year: number;
  month: number;
  onDayClick: (date: string) => void;
}) {
  const [days, setDays]     = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    fetch(`${BACKEND}/journal/calendar?account_id=${encodeURIComponent(accountId)}&year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => setDays(d.days ?? []))
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [accountId, year, month]);

  // Build a lookup by date string
  const byDate: Record<string, CalendarDay> = {};
  for (const d of days) byDate[d.trade_date] = d;

  // Calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const monthPnl = days.reduce((s, d) => s + (d.total_pnl ?? 0), 0);
  const tradingDays = days.length;

  return (
    <div>
      {/* Month summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Month P&L", value: fmt.pnl(monthPnl), color: pnlColor(monthPnl), Icon: DollarSign },
          { label: "Trading Days", value: String(tradingDays), color: "#FF7A18", Icon: Hash },
          { label: "Win Days", value: String(days.filter(d => d.total_pnl > 0).length), color: GREEN, Icon: TrendingUp },
          { label: "Loss Days", value: String(days.filter(d => d.total_pnl <= 0 && d.trade_count > 0).length), color: RED, Icon: TrendingDown },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 18px", minWidth: 130, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Icon size={13} color={color} strokeWidth={2} />
              <span style={{ fontSize: 10, color: TEXT_DIM, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: TEXT_DIM, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ textAlign: "center", color: TEXT_DIM, padding: "40px 0", fontSize: 13 }}>Loading…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const info    = byDate[dateStr];
            const hasTrades = !!info;
            const pnl     = info?.total_pnl ?? null;
            const isGreen = pnl != null && pnl > 0;
            const isRed   = pnl != null && pnl <= 0;

            return (
              <div
                key={dateStr}
                onClick={() => hasTrades && onDayClick(dateStr)}
                style={{
                  borderRadius: 10,
                  padding: "10px 8px 8px",
                  minHeight: 72,
                  background: isGreen
                    ? "rgba(74,222,128,0.07)"
                    : isRed
                    ? "rgba(248,113,113,0.07)"
                    : SURFACE,
                  border: `1px solid ${
                    isGreen ? "rgba(74,222,128,0.22)"
                    : isRed  ? "rgba(248,113,113,0.22)"
                    : BORDER
                  }`,
                  cursor: hasTrades ? "pointer" : "default",
                  transition: "all 0.12s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: hasTrades ? "#fff" : "rgba(255,255,255,0.25)" }}>{day}</span>
                {hasTrades && (
                  <>
                    <span style={{ fontSize: 13, fontWeight: 700, color: isGreen ? GREEN : RED, lineHeight: 1.2 }}>
                      {fmt.pnl(pnl)}
                    </span>
                    <span style={{ fontSize: 10, color: TEXT_DIM }}>
                      {info.trade_count} trade{info.trade_count !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const today       = new Date();
  const [accounts, setAccounts]         = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [year, setYear]                 = useState(today.getFullYear());
  const [month, setMonth]               = useState(today.getMonth() + 1);
  const [tab, setTab]                   = useState<"calendar" | "upload">("calendar");
  const [modalDate, setModalDate]       = useState<string | null>(null);
  const [calKey, setCalKey]             = useState(0); // force calendar refresh after upload

  const loadAccounts = useCallback(() => {
    fetch(`${BACKEND}/journal/accounts`)
      .then(r => r.json())
      .then(d => {
        setAccounts(d.accounts ?? []);
        if (!selectedAccount && d.accounts?.length) {
          setSelectedAccount(d.accounts[0].account_id);
        }
      })
      .catch(() => {});
  }, [selectedAccount]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>
      <Sidebar />

      {/* Right column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>Trading Journal</h1>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "rgba(255,122,24,0.10)", color: "#FF7A18", border: "1px solid rgba(255,122,24,0.22)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Beta</span>
          </div>

          {/* Account selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: TEXT_DIM }}>Account:</span>
            <select
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, color: "#fff", fontSize: 12.5, padding: "6px 10px", outline: "none", cursor: "pointer" }}
            >
              {accounts.length === 0 && <option value="">— upload first —</option>}
              {accounts.map(a => (
                <option key={a.account_id} value={a.account_id}>
                  {a.account_name ? `${a.account_name} (${a.account_id})` : a.account_id}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Tab bar */}
        <div style={{ padding: "16px 24px 0", borderBottom: `1px solid ${BORDER}`, background: SURFACE, display: "flex", gap: 4 }}>
          {(["calendar", "upload"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 16px", borderRadius: "10px 10px 0 0", border: "none",
                background: tab === t ? BG : "transparent",
                color: tab === t ? "#fff" : TEXT_DIM,
                fontWeight: tab === t ? 600 : 400, fontSize: 13,
                cursor: "pointer", transition: "all 0.15s",
                borderTop: tab === t ? `1px solid ${BORDER}` : "1px solid transparent",
                borderLeft: tab === t ? `1px solid ${BORDER}` : "1px solid transparent",
                borderRight: tab === t ? `1px solid ${BORDER}` : "1px solid transparent",
              }}
            >
              {t === "calendar" ? "Calendar" : "Upload CSV"}
            </button>
          ))}
        </div>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {tab === "upload" && (
            <UploadPanel
              onUploaded={() => {
                loadAccounts();
                setCalKey(k => k + 1);
                setTab("calendar");
              }}
            />
          )}

          {tab === "calendar" && (
            <div>
              {/* Month navigation */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <button onClick={prevMonth} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", minWidth: 180, textAlign: "center" }}>
                  {MONTHS[month - 1]} {year}
                </span>
                <button onClick={nextMonth} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <ChevronRight size={16} />
                </button>
                <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); }} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 12px", color: TEXT_DIM, fontSize: 12, cursor: "pointer" }}>
                  Today
                </button>
              </div>

              {!selectedAccount ? (
                <div style={{ textAlign: "center", color: TEXT_DIM, padding: "60px 0", fontSize: 14 }}>
                  No account found.{" "}
                  <button onClick={() => setTab("upload")} style={{ background: "none", border: "none", color: "#FF7A18", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}>
                    Upload a CSV to get started.
                  </button>
                </div>
              ) : (
                <Calendar
                  key={`${selectedAccount}-${year}-${month}-${calKey}`}
                  accountId={selectedAccount}
                  year={year}
                  month={month}
                  onDayClick={setModalDate}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Day detail modal */}
      {modalDate && selectedAccount && (
        <DayModal
          accountId={selectedAccount}
          date={modalDate}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
}
