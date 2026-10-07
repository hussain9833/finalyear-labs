"use client";
/**
 * The only client module that talks to analytics backends (first-party beacon + optional GA4).
 * Components call `trackEvent(name, props)`; nothing else knows about endpoints or gtag.
 */
import type { EventName, EventProps } from "./events";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent<N extends EventName>(name: N, props: EventProps<N>) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ name, props, path: window.location.pathname });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/events", blob)) {
      void fetch("/api/events", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    // analytics must never break the UI
  }
  try {
    window.gtag?.("event", name, props);
  } catch {
    /* noop */
  }
}

/** GA4-only mirror for events recorded server-side (e.g. WhatsApp clicks via /api/wa). */
export function mirrorToGA(name: string, props: Record<string, unknown>) {
  try {
    window.gtag?.("event", name, props);
  } catch {
    /* noop */
  }
}
