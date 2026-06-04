"use client";

import { useEffect } from "react";
import { tryRefreshSession } from "@/lib/api/bff-client";

export function SessionKeeper({
  refreshIntervalMs,
}: {
  refreshIntervalMs: number;
}) {
  useEffect(() => {
    const refresh = () => {
      void tryRefreshSession();
    };

    const interval = setInterval(refresh, refreshIntervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
