import Image from "next/image";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { HeadingReveal } from "@/components/HeadingReveal";
import { ScrollStage, ScrollStageItem } from "@/components/ScrollStage";
import { SpecBlock } from "@/components/SpecBlock";
import { EXPERIENCE, type ExperienceRole } from "@/data/experience";
import { SECTIONS } from "@/data/sections";

const meta = SECTIONS.find((section) => section.id === "experience")!;

/**
 * User-supplied company artwork in its native brand color. The company heading
 * immediately beside it carries the accessible name.
 */
function CompanyMark({ role }: { role: ExperienceRole }) {
  return (
    <span
      aria-hidden
      className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border-hi bg-bg sm:h-16 sm:w-28"
    >
      <Image
        src={role.logo}
        alt=""
        fill
        sizes="7rem"
        className="company-logo object-contain p-2"
      />
      <span className="mono sr-only">{role.monogram}</span>
    </span>
  );
}

function CompanyBlock({
  role,
  position,
  total,
}: {
  role: ExperienceRole;
  position: number;
  total: number;
}) {
  return (
    <GridRow
      main={
        <>
          <div className="flex items-center gap-5">
            <CompanyMark role={role} />
            <div className="min-w-0">
              <h3 className="text-h3 text-fg">{role.company}</h3>
              <p className="mono mt-2 text-mono-sm text-fg-secondary">
                {role.role}
              </p>
            </div>
          </div>

          <p className="mono mt-6 text-label uppercase text-fg-tertiary">
            {role.dates}
          </p>

          <ul className="mt-8 max-w-(--measure-body) space-y-4">
            {role.bullets.map((bullet, i) => (
              <li key={bullet} className="flex gap-4">
                <span
                  aria-hidden
                  className="mono shrink-0 text-mono-sm text-accent"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-body text-fg-secondary">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </>
      }
      spec={
        <>
          <SpecBlock label="Stack" first>
            <ul className="flex flex-wrap gap-2">
              {role.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-border px-2 py-1 text-fg-tertiary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </SpecBlock>

          <SpecBlock label="Position">
            <span className="text-accent">
              {String(position).padStart(2, "0")}
            </span>
            <span className="px-1 text-fg-tertiary">/</span>
            {String(total).padStart(2, "0")}
          </SpecBlock>
        </>
      }
    />
  );
}

export function WorkExperience() {
  return (
    <Section id={meta.id}>
      <GridRow
        main={
          <>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>
            <p className="mono mt-4 text-label uppercase text-fg-tertiary">
              Reverse chronological
            </p>
          </>
        }
      />

      <ScrollStage count={EXPERIENCE.length}>
        {EXPERIENCE.map((role, i) => (
          <ScrollStageItem key={role.company} index={i}>
            <CompanyBlock
              role={role}
              position={i + 1}
              total={EXPERIENCE.length}
            />
          </ScrollStageItem>
        ))}
      </ScrollStage>
    </Section>
  );
}
