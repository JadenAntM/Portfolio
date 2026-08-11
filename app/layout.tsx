import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PROFILE } from "@/data/profile";
import { mono, sans } from "./fonts";
import "lenis/dist/lenis.css";
import "./globals.css";

/**
 * TODO(jaden): set the real domain (or NEXT_PUBLIC_SITE_URL in Vercel) before
 * deploy — Open Graph image URLs must be absolute, and this is what makes them
 * absolute.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const TITLE = `${PROFILE.name} — ${PROFILE.discipline}`;
const DESCRIPTION =
  "Fourth-year software engineering student working on backend systems and data infrastructure: streaming ingest, validation, and observability. Case studies with measured outcomes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  authors: [{ name: PROFILE.name }],
  keywords: [
    "software engineering",
    "data pipelines",
    "distributed systems",
    "backend",
    "quantitative technology",
    "new grad",
  ],
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    url: SITE_URL,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-bg text-fg">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
