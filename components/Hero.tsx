import { ArrowLink } from "@/components/ArrowLink";
import { HeroMarquee } from "@/components/HeroMarquee";
import { ResumeButton } from "@/components/ResumeButton";
import { ScrollReadout } from "@/components/ScrollReadout";
import { GridRow, Section, headingId } from "@/components/Section";
import { SpecBlock } from "@/components/SpecBlock";
import { PROFILE, SOCIAL_LINKS } from "@/data/profile";

const SECTION_ID = "index";

/** Rows 2 and 3 of the marquee — the stack split in half, in declared order. */
const MID = Math.ceil(PROFILE.stack.length / 2);
const SKILL_ROWS = [
  PROFILE.stack.slice(0, MID),
  PROFILE.stack.slice(MID),
] as const;

/**
 * Hero — PLAN.md §3 wireframe. Left-anchored in the main track with no centred
 * stat and no gradient; the open space to the right of the 58ch measure is
 * deliberate.
 *
 * The status line lives in the main track rather than the spec column so it
 * stays adjacent to the identity block at every breakpoint (see the PROMPT 2
 * amendment in PLAN.md §3).
 *
 * The marquee band sits outside the `GridRow` on purpose: it spans every track
 * and crosses the sheet's verticals, which is the one place in the site where
 * content is allowed to override the grid instead of sitting inside it.
 */
export function Hero() {
  return (
    <Section id={SECTION_ID} first>
      <GridRow
        // Tighter than the standard track padding: the hero has to seat the
        // identity block and the marquee band in one viewport.
        mainClassName="lg:pt-24 pb-14 sm:pb-16 lg:pb-20"
        spec={
          <>
            <SpecBlock label="Index" first>
              <ScrollReadout />
            </SpecBlock>
          </>
        }
        main={
          <>
            <h1 id={headingId(SECTION_ID)} className="text-display text-fg">
              {PROFILE.name}
            </h1>

            <p className="mono mt-4 text-mono-sm text-fg-secondary">
              {PROFILE.discipline}
              <span className="px-2 text-fg-tertiary">·</span>
              {PROFILE.year}
            </p>

            {/* Short rule: structure, echoing the sheet hairlines at content scale. */}
            <hr className="mt-8 w-28 border-t border-border" />

            <p className="mono mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-label uppercase">
              <span className="text-fg-tertiary">Status:</span>
              <span className="inline-flex items-center gap-2 text-fg">
                <span
                  aria-hidden
                  className="inline-block size-1.5 shrink-0 rounded-full bg-accent"
                />
                {PROFILE.status.state}
              </span>
              <span className="text-fg-tertiary">·</span>
              <span className="text-fg-tertiary">{PROFILE.status.cohort}</span>
            </p>

            <div className="mt-10 max-w-(--measure-lead) space-y-4">
              {PROFILE.positioning.map((sentence) => (
                <p key={sentence} className="text-lead text-fg-secondary">
                  {sentence}
                </p>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <ResumeButton />
              {SOCIAL_LINKS.map((link) => (
                <ArrowLink
                  key={link.label}
                  href={link.href}
                  external={link.external}
                  icon={link.icon}
                >
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          </>
        }
      />

      <HeroMarquee title={PROFILE.title} skills={SKILL_ROWS} />
    </Section>
  );
}
