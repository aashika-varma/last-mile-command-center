// Dashboard-00 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "dashboard",
  name: "Dashboard-00",
  role: "Business Performance Console",
  description: "One console for ~100 monitored agents, 120+ metrics, RCA and charts.",
  purpose:
    "Dashboard-00 is the reporting surface for last-mile delivery. It rolls up every monitored agent into a weekly business report, tracks 120+ metrics week over week, explains movement through root-cause analysis, and visualises the whole picture.",
  actions: [
    { label: "Refresh data", kind: "primary" },
    { label: "Export report", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/dashboard/.env
  envKeys: [
    "DASHBOARD_WAREHOUSE_URL",
    "DASHBOARD_METRICS_API",
    "DASHBOARD_RCA_MODEL_ENDPOINT",
  ],
};

// ---------------------------------------------------------------------------
// TABS — add / rename / reorder here. `filters` lists which filter keys apply
// to that tab (universal filters are simply repeated on each tab that uses them).
// ---------------------------------------------------------------------------
export const TABS = [
  { id: "report", label: "Business Report", filters: ["week", "region", "banner"] },
  { id: "metrics", label: "Metrics (120+)", filters: ["week", "region", "banner", "group"] },
  { id: "rca", label: "Root Cause", filters: ["week", "region", "severity"] },
  { id: "charts", label: "Charts", filters: ["week", "region", "banner"] },
  { id: "agents", label: "Agent Fleet", filters: ["region", "status"] },
  { id: "notes", label: "Tab 6 (TBD)", filters: [] },
] as const;

export type TabId = (typeof TABS)[number]["id"];

// ---------------------------------------------------------------------------
// FILTER DEFINITIONS — edit labels / options freely.
// ---------------------------------------------------------------------------
export const FILTERS = {
  week: {
    label: "Week",
    options: ["WK-36 (current)", "WK-35", "WK-34", "WK-33"],
  },
  region: {
    label: "Region",
    options: ["All regions", "Northeast", "Southeast", "Midwest", "Southwest", "West"],
  },
  banner: {
    label: "Banner",
    options: ["All banners", "Supercenter", "Neighborhood Market", "Sam's Club"],
  },
  group: {
    label: "Metric group",
    options: ["All groups"], // extended at runtime with metric group names
  },
  severity: {
    label: "Severity",
    options: ["All severities", "Critical", "High", "Medium", "Low"],
  },
  status: {
    label: "Status",
    options: ["All statuses", "Healthy", "Degraded", "Offline"],
  },
} as const;

export type FilterKey = keyof typeof FILTERS;

// ---------------------------------------------------------------------------
// QUERY BEHAVIOUR — edit timings here.
// ---------------------------------------------------------------------------
export const QUERY = {
  /** Fake latency for the sample data; set to 0 once real queries are wired. */
  simulatedLatencyMs: 900,
  /** A query that takes longer than this is treated as failed. */
  timeoutMs: 12000,
  timeoutMessage: "The request took too long to respond.",
};

// ---------------------------------------------------------------------------
// MESSAGES — every word shown while loading or after a failure.
// ---------------------------------------------------------------------------
export const MESSAGES = {
  loading: "Pulling the latest numbers…",
  error: {
    title: "We couldn't load this data",
    body: "The request didn't come back in time. This is usually temporary — try again, or change the filters and retry.",
    retryLabel: "Try again",
    detailLabel: "Details",
  },
  filters: {
    label: "Filters",
    scopePrefix: "Showing",
    resetLabel: "Reset filters",
    persistNote: "Filters stay applied as you move between tabs.",
  },
  empty: "Nothing matches the current filters.",
};

/** localStorage key used to remember the filter selection between visits. */
export const FILTER_STORAGE_KEY = "lmd.dashboard.filters";

// ---------------------------------------------------------------------------
// CHART TITLES — edit here (or from the in-app content editor).
// ---------------------------------------------------------------------------
export const CHART_TITLES: Record<string, string> = {
  trend: "On-time delivery trend",
  region: "On-time by region vs target",
  mix: "Exception mix",
  cost: "Cost per drop",
  heatmap: "Delivery volume heatmap · day × hour",
};

// ---------------------------------------------------------------------------
// EXPORT BUTTONS — wording for the PDF/CSV downloads.
// ---------------------------------------------------------------------------
export const EXPORTS = {
  label: "Export",
  reportPdf: "Report PDF",
  reportCsv: "Report CSV",
  metricsPdf: "Metrics PDF",
  metricsCsv: "Metrics CSV",
  reportTitle: "LMD - Control Tower — Weekly Business Report",
  metricsTitle: "LMD - Control Tower — Metric Table",
};
