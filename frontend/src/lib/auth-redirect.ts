/**
 * Where to go after signing in: a same-site `?next=/path`, else the dashboard.
 * Absolute and protocol-relative URLs are ignored so the param cannot redirect off-site.
 */
export function postAuthPath(search: string): string {
  const next = new URLSearchParams(search).get("next");
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/dashboard";
  }
  return next;
}
