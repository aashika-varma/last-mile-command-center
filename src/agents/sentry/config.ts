// Sentry-4 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "sentry",
  name: "Sentry-4",
  role: "Exception Triage",
  description: "Catches failed deliveries and routes them to recovery.",
  purpose: "Sentry-4 triages delivery exceptions — bad addresses, refusals, missed windows — and routes each to the right recovery path.",
  actions: [
    { label: "Open case queue", kind: "primary" },
    { label: "Auto-resolve rules", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/sentry/.env
  envKeys: [
    "SENTRY_CASE_DB",
    "SENTRY_ADDRESS_VALIDATOR_KEY",
    "SENTRY_ESCALATION_EMAIL",
  ],
};
