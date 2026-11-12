import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isMockDataEnabled } from "./firebase-admin";
import { MOCK_RESPONSES } from "./mock-data";
import { SCHEMA_VERSION, type FormAnswers, type StoredResponse } from "./types";

export async function saveResponse(
  answers: FormAnswers,
): Promise<{ ok: true; id: string } | { ok: false; reason: string }> {
  if (isMockDataEnabled()) {
    return { ok: true, id: `mock-${Date.now()}` };
  }

  const admin = getAdminDb();
  if (!admin.ok) {
    return { ok: false, reason: admin.reason };
  }

  const payload = { ...answers };
  delete (payload as { website?: string }).website;
  delete (payload as { startedAt?: number }).startedAt;

  try {
    const ref = await admin.db.collection("reponses").add({
      ...payload,
      schemaVersion: SCHEMA_VERSION,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { ok: true, id: ref.id };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Écriture impossible",
    };
  }
}

export async function listResponses(): Promise<
  | { ok: true; responses: StoredResponse[]; source: "firestore" | "mock" }
  | { ok: false; reason: string }
> {
  if (isMockDataEnabled()) {
    return { ok: true, responses: MOCK_RESPONSES, source: "mock" };
  }

  const admin = getAdminDb();
  if (!admin.ok) {
    return { ok: false, reason: admin.reason };
  }

  try {
    const snap = await admin.db
      .collection("reponses")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const responses: StoredResponse[] = snap.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.()
        ? data.createdAt.toDate().toISOString()
        : undefined;
      return {
        ...(data as FormAnswers),
        id: doc.id,
        createdAt,
        schemaVersion: data.schemaVersion ?? SCHEMA_VERSION,
        website: "",
        startedAt: 0,
      };
    });

    return { ok: true, responses, source: "firestore" };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Lecture impossible",
    };
  }
}
