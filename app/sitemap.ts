import type { MetadataRoute } from "next";
import { getCanonicalOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getCanonicalOrigin().toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
