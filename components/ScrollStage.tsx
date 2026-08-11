"use client";

import {
  type MotionValue,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { useLenisTargetProgress } from "@/components/SmoothScrollProvider";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * A scroll-linked stack. The stage is a tall container with a pinned viewport;
 * its items are stacked in place and hand off to each other as a function of
 * scroll offset — the outgoing item slides up and fades as the incoming one
 * rises and fades in, both driven by the same `scrollYProgress`.
 *
 * This is scroll-*linked*, not scroll-*triggered*: scrubbing back up runs the
 * handoff in reverse, and stopping mid-transition holds both items at their
 * partial states. An on-enter reveal cannot do either.
 *
 * The stage drops to a plain hairline-separated list in normal flow in two
 * cases:
 *
 *  - Reduced motion. A transition whose whole purpose is movement has no slower
 *    version, so the content is simply presented statically.
 *  - Below 640px. A pinned viewport there is 796px tall on a common phone, and a
 *    company block with its spec column stacked underneath measures within ~10px
 *    of that with placeholder copy. Real copy would be clipped by the pin, and
 *    silently losing content is a worse outcome than losing an effect.
 */

const NARROW = "(max-width: 39.999rem)";
// A handoff is deliberately short and sequential. A longer crossfade leaves
// unequal-height blocks visibly printed over each other because every item
// shares the same absolute stage.
const HANDOFF_FRACTION = 0.16;
const HANDOFF_TRAVEL = 112;
const STAGE_SPRING = {
  stiffness: 360,
  damping: 42,
  mass: 0.55,
  restDelta: 0.001,
} as const;

interface StageContextValue {
  progress: MotionValue<number>;
  count: number;
  isStatic: boolean;
}

const StageContext = createContext<StageContextValue | null>(null);

function useStage(): StageContextValue {
  const value = useContext(StageContext);
  if (!value) {
    throw new Error("ScrollStageItem must be rendered inside a ScrollStage");
  }
  return value;
}

interface ScrollStageProps {
  /** Number of items. Each one is given a viewport of scroll to itself. */
  count: number;
  children: ReactNode;
}

export function ScrollStage({ count, children }: ScrollStageProps) {
  const prefersReduced = usePrefersReducedMotion();
  // Static on the server and at first paint, so the fallback is what ships in
  // the HTML and the pinned variant is the enhancement.
  const isNarrow = useMediaQuery(NARROW, true);
  const isStatic = prefersReduced || isNarrow;
  const trackRef = useRef<HTMLDivElement>(null);

  // 0 when the track's top meets the top of the viewport, 1 when its bottom
  // meets the bottom — so progress spans exactly the pinned interval.
  const scrollYProgress = useLenisTargetProgress(trackRef, "stage");

  const context: StageContextValue = {
    progress: scrollYProgress,
    count,
    isStatic,
  };

  // The ref stays attached in both branches so the Lenis-backed target range
  // can be measured even when the static fallback does not read its result.
  if (isStatic) {
    return (
      <div ref={trackRef}>
        <StageContext.Provider value={context}>{children}</StageContext.Provider>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      data-scroll-stage
      className="relative"
      style={{ height: `${count * 100}vh` }}
    >
      <div className="stage-pin">
        <StageContext.Provider value={context}>
          {children}
        </StageContext.Provider>
      </div>
    </div>
  );
}

interface ScrollStageItemProps {
  index: number;
  children: ReactNode;
}

export function ScrollStageItem({ index, children }: ScrollStageItemProps) {
  const { progress, count, isStatic } = useStage();

  const step = 1 / count;
  // The stage has one scroll allocation per entry; only a small fraction is
  // used to exit or enter at each handoff boundary.
  const handoff = step * HANDOFF_FRACTION;

  const first = index === 0;
  const last = index === count - 1;

  // Consecutive items hand off at the same boundary, but never share an
  // opacity range: the outgoing block is fully gone before its successor
  // enters. This keeps the transition independent of block height.
  const enterStart = first ? 0 : index * step;
  const enterEnd = first ? 0 : enterStart + handoff;
  const leaveEnd = last ? 1 : (index + 1) * step;
  const leaveStart = last ? 1 : leaveEnd - handoff;

  const range = first
    ? [0, leaveStart, leaveEnd]
    : last
      ? [enterStart, enterEnd, 1]
      : [enterStart, enterEnd, leaveStart, leaveEnd];
  const opacity = useTransform(
    progress,
    range,
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const yTarget = useTransform(
    progress,
    range,
    first
      ? [0, 0, -HANDOFF_TRAVEL]
      : last
        ? [HANDOFF_TRAVEL, 0, 0]
        : [HANDOFF_TRAVEL, 0, 0, -HANDOFF_TRAVEL],
  );
  const scaleTarget = useTransform(
    progress,
    range,
    first ? [1, 1, 0.97] : last ? [0.97, 1, 1] : [0.97, 1, 1, 0.97],
  );
  const y = useSpring(yTarget, STAGE_SPRING);
  const scale = useSpring(scaleTarget, STAGE_SPRING);

  // Opacity alone does not remove an absolute item from the visual or focus
  // stack. The hard visibility boundary and matching pointer-events gate make
  // fully transitioned-out content inert until it is needed again.
  const visibility = useTransform(progress, (current) =>
    current >= enterStart && current <= leaveEnd ? "visible" : "hidden",
  );
  const pointerEvents = useTransform(progress, (current) =>
    current >= enterStart && current <= leaveEnd ? "auto" : "none",
  );

  if (isStatic) {
    return <div className={cn(index > 0 && "section-rule")}>{children}</div>;
  }

  return (
    <motion.div
      data-scroll-stage-item={index}
      className="absolute inset-0 flex items-center"
      style={{ opacity, y, scale, visibility, pointerEvents }}
    >
      <div className="w-full">{children}</div>
    </motion.div>
  );
}
