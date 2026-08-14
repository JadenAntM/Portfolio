import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PROFILE } from "@/data/profile";
import { getCanonicalOrigin } from "@/lib/site";
import { mono, sans } from "./fonts";
import "lenis/dist/lenis.css";
import "./globals.css";

const TITLE = `${PROFILE.name} — ${PROFILE.discipline}`;
const DESCRIPTION =
  "Fourth-year software engineering student building internal tools and data workflows, from Python automation and ETL pipelines to full-stack support platforms.";

export const metadata: Metadata = {
  metadataBase: getCanonicalOrigin(),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  authors: [{ name: PROFILE.name }],
  icons: {
    icon: "/assets/icons/jaden-favicon.png",
    shortcut: "/assets/icons/jaden-favicon.png",
    apple: "/assets/icons/jaden-favicon.png",
  },
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
    url: "/",
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
