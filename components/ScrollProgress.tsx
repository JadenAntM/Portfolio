"use client";

import { motion } from "framer-motion";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

/** A single-pixel instrument line: visible enough to orient, never a banner. */
export function ScrollProgress() {
  const { scrollProgress } = useSmoothScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-40 w-px bg-border"
    >
      <motion.div
        data-scroll-progress
        className="h-full w-full origin-top bg-accent"
        style={{ scaleY: scrollProgress }}
      />
    </div>
  );
}
