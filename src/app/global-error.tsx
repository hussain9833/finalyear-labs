"use client";

import "./globals.css";
import { ErrorState } from "@/components/error-state";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <ErrorState reset={reset} digest={error.digest} />
      </body>
    </html>
  );
}
