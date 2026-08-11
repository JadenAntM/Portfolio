# Jaden Moore — Portfolio

Single-page portfolio site. Next.js App Router, TypeScript, Tailwind v4, Framer Motion.
Deploy target: Vercel.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

Node 22+ recommended.

## Verification

Two harnesses drive the locally installed Chrome through `puppeteer-core` (nothing is downloaded).
Start the dev server first, then:

```bash
npm run shoot -- --url=http://localhost:3000 --tag=check
npm run verify -- --url=http://localhost:3000
```

- **`shoot`** screenshots `.screenshots/` at 390 / 480 / 820 / 1440 / 1700px and fails on any
  horizontal overflow or element escaping the viewport. Useful flags: `--scroll=<section-id>`,
  `--offset=<px>`, `--reduced`, `--full`.
- **`verify`** exercises the text-scramble, the marquee's direction/speed/seam arithmetic, the scroll
  stage's pinned and normal-flow modes, real keyboard tab focus, the reduced-motion fallbacks, and
  measures contrast for every rendered text style at three viewports against WCAG AA.

These caught real defects during the build — see `PLAN.md` §6 and §7. Re-run them after any visual
change; a screenshot alone cannot tell you that a focus ring is fading in, that a dim label fails AA,
or that a marquee row has stalled.

## Design contract

Two documents govern this repo and take precedence over ad-hoc judgement:

- **`.cursorrules`** — brand, tech and content constraints. Inherited automatically by any Cursor
  agent task in this repo.
- **`PLAN.md`** — the design plan: final color tokens with measured contrast ratios, the type
  scale, the grid concept, the signature interaction, and a self-critique against the
  "explicitly avoid" list. Section numbers are referenced from code comments.

If an implementation has to diverge from `PLAN.md`, amend `PLAN.md` in the same change rather than
letting the two drift apart.

## Architecture

```
app/
  globals.css     design tokens (@theme), base layer, grid geometry
  fonts.ts        self-hosted Geist Sans + JetBrains Mono
  layout.tsx      root layout
  page.tsx        the single page, composed of sections
components/
  Shell.tsx       three-track grid + fixed hairline overlay
  Section.tsx     one section: main track + spec column
  SpecBlock.tsx   repeated unit of the spec column
  HeroMarquee.tsx 3-row full-bleed marquee (the signature element)
  ScrollStage.tsx scroll-linked pinned stack, shared by Experience + Projects
data/             typed content arrays (sections, profile, experience, projects)
lib/              helpers
```

Sections, in order: **Hero → Work Experience → Projects → Contact**.

### Design tokens are enforced, not documented

`app/globals.css` resets every default Tailwind namespace to `initial` before declaring project
tokens. Off-plan utilities therefore compile to **nothing** — `bg-zinc-900`, `shadow-lg`,
`rounded-2xl`, `backdrop-blur-md` and `font-bold` are unavailable rather than merely discouraged.
If a class silently has no effect, that is the reason: check the token list in `globals.css`.

Consequences worth knowing:

- Radius is `none` everywhere; `rounded-sm` (2px) is the only step.
- Font weights are 400 and 500, plus 800 used solely by `.marquee-row`.
- Type utilities (`text-display`, `text-h2`, `text-label`, `text-mono-sm`, …) carry size,
  line-height, letter-spacing and weight together.
- Use the `mono` utility rather than `font-mono` — it adds tabular numerals and disables `calt`.

### Grid

Three tracks past `lg`: rail `88px` / main `1fr` / spec `280px`. The two vertical hairlines are
drawn by a viewport-fixed overlay in `Shell.tsx`, which is what makes them continuous for the whole
document height. Horizontal section rules are borders on the sections themselves, so they cross the
verticals. The overlay and every section share the `.sheet-grid` template — change the track sizes
in one place (`globals.css`) and everything stays aligned.

## Fonts

Both families are self-hosted, so builds need no network access and there is no third-party font
request at runtime. Geist Sans comes from the `geist` package; JetBrains Mono is the variable
`woff2` from `@fontsource-variable/jetbrains-mono`, copied to `app/fonts/` and loaded via
`next/font/local`.

## Content status

Placeholder content is marked `TODO` in the data files. See the bottom of `PLAN.md` for the list
of real facts still needed before deploy.
