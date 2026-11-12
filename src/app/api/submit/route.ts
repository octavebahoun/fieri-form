import { NextResponse } from "next/server";
import { saveResponse } from "@/lib/responses";
import { sanitizeAnswers, validateForSubmit } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const answers = sanitizeAnswers(body);
  if (!answers) {
    return NextResponse.json(
      { ok: false, error: "Données invalides." },
      { status: 400 },
    );
  }

  const errors = validateForSubmit(answers);
  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, error: errors[0]!.message },
      { status: 400 },
    );
  }

  const result = await saveResponse(answers);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Enregistrement impossible pour le moment. Vérifie FIREBASE_SERVICE_ACCOUNT côté serveur.",
        detail: result.reason,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
