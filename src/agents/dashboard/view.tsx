// Dashboard-00 — this agent's own page. Tabs + per-tab filter bar.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import {
  config,
  EXPORTS,
  FILTERS,
  FILTER_STORAGE_KEY,
  MESSAGES,
  TABS,
  type FilterKey,
  type TabId,
} from "./config";
import { METRIC_GROUP_NAMES } from "./data";
import { getSnapshot } from "./queries";
import { useDashboardData } from "./useDashboardData";
import type { FilterState } from "./select";
import { ErrorState, LoadingState } from "./tabs/QueryStates";
import { ReportTab } from "./tabs/ReportTab";
import { MetricsTab } from "./tabs/MetricsTab";
import { RcaTab } from "./tabs/RcaTab";
import { ChartsTab } from "./tabs/ChartsTab";
import { FleetTab } from "./tabs/FleetTab";
import { useT } from "@/lib/content-store";
import { useRosterAgent } from "@/lib/roster";
import {
  exportMetricsCsv,
  exportMetricsPdf,
  exportReportCsv,
  exportReportPdf,
} from "@/lib/export-data";

function optionsFor(key: FilterKey): readonly string[] {
  if (key === "group") return ["All groups", ...METRIC_GROUP_NAMES];
  return FILTERS[key].options;
}

const DEFAULT_FILTERS: FilterState = {
  week: FILTERS.week.options[0],
  region: FILTERS.region.options[0],
  banner: FILTERS.banner.options[0],
  group: "All groups",
  severity: FILTERS.severity.options[0],
  status: FILTERS.status.options[0],
};

export function View() {
  const t = useT();
  const meta = useRosterAgent(config.id);
  const snapshot = getSnapshot();
  const [tab, setTab] = useState<TabId>("report");

  // One filter state for the whole dashboard: it persists as you switch tabs
  // and is remembered between visits.
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) setFilters({ ...DEFAULT_FILTERS, ...(JSON.parse(saved) as Partial<FilterState>) });
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const setFilter = (key: FilterKey, value: string) =>
    setFilters((f) => {
      const next = { ...f, [key]: value };
      try {
        window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    try {
      window.localStorage.removeItem(FILTER_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  // Every tab reads the SAME filtered dataset, so charts, metrics, RCA and the
  // fleet list always agree with each other.
  const { data, loading, error, retry } = useDashboardData(filters);

  const activeTab = TABS.find((x) => x.id === tab)!;
  const metricLabel = (id: string, name: string) => t(`dashboard.metric.${id}`, name);

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

      <main className="mx-auto max-w-[1600px] px-6 pb-16 md:px-10">
        {/* Title block */}
        <section className="flex flex-wrap items-end justify-between gap-6 border-b border-border py-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
              {meta?.role ?? config.role}
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              {meta?.name ?? config.name}
              <span className="text-signal">.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {meta?.purpose ?? config.purpose}
            </p>
          </div>
          <div className="flex gap-3">
            {snapshot.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card/70 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 font-display text-2xl font-black tracking-tight">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <nav className="sticky top-0 z-10 -mx-6 flex gap-1 overflow-x-auto border-b border-border bg-background/90 px-6 backdrop-blur md:-mx-10 md:px-10">
          {TABS.map((tabDef) => (
            <button
              key={tabDef.id}
              onClick={() => setTab(tabDef.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                tab === tabDef.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`dashboard.tab.${tabDef.id}`, tabDef.label)}
              {tab === tabDef.id && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* Per-tab filter bar */}
        {activeTab.filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-border py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {MESSAGES.filters.label}
            </span>
            {activeTab.filters.map((key) => (
              <label key={key} className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {FILTERS[key].label}
                </span>
                <select
                  value={filters[key]}
                  onChange={(e) => setFilter(key, e.target.value)}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-primary"
                >
                  {optionsFor(key).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button
              onClick={resetFilters}
              className="ml-auto rounded-md border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {MESSAGES.filters.resetLabel}
            </button>
            <p className="basis-full font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {MESSAGES.filters.scopePrefix} {filters.week} · {filters.region} · {filters.banner} —{" "}
              {MESSAGES.filters.persistNote}
            </p>
          </div>
        )}

        {/* Downloads — always reflect the filters currently applied */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {t("dashboard.exports.label", EXPORTS.label)}
          </span>
          {[
            {
              key: "reportPdf",
              label: EXPORTS.reportPdf,
              run: () =>
                data && exportReportPdf(data, data.scope, t("dashboard.exports.reportTitle", EXPORTS.reportTitle)),
            },
            {
              key: "reportCsv",
              label: EXPORTS.reportCsv,
              run: () => data && exportReportCsv(data, data.scope),
            },
            {
              key: "metricsPdf",
              label: EXPORTS.metricsPdf,
              run: () =>
                data &&
                exportMetricsPdf(
                  data,
                  data.scope,
                  t("dashboard.exports.metricsTitle", EXPORTS.metricsTitle),
                  metricLabel,
                ),
            },
            {
              key: "metricsCsv",
              label: EXPORTS.metricsCsv,
              run: () => data && exportMetricsCsv(data, data.scope, metricLabel),
            },
          ].map((b) => (
            <button
              key={b.key}
              onClick={b.run}
              disabled={!data || loading}
              className="rounded-md border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
            >
              {t(`dashboard.exports.${b.key}`, b.label)}
            </button>
          ))}
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {data ? data.scope : "—"}
          </span>
        </div>

        {/* Tab content */}
        <div className="py-8">
          {error && <ErrorState error={error} onRetry={retry} />}
          {!error && (loading || !data) && tab !== "notes" && <LoadingState />}
          {!error && data && !loading && (
            <>
              {tab === "report" && <ReportTab report={data.report} />}
              {tab === "metrics" && <MetricsTab metrics={data.metrics} group={filters.group} />}
              {tab === "rca" && <RcaTab items={data.rca} />}
              {tab === "charts" && <ChartsTab charts={data.charts} />}
              {tab === "agents" && <FleetTab agents={data.fleet} />}
            </>
          )}
          {tab === "notes" && !error && (
            <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
              <p className="font-display text-lg font-bold uppercase tracking-tight">
                Reserved for a future view
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Rename this tab, give it filters and drop in a component from
                src/agents/dashboard/tabs/ when you decide what belongs here.
              </p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-border py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>{config.id} · independent agent</span>
          <span>env: {config.envKeys.length} keys</span>
        </footer>
      </main>
    </div>
  );
}
