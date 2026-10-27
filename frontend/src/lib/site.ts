export const SITE_NAME = "Arx Clips";
export const DEFAULT_SITE_URL = "https://clips.arxsable.ai";
export const HOSTED_APP_URL = DEFAULT_SITE_URL;
export const GITHUB_URL = "https://github.com/Oscar-G13/arxsable-clips";
// Kept as an internal billing/admin compatibility identifier. It is not linked
// from customer-facing Arx Clips surfaces while the legacy iOS listing remains.
export const APP_STORE_ID = "6784760040";

export function getSiteUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
