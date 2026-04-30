export function formatShortCode(
  value?: string | null,
  prefix = "#",
  length = 8
) {
  if (!value) return "—";

  const clean = String(value).replace(/-/g, "").toUpperCase();
  return `${prefix}${clean.slice(0, length)}`;
}