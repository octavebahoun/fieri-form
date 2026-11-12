"use client";

import { ShareQr } from "@/components/ShareQr";
import { StepTitle } from "@/components/ui";

export function ThanksStep() {
  return (
    <div className="space-y-5">
      <StepTitle
        title="Merci !"
        subtitle="Ta réponse est bien enregistrée. Tu nous aides vraiment à construire quelque chose d'utile."
      />
      <p className="text-sm text-muted">
        Si tu veux, partage le formulaire à d&apos;autres membres de la CITE.
      </p>
      <ShareQr />
    </div>
  );
}
