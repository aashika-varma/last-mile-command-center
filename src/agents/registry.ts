// ============================================================================
// AGENT REGISTRY — the only place agents are listed.
// Each agent lives in its own folder (config, queries, .env, page view) and has
// no dependency on any other agent. Add a new one by creating
// src/agents/<id>/ (copy an existing folder) and adding it below.
// ============================================================================
import type { AgentModule } from "./types";
import { agent as dashboard } from "./dashboard";
import { agent as router } from "./router";
import { agent as densify } from "./densify";
import { agent as vector } from "./vector";
import { agent as pulse } from "./pulse";
import { agent as drift } from "./drift";
import { agent as atlas } from "./atlas";
import { agent as sentry } from "./sentry";
import { agent as cascade } from "./cascade";

export const AGENT_MODULES: AgentModule[] = [
  dashboard,
  router,
  densify,
  vector,
  pulse,
  drift,
  atlas,
  sentry,
  cascade,
];

export function getAgentModule(id: string): AgentModule | undefined {
  return AGENT_MODULES.find((m) => m.config.id === id);
}

/** Flat list used by the landing page roster. */
export const AGENT_CARDS = AGENT_MODULES.map((m) => {
  const snapshot = m.getSnapshot();
  return {
    id: m.config.id,
    name: m.config.name,
    role: m.config.role,
    description: m.config.description,
    status: snapshot.status,
    metric: snapshot.metric,
  };
});
