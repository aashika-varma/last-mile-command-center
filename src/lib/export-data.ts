// CSV + PDF exports for the dashboard, always based on the CURRENT filters.
import type { DashboardData } from "@/agents/dashboard/select";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows: (string | number)[][]) {
  return rows.map((r) => r.map(esc).join(",")).join("\n");
}

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Metric table (respecting current filters) as CSV. */
export function exportMetricsCsv(
  data: DashboardData,
  scope: string,
  label: (id: string, name: string) => string = (_id, name) => name,
) {
  const rows: (string | number)[][] = [
    ["Scope", scope],
    ["Generated", new Date().toISOString()],
    [],
    ["Group", "Metric", "This week", "Last week", "Delta", "Delta %", "Unit"],
  ];
  for (const m of data.metrics) {
    const diff = m.current - m.previous;
    const pct = m.previous === 0 ? 0 : (diff / m.previous) * 100;
    rows.push([
      m.group,
      label(m.id, m.name),
      m.current,
      m.previous,
      diff.toFixed(2),
      `${pct.toFixed(1)}%`,
      m.unit,
    ]);
  }
  download(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }), `lmd-metrics-${slug(scope)}-${stamp()}.csv`);
}

/** Business report (KPIs + narrative sections) as CSV. */
export function exportReportCsv(data: DashboardData, scope: string) {
  const r = data.report;
  const rows: (string | number)[][] = [
    ["Report", r.headline],
    ["Period", r.period],
    ["Scope", scope],
    ["Generated", new Date().toISOString()],
    [],
    ["Summary", r.summary],
    [],
    ["KPI", "Value", "Delta", "Unit"],
    ...r.kpis.map((k) => [k.label, k.value, k.delta, k.unit]),
    [],
    ["Section", "Point"],
    ...r.sections.flatMap((s) => s.bullets.map((b) => [s.title, b])),
  ];
  download(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }), `lmd-report-${slug(scope)}-${stamp()}.csv`);
}

async function newDoc() {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ unit: "pt", format: "a4" });
}

/** Business report as a PDF. */
export async function exportReportPdf(data: DashboardData, scope: string, title: string) {
  const doc = await newDoc();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;
  const line = (text: string, size: number, style: "normal" | "bold" = "normal", gap = 6) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    for (const l of doc.splitTextToSize(text, pageW - M * 2) as string[]) {
      if (y > pageH - M) {
        doc.addPage();
        y = M;
      }
      doc.text(l, M, y);
      y += size + gap * 0.4;
    }
    y += gap;
  };

  line(title, 18, "bold", 4);
  line(`${data.report.period}  ·  ${scope}`, 9);
  line(data.report.headline, 13, "bold");
  line(data.report.summary, 10);

  line("Key metrics", 12, "bold", 4);
  for (const k of data.report.kpis) {
    line(`${k.label}: ${k.value}  (${k.delta >= 0 ? "+" : ""}${k.delta}${k.unit})`, 10, "normal", 0);
  }
  y += 8;

  for (const s of data.report.sections) {
    line(s.title, 12, "bold", 4);
    for (const b of s.bullets) line(`•  ${b}`, 10, "normal", 2);
  }

  line("Top root causes", 12, "bold", 4);
  for (const r of data.rca.slice(0, 6)) {
    line(`[${r.severity}] ${r.title} — ${r.region}`, 10, "normal", 2);
  }

  doc.save(`lmd-report-${slug(scope)}-${stamp()}.pdf`);
}

/** Metric table as a paginated PDF. */
export async function exportMetricsPdf(
  data: DashboardData,
  scope: string,
  title: string,
  label: (id: string, name: string) => string = (_id, name) => name,
) {
  const doc = await newDoc();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 40;
  const cols = [M, M + 210, M + 290, M + 370, M + 460];
  let y = M;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${scope}  ·  ${data.metrics.length} metrics  ·  generated ${new Date().toISOString().slice(0, 16)}Z`, M, y);
  y += 20;

  const header = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    ["Metric", "This week", "Last week", "Delta", "Group"].forEach((h, i) => doc.text(h, cols[i]!, y));
    y += 6;
    doc.setDrawColor(200);
    doc.line(M, y, pageW - M, y);
    y += 12;
    doc.setFont("helvetica", "normal");
  };
  header();

  for (const m of data.metrics) {
    if (y > pageH - M) {
      doc.addPage();
      y = M;
      header();
    }
    const diff = m.current - m.previous;
    const pct = m.previous === 0 ? 0 : (diff / m.previous) * 100;
    doc.setFontSize(8.5);
    doc.text(String(label(m.id, m.name)).slice(0, 44), cols[0]!, y);
    doc.text(m.current.toFixed(2), cols[1]!, y);
    doc.text(m.previous.toFixed(2), cols[2]!, y);
    doc.text(`${diff >= 0 ? "+" : ""}${diff.toFixed(2)} (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)`, cols[3]!, y);
    doc.text(String(m.group).slice(0, 24), cols[4]!, y);
    y += 14;
  }

  doc.save(`lmd-metrics-${slug(scope)}-${stamp()}.pdf`);
}
