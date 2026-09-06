// Atlas-Prime — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "atlas",
  name: "Atlas-Prime",
  role: "Dispatch Planner",
  description: "Balances loads across all 12 distribution hubs.",
  purpose: "Atlas-Prime allocates orders and vans across hubs so no facility is over-committed at the daily cut-off.",
  actions: [
    { label: "Rebalance hubs", kind: "primary" },
    { label: "Freeze plan", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/atlas/.env
  envKeys: [
    "ATLAS_HUB_API",
    "ATLAS_PLAN_WINDOW",
    "ATLAS_DB_URL",
  ],
};
