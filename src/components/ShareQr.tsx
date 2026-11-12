"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "./ui";

export function ShareQr() {
  const [url, setUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const href = window.location.origin + "/";
    let cancelled = false;
    // Bootstrap client-only (URL + QR) après hydratation.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionnel
    setUrl(href);
    QRCode.toDataURL(href, {
      width: 220,
      margin: 1,
      color: { dark: "#0B1220", light: "#E8ECF4" },
    }).then((value) => {
      if (!cancelled) setDataUrl(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Formulaire FIERI CITE INSTI",
          text: "Aide-nous à choisir les premières fonctions de l'appli FIERI (3 min).",
          url,
        });
        return;
      } catch {
        // fallback below
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3 rounded-sm border border-border bg-surface/60 p-4">
      <p className="text-sm text-muted">
        Scanne ou partage ce lien pour que d&apos;autres membres répondent.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="QR code vers le formulaire FIERI"
            width={160}
            height={160}
            className="border border-border bg-text p-2"
          />
        ) : (
          <div className="h-40 w-40 animate-pulse bg-surface" />
        )}
        <div className="flex w-full flex-col gap-2">
          <p className="break-all text-xs text-muted">{url || "…"}</p>
          <Button type="button" onClick={share} full>
            Partager le formulaire
          </Button>
          <Button type="button" variant="secondary" onClick={copyLink} full>
            {copied ? "Lien copié ✓" : "Copier le lien"}
          </Button>
        </div>
      </div>
    </div>
  );
}
