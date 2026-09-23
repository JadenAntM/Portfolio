/** Resolve the production URL supplied by the hosting workflow. */
export function getCanonicalOrigin(): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return new URL(siteUrl || "http://localhost:3000");
}
