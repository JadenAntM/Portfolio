# How to use this file
Save this content as `.cursorrules` in your repo root, OR as `.cursor/rules/portfolio.mdc` (Cursor will pick either up automatically). Every Agent task in this repo will then inherit this context without you re-pasting it.

---

## Project
Personal portfolio for **Jaden Moore**, a 4th-year software engineering student targeting technical recruiters, senior engineering leads, and quantitative technology hiring managers for internships/new-grad roles. Single-page scroll site. Goal: read as deep technical competence and engineering rigor — the opposite of a generic AI-template site.

## Tech stack (do not deviate without asking)
- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Hosting target: Vercel

## Design tokens
- **Background:** near-black, `#0A0A0A`
- **Border/structure:** `neutral-800` (`#262626`)
- **Text:** off-white, `#F2F2ED` (not pure white — slightly warm to avoid stark AI-default contrast)
- **Accent:** a muted signal green, `#5EEAA0` (desaturated/phosphor-leaning — NOT stock acid-green `#00FF00`-style). Use sparingly: status dots, active nav state, hover border shifts. It should never be a large fill or a glow/shadow effect.
- **Headings/structure:** Geist or Inter
- **Metadata, metrics, tags, code, table content:** JetBrains Mono

## Layout & structure rules
- Asymmetric grid with visible 1px `neutral-800` borders — the grid itself is a structural/visual element, not just a container
- Numbered section markers (`01/02/03`) are allowed ONLY because the nav, experience blocks, and project positions are genuinely sequential — do not add numbering elsewhere decoratively
- No centered-hero-with-big-stat-and-gradient-accent template
- No `rounded-2xl` cards with soft drop shadows / glassmorphism — this is a hard-edged, blueprint/editorial aesthetic, not a SaaS-landing-page aesthetic

## Explicitly avoid (generic AI-template tells)
- Gradient blobs or mesh gradients as background decoration
- Glassmorphism / frosted-glass panels
- Soft glowing box-shadows on cards or buttons
- Overly rounded corners as a default (prefer sharp or minimally rounded, 2–4px max)
- Emoji in UI copy or headings
- Evenly-distributed scroll animations on every element — motion should be purposeful and concentrated (see Motion below), not sprinkled everywhere
- Filler/marketing adjectives in copy ("passionate", "innovative", "cutting-edge") — tone is direct, objective, technical

## Content sections (in this order)
1. **Hero** — name, title, 4th-year status; 2–3 sentence direct positioning statement; live status indicator styled as system state (e.g. `STATUS: OPEN_TO_WORK · NEW_GRAD_2027`) with the green accent dot; resume download CTA (primary) + GitHub/LinkedIn (secondary); optional cycling stack tags (`[Python] [Go] [Kafka] [AWS]`) using a vertical text-cycler — `AnimatePresence` + `y`-transform/opacity swap, looping every 1.5–2s
2. **Projects** — array-driven wide cards on a thin schematic rail. Each has: position, project name, direct description, stack as JetBrains Mono tags, image, and project link. Desktop maps a pinned vertical range to horizontal travel; mobile and reduced motion use native horizontal scrolling
3. **Experience / Stack** — command-line-style data table: `Company | Role | Dates | Stack | Impact`. Rows: RBC Capital Markets, TFI International, reverse chronological. Impact cells are one sharp quantified line each, monospace
4. **Contact** — obfuscated email, LinkedIn, GitHub, resume download (fallback CTA). Short and direct — no manifesto-style paragraph here

## Motion rules
- Minimal and purposeful only: subtle scroll reveals, active-section nav observer, smooth layout transitions
- ASCII arrow (`→`) hover states on links/CTAs
- Text-scramble effect on contact link hover
- Border color shift (`neutral-800` → accent green) on project cards and table rows
- Respect `prefers-reduced-motion` for all of the above

## Non-negotiable quality floor
- Fully responsive down to mobile (this is not optional polish, build it in from the start of each component)
- Visible keyboard focus states on every interactive element
- Semantic HTML and proper heading hierarchy
- Every project/table entry driven by a typed data structure (array of objects), not hardcoded JSX per item

## Before considering any visual work "done"
Check it against the "Explicitly avoid" list above. If it could be mistaken for a default Tailwind/shadcn template or a generic dark-mode SaaS site, revise it.
