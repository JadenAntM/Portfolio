export interface ExperienceRole {
  company: string;
  /** User-supplied company artwork, rendered in its official brand color. */
  logo: string;
  /** Text fallback if an asset ever becomes unavailable. */
  monogram: string;
  role: string;
  /** Display range. Reverse chronological order is the array order. */
  dates: string;
  stack: string[];
  /** 3–4 lines. Each one quantified, no adjectives. */
  bullets: string[];
}

export const EXPERIENCE: ExperienceRole[] = [
  {
    company: "RBC Capital Markets",
    logo: "/assets/logos/rbc-capital-markets.svg",
    monogram: "RBC",
    role: "Software Developer Intern — Quantitative Technology Services",
    dates: "2026.05 — 2026.08",
    stack: ["Python", "React", "Flask", "PostgreSQL", "REST APIs"],
    bullets: [
      "Cut position-break investigation time 92%, from 120 to 10 minutes, with a Python tool spanning an 8M-line server log, Oracle data, and reconciliation files.",
      "Built a React and Flask support platform for 6+ trading and risk applications, with PostgreSQL and enterprise LDAP/NTLM authentication for 10 daily users.",
      "Automated 10+ hours of weekly reporting through a Python ETL pipeline and REST APIs, producing reports used across 2 teams and presented to 100+ stakeholders.",
      "Built an internal LLM analytics assistant for incident and vulnerability analysis, saving 3 hours each week.",
    ],
  },
  {
    company: "TFI International",
    logo: "/assets/logos/tfi-international.webp",
    monogram: "TFI",
    role: "Software Engineer Intern",
    dates: "2025.04 — 2026.04",
    stack: ["Python", "Azure AI", "MongoDB", "REST APIs"],
    bullets: [
      "Automated load bidding with Python bots, saving operations coordinators 10 hours weekly and an estimated $25,000 annually.",
      "Built an OCR ETL pipeline in a 3-person team using Python, Azure AI, and NoSQL, reducing manual entry about 90% for 30+ daily users.",
      "Designed the OCR platform's MongoDB data layer and Python persistence functions, improving query performance by more than 95%.",
      "Integrated REST APIs from 2 core systems into an internal web app, saving more than 8 hours of manual work each week.",
    ],
  },
];
