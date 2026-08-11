import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function headingId(sectionId: string) {
  return `${sectionId}-heading`;
}

interface SectionProps {
  id: string;
  children: ReactNode;
  /** The first section owns the top edge of the sheet, so it takes no rule. */
  first?: boolean;
  className?: string;
}

/**
 * A section is not a card: it has no box, radius or shadow. It is delimited by
 * the full-bleed hairline on its top edge and by the fixed verticals its rows
 * span. See PLAN.md §3.
 *
 * Sections contain one or more `GridRow`s rather than laying out tracks
 * themselves, so a section like Case Studies can give every card its own
 * narrative/spec split instead of sharing one spec column.
 */
export function Section({ id, children, first = false, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId(id)}
      className={cn(!first && "section-rule", className)}
    >
      {children}
    </section>
  );
}

interface GridRowProps {
  main: ReactNode;
  /** Right-hand spec column. Falls below the narrative on mobile. */
  spec?: ReactNode;
  /** Hairline above this row, for rows that follow another within a section. */
  rule?: boolean;
  className?: string;
  mainClassName?: string;
}

export function GridRow({
  main,
  spec,
  rule = false,
  className,
  mainClassName,
}: GridRowProps) {
  return (
    <div className={cn("sheet-grid", rule && "section-rule", className)}>
      <div className={cn("track-main", mainClassName)}>{main}</div>
      {spec ? <aside className="track-spec">{spec}</aside> : null}
    </div>
  );
}

/** Sequential section marker. Numbered only because sections are ordered. */
export function SectionMarker({ index }: { index: string }) {
  return <p className="mono mb-6 text-label text-fg-tertiary">{index}</p>;
}
