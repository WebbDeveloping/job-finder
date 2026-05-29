import { formatPhoneForDisplay } from "@/lib/phone-format";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

function readField(
  form: HTMLFormElement | null,
  name: string,
  defaultValue: string,
): string {
  if (!form) return defaultValue;
  const field = form.elements.namedItem(name);
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
  ) {
    return field.value;
  }
  return defaultValue;
}

function readOptionalField(
  form: HTMLFormElement | null,
  name: string,
  fallback: string | null,
): string | null {
  const value = readField(form, name, fallback ?? "");
  return value.trim() || null;
}

export function readFormCoverLetterData(
  form: HTMLFormElement | null,
  fallback: CoverLetterFormData,
): CoverLetterFormData {
  return {
    label: readField(form, "label", fallback.label),
    fullName: readField(form, "fullName", fallback.fullName),
    email: readField(form, "email", fallback.email),
    phone:
      formatPhoneForDisplay(readField(form, "phone", fallback.phone ?? "")) ||
      null,
    location: readOptionalField(form, "location", fallback.location),
    letterDate: readOptionalField(form, "letterDate", fallback.letterDate),
    recipientName: readOptionalField(
      form,
      "recipientName",
      fallback.recipientName,
    ),
    recipientTitle: readOptionalField(
      form,
      "recipientTitle",
      fallback.recipientTitle,
    ),
    company: readOptionalField(form, "company", fallback.company),
    companyAddress: readOptionalField(
      form,
      "companyAddress",
      fallback.companyAddress,
    ),
    salutation: readField(form, "salutation", fallback.salutation),
    body: readField(form, "body", fallback.body),
    closing: readField(form, "closing", fallback.closing),
  };
}
