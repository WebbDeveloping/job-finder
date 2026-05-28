function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatUsTenDigit(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function formatPhoneInput(value: string): string {
  const digits = digitsOnly(value);
  if (digits === "") return "";

  if (digits.length === 11 && digits.startsWith("1")) {
    return `1 ${formatUsTenDigit(digits.slice(1))}`;
  }

  if (digits.length > 11) return value.trim();
  return formatUsTenDigit(digits.slice(0, 10));
}

export function formatPhoneForDisplay(value: string | null | undefined): string {
  const input = value?.trim() ?? "";
  if (input === "") return "";

  const digits = digitsOnly(input);
  if (digits.length === 10) return formatUsTenDigit(digits);
  if (digits.length === 11 && digits.startsWith("1")) {
    return `1 ${formatUsTenDigit(digits.slice(1))}`;
  }
  return input;
}
