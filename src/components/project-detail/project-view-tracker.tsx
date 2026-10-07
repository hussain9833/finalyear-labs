"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function ProjectViewTracker({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    trackEvent("project_view", { projectSlug: slug, category });
  }, [slug, category]);
  return null;
}
