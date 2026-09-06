// Drift-2 — this agent's own page. Edit freely; nothing else depends on it.
import { AgentShell, StatGrid } from "../_shared/AgentShell";
import { config } from "./config";
import { getSnapshot } from "./queries";

export function View() {
  const snapshot = getSnapshot();
  return (
    <AgentShell config={config} snapshot={snapshot}>
      <StatGrid stats={snapshot.stats} />
    </AgentShell>
  );
}
