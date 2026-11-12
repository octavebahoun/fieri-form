export type RoleId =
  | "membre"
  | "bureau"
  | "responsable"
  | "enseignant"
  | "autre";

export type FrequencyId =
  | "chaque_semaine"
  | "quelques_fois_mois"
  | "rarement"
  | "pas_encore";

export type OrgToolId =
  | "whatsapp"
  | "papier"
  | "google"
  | "ancienne_plateforme"
  | "bouche_oreille"
  | "autre";

export type FunctionId =
  | "annonces"
  | "calendrier"
  | "ateliers"
  | "adhesion"
  | "presences"
  | "cotisations"
  | "projets"
  | "galerie"
  | "documents"
  | "messagerie"
  | "autre";

export type FunctionRating = "indispensable" | "utile" | "pas_besoin";

export type AppRoleId = "membre" | "bureau" | "responsable" | "encadrant";

export type PermissionActionId =
  | "creer_annonce"
  | "valider_membre"
  | "gerer_cotisations"
  | "publier_evenement"
  | "marquer_presences"
  | "gerer_projets";

export type MinRoleId =
  | "membre"
  | "bureau"
  | "responsable"
  | "encadrant"
  | "visiteur";

export type ValidatorId =
  | "president"
  | "bureau"
  | "responsable_designe"
  | "libre"
  | "ne_sais_pas";

export type PaletteId =
  | "fieri"
  | "clair"
  | "vives"
  | "sombre"
  | "vert"
  | "autre";

export type AmbianceId =
  | "serieuse"
  | "moderne"
  | "minimaliste"
  | "fun";

export type ModePrefId = "clair" | "sombre" | "les_deux";

export type UxNeedId =
  | "rapide"
  | "peu_clics"
  | "lisible_mobile"
  | "connexion_faible"
  | "notifications"
  | "francais_simple"
  | "hors_ligne";

export type DeviceId = "android" | "iphone" | "ordinateur";

export type ConnectionId = "bonne" | "moyenne" | "faible";

export type FormAnswers = {
  prenom: string;
  role: RoleId | "";
  roleAutre: string;
  filiere: string;
  annee: string;
  frequence: FrequencyId | "";
  orgTools: OrgToolId[];
  orgAutre: string;
  bloque: string;
  functionRatings: Partial<Record<FunctionId, FunctionRating>>;
  functionAutre: string;
  top3: FunctionId[];
  permissions: Partial<Record<PermissionActionId, AppRoleId[]>>;
  minRoles: MinRoleId[];
  validator: ValidatorId | "";
  palette: PaletteId | "";
  paletteCustom: string;
  ambiance: AmbianceId | "";
  modePref: ModePrefId | "";
  uxNeeds: UxNeedId[];
  agace: string;
  appliAimee: string;
  device: DeviceId | "";
  connexion: ConnectionId | "";
  troisChoses: string;
  contactPrenom: string;
  contactWhatsapp: string;
  /** Honeypot anti-spam — doit rester vide */
  website: string;
  startedAt: number;
};

export type StoredResponse = FormAnswers & {
  id?: string;
  createdAt?: string;
  schemaVersion: number;
};

export const EMPTY_ANSWERS: FormAnswers = {
  prenom: "",
  role: "",
  roleAutre: "",
  filiere: "",
  annee: "",
  frequence: "",
  orgTools: [],
  orgAutre: "",
  bloque: "",
  functionRatings: {},
  functionAutre: "",
  top3: [],
  permissions: {},
  minRoles: [],
  validator: "",
  palette: "",
  paletteCustom: "",
  ambiance: "",
  modePref: "",
  uxNeeds: [],
  agace: "",
  appliAimee: "",
  device: "",
  connexion: "",
  troisChoses: "",
  contactPrenom: "",
  contactWhatsapp: "",
  website: "",
  startedAt: 0,
};

export const SCHEMA_VERSION = 1;
