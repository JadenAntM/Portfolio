/**
 * Interaction checks that a screenshot cannot prove: hover/focus states, the
 * text-scramble, keyboard focus visibility, and the contrast of every rendered
 * text/background pair.
 *
 * Contrast is measured at more than one viewport on purpose — styles that only
 * exist below sm, such as the scroll stage's normal-flow fallback, are invisible
 * to a desktop-only pass.
 *
 *   node scripts/interact.mjs [--url=http://localhost:3000]
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const url = args.get("url") ?? "http://localhost:3000";

/** Runs in the page. Returns one row per distinct rendered text style. */
function measureContrast() {
  const srgb = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const lum = ([r, g, b]) =>
    0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const parse = (s) => {
    if (!s || s === "none") return null;
    const m = s.match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null;
  };
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  const bgOf = (el) => {
    let node = el;
    while (node) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && !bg.includes("rgba(0, 0, 0, 0)")) {
        const rgb = parse(bg);
        if (rgb) return rgb;
      }
      node = node.parentElement;
    }
    return [10, 10, 10];
  };

  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const text = walker.currentNode.textContent?.trim();
    if (!text) continue;

    const el = walker.currentNode.parentElement;
    if (!el) continue;

    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    // sr-only text is not rendered for sighted users.
    if (rect.width <= 1 && rect.height <= 1) continue;

    const isSvgText = el.namespaceURI === "http://www.w3.org/2000/svg";
    const fg = parse(isSvgText ? style.fill : style.color);
    if (!fg) continue;

    const bg = bgOf(el);
    const r = ratio(fg, bg);
    const px = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;
    const color = isSvgText ? style.fill : style.color;

    const key = `${color}|${px}|${text.slice(0, 18)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      text: text.slice(0, 34),
      color,
      px: Math.round(px * 10) / 10,
      ratio: Math.round(r * 100) / 100,
      required,
      pass: r >= required,
    });
  }
  return out;
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });

const results = [];
const check = (name, pass, detail = "") => results.push({ name, pass, detail });

/* -- 1. text-scramble on hover ------------------------------------------- */
const handle = await page.evaluateHandle(() =>
  [...document.querySelectorAll("#contact a")].find((a) =>
    a.textContent?.includes("GitHub"),
  ),
);
const scrambleTarget = handle.asElement();

if (!scrambleTarget) {
  check("scramble: link found", false);
} else {
  const read = () =>
    scrambleTarget.evaluate(
      (el) => el.querySelector("[aria-hidden].tabular-nums")?.textContent ?? "",
    );

  const before = await read();
  await scrambleTarget.hover();

  const samples = [];
  for (let i = 0; i < 12; i += 1) {
    samples.push(await read());
    await new Promise((r) => setTimeout(r, 30));
  }
  await new Promise((r) => setTimeout(r, 500));
  const after = await read();

  check(
    "scramble: glyphs cycle on hover",
    samples.some((s) => s !== before && s.length === before.length),
    samples.slice(0, 4).join(" "),
  );
  check("scramble: resolves to real label", after === "GitHub", `final "${after}"`);
}

/* -- 2. marquee: direction, speed ladder, and seamless wrap --------------- */
/**
 * The three facts a screenshot cannot show. Read from the composited transform
 * rather than from the source, so this fails if the animation stalls.
 */
const readRows = () =>
  page.evaluate(() =>
    [
      ...new Set(
        [...document.querySelectorAll("#index .marquee-row")].map(
          (el) => el.parentElement,
        ),
      ),
    ].map((carrier) => ({
      x: new DOMMatrix(getComputedStyle(carrier).transform).m41,
      // offsetWidth, not getBoundingClientRect: the band carries a scroll-linked
      // scale on exit, and a scaled rect width compared against an unscaled
      // translate reports a seam that does not exist.
      group: carrier.firstElementChild.offsetWidth,
      carrier: carrier.offsetWidth,
      viewport: window.innerWidth,
    })),
  );

// The marquee's resting state is what is being asserted, and the scramble check
// above left the page scrolled to the footer.
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((resolve) => setTimeout(resolve, 250));
await page.mouse.click(8, 8);
await new Promise((r) => setTimeout(r, 150));

const rowsA = await readRows();
await new Promise((r) => setTimeout(r, 700));
const rowsB = await readRows();

const deltas = rowsA.map((a, i) => {
  const raw = rowsB[i].x - a.x;
  // Undo a wrap that happened between samples.
  const wrapped = Math.abs(raw) > a.group / 2 ? raw + Math.sign(-raw) * a.group : raw;
  return wrapped;
});

check(
  "marquee: 3 rows, directions alternate + - +",
  deltas.length === 3 && deltas[0] > 0 && deltas[1] < 0 && deltas[2] > 0,
  deltas.map((d) => d.toFixed(1)).join(" / "),
);

const speeds = deltas.map((d) => Math.abs(d));
check(
  "marquee: each row runs at its own speed",
  new Set(speeds.map((s) => Math.round(s))).size === speeds.length,
  speeds.map((s) => `${Math.round((s / 0.7) * 10) / 10}px/s`).join(" / "),
);

check(
  "marquee: enough copies that a wrap cannot expose a seam",
  rowsA.every(
    (r) => r.carrier >= r.viewport + r.group - 1 && Math.abs(r.x) <= r.group + 1,
  ),
  rowsA
    .map((r) => `${Math.round(r.carrier)}>=${Math.round(r.viewport + r.group)}`)
    .join(" "),
);

/* -- 2b. Work stays static, vertical, and easy to scan -------------------- */
const experienceLayout = await page.evaluate(() => {
  const grid = document.querySelector("[data-experience-grid]");
  const cards = [...document.querySelectorAll("#experience article")].map((card) => {
    const rect = card.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      innerColumns: getComputedStyle(card).gridTemplateColumns.split(" ").length,
    };
  });

  return {
    cards,
    flow: grid ? getComputedStyle(grid).display : "missing",
    pins: document.querySelectorAll("#experience .stage-pin, #experience [data-scroll-stage]").length,
  };
});

check(
  "experience: both entries form a static vertical list with scannable rows",
  experienceLayout.cards.length === 2 &&
    experienceLayout.pins === 0 &&
    experienceLayout.cards[0].innerColumns === 2 &&
    experienceLayout.cards[1].innerColumns === 2 &&
    Math.abs(experienceLayout.cards[0].left - experienceLayout.cards[1].left) < 2 &&
    Math.abs(experienceLayout.cards[0].width - experienceLayout.cards[1].width) < 2 &&
    experienceLayout.cards[1].top > experienceLayout.cards[0].bottom,
  JSON.stringify(experienceLayout),
);

/* -- 2d. Projects maps its vertical range onto the horizontal rail -------- */
const projectRail = await page.evaluate(async () => {
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const track = document.querySelector("[data-project-rail]");
  const pin = document.querySelector(".project-rail-pin");
  const cards = [...document.querySelectorAll("[data-project-carriage]")];
  if (!track || !pin || cards.length === 0) return null;

  const top = track.getBoundingClientRect().top + window.scrollY;
  const span = track.getBoundingClientRect().height - window.innerHeight;
  const readCentered = () => {
    const center = window.innerWidth / 2;
    return cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - center);
    });
  };

  window.scrollTo({ top, behavior: "instant" });
  await nextFrame();
  await nextFrame();
  const start = readCentered();

  window.scrollTo({ top: top + span, behavior: "instant" });
  await nextFrame();
  await nextFrame();
  const end = readCentered();
  const index = document.querySelector("[data-project-index]")?.textContent?.trim();
  const projectLinkTabs = cards.map((card) => card.querySelector("a")?.tabIndex);

  window.scrollTo({ top: 0, behavior: "instant" });
  return {
    cards: cards.length,
    trackViewports: track.getBoundingClientRect().height / window.innerHeight,
    pinViewports: pin.getBoundingClientRect().height / window.innerHeight,
    firstDelta: start[0],
    lastDelta: end[end.length - 1],
    index,
    projectLinkTabs,
  };
});

check(
  "projects: one-viewport pin centers first and last rail cards",
  projectRail &&
    projectRail.cards === 2 &&
    Math.abs(projectRail.trackViewports - projectRail.cards) < 0.05 &&
    Math.abs(projectRail.pinViewports - 1) < 0.05 &&
    projectRail.firstDelta < 2 &&
    projectRail.lastDelta < 2 &&
    projectRail.index === "02/02" &&
    projectRail.projectLinkTabs.join(",") === "-1,0",
  projectRail ? JSON.stringify(projectRail) : "rail missing",
);

/* -- 2e. Lenis source, page progress, and heading masks ------------------- */
const scrollEnhancements = await page.evaluate(async () => {
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const masks = [...document.querySelectorAll("[data-heading-mask]")];

  for (const mask of masks) {
    mask.parentElement.scrollIntoView({ block: "center", behavior: "instant" });
    await nextFrame();
    await new Promise((resolve) => setTimeout(resolve, 850));
  }

  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  await nextFrame();
  await nextFrame();

  const progress = document.querySelector("[data-scroll-progress]");
  const progressScale = progress
    ? new DOMMatrix(getComputedStyle(progress).transform).m22
    : 0;
  const masksRevealed = masks.every((mask) => {
    const x = new DOMMatrix(getComputedStyle(mask).transform).m41;
    return x >= mask.parentElement.getBoundingClientRect().width * 0.95;
  });

  window.scrollTo({ top: 0, behavior: "instant" });
  await nextFrame();

  return {
    lenis: document.documentElement.classList.contains("lenis"),
    masks: masks.length,
    masksRevealed,
    progressScale,
  };
});

check(
  "scroll: Lenis drives the page and fixed progress line",
  scrollEnhancements.lenis && scrollEnhancements.progressScale > 0.98,
  `lenis=${scrollEnhancements.lenis}, progress=${scrollEnhancements.progressScale.toFixed(2)}`,
);
check(
  "headings: all 4 section masks wipe clear",
  scrollEnhancements.masks === 4 && scrollEnhancements.masksRevealed,
  `${scrollEnhancements.masks} masks, revealed=${scrollEnhancements.masksRevealed}`,
);

/* -- 3a. Mobile Projects is native horizontal scroll snap ---------------- */
{
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });
  await mobilePage.goto(url, { waitUntil: "networkidle0" });
  const mobileProjects = await mobilePage.evaluate(() => {
    const list = document.querySelector(".project-native-scroll");
    const experienceCards = [...document.querySelectorAll("#experience article")].map(
      (card) => card.getBoundingClientRect().left,
    );
    return {
      pin: document.querySelectorAll("[data-project-rail]").length,
      list: list ? 1 : 0,
      snap: list ? getComputedStyle(list).scrollSnapType : "none",
      cards: document.querySelectorAll("#projects [data-project-carriage]").length,
      labelled: list?.getAttribute("aria-label") === "Project gallery",
      experienceCards,
      experiencePins: document.querySelectorAll("#experience .stage-pin").length,
    };
  });

  check(
    "projects: mobile uses labelled native horizontal scroll snap",
    mobileProjects.pin === 0 &&
      mobileProjects.list === 1 &&
      mobileProjects.snap.startsWith("x") &&
      mobileProjects.cards === 2 &&
      mobileProjects.labelled &&
      mobileProjects.experienceCards.length === 2 &&
      mobileProjects.experiencePins === 0,
    JSON.stringify(mobileProjects),
  );
  await mobilePage.close();
}

/* -- 3b. keyboard focus is visible ---------------------------------------- */
/**
 * Tabbed for real rather than calling .focus(): programmatic focus does not
 * match :focus-visible in Chrome, so an earlier version of this check was
 * measuring the UA default ring and reporting currentColor.
 */
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((resolve) => setTimeout(resolve, 250));
await page.mouse.click(8, 8);

const tabStops = [];
for (let i = 0; i < 6; i += 1) {
  await page.keyboard.press("Tab");
  tabStops.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement) || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        label: (el.textContent ?? "").trim().slice(0, 14),
        focusVisible: el.matches(":focus-visible"),
        outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`,
      };
    }),
  );
}

const stops = tabStops.filter(Boolean);
const accentRing = "rgb(94, 234, 160)";
const allVisible = stops.every(
  (s) => s.focusVisible && s.outline === `2px solid ${accentRing}`,
);

check(
  `focus: all ${stops.length} tab stops show the accent outline`,
  stops.length > 0 && allVisible,
  stops.length
    ? `${stops[0].tag} "${stops[0].label}" -> ${stops[0].outline}`
    : "no focusable elements reached",
);

/* -- 4. reduced motion: marquee frozen, motion sections in normal flow ---- */
{
  const rmPage = await browser.newPage();
  await rmPage.setViewport({ width: 1440, height: 900 });
  await rmPage.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await rmPage.goto(url, { waitUntil: "networkidle0" });

  const readX = () =>
    rmPage.evaluate(() =>
      [
        ...new Set(
          [...document.querySelectorAll("#index .marquee-row")].map(
            (el) => el.parentElement,
          ),
        ),
      ].map((c) => new DOMMatrix(getComputedStyle(c).transform).m41),
    );

  const first = await readX();
  await new Promise((r) => setTimeout(r, 900));
  const later = await readX();

  check(
    "reduced motion: marquee rows do not move",
    first.length === 3 && first.every((x, i) => x === later[i]),
    `x = ${first.join(", ")}`,
  );

  // Not "the same layout, animated slower": the pin is gone and every item is
  // in normal flow at full opacity.
  const fallback = await rmPage.evaluate(() => {
    const items = [...document.querySelectorAll("#experience h3, #projects h3")];
    return {
      pins: document.querySelectorAll(".stage-pin, .project-rail-pin").length,
      projectRail: document.querySelectorAll("[data-project-rail]").length,
      nativeProjectList: document.querySelectorAll(".project-native-scroll").length,
      items: items.length,
      masks: document.querySelectorAll("[data-heading-mask]").length,
      allOpaque: items.every((el) => {
        for (let n = el; n; n = n.parentElement) {
          if (Number(getComputedStyle(n).opacity) < 1) return false;
        }
        return true;
      }),
    };
  });

  check(
    "reduced motion: motion sections fall back to normal flow, all items visible",
    fallback.pins === 0 &&
      fallback.projectRail === 0 &&
      fallback.nativeProjectList === 1 &&
      fallback.items === 4 &&
      fallback.masks === 0 &&
      fallback.allOpaque,
    `${fallback.pins} pins, ${fallback.items} items visible, ${fallback.masks} masks`,
  );

  await rmPage.close();
}

/* -- 5. contrast across viewports ---------------------------------------- */
let styleCount = 0;
const failures = [];

for (const width of [390, 820, 1440]) {
  await page.setViewport({ width, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 200));

  const rows = await page.evaluate(measureContrast);
  styleCount += rows.length;
  failures.push(...rows.filter((r) => !r.pass).map((r) => ({ ...r, width })));
}

check(
  `contrast: ${styleCount} rendered text styles across 3 viewports meet WCAG AA`,
  failures.length === 0,
  failures.length ? `${failures.length} failing` : "all pass",
);

console.log("");
for (const r of results) {
  console.log(`${r.pass ? "ok  " : "FAIL"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
}

if (failures.length) {
  console.log("\ncontrast failures:");
  for (const f of failures) {
    console.log(
      `  ${String(f.ratio).padStart(5)}:1 (need ${f.required})  ${f.color}  ${f.px}px  @${f.width}  "${f.text}"`,
    );
  }
}

await browser.close();
process.exit(results.every((r) => r.pass) ? 0 : 1);
