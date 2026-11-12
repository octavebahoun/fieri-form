"use client";

import { StepTitle } from "@/components/ui";
import {
  AMBIANCES,
  DEVICES,
  FUNCTIONS,
  MIN_ROLES,
  MODE_PREFS,
  PALETTES,
  ROLES,
} from "@/lib/constants";
import type { FormAnswers } from "@/lib/types";

function labelOf<T extends string>(
  id: T | "",
  items: { id: T; label: string }[],
): string {
  if (!id) return "—";
  return items.find((i) => i.id === id)?.label ?? id;
}

export function RecapStep({ answers }: { answers: FormAnswers }) {
  const role = labelOf(answers.role, ROLES);
  const top3 = answers.top3
    .map((id, i) => `${i + 1}. ${FUNCTIONS.find((f) => f.id === id)?.label}`)
    .join(" · ");
  const minRoles = answers.minRoles
    .map((id) => MIN_ROLES.find((r) => r.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      <StepTitle
        title="Récap avant envoi"
        subtitle="Vérifie vite, puis envoie. Tu pourras encore revenir en arrière."
      />
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-muted">Rôle</dt>
          <dd className="font-medium">
            {answers.prenom ? `${answers.prenom} · ` : ""}
            {role}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Top 3</dt>
          <dd className="font-medium">{top3 || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Rôles minimum</dt>
          <dd className="font-medium">{minRoles || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Design</dt>
          <dd className="font-medium">
            {labelOf(answers.palette, PALETTES.map((p) => ({ id: p.id, label: p.label })))}
            {" · "}
            {labelOf(answers.ambiance, AMBIANCES)}
            {" · "}
            {labelOf(answers.modePref, MODE_PREFS)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Usage</dt>
          <dd className="font-medium">
            {labelOf(answers.device, DEVICES)} · connexion {answers.connexion || "—"}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted">
        En envoyant, tu aides la CITE FIERI à choisir les 2-3 premières fonctions.
      </p>
    </div>
  );
}
