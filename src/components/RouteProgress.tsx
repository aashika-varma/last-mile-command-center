import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { subscribeTasks } from "@/lib/progress-bus";

/**
 * Top-of-page navigation progress bar.
 *
 * Behavior:
 * - Starts animating as soon as a route transition begins (link click).
 * - Eases quickly toward ~84% and holds while the next route loads.
 * - When the route commits, snaps to 100%, shows a brief completion
 *   state, then fades out.
 * - Enforces a minimum visible time so even instant client navigations
 *   give the user a clear "loading" signal.
 * - Also reflects in-page work registered through `beginTask()` in
 *   src/lib/progress-bus.ts (e.g. slow dashboard tab queries), so a fetch
 *   that takes a few seconds shows the same bar.
 */

const RAMP_MS = 650; // time to ease 0 -> 84%
const HOLD_TARGET = 84; // % while waiting for the route to resolve
const DONE_MS = 380; // how long the 100% state stays visible

export function RouteProgress() {
  const { status, pathname } = useRouterState({
    select: (s) => ({ status: s.status, pathname: s.location.pathname }),
  });

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const animatingRef = useRef(false);
  const startAtRef = useRef(0);
  const rafRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const prevPathRef = useRef<string | null>(null);
  const statusRef = useRef(status);
  const tasksRef = useRef(0);
  statusRef.current = status;

  const clearTimers = () => {
    cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const start = () => {
    clearTimers();
    animatingRef.current = true;
    startAtRef.current = performance.now();
    setVisible(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAtRef.current) / RAMP_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * HOLD_TARGET));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const finish = () => {
    if (tasksRef.current > 0) return; // still loading data in the page
    cancelAnimationFrame(rafRef.current);
    const elapsed = performance.now() - startAtRef.current;
    // Keep the bar perceivable even when navigation is instant.
    const wait = Math.max(0, RAMP_MS - elapsed);
    timersRef.current.push(
      window.setTimeout(() => {
        setProgress(100);
        timersRef.current.push(
          window.setTimeout(() => {
            setVisible(false);
            setProgress(0);
            animatingRef.current = false;
          }, DONE_MS),
        );
      }, wait),
    );
  };

  // Transition begins (router reports pending before the route commits).
  useEffect(() => {
    if (status === "pending" && !animatingRef.current) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Route committed: complete the bar. Also covers navigations that never
  // surfaced a "pending" tick (instant client transitions).
  useEffect(() => {
    const changed = prevPathRef.current !== null && prevPathRef.current !== pathname;
    prevPathRef.current = pathname;
    if (!changed) return;
    if (!animatingRef.current) start();
    if (status === "idle") finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, status]);

  // In-page work (dashboard tab queries, exports, refreshes).
  useEffect(() => {
    return subscribeTasks((n) => {
      tasksRef.current = n;
      if (n > 0) {
        if (!animatingRef.current) start();
      } else if (animatingRef.current && statusRef.current !== "pending") {
        finish();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => clearTimers, []);

  if (!visible && progress === 0) return null;

  return (
    <div className="route-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="route-progress-bar"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
      <span
        className="route-progress-label font-mono"
        style={{ opacity: visible && progress < 100 ? 1 : 0 }}
      >
        NAV {String(progress).padStart(2, "0")}%
      </span>
    </div>
  );
}
