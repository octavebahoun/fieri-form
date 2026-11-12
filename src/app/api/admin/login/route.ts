import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminToken,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { withNoStore } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "ADMIN_PASSCODE n'est pas configuré sur le serveur. Ajoute-le dans les variables d'environnement Vercel.",
      },
      { status: 503, headers: withNoStore() },
    );
  }

  let passcode = "";
  try {
    const body = (await request.json()) as { passcode?: string };
    passcode = body.passcode?.trim() ?? "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400, headers: withNoStore() },
    );
  }

  const token = createAdminToken(passcode);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Code incorrect." },
      { status: 401, headers: withNoStore() },
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: withNoStore() },
  );
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
