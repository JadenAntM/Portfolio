"use client";

import { ScrambleLink } from "@/components/ScrambleLink";
import { EMAIL_PARTS } from "@/data/profile";
import { useIsHydrated } from "@/lib/useIsHydrated";

/**
 * Assembles the mailto target on the client from the base64 halves in
 * `EMAIL_PARTS`, so the served HTML contains no address.
 *
 * The visible label is always the word "Email" rather than the address itself:
 * that keeps the address out of the DOM entirely and avoids the layout shift a
 * placeholder-then-address swap would cause. Without JavaScript this stays a
 * non-interactive label, which is the accepted cost of obfuscation — GitHub and
 * LinkedIn remain reachable either way.
 */
export function EmailLink() {
  const hydrated = useIsHydrated();

  const href = hydrated
    ? `mailto:${window.atob(EMAIL_PARTS.user)}@${window.atob(EMAIL_PARTS.domain)}`
    : null;

  return <ScrambleLink href={href} label="Email" />;
}
