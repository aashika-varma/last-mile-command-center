// Atlas-Prime — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 57,
    metric: "+16 vans freed",
    stats: [
      { label: "Vans freed", value: "16", hint: "today" },
      { label: "Load variance", value: "4.1%", hint: "region-wide" },
      { label: "Hubs", value: "12", hint: "" },
    ],
    log: [
      { time: "14:00", text: "Rebalanced Hub 3 and Hub 8 — 16 vans freed." },
      { time: "13:30", text: "Load variance reduced to 4.1% region-wide." },
    ],
  };
}
