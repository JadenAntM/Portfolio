"use client";

import {
  type MotionValue,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLenisTargetProgress } from "@/components/SmoothScrollProvider";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Hero marquee — three full-bleed rows of display type that cross the sheet's
 * vertical hairlines. This is the site's signature moment (PLAN.md §4).
 *
 * Three implementation decisions worth keeping:
 *
 *  1. Speed is px/sec, not a duration. A CSS `translateX(-50%)` keyframe would
 *     be shorter, but its speed depends on content width, so the title row
 *     ("SOFTWARE ENGINEER") and a six-item skill row would visibly travel at
 *     different rates. Measuring one group and integrating px/sec in
 *     `useAnimationFrame` keeps the three rows on a deliberate speed ladder.
 *
 *  2. The copy count is derived, not hardcoded. Two copies only guarantee a
 *     seamless loop when one group is already wider than the viewport; at 1440px
 *     with a short row it is not. `copies` is recomputed from the measured group
 *     so the wrap can never expose a gap.
 *
 *  3. The rows are `aria-hidden` with an `sr-only` summary alongside. Repeated
 *     display type is a visual device; announcing "Software Engineer" six times
 *     is noise, and the underlying facts must not live only inside animation.
 */

/** px/sec. Deliberately close together — parallax, not a race. */
const ROW_SPEEDS = [26, 34, 20] as const;

/** Scroll-linked exit: how far each row is pushed on its own axis, in px. */
const EXIT_DRIFT = [90, -70, 110] as const;

/** Vertical convergence on exit: outer rows close on the middle one. */
const EXIT_CONVERGE = [26, 0, -26] as const;

/**
 * Fraction of the exit range held at rest before anything moves. Without it the
 * band starts dimming a few dozen px into the page, so the first thing a
 * visitor does to the marquee is wash it out. The transition belongs at the
 * boundary, not spread across the whole hero.
 */
const EXIT_HOLD = 0.45;

const ROW_TONES = ["text-fg", "text-fg-secondary", "text-fg-tertiary"] as const;

interface HeroMarqueeProps {
  /** Row 1. */
  title: string;
  /** Rows 2 and 3, in order. */
  skills: readonly [readonly string[], readonly string[]];
}

export function HeroMarquee({ title, skills }: HeroMarqueeProps) {
  const prefersReduced = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  // 0 while the band is fully in view, 1 once its bottom edge has reached the
  // top of the viewport — i.e. the hero's exit, driven by scroll position
  // rather than by a reveal trigger.
  const scrollYProgress = useLenisTargetProgress(bandRef, "hero-exit");

  const bandOpacity = useTransform(
    scrollYProgress,
    [0, EXIT_HOLD, 1],
    [1, 1, 0.12],
  );
  const bandScale = useTransform(
    scrollYProgress,
    [0, EXIT_HOLD, 1],
    [1, 1, 0.94],
  );

  const rows = [[title], skills[0], skills[1]] as const;

  return (
    <div ref={bandRef} className="border-t border-border py-4 sm:py-10">
      <span className="sr-only">
        {title}. Stack: {[...skills[0], ...skills[1]].join(", ")}.
      </span>

      <motion.div
        aria-hidden
        style={
          prefersReduced ? undefined : { opacity: bandOpacity, scale: bandScale }
        }
      >
        {rows.map((items, i) => (
          <MarqueeRow
            key={i}
            items={items}
            speed={ROW_SPEEDS[i]}
            // Row 1 travels left-to-right, row 2 right-to-left, row 3
            // left-to-right again.
            direction={i % 2 === 0 ? 1 : -1}
            tone={ROW_TONES[i]}
            exit={scrollYProgress}
            exitDrift={EXIT_DRIFT[i]}
            exitConverge={EXIT_CONVERGE[i]}
            frozen={prefersReduced}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface MarqueeRowProps {
  items: readonly string[];
  /** px/sec. */
  speed: number;
  /** 1 = left-to-right, -1 = right-to-left. */
  direction: 1 | -1;
  tone: string;
  exit: MotionValue<number>;
  exitDrift: number;
  exitConverge: number;
  frozen: boolean;
}

function MarqueeRow({
  items,
  speed,
  direction,
  tone,
  exit,
  exitDrift,
  exitConverge,
  frozen,
}: MarqueeRowProps) {
  const groupRef = useRef<HTMLSpanElement>(null);
  const [group, setGroup] = useState({ width: 0, copies: 2 });

  const x = useMotionValue(0);
  const exitX = useTransform(exit, [0, EXIT_HOLD, 1], [0, 0, exitDrift]);
  const exitY = useTransform(exit, [0, EXIT_HOLD, 1], [0, 0, exitConverge]);

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    const remeasure = () => {
      const width = el.getBoundingClientRect().width;
      setGroup({
        width,
        // One extra copy beyond what the viewport needs, so the group that is
        // wrapping back to the right is already on screen.
        copies: width > 0 ? Math.ceil(window.innerWidth / width) + 1 : 2,
      });
    };

    // ResizeObserver fires once on observe, which supplies the initial
    // measurement without a setState in the effect body.
    const observer = new ResizeObserver(remeasure);
    observer.observe(el);
    window.addEventListener("resize", remeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (frozen || group.width === 0) return;

    // Integrate by elapsed time, not per frame, so speed is independent of
    // refresh rate. Wrapping by exactly one group width is what makes the seam
    // invisible: every group is identical, so the jump is unobservable.
    let next = x.get() + (delta / 1000) * speed * direction;
    if (next <= -group.width) next += group.width;
    else if (next >= 0) next -= group.width;
    x.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div style={frozen ? undefined : { x: exitX, y: exitY }}>
        <motion.div className="flex w-max" style={{ x }}>
          {Array.from({ length: group.copies }, (_, copy) => (
            <span
              key={copy}
              ref={copy === 0 ? groupRef : undefined}
              className={`marquee-row flex shrink-0 ${tone}`}
            >
              {items.map((item) => (
                // Trailing space is padding on each item rather than a flex
                // gap, so the interval between the last item of one group and
                // the first of the next matches every other interval.
                <span key={item} className="pr-[0.42em]">
                  {item}
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
