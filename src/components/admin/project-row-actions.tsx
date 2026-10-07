"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2 } from "lucide-react";
import { deleteProject, setProjectFlags } from "@/app/admin/(panel)/projects/actions";

export function ProjectRowActions({
  id,
  slug,
  status,
  featured,
  canPublish,
  canDelete,
}: {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  canPublish: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const res = await fn();
      if (res.ok) {
        toast.success(res.message ?? "Done");
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });

  const btn = "inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Working" />}
      <Link href={`/admin/projects/${id}`} className={btn}>
        Edit
      </Link>
      {status === "published" && (
        <a href={`/projects/${slug}`} target="_blank" rel="noopener" className={btn} aria-label="View on site">
          <ExternalLink className="size-3.5" />
        </a>
      )}
      {canPublish && (
        <>
          <button type="button" disabled={pending} className={btn} onClick={() => run(() => setProjectFlags(id, { status: status === "published" ? "draft" : "published" }))}>
            {status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button type="button" disabled={pending} className={btn} aria-pressed={featured} onClick={() => run(() => setProjectFlags(id, { featured: !featured }))}>
            {featured ? "Unfeature" : "Feature"}
          </button>
          {status !== "archived" && (
            <button type="button" disabled={pending} className={btn} onClick={() => run(() => setProjectFlags(id, { status: "archived" }))}>
              Archive
            </button>
          )}
        </>
      )}
      {canDelete && status === "archived" && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} text-destructive`}
          onClick={() => {
            if (confirm("Permanently delete this project? This cannot be undone.")) run(() => deleteProject(id));
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
