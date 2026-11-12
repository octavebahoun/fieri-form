"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Logo } from "@/components/Logo";
import { ShareQr } from "@/components/ShareQr";
import { Button, Card, ErrorText } from "@/components/ui";
import { clearDraft, loadDraft, loadDraftStep, saveDraft } from "@/lib/draft";
import { EMPTY_ANSWERS, type FormAnswers } from "@/lib/types";
import {
  eligibleForTop3,
  fieldErrorsMap,
  validateForSubmit,
  validateStep,
  type FormStepId,
} from "@/lib/validation";
import { RoleStep } from "./steps/RoleStep";
import { OrgStep } from "./steps/OrgStep";
import { FunctionsStep } from "./steps/FunctionsStep";
import { Top3Step } from "./steps/Top3Step";
import { PermissionsStep } from "./steps/PermissionsStep";
import { DesignStep } from "./steps/DesignStep";
import { UsageStep } from "./steps/UsageStep";
import { RecapStep } from "./steps/RecapStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ThanksStep } from "./steps/ThanksStep";

const STEP_IDS: FormStepId[] = [
  "welcome",
  "role",
  "org",
  "functions",
  "top3",
  "permissions",
  "design",
  "usage",
  "recap",
];

export function FormWizard() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>(EMPTY_ANSWERS);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const draft = loadDraft();
    // Restauration du brouillon localStorage après hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionnel
    setAnswers(draft.startedAt ? draft : { ...draft, startedAt: Date.now() });
    setStep(Math.min(loadDraftStep(), STEP_IDS.length - 1));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || done) return;
    saveDraft(answers, step);
  }, [answers, step, ready, done]);

  const progress = useMemo(
    () => Math.round((step / (STEP_IDS.length - 1)) * 100),
    [step],
  );

  function clearErrors() {
    setError("");
    setFieldErrors({});
  }

  function clearFieldError(...fields: string[]) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const field of fields) delete next[field];
      return next;
    });
  }

  function patch(partial: Partial<FormAnswers>) {
    setAnswers((prev) => {
      const nextAnswers = { ...prev, ...partial };
      if (partial.functionRatings) {
        const eligible = new Set(eligibleForTop3(nextAnswers.functionRatings));
        nextAnswers.top3 = nextAnswers.top3.filter((id) => eligible.has(id));
      }
      return nextAnswers;
    });
    if (partial.frequence !== undefined) clearFieldError("frequence");
    if (partial.role !== undefined) clearFieldError("role");
    if (partial.functionRatings !== undefined) clearFieldError("functionRatings");
    if (partial.top3 !== undefined) clearFieldError("top3");
    if (partial.minRoles !== undefined) clearFieldError("minRoles");
  }

  function next() {
    const current = STEP_IDS[step]!;
    const errors = validateStep(current, answers);
    if (errors.length > 0) {
      setError(errors[0]!.message);
      setFieldErrors(fieldErrorsMap(errors));
      return;
    }
    clearErrors();
    setStep((s) => Math.min(s + 1, STEP_IDS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    clearErrors();
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    const errors = validateForSubmit(answers);
    if (errors.length) {
      setError(errors[0]!.message);
      setFieldErrors(fieldErrorsMap(errors));
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) {
          setError(data.error || "Envoi impossible. Réessaie.");
          return;
        }
        clearDraft();
        setDone(true);
      } catch {
        setError("Connexion coupée. Réessaie dans un instant.");
      }
    });
  }

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4">
        <p className="text-muted">Chargement…</p>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-lg px-4 py-6">
        <Logo size="sm" />
        <div className="mt-6">
          <ThanksStep />
        </div>
      </main>
    );
  }

  const current: FormStepId = STEP_IDS[step]!;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 py-6 pb-28">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Logo size="sm" />
        {step > 0 ? (
          <p className="text-xs text-muted">
            Étape {step}/{STEP_IDS.length - 1}
          </p>
        ) : null}
      </div>

      {step > 0 ? (
        <div className="progress-bar mb-5 chamfer-btn" aria-hidden>
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <Card>
        {current === "welcome" && <WelcomeStep onStart={next} />}
        {current === "role" && (
          <RoleStep
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "org" && <OrgStep answers={answers} onChange={patch} />}
        {current === "functions" && (
          <FunctionsStep
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "top3" && (
          <Top3Step
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "permissions" && (
          <PermissionsStep
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "design" && (
          <DesignStep
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "usage" && (
          <UsageStep
            answers={answers}
            onChange={patch}
            fieldErrors={fieldErrors}
          />
        )}
        {current === "recap" && <RecapStep answers={answers} />}
      </Card>

      <div className="honeypot" aria-hidden>
        <label>
          Site web
          <input
            tabIndex={-1}
            autoComplete="off"
            value={answers.website}
            onChange={(e) => patch({ website: e.target.value })}
          />
        </label>
      </div>

      {error &&
      !(
        (current === "role" && fieldErrors.frequence) ||
        (current === "functions" && fieldErrors.functionRatings)
      ) ? (
        <div className="mt-3">
          <ErrorText>{error}</ErrorText>
        </div>
      ) : null}

      {current !== "welcome" ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-border bg-bg/95 p-3 backdrop-blur">
          <div className="mx-auto flex max-w-lg gap-3">
            <Button type="button" variant="secondary" onClick={back} className="flex-1">
              Retour
            </Button>
            {current === "recap" ? (
              <Button
                type="button"
                onClick={submit}
                disabled={pending}
                className="flex-[1.4]"
              >
                {pending ? "Envoi…" : "Envoyer"}
              </Button>
            ) : (
              <Button type="button" onClick={next} className="flex-[1.4]">
                Suivant
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {current === "welcome" ? (
        <div className="mt-5">
          <ShareQr />
        </div>
      ) : null}
    </main>
  );
}
