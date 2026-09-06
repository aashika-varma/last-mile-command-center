// ============================================================================
// SITE CONTENT — edit everything on the landing page here.
// Agent names/descriptions live in src/lib/agents.ts.
// Store locations live in src/lib/stores.ts.
// ============================================================================

export const SITE = {
  /** Short brand mark shown in the square logo tile */
  brandMark: "L",
  /** Brand name; `brandAccent` is rendered in the accent color between parts */
  brandNameLeft: "LMD",
  brandAccent: "·",
  brandNameRight: "Control Tower",

  /** Small label in the top bar, left of the theme toggle */
  sectorLabel: "SECTOR · MIDWEST-04",
  /** Live badge text */
  liveLabel: "LIVE",

  /** SEO / browser tab */
  meta: {
    title: "LMD - Control Tower — Last-Mile Agent Command",
    description:
      "Command center for the Walmart data science team's last-mile delivery agents: routing, forecasting, and exception intelligence in one console.",
  },

  hero: {
    /** Eyebrow line above the headline */
    eyebrow: "Walmart Data Science · Last-Mile Delivery",
    /** Headline, one entry per line. `accent` lines render in the primary color. */
    headline: [
      { text: "Nine machines.", accent: false },
      { text: "One last", accent: true },
      { text: "mile.", accent: false },
    ],
    /**
     * Supporting paragraph. `{agents}` is replaced with the live active-agent
     * count. Edit freely — remove the placeholder if you don't want it.
     */
    subcopy:
      "{agents} autonomous agents are moving 4,180 stops across 12 distribution hubs right now. Pick a node to step inside its brain.",
    /** Label above the map; `{count}` is replaced with the number of stores */
    mapLabel: "STORE NETWORK / {count} SITES",
  },

  /** Ticker strip under the hero. `{active}` and `{total}` are live counts. */
  ticker: [
    { value: "{active}/{total}", label: "agents online", tone: "primary" },
    { value: "98.2%", label: "on-time", tone: "signal" },
    { value: "4,180", label: "active stops", tone: "default" },
  ] as TickerItem[],

  roster: {
    heading: "The roster",
    hint: "SELECT A NODE ↓",
    enterLabel: "ENTER →",
    /** Prefix for each card's index badge, e.g. NODE·01 */
    nodePrefix: "NODE·",
  },

  footer: {
    left: "LMD - Control Tower",
    right: "Mission Control · Last-Mile Delivery",
  },

  /** Trailing text next to the UTC clock in the ticker */
  clockSuffix: "telemetry nominal",

  /** Copy used on individual agent pages (src/routes/agents.$agentId.tsx) */
  agentPage: {
    /** Appended to the browser tab title, after the agent name */
    titleSuffix: "LMD - Control Tower",
    /** Shown when an agent id in the URL doesn't exist */
    notFound: {
      code: "ERR·404",
      title: "Agent not found",
      body: "This agent doesn't exist or has been decommissioned.",
      backLabel: "Back to the roster",
      metaTitle: "Agent not found",
      metaDescription: "This agent does not exist.",
    },
  },
};

export type TickerItem = {
  value: string;
  label: string;
  tone: "primary" | "signal" | "default";
};
