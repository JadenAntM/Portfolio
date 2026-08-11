"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/\\_-";
const DURATION_MS = 420;

/**
 * Resolves `text` from random glyphs, left to right, while `active` is true.
 * Motion inventory item 6.
 *
 * The scrambled frame is stored against a key describing the activation it
 * belongs to, so a stale frame from a previous hover can never be shown and the
 * effect never has to reset state synchronously. Returns the real text
 * untouched when disabled — the reduced-motion path is no scramble at all, not a
 * faster one.
 */
export function useScramble(text: string, active: boolean, enabled: boolean) {
  const key = `${text}|${active}|${enabled}`;
  const [frame, setFrame] = useState<{ key: string; value: string } | null>(null);

  useEffect(() => {
    if (!enabled || !active) return;

    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const revealed = Math.floor(progress * text.length);

      setFrame({
        key,
        value: text
          .split("")
          .map((char, i) =>
            i < revealed || char === " "
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      });

      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [key, text, active, enabled]);

  if (!enabled || !active) return text;
  return frame?.key === key ? frame.value : text;
}
