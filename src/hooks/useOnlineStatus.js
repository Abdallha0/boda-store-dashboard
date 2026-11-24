import { useState, useEffect, useCallback, useRef } from "react";

// Vite: client-side env vars must be prefixed with VITE_
const SERVER_URL =
  import.meta.env.VITE_SERVER || "https://boda-api-am.vercel.app";

const PING_TIMEOUT_MS = 8000; // slow networks / cold starts must not read as offline
const ONLINE_POLL_MS = 30000; // slow poll while online
const OFFLINE_POLL_MS = 4000; // fast poll while offline, to detect recovery
const FAILURES_BEFORE_OFFLINE = 2; // one failed ping is not enough

/**
 * Pings the server to verify real connectivity.
 * Returns true if reachable, false otherwise.
 * Any resolved response (even 404/500) counts as reachable.
 * Requires the API to allow this origin via CORS, and (if using helmet)
 * crossOriginResourcePolicy: { policy: "cross-origin" }.
 */
export async function pingConnection(externalSignal) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return false;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    await fetch(`${SERVER_URL}/?_ping=${Date.now()}`, {
      method: "HEAD",
      mode: "cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  const isOnlineRef = useRef(isOnline);
  const failuresRef = useRef(0);
  const seqRef = useRef(0); // invalidates stale ping results
  const controllerRef = useRef(null);
  const timerRef = useRef(null);

  const applyStatus = useCallback((value) => {
    isOnlineRef.current = value;
    setIsOnline((prev) => (prev === value ? prev : value));
  }, []);

  const verifyStatus = useCallback(async () => {
    // A newer check supersedes any in-flight one.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const seq = ++seqRef.current;

    const reachable = await pingConnection(controller.signal);

    if (seq !== seqRef.current) return; // stale result
    if (controller.signal.aborted) return; // cancelled (tab hidden / unmount), not a failure

    if (reachable) {
      failuresRef.current = 0;
      applyStatus(true);
    } else {
      failuresRef.current += 1;
      const browserOffline =
        typeof navigator !== "undefined" && !navigator.onLine;
      if (browserOffline || failuresRef.current >= FAILURES_BEFORE_OFFLINE) {
        applyStatus(false);
      }
    }
  }, [applyStatus]);

  useEffect(() => {
    let cancelled = false;

    const clearTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const schedule = () => {
      clearTimer();
      if (cancelled || document.hidden) return;
      timerRef.current = setTimeout(
        async () => {
          await verifyStatus();
          schedule();
        },
        isOnlineRef.current ? ONLINE_POLL_MS : OFFLINE_POLL_MS,
      );
    };

    const checkNow = async () => {
      await verifyStatus();
      schedule();
    };

    // The browser's own offline event is trusted: flip immediately.
    const handleBrowserOffline = () => {
      seqRef.current++;
      controllerRef.current?.abort();
      failuresRef.current = FAILURES_BEFORE_OFFLINE;
      applyStatus(false);
      schedule();
    };

    // App-level events are only HINTS. They trigger a real ping and never
    // set the status directly, so a noisy interceptor cannot cause flapping.
    const handleHint = () => {
      checkNow();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimer();
        controllerRef.current?.abort();
      } else {
        checkNow();
      }
    };

    checkNow();

    window.addEventListener("online", handleHint);
    window.addEventListener("offline", handleBrowserOffline);
    window.addEventListener("app:offline", handleHint);
    window.addEventListener("app:online", handleHint);
    window.addEventListener("focus", handleHint);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      clearTimer();
      controllerRef.current?.abort();
      window.removeEventListener("online", handleHint);
      window.removeEventListener("offline", handleBrowserOffline);
      window.removeEventListener("app:offline", handleHint);
      window.removeEventListener("app:online", handleHint);
      window.removeEventListener("focus", handleHint);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [verifyStatus, applyStatus]);

  return isOnline;
}

export default useOnlineStatus;