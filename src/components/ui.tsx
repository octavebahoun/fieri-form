"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`chamfer-card border border-border bg-card p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  full?: boolean;
};

export function Button({
  variant = "primary",
  full,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover"
      : variant === "secondary"
        ? "bg-surface text-text border border-border hover:border-primary"
        : variant === "danger"
          ? "bg-error/15 text-error border border-error/40"
          : "bg-transparent text-muted hover:text-text";

  return (
    <button
      className={`chamfer-btn inline-flex min-h-12 items-center justify-center gap-2 px-5 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${full ? "w-full" : ""} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Choice({
  selected,
  onClick,
  children,
  multi,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`chamfer-btn min-h-12 w-full border px-4 py-3 text-left text-base transition ${
        selected
          ? "border-primary bg-primary/20 text-text"
          : "border-border bg-surface text-text hover:border-primary/60"
      }`}
    >
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center border border-current text-xs">
        {selected ? (multi ? "✓" : "●") : ""}
      </span>
      {children}
    </button>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2" htmlFor={htmlFor}>
      <span className="block text-sm font-medium text-text">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={`min-h-12 w-full border border-border bg-surface px-3 text-base text-text placeholder:text-muted/70 ${props.className ?? ""}`}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`min-h-24 w-full border border-border bg-surface px-3 py-3 text-base text-text placeholder:text-muted/70 ${props.className ?? ""}`}
    />
  );
}

export function StepTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 space-y-2">
      <h2 className="text-xl font-semibold leading-snug text-text sm:text-2xl">
        {title}
      </h2>
      {subtitle ? <p className="text-sm text-muted sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-10 rounded-sm border px-3 py-2 text-sm font-medium transition ${
        selected
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-error">{children}</p>;
}
