"use client";

import { Field, TextArea, StepTitle } from "@/components/ui";
import { FUNCTIONS, MAX_TEXT } from "@/lib/constants";
import type { FormAnswers, FunctionId, FunctionRating } from "@/lib/types";

const RATINGS: { id: FunctionRating; label: string }[] = [
  { id: "indispensable", label: "Indispensable" },
  { id: "utile", label: "Utile" },
  { id: "pas_besoin", label: "Pas besoin" },
];

export function FunctionsStep({
  answers,
  onChange,
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
}) {
  function setRating(id: FunctionId, rating: FunctionRating) {
    onChange({
      functionRatings: { ...answers.functionRatings, [id]: rating },
    });
  }

  return (
    <div className="space-y-5">
      <StepTitle
        title="De quoi as-tu vraiment besoin ?"
        subtitle="Pour chaque idée : Indispensable, Utile ou Pas besoin."
      />

      <div className="space-y-4">
        {FUNCTIONS.map((fn) => {
          const current = answers.functionRatings[fn.id];
          return (
            <div
              key={fn.id}
              className="border border-border bg-surface/50 p-3"
            >
              <p className="mb-3 text-sm font-medium leading-snug">{fn.label}</p>
              <div className="grid grid-cols-3 gap-2">
                {RATINGS.map((rating) => {
                  const selected = current === rating.id;
                  return (
                    <button
                      key={rating.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setRating(fn.id, rating.id)}
                      className={`chamfer-btn min-h-11 px-1 text-xs font-semibold sm:text-sm ${
                        selected
                          ? rating.id === "indispensable"
                            ? "bg-accent text-white"
                            : rating.id === "utile"
                              ? "bg-primary text-white"
                              : "bg-border text-text"
                          : "border border-border bg-card text-muted"
                      }`}
                    >
                      {rating.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Field label="Une fonction qui manque ? (optionnel)" htmlFor="functionAutre">
        <TextArea
          id="functionAutre"
          maxLength={MAX_TEXT}
          value={answers.functionAutre}
          onChange={(e) => onChange({ functionAutre: e.target.value })}
        />
      </Field>
    </div>
  );
}
