"use client";

import { useSyncExternalStore } from "react";

export const COMPACT_LAYOUT_QUERY =
  "(max-width: 767px), (max-width: 1024px) and (max-height: 500px) and (pointer: coarse)";

function subscribe(listener: () => void) {
  const media = window.matchMedia(COMPACT_LAYOUT_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

export function useCompactLayout(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COMPACT_LAYOUT_QUERY).matches,
    () => false,
  );
}
