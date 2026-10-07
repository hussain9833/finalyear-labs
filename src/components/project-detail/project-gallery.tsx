"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProjectCover } from "@/components/projects/project-cover";
import { cn } from "@/lib/utils";
import type { Image as Img, ProjectSummary } from "@/lib/types";

/** Thumbnail + screenshots, swipeable strip on mobile, keyboard-accessible lightbox. */
export function ProjectGallery({
  name,
  cover,
  screenshots,
}: {
  name: string;
  cover: Pick<ProjectSummary, "name" | "thumbnail" | "category" | "technologies" | "isAI">;
  screenshots: Img[];
}) {
  const images: Img[] = [...(cover.thumbnail ? [cover.thumbnail] : []), ...screenshots];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="group overflow-hidden rounded-2xl border border-border">
        <ProjectCover project={cover} priority sizes="(min-width: 1024px) 760px, 100vw" />
      </div>
    );
  }

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);
  const current = images[index]!;

  return (
    <>
      <button
        type="button"
        onClick={() => show(0)}
        className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-muted"
        aria-label={`Open ${name} gallery`}
      >
        <div className="relative aspect-[16/10]">
          <Image src={images[0]!.url} alt={images[0]!.alt || `${name} screenshot`} fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
        </div>
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur">
          <Expand className="size-3.5" aria-hidden /> {images.length} image{images.length === 1 ? "" : "s"}
        </span>
      </button>

      {images.length > 1 && (
        <ul className="mt-3 flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-none" aria-label="Screenshots">
          {images.map((img, i) => (
            <li key={img.url + i} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => show(i)}
                className="relative block h-20 w-32 overflow-hidden rounded-xl border border-border bg-muted transition-opacity hover:opacity-90 sm:h-24 sm:w-40"
                aria-label={`View ${img.alt || `screenshot ${i + 1}`}`}
              >
                <Image src={img.url} alt="" fill sizes="160px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[calc(100%-1rem)] max-w-5xl gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-5xl"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <DialogTitle className="sr-only">{name} screenshots</DialogTitle>
          <div className="relative aspect-[16/10] bg-black">
            <Image src={current.url} alt={current.alt || `${name} screenshot ${index + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-3 p-3">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              {current.caption || current.alt} <span className="tabular-nums">({index + 1}/{images.length})</span>
            </p>
            {images.length > 1 && (
              <div className="flex gap-2">
                {[
                  { d: -1, Icon: ChevronLeft, label: "Previous image" },
                  { d: 1, Icon: ChevronRight, label: "Next image" },
                ].map(({ d, Icon, label }) => (
                  <button key={d} type="button" onClick={() => step(d)} className={cn("grid size-10 place-items-center rounded-xl border border-border hover:bg-muted")} aria-label={label}>
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
