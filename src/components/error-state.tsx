"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export function ErrorState({ reset, digest, title = "Something went wrong" }: { reset?: () => void; digest?: string; title?: string }) {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center" role="alert">
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This is on our side, not yours. Please try again — if it keeps happening, contact us and mention the reference below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {reset && (
          <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">
            <RotateCcw className="size-4" aria-hidden /> Try again
          </button>
        )}
        <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-medium hover:bg-muted">
          Go home
        </Link>
      </div>
      {digest && <p className="mt-6 font-mono text-xs text-muted-foreground">Reference: {digest}</p>}
    </div>
  );
}
