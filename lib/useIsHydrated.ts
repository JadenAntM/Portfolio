"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards.
 *
 * For values that must not exist in the server-rendered HTML — the deobfuscated
 * email address being the case here. Expressed as an external store so the
 * client/server split is explicit and no setState-in-effect is needed.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
