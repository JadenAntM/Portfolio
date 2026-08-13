import type { ReactNode } from "react";
import { SocialIcon } from "@/components/SocialIcon";
import { cn } from "@/lib/cn";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  download?: boolean;
  className?: string;
  icon?: string;
  tabIndex?: number;
  /** Glyph override — the resume CTA uses a download arrow instead. */
  glyph?: string;
}

/**
 * The site's one link treatment: an ASCII arrow that translates 3px and picks
 * up the accent on hover. Text stays underline-free; the glyph carries the
 * affordance. Focus is handled by the global :focus-visible outline.
 */
export function ArrowLink({
  href,
  children,
  external = false,
  download = false,
  className,
  icon,
  tabIndex,
  glyph = "→",
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      tabIndex={tabIndex}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group mono inline-flex items-center gap-2 text-mono-sm text-fg-secondary transition-[color] duration-150 hover:text-fg",
        className,
      )}
    >
      {icon ? <SocialIcon src={icon} /> : null}
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block text-fg-tertiary transition-[transform,color] duration-150 group-hover:translate-x-[3px] group-hover:text-accent"
      >
        {glyph}
      </span>
    </a>
  );
}
