"use client";

import { useState } from "react";
import { SocialIcon } from "@/components/SocialIcon";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScramble } from "@/lib/useScramble";

interface ScrambleLinkProps {
  /** Null renders a non-interactive span — used before the email is assembled. */
  href: string | null;
  label: string;
  external?: boolean;
  className?: string;
  icon?: string;
}

/**
 * Contact link with the text-scramble hover state.
 *
 * Triggered by focus as well as hover, so keyboard users get the same feedback
 * as pointer users. The scrambling glyphs are aria-hidden and the real label is
 * kept as screen-reader text, so assistive technology never reads the
 * intermediate gibberish.
 */
export function ScrambleLink({
  href,
  label,
  external = false,
  className,
  icon,
}: ScrambleLinkProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const display = useScramble(label, active, !prefersReduced);

  const classes = cn(
    "group mono inline-flex items-center gap-3 text-mono-sm uppercase transition-[color] duration-150",
    href ? "text-fg hover:text-accent" : "text-fg-tertiary",
    className,
  );

  const content = (
    <>
      {icon ? <SocialIcon src={icon} /> : null}
      <span className="sr-only">{label}</span>
      {/* Tabular figures keep the width stable while glyphs cycle. */}
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
      <span
        aria-hidden
        className="text-fg-tertiary transition-[transform,color] duration-150 group-hover:translate-x-[3px] group-hover:text-accent"
      >
        →
      </span>
    </>
  );

  if (!href) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={classes}
    >
      {content}
    </a>
  );
}
