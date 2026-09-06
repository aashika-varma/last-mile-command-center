// Loading + failure UI shared by every dashboard tab. Copy lives in ../config.ts
import { MESSAGES } from "../config";

export function LoadingState() {
  return (
    <div className="space-y-4" aria-busy="true">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {MESSAGES.loading}
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-border bg-card/50"
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-xl border border-signal/40 bg-signal/5 p-8 text-center"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-signal">ERR</p>
      <h3 className="mt-3 font-display text-xl font-bold tracking-tight">
        {MESSAGES.error.title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {MESSAGES.error.body}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {MESSAGES.error.retryLabel}
      </button>
      <details className="mt-5 text-left">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {MESSAGES.error.detailLabel}
        </summary>
        <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] text-muted-foreground">
          {error}
        </pre>
      </details>
    </div>
  );
}
