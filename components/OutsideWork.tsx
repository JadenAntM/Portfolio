import { HeadingReveal } from "@/components/HeadingReveal";
import { GridRow, Section, headingId } from "@/components/Section";
import { SpecBlock } from "@/components/SpecBlock";
import { OUTSIDE_WORK } from "@/data/outsideWork";

const sectionId = "outside-work";

/** A compact personal note that keeps the portfolio's primary story technical. */
export function OutsideWork() {
  return (
    <Section id={sectionId}>
      <GridRow
        mainClassName="py-16 sm:py-20 lg:py-24"
        main={
          <>
            <p className="mono mb-6 text-label uppercase text-fg-tertiary">
              Outside_work
            </p>
            <HeadingReveal id={headingId(sectionId)}>Outside Work</HeadingReveal>

            <ul className="mt-10 max-w-(--measure-body) border-b border-border">
              {OUTSIDE_WORK.map((interest) => (
                <li
                  key={interest.name}
                  className="grid gap-3 border-t border-border py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                >
                  <div>
                    <h3 className="text-h3 text-fg">{interest.name}</h3>
                    <p className="mono mt-2 text-label uppercase text-fg-tertiary">
                      {interest.note}
                    </p>
                  </div>
                  <p className="text-body text-fg-secondary">
                    {interest.detail}
                  </p>
                </li>
              ))}
            </ul>
          </>
        }
        spec={
          <SpecBlock label="Offline" first>
            A few things I make time for away from a screen.
          </SpecBlock>
        }
      />
    </Section>
  );
}
