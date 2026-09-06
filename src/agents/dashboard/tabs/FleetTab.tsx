// Tab 5 — the ~100 monitored agents this dashboard rolls up.
import { useMemo, useState } from "react";
import { FLEET, type FleetAgent } from "../data";
import { cn } from "@/lib/utils";

const DOT: Record<string, string> = {
  Healthy: "bg-primary",
  Degraded: "bg-signal",
  Offline: "bg-muted-foreground/50",
};

export function FleetTab({ agents }: { agents: FleetAgent[] }) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.domain.toLowerCase().includes(q),
    );
  }, [agents, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {rows.length} of {FLEET.length} agents
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search agents…"
          className="w-56 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border border-border bg-card/70 p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2">
              <span className={cn("size-1.5 rounded-full", DOT[a.status])} />
              <p className="font-display text-sm font-bold tracking-tight">{a.name}</p>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {a.region}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {a.domain}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] tabular-nums text-muted-foreground">
              <span>{a.runs.toLocaleString()} runs</span>
              <span className="text-center">{a.successRate}%</span>
              <span className="text-right">{a.latencyMs}ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
