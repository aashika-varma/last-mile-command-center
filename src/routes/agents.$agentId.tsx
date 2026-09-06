import { createFileRoute, Link } from "@tanstack/react-router";
import { getAgentModule } from "@/agents/registry";
import { SITE } from "@/lib/site-content";
import { useRosterAgent, type RosterAgent } from "@/lib/roster";

const PAGE = SITE.agentPage;

export const Route = createFileRoute("/agents/$agentId")({
  head: ({ params }) => {
    const agent = getAgentModule(params.agentId)?.config;
    const title = agent
      ? `${agent.name} — ${PAGE.titleSuffix}`
      : `${PAGE.notFound.metaTitle} — ${PAGE.titleSuffix}`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: agent ? `${agent.role}: ${agent.description}` : PAGE.notFound.metaDescription,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: agent?.description ?? "" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: AgentPage,
  notFoundComponent: AgentNotFound,
});

function AgentNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-blueprint px-6 font-body text-foreground">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">{PAGE.notFound.code}</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
          {PAGE.notFound.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {PAGE.notFound.body}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {PAGE.notFound.backLabel}
        </Link>
      </div>
    </div>
  );
}

function AgentPage() {
  const { agentId } = Route.useParams();
  const mod = getAgentModule(agentId);
  const meta = useRosterAgent(agentId);
  if (mod) {
    // Each code-backed agent renders its OWN page component.
    const View = mod.View;
    return <View />;
  }
  if (meta) return <CustomAgentPage agent={meta} />;
  return <AgentNotFound />;
}

/** Page for an agent added from the registry manager (no code module yet). */
function CustomAgentPage({ agent }: { agent: RosterAgent }) {
  return (
    <div className="min-h-screen bg-background bg-blueprint font-body text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-6 md:px-10">
        <Link to="/" className="font-display text-sm font-bold uppercase tracking-[0.22em]">
          {SITE.brandNameLeft}
          <span className="text-primary">{SITE.brandAccent}</span>
          {SITE.brandNameRight}
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] tracking-widest text-muted-foreground hover:text-primary"
        >
          ← ALL AGENTS
        </Link>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">{agent.role}</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
          {agent.name}
          <span className="text-signal">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {agent.purpose}
        </p>
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card/40 p-8">
          <p className="font-display text-lg font-bold uppercase tracking-tight">
            Waiting on its own data
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            This agent was created from the registry manager. Give it real queries by adding
            src/agents/{agent.id}/ (copy an existing agent folder) — its wording stays editable
            from the content editor.
          </p>
          <Link
            to="/settings/agents"
            className="mt-6 inline-flex rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-primary hover:text-primary"
          >
            Edit in registry
          </Link>
        </div>
      </main>
    </div>
  );
}
