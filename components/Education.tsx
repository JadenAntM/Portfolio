import Image from "next/image";
import { HeadingReveal } from "@/components/HeadingReveal";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { SpecBlock } from "@/components/SpecBlock";
import { EDUCATION } from "@/data/education";
import { SECTIONS } from "@/data/sections";

const meta = SECTIONS.find((section) => section.id === "education")!;

/** Compact credentials block: one row, one heading reveal, no pinned stage. */
export function Education() {
  return (
    <Section id={meta.id}>
      <GridRow
        mainClassName="py-16 sm:py-20 lg:py-24"
        main={
          <>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>

            <div className="mt-10 max-w-(--measure-body)">
              <div className="flex items-center gap-5">
                <span
                  aria-hidden
                  className="relative flex h-14 w-28 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border-hi bg-fg sm:h-16 sm:w-32"
                >
                  <Image
                    src="/assets/logos/mcmaster-university.png"
                    alt=""
                    fill
                    sizes="8rem"
                    className="object-contain p-1"
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="text-h3 text-fg">{EDUCATION.school}</h3>
                  <p className="mono mt-3 text-mono-sm text-fg-secondary">
                    {EDUCATION.degree}
                    <span className="px-2 text-fg-tertiary">·</span>
                    {EDUCATION.program}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="mono text-label uppercase text-fg-tertiary">
                  Relevant coursework
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {EDUCATION.coursework.map((course) => (
                    <li
                      key={course}
                      className="mono rounded-sm border border-border px-2 py-1 text-mono-sm text-fg-tertiary"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        }
        spec={
          <>
            <SpecBlock label="Location" first>
              {EDUCATION.location}
            </SpecBlock>
            <SpecBlock label="Graduation">{EDUCATION.graduation}</SpecBlock>
            <SpecBlock label="GPA">{EDUCATION.gpa}</SpecBlock>
            <SpecBlock label="Honors">
              <ul>
                {EDUCATION.honors.map((honor) => (
                  <li key={honor}>{honor}</li>
                ))}
              </ul>
            </SpecBlock>
          </>
        }
      />
    </Section>
  );
}
