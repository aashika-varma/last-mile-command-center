// Pulse-9 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "pulse",
  name: "Pulse-9",
  role: "Driver Fatigue",
  description: "Flags rest windows from live telemetry signals.",
  purpose: "Pulse-9 watches driver telemetry and shift history to recommend rest windows before fatigue becomes a safety risk.",
  actions: [
    { label: "Scan current shift", kind: "primary" },
    { label: "Notification settings", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/pulse/.env
  envKeys: [
    "PULSE_TELEMETRY_STREAM",
    "PULSE_ALERT_WEBHOOK",
  ],
};
