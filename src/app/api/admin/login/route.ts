import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminToken,
  isAdminConfigured,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ADMIN_PASSCODE n'est pas configuré sur le serveur. Ajoute-le dans les variables d'environnement Vercel.",
      },
      { status: 503 },
    );
  }

  let passcode = "";
  try {
    const body = (await request.json()) as { passcode?: string };
    passcode = body.passcode?.trim() ?? "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const token = createAdminToken(passcode);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Code incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
