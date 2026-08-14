"use client";

import { motion } from "framer-motion";
import { NAV_SECTIONS } from "@/data/sections";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useScrollStateValue } from "./ScrollStateProvider";

function useNavState() {
  const { activeId } = useScrollStateValue();
  const prefersReduced = usePrefersReducedMotion();

  return {
    active: activeId,
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: 0.18, ease: [0.2, 0, 0, 1] as const },
  };
}

/**
 * Desktop rail — PLAN.md §3.
 *
 * The active indicator is a short 1px drafting underline. The label stays
 * off-white while its index and line carry the signal color, so active state is
 * clearer without turning the rail into a column of neon text.
 */
export function NavRail() {
  const { active, transition } = useNavState();

  return (
    <nav aria-label="Sections" className="pt-28">
      <ul>
        {NAV_SECTIONS.map((section) => {
          const isActive = active === section.id;

          return (
            <li key={section.id} className="relative">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "mono block py-3 pl-4 pr-2 text-label uppercase transition-[color] duration-150",
                  isActive
                    ? "text-fg"
                    : "text-fg-tertiary hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "block transition-[color] duration-150",
                    isActive ? "text-accent" : "text-fg-tertiary",
                  )}
                >
                  {section.index}
                </span>
                <span className="mt-1 block">{section.railLabel}</span>
              </a>
              {isActive ? (
                <motion.span
                  layoutId="nav-rail-indicator"
                  transition={transition}
                  aria-hidden
                  className="absolute bottom-2 left-4 h-px w-7 bg-accent"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface HorizontalNavProps {
  /** Which edge of the bar the active indicator sits on. */
  indicatorEdge: "top" | "bottom";
  layoutId: string;
  className?: string;
}

function HorizontalNav({
  indicatorEdge,
  layoutId,
  className,
}: HorizontalNavProps) {
  const { active, transition } = useNavState();

  return (
    <nav
      aria-label="Sections"
      className={cn("fixed inset-x-0 z-30 bg-bg", className)}
    >
      <ul className="sheet flex h-full items-stretch">
        {NAV_SECTIONS.map((section) => {
          const isActive = active === section.id;

          return (
            <li key={section.id} className="relative flex-1">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "mono flex h-full items-center justify-center gap-2 text-label uppercase transition-[color] duration-150",
                  isActive ? "text-fg" : "text-fg-tertiary",
                )}
              >
                <span className={isActive ? "text-accent" : "text-fg-tertiary"}>
                  {section.index}
                </span>
                <span className="sm:hidden">
                  {section.compactLabel ?? section.railLabel}
                </span>
                <span className="hidden sm:inline">{section.railLabel}</span>
              </a>
              {isActive ? (
                <motion.span
                  layoutId={layoutId}
                  transition={transition}
                  aria-hidden
                  className={cn(
                    "absolute inset-x-[22%] h-px bg-accent",
                    indicatorEdge === "top" ? "top-0" : "bottom-0",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Fixed nav chrome below lg. Two real patterns rather than a hidden rail: a
 * top strip on tablet, a bottom bar within thumb reach on phones.
 */
export function NavChrome() {
  return (
    <>
      <HorizontalNav
        layoutId="nav-bar-indicator"
        indicatorEdge="top"
        className="bottom-0 h-(--rail-bar-h) border-t border-border sm:hidden"
      />
      <HorizontalNav
        layoutId="nav-strip-indicator"
        indicatorEdge="bottom"
        className="top-0 hidden h-(--rail-strip-h) border-b border-border sm:block lg:hidden"
      />
    </>
  );
}
