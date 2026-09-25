"use client";

import { useEffect, useRef } from "react";

type CursorMode = "default" | "link";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "[role='button']",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
].join(",");

function cursorModeAt(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  if (target.closest(INTERACTIVE_SELECTOR)) return "link";
  return "default";
}

/**
 * Fine-pointer enhancement only. Position is written directly to the DOM on
 * the next animation frame so pointer movement never enters React's render
 * loop. The native cursor is hidden only after the first qualifying movement.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    let mode: CursorMode = "default";

    const setVisible = (visible: boolean) => {
      cursor.dataset.active = String(visible);
      root.classList.toggle("custom-cursor-active", visible);
    };

    const setMode = (nextMode: CursorMode) => {
      if (mode === nextMode) return;
      mode = nextMode;
      cursor.dataset.mode = nextMode;
    };

    const paint = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const schedulePaint = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") {
        setVisible(false);
        return;
      }

      x = event.clientX;
      y = event.clientY;
      setMode(cursorModeAt(event.target));
      schedulePaint();
      setVisible(true);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (finePointer.matches && event.pointerType === "mouse") {
        cursor.dataset.pressed = "true";
      }
    };

    const onPointerUp = () => {
      cursor.dataset.pressed = "false";
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) setVisible(false);
    };

    const onScroll = () => {
      if (cursor.dataset.active !== "true") return;
      setMode(cursorModeAt(document.elementFromPoint(x, y)));
    };

    const reset = () => {
      setVisible(false);
      cursor.dataset.pressed = "false";
    };

    const onMediaChange = () => {
      if (!finePointer.matches) reset();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", reset, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", reset);
    finePointer.addEventListener("change", onMediaChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      reset();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", reset);
      finePointer.removeEventListener("change", onMediaChange);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      data-active="false"
      data-mode="default"
      data-pressed="false"
      aria-hidden="true"
    >
      <span className="custom-cursor__visual">
        <span className="custom-cursor__crosshair" />
        <span className="custom-cursor__arrow mono">→</span>
      </span>
    </div>
  );
}
