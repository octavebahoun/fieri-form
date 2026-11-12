import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { withNoStore } from "@/lib/http";
import { listResponses } from "@/lib/responses";
import { responsesToCsv } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { ok: false, error: "Non autorisé." },
      { status: 401, headers: withNoStore() },
    );
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "json" ? "json" : "csv";

  const listed = await listResponses();
  if (!listed.ok) {
    return NextResponse.json(
      { ok: false, error: listed.reason },
      { status: 503, headers: withNoStore() },
    );
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(listed.responses, null, 2), {
      headers: withNoStore({
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="fieri-reponses.json"',
      }),
    });
  }

  const csv = responsesToCsv(listed.responses);
  return new NextResponse(csv, {
    headers: withNoStore({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fieri-reponses.csv"',
    }),
  });
}
