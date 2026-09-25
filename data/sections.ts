export interface SectionMeta {
  /** DOM id and scroll anchor target. */
  id: string;
  /** Sequential marker. Only sections that appear in the nav carry one. */
  index: string | null;
  /** Full name, used for headings and accessible labels. */
  label: string;
  /** Abbreviated form for the narrow left rail. */
  railLabel: string;
  /** Short form used when all section links share the phone-width bottom bar. */
  compactLabel?: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: "index", index: "00", label: "Index", railLabel: "TOP" },
  { id: "experience", index: "01", label: "Work Experience", railLabel: "WORK" },
  {
    id: "projects",
    index: "02",
    label: "Projects",
    railLabel: "PROJECTS",
    compactLabel: "PROJ",
  },
  {
    id: "education",
    index: "03",
    label: "Education",
    railLabel: "EDUCATION",
    compactLabel: "EDU",
  },
  {
    id: "outside-work",
    index: "04",
    label: "Outside Work",
    railLabel: "OUTSIDE",
    compactLabel: "LIFE",
  },
  {
    id: "contact",
    index: "05",
    label: "Contact",
    railLabel: "CONTACT",
    compactLabel: "MAIL",
  },
];

export const NAV_SECTIONS = SECTIONS.filter(
  (section): section is SectionMeta & { index: string } => section.index !== null,
);

export const SECTION_COUNT = SECTIONS.length;
