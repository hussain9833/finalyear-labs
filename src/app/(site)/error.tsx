"use client";

import { ErrorState } from "@/components/error-state";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState reset={reset} digest={error.digest} />;
}
