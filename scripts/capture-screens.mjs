import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/opt/cursor/artifacts";
await mkdir(OUT, { recursive: true });

const draftBase = {
  prenom: "Aïcha",
  role: "bureau",
  roleAutre: "",
  filiere: "Info",
  annee: "L2",
  frequence: "chaque_semaine",
  orgTools: ["whatsapp"],
  orgAutre: "",
  bloque: "Trop de groupes",
  functionRatings: {
    annonces: "indispensable",
    calendrier: "indispensable",
    ateliers: "utile",
    adhesion: "indispensable",
    presences: "utile",
    cotisations: "utile",
    projets: "utile",
    galerie: "pas_besoin",
    documents: "utile",
    messagerie: "pas_besoin",
    autre: "pas_besoin",
  },
  functionAutre: "",
  top3: ["annonces", "adhesion", "calendrier"],
  permissions: {
    creer_annonce: ["bureau"],
    valider_membre: ["bureau"],
    gerer_cotisations: ["bureau"],
    publier_evenement: ["bureau", "responsable"],
    marquer_presences: ["responsable", "bureau"],
    gerer_projets: ["responsable"],
  },
  minRoles: ["membre", "bureau", "visiteur"],
  validator: "bureau",
  palette: "fieri",
  paletteCustom: "",
  ambiance: "moderne",
  modePref: "sombre",
  uxNeeds: ["lisible_mobile", "connexion_faible"],
  agace: "",
  appliAimee: "",
  device: "android",
  connexion: "faible",
  troisChoses: "Annonces, adhésion, calendrier",
  contactPrenom: "",
  contactWhatsapp: "",
  website: "",
  startedAt: Date.now() - 60_000,
};

const browser = await chromium.launch({ headless: true });

async function shot(page, name) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log("saved", path);
}

async function openAtStep(step) {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
  });
  await context.addInitScript(
    ([d, s]) => {
      localStorage.setItem(
        "fieri-form-draft-v1",
        JSON.stringify({ ...d, __step: s }),
      );
    },
    [draftBase, step],
  );
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  return { context, page };
}

{
  const { context, page } = await openAtStep(0);
  await shot(page, "01-accueil-qr");
  await context.close();
}

{
  const { context, page } = await openAtStep(5);
  await shot(page, "02-qui-fait-quoi");
  await context.close();
}

{
  const { context, page } = await openAtStep(6);
  await shot(page, "03-design");
  await context.close();
}

{
  const { context, page } = await openAtStep(8);
  await page.getByRole("button", { name: "Envoyer" }).click();
  await page.waitForSelector("text=Merci", { timeout: 10000 });
  await page.waitForTimeout(700);
  await shot(page, "04-merci");
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/admin", { waitUntil: "networkidle" });
  await page.fill("#passcode", "demo-local");
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.waitForSelector("text=Vue d'ensemble", { timeout: 10000 });
  await page.waitForTimeout(500);
  await shot(page, "05-admin");
  await context.close();
}

await browser.close();
console.log("done");
