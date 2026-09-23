import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/profile";

export const alt = `${PROFILE.name} — ${PROFILE.discipline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const FONT_DIR = join(process.cwd(), "node_modules", "geist", "dist", "fonts");

/**
 * Link preview card, generated from the same profile data as the page so it
 * cannot drift out of sync.
 *
 * Geist Mono stands in for JetBrains Mono here only because Satori needs a TTF
 * and @fontsource ships woff2 only. It is the one place in the project where the
 * mono family differs, and it is not visible alongside the real one.
 */
export default async function OpengraphImage() {
  const [sans, mono] = await Promise.all([
    readFile(join(FONT_DIR, "geist-sans", "Geist-Medium.ttf")),
    readFile(join(FONT_DIR, "geist-mono", "GeistMono-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          paddingLeft: 184,
          paddingRight: 96,
          position: "relative",
          fontFamily: "Geist",
        }}
      >
        {/* The rail hairline, carried over from the site's grid. */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: "#262626",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 96,
            height: 1,
            backgroundColor: "#262626",
          }}
        />

        <div style={{ display: "flex", fontSize: 88, color: "#F2F2ED" }}>
          {PROFILE.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 26,
            fontFamily: "Geist Mono",
            color: "#A8A8A2",
            letterSpacing: "0.02em",
          }}
        >
          {PROFILE.discipline} · {PROFILE.year}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 22,
            fontFamily: "Geist Mono",
            color: "#85857F",
            letterSpacing: "0.08em",
          }}
        >
          {PROFILE.cohort}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, style: "normal", weight: 500 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
