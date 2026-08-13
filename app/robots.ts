import type { MetadataRoute } from "next";
import { getCanonicalOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = getCanonicalOrigin();

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", origin).toString(),
    host: origin.toString(),
  };
}
