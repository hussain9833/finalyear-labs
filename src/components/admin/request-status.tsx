"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { setRequestStatus } from "@/app/admin/(panel)/crm-actions";
import { REQUEST_STATUSES } from "@/lib/constants";

export function RequestStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm font-semibold">Request status</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Request status">
        {REQUEST_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={status === s}
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await setRequestStatus(id, s);
                if (res.ok) {
                  toast.success("Status updated");
                  router.refresh();
                } else toast.error(res.error);
              })
            }
            className={`h-9 rounded-full border px-4 text-sm font-medium capitalize ${status === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
