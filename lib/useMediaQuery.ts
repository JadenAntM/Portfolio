"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * `useSyncExternalStore` rather than useState + useEffect: matchMedia is an
 * external store, and subscribing to it this way avoids a setState during the
 * effect body.
 *
 * `serverValue` is the snapshot used on the server and for the first paint, so
 * every caller has to choose which side of the query is the safe default rather
 * than inheriting `false` by accident.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
