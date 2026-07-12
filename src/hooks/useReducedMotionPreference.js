"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getMediaQuery() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY);
}

function subscribe(onStoreChange) {
  const mediaQuery = getMediaQuery();
  if (!mediaQuery) return () => {};

  mediaQuery.addEventListener?.("change", onStoreChange);
  return () => mediaQuery.removeEventListener?.("change", onStoreChange);
}

function getSnapshot() {
  return getMediaQuery()?.matches ?? false;
}

export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export { REDUCED_MOTION_QUERY };
