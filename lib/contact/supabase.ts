import type { ContactSubmission } from "@/lib/contact/validation";

const tableName = "contact_submissions";

function normalizeSupabaseUrl(url: string) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return { error: "Supabase environment variables are not configured." } as const;
  }

  return { error: null, serviceRoleKey, url } as const;
}

export async function createContactSubmission(submission: ContactSubmission) {
  const config = getSupabaseConfig();

  if (config.error) {
    return { error: config.error } as const;
  }

  const endpoint = `${normalizeSupabaseUrl(config.url)}/rest/v1/${tableName}`;
  const response = await fetch(endpoint, {
    body: JSON.stringify(submission),
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      error: detail || `Supabase request failed with status ${response.status}.`,
    } as const;
  }

  return { error: null } as const;
}
