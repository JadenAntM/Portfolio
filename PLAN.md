# Design Plan — Jaden Moore Portfolio

Status: design plan only. No component code exists yet. This document is the contract that
PROMPT 2 onward must implement exactly.

Aesthetic thesis in one line: **a drawing sheet, not a landing page.** The page should read like
an engineering document with instrumentation on it — hairline rules, mono annotation, one
executable diagram — and should not read like a product being marketed.

---

## 1. Final color tokens

All values below are final. Contrast ratios are computed against the stated background using the
WCAG 2.1 relative-luminance formula.

| Token | Hex | Role | Contrast vs `#0A0A0A` |
|---|---|---|---|
| `bg` | `#0A0A0A` | Page background. The only background. | — |
| `surface` | `#111111` | Optional inset fill for diagram wells and table header row. 1.05:1 vs bg — a barely-there value shift, never a "card". | 1.05:1 |
| `border` | `#262626` | Every structural 1px hairline. Default state for all rules and edges. | 1.31:1 |
| `border-hi` | `#3A3A3A` | Hairline at raised emphasis (diagram edges before The Trace runs). | — |
| `text` | `#F2F2ED` | Headings, lead paragraph, resolved metric values. | 17.63:1 |
| `text-secondary` | `#A8A8A2` | Body copy, table cell content. | 8.28:1 |
| `text-tertiary` | `#85857F` | Mono labels, captions, tags, section metadata. Dimmest value permitted for real content. | 5.33:1 |
| ~~`text-decorative`~~ | ~~`#4A4A46`~~ | **Removed in PROMPT 8.** Intended for non-informational marks only, but the contrast audit found every actual use was carrying meaning. `fg-tertiary` is now the dimmest tier. See §6. | 2.22:1 |
| `accent` | `#5EEAA0` | Signal green. Status dot, progress/active/reveal hairlines, hover borders, and small mono indices. | 12.98:1 |
| `accent-dim` | `#3E7F58` | Accent at rest on hairlines (e.g. focus ring outer, pre-hover diagram accents). Not for text. | 4.13:1 |
| `signal-red` | `#D37769` | **Only** for the diff `-` gutter sigil and its 2px left rule (§3, The Diff). Nothing else in the site uses it. | 6.23:1 |

The flat `bg` token remains the only page color. A static 128px monochrome PNG
tile sits above it at 10% opacity with `soft-light` blending to add visible but restrained
material grain. The layer is fixed, non-interactive, and unanimated; no live SVG
filter is evaluated during scrolling or resizing.

### On the accent — amended 2026-08-06

Final accent is the exact user-approved **`#5EEAA0`**. Its expanded but still restrained roles are
the 1px page-progress line, active-nav underline, heading-wipe edge, hover borders, and
small mono sequence numbers. It remains prohibited for large fills, prose/headings, gradients,
shadows, glows, and blur. The off-white text must remain the dominant high-contrast voice.

### Tailwind mapping — implemented

The project runs **Tailwind v4**, so tokens live in `@theme` in `app/globals.css` rather than in a
`tailwind.config.ts` object. Every default namespace is reset with `initial` before the project
tokens are declared:

```css
@theme {
  --color-*: initial;   --font-*: initial;         --text-*: initial;
  --font-weight-*: initial;  --radius-*: initial;  --shadow-*: initial;
  --inset-shadow-*: initial; --drop-shadow-*: initial;
  --text-shadow-*: initial;  --blur-*: initial;
  /* ...project tokens follow... */
}
```

This makes off-plan values **unavailable rather than discouraged** — the stronger form of the
`boxShadow: none` idea. `radius` exposes only `sm: 2px`; `font-weight` exposes only 400 and 500,
so `font-bold` cannot be written; clearing `--blur-*` removes `backdrop-blur-*` and forecloses
glassmorphism at the toolchain level.

Verified by compiling a probe component containing `bg-zinc-900`, `text-white`, `rounded-2xl`,
`shadow-lg`, `backdrop-blur-md`, `font-bold`, `text-sm`, `border-emerald-400` and
`drop-shadow-xl`: **all nine emit no CSS**, while `bg-bg`, `text-fg`, `rounded-sm`, `text-label`
and `mono` all emit correctly. The probe was then deleted.

Type tokens carry their own line-height, tracking and weight (`--text-display--line-height` etc.),
so `text-display` applies all four properties at once and the §2 scale cannot drift apart in use.

---

## 2. Type system

Two families, loaded via `next/font` with `display: swap` and subset `latin`.

- **Geist Sans** — headings, structure, body prose. Weights **400 and 500 only.** No 600+; heavy
  display weight is one of the loudest template tells, and structural authority here comes from
  the grid rules, not from font weight.
- **JetBrains Mono** — all metadata, labels, tags, metrics, table content, nav indices, code.
  Weights **400 and 500.** `font-variant-numeric: tabular-nums` globally on this family so
  metric columns and the scroll readout never shift width as digits change.

The pairing does the semantic work: **sans = authored prose, mono = measured data.** Nothing
that is a measurement is ever set in sans, and nothing that is a sentence is ever set in mono.
That rule is what makes the mono feel earned rather than decorative.

### Type scale

Base 16px, ratio ≈1.25, fluid via `clamp()` so there are no per-breakpoint font-size overrides.

| Token | Element | Family / Weight | Size (min → max) | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|
| `display` | h1 (name) | Geist 500 | `clamp(2.75rem, 7vw, 4.5rem)` 44→72px | 0.95 | −0.035em | — |
| `h2` | section titles | Geist 500 | `clamp(1.75rem, 3.2vw, 2.5rem)` 28→40px | 1.05 | −0.02em | — |
| `h3` | project / row titles | Geist 500 | `clamp(1.25rem, 2vw, 1.5rem)` 20→24px | 1.15 | −0.015em | — |
| `lead` | hero positioning stmt | Geist 400 | `1.125rem` 18px | 1.55 | −0.005em | — |
| `body` | prose | Geist 400 | `1rem` 16px | 1.6 | 0 | — |
| `label` | section markers, rail keys, column heads | JB Mono 500 | `0.6875rem` 11px | 1.2 | +0.12em | uppercase |
| `mono-sm` | tags, table cells, links | JB Mono 400 | `0.8125rem` 13px | 1.45 | +0.02em | — |
| `metric` | quantified outcomes | JB Mono 500 | `0.9375rem` 15px | 1.3 | +0.01em | tabular |
| `micro` | diagram node labels, tick marks | JB Mono 400 | `0.625rem` 10px | 1.1 | +0.1em | uppercase |

Measure constraints: `lead` capped at 58ch, `body` at 62ch. Prose never spans the full main
track on desktop — the deliberately short measure against a wide column is part of the editorial
feel.

---

## 3. Layout concept

### The concept

The page is built as a single continuous **three-track asymmetric grid** over a 12-column base:
a narrow fixed left rail (88px) carrying the sequential nav indices, a wide main content track
(cols 3–9), and a right spec column (280px, cols 10–12) carrying metadata, stack tags, and a live
scroll readout. The defining structural move is that the two vertical hairlines at the
rail/main and main/spec boundaries are **continuous for the entire document height** — they do
not stop or restart at section edges. Sections are delimited instead by full-bleed horizontal
hairlines that run edge to edge and *cross* those verticals, producing visible intersections, so
the whole page reads as one drafted sheet rather than a stack of independent cards. Content is
never centered: hero copy sets flush to the main track's left edge at a 58ch measure, leaving
deliberate open space at the right of that track, while project cards break one column wider
than the prose above them so successive blocks intentionally fail to align. Asymmetry comes from
this consistent left-anchoring plus the 88/1fr/280 track ratio, not from decorative offsets.

### Responsive behavior

| Breakpoint | Tracks | Rail | Spec column |
|---|---|---|---|
| `<640px` | 1 track, 16px gutters | fixed bottom bar, 48px, hairline top | reflows to inline mono meta blocks **below** the content it annotates, separated by a hairline |
| `640–1023px` | 2 tracks: `1fr / 220px` | sticky top strip, 40px | stays as right column, narrowed |
| `≥1024px` | 3 tracks: `88px / 1fr / 280px` | fixed left, full height | full |
| `≥1536px` | same, sheet capped at 1440px and centered | outer page-frame verticals become visible | full |

Horizontal hairlines persist at every breakpoint — they are the one structural element that
never drops on mobile.

**Amendment (PROMPT 2).** The spec column originally reflowed *above* the content it annotates on
mobile. Implemented as *below* instead: putting it above required either a DOM order with metadata
before the narrative, or a CSS reorder that desynchronises visual and screen-reader order. Placing
it after the narrative keeps DOM order identical to visual order at every breakpoint, which is
worth more than the original ordering preference. The Hero's quiet cohort marker stays in the
main track so it remains adjacent to the identity block at every breakpoint.

**Implementation note.** The two continuous verticals are drawn by a single viewport-fixed overlay
(`GridRules` in `components/Shell.tsx`), not by borders on section elements. Being fixed, they are
unbreakable by construction — no section can interrupt them. The overlay, the rail wrapper and
every section all share one `.sheet-grid` template, so the hairlines cannot drift out of alignment
with the tracks they delimit. The desktop rail is transparent rather than opaque so the horizontal
section rules pass through it and the intersections stay visible; the mobile bar and tablet strip
are opaque, since real content scrolls beneath those.

### Hero wireframe

```
├──────────┬────────────────────────────────────────────────┬───────────────────┤
│          │                                                │ INDEX             │
│  01 ▸    │  JADEN MOORE                                   │  SECTION  01/04   │
│  WORK    │  Software Engineering · 4th Year               │  SCROLL   00.0%   │
│          │                                                │                   │
│  02      │  ────────────────────────────────              │                   │
│  PROJ    │                                                │                   │
│          │  NEW_GRAD_2027                                 │                   │
│  03      │                                                │                   │
│  CONTACT │  Positioning sentence one, direct and          │                   │
│          │  objective, 58ch measure.                      │                   │
│          │  Sentence two states the domain.               │                   │
│          │  Sentence three states the specialization.     │                   │
│          │                                                │                   │
│          │  ┌─────────────────────┐                       │                   │
│          │  │ RESUME.PDF       ↓  │  GITHUB →  LINKEDIN → │                   │
│          │  └─────────────────────┘                       │                   │
├──────────┴────────────────────────────────────────────────┴───────────────────┤
   SOFTWARE ENGINEER   SOFTWARE ENGINEER   SOFTWARE ENGI      → 26px/s
YTHON  GO  KAFKA  PYTHON  GO  KAFKA  PYTHON  GO  KAFKA  PY    ← 34px/s
  AWS  POSTGRES  TYPESCRIPT  AWS  POSTGRES  TYPESCRIPT  AW    → 20px/s
├───────────────────────────────────────────────────────────────────────────────┤
```

Notes: the cohort marker is quiet tertiary mono metadata with no system-status treatment. The resume CTA is a 1px `border`
rectangle with `radius: 2px` that shifts to `accent` on hover — not a filled button. Secondary
links are underline-less mono with the `→` sliding 3px on hover. `SECTION` and `SCROLL` are live
values, computed from real scroll state, not decoration.

The marquee band is the one element in the site that **ignores the grid**: its rows are full-bleed
and run straight through the vertical hairlines. Everything else is contained by a track, which is
what makes the override read as intentional. Rows descend in tone (`text` → `secondary` →
`tertiary`) so the title carries the most weight and the stack rows recede behind it.

**Amendment (round 2).** The spec column's `FOCUS` block and its stack-tag cycler are gone; the
marquee now carries the stack at hero scale, and keeping a second, smaller, differently-animated
presentation of the same six strings would have been redundant. `INDEX` moves up to first position
and the status line stays in the main track.

### Work experience block wireframe

```
├──────────────────────────────────────────────┬────────────────────────────────┤
│                                              │ STACK                          │
│  ┌─────┐                                     │  [Go] [Kafka] [Postgres]       │
│  │ RBC │  RBC Capital Markets                │  [Kubernetes]                  │
│  └─────┘  Software Engineer Intern           │                                │
│                                              ├────────────────────────────────┤
│  2025.05 — 2025.08                           │ POSITION                       │
│                                              │  01 / 02                       │
│  01  Rebuilt trade reconciliation as a       │                                │
│      continuous consumer over Kafka…         │                                │
│  02  Held 42K msg/min per partition…         │                                │
│  03  Added a quarantine path…                │                                │
│  04  Instrumented consumer lag…              │                                │
├──────────────────────────────────────────────┴────────────────────────────────┤
```

The logo is a **monogram**, not a brand asset: the company's initials in mono inside a square of the
same `border-hi` hairline the grid is drawn with. Two reasons, and the second is the one that
actually decided it — using a company's real logo without permission is a trademark question, and
dropping two foreign logos into a two-color system means importing two foreign palettes, which would
undo §1 in a single component.

### Project card wireframe

```
├──────────────────────────────────────────────┬────────────────────────────────┤
│  ┌────────────────────────────────────────┐  │ STACK                          │
│  │                                        │  │  [Go] [Postgres] [Docker]      │
│  │              PROJECT_01                │  ├────────────────────────────────┤
│  │                                        │  │ LINK                           │
│  └────────────────────────────────────────┘  │  View project →                │
│                                              ├────────────────────────────────┤
│  Project One                                 │ POSITION                       │
│  One line: what it does and what it runs on. │  01 / 03                       │
├──────────────────────────────────────────────┴────────────────────────────────┤
```

Placeholder images are `placehold.co` URLs with this site's own hex values baked in
(`/111111/85857f/`), so an unreplaced card reads as a deliberately empty slot rather than as stock
photography nobody got around to swapping. The frame keeps its 1px `border` and 2px radius, and a
`max-h` clamp so the image crops instead of pushing the copy out of the pinned viewport on a short
screen.

### The scroll stage (shared by both sections)

Work Experience and Projects run on one component, `ScrollStage`, so the scroll from the first
company through the last project never changes its transition grammar. The track is `count × 100vh`
tall with a pinned viewport inside it; items are stacked in place and each owns `1/count` of the
range. Handoffs use a sequential 16%-of-step exit/enter window so blocks of unequal height never
remain printed over each other. Outgoing items travel to `-112px` and `scale(0.97)`; incoming items
arrive from `+112px`. Translation and scale are filtered through a well-damped Framer spring.

Lenis owns wheel interpolation and publishes the shared scroll MotionValues used by the hero exit,
both stages, the nav/readout, and the fixed progress line. Its RAF runs through Framer Motion's
frame loop, so smooth scrolling and spring transforms are evaluated on the same animation clock.

Scroll-**linked**, not scroll-**triggered**: scrubbing back up runs the handoff in reverse and
stopping mid-transition holds both items at their partial states. The stage uses Lenis-backed
MotionValues plus `useTransform`; `whileInView` remains reserved for the one-shot heading masks.

The stage abandons the pin entirely in two cases, and renders its items as a plain
hairline-separated list in normal flow instead:

- **Reduced motion.** A transition whose entire content is movement has no slower version.
- **Below 640px.** The pinned viewport there is 796px on a common phone, and a company block with
  its spec column stacked underneath measured within ~10px of that using placeholder copy. Real
  bullets are longer, and the pin's `overflow: hidden` would have silently eaten them. Losing an
  effect is cheaper than losing content.

Both fallbacks are what ships in the SSR HTML — the media-query hooks return the static snapshot on
the server — so the pinned version is strictly an enhancement.

---

## 4. Signature element — **the hero marquee** (revised in round 2)

### What this section used to say, and why it changed

The original signature was **The Trace**: each detailed project's architecture diagram executed once on
scroll-into-view, a square packet walking the graph in topological order, edges switching from inert
grey to signal green as it cleared them, node metrics resolving from `--.--` to their measured values
as it arrived. It shipped and it worked.

Round 2 removed that detailed project format outright, which removed The Trace and its supporting
unified-diff treatment with it, since both belonged to that project format and had nowhere else to
live. That is worth stating plainly rather than quietly reformatting, because **the old §4 argued for
The Trace by name against a marquee**:

> A generic portfolio flourish (a cursor trail, a scroll-parallax hero, a marquee) would be
> removable without losing information; remove The Trace and the architecture diagram and its
> metrics go with it.

That argument was correct and the site is now on the losing side of it. The marquee is removable
without losing information — the title and the stack both exist as real text elsewhere, and the
`sr-only` summary alongside the rows is proof of exactly that. So this is a deliberate trade of
**informational** signature for **compositional** signature, not an upgrade, and the honest summary
of round 2 is: the site got a stronger first impression and a weaker centerpiece.

The specific thing lost: a reviewer no longer sees a diagram that models a system as a graph with
numbers attached to its stages. If detailed project write-ups return, The Trace should return with them,
and it should be the signature again — the marquee is the better *opening* but the diagram was the
better *argument*.

### The marquee, specified

Three rows of 800-weight uppercase display type, full-bleed, crossing the sheet's verticals. Row 1
is the title; rows 2 and 3 are the stack split in half. Directions alternate `+ - +` and speeds run
26 / 34 / 20 px/sec.

- **Speed is px/sec, not duration.** The obvious build is a CSS keyframe to `translateX(-50%)` over
  a fixed duration, but then a row's speed is a function of its content width, and
  "SOFTWARE ENGINEER" would visibly travel at a different rate than a three-item skill row. One
  group is measured and px/sec is integrated by elapsed time in `useAnimationFrame`, which is what
  makes 26 / 34 / 20 a deliberate ladder instead of three arbitrary durations.
- **The seam is closed by arithmetic, not by eyeballing.** Copy count is derived from the measured
  group width as `ceil(viewport / group) + 1`; the wrap moves `x` by exactly one group width, and
  every group is identical, so the jump is unobservable. Two hardcoded copies would only be enough
  when one group already exceeds the viewport, which at 1440px it does not for the shorter rows.
- **Reduced motion freezes the rows at `x = 0`** rather than animating them slowly.
- **The rows are `aria-hidden`,** with an `sr-only` sentence carrying the title and the full stack.
  Announcing "Software Engineer" six times is noise, and the facts must not live only inside an
  animation.
- **Scroll-linked exit.** As the band leaves, the outer rows converge on the middle one, each row
  drifts further along its own axis, and the band fades and scales to 0.94 — so the hero hands off
  to Work Experience under scroll control rather than just scrolling away. The first 45% of the exit
  range is **held at rest**: without the hold the band began dimming a few dozen pixels into the
  page, meaning the first thing a visitor did to the marquee was wash it out.

### Motion budget (the complete inventory — nothing else animates)

1. **Hero marquee** — three rows, continuous, 26 / 34 / 20 px/sec.
2. **Hero exit** — scroll-linked converge + drift + fade on the marquee band.
3. **Scroll stage handoff** — scroll-linked cross-fade between experience blocks and between
   project cards, one shared component (§3).
4. Nav active indicator — Framer `layoutId` slide, 180ms.
5. Section-header reveal — neutral cover panel wipes left-to-right in 750ms with a 1px accent edge,
   once, **section headers only** (not cards, paragraphs, list items, or tags).
6. Hover states — border color 140ms, `→` translate 3px 140ms.
7. Contact link text-scramble — ~400ms, resolves on hover.

Items 1–3 are new in round 2; The Trace and the stack-tag cycler were removed, so the inventory went
from six items to seven. Every one checks `prefers-reduced-motion` and has a defined static
fallback — and note that the concentration rule still holds: the budget is spent in two places (the
hero and the stage), not sprinkled across elements.

---

## 5. Self-critique against the "Explicitly avoid" list

Line by line, honestly:

| Avoid item | Verdict |
|---|---|
| Gradient blobs / mesh gradients | **Clear.** Exactly one background value (`#0A0A0A`). `surface` `#111111` is a flat 1.05:1 inset, not a gradient. No `bg-gradient-*` utility will appear anywhere. |
| Glassmorphism / frosted panels | **Clear.** No `backdrop-blur`, no translucency. The fixed rail and mobile nav bar sit on opaque `bg` with a 1px hairline — they read as a chassis edge, not glass. |
| Soft glowing box-shadows | **Clear**, and enforced structurally: the Tailwind `boxShadow` scale is set to `none` in PROMPT 2 so glow is unavailable, not just avoided. |
| Overly rounded corners | **Clear.** Radius scale reduced to `none` + `sm: 2px`; no decorative pills or circular status controls. |
| Emoji in UI copy | **Clear.** Verified by scanning all source for non-ASCII: the complete set shipped is `→ ↓ · — –` plus the ASCII `+ - [ ] @@`. No emoji. (The planned `▸ ▼ ─ │ ●` were never needed — the grid draws its own rules, so box-drawing characters would have been redundant.) |
| Evenly-distributed scroll animations | **Clear, and re-examined in round 2.** Round 2 added three scroll-driven behaviours, which is exactly the direction this item warns about — the defence is that they are *concentrated*, not distributed: two live in the hero and one is a single shared component used by two sections. Nothing animates per-paragraph, per-bullet or per-tag. The scroll-reveal scope is still section headers only. |
| Filler / marketing adjectives | **Clear.** Copy rules: no adjective that can't be measured. Experience bullets are quantified lines with units. |
| No centered-hero-with-big-stat-and-gradient | **Clear.** Hero is left-anchored in a three-track grid with no hero stat and no gradient. |
| No `rounded-2xl` cards with shadows | **Clear.** There are no card containers at all — blocks are defined by hairline intersections. |

Two expansions of the `.cursorrules` token set were made, and only one survives:

| Addition | Verdict |
|---|---|
| `signal-red` `#D37769` for diff `-` lines | **Removed in round 2.** It was justified only by an older unified-diff project body; when that format was removed it would have become the single unused color in the palette, so the token was deleted. `.cursorrules` records that the palette is two colors and four greys, and that a third hue needs a use the greys cannot carry. |
| `font-weight-black` `800` for the marquee | **Justified but flagged.** The type system caps at 500 for instrument-like restraint, and 500 at 120px reads as thin rather than as restrained — the reference this was built against uses an ultra-condensed black face. Scope is one CSS class, `.marquee-row`. Geist is variable across 100–900, so this costs no extra font payload. |

### Three design decisions revised

1. **Accent distribution.** The user-approved `#5EEAA0` now carries several small instrumentation
   roles instead of appearing almost exclusively on hover. Its area remains constrained to dots,
   hairlines, and mono indices.
2. **Progress line restored.** A 1px fixed edge line now complements the numeric `SCROLL 00.0%`
   readout. It is intentionally edge-bound and unlabelled, so it reads as sheet instrumentation
   rather than a decorative top bar.
3. **Pulled color out of the diff line text.** The obvious implementation tints whole `+`/`-` lines
   green and red, as GitHub does. That would have blown the accent usage ceiling (multiple full
   lines of accent text), dropped removed lines to a lower contrast than the rest of the page, and
   encoded meaning in two colors that measure 1.71:1 against each other. Color was confined to the
   sigil and a 2px gutter rule. (Moot as of round 2 — the diff is gone — but the reasoning is the
   reason `signal-red` was deleted rather than repurposed.)

The honest residual risk is that a hairline-grid dark portfolio is itself becoming a recognizable
genre. What differentiates this one is that its structure carries information — continuous
verticals, a live scroll/section readout, and quantified bullets rather than adjectives — rather
than drawing hairlines for texture. Round 2 raised a second residual risk: a full-bleed type marquee
and a pinned scroll stage are both *widely* recognizable devices in 2026 portfolio work, which is a
step toward the genre rather than away from it. The mitigation is that both are executed against
this site's own system (mono/grid tokens, hairline crossings, the position counters) rather than
imported wholesale, but it is a real cost and worth re-reading §4 before adding a third such device.

---

## 6. Build audit (PROMPT 8) — what the checks actually found

Two harnesses live in `scripts/` and drive the installed Chrome through
`puppeteer-core`: `npm run shoot` captures every breakpoint and reports horizontal overflow,
`npm run verify` exercises interaction and measures contrast. Both are re-runnable, so these are
standing checks rather than a one-time pass. What they caught:

**Contrast — 6 fixes, and one token deleted.** The first run failed 16 of 127 text styles, every one
of them the `fg-decorative` tier at 2.22:1. Reviewing each use showed the tier was never actually
decorative: it was carrying nav section indices, diff hunk headers, the diagram caption, outcome
ordinals, the `SECTION 01/04` total, and — found only after the audit was extended to mobile widths —
the stacked table's cell labels, which are the *only* labels at that breakpoint. All were raised to
`fg-tertiary` and **`fg-decorative` was removed from the theme entirely** rather than left as a
footgun. Final state: 357 rendered text styles across 390 / 820 / 1440px, all passing AA.

**The focus ring was fading in.** Tailwind's `transition-colors` includes `outline-color`, so every
interactive element animated its focus ring over 150ms from `currentColor` to the accent. A focus
indicator should be instant, so all six uses were narrowed to `transition-[color]` or
`transition-[border-color]`. Verified by tabbing for real — programmatic `.focus()` does not match
`:focus-visible` in Chrome, which is what disguised the problem initially.

**Active-section tracking was wrong at both ends.** The first implementation used an
IntersectionObserver band at mid-viewport. That made section 01 active while the page was still at
scroll 0, and would have left the final section permanently inactive, because a short last section
never reaches the middle of the viewport. Replaced with a scroll-derived reading line at 35% plus an
explicit bottom-of-document case (`lib/useScrollState.ts`).

**The Trace collided with its own labels.** Branch connectors were drawn from each node's bottom
edge, straight through the centred metric text below it. Fixed by moving annotations out of any lane
a connector uses. (Component removed in round 2 with the older project format.)

**Five `set-state-in-effect` violations.** React's newer lint rule flagged synchronous setState in
the reduced-motion hook, the scramble, the metric count-up, the cleared-edge counter, and the email
assembly. Fixed structurally, not suppressed: `matchMedia` and the hydration flag became
`useSyncExternalStore` subscriptions, animation frames are now keyed to the activation that produced
them so stale frames are impossible, and the reduced-motion end state is derived rather than
scheduled.

**Reduced motion.** Verified per item: the scramble is disabled outright, nav indicator transitions
drop to 0s, and a global media query floor covers anything added later.

**Avoid-list scan.** Source greps for gradients, blur/glass, shadows, radius, non-ASCII glyphs and
marketing adjectives return only token resets and comments documenting their absence. Radius is
`rounded-sm` (2px) everywhere.

### One deviation worth flagging

The OG card (`app/opengraph-image.tsx`) uses **Geist Mono** rather than JetBrains Mono, because
Satori requires a TTF and `@fontsource` ships woff2 only. It is the one place in the project where
the mono family differs, and it never appears next to the real one.

---

## 7. Round 2 audit — marquee, and the section restructure

Sections are now **Hero → Work Experience → Projects → Education → Contact**. The older detailed-project format was removed along with
its component, its data file, `TraceDiagram`, `DiffBlock`, the `signal-red` token, the old
`Experience` data table and `StackCycler`. The old table would have duplicated the same two companies
the new blocks now cover, so it went rather than sitting one section apart from its own replacement.

The harnesses were extended, since two of their checks were asserting against deleted markup:

**A check that tested nothing.** `verify` was still asserting the data table's row hairline, which
returned `null` once the table was gone — a real failure, but for the wrong reason. Replaced with
three marquee assertions read from the composited transform rather than from source: that the rows
travel `+ - +`, that their speeds are distinct (measured 26 / 34 / 20 px/sec), and that
`carrier width ≥ viewport + one group` so a wrap cannot expose a seam. Plus a reduced-motion pair:
rows pinned at `x = 0`, and zero `.stage-pin` elements with all five items visible in normal flow.

**The reduced-motion cycler check was passing by accident.** It read the second `<span>` inside the
hero's first `aria-hidden` element. With the cycler deleted that selector resolved to marquee text,
which is static, so the check reported green while testing a component that no longer existed.

**The seam check failed on a measurement artifact, not a seam.** `getBoundingClientRect().width` was
being compared against the transform's `m41`. The scramble check earlier in the run leaves the page
scrolled to the footer, where the band carries its scroll-linked `scale(0.94)` — so the widths were
scaled while the translate was not, understating coverage by 6%. Fixed by measuring `offsetWidth` and
scrolling to top first, both of which are the right thing independent of the bug.

**The overflow check needed a real definition of "overflow".** The marquee rows are deliberately
wider than the viewport inside an `overflow: hidden` row, which the old check counted as escape at
every breakpoint. It now walks ancestors for a clipping context and only reports genuinely unclipped
escape; document-level horizontal scroll is still asserted strictly and separately.

**The mobile pin was 10px from eating content.** Measured at 390×844, a company block with its spec
column stacked underneath filled 785px of a 796px pinned viewport using placeholder bullets. Rather
than shrink type or trim copy, the stage now falls back to normal flow below 640px (§3).

### One thing left unfixed, deliberately

**On phones the marquee is below the fold.** At 390×844 the identity block — name, discipline, status
line, three positioning sentences, three CTAs — fills the viewport on its own, and the `INDEX` spec
block reflows underneath it before the band. Reordering the marquee above the spec block on mobile is
possible (give the band an explicit grid row and pin `.track-spec` to row 1 past `sm`) but it was
measured as moving the band up by roughly 200px, which does not get it above the fold either. The
alternatives were cutting hero copy or hiding the live readout on mobile, and neither is worth
trading for a signature that arrives on the first scroll instead of on load. Reconsider if the
positioning statement ever gets shorter.

Final state: no overflow at 390 / 480 / 820 / 1440 / 1700px, 270 rendered text styles passing AA
across three widths, all interaction checks green, one `h1` / four `h2` / six `h3` with no
level skipped, and `next build` and `eslint` clean.

---

## Content facts still needed from Jaden (do not fabricate)

Placeholders will be marked `TODO` in code and must be replaced before deploy:

- Resume PDF — drop the file at `public/resume.pdf`; both CTAs already point there
- Contact email — re-encode as base64 halves in `EMAIL_PARTS`, see the comment there
- Production domain is derived from Vercel's canonical production-host variable so Open Graph, robots, and sitemap URLs resolve absolutely
- Real screenshots for PocketSpotter and Fish Species Classifier. When the images become local
  files, delete the `images.remotePatterns` entry in `next.config.ts`
- Graduation term (assumed `NEW_GRAD_2027` per the status line in `.cursorrules` — confirm)
