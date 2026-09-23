/**
 * Resolves API endpoints against Vite's base path.
 * For example, if hosted under /sambook/, resolves /api/spots to /sambook/api/spots.
 */
export function getApiUrl(endpoint: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}
