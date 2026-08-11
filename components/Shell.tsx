import type { ReactNode } from "react";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollStateProvider } from "./ScrollStateProvider";

/**
 * Structural grid shell — PLAN.md §3.
 *
 * Three tracks past lg: rail (88px) / main (1fr) / spec (280px). The two
 * vertical hairlines are drawn by a viewport-fixed overlay rather than by
 * borders on section elements, which is what makes them continuous for the
 * whole document height instead of restarting at every section boundary.
 * Horizontal section rules are ordinary borders on the sections, so they cross
 * the fixed verticals and produce visible intersections.
 *
 * The overlay, the rail wrapper and every section share the single
 * `.sheet-grid` template, so the rules cannot drift out of alignment with the
 * tracks they are supposed to delimit.
 */

function GridRules() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="sheet rules-sheet h-full">
        <div className="sheet-grid rules-grid">
          <div className="rule-rail" />
          <div className="rule-spec" />
        </div>
      </div>
    </div>
  );
}

/**
 * Positions rail content over track 1 by reusing the sheet template, so it
 * stays glued to the rail hairline at every width without duplicating the
 * track math. Below lg the rail is not a column at all — the consumer (Nav,
 * PROMPT 3) renders its own strip/bar and this wrapper stays out of the way.
 */
function RailSlot({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
      <div className="sheet h-full">
        <div className="sheet-grid rules-grid">
          <div className="pointer-events-auto h-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ShellProps {
  children: ReactNode;
  /** Desktop left-rail content. Wired to Nav in PROMPT 3. */
  rail?: ReactNode;
  /** Fixed chrome that owns its own positioning, e.g. the mobile nav bar. */
  chrome?: ReactNode;
}

export function Shell({ children, rail, chrome }: ShellProps) {
  return (
    <ScrollStateProvider>
      <div className="relative min-h-dvh">
        <ScrollProgress />
        <GridRules />
        {rail ? <RailSlot>{rail}</RailSlot> : null}
        <div className="sheet page-pad relative z-10">{children}</div>
        {chrome}
      </div>
    </ScrollStateProvider>
  );
}
