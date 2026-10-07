"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";
import { compareStore } from "@/lib/compare-store";

/**
 * - With no slugs in the URL, restores the device's saved selection into the URL.
 * - With slugs, records a `project_compare` event once.
 */
export function CompareSync({ slugs, track = false }: { slugs: string[]; track?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (slugs.length === 0) {
      const saved = compareStore.get();
      if (saved.length >= 2) router.replace(`/compare?p=${saved.map((s) => s.slug).join(",")}`);
      return;
    }
    if (track) trackEvent("project_compare", { projectSlugs: slugs });
  }, [slugs, track, router]);
  return null;
}
