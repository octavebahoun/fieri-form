"use client";

import { Choice, Field, TextInput, StepTitle } from "@/components/ui";
import { FREQUENCIES, MAX_SHORT, ROLES } from "@/lib/constants";
import type { FormAnswers } from "@/lib/types";

export function RoleStep({
  answers,
  onChange,
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
}) {
  return (
    <div className="space-y-5">
      <StepTitle
        title="Toi, dans la CITE"
        subtitle="Quelques infos pour comprendre ton point de vue."
      />

      <Field label="Prénom (optionnel)" htmlFor="prenom">
        <TextInput
          id="prenom"
          maxLength={MAX_SHORT}
          value={answers.prenom}
          onChange={(e) => onChange({ prenom: e.target.value })}
          placeholder="Ex. Fatou"
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ton rôle</p>
        <div className="space-y-2">
          {ROLES.map((role) => (
            <Choice
              key={role.id}
              selected={answers.role === role.id}
              onClick={() => onChange({ role: role.id })}
            >
              {role.label}
            </Choice>
          ))}
        </div>
        {answers.role === "autre" ? (
          <TextInput
            maxLength={MAX_SHORT}
            value={answers.roleAutre}
            onChange={(e) => onChange({ roleAutre: e.target.value })}
            placeholder="Précise ton rôle"
            aria-label="Précise ton rôle"
          />
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Filière (optionnel)" htmlFor="filiere">
          <TextInput
            id="filiere"
            maxLength={MAX_SHORT}
            value={answers.filiere}
            onChange={(e) => onChange({ filiere: e.target.value })}
            placeholder="Ex. Informatique"
          />
        </Field>
        <Field label="Année (optionnel)" htmlFor="annee">
          <TextInput
            id="annee"
            maxLength={MAX_SHORT}
            value={answers.annee}
            onChange={(e) => onChange({ annee: e.target.value })}
            placeholder="Ex. L2"
          />
        </Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          À quelle fréquence tu participes aux activités ?
        </p>
        <div className="space-y-2">
          {FREQUENCIES.map((item) => (
            <Choice
              key={item.id}
              selected={answers.frequence === item.id}
              onClick={() => onChange({ frequence: item.id })}
            >
              {item.label}
            </Choice>
          ))}
        </div>
      </div>
    </div>
  );
}
