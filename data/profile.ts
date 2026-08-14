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

  // TODO(jaden): confirm graduation term.
  cohort: "NEW_GRAD_2027",

  /**
   * Three sentences, no adjective that cannot be measured. See the copy rule in
   * PLAN.md §5.
   * TODO(jaden): rewrite in your own words — this is scaffolding, not your voice.
   */
  positioning: [
    "I build internal tools and data workflows that reduce operational work—from Python automation and ETL pipelines to full-stack support platforms.",
    "Previously at RBC Capital Markets and TFI International, working on internal platform and pipeline code.",
    "Currently looking for a new-grad role in full-stack software engineering or data engineering.",
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
  user: "amFkZW4uYXkubW9vcmU=",
  domain: "Z21haWwuY29t",
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
