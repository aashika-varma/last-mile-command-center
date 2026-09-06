// ---------------------------------------------------------------------------
// Dashboard-00 — turns the active filter selection into one consistent
// dataset used by EVERY tab (report, metrics, RCA, charts, fleet).
//
// Today it shapes the sample data in ../data.ts. When real queries are wired
// up, replace the body of `selectDashboardData` (or call it from your API
// layer) — the tabs don't need to change.
// ---------------------------------------------------------------------------
import {
  DAYS,
  EXCEPTION_MIX,
  FLEET,
  HEATMAP,
  HOURS,
  METRICS,
  RCA,
  REGION_BARS,
  REPORT,
  TREND,
  type FleetAgent,
  type MetricRow,
  type RcaItem,
} from "./data";

export type FilterState = {
  week: string;
  region: string;
  banner: string;
  group: string;
  severity: string;
  status: string;
};

export interface DashboardData {
  /** Human-readable summary of what the numbers are scoped to */
  scope: string;
  report: typeof REPORT;
  metrics: MetricRow[];
  rca: RcaItem[];
  charts: {
    trend: { week: string; onTime: number; cost: number; orders: number }[];
    regionBars: { region: string; onTime: number; target: number }[];
    exceptionMix: { name: string; value: number }[];
    heatmap: { day: string; hour: string; value: number }[];
    hours: string[];
    days: string[];
  };
  fleet: FleetAgent[];
}

/** Stable 0.94–1.06 multiplier derived from a string, so filters shift numbers
 *  in a repeatable way instead of randomly. */
function factor(...parts: string[]) {
  const s = parts.join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 0.94 + ((h >>> 0) % 1200) / 10000;
}

const round = (v: number, d = 2) => Number(v.toFixed(d));

export function selectDashboardData(f: FilterState): DashboardData {
  const scale = factor(f.week, f.region, f.banner);
  const allRegions = f.region.startsWith("All");

  // --- charts (week window + region/banner scaling) ------------------------
  const weekIdx = Math.max(0, TREND.findIndex((t) => f.week.startsWith(t.week)));
  const trendEnd = weekIdx >= 0 ? weekIdx + 1 : TREND.length;
  const trend = TREND.slice(0, trendEnd === 0 ? TREND.length : trendEnd).map((t) => ({
    ...t,
    onTime: round(Math.min(99.5, t.onTime * scale), 1),
    cost: round(t.cost * (2 - scale), 2),
    orders: round(t.orders * scale, 1),
  }));

  const regionBars = REGION_BARS.filter((r) => allRegions || r.region === f.region).map((r) => ({
    ...r,
    onTime: round(Math.min(99.5, r.onTime * scale), 1),
  }));

  const mix = EXCEPTION_MIX.map((e, i) => ({
    ...e,
    value: Math.max(1, Math.round(e.value * factor(f.region, f.banner, String(i)))),
  }));

  const heatmap = HEATMAP.map((c) => ({
    ...c,
    value: Math.max(1, Math.round(c.value * scale)),
  }));

  // --- metrics -------------------------------------------------------------
  const metrics = METRICS.filter((m) => f.group === "All groups" || m.group === f.group).map(
    (m) => ({
      ...m,
      current: round(m.current * scale),
      previous: round(m.previous * factor(f.week, "prev")),
    }),
  );

  // --- root cause ----------------------------------------------------------
  const rca = RCA.filter(
    (r) =>
      (f.severity.startsWith("All") || r.severity === f.severity) &&
      (allRegions || r.region === f.region || r.region === "All regions"),
  );

  // --- fleet ---------------------------------------------------------------
  const fleet = FLEET.filter(
    (a) =>
      (allRegions || a.region === f.region) &&
      (f.status.startsWith("All") || a.status === f.status),
  );

  const scope = [f.week, f.region, f.banner].join(" · ");

  return {
    scope,
    report: REPORT,
    metrics,
    rca,
    charts: { trend, regionBars, exceptionMix: mix, heatmap, hours: HOURS, days: DAYS },
    fleet,
  };
}
