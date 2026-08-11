import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SpecBlockProps {
  label: string;
  children: ReactNode;
  /** Blocks are hairline-separated; the first in a column takes no rule. */
  first?: boolean;
  className?: string;
}

/** The repeated unit of the right-hand spec column. PLAN.md §3. */
export function SpecBlock({
  label,
  children,
  first = false,
  className,
}: SpecBlockProps) {
  return (
    <div
      className={cn(
        !first && "mt-6 border-t border-border pt-6",
        first && "pt-0",
        className,
      )}
    >
      {/* A field label, not a heading — keeping it out of the heading
          hierarchy avoids an h2/h3 skip inside the hero. */}
      <p className="mono text-label text-fg-tertiary uppercase">{label}</p>
      <div className="mono mt-3 text-mono-sm text-fg-secondary">{children}</div>
    </div>
  );
}
