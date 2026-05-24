import { useState, useRef } from "react";

const C = {
  bg: "#2B2B2B",
  surface: "#333333",
  border: "#3A3A3A",
  borderLight: "#444444",
  white: "#FAFAF8",
  charcoal: "#CCCCCC",
  mid: "#888888",
  dim: "#555555",
  accent: "#FAFAF8",
};

// --- SAMPLE DATA ---
const SAMPLE_MONTHS = [
  {
    label: "April 2026",
    rules: ["30 mins of exercise", "Read 10 pages", "No alcohol", "Cold shower"],
    grid: Array.from({ length: 4 }, (_, ri) =>
      Array.from({ length: 30 }, (_, di) => Math.random() > (ri === 2 ? 0.45 : 0.3))
    ),
  },
  {
    label: "March 2026",
    rules: ["30 mins of exercise", "Read 10 pages", "No alcohol"],
    grid: Array.from({ length: 3 }, (_, ri) =>
      Array.from({ length: 31 }, (_, di) => Math.random() > 0.38)
    ),
  },
  {
    label: "February 2026",
    rules: ["30 mins of exercise", "Read 10 pages", "No alcohol", "Cold shower", "In bed by 10:30pm"],
    grid: Array.from({ length: 5 }, (_, ri) =>
      Array.from({ length: 28 }, (_, di) => Math.random() > 0.42)
    ),
  },
];

function calcStats(month) {
  const { rules, grid } = month;
  const days = grid[0].length;
  const totalPossible = rules.length * days;
  const totalDone = grid.flat().filter(Boolean).length;
  const overall = Math.round((totalDone / totalPossible) * 100);

  const perRule = rules.map((rule, ri) => {
    const row = grid[ri];
    const done = row.filter(Boolean).length;
    const pct = Math.round((done / days) * 100);
    let best = 0, cur = 0;
    row.forEach((v) => { cur = v ? cur + 1 : 0; best = Math.max(best, cur); });
    return { rule, pct, best };
  });

  const sorted = [...perRule].sort((a, b) => b.pct - a.pct);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];

  return { overall, perRule, most, least };
}

// --- ICONS ---
function LogIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="16" height="16" rx="1" stroke={active ? C.white : C.dim} strokeWidth="1.5" />
      <line x1="7" y1="8" x2="15" y2="8" stroke={active ? C.white : C.dim} strokeWidth="1.5" />
      <line x1="7" y1="11" x2="15" y2="11" stroke={active ? C.white : C.dim} strokeWidth="1.5" />
      <line x1="7" y1="14" x2="11" y2="14" stroke={active ? C.white : C.dim} strokeWidth="1.5" />
    </svg>
  );
}
function TrackerIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {[[3,3],[9,3],[15,3],[3,9],[9,9],[15,9],[3,15],[9,15],[15,15]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" rx="0.5" fill={active ? C.white : (i%2===0 ? C.dim : C.border)} />
      ))}
    </svg>
  );
}
function HistoryIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="7.5" stroke={active ? C.white : C.dim} strokeWidth="1.5" />
      <polyline points="11,7 11,11 14,13" stroke={active ? C.white : C.dim} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function RulesIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="4" y1="6" x2="18" y2="6" stroke={active ? C.white : C.dim} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="11" x2="18" y2="11" stroke={active ? C.white : C.dim} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="16" x2="12" y2="16" stroke={active ? C.white : C.dim} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { id: "log", label: "Log", Icon: LogIcon },
  { id: "tracker", label: "Tracker", Icon: TrackerIcon },
  { id: "history", label: "History", Icon: HistoryIcon },
  { id: "rules", label: "Rules", Icon: RulesIcon },
];

// --- HOLD CHECKBOX ---
function HoldCheckbox({ checked, onChange }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const DURATION = 550;

  const start = () => {
    if (checked) { onChange(false); return; }
    setHolding(true);
    const t0 = Date.now();
    progressTimer.current = setInterval(() => {
      setProgress(Math.min((Date.now() - t0) / DURATION, 1));
    }, 16);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current);
      setHolding(false);
      setProgress(0);
      onChange(true);
    }, DURATION);
  };

  const cancel = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    setHolding(false);
    setProgress(0);
  };

  const circ = 2 * Math.PI * 11;

  return (
    <div onMouseDown={start} onMouseUp={cancel} onMouseLeave={cancel}
      onTouchStart={start} onTouchEnd={cancel}
      style={{ cursor: "pointer", userSelect: "none", flexShrink: 0 }}>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="12" fill={checked ? C.white : "transparent"}
          stroke={checked ? C.white : C.borderLight} strokeWidth="1.5" />
        {holding && !checked && (
          <circle cx="15" cy="15" r="11" fill="none" stroke={C.white} strokeWidth="2"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
            strokeLinecap="round" transform="rotate(-90 15 15)" />
        )}
        {checked && (
          <polyline points="9,15 13,19 21,10" fill="none"
            stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}

// --- DAILY LOG ---
function DailyLog({ rules }) {
  const today = new Date();
  const dayNum = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = today.getFullYear();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  const [entries, setEntries] = useState(rules.map(() => ({ checked: false, action: "", notes: "" })));
  const score = entries.filter((e) => e.checked).length;
  const activeRules = rules.filter(r => r.trim() !== "");

  const update = (i, val) => {
    const next = [...entries];
    next[i] = val;
    setEntries(next);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
          {weekday} · {monthName} {year}
        </div>
        <div style={{ fontSize: "46px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1, letterSpacing: "-0.01em" }}>
          DAY {dayNum}
        </div>
      </div>

      {activeRules.map((rule, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingTop: "16px", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
            <HoldCheckbox checked={entries[i]?.checked || false} onChange={(val) => update(i, { ...entries[i], checked: val })} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "3px" }}>
                RULE {i + 1}
              </div>
              <div style={{
                fontSize: "15px", color: entries[i]?.checked ? C.dim : C.white,
                fontFamily: "Georgia, serif", lineHeight: 1.4,
                textDecoration: entries[i]?.checked ? "line-through" : "none",
                transition: "color 0.2s",
              }}>{rule}</div>
            </div>
          </div>
          <div style={{ paddingLeft: "42px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[["ACTION", "action", "What did you do"], ["NOTES", "notes", "Anything worth remembering"]].map(([label, field, ph]) => (
              <div key={field}>
                <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "4px" }}>{label}</div>
                {field === "notes" ? (
                  <textarea value={entries[i]?.[field] || ""} onChange={(e) => update(i, { ...entries[i], [field]: e.target.value })}
                    placeholder={ph} rows={2}
                    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", fontSize: "13px", fontFamily: "Calibri, sans-serif", color: C.charcoal, padding: "4px 0", outline: "none", resize: "none", boxSizing: "border-box", caretColor: C.white }} />
                ) : (
                  <input type="text" value={entries[i]?.[field] || ""} onChange={(e) => update(i, { ...entries[i], [field]: e.target.value })}
                    placeholder={ph}
                    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", fontSize: "13px", fontFamily: "Calibri, sans-serif", color: C.charcoal, padding: "4px 0", outline: "none", boxSizing: "border-box", caretColor: C.white }} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.18em", color: C.mid, fontFamily: "Calibri, sans-serif" }}>DAILY SCORE</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {Array.from({ length: activeRules.length }, (_, i) => i + 1).map((n) => (
            <div key={n} style={{
              width: "32px", height: "32px", borderRadius: "50%",
              border: `1.5px solid ${n <= score ? C.white : C.border}`,
              background: n <= score ? C.white : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontFamily: "Georgia, serif",
              color: n <= score ? C.bg : C.dim,
              transition: "all 0.2s",
            }}>{n}</div>
          ))}
          <div style={{ fontSize: "13px", color: C.mid, fontFamily: "Georgia, serif", marginLeft: "2px" }}>/ {activeRules.length}</div>
        </div>
      </div>
    </div>
  );
}

// --- MONTHLY TRACKER ---
function MonthlyTracker({ rules, month, year, daysInMonth }) {
  const today = new Date();
  const todayDay = today.getDate();
  const activeRules = rules.filter(r => r.trim() !== "");

  const [grid, setGrid] = useState(
    activeRules.map(() => Array(daysInMonth).fill(false))
  );

  const toggle = (ri, di) => {
    const next = grid.map(row => [...row]);
    next[ri][di] = !next[ri][di];
    setGrid(next);
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
          {month.toUpperCase()} {year}
        </div>
        <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>TRACKER</div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "560px", width: "100%" }}>
          <thead>
            <tr>
              <td style={{ width: "72px" }} />
              {days.map(d => (
                <td key={d} style={{ width: "18px", textAlign: "center", fontSize: "8px", fontFamily: "Calibri, sans-serif", color: d === todayDay ? C.white : C.dim, fontWeight: d === todayDay ? "bold" : "normal", paddingBottom: "8px", letterSpacing: "0.04em" }}>{d}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeRules.map((rule, ri) => (
              <tr key={ri}>
                <td style={{ paddingRight: "8px", paddingTop: "4px", paddingBottom: "4px", fontSize: "9px", fontFamily: "Calibri, sans-serif", color: C.mid, letterSpacing: "0.1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "72px" }}>
                  R{ri + 1}
                </td>
                {days.map((d, di) => (
                  <td key={di} style={{ padding: "2px", textAlign: "center" }}>
                    <div onClick={() => toggle(ri, di)} style={{
                      width: "13px", height: "13px", borderRadius: "2px",
                      background: grid[ri][di] ? C.white : "transparent",
                      border: `1px solid ${grid[ri][di] ? C.white : C.border}`,
                      cursor: "pointer", margin: "0 auto",
                      transition: "all 0.15s",
                      opacity: d > todayDay ? 0.2 : 1,
                    }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "24px", borderTop: `1px solid ${C.border}`, paddingTop: "16px" }}>
        {activeRules.map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", paddingTop: "2px", flexShrink: 0 }}>R{i + 1}</div>
            <div style={{ fontSize: "13px", fontFamily: "Georgia, serif", color: C.charcoal }}>{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MONTH DETAIL (history drill-down) ---
function MonthDetail({ month, onBack }) {
  const stats = calcStats(month);
  const days = month.grid[0].length;
  const dayNums = Array.from({ length: days }, (_, i) => i + 1);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
            HISTORY
          </div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>{month.label.toUpperCase()}</div>
        </div>
        <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", letterSpacing: "0.14em", color: C.mid, fontFamily: "Calibri, sans-serif", paddingBottom: "4px" }}>
          ← BACK
        </button>
      </div>

      {/* Overall */}
      <div style={{ background: C.surface, borderRadius: "4px", padding: "20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>OVERALL COMPLETION</div>
          <div style={{ fontSize: "42px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>{stats.overall}%</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>BEST RULE</div>
          <div style={{ fontSize: "13px", fontFamily: "Georgia, serif", color: C.white, maxWidth: "120px", textAlign: "right" }}>{stats.most.rule}</div>
          <div style={{ fontSize: "11px", color: C.mid, fontFamily: "Calibri, sans-serif", marginTop: "2px" }}>{stats.most.pct}%</div>
        </div>
      </div>

      {/* Most / Least */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[{ label: "MOST CONSISTENT", data: stats.most, color: C.white }, { label: "NEEDS WORK", data: stats.least, color: C.dim }].map(({ label, data, color }) => (
          <div key={label} style={{ background: C.surface, borderRadius: "4px", padding: "14px" }}>
            <div style={{ fontSize: "8px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "8px" }}>{label}</div>
            <div style={{ fontSize: "12px", fontFamily: "Georgia, serif", color, lineHeight: 1.3, marginBottom: "6px" }}>{data.rule}</div>
            <div style={{ fontSize: "20px", fontFamily: "Georgia, serif", color }}>{data.pct}%</div>
          </div>
        ))}
      </div>

      {/* Per rule stats */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "12px" }}>RULE BREAKDOWN</div>
        {stats.perRule.map((r, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "12px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "9px", letterSpacing: "0.12em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "2px" }}>RULE {i + 1}</div>
                <div style={{ fontSize: "13px", fontFamily: "Georgia, serif", color: C.white }}>{r.rule}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                <div style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: C.white }}>{r.pct}%</div>
                <div style={{ fontSize: "9px", color: C.dim, fontFamily: "Calibri, sans-serif", letterSpacing: "0.1em" }}>STREAK {r.best}d</div>
              </div>
            </div>
            {/* Bar */}
            <div style={{ height: "2px", background: C.border, borderRadius: "1px" }}>
              <div style={{ height: "100%", width: `${r.pct}%`, background: C.white, borderRadius: "1px", transition: "width 0.4s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Mini tracker grid */}
      <div>
        <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "12px" }}>TRACKER</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "480px" }}>
            <thead>
              <tr>
                <td style={{ width: "60px" }} />
                {dayNums.map(d => (
                  <td key={d} style={{ width: "14px", textAlign: "center", fontSize: "7px", color: C.dim, fontFamily: "Calibri, sans-serif", paddingBottom: "6px" }}>{d}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {month.rules.map((rule, ri) => (
                <tr key={ri}>
                  <td style={{ fontSize: "8px", color: C.dim, fontFamily: "Calibri, sans-serif", paddingRight: "6px", letterSpacing: "0.1em" }}>R{ri + 1}</td>
                  {dayNums.map((d, di) => (
                    <td key={di} style={{ padding: "2px", textAlign: "center" }}>
                      <div style={{
                        width: "10px", height: "10px", borderRadius: "1px", margin: "0 auto",
                        background: month.grid[ri][di] ? C.white : "transparent",
                        border: `1px solid ${month.grid[ri][di] ? C.white : C.border}`,
                      }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- HISTORY LIST ---
function History({ onSelectMonth }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>ALL TIME</div>
        <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>HISTORY</div>
      </div>

      {SAMPLE_MONTHS.map((month, i) => {
        const stats = calcStats(month);
        return (
          <div key={i} onClick={() => onSelectMonth(month)}
            style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: "15px", fontFamily: "Georgia, serif", color: C.white, marginBottom: "5px" }}>{month.label}</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: C.mid, fontFamily: "Calibri, sans-serif" }}>
                {month.rules.length} RULES · {stats.overall}% COMPLETION
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>{stats.overall}%</div>
              </div>
              <div style={{ fontSize: "14px", color: C.dim }}>›</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- RULES ---
function Rules({ rules, setRules }) {
  const MAX = 5;
  const activeCount = rules.filter(r => r.trim() !== "").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>MAY 2026</div>
        <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>RULES</div>
      </div>

      <div style={{ fontSize: "12px", color: C.dim, fontFamily: "Calibri, sans-serif", padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: "4px", lineHeight: 1.5 }}>
        Define up to {MAX} execution rules for this month. Clear, binary, actionable. Leave unused rules blank.
      </div>

      {Array.from({ length: MAX }, (_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 0" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: rules[i]?.trim() ? C.mid : C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
            RULE {i + 1}{rules[i]?.trim() === "" ? " — OPTIONAL" : ""}
          </div>
          <input
            type="text"
            value={rules[i] || ""}
            onChange={(e) => {
              const next = [...rules];
              next[i] = e.target.value;
              setRules(next);
            }}
            placeholder={i < 3 ? "e.g. 30 mins of exercise" : "Optional"}
            style={{
              width: "100%", border: "none", background: "transparent",
              fontSize: "15px", fontFamily: "Georgia, serif",
              color: rules[i]?.trim() ? C.white : C.dim,
              outline: "none", boxSizing: "border-box",
              caretColor: C.white,
            }}
          />
        </div>
      ))}

      <div style={{ paddingTop: "16px", fontSize: "10px", letterSpacing: "0.12em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>
        {activeCount} OF {MAX} RULES SET
      </div>
    </div>
  );
}

// --- APP ---
export default function AreteApp() {
  const [tab, setTab] = useState("log");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [rules, setRules] = useState([
    "30 mins of exercise",
    "Read 10 pages",
    "No alcohol",
    "",
    "",
  ]);

  const activeRules = rules.filter(r => r.trim() !== "");

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setTab("history");
  };

  const renderScreen = () => {
    if (tab === "log") return <DailyLog rules={activeRules} />;
    if (tab === "tracker") return <MonthlyTracker rules={activeRules} month="May" year={2026} daysInMonth={31} />;
    if (tab === "history") {
      if (selectedMonth) return <MonthDetail month={selectedMonth} onBack={() => setSelectedMonth(null)} />;
      return <History onSelectMonth={handleSelectMonth} />;
    }
    if (tab === "rules") return <Rules rules={rules} setRules={setRules} />;
  };

  return (
    <div style={{
      maxWidth: "390px", margin: "0 auto", height: "100vh",
      background: C.bg, display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif", position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.5)",
    }}>
      {/* Wordmark */}
      <div style={{
        position: "absolute", top: "18px", left: "20px",
        fontSize: "12px", letterSpacing: "0.26em",
        color: C.white, fontFamily: "Georgia, serif", zIndex: 10,
      }}>ARETE</div>

      {renderScreen()}

      {/* Tab Bar */}
      <div style={{ borderTop: `1px solid ${C.border}`, display: "flex", background: "#111111", paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => { setTab(id); if (id !== "history") setSelectedMonth(null); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 0", border: "none", background: "transparent", cursor: "pointer", gap: "4px" }}>
              <Icon active={active} />
              <span style={{ fontSize: "8px", letterSpacing: "0.16em", color: active ? C.white : C.dim, fontFamily: "Calibri, sans-serif", transition: "color 0.15s" }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
