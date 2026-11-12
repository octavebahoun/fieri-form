"use client";

import { Choice, Field, TextArea, TextInput, StepTitle } from "@/components/ui";
import { MAX_SHORT, MAX_TEXT, ORG_TOOLS } from "@/lib/constants";
import type { FormAnswers, OrgToolId } from "@/lib/types";

export function OrgStep({
  answers,
  onChange,
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
}) {
  function toggle(id: OrgToolId) {
    const has = answers.orgTools.includes(id);
    onChange({
      orgTools: has
        ? answers.orgTools.filter((x) => x !== id)
        : [...answers.orgTools, id],
    });
  }

  return (
    <div className="space-y-5">
      <StepTitle
        title="Aujourd'hui, la CITE s'organise avec…"
        subtitle="Tu peux en choisir plusieurs."
      />

      <div className="space-y-2">
        {ORG_TOOLS.map((tool) => (
          <Choice
            key={tool.id}
            multi
            selected={answers.orgTools.includes(tool.id)}
            onClick={() => toggle(tool.id)}
          >
            {tool.label}
          </Choice>
        ))}
      </div>

      {answers.orgTools.includes("autre") ? (
        <Field label="Précise" htmlFor="orgAutre">
          <TextInput
            id="orgAutre"
            maxLength={MAX_SHORT}
            value={answers.orgAutre}
            onChange={(e) => onChange({ orgAutre: e.target.value })}
          />
        </Field>
      ) : null}

      <Field
        label="Qu'est-ce qui bloque ou te fait perdre du temps ? (optionnel)"
        htmlFor="bloque"
      >
        <TextArea
          id="bloque"
          maxLength={MAX_TEXT}
          value={answers.bloque}
          onChange={(e) => onChange({ bloque: e.target.value })}
          placeholder="Ex. Les infos se perdent dans WhatsApp…"
        />
      </Field>
    </div>
  );
}
