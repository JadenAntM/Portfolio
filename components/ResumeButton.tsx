import { PROFILE_LINKS } from "@/data/profile";
import { cn } from "@/lib/cn";

/**
 * Primary CTA. A 1px bordered rectangle whose border shifts to the accent on
 * hover — not a filled button, which would exceed the accent usage ceiling in
 * PLAN.md §1.
 */
export function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={PROFILE_LINKS.resume}
      download
      className={cn(
        "group mono inline-flex items-center gap-6 rounded-sm border border-border px-4 py-3 text-label uppercase text-fg transition-[border-color] duration-150 hover:border-accent",
        className,
      )}
    >
      <span>Resume.pdf</span>
      <span
        aria-hidden
        className="text-fg-tertiary transition-[transform,color] duration-150 group-hover:translate-y-[2px] group-hover:text-accent"
      >
        ↓
      </span>
    </a>
  );
}
