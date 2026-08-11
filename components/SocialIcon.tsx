import type { CSSProperties } from "react";

/** Uses the supplied SVG as a mask so it inherits the site's link colors. */
export function SocialIcon({ src }: { src: string }) {
  const mask: CSSProperties = {
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return (
    <span
      aria-hidden
      style={mask}
      className="inline-block size-4 shrink-0 bg-fg-tertiary transition-[background-color] duration-150 group-hover:bg-accent"
    />
  );
}
