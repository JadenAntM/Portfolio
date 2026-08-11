"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface HeadingRevealProps {
  id: string;
  children: ReactNode;
}

/**
 * A compact drafting-mask reveal. The neutral panel keeps the palette quiet;
 * its 1px accent edge is the only color in the gesture.
 */
export function HeadingReveal({ id, children }: HeadingRevealProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div className="relative w-fit overflow-hidden pb-1">
      <h2 id={id} className="text-h2 text-fg">
        {children}
      </h2>
      {prefersReduced ? null : (
        <motion.span
          aria-hidden
          data-heading-mask
          initial={{ x: "0%" }}
          whileInView={{ x: "102%" }}
          viewport={{ once: true, amount: 0.72 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 border-l border-accent bg-bg"
        />
      )}
    </div>
  );
}
