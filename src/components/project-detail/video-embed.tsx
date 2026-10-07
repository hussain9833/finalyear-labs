"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.pathname.slice(1))}?autoplay=1&rel=0`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${encodeURIComponent(u.pathname.split("/").pop() ?? "")}?autoplay=1`;
  } catch {
    /* invalid */
  }
  return null;
}

/** Click-to-load facade: no third-party iframe cost until the user asks for the video. */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [active, setActive] = useState(false);
  const embed = toEmbed(url);
  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
        <PlayCircle className="size-5" aria-hidden /> Watch the walkthrough
      </a>
    );
  }
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
      {active ? (
        <iframe src={embed} title={title} className="absolute inset-0 size-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary/15 to-brand-2/15" aria-label={`Play video: ${title}`}>
          <PlayCircle className="size-16 text-primary drop-shadow" aria-hidden />
        </button>
      )}
    </div>
  );
}
