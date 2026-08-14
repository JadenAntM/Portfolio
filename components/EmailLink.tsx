"use client";

import { useEffect, useState } from "react";
import { ScrambleLink } from "@/components/ScrambleLink";
import { EMAIL_PARTS } from "@/data/profile";
import { useIsHydrated } from "@/lib/useIsHydrated";

/**
 * Assembles the mailto target on the client from the base64 halves in
 * `EMAIL_PARTS`, so the served HTML contains no address.
 *
 * The visible label stays compact while a dedicated control copies the full
 * address. Without JavaScript both controls stay inert; GitHub and LinkedIn
 * remain reachable as fallbacks.
 */
export function EmailLink() {
  const hydrated = useIsHydrated();
  const [copied, setCopied] = useState(false);

  const email = hydrated
    ? `${window.atob(EMAIL_PARTS.user)}@${window.atob(EMAIL_PARTS.domain)}`
    : null;

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyEmail = async () => {
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }

    setCopied(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <ScrambleLink href={email ? `mailto:${email}` : null} label="Email" />
      <button
        type="button"
        onClick={copyEmail}
        disabled={!email}
        className="mono rounded-sm border border-border px-3 py-2 text-micro uppercase text-fg-tertiary transition-[border-color,color] hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Copy email address"
      >
        {copied ? "Copied" : "Copy address"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
