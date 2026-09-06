// Drift-2 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 73,
    metric: "2 anomalies",
    stats: [
      { label: "Open anomalies", value: "2", hint: "" },
      { label: "Models watched", value: "11", hint: "" },
      { label: "Max PSI", value: "0.18", hint: "ETA model" },
    ],
    log: [
      { time: "13:59", text: "Anomaly flagged in ETA model — under review." },
      { time: "13:20", text: "Variance within tolerance across 11 models." },
    ],
  };
}
