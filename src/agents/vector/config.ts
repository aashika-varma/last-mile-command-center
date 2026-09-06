// Vector-7 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "vector",
  name: "Vector-7",
  role: "Route Sequencing",
  description: "Reorders stops to cut dead miles across the fleet.",
  purpose: "Vector-7 solves the stop-sequencing problem per vehicle, minimising dead miles while respecting time windows and capacity.",
  actions: [
    { label: "Re-sequence fleet", kind: "primary" },
    { label: "Compare to baseline", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/vector/.env
  envKeys: [
    "VECTOR_SOLVER_URL",
    "VECTOR_MAX_RUNTIME_S",
    "VECTOR_OSRM_HOST",
  ],
};
