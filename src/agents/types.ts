// ============================================================================
// AGENT CONTRACT
// Every agent is an independent module under src/agents/<id>/.
// It owns its own config, its own queries (data access) and its own env keys.
// Nothing here is shared state — the registry only lists them for the landing page.
// ============================================================================

export type AgentStatus = "active" | "idle";

export interface AgentLogEntry {
  time: string;
  text: string;
}

/** A single number/label shown on the agent's own page. */
export interface AgentStat {
  label: string;
  value: string;
  hint?: string;
}

/** What an agent returns from its own queries.ts */
export interface AgentSnapshot {
  status: AgentStatus;
  progress: number;
  metric: string;
  stats: AgentStat[];
  log: AgentLogEntry[];
}

export interface AgentConfig {
  /** URL slug: /agents/<id> */
  id: string;
  name: string;
  /** Short purpose line shown on the card */
  role: string;
  /** One-sentence purpose */
  description: string;
  /** Longer "what this agent is for" copy on its own page */
  purpose: string;
  /** Primary actions rendered as buttons on the agent page */
  actions: { label: string; kind: "primary" | "secondary" }[];
  /**
   * Env vars this agent needs. Each agent keeps its own .env file at
   * src/agents/<id>/.env — these names are only documented here for the UI.
   */
  envKeys: string[];
}

/** A registered, self-contained agent. */
export interface AgentModule {
  config: AgentConfig;
  /** The agent's own data access. Swap for a real API/DB call per agent. */
  getSnapshot: () => AgentSnapshot;
  /** The agent's own page component. */
  View: React.ComponentType;
}
