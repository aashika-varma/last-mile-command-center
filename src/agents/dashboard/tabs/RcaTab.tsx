// Tab 3 — Root cause analysis.
import type { RcaItem } from "../data";
import { MESSAGES } from "../config";
import { cn } from "@/lib/utils";

const SEV: Record<string, string> = {
  Critical: "border-signal/40 bg-signal/10 text-signal",
  High: "border-signal/30 bg-signal/5 text-signal",
  Medium: "border-primary/30 bg-primary/10 text-primary",
  Low: "border-border bg-muted text-muted-foreground",
};

export function RcaTab({ items }: { items: RcaItem[] }) {

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
        {MESSAGES.empty}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <article key={r.id} className="rounded-xl border border-border bg-card/70 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider",
                SEV[r.severity],
              )}
            >
              {r.severity}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {r.region} · {r.metric}
            </span>
            <span className="ml-auto font-mono text-[11px] text-primary">
              confidence {Math.round(r.confidence * 100)}%
            </span>
          </div>

          <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight">{r.title}</h3>
          <p className="mt-1 font-mono text-xs text-signal">{r.impact}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {r.narrative}
          </p>

          <div className="mt-5 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Contributing drivers
            </p>
            {r.drivers.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-56 shrink-0 truncate text-sm">{d.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${d.contribution}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
                  {d.contribution}%
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              Recommended action ·{" "}
            </span>
            {r.action}
          </p>
        </article>
      ))}
    </div>
  );
}
