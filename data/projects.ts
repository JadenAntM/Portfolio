/**
 * Project images remain deliberate placeholders until real screenshots arrive.
 * Their URLs use the site's own neutral palette rather than stock imagery.
 */

export interface Project {
  name: string;
  subtitle?: string;
  /** One line. What it does, not why it is exciting. */
  description: string;
  image: string;
  /** Describes the image itself, not the project. */
  alt: string;
  stack: string[];
  href: string;
  attribution?: string;
  details?: {
    label: string;
    value: string;
  }[];
  sourceCodeHref?: string;
  liveDemoHref?: string;
}

const PLACEHOLDER_IMAGE = (label: string) =>
  `https://placehold.co/1280x800/111111/85857f/png?text=${label}`;

export const PROJECTS: Project[] = [
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
    name: "Fish Species Classifier",
    description:
      "TensorFlow/Keras CNN that distinguishes Brook Trout from Smallmouth Bass at 95% accuracy using augmented training data and Grad-CAM explanations.",
    image: PLACEHOLDER_IMAGE("FISH_CLASSIFIER"),
    alt: "Placeholder preview for the Fish Species Classifier",
    stack: ["Python", "TensorFlow", "Keras"],
    href: "https://github.com/JadenAntM/Fish-Species-Classifier",
  },
];
