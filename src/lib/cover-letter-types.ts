export type CoverLetterFormData = {
  label: string;
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  letterDate: string | null;
  recipientName: string | null;
  recipientTitle: string | null;
  company: string | null;
  companyAddress: string | null;
  salutation: string;
  body: string;
  closing: string;
};

export const EMPTY_COVER_LETTER: CoverLetterFormData = {
  label: "",
  fullName: "",
  email: "",
  phone: null,
  location: null,
  letterDate: null,
  recipientName: null,
  recipientTitle: null,
  company: null,
  companyAddress: null,
  salutation: "Dear Hiring Manager,",
  body: "",
  closing: "Sincerely,",
};

export type CoverLetterLibraryItem = {
  id: string;
  label: string;
  updatedAt: string;
};

export function getCoverLetterPdfApiUrl(coverLetterId: string): string {
  return `/api/cover-letter/pdf?coverLetterId=${encodeURIComponent(coverLetterId)}`;
}
