// Tab 2 — 120+ metrics grouped by attribute, each compared to last week.
import { useMemo, useState } from "react";
import { METRIC_GROUP_NAMES, type MetricRow } from "../data";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/content-store";

function fmt(v: number, unit: string) {
  if (unit === "$") return `$${v.toFixed(2)}`;
  if (unit === "%") return `${v.toFixed(1)}%`;
  return v.toFixed(2);
}

function Delta({ m }: { m: MetricRow }) {
  const diff = m.current - m.previous;
  const pct = (diff / m.previous) * 100;
  const good = m.goodWhenDown ? diff < 0 : diff > 0;
  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums",
        Math.abs(pct) < 0.05
          ? "text-muted-foreground"
          : good
            ? "text-primary"
            : "text-signal",
      )}
    >
      {diff >= 0 ? "+" : ""}
      {diff.toFixed(2)} ({pct >= 0 ? "+" : ""}
      {pct.toFixed(1)}%)
    </span>
  );
}

export function MetricsTab({ metrics, group }: { metrics: MetricRow[]; group: string }) {
  const t = useT();
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return METRIC_GROUP_NAMES.filter((g) => group === "All groups" || group === g).map((g) => ({
      group: g,
      rows: metrics.filter(
        (m) =>
          m.group === g &&
          (!q || t(`dashboard.metric.${m.id}`, m.name).toLowerCase().includes(q)),
      ),
    })).filter((g) => g.rows.length > 0);
  }, [metrics, group, query, t]);

  const total = grouped.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {total} metrics · week over week
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search metrics…"
          className="w-56 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </div>

      {grouped.map((g) => (
        <section key={g.group} className="overflow-hidden rounded-xl border border-border bg-card/70">
          <header className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em]">
              {t(`dashboard.group.${g.group}`, g.group)}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {g.rows.length} metrics
            </span>
          </header>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-2 text-left font-normal">Metric</th>
                <th className="px-5 py-2 text-right font-normal">This week</th>
                <th className="px-5 py-2 text-right font-normal">Last week</th>
                <th className="px-5 py-2 text-right font-normal">Delta</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map((m) => (
                <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-2.5">{t(`dashboard.metric.${m.id}`, m.name)}</td>
                  <td className="px-5 py-2.5 text-right font-mono tabular-nums">
                    {fmt(m.current, m.unit)}
                  </td>
                  <td className="px-5 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                    {fmt(m.previous, m.unit)}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <Delta m={m} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
