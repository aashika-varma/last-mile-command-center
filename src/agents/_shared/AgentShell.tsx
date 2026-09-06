// Presentation-only chrome (header/footer) shared by agent pages.
// It holds NO agent state — each agent supplies its own content.
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site-content";
import type { AgentConfig, AgentSnapshot } from "../types";
import { cn } from "@/lib/utils";

export function AgentShell({
  config,
  snapshot,
  children,
}: {
  config: AgentConfig;
  snapshot: AgentSnapshot;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background bg-blueprint font-body text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-sm bg-primary font-display text-sm font-black text-primary-foreground">
            {SITE.brandMark}
          </div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.22em]">
            {SITE.brandNameLeft}
            <span className="text-primary">{SITE.brandAccent}</span>
            {SITE.brandNameRight}
          </p>
        </Link>
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          ALL AGENTS
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 md:px-10">
        <section className="border-b border-border py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
              {config.role}
            </p>
            <StatusPill status={snapshot.status} />
          </div>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            {config.name}
            <span className="text-signal">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {config.purpose}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {config.actions.map((a) => (
              <button
                key={a.label}
                className={cn(
                  "rounded-md px-5 py-2.5 text-sm transition-colors",
                  a.kind === "primary"
                    ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-card font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </section>

        {children}

        <section className="py-10 md:py-14">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            Signal log
          </h2>
          <ol className="mt-6 overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur">
            {snapshot.log.map((entry, i) => (
              <li
                key={i}
                className="grid grid-cols-[4rem_1fr] items-baseline gap-4 border-b border-border px-5 py-4 last:border-b-0"
              >
                <span className="font-mono text-[11px] text-primary/80">{entry.time}</span>
                <span className="text-sm leading-relaxed text-foreground/85">{entry.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="flex items-center justify-between border-t border-border py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>{config.id} · independent agent</span>
          <span>env: {config.envKeys.length} keys</span>
        </footer>
      </main>
    </div>
  );
}

export function StatusPill({ status }: { status: "active" | "idle" }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider",
        status === "active"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "active" ? "animate-pulse-dot bg-primary" : "bg-muted-foreground/40",
        )}
      />
      {status}
    </span>
  );
}

export function StatGrid({ stats }: { stats: { label: string; value: string; hint?: string }[] }) {
  return (
    <section className="grid gap-4 border-b border-border py-10 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card/70 p-5 backdrop-blur">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {s.label}
          </p>
          <p className="mt-2 font-display text-3xl font-black tracking-tight">{s.value}</p>
          {s.hint ? <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p> : null}
        </div>
      ))}
    </section>
  );
}
