"use client";

import { StepTitle } from "@/components/ui";
import { FUNCTIONS } from "@/lib/constants";
import type { FormAnswers, FunctionId } from "@/lib/types";
import { eligibleForTop3 } from "@/lib/validation";

export function Top3Step({
  answers,
  onChange,
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
}) {
  const eligible = eligibleForTop3(answers.functionRatings);
  const labels = new Map(FUNCTIONS.map((f) => [f.id, f.label]));

  function toggle(id: FunctionId) {
    const index = answers.top3.indexOf(id);
    if (index >= 0) {
      onChange({ top3: answers.top3.filter((x) => x !== id) });
      return;
    }
    if (answers.top3.length >= 3) return;
    onChange({ top3: [...answers.top3, id] });
  }

  if (eligible.length < 3) {
    return (
      <div className="space-y-3">
        <StepTitle
          title="Ton top 3"
          subtitle="Note d'abord au moins 3 fonctions « Indispensable » ou « Utile », puis reviens ici."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <StepTitle
        title="Si l'appli ne faisait que 3 choses au début…"
        subtitle="Tape pour classer (1, 2, 3). Re-tape pour retirer."
      />

      <div className="flex gap-2 text-sm text-muted">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 border border-border bg-surface px-2 py-2 text-center"
          >
            <p className="text-xs uppercase tracking-wide">#{i + 1}</p>
            <p className="mt-1 text-xs text-text">
              {answers.top3[i] ? labels.get(answers.top3[i]!) : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {eligible.map((id) => {
          const rank = answers.top3.indexOf(id);
          const selected = rank >= 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`chamfer-btn flex min-h-12 w-full items-center gap-3 border px-4 text-left ${
                selected
                  ? "border-accent bg-accent/20"
                  : "border-border bg-surface"
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center text-sm font-bold ${
                  selected ? "bg-accent text-white" : "bg-card text-muted"
                }`}
              >
                {selected ? rank + 1 : "+"}
              </span>
              <span>{labels.get(id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
