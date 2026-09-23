import { PROFILE_LINKS } from "@/data/profile";
import { cn } from "@/lib/cn";

/** Primary view action with a quieter download fallback. */
export function ResumeButton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
      <a
        href={PROFILE_LINKS.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="group mono inline-flex items-center gap-6 rounded-sm border border-border px-4 py-3 text-label uppercase text-fg transition-[border-color] duration-150 hover:border-accent"
      >
        <span>View resume</span>
        <span
          aria-hidden
          className="text-fg-tertiary transition-[transform,color] duration-150 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-accent"
        >
          ↗
        </span>
      </a>
      <a
        href={PROFILE_LINKS.resume}
        download
        className="group mono inline-flex items-center gap-2 text-mono-sm text-fg-secondary transition-[color] duration-150 hover:text-fg"
      >
        <span>Download PDF</span>
        <span
          aria-hidden
          className="text-fg-tertiary transition-[transform,color] duration-150 group-hover:translate-y-[2px] group-hover:text-accent"
        >
          ↓
        </span>
      </a>
    </div>
  );
}
