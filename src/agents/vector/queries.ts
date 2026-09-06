// Vector-7 — this agent's OWN data access. No other agent imports this.
// Replace the body of getSnapshot() with a real API/DB call for this agent.
import type { AgentSnapshot } from "../types";

export function getSnapshot(): AgentSnapshot {
  return {
    status: "active",
    progress: 91,
    metric: "-11.4% mileage",
    stats: [
      { label: "Mileage saved", value: "11.4%", hint: "vs baseline" },
      { label: "Stops sequenced", value: "1,204", hint: "today" },
      { label: "Vehicles", value: "18", hint: "" },
    ],
    log: [
      { time: "14:03", text: "Sequenced 1,204 stops across 18 vehicles." },
      { time: "13:52", text: "Proposed 6 reroutes — avg ETA improved 4.2m." },
    ],
  };
}
