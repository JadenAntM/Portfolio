export interface Project {
  name: string;
  subtitle?: string;
  /** One line. What it does, not why it is exciting. */
  description: string;
  image?: string;
  /** Describes the image itself, not the project. */
  alt: string;
  stack: string[];
  href?: string;
  accessLabel?: string;
  attribution?: string;
  details?: {
    label: string;
    value: string;
  }[];
  sourceCodeHref?: string;
  liveDemoHref?: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Riverwise",
    subtitle: "Nova Scotia River Conditions",
    description:
      "Mobile-friendly dashboard combining measured river discharge, nearby weather, and a transparent experimental conditions score.",
    image: "/assets/projects/riverwise.png",
    alt: "Riverwise dashboard showing Nova Scotia river conditions and a measured discharge chart",
    stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Python"],
    attribution:
      "Independent project · Built the ingestion pipeline, API, scoring system, and responsive dashboard end to end.",
    details: [
      {
        label: "Data pipeline",
        value:
          "Separates hourly Water Survey of Canada and Open-Meteo ingestion from web requests, preserving source timestamps and visible data gaps in PostgreSQL.",
      },
      {
        label: "Coverage",
        value:
          "Tracks six verified Nova Scotia gauges with seven- and 30-day score history, reliability reporting, and responsive station views.",
      },
    ],
    sourceCodeHref: "https://github.com/JadenAntM/Riverwise",
    liveDemoHref: "https://riverwise.jadenmoore.dev/",
  },
  {
    name: "PocketSpotter",
    subtitle: "AI Fitness Form Coach",
    description:
      "Real-time computer-vision coaching for lifters who want immediate feedback on form, pacing, and completed reps.",
    image: "/assets/projects/pocketspotter.png",
    alt: "PocketSpotter AI fitness form coaching dashboard",
    stack: ["Python", "OpenCV", "MediaPipe", "Flask"],
    href: "https://github.com/kyle174/PocketSpotter",
    attribution:
      "Team of four · DeltaHacks XI hackathon · Owned pose-processing pipeline, Flask integration, and workout logging.",
    details: [
      {
        label: "Technical decision",
        value:
          "Built an angle-based state pipeline over 33 MediaPipe landmarks, then connected live feedback and CSV workout logging through Flask.",
      },
      {
        label: "Result",
        value: "98% accuracy with sub-50ms processing latency.",
      },
    ],
    sourceCodeHref: "https://github.com/kyle174/PocketSpotter",
  },
  {
    name: "VIAC",
    subtitle: "Virtual Investment Assistant Copilot",
    description:
      "AI-powered copilot that combines live meeting insights, document analysis, tailored investment proposals, and onboarding in one advisor workflow.",
    image: "/assets/projects/RBC_Hackathon.png",
    alt: "Team 21, Debug and Conquer, after winning the Real-Time AI Insights use case at RBC's TechPowHer Hackathon",
    stack: [
      "Generative AI",
      "Real-Time Insights",
      "Document Intelligence",
      "Workflow Automation",
    ],
    accessLabel: "RBC INTERNAL · NO PUBLIC LINK",
    attribution:
      "Team of six RBC co-op students · TechPowHer Hackathon · 1st in our use case · 3rd overall of 22 teams.",
    details: [
      {
        label: "Advisor workflow",
        value:
          "Analyzed live client conversations and documents, captured requirements, and generated tailored investment proposals.",
      },
      {
        label: "Onboarding",
        value:
          "Prepared account-opening information and Investment Policy Statements, with a path to trigger portfolio rebalancing once client funds arrived.",
      },
      {
        label: "Delivery",
        value:
          "Built the proof of concept in one week and presented it live to a panel of four RBC Vice Presidents.",
      },
    ],
  },
  {
    name: "Fish Species Classifier",
    description:
      "TensorFlow/Keras CNN that distinguishes Brook Trout from Smallmouth Bass at 95% accuracy using augmented training data and Grad-CAM explanations.",
    image: "/assets/projects/fish-species-classifier.png",
    alt: "Smallmouth bass used as an input image for the fish species classifier",
    stack: ["Python", "TensorFlow", "Keras"],
    href: "https://github.com/JadenAntM/Fish-Species-Classifier",
  },
];
