// ---------------------------------------------------------------------------
// Dashboard-00 — loading/error/retry state for the dashboard's own data.
// Ties into the page-top progress bar via src/lib/progress-bus.ts.
// ---------------------------------------------------------------------------
import { useCallback, useEffect, useRef, useState } from "react";
import { beginTask } from "@/lib/progress-bus";
import { fetchDashboardData } from "./queries";
import type { DashboardData, FilterState } from "./select";

export type QueryState = {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
};

export function useDashboardData(filters: FilterState): QueryState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const runIdRef = useRef(0);

  const key = JSON.stringify(filters);

  useEffect(() => {
    const runId = ++runIdRef.current;
    const endTask = beginTask("dashboard-data");
    setLoading(true);
    setError(null);

    fetchDashboardData(JSON.parse(key) as FilterState)
      .then((next) => {
        if (runId !== runIdRef.current) return;
        setData(next);
      })
      .catch((e: unknown) => {
        if (runId !== runIdRef.current) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        endTask();
        if (runId === runIdRef.current) setLoading(false);
      });

    return endTask;
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { data, loading, error, retry };
}
