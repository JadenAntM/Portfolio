import type { MetadataRoute } from "next";
import { getCanonicalOrigin } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getCanonicalOrigin().toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
