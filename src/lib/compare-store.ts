"use client";

import { useSyncExternalStore } from "react";

/** Per-device compare selection (max 3), persisted in localStorage. */
export type CompareItem = { slug: string; name: string };

const KEY = "fyl_compare";
export const COMPARE_MAX = 3;

let items: CompareItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((x) => x && typeof x.slug === "string" && typeof x.name === "string")
        .slice(0, COMPARE_MAX);
    }
  } catch {
    items = [];
  }
}

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export const compareStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        hydrated = false;
        load();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  get: () => {
    load();
    return items;
  },
  toggle(item: CompareItem): "added" | "removed" | "full" {
    load();
    if (items.some((i) => i.slug === item.slug)) {
      items = items.filter((i) => i.slug !== item.slug);
      emit();
      return "removed";
    }
    if (items.length >= COMPARE_MAX) return "full";
    items = [...items, item];
    emit();
    return "added";
  },
  remove(slug: string) {
    items = items.filter((i) => i.slug !== slug);
    emit();
  },
  clear() {
    items = [];
    emit();
  },
};

const EMPTY: CompareItem[] = [];

export function useCompare() {
  return useSyncExternalStore(compareStore.subscribe, compareStore.get, () => EMPTY);
}
