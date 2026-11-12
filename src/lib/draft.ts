import { DRAFT_KEY } from "./constants";
import { EMPTY_ANSWERS, type FormAnswers } from "./types";
import { sanitizeAnswers } from "./validation";

export function loadDraft(): FormAnswers {
  if (typeof window === "undefined") return { ...EMPTY_ANSWERS };
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { ...EMPTY_ANSWERS, startedAt: Date.now() };
    const parsed = sanitizeAnswers(JSON.parse(raw));
    if (!parsed) return { ...EMPTY_ANSWERS, startedAt: Date.now() };
    return {
      ...parsed,
      startedAt: parsed.startedAt || Date.now(),
    };
  } catch {
    return { ...EMPTY_ANSWERS, startedAt: Date.now() };
  }
}

export function saveDraft(answers: FormAnswers, step: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...answers, __step: step }),
    );
  } catch {
    // ignore quota errors
  }
}

export function loadDraftStep(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { __step?: number };
    return typeof parsed.__step === "number" ? parsed.__step : 0;
  } catch {
    return 0;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}
