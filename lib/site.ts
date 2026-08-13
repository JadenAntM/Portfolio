/**
 * Vercel exposes the shortest production domain (custom when one exists) at
 * build and runtime. Local builds deliberately resolve to localhost instead of
 * publishing a made-up canonical host.
 */
export function getCanonicalOrigin(): URL {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(productionHost ? `https://${productionHost}` : "http://localhost:3000");
}
