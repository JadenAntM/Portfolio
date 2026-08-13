export interface EducationRecord {
  school: string;
  location: string;
  degree: string;
  program: string;
  graduation: string;
  gpa: string;
  honors: string[];
  coursework: string[];
}

export const EDUCATION: EducationRecord = {
  school: "McMaster University",
  location: "Hamilton, ON",
  degree: "Bachelor of Engineering",
  program: "Software Engineering with Co-op",
  graduation: "April 2027",
  gpa: "3.7",
  honors: ["Dean's Honors List — 2023, 2024, 2025"],
  coursework: [
    "Data Structures & Algorithms",
    "Software Architecture",
    "Operating Systems",
    "Software Testing",
  ],
};
