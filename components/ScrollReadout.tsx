"use client";

import { SECTIONS } from "@/data/sections";
import { useScrollStateValue } from "./ScrollStateProvider";

const TOTAL = String(SECTIONS.length).padStart(2, "0");

/**
 * Live instrumentation for the spec column: which section holds the reading
 * line, and how far through the document the viewport is. Both values are read
 * from real scroll state, not decoration.
 *
 * Marked aria-hidden — it duplicates information the nav already conveys with
 * aria-current, and a value that changes on every scroll frame would be noise
 * in a screen reader.
 */
export function ScrollReadout() {
  const { activeId, progress } = useScrollStateValue();

  const position = SECTIONS.findIndex((section) => section.id === activeId);
  const section = position < 0 ? "--" : String(position + 1).padStart(2, "0");
  const percent = (progress * 100).toFixed(1).padStart(4, "0");

  return (
    <dl aria-hidden className="mono text-mono-sm" data-scroll-readout>
      <div className="flex justify-between gap-4">
        <dt className="text-fg-tertiary">SECTION</dt>
        <dd className="text-fg">
          {section}
          <span className="text-fg-tertiary">/{TOTAL}</span>
        </dd>
      </div>
      <div className="mt-2 flex justify-between gap-4">
        <dt className="text-fg-tertiary">SCROLL</dt>
        <dd className="text-fg">
          {percent}
          <span className="text-fg-tertiary">%</span>
        </dd>
      </div>
    </dl>
  );
}
