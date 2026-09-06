import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRoster } from "@/lib/roster";
import { useT } from "@/lib/content-store";
import { UsStoreMap } from "@/components/UsStoreMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { STORE_LOCATIONS } from "@/lib/stores";
import { SITE } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE.meta.title },
      { name: "description", content: SITE.meta.description },
      { property: "og:title", content: SITE.meta.title },
      { property: "og:description", content: SITE.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function UtcClock() {
  const t = useT();
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="ml-auto hidden md:inline text-muted-foreground/60">
      {time ? `${time} UTC` : "--:--:--"} · {t("site.clockSuffix", SITE.clockSuffix)}
    </span>
  );
}

function Index() {
  const t = useT();
  const AGENTS = useRoster();
  const activeCount = AGENTS.filter((a) => a.status === "active").length;
  const fill = (template: string) =>
    template
      .replace("{agents}", String(activeCount))
      .replace("{active}", String(activeCount))
      .replace("{total}", String(AGENTS.length))
      .replace("{count}", String(STORE_LOCATIONS.length));

  return (
    <div className="min-h-screen bg-background bg-blueprint font-body text-foreground">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-border px-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-sm bg-primary font-display text-sm font-black text-primary-foreground">
            {t("site.brandMark", SITE.brandMark)}
          </div>
          <p className="font-display text-sm font-bold tracking-[0.22em] uppercase">
            {t("site.brandNameLeft", SITE.brandNameLeft)}
            <span className="text-primary">{t("site.brandAccent", SITE.brandAccent)}</span>
            {t("site.brandNameRight", SITE.brandNameRight)}
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="hidden text-muted-foreground md:inline">
            {t("site.sectorLabel", SITE.sectorLabel)}
          </span>
          <Link
            to="/settings/agents"
            className="hidden text-muted-foreground transition-colors hover:text-primary md:inline"
          >
            REGISTRY
          </Link>
          <Link
            to="/settings/content"
            className="hidden text-muted-foreground transition-colors hover:text-primary md:inline"
          >
            EDIT TEXT
          </Link>
          <ThemeToggle />
          <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="tracking-widest text-primary">{t("site.liveLabel", SITE.liveLabel)}</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Hero */}
        <section className="relative grid gap-10 overflow-hidden border-b border-border py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.4em] text-primary">
              {t("site.hero.eyebrow", SITE.hero.eyebrow)}
            </p>
            <h1 className="mt-6 font-display font-black uppercase leading-[0.92] tracking-tight text-5xl md:text-7xl">
              {SITE.hero.headline.map((line, i) => (
                <span
                  key={i}
                  className={cn(
                    "block animate-rise",
                    line.accent && "text-primary",
                  )}
                  style={{ animationDelay: `${80 + i * 100}ms` }}
                >
                  {t(`site.hero.headline.${i}.text`, line.text)}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md animate-rise text-base leading-relaxed text-muted-foreground [animation-delay:380ms]">
              {fill(t("site.hero.subcopy", SITE.hero.subcopy))}
            </p>
          </div>

          <div className="relative mx-auto w-full animate-rise [animation-delay:300ms]">
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
            <UsStoreMap className="relative h-auto w-full" />
            <span className="absolute left-1 top-0 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/70">
              {fill(t("site.hero.mapLabel", SITE.hero.mapLabel))}
            </span>
          </div>
        </section>

        {/* Ticker strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-border py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {SITE.ticker.map((item, i) => (
            <span key={i}>
              <span
                className={cn(
                  item.tone === "primary" && "text-primary",
                  item.tone === "signal" && "text-signal",
                  item.tone === "default" && "text-foreground",
                )}
              >
                {fill(t(`site.ticker.${i}.value`, item.value))}
              </span>{" "}
              {t(`site.ticker.${i}.label`, item.label)}
            </span>
          ))}
          <UtcClock />
        </div>

        {/* Agent grid */}
        <section className="py-10 md:py-14">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight">
              {t("site.roster.heading", SITE.roster.heading)}
            </h2>
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
              {t("site.roster.hint", SITE.roster.hint)}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS.map((agent, i) => (
              <Link
                key={agent.id}
                to="/agents/$agentId"
                params={{ agentId: agent.id }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_40px_-12px_oklch(0.82_0.13_205/0.35)] animate-rise"
                style={{ animationDelay: `${i * 90 + 400}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                    {t("site.roster.nodePrefix", SITE.roster.nodePrefix)}
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      agent.status === "active"
                        ? "bg-primary animate-node-glow"
                        : "bg-muted-foreground/40",
                    )}
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight transition-colors group-hover:text-primary">
                  {agent.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80">
                  {agent.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {agent.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      agent.status === "active" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {agent.metric}
                  </span>
                  <span className="font-mono text-[11px] text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
                    {t("site.roster.enterLabel", SITE.roster.enterLabel)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-border py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>{t("site.footer.left", SITE.footer.left)}</span>
          <span>{t("site.footer.right", SITE.footer.right)}</span>
        </footer>
      </main>
    </div>
  );
}
