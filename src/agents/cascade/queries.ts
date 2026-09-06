// Cascade-5 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "idle",
    progress: 21,
    metric: "Standby",
    stats: [
      { label: "Cost per drop", value: "$4.12", hint: "blended" },
      { label: "Capacity used", value: "81%", hint: "" },
      { label: "Next run", value: "02:00", hint: "" },
    ],
    log: [
      { time: "11:48", text: "Nightly cost model queued for 02:00 run." },
    ],
  };
}
