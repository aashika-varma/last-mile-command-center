// Tab 1 — Business report. All copy lives in ../data.ts (REPORT).
import type { REPORT as ReportShape } from "../data";
import { cn } from "@/lib/utils";

export function ReportTab({ report: REPORT }: { report: typeof ReportShape }) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card/70 p-6 backdrop-blur">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
          {REPORT.period}
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
          {REPORT.headline}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {REPORT.summary}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT.kpis.map((k) => {
          const good = k.goodWhenDown ? k.delta < 0 : k.delta > 0;
          return (
            <div key={k.label} className="rounded-xl border border-border bg-card/70 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {k.label}
              </p>
              <p className="mt-2 font-display text-3xl font-black tracking-tight">{k.value}</p>
              <p
                className={cn(
                  "mt-1 font-mono text-xs",
                  good ? "text-primary" : "text-signal",
                )}
              >
                {k.delta > 0 ? "▲" : "▼"} {Math.abs(k.delta)}
                {k.unit} vs last week
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {REPORT.sections.map((s) => (
          <section key={s.title} className="rounded-xl border border-border bg-card/70 p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
              {s.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {s.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
