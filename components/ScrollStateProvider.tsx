"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SECTIONS } from "@/data/sections";
import { useScrollState, type ScrollState } from "@/lib/useScrollState";

const SECTION_IDS = SECTIONS.map((section) => section.id);

const ScrollStateContext = createContext<ScrollState>({
  activeId: SECTION_IDS[0] ?? null,
  progress: 0,
});

/**
 * Measures scroll once and shares it, so the rail, the mobile bar, the tablet
 * strip and the hero's live readout all read the same value from a single
 * listener instead of running four of their own.
 */
export function ScrollStateProvider({ children }: { children: ReactNode }) {
  const state = useScrollState(SECTION_IDS);

  return (
    <ScrollStateContext.Provider value={state}>
      {children}
    </ScrollStateContext.Provider>
  );
}

export function useScrollStateValue(): ScrollState {
  return useContext(ScrollStateContext);
}
