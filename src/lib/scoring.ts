import {
  AMBIANCES,
  APP_ROLES,
  CONNECTIONS,
  DEVICES,
  FREQUENCIES,
  FUNCTIONS,
  MIN_ROLES,
  MODE_PREFS,
  PALETTES,
  PERMISSION_ACTIONS,
  PERMISSION_THRESHOLD,
  RATING_POINTS,
  ROLES,
  TOP3_POINTS,
  UX_NEEDS,
  VALIDATORS,
} from "./constants";
import type {
  FormAnswers,
  FunctionId,
  PermissionActionId,
  StoredResponse,
  AppRoleId,
} from "./types";

function countBy<T extends string>(
  items: T[],
  labels: { id: T; label: string }[],
): { id: T; label: string; count: number }[] {
  const map = new Map<T, number>();
  for (const item of items) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return labels.map((l) => ({
    id: l.id,
    label: l.label,
    count: map.get(l.id) ?? 0,
  }));
}

export type FunctionScore = {
  id: FunctionId;
  label: string;
  ratingScore: number;
  top3Score: number;
  total: number;
  indispensable: number;
  utile: number;
  pas_besoin: number;
  top1: number;
  top2: number;
  top3: number;
};

export type PermissionCell = {
  actionId: PermissionActionId;
  actionLabel: string;
  roleId: AppRoleId;
  roleLabel: string;
  count: number;
  percent: number;
  retained: boolean;
};

export type DashboardStats = {
  total: number;
  roles: { id: string; label: string; count: number }[];
  frequencies: { id: string; label: string; count: number }[];
  functions: FunctionScore[];
  minRoles: { id: string; label: string; count: number }[];
  validators: { id: string; label: string; count: number }[];
  permissions: PermissionCell[];
  palettes: { id: string; label: string; count: number }[];
  customColors: string[];
  ambiances: { id: string; label: string; count: number }[];
  modes: { id: string; label: string; count: number }[];
  uxNeeds: { id: string; label: string; count: number }[];
  devices: { id: string; label: string; count: number }[];
  connexions: { id: string; label: string; count: number }[];
  verbatims: {
    bloque: string[];
    functionAutre: string[];
    troisChoses: string[];
    agace: string[];
    appliAimee: string[];
  };
  responses: StoredResponse[];
};

export function computeStats(responses: StoredResponse[]): DashboardStats {
  const total = responses.length;

  const functionScores: FunctionScore[] = FUNCTIONS.map((fn) => ({
    id: fn.id,
    label: fn.label,
    ratingScore: 0,
    top3Score: 0,
    total: 0,
    indispensable: 0,
    utile: 0,
    pas_besoin: 0,
    top1: 0,
    top2: 0,
    top3: 0,
  }));
  const byId = new Map(functionScores.map((f) => [f.id, f]));

  const permissionCounts = new Map<string, number>();
  for (const action of PERMISSION_ACTIONS) {
    for (const role of APP_ROLES) {
      permissionCounts.set(`${action.id}:${role.id}`, 0);
    }
  }

  const customColors: string[] = [];
  const verbatims = {
    bloque: [] as string[],
    functionAutre: [] as string[],
    troisChoses: [] as string[],
    agace: [] as string[],
    appliAimee: [] as string[],
  };

  for (const response of responses) {
    for (const [fnId, rating] of Object.entries(response.functionRatings)) {
      const row = byId.get(fnId as FunctionId);
      if (!row || !rating) continue;
      row[rating] += 1;
      row.ratingScore += RATING_POINTS[rating];
    }

    response.top3.forEach((fnId, index) => {
      const row = byId.get(fnId);
      if (!row) return;
      const points = TOP3_POINTS[index] ?? 0;
      row.top3Score += points;
      if (index === 0) row.top1 += 1;
      if (index === 1) row.top2 += 1;
      if (index === 2) row.top3 += 1;
    });

    for (const [action, roles] of Object.entries(response.permissions)) {
      for (const role of roles ?? []) {
        const key = `${action}:${role}`;
        permissionCounts.set(key, (permissionCounts.get(key) ?? 0) + 1);
      }
    }

    if (response.palette === "autre" && response.paletteCustom) {
      customColors.push(response.paletteCustom);
    }

    if (response.bloque) verbatims.bloque.push(response.bloque);
    if (response.functionAutre) verbatims.functionAutre.push(response.functionAutre);
    if (response.troisChoses) verbatims.troisChoses.push(response.troisChoses);
    if (response.agace) verbatims.agace.push(response.agace);
    if (response.appliAimee) verbatims.appliAimee.push(response.appliAimee);
  }

  for (const row of functionScores) {
    row.total = row.ratingScore + row.top3Score;
  }
  functionScores.sort((a, b) => b.total - a.total || b.top3Score - a.top3Score);

  const permissions: PermissionCell[] = [];
  for (const action of PERMISSION_ACTIONS) {
    for (const role of APP_ROLES) {
      const count = permissionCounts.get(`${action.id}:${role.id}`) ?? 0;
      const percent = total === 0 ? 0 : count / total;
      permissions.push({
        actionId: action.id,
        actionLabel: action.label,
        roleId: role.id,
        roleLabel: role.label,
        count,
        percent,
        retained: percent >= PERMISSION_THRESHOLD,
      });
    }
  }

  return {
    total,
    roles: countBy(
      responses.map((r) => r.role).filter(Boolean) as FormAnswers["role"][],
      ROLES,
    ),
    frequencies: countBy(
      responses
        .map((r) => r.frequence)
        .filter(Boolean) as FormAnswers["frequence"][],
      FREQUENCIES,
    ),
    functions: functionScores,
    minRoles: countBy(
      responses.flatMap((r) => r.minRoles),
      MIN_ROLES,
    ).sort((a, b) => b.count - a.count),
    validators: countBy(
      responses
        .map((r) => r.validator)
        .filter(Boolean) as FormAnswers["validator"][],
      VALIDATORS,
    ),
    permissions,
    palettes: countBy(
      responses.map((r) => r.palette).filter(Boolean) as FormAnswers["palette"][],
      PALETTES.map((p) => ({ id: p.id, label: p.label })),
    ).sort((a, b) => b.count - a.count),
    customColors,
    ambiances: countBy(
      responses
        .map((r) => r.ambiance)
        .filter(Boolean) as FormAnswers["ambiance"][],
      AMBIANCES,
    ),
    modes: countBy(
      responses
        .map((r) => r.modePref)
        .filter(Boolean) as FormAnswers["modePref"][],
      MODE_PREFS,
    ),
    uxNeeds: countBy(responses.flatMap((r) => r.uxNeeds), UX_NEEDS).sort(
      (a, b) => b.count - a.count,
    ),
    devices: countBy(
      responses.map((r) => r.device).filter(Boolean) as FormAnswers["device"][],
      DEVICES,
    ),
    connexions: countBy(
      responses
        .map((r) => r.connexion)
        .filter(Boolean) as FormAnswers["connexion"][],
      CONNECTIONS,
    ),
    verbatims,
    responses,
  };
}

export function responsesToCsv(responses: StoredResponse[]): string {
  const ratingHeaders = FUNCTIONS.map((fn) => `rating_${fn.id}`);
  const permissionHeaders = PERMISSION_ACTIONS.map(
    (action) => `perm_${action.id}`,
  );

  const headers = [
    "id",
    "createdAt",
    "schemaVersion",
    "prenom",
    "role",
    "roleAutre",
    "filiere",
    "annee",
    "frequence",
    "orgTools",
    "orgAutre",
    "bloque",
    ...ratingHeaders,
    "functionAutre",
    "top3",
    ...permissionHeaders,
    "minRoles",
    "validator",
    "palette",
    "paletteCustom",
    "ambiance",
    "modePref",
    "uxNeeds",
    "device",
    "connexion",
    "troisChoses",
    "agace",
    "appliAimee",
    "contactPrenom",
    "contactWhatsapp",
  ];

  const escape = (value: unknown) => {
    const text = value == null ? "" : String(value);
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };

  const lines = [headers.join(",")];
  for (const r of responses) {
    const ratingCells = FUNCTIONS.map(
      (fn) => r.functionRatings?.[fn.id] ?? "",
    );
    const permissionCells = PERMISSION_ACTIONS.map((action) =>
      (r.permissions?.[action.id] ?? []).join("|"),
    );

    lines.push(
      [
        r.id ?? "",
        r.createdAt ?? "",
        r.schemaVersion ?? "",
        r.prenom,
        r.role,
        r.roleAutre,
        r.filiere,
        r.annee,
        r.frequence,
        r.orgTools.join("|"),
        r.orgAutre,
        r.bloque,
        ...ratingCells,
        r.functionAutre,
        r.top3.join("|"),
        ...permissionCells,
        r.minRoles.join("|"),
        r.validator,
        r.palette,
        r.paletteCustom,
        r.ambiance,
        r.modePref,
        r.uxNeeds.join("|"),
        r.device,
        r.connexion,
        r.troisChoses,
        r.agace,
        r.appliAimee,
        r.contactPrenom,
        r.contactWhatsapp,
      ]
        .map(escape)
        .join(","),
    );
  }

  // BOM UTF-8 pour Excel (FR) ; séparateur virgule conservé
  return `\uFEFF${lines.join("\n")}`;
}
