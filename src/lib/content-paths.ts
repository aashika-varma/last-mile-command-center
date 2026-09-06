// Helpers that turn the code-defined content objects into a flat list of
// editable fields for the in-app editor (/settings/content).

export interface TextField {
  /** override path, e.g. "site.hero.subcopy" */
  path: string;
  /** human label, e.g. "hero › subcopy" */
  label: string;
  /** value defined in code */
  fallback: string;
  multiline: boolean;
}

/** Walk an object and collect every string leaf as an editable field. */
export function flattenText(obj: unknown, prefix: string): TextField[] {
  const out: TextField[] = [];
  const walk = (value: unknown, path: string[]) => {
    if (typeof value === "string") {
      out.push({
        path: [prefix, ...path].join("."),
        label: path.join(" › "),
        fallback: value,
        multiline: value.length > 60,
      });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, [...path, String(i)]));
      return;
    }
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(v, [...path, k]);
      }
    }
  };
  walk(obj, []);
  return out;
}
