// Router-01 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 82,
    metric: "+3.1% accuracy",
    stats: [
      { label: "Window accuracy", value: "94.2%", hint: "last 24h" },
      { label: "Stops scored", value: "312K", hint: "today" },
      { label: "Median error", value: "4.1m", hint: "" },
    ],
    log: [
      { time: "14:02", text: "Recalibrated 312 stop windows for District 4." },
      { time: "13:58", text: "Rain corridor detected — padded north routes by 6m." },
      { time: "13:41", text: "Daily model refresh complete. Drift nominal." },
    ],
  };
}
