import Image from "next/image";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { HeadingReveal } from "@/components/HeadingReveal";
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

function CompanyCard({
  role,
  position,
  total,
}: {
  role: ExperienceRole;
  position: number;
  total: number;
}) {
  return (
    <article
      data-experience-entry
      className="group grid rounded-sm border border-border p-5 transition-colors hover:border-accent sm:p-7 lg:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.6fr)] lg:gap-10 lg:p-8"
    >
      <div className="min-w-0 lg:border-r lg:border-border lg:pr-10">
        <div className="flex items-start justify-between gap-4">
          <CompanyMark role={role} />
          <p className="mono shrink-0 text-micro text-fg-tertiary">
            <span className="text-accent">
              {String(position).padStart(2, "0")}
            </span>
            <span className="px-1">/</span>
            {String(total).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-h3 text-fg">{role.company}</h3>
          <p className="mono mt-2 text-mono-sm text-fg-secondary">
            {role.role}
          </p>
          <p className="mono mt-4 text-label uppercase text-fg-tertiary">
            {role.dates}
          </p>
        </div>

        <div className="mt-7 border-t border-border pt-5">
          <p className="mono mb-3 text-micro uppercase text-fg-tertiary">
            Stack
          </p>
          <ul className="flex flex-wrap gap-2">
            {role.stack.map((item) => (
              <li
                key={item}
                className="mono rounded-sm border border-border px-2 py-1 text-micro text-fg-tertiary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-8 space-y-4 border-t border-border pt-7 lg:mt-0 lg:border-t-0 lg:pt-1">
        {role.bullets.map((bullet, i) => (
          <li key={bullet} className="flex gap-3">
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
    </article>
  );
}

export function WorkExperience() {
  return (
    <Section id={meta.id}>
      <GridRow
        mainClassName="py-16 sm:py-20 lg:py-24"
        main={
          <>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>
            <p className="mono mt-4 text-label uppercase text-fg-tertiary">
              Reverse chronological
            </p>

            <div
              data-experience-grid
              className="mt-10 space-y-6"
            >
              {EXPERIENCE.map((role, i) => (
                <CompanyCard
                  key={role.company}
                  role={role}
                  position={i + 1}
                  total={EXPERIENCE.length}
                />
              ))}
            </div>
          </>
        }
      />
    </Section>
  );
}
