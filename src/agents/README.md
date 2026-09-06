# Agents

Every agent is fully independent. Nothing in one agent folder imports another.

```
src/agents/
  types.ts          shared contract only (types, no logic)
  registry.ts       list of agents shown on the landing page
  _shared/          optional presentation chrome for agent pages
  <agent-id>/
    config.ts       name, role, purpose, buttons, env key names  (edit copy here)
    queries.ts      this agent's own data access (swap for real API/DB)
    view.tsx        this agent's own page UI
    .env.example    this agent's own environment variables
    index.ts        exports the agent module
```

## Add a new agent

1. Copy any existing folder to `src/agents/<new-id>/`.
2. Edit `config.ts` (set `id` to the folder name), `queries.ts`, `view.tsx`, `.env.example`.
3. Import it in `registry.ts` and add it to `AGENT_MODULES`.

It then appears on the landing page and is reachable at `/agents/<new-id>`.

## Environment variables

Each agent documents its own keys in `config.ts` (`envKeys`) and `.env.example`.
Secrets must only be read on the server, inside a server function handler.
