import {
  AMBIANCES,
  CONNECTIONS,
  DEVICES,
  DETAILED_PERMISSION_ROLES,
  FREQUENCIES,
  FUNCTIONS,
  MAX_SHORT,
  MAX_TEXT,
  MIN_ROLES,
  MIN_SUBMIT_MS,
  MODE_PREFS,
  ORG_TOOLS,
  PALETTES,
  PERMISSION_ACTIONS,
  ROLES,
  UX_NEEDS,
  VALIDATORS,
  APP_ROLES,
} from "./constants";
import type { FormAnswers, FunctionId, RoleId } from "./types";

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isOneOf<T extends string>(value: unknown, ids: T[]): value is T {
  return typeof value === "string" && ids.includes(value as T);
}

export function sanitizeAnswers(raw: unknown): FormAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  const roleIds = ROLES.map((r) => r.id);
  const freqIds = FREQUENCIES.map((f) => f.id);
  const orgIds = ORG_TOOLS.map((o) => o.id);
  const fnIds = FUNCTIONS.map((f) => f.id);
  const actionIds = PERMISSION_ACTIONS.map((a) => a.id);
  const appRoleIds = APP_ROLES.map((r) => r.id);
  const minRoleIds = MIN_ROLES.map((r) => r.id);
  const validatorIds = VALIDATORS.map((v) => v.id);
  const paletteIds = PALETTES.map((p) => p.id);
  const ambianceIds = AMBIANCES.map((a) => a.id);
  const modeIds = MODE_PREFS.map((m) => m.id);
  const uxIds = UX_NEEDS.map((u) => u.id);
  const deviceIds = DEVICES.map((d) => d.id);
  const connectionIds = CONNECTIONS.map((c) => c.id);

  const orgTools = Array.isArray(data.orgTools)
    ? data.orgTools.filter((id): id is (typeof orgIds)[number] =>
        isOneOf(id, orgIds),
      )
    : [];

  const functionRatings: FormAnswers["functionRatings"] = {};
  if (data.functionRatings && typeof data.functionRatings === "object") {
    for (const [key, value] of Object.entries(
      data.functionRatings as Record<string, unknown>,
    )) {
      if (
        isOneOf(key, fnIds) &&
        (value === "indispensable" || value === "utile" || value === "pas_besoin")
      ) {
        functionRatings[key] = value;
      }
    }
  }

  const top3 = Array.isArray(data.top3)
    ? data.top3
        .filter((id): id is FunctionId => isOneOf(id, fnIds))
        .slice(0, 3)
    : [];

  const permissions: FormAnswers["permissions"] = {};
  if (data.permissions && typeof data.permissions === "object") {
    for (const [action, roles] of Object.entries(
      data.permissions as Record<string, unknown>,
    )) {
      if (!isOneOf(action, actionIds) || !Array.isArray(roles)) continue;
      permissions[action] = roles.filter((r): r is (typeof appRoleIds)[number] =>
        isOneOf(r, appRoleIds),
      );
    }
  }

  const minRoles = Array.isArray(data.minRoles)
    ? data.minRoles.filter((id): id is (typeof minRoleIds)[number] =>
        isOneOf(id, minRoleIds),
      )
    : [];

  const uxNeeds = Array.isArray(data.uxNeeds)
    ? data.uxNeeds.filter((id): id is (typeof uxIds)[number] =>
        isOneOf(id, uxIds),
      )
    : [];

  return {
    prenom: clip(data.prenom, MAX_SHORT),
    role: isOneOf(data.role, roleIds) ? data.role : "",
    roleAutre: clip(data.roleAutre, MAX_SHORT),
    filiere: clip(data.filiere, MAX_SHORT),
    annee: clip(data.annee, MAX_SHORT),
    frequence: isOneOf(data.frequence, freqIds) ? data.frequence : "",
    orgTools,
    orgAutre: clip(data.orgAutre, MAX_SHORT),
    bloque: clip(data.bloque, MAX_TEXT),
    functionRatings,
    functionAutre: clip(data.functionAutre, MAX_TEXT),
    top3,
    permissions,
    minRoles,
    validator: isOneOf(data.validator, validatorIds) ? data.validator : "",
    palette: isOneOf(data.palette, paletteIds) ? data.palette : "",
    paletteCustom: clip(data.paletteCustom, 20),
    ambiance: isOneOf(data.ambiance, ambianceIds) ? data.ambiance : "",
    modePref: isOneOf(data.modePref, modeIds) ? data.modePref : "",
    uxNeeds,
    agace: clip(data.agace, MAX_TEXT),
    appliAimee: clip(data.appliAimee, MAX_TEXT),
    device: isOneOf(data.device, deviceIds) ? data.device : "",
    connexion: isOneOf(data.connexion, connectionIds) ? data.connexion : "",
    troisChoses: clip(data.troisChoses, MAX_TEXT),
    contactPrenom: clip(data.contactPrenom, MAX_SHORT),
    contactWhatsapp: clip(data.contactWhatsapp, MAX_SHORT),
    website: clip(data.website, MAX_SHORT),
    startedAt:
      typeof data.startedAt === "number" && Number.isFinite(data.startedAt)
        ? data.startedAt
        : 0,
  };
}

export type ValidationError = { field: string; message: string };

export function validateForSubmit(answers: FormAnswers): ValidationError[] {
  const errors: ValidationError[] = [];

  if (answers.website) {
    errors.push({ field: "website", message: "Spam détecté." });
  }

  if (!answers.startedAt || Date.now() - answers.startedAt < MIN_SUBMIT_MS) {
    errors.push({
      field: "startedAt",
      message: "Envoi trop rapide. Reprends tranquillement.",
    });
  }

  if (!answers.role) {
    errors.push({ field: "role", message: "Choisis ton rôle." });
  }

  if (!answers.frequence) {
    errors.push({ field: "frequence", message: "Indique ta fréquence." });
  }

  const rated = Object.keys(answers.functionRatings);
  if (rated.length < 3) {
    errors.push({
      field: "functionRatings",
      message: "Note au moins quelques fonctions.",
    });
  }

  if (answers.top3.length !== 3) {
    errors.push({ field: "top3", message: "Choisis exactement 3 priorités." });
  }

  if (answers.minRoles.length === 0) {
    errors.push({ field: "minRoles", message: "Choisis au moins un rôle minimum." });
  }

  if (!answers.palette) {
    errors.push({ field: "palette", message: "Choisis une palette." });
  }

  if (!answers.ambiance) {
    errors.push({ field: "ambiance", message: "Choisis une ambiance." });
  }

  if (!answers.modePref) {
    errors.push({ field: "modePref", message: "Choisis un mode d'affichage." });
  }

  if (!answers.device) {
    errors.push({ field: "device", message: "Indique ton appareil." });
  }

  if (!answers.connexion) {
    errors.push({ field: "connexion", message: "Indique ta connexion." });
  }

  return errors;
}

export function needsDetailedPermissions(role: RoleId | ""): boolean {
  return role !== "" && DETAILED_PERMISSION_ROLES.includes(role);
}

export function eligibleForTop3(
  ratings: FormAnswers["functionRatings"],
): FunctionId[] {
  return FUNCTIONS.map((f) => f.id).filter((id) => {
    const rating = ratings[id];
    return rating === "indispensable" || rating === "utile";
  });
}
