"use client";

import Lenis from "lenis";
import {
  cancelFrame,
  frame,
  type MotionValue,
  useMotionValue,
} from "framer-motion";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
} from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface SmoothScrollContextValue {
  scrollY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

/**
 * Lenis owns wheel interpolation and emits the one scroll value every
 * scroll-linked Framer Motion transform consumes. Reduced-motion users keep
 * native scrolling, but the same MotionValues are maintained so consumers do
 * not need separate code paths.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReduced = usePrefersReducedMotion();
  const scrollY = useMotionValue(0);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const syncNativeScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
      const nextScroll = window.scrollY;
      scrollY.set(nextScroll);
      scrollProgress.set(maxScroll === 0 ? 0 : clamp01(nextScroll / maxScroll));
    };

    if (prefersReduced) {
      syncNativeScroll();
      window.addEventListener("scroll", syncNativeScroll, { passive: true });
      window.addEventListener("resize", syncNativeScroll);

      return () => {
        window.removeEventListener("scroll", syncNativeScroll);
        window.removeEventListener("resize", syncNativeScroll);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    const syncLenisScroll = (instance: Lenis) => {
      scrollY.set(instance.scroll);
      scrollProgress.set(instance.progress);
    };
    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);

    syncLenisScroll(lenis);
    lenis.on("scroll", syncLenisScroll);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.off("scroll", syncLenisScroll);
      lenis.destroy();
    };
  }, [prefersReduced, scrollProgress, scrollY]);

  return (
    <SmoothScrollContext.Provider value={{ scrollY, scrollProgress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const value = useContext(SmoothScrollContext);
  if (!value) {
    throw new Error("useSmoothScroll must be used inside SmoothScrollProvider");
  }
  return value;
}

type TargetRange = "stage" | "hero-exit";

/**
 * Lenis-backed equivalent of the two target ranges used by this site:
 *
 * - stage:     ["start start", "end end"]
 * - hero-exit: ["end end", "end start"]
 */
export function useLenisTargetProgress(
  targetRef: RefObject<HTMLElement | null>,
  range: TargetRange,
) {
  const { scrollY } = useSmoothScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let start = 0;
    let end = 1;

    const update = (currentScroll: number) => {
      const distance = end - start;
      progress.set(
        distance <= 0 ? 0 : clamp01((currentScroll - start) / distance),
      );
    };

    const measure = () => {
      const currentScroll = scrollY.get();
      const rect = target.getBoundingClientRect();
      const top = currentScroll + rect.top;
      const bottom = top + rect.height;

      if (range === "stage") {
        start = top;
        end = bottom - window.innerHeight;
      } else {
        start = bottom - window.innerHeight;
        end = bottom;
      }

      update(currentScroll);
    };

    const unsubscribe = scrollY.on("change", update);
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    window.addEventListener("resize", measure);
    measure();

    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [progress, range, scrollY, targetRef]);

  return progress;
}
