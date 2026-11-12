"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, ErrorText, Field, TextInput, StepTitle } from "@/components/ui";
import { Logo } from "@/components/Logo";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Connexion impossible.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <Logo size="sm" />
      <Card className="mt-6">
        <StepTitle
          title="Espace admin"
          subtitle="Résultats du formulaire CITE INSTI."
        />
        {!configured ? (
          <p className="text-sm text-error">
            ADMIN_PASSCODE n&apos;est pas défini sur le serveur. Ajoute-le dans
            Vercel (variable serveur, non publique).
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Code d'accès" htmlFor="passcode">
              <TextInput
                id="passcode"
                type="password"
                autoComplete="current-password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </Field>
            <ErrorText>{error}</ErrorText>
            <Button type="submit" full disabled={pending}>
              {pending ? "Vérification…" : "Entrer"}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
