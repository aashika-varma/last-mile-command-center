// Compatibility layer. Agents now live in their own folders under src/agents/.
// Edit an agent's copy in src/agents/<id>/config.ts and its data in queries.ts.
export type { AgentStatus } from "@/agents/types";
export { AGENT_CARDS as AGENTS, getAgentModule } from "@/agents/registry";
