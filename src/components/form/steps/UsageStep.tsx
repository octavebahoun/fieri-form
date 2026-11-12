"use client";

import {
  Choice,
  ErrorText,
  Field,
  TextArea,
  TextInput,
  StepTitle,
} from "@/components/ui";
import { CONNECTIONS, DEVICES, MAX_SHORT, MAX_TEXT } from "@/lib/constants";
import type { FormAnswers } from "@/lib/types";

export function UsageStep({
  answers,
  onChange,
  fieldErrors = {},
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
  fieldErrors?: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <StepTitle
        title="Comment tu utiliseras l'appli"
        subtitle="Pour qu'elle marche bien sur ton téléphone."
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Ton appareil principal</p>
        {DEVICES.map((item) => (
          <Choice
            key={item.id}
            selected={answers.device === item.id}
            onClick={() => onChange({ device: item.id })}
          >
            {item.label}
          </Choice>
        ))}
        {fieldErrors.device ? <ErrorText>{fieldErrors.device}</ErrorText> : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ta connexion</p>
        {CONNECTIONS.map((item) => (
          <Choice
            key={item.id}
            selected={answers.connexion === item.id}
            onClick={() => onChange({ connexion: item.id })}
          >
            {item.label}
          </Choice>
        ))}
        {fieldErrors.connexion ? (
          <ErrorText>{fieldErrors.connexion}</ErrorText>
        ) : null}
      </div>

      <Field
        label="Si on ne pouvait faire que 3 choses, lesquelles ? (optionnel)"
        htmlFor="troisChoses"
      >
        <TextArea
          id="troisChoses"
          maxLength={MAX_TEXT}
          value={answers.troisChoses}
          onChange={(e) => onChange({ troisChoses: e.target.value })}
          placeholder="Ex. Annonces, calendrier, cotisations…"
        />
      </Field>

      <div className="space-y-3 border border-border bg-surface/40 p-3">
        <p className="text-sm font-medium">Être recontacté ? (optionnel)</p>
        <p className="text-xs text-muted">
          Uniquement pour la CITE FIERI. Jamais partagé ailleurs.
        </p>
        <Field label="Prénom" htmlFor="contactPrenom">
          <TextInput
            id="contactPrenom"
            maxLength={MAX_SHORT}
            value={answers.contactPrenom}
            onChange={(e) => onChange({ contactPrenom: e.target.value })}
          />
        </Field>
        <Field label="WhatsApp" htmlFor="contactWhatsapp">
          <TextInput
            id="contactWhatsapp"
            maxLength={MAX_SHORT}
            value={answers.contactWhatsapp}
            onChange={(e) => onChange({ contactWhatsapp: e.target.value })}
            placeholder="+229…"
            inputMode="tel"
          />
        </Field>
      </div>
    </div>
  );
}
