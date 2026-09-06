// Agent roster = code modules (src/agents/registry.ts) merged with the renames,
// ordering and UI-added agents stored by the content store.
import { useMemo } from "react";
import { AGENT_MODULES } from "@/agents/registry";
import { useContent } from "./content-store";

// ---------------------------------------------------------------------------
// Agent roster (code modules + UI-added agents, renamed and reordered)
// ---------------------------------------------------------------------------
export interface RosterAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  purpose: string;
  status: "active" | "idle";
  metric: string;
  /** true when the agent was added through the UI and has no code module yet */
  custom: boolean;
  hidden: boolean;
}

export function useRoster(includeHidden = false): RosterAgent[] {
  const { overrides } = useContent();

  return useMemo(() => {
    const base: RosterAgent[] = AGENT_MODULES.map((m) => {
      const snap = m.getSnapshot();
      return {
        id: m.config.id,
        name: m.config.name,
        role: m.config.role,
        description: m.config.description,
        purpose: m.config.purpose,
        status: snap.status,
        metric: snap.metric,
        custom: false,
        hidden: false,
      };
    });

    const customs: RosterAgent[] = overrides.custom.map((c) => ({
      ...c,
      status: "idle" as const,
      metric: "awaiting first run",
      custom: true,
      hidden: false,
    }));

    const all = [...base, ...customs].map((a) => {
      const o = overrides.agents[a.id];
      return {
        ...a,
        name: o?.name ?? a.name,
        role: o?.role ?? a.role,
        description: o?.description ?? a.description,
        purpose: o?.purpose ?? a.purpose,
        hidden: overrides.hidden.includes(a.id),
      };
    });

    const order = overrides.order;
    if (order.length) {
      all.sort((a, b) => {
        const ia = order.indexOf(a.id);
        const ib = order.indexOf(b.id);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
    }

    return includeHidden ? all : all.filter((a) => !a.hidden);
  }, [overrides, includeHidden]);
}

export function useRosterAgent(id: string): RosterAgent | undefined {
  return useRoster(true).find((a) => a.id === id);
}
