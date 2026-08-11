import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

/**
 * Both families are self-hosted. Nothing is fetched from Google at build time,
 * so builds are reproducible offline and there is no third-party font request
 * at runtime.
 */

export const sans = GeistSans;

export const mono = localFont({
  src: "./fonts/JetBrainsMono-Variable.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  style: "normal",
  display: "swap",
});
