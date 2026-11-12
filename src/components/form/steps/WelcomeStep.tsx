import { Button, StepTitle } from "@/components/ui";

export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-5">
      <StepTitle
        title="On construit une appli toute simple pour la CITE FIERI de l'INSTI."
        subtitle="Dis-nous ce dont tu as vraiment besoin. Pas de jargon, juste ton ressenti."
      />
      <ul className="space-y-2 text-sm text-muted">
        <li>• Environ 3 minutes</li>
        <li>• Une question à la fois</li>
        <li>• Ton brouillon est sauvegardé sur ton téléphone</li>
      </ul>
      <Button type="button" onClick={onStart} full>
        Commencer
      </Button>
    </div>
  );
}
