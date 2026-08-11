import { EmailLink } from "@/components/EmailLink";
import { HeadingReveal } from "@/components/HeadingReveal";
import { ResumeButton } from "@/components/ResumeButton";
import { ScrambleLink } from "@/components/ScrambleLink";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { SOCIAL_LINKS } from "@/data/profile";
import { SECTIONS } from "@/data/sections";

const meta = SECTIONS.find((section) => section.id === "contact")!;

/** Short and direct. No closing manifesto — see .cursorrules. */
export function Contact() {
  return (
    <Section id={meta.id}>
      <GridRow
        main={
          <>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>

            <p className="mt-4 max-w-(--measure-body) text-body text-fg-secondary">
              Open to new-grad and internship roles. Fastest reply by email.
            </p>

            <ul className="mt-10 space-y-4">
              <li>
                <EmailLink />
              </li>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <ScrambleLink
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                    external={link.external}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <ResumeButton />
            </div>
          </>
        }
      />
    </Section>
  );
}
