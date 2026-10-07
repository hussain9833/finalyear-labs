"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";
import type { EventName, EventProps } from "@/lib/analytics/events";

/** External link (e.g. live demo) that records an analytics event on click. */
export function TrackedExternalLink<N extends EventName>({
  href,
  event,
  props,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  event: N;
  props: EventProps<N>;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel} onClick={() => trackEvent(event, props)}>
      {children}
    </a>
  );
}

/** Internal link that records an analytics event (degree/category selection, CTAs). */
export function TrackedLink<N extends EventName>({
  href,
  event,
  props,
  className,
  children,
  prefetch,
}: {
  href: string;
  event: N;
  props: EventProps<N>;
  className?: string;
  children: React.ReactNode;
  prefetch?: boolean;
}) {
  return (
    <Link href={href} prefetch={prefetch} className={className} onClick={() => trackEvent(event, props)}>
      {children}
    </Link>
  );
}
