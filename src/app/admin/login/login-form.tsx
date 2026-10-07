"use client";

import { use, useActionState } from "react";
import { Loader2 } from "lucide-react";
import { TextField } from "@/components/forms/field";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ nextPromise }: { nextPromise: Promise<string | undefined> }) {
  const next = use(nextPromise);
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {state.error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <input type="hidden" name="next" value={next ?? ""} />
      <TextField name="email" label="Email" type="email" autoComplete="username" required defaultValue={state.email} autoFocus />
      <TextField name="password" label="Password" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={pending} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground disabled:opacity-70">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Sign in
      </button>
    </form>
  );
}
