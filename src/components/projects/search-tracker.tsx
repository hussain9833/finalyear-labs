"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

/** Records a `search` event once per distinct query on the listing page. */
export function SearchTracker({ query, results }: { query?: string; results: number }) {
  useEffect(() => {
    if (!query) return;
    const key = `fyl_s:${query.toLowerCase()}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
    trackEvent("search", { query: query.slice(0, 120), results });
  }, [query, results]);
  return null;
}
