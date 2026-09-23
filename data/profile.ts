/**
 * Identity and link data.
 *
 * Identity, links, and resume-backed technical stack.
 */

export interface ProfileLink {
  label: string;
  href: string;
  external: boolean;
  icon: string;
}

export const PROFILE = {
  name: "Jaden Moore",
  discipline: "Software Engineering",
  year: "McMaster University",
  /** Row 1 of the hero marquee. The role, not the field of study. */
  title: "Software Engineer",

  cohort: "GRADUATING_APRIL_2027",

  positioning: [
    "Backend and data engineer building internal tools that remove operational work.",
    "Previously at RBC Capital Markets and TFI International, where I cut investigation time 92% and automated 18+ hours of weekly work.",
  ],

  /** Resume skills, split across rows 2 and 3 by the Hero. */
  stack: [
    "Python",
    "TypeScript / React",
    "Flask",
    "SQL / PostgreSQL",
    "MongoDB",
    "REST APIs",
  ],
} as const;

export const PROFILE_LINKS = {
  resume: "/assets/documents/jaden-moore-resume.pdf",
  github: "https://github.com/JadenAntM",
  linkedin: "https://www.linkedin.com/in/jadenamoore/",
} as const;

/**
 * Email stored as base64 halves and joined at runtime, so the address appears
 * nowhere in the served HTML for a scraper to lift. This is obfuscation, not
 * security — it defeats naive harvesters, nothing more.
 *
 * Generated from the real address; keep the two decoded halves out of source.
 */
export const EMAIL_PARTS = {
  user: "aGVsbG8=",
  domain: "amFkZW5tb29yZS5kZXY=",
} as const;

export const SOCIAL_LINKS: ProfileLink[] = [
  {
    label: "GitHub",
    href: PROFILE_LINKS.github,
    external: true,
    icon: "/assets/icons/github.svg",
  },
  {
    label: "LinkedIn",
    href: PROFILE_LINKS.linkedin,
    external: true,
    icon: "/assets/icons/linkedin.svg",
  },
];
