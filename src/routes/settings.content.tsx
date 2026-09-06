// In-app content editor — change any wording without touching code.
import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site-content";
import { flattenText, type TextField } from "@/lib/content-paths";
import { useContent } from "@/lib/content-store";
import { useRoster } from "@/lib/roster";
import { CHART_TITLES, MESSAGES, TABS } from "@/agents/dashboard/config";
import { METRICS, METRIC_GROUP_NAMES } from "@/agents/dashboard/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/content")({
  head: () => ({
    meta: [
      { title: "Content editor — LMD - Control Tower" },
      {
        name: "description",
        content:
          "Edit every word in LMD - Control Tower: landing copy, agent names, dashboard tab titles, metric labels and chart titles.",
      },
      { property: "og:title", content: "Content editor — LMD - Control Tower" },
      {
        property: "og:description",
        content: "Update all app wording from the browser, then export it back into code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContentEditor,
});

type SectionId = "landing" | "agents" | "tabs" | "metrics" | "charts" | "data";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "landing", label: "Landing page" },
  { id: "agents", label: "Agent names" },
  { id: "tabs", label: "Dashboard tabs" },
  { id: "metrics", label: "Metric labels" },
  { id: "charts", label: "Chart & message titles" },
  { id: "data", label: "Save / export" },
];

function Field({ field }: { field: TextField }) {
  const { t, setText, clearText, overrides } = useContent();
  const value = t(field.path, field.fallback);
  const edited = field.path in overrides.text;
  const Input = field.multiline ? "textarea" : "input";
  return (
    <label className="block">
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {field.label}
        {edited && (
          <button
            onClick={() => clearText(field.path)}
            className="rounded border border-border px-1.5 py-0.5 text-[9px] text-primary hover:border-primary"
          >
            revert
          </button>
        )}
      </span>
      <Input
        value={value}
        rows={field.multiline ? 3 : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setText(field.path, e.target.value)
        }
        className={cn(
          "mt-1.5 w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:border-primary",
          edited ? "border-primary/60" : "border-border",
        )}
      />
    </label>
  );
}

function ContentEditor() {
  const { overrides, exportJson, importJson, reset, update } = useContent();
  const [section, setSection] = useState<SectionId>("landing");
  const [query, setQuery] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const siteFields = useMemo(() => flattenText(SITE, "site"), []);
  const roster = useRoster(true);

  const filtered = (fields: TextField[]) => {
    const q = query.trim().toLowerCase();
    if (!q) return fields;
    return fields.filter(
      (f) => f.label.toLowerCase().includes(q) || f.fallback.toLowerCase().includes(q),
    );
  };

  const metricFields: TextField[] = useMemo(
    () =>
      METRICS.map((m) => ({
        path: `dashboard.metric.${m.id}`,
        label: `${m.group} › ${m.name}`,
        fallback: m.name,
        multiline: false,
      })),
    [],
  );

  const groupFields: TextField[] = useMemo(
    () =>
      METRIC_GROUP_NAMES.map((g) => ({
        path: `dashboard.group.${g}`,
        label: `group › ${g}`,
        fallback: g,
        multiline: false,
      })),
    [],
  );

  const tabFields: TextField[] = TABS.map((t) => ({
    path: `dashboard.tab.${t.id}`,
    label: `tab › ${t.id}`,
    fallback: t.label,
    multiline: false,
  }));

  const chartFields: TextField[] = Object.entries(CHART_TITLES).map(([k, v]) => ({
    path: `dashboard.chart.${k}`,
    label: `chart › ${k}`,
    fallback: v,
    multiline: false,
  }));

  const messageFields = useMemo(() => flattenText(MESSAGES, "dashboard.messages"), []);

  const editedCount =
    Object.keys(overrides.text).length +
    Object.keys(overrides.agents).length +
    overrides.custom.length;

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
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest">
          <Link to="/settings/agents" className="text-muted-foreground hover:text-primary">
            AGENT REGISTRY
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-primary">
            ← ALL AGENTS
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <section className="border-b border-border py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
            Content editor
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
            Edit every word<span className="text-signal">.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Change landing copy, agent names, tab titles, metric labels and chart titles right here.
            Edits save in this browser instantly — use Save / export to download the JSON and drop it
            back into the code when you're happy. {editedCount} field(s) currently overridden.
          </p>
        </section>

        <nav className="flex gap-1 overflow-x-auto border-b border-border">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-4 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                section === s.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
              {section === s.id && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {section !== "data" && (
          <div className="py-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fields…"
              className="w-full max-w-sm rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="grid gap-4 py-6 md:grid-cols-2">
          {section === "landing" && filtered(siteFields).map((f) => <Field key={f.path} field={f} />)}
          {section === "tabs" && filtered(tabFields).map((f) => <Field key={f.path} field={f} />)}
          {section === "charts" &&
            filtered([...chartFields, ...messageFields]).map((f) => <Field key={f.path} field={f} />)}
          {section === "metrics" &&
            filtered([...groupFields, ...metricFields]).map((f) => <Field key={f.path} field={f} />)}

          {section === "agents" &&
            roster.map((a) => (
              <section key={a.id} className="rounded-xl border border-border bg-card/70 p-5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold tracking-tight">{a.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {a.id}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {(["name", "role", "description", "purpose"] as const).map((key) => (
                    <label key={key} className={cn("block", key === "purpose" && "md:col-span-2")}>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {key}
                      </span>
                      {key === "purpose" || key === "description" ? (
                        <textarea
                          rows={key === "purpose" ? 3 : 2}
                          value={a[key]}
                          onChange={(e) =>
                            update((o) => ({
                              ...o,
                              agents: {
                                ...o.agents,
                                [a.id]: { ...o.agents[a.id], [key]: e.target.value },
                              },
                            }))
                          }
                          className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      ) : (
                        <input
                          value={a[key]}
                          onChange={(e) =>
                            update((o) => ({
                              ...o,
                              agents: {
                                ...o.agents,
                                [a.id]: { ...o.agents[a.id], [key]: e.target.value },
                              },
                            }))
                          }
                          className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
        </div>

        {section === "data" && (
          <div className="space-y-6 py-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([exportJson()], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "lmd-content.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Download content JSON
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="rounded-md border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary"
              >
                Load content JSON
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const res = importJson(await file.text());
                  setNote(res.ok ? "Content loaded." : `Couldn't load that file: ${res.error}`);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => {
                  reset();
                  setNote("All edits cleared — back to the wording defined in code.");
                }}
                className="rounded-md border border-border px-4 py-2 text-sm text-signal hover:border-signal"
              >
                Reset everything
              </button>
            </div>
            {note && <p className="font-mono text-[11px] text-primary">{note}</p>}
            <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-card/70 p-5 font-mono text-[11px] leading-relaxed">
              {exportJson()}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
