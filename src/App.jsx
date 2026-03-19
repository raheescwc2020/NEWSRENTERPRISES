import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from "recharts";

/* ══════════════════════════════════════════════════════════════
   THEME — Industrial Raw Steel
══════════════════════════════════════════════════════════════ */
const C = {
  rust:    "#c0392b",
  rustL:   "#e74c3c",
  rustD:   "#96281b",
  steel:   "#1a1a2e",
  steelM:  "#16213e",
  steelL:  "#0f3460",
  iron:    "#2c2c3e",
  ironL:   "#3a3a52",
  chrome:  "#e8e8f0",
  chromD:  "#b0b0c8",
  zinc:    "#7f8c8d",
  zincL:   "#95a5a6",
  amber:   "#f39c12",
  lime:    "#27ae60",
  teal:    "#1abc9c",
  gold:    "#f1c40f",
  white:   "#f0f0f8",
  dimText: "#8888aa",
};
const PAL = ["#c0392b","#e67e22","#f1c40f","#1abc9c","#3498db","#9b59b6","#27ae60","#e74c3c","#d35400","#16a085","#2980b9","#8e44ad"];

/* ══════════════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════════════ */
const fi = v => "₹" + Math.round(v).toLocaleString("en-IN");
const fs = v => {
  if (v >= 1e7) return "₹" + (v / 1e7).toFixed(2) + " Cr";
  if (v >= 1e5) return "₹" + (v / 1e5).toFixed(1) + " L";
  return "₹" + Math.round(v).toLocaleString("en-IN");
};
const getFY = dt => {
  if (!dt || isNaN(dt)) return "Unknown";
  const m = dt.getMonth() + 1, y = dt.getFullYear();
  return m >= 4 ? `FY ${y}-${String(y + 1).slice(2)}` : `FY ${y - 1}-${String(y).slice(2)}`;
};
const cleanName = s => String(s || "").replace(/\s*\(\d+\)\s*$/, "").trim();
const parseDate = raw => {
  if (!raw) return null;
  if (raw instanceof Date) return raw;
  if (typeof raw === "number") return new Date((raw - 25569) * 86400 * 1000);
  const s = String(raw);
  const parts = s.split(/[\/\-]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number);
    if (a <= 31 && b <= 12) return new Date(c, b - 1, a);
    return new Date(a, b - 1, c);
  }
  return new Date(s);
};

/* ══════════════════════════════════════════════════════════════
   PARSE & AGGREGATE
══════════════════════════════════════════════════════════════ */
function parseWorkbook(wb) {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const hdrRow = raw.findIndex(r => String(r[0]).toLowerCase().includes("sr") || String(r[2]).toLowerCase().includes("branch"));
  const rows = raw.slice(hdrRow + 1);
  const data = [];
  rows.forEach(r => {
    const sn = Number(r[0]);
    if (!sn || isNaN(sn)) return;
    const dt = parseDate(r[7]);
    data.push({
      srNo: sn, region: String(r[1] || ""), branch: cleanName(r[2]), party: cleanName(r[3]),
      invoiceNo: String(r[4] || ""), invoiceDate: dt, invoiceType: String(r[8] || ""),
      billAmt: Number(r[9]) || 0, paidAmt: Number(r[10]) || 0, outstanding: Number(r[11]) || 0,
      reason: String(r[12] || ""), fy: getFY(dt),
    });
  });
  return data;
}

function aggregate(data) {
  const byBranch = {}, byParty = {}, byFY = {}, byType = {}, byMonth = {};
  data.forEach(r => {
    if (!byBranch[r.branch]) byBranch[r.branch] = { o: 0, bill: 0, n: 0 };
    byBranch[r.branch].o += r.outstanding; byBranch[r.branch].bill += r.billAmt; byBranch[r.branch].n++;
    if (!byParty[r.party]) byParty[r.party] = { o: 0, n: 0, byFY: {} };
    byParty[r.party].o += r.outstanding; byParty[r.party].n++;
    byParty[r.party].byFY[r.fy] = (byParty[r.party].byFY[r.fy] || 0) + r.outstanding;
    if (!byFY[r.fy]) byFY[r.fy] = { o: 0, bill: 0, n: 0 };
    byFY[r.fy].o += r.outstanding; byFY[r.fy].bill += r.billAmt; byFY[r.fy].n++;
    if (!byType[r.invoiceType]) byType[r.invoiceType] = 0;
    byType[r.invoiceType] += r.outstanding;
    if (r.invoiceDate) {
      const key = r.invoiceDate.toISOString().slice(0, 7);
      if (!byMonth[key]) byMonth[key] = 0;
      byMonth[key] += r.outstanding;
    }
  });
  const branches = Object.entries(byBranch).map(([b, v]) => ({ b, ...v })).sort((a, b) => b.o - a.o);
  const parties  = Object.entries(byParty).map(([p, v]) => ({ p, ...v })).sort((a, b) => b.o - a.o);
  const fys      = Object.entries(byFY).map(([fy, v]) => ({ fy, ...v })).sort((a, b) => a.fy.localeCompare(b.fy));
  const types    = Object.entries(byType).map(([t, o]) => ({ t, o })).sort((a, b) => b.o - a.o);
  const monthly  = Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({
    m: new Date(k + "-01").toLocaleString("en-IN", { month: "short", year: "2-digit" }), v
  }));
  const total = data.reduce((s, r) => s + r.outstanding, 0);
  const top7p = parties.slice(0, 7);
  const othersP = parties.slice(7).reduce((s, r) => s + r.o, 0);
  const partyPie = [...top7p.map((r, i) => ({ name: r.p.length > 22 ? r.p.slice(0, 22) + "…" : r.p, value: r.o, color: PAL[i] })), { name: "Others", value: othersP, color: "#4a4a5e" }];
  const top7b = branches.slice(0, 7);
  const othersB = branches.slice(7).reduce((s, r) => s + r.o, 0);
  const branchPie = [...top7b.map((r, i) => ({ name: r.b.replace("CW ", "").replace("CWC ", ""), value: r.o, color: PAL[i] })), { name: "Others", value: othersB, color: "#4a4a5e" }];
  return { branches, parties, fys, types, monthly, total, partyPie, branchPie };
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */
const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.iron, border: `1px solid ${C.rust}`, borderRadius: 4, padding: "10px 14px", fontSize: 11 }}>
      <div style={{ color: C.amber, marginBottom: 4, fontWeight: 700, fontFamily: "'Oswald', sans-serif", textTransform: "uppercase", fontSize: 10 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: C.chrome, display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 1, background: p.color || C.rust, display: "inline-block" }} />
          <span style={{ color: C.zincL }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: C.white }}>{fs(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const Card = ({ children, style = {}, accent = C.rust }) => (
  <div style={{
    background: C.iron,
    border: `1px solid rgba(192,57,43,0.25)`,
    borderTop: `3px solid ${accent}`,
    borderRadius: 4,
    padding: 18,
    position: "relative",
    ...style
  }}>{children}</div>
);

const SectionTitle = ({ children, color = C.rust }) => (
  <div style={{
    fontFamily: "'Oswald', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    color: C.dimText,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }}>
    <span style={{ display: "inline-block", width: 14, height: 3, background: color }} />
    <span>{children}</span>
  </div>
);

const KPICard = ({ val, lbl, sub, color = C.rust, icon }) => (
  <div style={{
    background: C.iron,
    border: `1px solid rgba(192,57,43,0.2)`,
    borderBottom: `3px solid ${color}`,
    borderRadius: 4,
    padding: "18px 20px",
    flex: 1,
    minWidth: 160,
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", right: 12, top: 10, fontSize: 28, opacity: 0.08 }}>{icon}</div>
    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 700, color, lineHeight: 1.1, marginBottom: 4 }}>{val}</div>
    <div style={{ fontSize: 10, fontWeight: 700, color: C.dimText, textTransform: "uppercase", letterSpacing: "0.09em" }}>{lbl}</div>
    {sub && <div style={{ fontSize: 9, color: C.zinc, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
  </div>
);

const InlineBar = ({ val, max, color = C.rust }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 1 }}>
      <div style={{ width: `${Math.min(100, (val / max * 100)).toFixed(1)}%`, height: "100%", background: color }} />
    </div>
    <span style={{ fontSize: 9, color: C.zinc, minWidth: 34, textAlign: "right" }}>{(val / max * 100).toFixed(1)}%</span>
  </div>
);

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const R = Math.PI / 180, r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * R), y = cy + r * Math.sin(-midAngle * R);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700}>{`${(percent * 100).toFixed(0)}%`}</text>;
};

const thStyle = {
  background: C.steelM,
  color: C.dimText,
  padding: "8px 12px",
  textAlign: "right",
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  position: "sticky",
  top: 0,
  whiteSpace: "nowrap",
  borderBottom: `2px solid ${C.rust}`,
  fontFamily: "'Oswald', sans-serif",
  zIndex: 2,
};
const tdStyle = { padding: "7px 12px", textAlign: "right", fontSize: 10, color: C.chrome, fontVariantNumeric: "tabular-nums" };

/* ══════════════════════════════════════════════════════════════
   PAGES
══════════════════════════════════════════════════════════════ */
function OverviewPage({ data, agg }) {
  const { branches, parties, fys, types, total, partyPie, branchPie } = agg;
  const topBranch = branches[0], topParty = parties[0];
  const fy2526 = fys.find(f => f.fy.includes("2025-26"))?.o || 0;
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <KPICard val={fs(total)} lbl="Total Outstanding" sub={`${data.length} invoices across all branches`} color={C.rust} icon="⚙" />
        <KPICard val={fs(fy2526)} lbl="FY 2025-26" sub="Current financial year" color={C.amber} icon="📅" />
        <KPICard val={fs(topBranch?.o || 0)} lbl="Top Branch" sub={topBranch?.b} color={C.teal} icon="🏗" />
        <KPICard val={fs(topParty?.o || 0)} lbl="Top Party" sub={`${topParty?.p?.slice(0, 28)} · ${topParty?.n} inv`} color={C.lime} icon="🤝" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle>Branch-wise Outstanding</SectionTitle>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={branches.slice(0, 12)} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.zinc, fontSize: 9, fontFamily: "monospace" }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="b" tick={{ fill: C.chromD, fontSize: 8 }} width={140} axisLine={false} tickLine={false} tickFormatter={v => v.replace("CW ", "").replace("CWC ", "").slice(0, 18)} />
              <Tooltip content={<TT />} />
              <Bar dataKey="o" name="Outstanding" radius={[0, 2, 2, 0]}>
                {branches.slice(0, 12).map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.amber}>
          <SectionTitle color={C.amber}>Party Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie data={partyPie} cx="45%" cy="48%" innerRadius={55} outerRadius={100} dataKey="value" labelLine={false} label={renderLabel}>
                {partyPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: C.chromD, fontSize: 9, fontFamily: "'Oswald', sans-serif" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card accent={C.teal}>
          <SectionTitle color={C.teal}>Financial Year Comparison</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fys} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="fy" tick={{ fill: C.zinc, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={7} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
              <Bar dataKey="o" name="Outstanding" fill={C.rust} radius={[3, 3, 0, 0]} />
              <Bar dataKey="bill" name="Billed" fill="rgba(26,188,156,0.3)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.gold}>
          <SectionTitle color={C.gold}>Invoice Type Split</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={types.map((t, i) => ({ name: t.t, value: t.o, color: PAL[i] }))} cx="45%" cy="48%" outerRadius={78} dataKey="value" labelLine={false} label={renderLabel}>
                {types.map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={7} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function BranchPage({ agg }) {
  const { branches, branchPie } = agg;
  const max = branches[0]?.o || 1;
  const total = branches.reduce((s, r) => s + r.o, 0);
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <SectionTitle>Outstanding by Branch</SectionTitle>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={branches} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="b" tick={{ fill: C.chromD, fontSize: 8 }} width={150} axisLine={false} tickLine={false} tickFormatter={v => v.replace("CW ", "").replace("CWC ", "").slice(0, 20)} />
              <Tooltip content={<TT />} />
              <Bar dataKey="o" name="Outstanding" radius={[0, 2, 2, 0]}>
                {branches.map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.amber}>
          <SectionTitle color={C.amber}>Branch Share</SectionTitle>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie data={branchPie} cx="45%" cy="45%" innerRadius={60} outerRadius={110} dataKey="value" labelLine={false} label={renderLabel}>
                {branchPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle>Branch-wise Outstanding Table</SectionTitle>
        <div style={{ overflowX: "auto", maxHeight: 380, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>{["#","Branch","Billed","Paid","Outstanding","Invoices","Collection %","Share"].map((h, i) => (
                <th key={i} style={{ ...thStyle, textAlign: i < 2 ? "left" : "right" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {branches.map((r, i) => {
                const paid = r.bill - r.o;
                const coll = r.bill > 0 ? (paid / r.bill * 100).toFixed(1) : "—";
                const cc = parseFloat(coll) > 80 ? C.lime : parseFloat(coll) > 50 ? C.amber : C.rust;
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ ...tdStyle, textAlign: "left", color: C.zinc }}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: "left", color: C.white }}>{r.b}</td>
                    <td style={tdStyle}>{fi(r.bill)}</td>
                    <td style={{ ...tdStyle, color: C.lime }}>{fi(paid)}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: C.rust }}>{fi(r.o)}</td>
                    <td style={tdStyle}>{r.n}</td>
                    <td style={{ ...tdStyle, color: cc, fontWeight: 700 }}>{coll}%</td>
                    <td style={{ ...tdStyle, minWidth: 110 }}><InlineBar val={r.o} max={max} color={PAL[i % PAL.length]} /></td>
                  </tr>
                );
              })}
              <tr style={{ background: "rgba(192,57,43,0.08)", fontWeight: 700, borderTop: `2px solid ${C.rust}` }}>
                <td colSpan={2} style={{ ...tdStyle, textAlign: "left", color: C.amber, fontFamily: "'Oswald', sans-serif", letterSpacing: "0.07em" }}>TOTAL</td>
                <td style={{ ...tdStyle, color: C.chrome }}>{fi(branches.reduce((s, r) => s + r.bill, 0))}</td>
                <td style={{ ...tdStyle, color: C.lime }}>{fi(branches.reduce((s, r) => s + r.bill - r.o, 0))}</td>
                <td style={{ ...tdStyle, color: C.rust, fontWeight: 700 }}>{fi(total)}</td>
                <td style={{ ...tdStyle, color: C.chrome }}>{branches.reduce((s, r) => s + r.n, 0)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function PartyPage({ agg }) {
  const { parties, partyPie, fys } = agg;
  const fyKeys = fys.map(f => f.fy);
  const max = parties[0]?.o || 1;
  const total = parties.reduce((s, r) => s + r.o, 0);
  const fyColors = { "FY 2022-23": "#9b59b6", "FY 2023-24": "#1abc9c", "FY 2024-25": C.amber, "FY 2025-26": C.rust };
  const top10 = parties.slice(0, 10).map(r => ({ name: r.p.length > 22 ? r.p.slice(0, 22) + "…" : r.p, ...Object.fromEntries(fyKeys.map(k => [k, r.byFY[k] || 0])) }));
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card><SectionTitle>Top Parties — All Years</SectionTitle>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie data={partyPie} cx="45%" cy="48%" innerRadius={55} outerRadius={100} dataKey="value" labelLine={false} label={renderLabel}>
                {partyPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.teal}><SectionTitle color={C.teal}>Top 10 — FY Stacked</SectionTitle>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={top10} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: C.zinc, fontSize: 7 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={7} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
              {fyKeys.map(fy => <Bar key={fy} dataKey={fy} stackId="s" fill={fyColors[fy] || C.rust} radius={fy === fyKeys[fyKeys.length - 1] ? [2, 2, 0, 0] : [0, 0, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <SectionTitle>Party-wise Table with FY Breakup</SectionTitle>
        <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead><tr>
              <th style={{ ...thStyle, textAlign: "left" }}>#</th>
              <th style={{ ...thStyle, textAlign: "left" }}>Party</th>
              {fyKeys.map(k => <th key={k} style={thStyle}>{k.replace("FY ", "")}</th>)}
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Inv</th>
              <th style={thStyle}>Share</th>
            </tr></thead>
            <tbody>
              {parties.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc }}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.white, maxWidth: 200, whiteSpace: "normal" }}>{r.p}</td>
                  {fyKeys.map(k => <td key={k} style={tdStyle}>{r.byFY[k] > 0 ? fi(r.byFY[k]) : <span style={{ color: C.iron }}>—</span>}</td>)}
                  <td style={{ ...tdStyle, fontWeight: 700, color: C.rust }}>{fi(r.o)}</td>
                  <td style={tdStyle}>{r.n}</td>
                  <td style={{ ...tdStyle, minWidth: 100 }}><InlineBar val={r.o} max={max} color={PAL[i % PAL.length]} /></td>
                </tr>
              ))}
              <tr style={{ background: "rgba(192,57,43,0.08)", fontWeight: 700, borderTop: `2px solid ${C.rust}` }}>
                <td colSpan={2} style={{ ...tdStyle, textAlign: "left", color: C.amber, fontFamily: "'Oswald', sans-serif" }}>GRAND TOTAL</td>
                {fyKeys.map(k => <td key={k} style={{ ...tdStyle, color: C.chrome }}>{fi(agg.fys.find(f => f.fy === k)?.o || 0)}</td>)}
                <td style={{ ...tdStyle, color: C.rust, fontWeight: 700 }}>{fi(total)}</td>
                <td style={{ ...tdStyle, color: C.chrome }}>{parties.reduce((s, r) => s + r.n, 0)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function FYPage({ agg }) {
  const { fys, parties } = agg;
  const total = fys.reduce((s, r) => s + r.o, 0);
  const fyColors = ["#9b59b6", "#1abc9c", C.amber, C.rust];
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card><SectionTitle>Outstanding vs Billed by FY</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={fys} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="fy" tick={{ fill: C.zinc, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={7} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
              <Bar dataKey="o" name="Outstanding" fill={C.rust} radius={[3, 3, 0, 0]} />
              <Bar dataKey="bill" name="Billed" fill="rgba(26,188,156,0.25)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.teal}><SectionTitle color={C.teal}>FY Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={fys.map((f, i) => ({ name: f.fy, value: f.o }))} cx="45%" cy="48%" innerRadius={55} outerRadius={95} dataKey="value" labelLine={false} label={renderLabel}>
                {fys.map((_, i) => <Cell key={i} fill={fyColors[i]} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>FY-wise Summary</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr>{["Financial Year","Billed","Outstanding","Invoices","Collection %","Share"].map((h, i) => <th key={i} style={{ ...thStyle, textAlign: i === 0 ? "left" : "right" }}>{h}</th>)}</tr></thead>
          <tbody>
            {fys.map((r, i) => {
              const coll = r.bill > 0 ? ((r.bill - r.o) / r.bill * 100).toFixed(1) : "—";
              const cc = parseFloat(coll) > 85 ? C.lime : parseFloat(coll) > 50 ? C.amber : C.rust;
              return <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ ...tdStyle, textAlign: "left", color: C.white, fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>{r.fy}</td>
                <td style={tdStyle}>{fi(r.bill)}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: C.rust }}>{fi(r.o)}</td>
                <td style={tdStyle}>{r.n}</td>
                <td style={{ ...tdStyle, color: cc, fontWeight: 700 }}>{coll}%</td>
                <td style={{ ...tdStyle, minWidth: 110 }}><InlineBar val={r.o} max={total} color={fyColors[i]} /></td>
              </tr>;
            })}
            <tr style={{ background: "rgba(192,57,43,0.08)", borderTop: `2px solid ${C.rust}` }}>
              <td style={{ ...tdStyle, textAlign: "left", color: C.amber, fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>TOTAL</td>
              <td style={{ ...tdStyle, color: C.chrome }}>{fi(fys.reduce((s, r) => s + r.bill, 0))}</td>
              <td style={{ ...tdStyle, color: C.rust, fontWeight: 700 }}>{fi(total)}</td>
              <td style={{ ...tdStyle, color: C.chrome }}>{fys.reduce((s, r) => s + r.n, 0)}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </Card>
      {fys.slice().reverse().map((f, fi_) => {
        const fyParties = parties.filter(p => (p.byFY[f.fy] || 0) > 0).map(p => ({ ...p, fyO: p.byFY[f.fy] || 0 })).sort((a, b) => b.fyO - a.fyO);
        if (!fyParties.length) return null;
        const maxFy = fyParties[0].fyO;
        const colIdx = fys.indexOf(f);
        return (
          <Card key={f.fy} accent={fyColors[colIdx]} style={{ marginBottom: 14 }}>
            <SectionTitle color={fyColors[colIdx]}>{f.fy} — Party Breakdown · {fs(f.o)} total</SectionTitle>
            <div style={{ overflowX: "auto", maxHeight: 260, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead><tr>{["#","Party Name","Outstanding","Invoices","Share of FY"].map((h, i) => <th key={i} style={{ ...thStyle, textAlign: i <= 1 ? "left" : "right" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {fyParties.map((r, i) => <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ ...tdStyle, textAlign: "left", color: C.zinc }}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: "left", color: C.white, maxWidth: 200, whiteSpace: "normal" }}>{r.p}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: C.rust }}>{fi(r.fyO)}</td>
                    <td style={tdStyle}>{r.n}</td>
                    <td style={{ ...tdStyle, minWidth: 120 }}><InlineBar val={r.fyO} max={maxFy} color={fyColors[colIdx]} /></td>
                  </tr>)}
                  <tr style={{ background: "rgba(192,57,43,0.08)", borderTop: `2px solid ${C.rust}` }}>
                    <td colSpan={2} style={{ ...tdStyle, textAlign: "left", color: C.amber, fontFamily: "'Oswald', sans-serif" }}>TOTAL</td>
                    <td style={{ ...tdStyle, color: C.rust, fontWeight: 700 }}>{fi(f.o)}</td>
                    <td style={{ ...tdStyle, color: C.chrome }}>{fyParties.reduce((s, r) => s + r.n, 0)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function TrendPage({ agg }) {
  const { monthly, types } = agg;
  return (
    <div style={{ padding: "24px 28px" }}>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle>Monthly Outstanding Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthly} margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="m" tick={{ fill: C.zinc, fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
            <Tooltip content={<TT />} />
            <Line type="monotone" dataKey="v" name="Outstanding" stroke={C.rust} strokeWidth={2} dot={{ r: 3, fill: C.rust, stroke: C.iron, strokeWidth: 2 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card accent={C.teal}><SectionTitle color={C.teal}>Invoice Type — Donut</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={types.map((t, i) => ({ name: t.t, value: t.o }))} cx="45%" cy="48%" innerRadius={55} outerRadius={100} dataKey="value" labelLine={false} label={renderLabel}>
                {types.map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
              </Pie>
              <Tooltip content={<TT />} />
              <Legend iconType="square" iconSize={8} formatter={v => <span style={{ color: C.chromD, fontSize: 9 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card accent={C.amber}><SectionTitle color={C.amber}>Invoice Type — Bar</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={types} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: C.zinc, fontSize: 9 }} tickFormatter={fs} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="t" tick={{ fill: C.chromD, fontSize: 9 }} width={130} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Bar dataKey="o" name="Outstanding" radius={[0, 2, 2, 0]}>
                {types.map((_, i) => <Cell key={i} fill={PAL[i % PAL.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function ListPage({ data }) {
  const [search, setSearch] = useState("");
  const [branchF, setBranchF] = useState("All");
  const [fyF, setFyF] = useState("All");
  const [typeF, setTypeF] = useState("All");
  const [sort, setSort] = useState({ key: "outstanding", dir: -1 });
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;
  const branches = useMemo(() => ["All", ...Array.from(new Set(data.map(r => r.branch))).sort()], [data]);
  const fys = useMemo(() => ["All", ...Array.from(new Set(data.map(r => r.fy))).sort()], [data]);
  const types = useMemo(() => ["All", ...Array.from(new Set(data.map(r => r.invoiceType))).sort()], [data]);
  const filtered = useMemo(() => {
    let d = data;
    if (branchF !== "All") d = d.filter(r => r.branch === branchF);
    if (fyF !== "All") d = d.filter(r => r.fy === fyF);
    if (typeF !== "All") d = d.filter(r => r.invoiceType === typeF);
    if (search) { const s = search.toLowerCase(); d = d.filter(r => r.party.toLowerCase().includes(s) || r.invoiceNo.toLowerCase().includes(s) || r.branch.toLowerCase().includes(s)); }
    return [...d].sort((a, b) => { const av = a[sort.key], bv = b[sort.key]; if (typeof av === "number") return (av - bv) * sort.dir; return String(av).localeCompare(String(bv)) * sort.dir; });
  }, [data, search, branchF, fyF, typeF, sort]);
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totOut = filtered.reduce((s, r) => s + r.outstanding, 0);
  const sortBy = k => setSort(s => ({ key: k, dir: s.key === k ? -s.dir : -1 }));
  const SortIcon = ({ k }) => sort.key === k ? (sort.dir === -1 ? " ↓" : " ↑") : "";
  const inpStyle = { background: C.steelM, border: `1px solid rgba(192,57,43,0.3)`, color: C.chrome, padding: "7px 12px", borderRadius: 3, fontSize: 11, outline: "none", fontFamily: "'DM Mono', monospace" };
  return (
    <div style={{ padding: "24px 28px" }}>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input style={{ ...inpStyle, flex: 1, minWidth: 180 }} placeholder="Search party, invoice, branch…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {[{ val: branchF, set: setBranchF, opts: branches }, { val: fyF, set: setFyF, opts: fys }, { val: typeF, set: setTypeF, opts: types }].map((sel, i) => (
            <select key={i} style={inpStyle} value={sel.val} onChange={e => { sel.set(e.target.value); setPage(1); }}>
              {sel.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <div style={{ marginLeft: "auto", fontFamily: "'Oswald', sans-serif", fontSize: 12, color: C.dimText }}>
            <span style={{ color: C.chrome, fontWeight: 700 }}>{filtered.length}</span> records &nbsp;·&nbsp;
            <span style={{ color: C.rust, fontWeight: 700 }}>{fs(totOut)}</span> outstanding
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ overflowX: "auto", maxHeight: 500, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead><tr>
              {[["#",null],["Branch","branch"],["Party","party"],["Invoice","invoiceNo"],["Date","invoiceDate"],["FY","fy"],["Type","invoiceType"],["Billed","billAmt"],["Paid","paidAmt"],["Outstanding","outstanding"],["Reason",null]].map(([h, k], i) => (
                <th key={i} onClick={k ? () => sortBy(k) : undefined} style={{ ...thStyle, textAlign: i >= 7 ? "right" : "left", cursor: k ? "pointer" : "default" }}>
                  {h}{k && <SortIcon k={k} />}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)" }}>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc }}>{(page-1)*PER_PAGE+i+1}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.chrome, maxWidth: 120, whiteSpace: "normal" }}>{r.branch}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.white, maxWidth: 160, whiteSpace: "normal" }}>{r.party}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc, fontFamily: "'DM Mono', monospace" }}>{r.invoiceNo}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc }}>{r.invoiceDate ? r.invoiceDate.toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "left" }}><span style={{ background: "rgba(192,57,43,0.15)", color: C.rustL, padding: "2px 6px", borderRadius: 2, fontSize: 9, fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>{r.fy}</span></td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc, fontSize: 9, maxWidth: 100, whiteSpace: "normal" }}>{r.invoiceType}</td>
                  <td style={tdStyle}>{fi(r.billAmt)}</td>
                  <td style={{ ...tdStyle, color: C.lime }}>{fi(r.paidAmt)}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: r.outstanding > 0 ? C.rust : C.lime }}>{fi(r.outstanding)}</td>
                  <td style={{ ...tdStyle, textAlign: "left", color: C.zinc, fontSize: 9, maxWidth: 180, whiteSpace: "normal" }}>{r.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{ padding: "5px 12px", background: C.ironL, border: `1px solid rgba(192,57,43,0.3)`, borderRadius: 3, color: C.chromD, fontSize: 10, cursor: "pointer" }}>‹ Prev</button>
            {Array.from({ length: Math.min(pages, 9) }, (_, i) => {
              const p = pages <= 9 ? i+1 : page <= 5 ? i+1 : page >= pages-4 ? pages-8+i : page-4+i;
              return <button key={p} onClick={() => setPage(p)} style={{ padding: "5px 10px", background: p===page ? C.rust : C.ironL, border: `1px solid ${p===page ? C.rust : "rgba(192,57,43,0.3)"}`, borderRadius: 3, color: p===page ? "#fff" : C.chromD, fontSize: 10, cursor: "pointer" }}>{p}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} style={{ padding: "5px 12px", background: C.ironL, border: `1px solid rgba(192,57,43,0.3)`, borderRadius: 3, color: C.chromD, fontSize: 10, cursor: "pointer" }}>Next ›</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   UPLOAD SCREEN
══════════════════════════════════════════════════════════════ */
function UploadScreen({ onData }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef();
  const handle = file => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(ext)) { setError("Please upload an Excel file (.xlsx or .xls)"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const rows = parseWorkbook(wb);
        if (!rows.length) { setError("No invoice data found. Check the file format."); return; }
        onData(rows, file.name);
      } catch (err) { setError("Parse failed: " + err.message); }
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div style={{ minHeight: "100vh", background: C.steel, fontFamily: "'Oswald', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav style={{ borderBottom: `3px solid ${C.rust}`, background: C.steelM, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, background: C.rust, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900 }}>⚙</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.white, letterSpacing: "0.06em" }}>METALTRACK</div>
            <div style={{ fontSize: 9, color: C.zinc, letterSpacing: "0.14em", marginTop: -2 }}>SCRAP MANAGEMENT SYSTEM</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 12, color: C.chromD, letterSpacing: "0.1em" }}>
          {["HOME","BRANCHES","REPORTS","PARTIES","SETTINGS"].map(l => (
            <span key={l} style={{ cursor: "pointer", borderBottom: l === "REPORTS" ? `2px solid ${C.rust}` : "2px solid transparent", paddingBottom: 4, color: l === "REPORTS" ? C.white : C.chromD }}>{l}</span>
          ))}
        </div>
      </nav>
      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden", padding: "80px 60px 70px", background: `linear-gradient(135deg, ${C.steelM} 0%, ${C.steel} 60%, #1a0a0a 100%)` }}>
        {/* Decorative hex grid */}
        <svg style={{ position: "absolute", right: 0, top: 0, opacity: 0.04 }} width="600" height="400" viewBox="0 0 600 400">
          {Array.from({ length: 8 }, (_, row) => Array.from({ length: 10 }, (_, col) => {
            const x = col * 62 + (row % 2 ? 31 : 0), y = row * 54;
            return <polygon key={`${row}-${col}`} points={`${x},${y+15} ${x+26},${y} ${x+52},${y+15} ${x+52},${y+41} ${x+26},${y+56} ${x},${y+41}`} fill="none" stroke={C.rust} strokeWidth="1.5" />;
          }))}
        </svg>
        <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", opacity: 0.06, fontSize: 240, lineHeight: 1 }}>⚙</div>
        <div style={{ maxWidth: 700, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(192,57,43,0.15)", border: `1px solid rgba(192,57,43,0.4)`, borderRadius: 2, padding: "4px 12px", marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, background: C.rust, borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 10, color: C.rustL, letterSpacing: "0.14em", fontWeight: 600 }}>OUTSTANDING INVOICE INTELLIGENCE</span>
          </div>
          <h1 style={{ fontSize: 54, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 18, letterSpacing: "0.02em" }}>
            TRACK. ANALYZE.<br /><span style={{ color: C.rust }}>RECOVER.</span>
          </h1>
          <p style={{ fontSize: 14, color: C.chromD, maxWidth: 520, lineHeight: 1.8, marginBottom: 36, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            Comprehensive outstanding invoice analytics for scrap dealers. Branch-wise breakdowns, party ledgers, and financial year comparisons — all from your Excel export.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Branch-wise Analysis","Party Ledger","FY Comparison","Trend Reports"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "6px 14px", fontSize: 11, color: C.chromD, letterSpacing: "0.06em" }}>
                <span style={{ color: C.rust }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* STATS STRIP */}
      <div style={{ background: C.rust, padding: "0 60px", display: "flex", gap: 0 }}>
        {[["MULTI-BRANCH","All locations in one view"],["FY TRACKING","Year-on-year comparison"],["REAL-TIME FILTER","Search & filter instantly"],["EXCEL NATIVE","Direct .xlsx import"]].map(([h, s], i) => (
          <div key={i} style={{ flex: 1, padding: "14px 20px", borderRight: i < 3 ? "1px solid rgba(0,0,0,0.2)" : "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 18 }}>{["🏗","📅","🔍","📊"][i]}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: "0.08em" }}>{h}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>{s}</div>
            </div>
          </div>
        ))}
      </div>
      {/* UPLOAD SECTION */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: C.steelM }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: "0.05em", marginBottom: 8 }}>UPLOAD YOUR REPORT</h2>
            <p style={{ fontSize: 12, color: C.zinc, fontFamily: "'DM Sans', sans-serif" }}>Drop your Outstanding Invoice Excel file to generate the full analytics dashboard</p>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
            onClick={() => ref.current.click()}
            style={{
              border: `2px dashed ${dragging ? C.rust : "rgba(192,57,43,0.4)"}`,
              borderRadius: 4,
              padding: "48px 32px",
              cursor: "pointer",
              background: dragging ? "rgba(192,57,43,0.06)" : C.iron,
              transition: "all .2s",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>📁</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 8, letterSpacing: "0.04em" }}>DRAG & DROP EXCEL FILE</div>
            <div style={{ fontSize: 12, color: C.zinc, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>or click to browse your files</div>
            <div style={{ display: "inline-block", padding: "12px 32px", background: C.rust, borderRadius: 3, fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.1em", cursor: "pointer" }}>
              SELECT FILE
            </div>
            <div style={{ marginTop: 16, fontSize: 10, color: C.zinc, letterSpacing: "0.06em" }}>SUPPORTS .XLSX · .XLS — OUTSTANDING INVOICE REPORT FORMAT</div>
          </div>
          <input ref={ref} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => handle(e.target.files[0])} />
          {error && <div style={{ color: C.rustL, fontSize: 12, marginTop: 12, background: "rgba(192,57,43,0.1)", border: `1px solid ${C.rust}`, borderRadius: 3, padding: "10px 14px", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
        </div>
      </div>
      {/* FOOTER */}
      <div style={{ background: "#0a0d18", borderTop: `1px solid rgba(255,255,255,0.06)`, padding: "18px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: C.zinc, letterSpacing: "0.08em" }}>METALTRACK · SCRAP MANAGEMENT SYSTEM</span>
        <span style={{ fontSize: 10, color: C.zinc }}>Outstanding Invoice Analytics Platform</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════════════════ */
const MENU = [
  { id: "overview", icon: "⚡", label: "Overview" },
  { id: "branch",   icon: "🏗", label: "Branches" },
  { id: "party",    icon: "🤝", label: "Parties" },
  { id: "fy",       icon: "📅", label: "Fin. Year" },
  { id: "trend",    icon: "📈", label: "Trends" },
  { id: "list",     icon: "📋", label: "Invoice List" },
];

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [rawData, setRawData]     = useState(null);
  const [fileName, setFileName]   = useState("");
  const [activePage, setActivePage] = useState("overview");
  const agg = useMemo(() => rawData ? aggregate(rawData) : null, [rawData]);
  const handleData = (rows, name) => { setRawData(rows); setFileName(name); setActivePage("overview"); };
  if (!rawData) return <UploadScreen onData={handleData} />;

  const pages = {
    overview: <OverviewPage data={rawData} agg={agg} />,
    branch:   <BranchPage agg={agg} />,
    party:    <PartyPage agg={agg} />,
    fy:       <FYPage agg={agg} />,
    trend:    <TrendPage agg={agg} />,
    list:     <ListPage data={rawData} />,
  };
  const pgTitle = { overview: "Overview", branch: "Branch Analysis", party: "Party Ledger", fy: "Financial Year", trend: "Trends & Type", list: "Invoice List" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.steel, fontFamily: "'DM Sans', sans-serif", color: C.chrome }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #c0392b; border-radius: 1px; }
        select option { background: #16213e; }
        @keyframes slidein { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .page-in { animation: slidein 0.2s ease; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 220, minHeight: "100vh", background: C.steelM, borderRight: `1px solid rgba(192,57,43,0.2)`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ borderBottom: `3px solid ${C.rust}`, padding: "16px 18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: C.rust, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚙</div>
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: "0.05em" }}>METALTRACK</div>
              <div style={{ fontSize: 8, color: C.zinc, letterSpacing: "0.12em" }}>OUTSTANDING ANALYTICS</div>
            </div>
          </div>
        </div>
        {/* File badge */}
        <div style={{ margin: "12px 12px 0", padding: "8px 12px", background: "rgba(192,57,43,0.08)", border: `1px solid rgba(192,57,43,0.2)`, borderRadius: 3 }}>
          <div style={{ fontSize: 8, color: C.zinc, letterSpacing: "0.1em", marginBottom: 3 }}>ACTIVE FILE</div>
          <div style={{ fontSize: 9, color: C.chromD, wordBreak: "break-all", lineHeight: 1.4 }}>{fileName}</div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          <div style={{ fontSize: 8, color: C.zinc, letterSpacing: "0.14em", padding: "0 10px 8px", fontFamily: "'Oswald', sans-serif" }}>NAVIGATION</div>
          {MENU.map(m => (
            <button key={m.id} onClick={() => setActivePage(m.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 3, marginBottom: 1, border: "none", cursor: "pointer",
              background: activePage === m.id ? "rgba(192,57,43,0.15)" : "transparent",
              color: activePage === m.id ? C.white : C.dimText,
              fontFamily: "'Oswald', sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em",
              borderLeft: activePage === m.id ? `3px solid ${C.rust}` : "3px solid transparent",
              transition: "all .15s", textAlign: "left",
            }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
        {/* Stats */}
        <div style={{ margin: "0 12px 12px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: 3 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 8, color: C.zinc, letterSpacing: "0.12em", marginBottom: 8 }}>QUICK STATS</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.rust, fontFamily: "'Oswald', sans-serif" }}>{fs(agg.total)}</div>
          <div style={{ fontSize: 9, color: C.zinc, marginBottom: 8 }}>Total Outstanding</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.chrome, fontFamily: "'Oswald', sans-serif" }}>{rawData.length}</div>
          <div style={{ fontSize: 9, color: C.zinc }}>Total Invoices</div>
        </div>
        {/* Reset */}
        <div style={{ padding: "12px 12px 16px", borderTop: `1px solid rgba(255,255,255,0.05)` }}>
          <button onClick={() => { setRawData(null); setFileName(""); }} style={{
            width: "100%", padding: "9px", borderRadius: 3, border: `1px solid rgba(192,57,43,0.3)`,
            background: "transparent", color: C.zinc, fontFamily: "'Oswald', sans-serif", fontSize: 11,
            cursor: "pointer", letterSpacing: "0.08em", transition: "all .15s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(192,57,43,0.1)"; e.target.style.color = C.rustL; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = C.zinc; }}>
            ↑ UPLOAD NEW FILE
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
          borderLeft: `4px solid ${C.rust}`,
          background: "rgba(22,33,62,0.9)",
          backdropFilter: "blur(8px)",
          padding: "0 28px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>{pgTitle[activePage].toUpperCase()}</span>
            <span style={{ fontSize: 10, color: C.zinc, marginLeft: 14, letterSpacing: "0.06em" }}>RO KOCHI · OUTSTANDING INVOICE REPORT</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontFamily: "'Oswald', sans-serif", fontSize: 12 }}>
            <span style={{ color: C.zinc }}><span style={{ color: C.chrome, fontWeight: 700 }}>{rawData.length}</span> RECORDS</span>
            <span style={{ color: C.zinc }}><span style={{ color: C.rust, fontWeight: 700 }}>{fs(agg.total)}</span> OUTSTANDING</span>
            <span style={{ background: C.rust, padding: "2px 10px", borderRadius: 2, color: C.white, fontSize: 10 }}>LIVE</span>
          </div>
        </div>
        {/* Page content */}
        <div className="page-in" key={activePage} style={{ flex: 1, overflowY: "auto" }}>
          {pages[activePage]}
        </div>
      </div>
    </div>
  );
}