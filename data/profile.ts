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
  year: "4th Year",
  /** Row 1 of the hero marquee. The role, not the field of study. */
  title: "Software Engineer",

  status: {
    state: "OPEN_TO_WORK",
    // TODO(jaden): confirm graduation term.
    cohort: "NEW_GRAD_2027",
  },

  /**
   * Three sentences, no adjective that cannot be measured. See the copy rule in
   * PLAN.md §5.
   * TODO(jaden): rewrite in your own words — this is scaffolding, not your voice.
   */
  positioning: [
    "I build backend systems and data infrastructure: streaming ingest, validation, and the tooling that makes both observable.",
    "Previously at RBC Capital Markets and TFI International, working on internal platform and pipeline code.",
    "Currently looking for a new-grad role in systems or quantitative technology.",
  ],

  /** Resume skills, split across rows 2 and 3 by the Hero. */
  stack: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "SQL",
    "C",
    "HTML",
    "CSS",
    "Spring Boot",
    "TensorFlow",
    "Keras",
    "React.js",
    "Node.js",
    "Flask",
    "Selenium",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "AWS S3",
    "AWS ECS",
    "pytest",
    "SonarQube",
    "Docker",
    "Postman",
    "Linux",
  ],
} as const;

export const PROFILE_LINKS = {
  resume: "/resume.pdf",
  github: "https://github.com/JadenAntM",
  linkedin: "https://www.linkedin.com/in/jadenamoore/",
} as const;

/**
 * Email stored as base64 halves and joined at runtime, so the address appears
 * nowhere in the served HTML for a scraper to lift. This is obfuscation, not
 * security — it defeats naive harvesters, nothing more.
 *
 * TODO(jaden): replace with your address:
 *   node -e "console.log(btoa('you'), btoa('domain.com'))"
 */
export const EMAIL_PARTS = {
  user: "Zmlyc3QubGFzdA==",
  domain: "ZXhhbXBsZS5jb20=",
} as const;

export const SOCIAL_LINKS: ProfileLink[] = [
  {
    label: "GitHub",
    href: PROFILE_LINKS.github,
    external: true,
    icon: "/icons/github.svg",
  },
  {
    label: "LinkedIn",
    href: PROFILE_LINKS.linkedin,
    external: true,
    icon: "/icons/linkedin.svg",
  },
];
