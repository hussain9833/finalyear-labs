"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function FinderTracker({ degree, category, results }: { degree?: string; category?: string; results: number }) {
  useEffect(() => {
    trackEvent("finder_submit", {
      degree: degree && /^[a-z0-9-]+$/.test(degree) ? degree : undefined,
      category: category && /^[a-z0-9-]+$/.test(category) ? category : undefined,
      results,
    });
  }, [degree, category, results]);
  return null;
}
