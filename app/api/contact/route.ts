import { NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/contact/supabase";
import { validateContactSubmission } from "@/lib/contact/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const validation = validateContactSubmission(payload);

  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const result = await createContactSubmission(validation.data);

  if (result.error) {
    console.error("Contact submission failed:", result.error);
    return NextResponse.json(
      { error: "Unable to submit the form right now. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
