// Densify-X — independent agent config. Edit any verbiage here.
import type { AgentConfig } from "../types";

export const config: AgentConfig = {
  id: "densify",
  name: "Densify-X",
  role: "Demand Forecast",
  description: "Projects 24-hour order density by delivery zone.",
  purpose: "Densify-X forecasts order volume per zone for the next 24 hours so hubs can staff and stage vans ahead of demand.",
  actions: [
    { label: "Run forecast", kind: "primary" },
    { label: "Export CSV", kind: "secondary" },
  ],
  // This agent reads its own env file: src/agents/densify/.env
  envKeys: [
    "DENSIFY_WAREHOUSE_DSN",
    "DENSIFY_FORECAST_HORIZON",
    "DENSIFY_S3_BUCKET",
  ],
};
