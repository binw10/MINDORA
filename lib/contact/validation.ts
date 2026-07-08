export type ContactSubmissionInput = {
  email: string;
  locale?: string;
  message: string;
  name: string;
  page?: string;
};

export type ContactSubmission = {
  email: string;
  locale: string | null;
  message: string;
  name: string;
  page: string | null;
};

const maxLengths = {
  email: 254,
  locale: 16,
  message: 3000,
  name: 120,
  page: 240,
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: unknown, maxLength: number) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateContactSubmission(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { data: null, error: "Invalid request payload." } as const;
  }

  const input = payload as Partial<ContactSubmissionInput>;
  const name = normalizeText(input.name).slice(0, maxLengths.name);
  const email = normalizeText(input.email).toLowerCase().slice(0, maxLengths.email);
  const message = normalizeText(input.message).slice(0, maxLengths.message);

  if (!name || !email || !message) {
    return { data: null, error: "Name, email, and message are required." } as const;
  }

  if (!isEmail(email)) {
    return { data: null, error: "Please provide a valid email address." } as const;
  }

  return {
    data: {
      email,
      locale: normalizeOptionalText(input.locale, maxLengths.locale),
      message,
      name,
      page: normalizeOptionalText(input.page, maxLengths.page),
    },
    error: null,
  } as const;
}
