// Drift-2 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "drift",
  name: "Drift-2",
  role: "Variance Monitor",
  description: "Watches model drift and flags anomalies in real time.",
  purpose: "Drift-2 monitors every other agent's model outputs for distribution shift and raises anomalies for review.",
  actions: [
    { label: "Review anomalies", kind: "primary" },
    { label: "Snooze alerts", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/drift/.env
  envKeys: [
    "DRIFT_METRICS_STORE",
    "DRIFT_ALERT_THRESHOLD",
    "DRIFT_PAGERDUTY_KEY",
  ],
};
