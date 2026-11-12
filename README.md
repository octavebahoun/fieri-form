# fieri-form

Formulaire mobile-first pour recueillir les besoins des membres de la **CITE FIERI de l'INSTI** (Bénin). Stack : Next.js (App Router) + TypeScript + Tailwind + Firebase Firestore. Déployable sur Vercel.

Durée cible : **moins de 5 minutes**.

## Prérequis

- Node.js 20+
- Projet Firebase `fieri-form-insti` (Firestore **eur3**, mode production)
- Compte Vercel

## Installation locale

```bash
npm install
cp .env.example .env.local
# remplis les variables (voir ci-dessous)
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Admin : [http://localhost:3000/admin](http://localhost:3000/admin).

Pour tester `/admin` sans Firestore :

```bash
# dans .env.local
USE_MOCK_DATA=true
ADMIN_PASSCODE=demo-local
```

## Variables d'environnement

Noms **exactes** (déjà prévues sur Vercel) :

| Variable | Où | Rôle |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | client | Config Firebase web |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | client | ex. `fieri-form-insti.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | client | `fieri-form-insti` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | client | optionnel |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | client | optionnel |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | client | Config Firebase web |
| `FIREBASE_SERVICE_ACCOUNT` | **serveur** | JSON du compte de service **ou** base64 de ce JSON |
| `ADMIN_PASSCODE` | **serveur** | Code d'accès `/admin` (jamais `NEXT_PUBLIC_`) |

Optionnel : `ADMIN_COOKIE_SECRET`, `USE_MOCK_DATA=true` (données factices en local).

**Aucun secret dans le dépôt** (repo public).

## Firebase

1. Console Firebase → projet `fieri-form-insti`
2. Firestore Database (région **eur3** / europe), mode **production**
3. Crée un compte de service (Paramètres du projet → Comptes de service → Générer une nouvelle clé privée)
4. Colle le JSON **brut** ou son **base64** dans `FIREBASE_SERVICE_ACCOUNT` (Vercel + `.env.local`)
5. Déploie les règles :

```bash
npm i -g firebase-tools
firebase login
firebase use fieri-form-insti
firebase deploy --only firestore:rules
```

Fichiers à la racine : `firebase.json`, `firestore.rules`.

Écriture des réponses : route serveur `POST /api/submit` via **firebase-admin** (collection `reponses`). Les règles interdisent lecture / maj / suppression côté client ; create client seulement si le document passe la validation (défense en profondeur).

## Déploiement Vercel

1. Importe le repo sur Vercel
2. Framework : Next.js (détecté automatiquement)
3. Vérifie les env vars listées plus haut
4. Deploy

Après ajout de `FIREBASE_SERVICE_ACCOUNT`, redéploie pour que les envois et `/admin` fonctionnent.

## Parcours du formulaire

1. Accueil (+ QR / partage)
2. Rôle, fréquence, filière
3. Organisation actuelle
4. Notation des fonctions
5. Top 3
6. Qui peut faire quoi + rôles minimum
7. Design et expérience
8. Usage + contact optionnel
9. Récap / merci

## Admin `/admin`

- Auth par `ADMIN_PASSCODE` → cookie **httpOnly**
- Stats : rôles, classement fonctions, matrice permissions (≥ 50 %), design, UX, verbatims
- Liste des réponses individuelles
- Export **CSV** et **JSON**

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Licence

Code du concours / projet étudiant FIERI — usage interne CITE INSTI.
