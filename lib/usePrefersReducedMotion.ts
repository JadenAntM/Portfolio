"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * The server snapshot is `true`, so the first paint is always the
 * reduced-motion variant. A user who prefers reduced motion therefore never
 * sees a frame of movement; the opposite default would flash the animated state
 * before correcting itself.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
