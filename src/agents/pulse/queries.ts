// Pulse-9 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "idle",
    progress: 38,
    metric: "Standby",
    stats: [
      { label: "Open flags", value: "0", hint: "" },
      { label: "Drivers monitored", value: "642", hint: "this shift" },
      { label: "Avg shift length", value: "7.4h", hint: "" },
    ],
    log: [
      { time: "12:15", text: "No fatigue flags in current shift. Standing by." },
    ],
  };
}
