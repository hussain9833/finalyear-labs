"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createAdminUser, updateAdminUser } from "@/app/admin/(panel)/users/actions";
import { ADMIN_ROLES, type AdminRole } from "@/lib/constants";
import { FormSection, Select, Text } from "./form-kit";
import { StatusPill } from "./ui";

type U = { id: string; email: string; name: string; role: AdminRole; active: boolean; lastLoginAt: string };

export function UsersManager({ users, meId }: { users: U[]; meId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [v, setV] = useState({ email: "", name: "", role: "editor" as AdminRole, password: "" });

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>, after?: () => void) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        toast.success(r.message ?? "Done");
        after?.();
        router.refresh();
      } else toast.error(r.error ?? "Failed");
    });

  return (
    <div className="grid gap-6">
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {users.map((u) => (
          <li key={u.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-medium">
                {u.name || u.email} {!u.active && <StatusPill tone="red">deactivated</StatusPill>} {u.id === meId && <StatusPill tone="blue">you</StatusPill>}
              </p>
              <p className="text-xs text-muted-foreground">
                {u.email} · last login {u.lastLoginAt}
              </p>
            </div>
            <label className="sr-only" htmlFor={`role-${u.id}`}>Role for {u.email}</label>
            <select
              id={`role-${u.id}`}
              value={u.role}
              disabled={u.id === meId || pending}
              onChange={(e) => run(() => updateAdminUser(u.id, { role: e.target.value }))}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm capitalize"
            >
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={u.id === meId || pending}
              onClick={() => run(() => updateAdminUser(u.id, { active: !u.active }))}
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted disabled:opacity-40"
            >
              {u.active ? "Deactivate" : "Reactivate"}
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => createAdminUser(JSON.stringify(v)), () => setV({ email: "", name: "", role: "editor", password: "" }));
        }}
      >
        <FormSection title="Add admin user">
          <div className="grid gap-4 md:grid-cols-2">
            <Text id="u-email" label="Email" type="email" value={v.email} onChange={(email) => setV((s) => ({ ...s, email }))} />
            <Text id="u-name" label="Name" value={v.name} onChange={(name) => setV((s) => ({ ...s, name }))} />
            <Select id="u-role" label="Role" value={v.role} options={ADMIN_ROLES.map((r) => ({ value: r, label: r }))} onChange={(role) => setV((s) => ({ ...s, role }))} />
            <Text id="u-pass" label="Initial password (8+ characters)" type="password" value={v.password} onChange={(password) => setV((s) => ({ ...s, password }))} />
          </div>
          <button type="submit" disabled={pending} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Create user
          </button>
        </FormSection>
      </form>
    </div>
  );
}
