import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const C = {
  bg: "#2B2B2B",
  surface: "#333333",
  border: "#3A3A3A",
  borderLight: "#444444",
  white: "#FAFAF8",
  charcoal: "#CCCCCC",
  mid: "#888888",
  dim: "#555555",
};

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getDaysInMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getMonthLabel() {
  const d = new Date();
  return d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
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

// --- LOADING ---
function Loading() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "10px", letterSpacing: "0.22em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>
        LOADING
      </div>
    </div>
  );
}

// --- INPUT STYLE ---
const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: `1px solid #3A3A3A`,
  background: "transparent",
  fontSize: "15px",
  fontFamily: "Calibri, sans-serif",
  color: "#FAFAF8",
  padding: "10px 0",
  outline: "none",
  boxSizing: "border-box",
  caretColor: "#FAFAF8",
};

// --- PRIVACY POLICY ---
function Privacy({ onBack }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 48px" }}>
      <div style={{ paddingTop: "48px" }}>
        <button onClick={onBack} style={{
          border: "none", background: "transparent", cursor: "pointer",
          fontSize: "10px", letterSpacing: "0.14em", color: C.dim,
          fontFamily: "Calibri, sans-serif", padding: 0, marginBottom: "32px", display: "block",
        }}>← BACK</button>

        <div style={{ fontSize: "10px", letterSpacing: "0.22em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "8px" }}>ARETE</div>
        <div style={{ fontSize: "28px", color: C.white, lineHeight: 1, marginBottom: "8px" }}>Privacy Policy</div>
        <div style={{ fontSize: "11px", color: C.dim, fontFamily: "Calibri, sans-serif", letterSpacing: "0.08em", marginBottom: "40px" }}>LAST UPDATED: MAY 2026</div>

        {[
          { title: "Overview", body: "ARETE is a personal execution tracking tool. This policy describes what information we collect, how we use it, and what we do not do with it. It is written plainly because that is how ARETE operates." },
          { title: "What We Collect", body: "We collect your email address when you create an account. We store the execution rules you set each month and the daily log entries you submit. Nothing else is collected. We do not collect your name, location, device information, or browsing behavior." },
          { title: "How We Use It", body: "Your email address is used to identify your account and to send password reset emails if you request one. Your rules and logs are stored so the app works as intended — your data persists between sessions and is accessible only to you." },
          { title: "What We Do Not Do", body: "We do not sell your data. We do not share it with third parties. We do not use it for advertising. We do not analyze it in aggregate. Your data exists to serve you, not us." },
          { title: "Data Storage", body: "Your data is stored securely using Supabase, a managed database platform. Data is encrypted in transit and at rest. You can request deletion of your account and all associated data at any time by contacting us." },
          { title: "Contact", body: "Questions about this policy can be directed to hello@getaretejournal.com." },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "10px" }}>{title.toUpperCase()}</div>
            <div style={{ fontSize: "14px", color: C.charcoal, fontFamily: "Calibri, sans-serif", lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "24px", fontSize: "10px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>
          EXECUTE · EVALUATE · REPEAT
        </div>
      </div>
    </div>
  );
}

// --- AUTH SCREEN ---
function Auth({ onAuth }) {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot | privacy
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else { setMessage("Account created. Check your email to confirm, then sign in."); setMode("signin"); }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("Invalid email or password."); }
      else { onAuth(data.user); }
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    setError(null);
    setMessage(null);
    if (!email) { setError("Enter your email address above first."); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setMessage("Password reset email sent.");
    setLoading(false);
  };

  if (mode === "privacy") {
    return (
      <div style={{ maxWidth: "390px", margin: "0 auto", height: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
        <Privacy onBack={() => setMode("signin")} />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "390px", margin: "0 auto", height: "100vh",
      background: C.bg, display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "0 32px",
      boxShadow: "0 0 60px rgba(0,0,0,0.5)",
    }}>
      {/* Wordmark */}
      <div style={{ marginBottom: "8px", fontSize: "22px", letterSpacing: "0.26em", color: C.white, fontFamily: "Georgia, serif" }}>
        ARETE
      </div>
      <div style={{ fontSize: "11px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "48px" }}>
        EXCELLENCE THROUGH EXECUTION
      </div>

      {/* Mode label */}
      <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "24px" }}>
        {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
      </div>

      {/* Fields */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "4px" }}>EMAIL</div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "4px" }}>PASSWORD</div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={inputStyle}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>

      {/* Stay signed in */}
      <div onClick={() => setStaySignedIn(!staySignedIn)}
        style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", cursor: "pointer" }}>
        <div style={{
          width: "18px", height: "18px", borderRadius: "3px",
          border: `1.5px solid ${staySignedIn ? C.white : C.border}`,
          background: staySignedIn ? C.white : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s", flexShrink: 0,
        }}>
          {staySignedIn && (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polyline points="1,5 4,8 9,2" fill="none" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div style={{ fontSize: "12px", color: C.charcoal, fontFamily: "Calibri, sans-serif" }}>Stay signed in</div>
      </div>

      {/* Error / message */}
      {error && <div style={{ fontSize: "12px", color: "#CC4444", fontFamily: "Calibri, sans-serif", marginBottom: "16px", lineHeight: 1.5 }}>{error}</div>}
      {message && <div style={{ fontSize: "12px", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "16px", lineHeight: 1.5 }}>{message}</div>}

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading}
        style={{
          width: "100%", padding: "14px", background: C.white, border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "11px", letterSpacing: "0.18em", fontFamily: "Calibri, sans-serif",
          color: C.bg, marginBottom: "16px", opacity: loading ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}>
        {loading ? "..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
      </button>

      {/* Secondary actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
          style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "11px", color: C.mid, fontFamily: "Calibri, sans-serif", padding: 0 }}>
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
        {mode === "signin" && (
          <button onClick={handleForgot} disabled={loading}
            style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "11px", color: C.dim, fontFamily: "Calibri, sans-serif", padding: 0 }}>
            Forgot password
          </button>
        )}
      </div>

      {/* Privacy */}
      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <button onClick={() => setMode("privacy")}
          style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", letterSpacing: "0.1em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>
          Privacy Policy
        </button>
      </div>
    </div>
  );
}

// --- TAP CHECKBOX ---
function TapCheckbox({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)}
      style={{ cursor: "pointer", userSelect: "none", flexShrink: 0 }}>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="12" fill={checked ? C.white : "transparent"}
          stroke={checked ? C.white : C.borderLight} strokeWidth="1.5" />
        {checked && (
          <polyline points="9,15 13,19 21,10" fill="none"
            stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}

// --- DAILY LOG ---
function DailyLog({ rules, user }) {
  const today = new Date();
  const dayNum = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = today.getFullYear();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const activeRules = rules.filter(r => r.trim() !== "");
  const todayKey = getTodayKey();

  const [entries, setEntries] = useState(activeRules.map(() => ({ checked: false, action: "", notes: "" })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    async function loadLog() {
      const { data } = await supabase
        .from("logs")
        .select("*")
        .eq("date", todayKey)
        .eq("user_id", user.id)
        .single();
      if (data && data.entries) setEntries(data.entries);
      setLoading(false);
    }
    loadLog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveLog = async (updatedEntries) => {
    setSaving(true);
    const score = updatedEntries.filter(e => e.checked).length;
    await supabase.from("logs").upsert({
      date: todayKey,
      entries: updatedEntries,
      score,
      user_id: user.id,
    }, { onConflict: "date" });
    setSaving(false);
  };

  const update = (i, val) => {
    const next = [...entries];
    next[i] = val;
    setEntries(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveLog(next), 800);
  };

  const score = entries.filter(e => e.checked).length;

  if (loading) return <Loading />;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
          {weekday} · {monthName} {year}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "46px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1, letterSpacing: "-0.01em" }}>
            DAY {dayNum}
          </div>
          {saving && <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", paddingBottom: "8px" }}>SAVING...</div>}
        </div>
      </div>

      {activeRules.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: C.dim, fontFamily: "Calibri, sans-serif", lineHeight: 1.6 }}>
            No rules set for this month. Go to Rules to get started.
          </div>
        </div>
      ) : (
        activeRules.map((rule, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingTop: "16px", paddingBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
              <TapCheckbox checked={entries[i]?.checked || false} onChange={(val) => update(i, { ...entries[i], checked: val })} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "3px" }}>RULE {i + 1}</div>
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
        ))
      )}

      {activeRules.length > 0 && (
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
      )}
    </div>
  );
}

// --- MONTHLY TRACKER ---
function MonthlyTracker({ rules, user }) {
  const activeRules = rules.filter(r => r.trim() !== "");
  const daysInMonth = getDaysInMonth();
  const todayDay = new Date().getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [grid, setGrid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const start = `${year}-${month}-01`;
      const end = `${year}-${month}-${String(daysInMonth).padStart(2, "0")}`;
      const activeRuleCount = rules.filter(r => r.trim() !== "").length;

      const { data } = await supabase
        .from("logs")
        .select("*")
        .gte("date", start)
        .lte("date", end)
        .eq("user_id", user.id);

      const newGrid = Array.from({ length: activeRuleCount }, () => Array(daysInMonth).fill(false));

      if (data) {
        data.forEach(log => {
          const day = parseInt(log.date.split("-")[2]) - 1;
          if (log.entries) {
            log.entries.forEach((entry, ri) => {
              if (ri < activeRuleCount) newGrid[ri][day] = entry.checked || false;
            });
          }
        });
      }

      setGrid(newGrid);
      setLoading(false);
    }
    loadLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !grid) return <Loading />;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "20px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>{getMonthLabel().toUpperCase()}</div>
        <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>TRACKER</div>
      </div>

      {activeRules.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: C.dim, fontFamily: "Calibri, sans-serif" }}>No rules set for this month.</div>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: "560px", width: "100%" }}>
              <thead>
                <tr>
                  <td style={{ width: "72px" }} />
                  {days.map(d => (
                    <td key={d} style={{ width: "18px", textAlign: "center", fontSize: "8px", fontFamily: "Calibri, sans-serif", color: d === todayDay ? C.white : C.dim, fontWeight: d === todayDay ? "bold" : "normal", paddingBottom: "8px" }}>{d}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeRules.map((rule, ri) => (
                  <tr key={ri}>
                    <td style={{ paddingRight: "8px", fontSize: "9px", fontFamily: "Calibri, sans-serif", color: C.mid, letterSpacing: "0.1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "72px" }}>R{ri + 1}</td>
                    {days.map((d, di) => (
                      <td key={di} style={{ padding: "2px", textAlign: "center" }}>
                        <div style={{
                          width: "13px", height: "13px", borderRadius: "2px",
                          background: grid[ri] && grid[ri][di] ? C.white : "transparent",
                          border: `1px solid ${grid[ri] && grid[ri][di] ? C.white : C.border}`,
                          margin: "0 auto", opacity: d > todayDay ? 0.2 : 1,
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
        </>
      )}
    </div>
  );
}

// --- CALC STATS ---
function calcStats(rules, logs, daysInMonth) {
  const activeRules = rules.filter(r => r.trim() !== "");
  if (activeRules.length === 0) return null;

  const grid = activeRules.map(() => Array(daysInMonth).fill(false));
  logs.forEach(log => {
    const day = parseInt(log.date.split("-")[2]) - 1;
    if (log.entries) {
      log.entries.forEach((entry, ri) => {
        if (ri < activeRules.length) grid[ri][day] = entry.checked || false;
      });
    }
  });

  const totalPossible = activeRules.length * daysInMonth;
  const totalDone = grid.flat().filter(Boolean).length;
  const overall = Math.round((totalDone / totalPossible) * 100);

  const perRule = activeRules.map((rule, ri) => {
    const row = grid[ri];
    const done = row.filter(Boolean).length;
    const pct = Math.round((done / daysInMonth) * 100);
    let best = 0, cur = 0;
    row.forEach(v => { cur = v ? cur + 1 : 0; best = Math.max(best, cur); });
    return { rule, pct, best };
  });

  const sorted = [...perRule].sort((a, b) => b.pct - a.pct);
  return { overall, perRule, most: sorted[0], least: sorted[sorted.length - 1], grid };
}

// --- MONTH DETAIL ---
function MonthDetail({ monthData, onBack }) {
  const { label, rules, logs, daysInMonth } = monthData;
  const stats = calcStats(rules, logs, daysInMonth);
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const activeRules = rules.filter(r => r.trim() !== "");

  if (!stats) return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px" }}>
        <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>← BACK</button>
        <div style={{ marginTop: "40px", fontSize: "13px", color: C.dim, fontFamily: "Calibri, sans-serif" }}>No data for this month.</div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>HISTORY</div>
          <div style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>{label.toUpperCase()}</div>
        </div>
        <button onClick={onBack} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", paddingBottom: "4px" }}>← BACK</button>
      </div>

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[{ label: "MOST CONSISTENT", data: stats.most, color: C.white }, { label: "NEEDS WORK", data: stats.least, color: C.dim }].map(({ label, data, color }) => (
          <div key={label} style={{ background: C.surface, borderRadius: "4px", padding: "14px" }}>
            <div style={{ fontSize: "8px", letterSpacing: "0.16em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "8px" }}>{label}</div>
            <div style={{ fontSize: "12px", fontFamily: "Georgia, serif", color, lineHeight: 1.3, marginBottom: "6px" }}>{data.rule}</div>
            <div style={{ fontSize: "20px", fontFamily: "Georgia, serif", color }}>{data.pct}%</div>
          </div>
        ))}
      </div>

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
            <div style={{ height: "2px", background: C.border, borderRadius: "1px" }}>
              <div style={{ height: "100%", width: `${r.pct}%`, background: C.white, borderRadius: "1px" }} />
            </div>
          </div>
        ))}
      </div>

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
              {activeRules.map((rule, ri) => (
                <tr key={ri}>
                  <td style={{ fontSize: "8px", color: C.dim, fontFamily: "Calibri, sans-serif", paddingRight: "6px", letterSpacing: "0.1em" }}>R{ri + 1}</td>
                  {dayNums.map((d, di) => (
                    <td key={di} style={{ padding: "2px", textAlign: "center" }}>
                      <div style={{
                        width: "10px", height: "10px", borderRadius: "1px", margin: "0 auto",
                        background: stats.grid[ri][di] ? C.white : "transparent",
                        border: `1px solid ${stats.grid[ri][di] ? C.white : C.border}`,
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
function History({ user, onSelectMonth }) {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const { data: logs } = await supabase.from("logs").select("*").eq("user_id", user.id).order("date", { ascending: false });
      const { data: rulesData } = await supabase.from("rules").select("*").eq("user_id", user.id).order("year", { ascending: false });

      if (!logs || logs.length === 0) { setLoading(false); return; }

      const monthMap = {};
      logs.forEach(log => {
        const [year, month] = log.date.split("-");
        const key = `${year}-${month}`;
        if (!monthMap[key]) monthMap[key] = { logs: [], year: parseInt(year), month: parseInt(month) };
        monthMap[key].logs.push(log);
      });

      const result = Object.entries(monthMap).map(([key, val]) => {
        const ruleRow = rulesData?.find(r => r.month === key);
        const rules = ruleRow?.rules || [];
        const d = new Date(val.year, val.month - 1, 1);
        const daysInMonth = new Date(val.year, val.month, 0).getDate();
        const label = d.toLocaleString("default", { month: "long" }) + " " + val.year;
        return { key, label, rules, logs: val.logs, daysInMonth };
      });

      setMonths(result);
      setLoading(false);
    }
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>ALL TIME</div>
        <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>HISTORY</div>
      </div>

      {months.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: C.dim, fontFamily: "Calibri, sans-serif", lineHeight: 1.6 }}>No history yet. Start logging to see your data here.</div>
        </div>
      ) : (
        months.map((month, i) => {
          const stats = calcStats(month.rules, month.logs, month.daysInMonth);
          const overall = stats ? stats.overall : 0;
          return (
            <div key={i} onClick={() => onSelectMonth(month)}
              style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: "15px", fontFamily: "Georgia, serif", color: C.white, marginBottom: "5px" }}>{month.label}</div>
                <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: C.mid, fontFamily: "Calibri, sans-serif" }}>
                  {month.rules.filter(r => r.trim()).length} RULES · {overall}% COMPLETION
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>{overall}%</div>
                <div style={{ fontSize: "14px", color: C.dim }}>›</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// --- RULES ---
function Rules({ rules, setRules, user }) {
  const MAX = 5;
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);
  const activeCount = rules.filter(r => r.trim() !== "").length;

  const updateRule = (i, val) => {
    const next = [...rules];
    next[i] = val;
    setRules(next);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      const d = new Date();
      await supabase.from("rules").upsert({
        month: getMonthKey(),
        year: d.getFullYear(),
        rules: next,
        user_id: user.id,
      }, { onConflict: "month" });
      setSaving(false);
    }, 800);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
      <div style={{ paddingTop: "52px", paddingBottom: "20px", borderBottom: `1px solid ${C.border}`, marginBottom: "4px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: C.mid, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>{getMonthLabel().toUpperCase()}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "32px", fontFamily: "Georgia, serif", color: C.white, lineHeight: 1 }}>RULES</div>
          {saving && <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: C.dim, fontFamily: "Calibri, sans-serif", paddingBottom: "4px" }}>SAVING...</div>}
        </div>
      </div>

      <div style={{ fontSize: "12px", color: C.dim, fontFamily: "Calibri, sans-serif", padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: "4px", lineHeight: 1.6 }}>
        Define up to {MAX} execution rules for this month. Clear, binary, actionable. Leave unused rules blank.
      </div>

      {Array.from({ length: MAX }, (_, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 0" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.16em", color: rules[i]?.trim() ? C.mid : C.dim, fontFamily: "Calibri, sans-serif", marginBottom: "6px" }}>
            RULE {i + 1}{!rules[i]?.trim() ? " — OPTIONAL" : ""}
          </div>
          <input
            type="text"
            value={rules[i] || ""}
            onChange={(e) => updateRule(i, e.target.value)}
            placeholder={i === 0 ? "e.g. 30 mins of exercise" : "Optional"}
            style={{ width: "100%", border: "none", background: "transparent", fontSize: "15px", fontFamily: "Georgia, serif", color: rules[i]?.trim() ? C.white : C.dim, outline: "none", boxSizing: "border-box", caretColor: C.white }}
          />
        </div>
      ))}

      <div style={{ paddingTop: "16px", fontSize: "10px", letterSpacing: "0.12em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>
        {activeCount} OF {MAX} RULES SET
      </div>

      {/* Sign out */}
      <div style={{ marginTop: "48px", borderTop: `1px solid ${C.border}`, paddingTop: "20px" }}>
        <button onClick={() => supabase.auth.signOut()}
          style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "10px", letterSpacing: "0.16em", color: C.dim, fontFamily: "Calibri, sans-serif", padding: 0 }}>
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

// --- APP ---
export default function AreteApp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState("log");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [rules, setRules] = useState(["", "", "", "", ""]);
  const [rulesLoaded, setRulesLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadRules() {
      const { data } = await supabase
        .from("rules")
        .select("*")
        .eq("month", getMonthKey())
        .eq("user_id", user.id)
        .single();
      if (data && data.rules) setRules(data.rules);
      setRulesLoaded(true);
    }
    loadRules();
  }, [user]);

  const activeRules = rules.filter(r => r.trim() !== "");

  if (!authChecked) return (
    <div style={{ maxWidth: "390px", margin: "0 auto", height: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "10px", letterSpacing: "0.22em", color: C.dim, fontFamily: "Calibri, sans-serif" }}>LOADING</div>
    </div>
  );

  if (!user) return <Auth onAuth={setUser} />;

  return (
    <div style={{
      maxWidth: "390px", margin: "0 auto", height: "100vh",
      background: C.bg, display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif", position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.5)",
    }}>
      <div style={{ position: "absolute", top: "18px", left: "20px", fontSize: "12px", letterSpacing: "0.26em", color: C.white, fontFamily: "Georgia, serif", zIndex: 10 }}>ARETE</div>

      {!rulesLoaded ? <Loading /> : (
        <>
          {tab === "log" && <DailyLog rules={activeRules} user={user} />}
          {tab === "tracker" && <MonthlyTracker rules={rules} user={user} />}
          {tab === "history" && !selectedMonth && <History user={user} onSelectMonth={(m) => setSelectedMonth(m)} />}
          {tab === "history" && selectedMonth && <MonthDetail monthData={selectedMonth} onBack={() => setSelectedMonth(null)} />}
          {tab === "rules" && <Rules rules={rules} setRules={setRules} user={user} />}
        </>
      )}

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
