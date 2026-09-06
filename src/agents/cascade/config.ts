// Cascade-5 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "cascade",
  name: "Cascade-5",
  role: "Capacity & Cost",
  description: "Models cost per drop against fleet capacity by hub.",
  purpose: "Cascade-5 models cost-per-drop against available capacity so planners can see the price of every capacity decision.",
  actions: [
    { label: "Run cost model", kind: "primary" },
    { label: "Schedule nightly", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/cascade/.env
  envKeys: [
    "CASCADE_FINANCE_DSN",
    "CASCADE_RATE_CARD_URL",
  ],
};
