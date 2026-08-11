/**
 * Project images remain deliberate placeholders until real screenshots arrive.
 * Their URLs use the site's own neutral palette rather than stock imagery.
 */

export interface Project {
  name: string;
  /** One line. What it does, not why it is exciting. */
  description: string;
  image: string;
  /** Describes the image itself, not the project. */
  alt: string;
  stack: string[];
  href: string;
}

const PLACEHOLDER_IMAGE = (label: string) =>
  `https://placehold.co/1280x800/111111/85857f/png?text=${label}`;

export const PROJECTS: Project[] = [
  {
    name: "PocketSpotter",
    description:
      "Real-time computer-vision fitness assistant that tracks 33 pose landmarks to count reps, assess form and pacing, time rests, overlay live stats, and log workouts to CSV.",
    image: PLACEHOLDER_IMAGE("POCKETSPOTTER"),
    alt: "Placeholder preview for the PocketSpotter interface",
    stack: ["Python", "OpenCV", "MediaPipe", "Flask"],
    href: "https://github.com/kyle174/PocketSpotter",
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
