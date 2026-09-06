// ---------------------------------------------------------------------------
// Global "work in progress" bus.
//
// Anything slow (a data fetch inside a tab, an export, a refresh) can register
// itself here, and the top-of-page progress bar will show while it runs.
//
//   const done = beginTask("dashboard");
//   try { await fetchThings() } finally { done() }
// ---------------------------------------------------------------------------

type Listener = (activeTasks: number) => void;

let active = 0;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l(active));
}

/** Register a long-running task. Call the returned function when it ends. */
export function beginTask(_label?: string): () => void {
  active += 1;
  emit();
  let ended = false;
  return () => {
    if (ended) return;
    ended = true;
    active = Math.max(0, active - 1);
    emit();
  };
}

export function subscribeTasks(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getActiveTasks() {
  return active;
}
