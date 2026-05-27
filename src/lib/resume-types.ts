export type ResumeExperienceEntry = {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string;
};

export type ResumeEducationEntry = {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

export type ResumeProfileFormData = {
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedIn: string | null;
  github: string | null;
  summary: string;
  skills: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
};

export const EMPTY_EXPERIENCE: ResumeExperienceEntry = {
  id: "",
  company: "",
  title: "",
  location: "",
  startDate: "",
  endDate: "",
  highlights: "",
};

export const EMPTY_EDUCATION: ResumeEducationEntry = {
  id: "",
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
};

export function resumeKindHint(kind: "BUILT" | "UPLOADED"): string {
  return kind === "BUILT" ? "Built" : "PDF";
}

export function getResumeFileApiUrl(
  resumeId: string,
  kind: "BUILT" | "UPLOADED",
): string {
  return kind === "BUILT"
    ? `/api/resume/pdf?resumeId=${encodeURIComponent(resumeId)}`
    : `/api/resume/file/${encodeURIComponent(resumeId)}`;
}

export type ResumeLibraryItem = {
  id: string;
  kind: "BUILT" | "UPLOADED";
  label: string;
  isDefault: boolean;
  updatedAt: string;
};
