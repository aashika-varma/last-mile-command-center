type AppErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Reports an error caught by a React error boundary (or elsewhere in the app).
 *
 * This currently just logs to the console with structured context. Wire this
 * up to your error-monitoring provider of choice (Sentry, Bugsnag, etc.) by
 * replacing the body below.
 */
export function reportAppError(
  error: unknown,
  context: Record<string, unknown> = {},
  options: AppErrorOptions = {},
) {
  if (typeof window === "undefined") return;

  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[app-error]", message, {
    route: window.location.pathname,
    stack,
    ...context,
    mechanism: options.mechanism ?? "react_error_boundary",
    handled: options.handled ?? false,
    severity: options.severity ?? "error",
  });
}
