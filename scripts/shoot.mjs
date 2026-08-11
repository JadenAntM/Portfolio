/**
 * Visual + layout verification harness.
 *
 * Drives the locally installed Chrome through puppeteer-core, so nothing is
 * downloaded. Captures screenshots at each breakpoint and reports layout facts
 * that are easy to get wrong and impossible to eyeball reliably: horizontal
 * overflow, elements escaping the viewport, and the active nav state.
 *
 *   node scripts/shoot.mjs [--url=http://localhost:3000] [--tag=p4]
 *                          [--scroll=contact] [--reduced]
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = ".screenshots";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const url = args.get("url") ?? "http://localhost:3000";
const tag = args.get("tag") ?? "shot";
const scrollTo = args.get("scroll") ?? null;
const reduced = args.get("reduced") === "true";
const fullPage = args.get("full") === "true";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-lg", width: 480, height: 844 },
  { name: "tablet", width: 820, height: 1000 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", height: 900, width: 1700 },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-device-scale-factor=2"],
});

let failures = 0;

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2,
  });

  if (reduced) {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  }

  await page.goto(url, { waitUntil: "networkidle0" });

  if (scrollTo) {
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, scrollTo);
  }

  const offset = Number(args.get("offset") ?? 0);
  if (offset) {
    await page.evaluate((by) => window.scrollBy(0, by), offset);
  }

  // Let rAF-throttled scroll measurement settle.
  await new Promise((resolve) => setTimeout(resolve, 250));

  const report = await page.evaluate(() => {
    const doc = document.documentElement;

    // Wide-by-design content inside a clipping ancestor (the marquee rows) is
    // not a layout bug — it is the mechanism. Only unclipped escape counts,
    // plus document-level horizontal scroll, which is checked separately.
    const isClipped = (el) => {
      for (let node = el.parentElement; node; node = node.parentElement) {
        if (getComputedStyle(node).overflowX !== "visible") return true;
      }
      return false;
    };

    const overflowing = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        // 1px tolerance for hairline rounding.
        if (rect.right <= window.innerWidth + 1 && rect.left >= -1) return false;
        return !isClipped(el);
      })
      .slice(0, 6)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const cls =
          typeof el.className === "string" ? el.className.slice(0, 48) : "";
        return `${el.tagName.toLowerCase()}.${cls} [${Math.round(rect.left)}..${Math.round(rect.right)}]`;
      });

    const activeLinks = [
      ...document.querySelectorAll('nav a[aria-current="true"]'),
    ].map((el) => el.getAttribute("href"));

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasHorizontalScroll: doc.scrollWidth > doc.clientWidth + 1,
      overflowing,
      active: [...new Set(activeLinks)].join(",") || "none",
    };
  });

  const suffix = scrollTo ? `-${scrollTo}` : "";
  await page.screenshot({
    path: `${OUT}/${tag}-${viewport.name}${suffix}.png`,
    fullPage,
  });

  const bad = report.hasHorizontalScroll || report.overflowing.length > 0;
  if (bad) failures += 1;

  console.log(
    `${bad ? "FAIL" : "ok  "} ${viewport.name.padEnd(9)} ${String(viewport.width).padStart(4)}px  ` +
      `doc ${report.scrollWidth}/${report.clientWidth}  active=${report.active}`,
  );
  for (const item of report.overflowing) console.log(`        overflow: ${item}`);

  await page.close();
}

await browser.close();
console.log(failures === 0 ? "\nno overflow at any breakpoint" : `\n${failures} breakpoint(s) with overflow`);
process.exit(failures === 0 ? 0 : 1);
