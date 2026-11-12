"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Logo } from "@/components/Logo";
import { Button, Card } from "@/components/ui";
import { APP_ROLES, PERMISSION_ACTIONS } from "@/lib/constants";
import type { DashboardStats } from "@/lib/scoring";

function Bar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2 text-sm">
        <span>{label}</span>
        <span className="text-muted">
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 bg-surface">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

export function AdminDashboard({
  stats,
  source,
}: {
  stats: DashboardStats;
  source: "firestore" | "mock";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function logout() {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    });
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-5 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Logo size="sm" />
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/export?format=csv">
            <Button type="button" variant="secondary">
              Export CSV
            </Button>
          </a>
          <a href="/api/admin/export?format=json">
            <Button type="button" variant="secondary">
              Export JSON
            </Button>
          </a>
          <Button type="button" variant="ghost" onClick={logout} disabled={pending}>
            Quitter
          </Button>
        </div>
      </div>

      {source === "mock" ? (
        <p className="border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Mode démo : données factices (USE_MOCK_DATA=true).
        </p>
      ) : null}

      <Section title="Vue d'ensemble">
        <p className="text-3xl font-bold text-primary">{stats.total}</p>
        <p className="text-sm text-muted">réponses enregistrées</p>
      </Section>

      <Section title="Répartition par rôle">
        <div className="space-y-3">
          {stats.roles.map((r) => (
            <Bar key={r.id} label={r.label} count={r.count} total={stats.total} />
          ))}
        </div>
      </Section>

      <Section title="Classement des fonctions">
        <p className="text-xs text-muted">
          Score = notes (indispensable=2, utile=1) + top 3 (1er=3, 2e=2, 3e=1).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2 pr-2">Fonction</th>
                <th className="py-2 pr-2">Total</th>
                <th className="py-2 pr-2">Notes</th>
                <th className="py-2">Top3</th>
              </tr>
            </thead>
            <tbody>
              {stats.functions.map((fn, i) => (
                <tr key={fn.id} className="border-t border-border">
                  <td className="py-2 pr-2">
                    <span className="text-muted">{i + 1}.</span> {fn.label}
                  </td>
                  <td className="py-2 pr-2 font-semibold text-primary">{fn.total}</td>
                  <td className="py-2 pr-2">{fn.ratingScore}</td>
                  <td className="py-2">{fn.top3Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Matrice rôles × permissions">
        <p className="text-xs text-muted">
          Pourcentage de répondants ayant coché la case. Vert = retenu (≥ 50 %).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2 pr-2">Action</th>
                {APP_ROLES.map((r) => (
                  <th key={r.id} className="py-2 pr-2">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_ACTIONS.map((action) => (
                <tr key={action.id} className="border-t border-border">
                  <td className="py-2 pr-2">{action.label}</td>
                  {APP_ROLES.map((role) => {
                    const cell = stats.permissions.find(
                      (p) => p.actionId === action.id && p.roleId === role.id,
                    );
                    const pct = Math.round((cell?.percent ?? 0) * 100);
                    return (
                      <td
                        key={role.id}
                        className={`py-2 pr-2 ${
                          cell?.retained ? "text-success font-semibold" : "text-muted"
                        }`}
                      >
                        {pct}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Rôles minimum demandés">
        <div className="space-y-3">
          {stats.minRoles.map((r) => (
            <Bar key={r.id} label={r.label} count={r.count} total={stats.total} />
          ))}
        </div>
      </Section>

      <Section title="Design">
        <h3 className="text-sm font-medium text-muted">Palettes</h3>
        <div className="space-y-3">
          {stats.palettes.map((p) => (
            <Bar key={p.id} label={p.label} count={p.count} total={stats.total} />
          ))}
        </div>
        {stats.customColors.length > 0 ? (
          <div className="pt-2">
            <p className="mb-2 text-sm text-muted">Couleurs libres</p>
            <div className="flex flex-wrap gap-2">
              {stats.customColors.map((color, i) => (
                <span
                  key={`${color}-${i}`}
                  className="inline-flex items-center gap-2 border border-border px-2 py-1 text-xs"
                >
                  <span
                    className="h-4 w-4 border border-border"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <h3 className="pt-4 text-sm font-medium text-muted">Ambiances</h3>
        <div className="space-y-3">
          {stats.ambiances.map((a) => (
            <Bar key={a.id} label={a.label} count={a.count} total={stats.total} />
          ))}
        </div>
        <h3 className="pt-4 text-sm font-medium text-muted">Mode</h3>
        <div className="space-y-3">
          {stats.modes.map((m) => (
            <Bar key={m.id} label={m.label} count={m.count} total={stats.total} />
          ))}
        </div>
        <h3 className="pt-4 text-sm font-medium text-muted">Attentes UX</h3>
        <div className="space-y-3">
          {stats.uxNeeds.map((u) => (
            <Bar key={u.id} label={u.label} count={u.count} total={stats.total} />
          ))}
        </div>
      </Section>

      <Section title="Usage">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            {stats.devices.map((d) => (
              <Bar key={d.id} label={d.label} count={d.count} total={stats.total} />
            ))}
          </div>
          <div className="space-y-3">
            {stats.connexions.map((c) => (
              <Bar key={c.id} label={c.label} count={c.count} total={stats.total} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Verbatims">
        {(
          [
            ["Ce qui bloque", stats.verbatims.bloque],
            ["Fonction manquante", stats.verbatims.functionAutre],
            ["Si seulement 3 choses", stats.verbatims.troisChoses],
            ["Ce qui agace", stats.verbatims.agace],
            ["Appli aimée", stats.verbatims.appliAimee],
          ] as const
        ).map(([title, items]) => (
          <div key={title} className="space-y-2">
            <h3 className="text-sm font-medium text-muted">{title}</h3>
            {items.length === 0 ? (
              <p className="text-sm text-muted">Aucune réponse.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((text, i) => (
                  <li
                    key={`${title}-${i}`}
                    className="border border-border bg-surface/50 px-3 py-2 text-sm"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Section>

      <Section title="Réponses individuelles">
        <div className="space-y-3">
          {stats.responses.map((r) => (
            <details
              key={r.id}
              className="border border-border bg-surface/40 px-3 py-2"
            >
              <summary className="cursor-pointer text-sm font-medium">
                {r.prenom || "Anonyme"} · {r.role || "?"} ·{" "}
                <span className="text-muted">{r.createdAt?.slice(0, 10) || r.id}</span>
              </summary>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-muted">
                {JSON.stringify(
                  {
                    top3: r.top3,
                    palette: r.palette,
                    ambiance: r.ambiance,
                    device: r.device,
                    minRoles: r.minRoles,
                    troisChoses: r.troisChoses,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          ))}
        </div>
      </Section>
    </main>
  );
}
