// Dashboard-00 — this agent's OWN data access. No other agent imports this.
// Replace bodies with real API/DB calls when the app is wired up.
import type { AgentSnapshot } from "../types";
import { QUERY } from "./config";
import { FLEET, METRICS, RCA } from "./data";
import { selectDashboardData, type DashboardData, type FilterState } from "./select";

export function getSnapshot(): AgentSnapshot {
  const healthy = FLEET.filter((f) => f.status === "Healthy").length;
  return {
    status: "active",
    progress: Math.round((healthy / FLEET.length) * 100),
    metric: "+1.2 pts on-time",
    stats: [
      { label: "Monitored agents", value: String(FLEET.length), hint: `${healthy} healthy` },
      { label: "Tracked metrics", value: String(METRICS.length), hint: "vs last week" },
      { label: "Open root causes", value: String(RCA.length), hint: "this week" },
    ],
    log: [
      { time: "14:10", text: "Weekly business report regenerated for WK-36." },
      { time: "13:55", text: "RCA model flagged Southeast exception spike (91% confidence)." },
      { time: "13:30", text: "Metric refresh complete — 120 metrics compared to WK-35." },
    ],
  };
}

// ---------------------------------------------------------------------------
// Tab data. Today it shapes local sample data behind a simulated delay so the
// loading + error + retry states are real. Swap the body for a fetch() /
// warehouse call — the timeout and error handling stay the same.
// ---------------------------------------------------------------------------
export async function fetchDashboardData(filters: FilterState): Promise<DashboardData> {
  const work = new Promise<DashboardData>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(selectDashboardData(filters));
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    }, QUERY.simulatedLatencyMs);
  });

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(QUERY.timeoutMessage)), QUERY.timeoutMs);
  });

  return Promise.race([work, timeout]);
}
