import type {
  AmbianceId,
  AppRoleId,
  ConnectionId,
  DeviceId,
  FrequencyId,
  FunctionId,
  MinRoleId,
  ModePrefId,
  OrgToolId,
  PaletteId,
  PermissionActionId,
  RoleId,
  UxNeedId,
  ValidatorId,
} from "./types";

export const MAX_TEXT = 500;
export const MAX_SHORT = 80;
export const MIN_SUBMIT_MS = 8_000;
export const DRAFT_KEY = "fieri-form-draft-v1";

export const ROLES: { id: RoleId; label: string }[] = [
  { id: "membre", label: "Membre / étudiant" },
  { id: "bureau", label: "Bureau du club" },
  { id: "responsable", label: "Responsable / chef de pôle ou projet" },
  { id: "enseignant", label: "Enseignant / encadrant" },
  { id: "autre", label: "Autre" },
];

export const FREQUENCIES: { id: FrequencyId; label: string }[] = [
  { id: "chaque_semaine", label: "Chaque semaine" },
  { id: "quelques_fois_mois", label: "Quelques fois par mois" },
  { id: "rarement", label: "Rarement" },
  { id: "pas_encore", label: "Pas encore" },
];

export const ORG_TOOLS: { id: OrgToolId; label: string }[] = [
  { id: "whatsapp", label: "Groupes WhatsApp" },
  { id: "papier", label: "Papier / cahier" },
  { id: "google", label: "Google Forms / Sheets" },
  { id: "ancienne_plateforme", label: "L'ancienne plateforme FIERI" },
  { id: "bouche_oreille", label: "De bouche à oreille" },
  { id: "autre", label: "Autre" },
];

export const FUNCTIONS: { id: FunctionId; label: string }[] = [
  { id: "annonces", label: "Annonces et actualités" },
  { id: "calendrier", label: "Calendrier d'activités" },
  { id: "ateliers", label: "Inscription aux ateliers" },
  { id: "adhesion", label: "Adhésion / liste des membres" },
  { id: "presences", label: "Présences" },
  { id: "cotisations", label: "Cotisations" },
  { id: "projets", label: "Projets et tâches" },
  { id: "galerie", label: "Galerie photos" },
  { id: "documents", label: "Documents partagés" },
  { id: "messagerie", label: "Messagerie / discussion" },
  { id: "autre", label: "Autre" },
];

export const APP_ROLES: { id: AppRoleId; label: string }[] = [
  { id: "membre", label: "Membre" },
  { id: "bureau", label: "Bureau" },
  { id: "responsable", label: "Responsable" },
  { id: "encadrant", label: "Encadrant" },
];

export const PERMISSION_ACTIONS: { id: PermissionActionId; label: string }[] = [
  { id: "creer_annonce", label: "Créer une annonce" },
  { id: "valider_membre", label: "Valider un nouveau membre" },
  { id: "gerer_cotisations", label: "Gérer les cotisations" },
  { id: "publier_evenement", label: "Publier un événement / atelier" },
  { id: "marquer_presences", label: "Marquer les présences" },
  { id: "gerer_projets", label: "Gérer les projets" },
];

export const MIN_ROLES: { id: MinRoleId; label: string }[] = [
  { id: "membre", label: "Membre" },
  { id: "bureau", label: "Bureau / admin de la CITE" },
  { id: "responsable", label: "Responsable de projet" },
  { id: "encadrant", label: "Encadrant" },
  { id: "visiteur", label: "Visiteur (sans compte)" },
];

export const VALIDATORS: { id: ValidatorId; label: string }[] = [
  { id: "president", label: "Le président" },
  { id: "bureau", label: "Tout le bureau" },
  { id: "responsable_designe", label: "Un responsable désigné" },
  { id: "libre", label: "Personne, inscription libre" },
  { id: "ne_sais_pas", label: "Je ne sais pas" },
];

export const PALETTES: {
  id: PaletteId;
  label: string;
  colors: string[];
}[] = [
  {
    id: "fieri",
    label: "Bleu nuit et orange FIERI",
    colors: ["#0B1220", "#3C85F7", "#E8640C", "#E8ECF4"],
  },
  {
    id: "clair",
    label: "Clair et épuré",
    colors: ["#F7F8FA", "#FFFFFF", "#2563EB", "#111827"],
  },
  {
    id: "vives",
    label: "Couleurs vives",
    colors: ["#111827", "#F59E0B", "#EC4899", "#22D3EE"],
  },
  {
    id: "sombre",
    label: "Sombre et sobre",
    colors: ["#0A0A0A", "#1F2937", "#9CA3AF", "#F9FAFB"],
  },
  {
    id: "vert",
    label: "Vert et nature",
    colors: ["#0F1F17", "#166534", "#86EFAC", "#ECFDF5"],
  },
  { id: "autre", label: "Autre", colors: [] },
];

export const AMBIANCES: { id: AmbianceId; label: string }[] = [
  { id: "serieuse", label: "Sérieuse et pro" },
  { id: "moderne", label: "Moderne et dynamique" },
  { id: "minimaliste", label: "Simple et minimaliste" },
  { id: "fun", label: "Fun et jeune" },
];

export const MODE_PREFS: { id: ModePrefId; label: string }[] = [
  { id: "clair", label: "Clair" },
  { id: "sombre", label: "Sombre" },
  { id: "les_deux", label: "Les deux" },
];

export const UX_NEEDS: { id: UxNeedId; label: string }[] = [
  { id: "rapide", label: "Rapide à comprendre sans aide" },
  { id: "peu_clics", label: "Peu de clics" },
  { id: "lisible_mobile", label: "Très lisible sur téléphone" },
  { id: "connexion_faible", label: "Marche avec une connexion faible" },
  { id: "notifications", label: "Notifications et rappels" },
  { id: "francais_simple", label: "Tout en français simple" },
  { id: "hors_ligne", label: "Fonctionne hors ligne" },
];

export const DEVICES: { id: DeviceId; label: string }[] = [
  { id: "android", label: "Téléphone Android" },
  { id: "iphone", label: "iPhone" },
  { id: "ordinateur", label: "Ordinateur" },
];

export const CONNECTIONS: { id: ConnectionId; label: string }[] = [
  { id: "bonne", label: "Bonne" },
  { id: "moyenne", label: "Moyenne" },
  { id: "faible", label: "Faible" },
];

/** Les rôles qui voient la grille permissions détaillée */
export const DETAILED_PERMISSION_ROLES: RoleId[] = [
  "bureau",
  "responsable",
  "enseignant",
];

export const TOP3_POINTS = [3, 2, 1] as const;
export const RATING_POINTS = {
  indispensable: 2,
  utile: 1,
  pas_besoin: 0,
} as const;

export const ADMIN_COOKIE = "fieri_admin";
export const PERMISSION_THRESHOLD = 0.5;
