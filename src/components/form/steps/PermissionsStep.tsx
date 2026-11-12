"use client";

import { Chip, Choice, ErrorText, StepTitle } from "@/components/ui";
import {
  APP_ROLES,
  MIN_ROLES,
  PERMISSION_ACTIONS,
  VALIDATORS,
} from "@/lib/constants";
import type { AppRoleId, FormAnswers, MinRoleId, PermissionActionId } from "@/lib/types";
import { needsDetailedPermissions } from "@/lib/validation";

export function PermissionsStep({
  answers,
  onChange,
  fieldErrors = {},
}: {
  answers: FormAnswers;
  onChange: (partial: Partial<FormAnswers>) => void;
  fieldErrors?: Record<string, string>;
}) {
  const detailed = needsDetailedPermissions(answers.role);

  function toggleMinRole(id: MinRoleId) {
    const has = answers.minRoles.includes(id);
    onChange({
      minRoles: has
        ? answers.minRoles.filter((x) => x !== id)
        : [...answers.minRoles, id],
    });
  }

  function togglePermission(action: PermissionActionId, role: AppRoleId) {
    const current = answers.permissions[action] ?? [];
    const has = current.includes(role);
    onChange({
      permissions: {
        ...answers.permissions,
        [action]: has ? current.filter((r) => r !== role) : [...current, role],
      },
    });
  }

  return (
    <div className="space-y-6">
      <StepTitle
        title="Qui peut faire quoi ?"
        subtitle={
          detailed
            ? "Coche les rôles qui devraient pouvoir faire chaque action."
            : "Version courte : dis-nous surtout les rôles minimum et qui valide les nouveaux membres."
        }
      />

      {detailed ? (
        <div className="space-y-4">
          {PERMISSION_ACTIONS.map((action) => {
            const selected = answers.permissions[action.id] ?? [];
            return (
              <div
                key={action.id}
                className="border border-border bg-surface/40 p-3"
              >
                <p className="mb-3 text-sm font-medium">{action.label}</p>
                <div className="flex flex-wrap gap-2">
                  {APP_ROLES.map((role) => (
                    <Chip
                      key={role.id}
                      selected={selected.includes(role.id)}
                      onClick={() => togglePermission(action.id, role.id)}
                    >
                      {role.label}
                    </Chip>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Tu es membre : on te demande juste l&apos;essentiel. Le détail des
          permissions est surtout pour le bureau et les responsables.
        </p>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">Rôles minimum dans l&apos;appli</p>
        {MIN_ROLES.map((role) => (
          <Choice
            key={role.id}
            multi
            selected={answers.minRoles.includes(role.id)}
            onClick={() => toggleMinRole(role.id)}
          >
            {role.label}
          </Choice>
        ))}
        {fieldErrors.minRoles ? (
          <ErrorText>{fieldErrors.minRoles}</ErrorText>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Qui doit valider l&apos;arrivée d&apos;un nouveau membre ?
        </p>
        {VALIDATORS.map((item) => (
          <Choice
            key={item.id}
            selected={answers.validator === item.id}
            onClick={() => onChange({ validator: item.id })}
          >
            {item.label}
          </Choice>
        ))}
      </div>
    </div>
  );
}
