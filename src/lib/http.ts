export const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
} as const;

export function withNoStore(
  init?: HeadersInit,
): Record<string, string> {
  const base: Record<string, string> = { ...NO_STORE_HEADERS };
  if (!init) return base;
  const headers = new Headers(init);
  headers.forEach((value, key) => {
    base[key] = value;
  });
  if (!headers.has("Cache-Control")) {
    base["Cache-Control"] = NO_STORE_HEADERS["Cache-Control"];
  }
  return base;
}
