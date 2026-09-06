// Agent registry manager — add, rename, reorder and hide agents from the UI.
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site-content";
import { useContent, type CustomAgent } from "@/lib/content-store";
import { useRoster } from "@/lib/roster";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/agents")({
  head: () => ({
    meta: [
      { title: "Agent registry — LMD - Control Tower" },
      {
        name: "description",
        content:
          "Add, rename, reorder and hide the agents shown on the LMD - Control Tower landing page.",
      },
      { property: "og:title", content: "Agent registry — LMD - Control Tower" },
      {
        property: "og:description",
        content: "Manage the agent roster: order, names, roles, descriptions and page metadata.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegistryManager,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "agent";

function RegistryManager() {
  const { update, overrides } = useContent();
  const roster = useRoster(true);
  const [draft, setDraft] = useState<CustomAgent>({
    id: "",
    name: "",
    role: "",
    description: "",
    purpose: "",
  });
  const [note, setNote] = useState<string | null>(null);

  const ids = roster.map((a) => a.id);

  const move = (id: string, dir: -1 | 1) => {
    const order = [...ids];
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j]!, order[i]!];
    update((o) => ({ ...o, order }));
  };

  const setField = (id: string, key: "name" | "role" | "description" | "purpose", value: string) =>
    update((o) => ({ ...o, agents: { ...o.agents, [id]: { ...o.agents[id], [key]: value } } }));

  const toggleHidden = (id: string) =>
    update((o) => ({
      ...o,
      hidden: o.hidden.includes(id) ? o.hidden.filter((x) => x !== id) : [...o.hidden, id],
    }));

  const addAgent = () => {
    const id = slugify(draft.id || draft.name);
    if (!draft.name.trim()) return setNote("Give the agent a name first.");
    if (ids.includes(id)) return setNote(`An agent with the id "${id}" already exists.`);
    update((o) => ({
      ...o,
      custom: [
        ...o.custom,
        {
          id,
          name: draft.name,
          role: draft.role || "New agent",
          description: draft.description || "Describe what this agent does.",
          purpose: draft.purpose || "Add the longer purpose shown on the agent's own page.",
        },
      ],
      order: [...ids, id],
    }));
    setDraft({ id: "", name: "", role: "", description: "", purpose: "" });
    setNote(`Added "${draft.name}". It now appears on the landing page at /agents/${id}.`);
  };

  const removeCustom = (id: string) =>
    update((o) => ({
      ...o,
      custom: o.custom.filter((c) => c.id !== id),
      order: o.order.filter((x) => x !== id),
    }));

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
          <Link to="/settings/content" className="text-muted-foreground hover:text-primary">
            CONTENT EDITOR
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-primary">
            ← ALL AGENTS
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
        <section className="border-b border-border py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
            Agent registry
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
            Manage the roster<span className="text-signal">.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Reorder the cards, rename any agent, edit its role, description and page copy, hide one
            from the landing page, or add a brand-new agent slot. {roster.length} agents registered.
          </p>
        </section>

        {note && <p className="pt-4 font-mono text-[11px] text-primary">{note}</p>}

        <section className="space-y-4 py-8">
          {roster.map((a, i) => (
            <article
              key={a.id}
              className={cn(
                "rounded-xl border bg-card/70 p-5",
                a.hidden ? "border-dashed border-border opacity-60" : "border-border",
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/80">
                  {a.id}
                  {a.custom && " · added here"}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => move(a.id, -1)}
                    disabled={i === 0}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[11px] disabled:opacity-30 hover:border-primary hover:text-primary"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(a.id, 1)}
                    disabled={i === roster.length - 1}
                    className="rounded-md border border-border px-2 py-1 font-mono text-[11px] disabled:opacity-30 hover:border-primary hover:text-primary"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => toggleHidden(a.id)}
                    className="rounded-md border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"
                  >
                    {a.hidden ? "show" : "hide"}
                  </button>
                  {a.custom && (
                    <button
                      onClick={() => removeCustom(a.id)}
                      className="rounded-md border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-signal hover:border-signal"
                    >
                      remove
                    </button>
                  )}
                  <Link
                    to="/agents/$agentId"
                    params={{ agentId: a.id }}
                    className="rounded-md border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary"
                  >
                    open
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Name
                  </span>
                  <input
                    value={a.name}
                    onChange={(e) => setField(a.id, "name", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Role
                  </span>
                  <input
                    value={a.role}
                    onChange={(e) => setField(a.id, "role", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Card description
                  </span>
                  <textarea
                    rows={2}
                    value={a.description}
                    onChange={(e) => setField(a.id, "description", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Page purpose (also used for the page description)
                  </span>
                  <textarea
                    rows={3}
                    value={a.purpose}
                    onChange={(e) => setField(a.id, "purpose", e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-dashed border-border bg-card/40 p-6">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-tight">
            Add an agent
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Creates a new card and page. Wire real data later by adding a folder under
            src/agents/&lt;id&gt;/.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Name (e.g. Horizon-9)"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: e.target.value })}
              placeholder="URL id (optional, e.g. horizon)"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              placeholder="Role (e.g. Capacity Forecasting)"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary md:col-span-2"
            />
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Card description"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary md:col-span-2"
            />
            <textarea
              rows={3}
              value={draft.purpose}
              onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}
              placeholder="Page purpose"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary md:col-span-2"
            />
          </div>
          <button
            onClick={addAgent}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Add agent
          </button>
        </section>

        <p className="py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {overrides.custom.length} added · {overrides.hidden.length} hidden · order saved in this
          browser
        </p>
      </main>
    </div>
  );
}
