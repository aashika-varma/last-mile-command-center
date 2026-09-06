// ============================================================================
// CONTENT STORE — every piece of text in the app can be overridden from the
// in-app editor (/settings/content) or the registry manager (/settings/agents).
//
// Defaults still live in code (src/lib/site-content.ts, each agent's config.ts,
// src/agents/dashboard/*). Edits made in the UI are stored in the browser and
// layered on top. Export the JSON from the editor to paste it back into code.
// ============================================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const CONTENT_STORAGE_KEY = "lmd.content.overrides";

export interface AgentMetaOverride {
  name?: string;
  role?: string;
  description?: string;
  purpose?: string;
}

export interface CustomAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  purpose: string;
}

export interface Overrides {
  /** path -> replacement text (paths look like "site.hero.subcopy") */
  text: Record<string, string>;
  /** agent id -> renamed fields */
  agents: Record<string, AgentMetaOverride>;
  /** explicit display order of agent ids (ids not listed keep code order) */
  order: string[];
  /** agents added through the UI (no code module behind them yet) */
  custom: CustomAgent[];
  /** agent ids hidden from the landing roster */
  hidden: string[];
}

export const EMPTY_OVERRIDES: Overrides = {
  text: {},
  agents: {},
  order: [],
  custom: [],
  hidden: [],
};

interface ContentContextValue {
  overrides: Overrides;
  /** Resolved text for a path, falling back to the value defined in code. */
  t: (path: string, fallback: string) => string;
  setText: (path: string, value: string) => void;
  clearText: (path: string) => void;
  update: (fn: (o: Overrides) => Overrides) => void;
  reset: () => void;
  importJson: (json: string) => { ok: boolean; error?: string };
  exportJson: () => string;
  /** true once browser-stored edits have been applied (avoids hydration drift) */
  ready: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

function load(): Overrides {
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return EMPTY_OVERRIDES;
    return { ...EMPTY_OVERRIDES, ...(JSON.parse(raw) as Partial<Overrides>) };
  } catch {
    return EMPTY_OVERRIDES;
  }
}

function save(o: Overrides) {
  try {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* storage unavailable — edits stay in memory for this session */
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(EMPTY_OVERRIDES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOverrides(load());
    setReady(true);
  }, []);

  const update = useCallback((fn: (o: Overrides) => Overrides) => {
    setOverrides((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      overrides,
      ready,
      t: (path, fallback) => overrides.text[path] ?? fallback,
      setText: (path, v) => update((o) => ({ ...o, text: { ...o.text, [path]: v } })),
      clearText: (path) =>
        update((o) => {
          const text = { ...o.text };
          delete text[path];
          return { ...o, text };
        }),
      update,
      reset: () => {
        try {
          window.localStorage.removeItem(CONTENT_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setOverrides(EMPTY_OVERRIDES);
      },
      importJson: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<Overrides>;
          const next = { ...EMPTY_OVERRIDES, ...parsed };
          save(next);
          setOverrides(next);
          return { ok: true };
        } catch (e) {
          return { ok: false, error: (e as Error).message };
        }
      },
      exportJson: () => JSON.stringify(overrides, null, 2),
    }),
    [overrides, ready, update],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (ctx) return ctx;
  // Safe fallback so components still render if used outside the provider.
  return {
    overrides: EMPTY_OVERRIDES,
    ready: false,
    t: (_p, fallback) => fallback,
    setText: () => {},
    clearText: () => {},
    update: () => {},
    reset: () => {},
    importJson: () => ({ ok: false, error: "No content provider" }),
    exportJson: () => "{}",
  };
}

/** Shorthand: const t = useT(); t("site.footer.left", SITE.footer.left) */
export function useT() {
  return useContent().t;
}

