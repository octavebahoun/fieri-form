export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const title =
    size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-3xl";
  return (
    <div className="select-none">
      <p className={`${title} font-bold tracking-tight leading-none`}>
        <span className="text-primary">FIE</span>
        <span className="text-accent">RI</span>
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
        CITE INSTI
      </p>
    </div>
  );
}
