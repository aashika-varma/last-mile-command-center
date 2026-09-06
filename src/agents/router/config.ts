// Router-01 — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "router",
  name: "Router-01",
  role: "ETA Optimization",
  description: "Predicts arrival windows per stop across the region.",
  purpose: "Router-01 owns arrival-time prediction. It scores every stop against live traffic, weather and historical dwell time, and publishes an ETA window that downstream dispatch systems consume.",
  actions: [
    { label: "Recompute ETAs", kind: "primary" },
    { label: "Pause", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/router/.env
  envKeys: [
    "ROUTER_MODEL_ENDPOINT",
    "ROUTER_TRAFFIC_API_KEY",
    "ROUTER_DB_URL",
  ],
};
