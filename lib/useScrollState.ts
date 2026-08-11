"use client";

import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

export interface ScrollState {
  /** Section currently owning the reading line, or null before measurement. */
  activeId: string | null;
  /** 0–1 fraction of total scrollable distance. */
  progress: number;
}

/**
 * A reading line sits at 35% of viewport height; the active section is the
 * last one whose top edge has passed it.
 *
 * This replaced an IntersectionObserver band, which had two failure modes with
 * real section heights: the second section became active while the page was
 * still at scroll 0, and the final section could never activate at all because
 * a short last section never reaches the middle of the viewport. Deriving the
 * value from scroll position makes both ends exact — the bottom of the document
 * is special-cased to the last section.
 *
 * One rAF-throttled listener serves both the nav and the live scroll readout.
 */
const LINE_RATIO = 0.35;

export function useScrollState(ids: readonly string[]): ScrollState {
  const { scrollY: smoothScrollY } = useSmoothScroll();
  const [state, setState] = useState<ScrollState>({
    activeId: ids[0] ?? null,
    progress: 0,
  });
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key.split(",").filter(Boolean);
    let frame = 0;

    const measure = () => {
      frame = 0;

      const scrollY = smoothScrollY.get();
      const viewport = window.innerHeight;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - viewport,
        0,
      );
      const progress =
        maxScroll === 0 ? 0 : Math.min(Math.max(scrollY / maxScroll, 0), 1);

      let activeId: string | null = sectionIds[0] ?? null;

      if (maxScroll > 0 && scrollY >= maxScroll - 2) {
        activeId = sectionIds[sectionIds.length - 1] ?? null;
      } else {
        const line = viewport * LINE_RATIO;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) activeId = id;
        }
      }

      setState((prev) =>
        prev.activeId === activeId &&
        Math.abs(prev.progress - progress) < 0.0005
          ? prev
          : { activeId, progress },
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    const unsubscribe = smoothScrollY.on("change", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key, smoothScrollY]);

  return state;
}
