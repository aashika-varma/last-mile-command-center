// Sentry-4 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 46,
    metric: "23 open cases",
    stats: [
      { label: "Open cases", value: "23", hint: "" },
      { label: "Auto-resolved", value: "11", hint: "today" },
      { label: "Escalations", value: "3", hint: "Hub 6" },
    ],
    log: [
      { time: "14:04", text: "Escalated 3 undeliverable stops to Hub 6 recovery." },
      { time: "13:44", text: "Auto-resolved 11 address mismatches." },
    ],
  };
}
