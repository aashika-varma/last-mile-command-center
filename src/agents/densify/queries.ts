// Densify-X — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 64,
    metric: "MAE 4.8 stops",
    stats: [
      { label: "MAE", value: "4.8 stops", hint: "rolling 7d" },
      { label: "Zones covered", value: "148", hint: "" },
      { label: "Horizon", value: "24h", hint: "" },
    ],
    log: [
      { time: "14:01", text: "Zone 7 reweighted after order surge (+18%)." },
      { time: "13:37", text: "Evening peak forecast locked for 12 hubs." },
    ],
  };
}
