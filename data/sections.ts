export interface SectionMeta {
  /** DOM id and scroll anchor target. */
  id: string;
  /** Sequential marker. Only sections that appear in the nav carry one. */
  index: string | null;
  /** Full name, used for headings and accessible labels. */
  label: string;
  /** Abbreviated form for the narrow left rail. */
  railLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: "index", index: null, label: "Index", railLabel: "IDX" },
  { id: "experience", index: "01", label: "Work Experience", railLabel: "WORK" },
  { id: "projects", index: "02", label: "Projects", railLabel: "PROJ" },
  { id: "education", index: "03", label: "Education", railLabel: "EDU" },
  { id: "contact", index: "04", label: "Contact", railLabel: "CONTACT" },
];

export const NAV_SECTIONS = SECTIONS.filter(
  (section): section is SectionMeta & { index: string } => section.index !== null,
);

export const SECTION_COUNT = SECTIONS.length;
