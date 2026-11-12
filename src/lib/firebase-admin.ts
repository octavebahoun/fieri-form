import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export type AdminStatus =
  | { ok: true; app: App }
  | { ok: false; reason: string };

function parseServiceAccount():
  | { ok: true; credentials: Record<string, string> }
  | { ok: false; reason: string } {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (!raw) {
    return {
      ok: false,
      reason:
        "FIREBASE_SERVICE_ACCOUNT manquant. Ajoute le JSON du compte de service (ou sa version base64) dans les variables d'environnement.",
    };
  }

  try {
    const json =
      raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json) as Record<string, string>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      return {
        ok: false,
        reason:
          "FIREBASE_SERVICE_ACCOUNT incomplet (project_id, client_email, private_key requis).",
      };
    }
    return { ok: true, credentials: parsed };
  } catch {
    return {
      ok: false,
      reason:
        "FIREBASE_SERVICE_ACCOUNT illisible. Vérifie que c'est un JSON valide ou du base64.",
    };
  }
}

export function getAdminStatus(): AdminStatus {
  if (getApps().length > 0) {
    return { ok: true, app: getApps()[0]! };
  }

  const parsed = parseServiceAccount();
  if (!parsed.ok) {
    // Fallback rare : ADC en local
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      try {
        const app = initializeApp({ credential: applicationDefault() });
        return { ok: true, app };
      } catch {
        return parsed;
      }
    }
    return parsed;
  }

  try {
    const app = initializeApp({
      credential: cert({
        projectId: parsed.credentials.project_id,
        clientEmail: parsed.credentials.client_email,
        privateKey: parsed.credentials.private_key.replace(/\\n/g, "\n"),
      }),
    });
    return { ok: true, app };
  } catch (error) {
    return {
      ok: false,
      reason: `Impossible d'initialiser Firebase Admin : ${
        error instanceof Error ? error.message : "erreur inconnue"
      }`,
    };
  }
}

export function getAdminDb() {
  const status = getAdminStatus();
  if (!status.ok) return status;
  return { ok: true as const, db: getFirestore(status.app) };
}

export function isMockDataEnabled(): boolean {
  return process.env.USE_MOCK_DATA === "true";
}
