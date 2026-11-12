"use client";

import { Choice, ErrorText, Field, TextArea, StepTitle } from "@/components/ui";
import {
  AMBIANCES,
  MAX_TEXT,
  MODE_PREFS,
  PALETTES,
  UX_NEEDS,
} from "@/lib/constants";
import type { FormAnswers, UxNeedId } from "@/lib/types";

export function DesignStep({
  answers,
  onChange,
  fieldErrors = {},
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
  fieldErrors?: Record<string, string>;
}) {
  function toggleUx(id: UxNeedId) {
    const has = answers.uxNeeds.includes(id);
    onChange({
      uxNeeds: has
        ? answers.uxNeeds.filter((x) => x !== id)
        : [...answers.uxNeeds, id],
    });
  }

  return (
    <div className="space-y-6">
      <StepTitle
        title="Design et expérience"
        subtitle="Comment l'appli devrait te parler."
      />

      <div className="space-y-3">
        <p className="text-sm font-medium">Couleurs préférées</p>
        <div className="space-y-2">
          {PALETTES.map((palette) => {
            const selected = answers.palette === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ palette: palette.id })}
                className={`chamfer-btn flex min-h-14 w-full items-center gap-3 border px-3 text-left ${
                  selected
                    ? "border-primary bg-primary/15"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex gap-1">
                  {palette.colors.length > 0 ? (
                    palette.colors.map((color) => (
                      <span
                        key={color}
                        className="h-6 w-6 border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))
                  ) : (
                    <span className="text-lg text-muted">+</span>
                  )}
                </div>
                <span className="text-sm font-medium">{palette.label}</span>
              </button>
            );
          })}
        </div>
        {answers.palette === "autre" ? (
          <Field label="Choisis ta couleur" htmlFor="paletteCustom">
            <input
              id="paletteCustom"
              type="color"
              value={answers.paletteCustom || "#3C85F7"}
              onChange={(e) => onChange({ paletteCustom: e.target.value })}
              className="h-12 w-full cursor-pointer border border-border bg-surface"
            />
          </Field>
        ) : null}
        {fieldErrors.palette ? <ErrorText>{fieldErrors.palette}</ErrorText> : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ambiance</p>
        {AMBIANCES.map((item) => (
          <Choice
            key={item.id}
            selected={answers.ambiance === item.id}
            onClick={() => onChange({ ambiance: item.id })}
          >
            {item.label}
          </Choice>
        ))}
        {fieldErrors.ambiance ? (
          <ErrorText>{fieldErrors.ambiance}</ErrorText>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Mode d&apos;affichage</p>
        {MODE_PREFS.map((item) => (
          <Choice
            key={item.id}
            selected={answers.modePref === item.id}
            onClick={() => onChange({ modePref: item.id })}
          >
            {item.label}
          </Choice>
        ))}
        {fieldErrors.modePref ? (
          <ErrorText>{fieldErrors.modePref}</ErrorText>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ce que tu attends de l&apos;expérience</p>
        {UX_NEEDS.map((item) => (
          <Choice
            key={item.id}
            multi
            selected={answers.uxNeeds.includes(item.id)}
            onClick={() => toggleUx(item.id)}
          >
            {item.label}
          </Choice>
        ))}
      </div>

      <Field
        label="Qu'est-ce qui t'agace dans les applis que tu utilises ? (optionnel)"
        htmlFor="agace"
      >
        <TextArea
          id="agace"
          maxLength={MAX_TEXT}
          value={answers.agace}
          onChange={(e) => onChange({ agace: e.target.value })}
        />
      </Field>

      <Field
        label="Une appli dont tu aimes l'expérience, et pourquoi (optionnel)"
        htmlFor="appliAimee"
      >
        <TextArea
          id="appliAimee"
          maxLength={MAX_TEXT}
          value={answers.appliAimee}
          onChange={(e) => onChange({ appliAimee: e.target.value })}
        />
      </Field>
    </div>
  );
}
