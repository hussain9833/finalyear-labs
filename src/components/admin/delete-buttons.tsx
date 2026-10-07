"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory, deleteDegree } from "@/app/admin/(panel)/taxonomy-actions";

type Result = { ok: true; message?: string } | { ok: false; error: string };

export function ConfirmDeleteButton({ action, redirectTo, label = "Delete", confirmText }: { action: () => Promise<Result>; redirectTo: string; label?: string; confirmText: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmText)) return;
        start(async () => {
          const res = await action();
          if (res.ok) {
            toast.success(res.message ?? "Deleted");
            router.replace(redirectTo);
          } else toast.error(res.error);
        });
      }}
      className="inline-flex h-10 items-center rounded-xl border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  return <ConfirmDeleteButton action={() => deleteCategory(id)} redirectTo="/admin/categories" confirmText="Delete this category? Projects must not use it." />;
}

export function DeleteDegreeButton({ id }: { id: string }) {
  return <ConfirmDeleteButton action={() => deleteDegree(id)} redirectTo="/admin/degrees" confirmText="Delete this degree? Projects must not use it." />;
}
