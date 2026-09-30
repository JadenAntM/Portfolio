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
    dates: "May 2026 — August 2026",
    stack: ["Python", "React", "Flask", "PostgreSQL", "REST APIs"],
    bullets: [
      "Cut position-break investigation time 92%, from 120 to 10 minutes, by building a Python tool that cross-references an 8M-line server log, Oracle data, and reconciliation files",
      "Built and deployed a production-support platform using React, Flask, and PostgreSQL with enterprise LDAP/NTLM authentication, centralizing Jira, Confluence, Webex, and internal tooling for 6+ trading and risk applications",
      "Automated 10+ hours of weekly reporting with a Python ETL pipeline using REST APIs, producing incident and vulnerability reports used across 2 teams and presented to 100+ stakeholders",
      "Built an AI analytics assistant using REST APIs and an internal LLM API to answer incident and vulnerability questions and generate charts, saving 3 hours weekly",
    ],
  },
  {
    company: "TFI International",
    logo: "/assets/logos/tfi-international.webp",
    monogram: "TFI",
    role: "Software Engineer Intern",
    dates: "April 2025 — April 2026",
    stack: ["Python", "Azure AI", "MongoDB", "REST APIs"],
    bullets: [
      "Automated load bidding systems by developing multiple Python bots, saving Operation Coordinators 10 hours weekly and cutting costs by an estimated $25,000 annually",
      "Developed an ETL pipeline for a company-wide OCR platform in a 3-person team, leveraging Python, Azure AI, and NoSQL. The system automates invoice processing for 30+ daily users, reducing manual data entry time by an estimated 90% and minimizing human error",
      "Owned the OCR’s core data system in MongoDB, improving query performance by over 95%: designed a flexible NoSQL schema and wrote robust Python functions to efficiently save and update all OCR results",
      "Developed an internal web application integrated with RESTful APIs from two core company systems, automating data synchronization and saving over 8 hours of manual work weekly",
    ],
  },
];
