# Build Prompt Sequence — Jaden Moore Portfolio

Paste these into Cursor Agent Mode one at a time, in order. Review the diff after each before moving to the next — that's your checkpoint, not per-file approval. Assumes `cursor-rules.md` is already saved as `.cursorrules` (or `.cursor/rules/portfolio.mdc`) in the repo root, so the agent has full brand/tech context on every prompt.

---

### PROMPT 1 — Design plan (do this before any code)
```
Before writing any code, produce a design plan for this portfolio and output it as PLAN.md. Include:
1. Final exact hex values for background, border, text, and accent (confirm or refine the tokens in .cursorrules — you may adjust the accent green's exact shade if you find a more distinctive option, but stay in the muted/desaturated family, not stock acid-green).
2. The specific type pairing you'll use for headings vs. body vs. metadata, with weights and a type scale (sizes for h1/h2/h3/body/caption).
3. A one-paragraph description of the layout concept for the asymmetric grid, plus an ASCII wireframe of the hero and one case study card.
4. Name ONE signature element — the single most memorable, distinctive visual/interaction moment on this site — and explain how it embodies "technical engineering rigor" specifically (not a generic creative-portfolio flourish).
5. A short self-critique: review your own plan against the "Explicitly avoid" list in .cursorrules and confirm nothing in your plan matches those generic-AI-template patterns. If something does, revise it before finalizing.
Do not write any component code yet — output PLAN.md only and stop.
```

### PROMPT 2 — Project scaffold + structural grid shell
```
Scaffold the Next.js App Router project: initialize with TypeScript, Tailwind CSS, and Framer Motion installed. Set up the folder structure (app/, components/, lib/, data/). Configure Tailwind theme tokens (colors, fonts) to match PLAN.md exactly — no default Tailwind palette values should remain in use. Build the structural grid shell component (app/layout.tsx or a Shell component): the asymmetric grid with visible 1px neutral-800 borders described in PLAN.md, responsive down to mobile. Add Geist/Inter and JetBrains Mono via next/font. Do not build any content sections yet.
```

### PROMPT 3 — Scroll-aware navigation
```
Build the fixed numbered navigation component (01 Work / 02 Experience / 03 Contact) as described in .cursorrules. It must: track scroll position and highlight the active section, animate the active-state indicator smoothly (respecting prefers-reduced-motion), be keyboard-navigable with visible focus states, and collapse to a mobile-appropriate pattern below the sm breakpoint (do not just hide it — provide a real mobile nav solution). Place it in components/Nav.tsx and wire it into the layout shell.
```

### PROMPT 4 — Hero section
```
Build the Hero section per the content spec in .cursorrules: name/title/status line, 2-3 sentence positioning statement, the live status indicator with the green accent dot, resume download CTA (primary) plus GitHub/LinkedIn (secondary), and the cycling stack-tags text component using Framer Motion's AnimatePresence with a y-transform/opacity swap looping every 1.5-2s (respect prefers-reduced-motion by freezing on the first tag). Use placeholder resume/GitHub/LinkedIn links marked clearly as TODO. Build it as components/Hero.tsx, fully responsive, matching the layout concept and signature element from PLAN.md.
```

### PROMPT 5 — Engineering Case Studies
```
Build the Case Studies section as an array-driven component. First create data/case-studies.ts with a typed CaseStudy interface (indexTag, name, problemStatement, role, stack: string[], outcomes: string[], links: {code?, demo?, writeup?}) and populate it with 2 real placeholder entries — one for a hydrometric data pipeline dashboard project, one for an enterprise engineering project — using realistic placeholder metrics I'll replace later. Then build components/CaseStudyCard.tsx and the section that maps over the data array. Include the blueprint-style architecture diagram placeholder (SVG, monochrome + accent green lines) per card, the border color shift on hover, and the ASCII arrow (→) hover state on the links. Fully responsive.
```

### PROMPT 6 — Experience / Stack data table
```
Build the Experience section as a command-line-style data table per .cursorrules: columns Company | Role | Dates | Stack | Impact. Create data/experience.ts with a typed array and populate two rows for RBC Capital Markets and TFI International with realistic placeholder details I'll replace later, reverse chronological. Render in JetBrains Mono with the neutral-800 border grid and the same hover border-shift pattern as the case study cards. Make the table degrade gracefully on mobile (stacked/card layout below sm, not horizontal scroll).
```

### PROMPT 7 — Contact section
```
Build the Contact section: obfuscated email (client-side deobfuscation, not a plain mailto with visible address in source), LinkedIn, GitHub, and a repeated resume download CTA. Implement the text-scramble hover effect on the contact links (scramble through random characters briefly before resolving to the real text on hover). Keep copy short and direct per .cursorrules — no manifesto paragraph. Fully responsive, keyboard accessible.
```

### PROMPT 8 — Critique pass, SEO, performance, deploy prep
```
Do a full self-review pass:
1. Compare the built site against the "Explicitly avoid" list in .cursorrules line by line — flag and fix anything that reads as a generic Tailwind/shadcn template pattern.
2. Confirm prefers-reduced-motion is respected everywhere motion was added (Hero cycler, scroll reveals, text-scramble, nav transitions).
3. Add SEO metadata (title, description, OG tags) reflecting the portfolio description from .cursorrules.
4. Run through mobile breakpoints (sm/md/lg) and fix any layout breakage.
5. Check color contrast on all text/background combinations meets WCAG AA.
6. Add a vercel.json if needed and confirm the project builds cleanly with `next build`.
Output a short summary of what you found and fixed in each of the 6 areas above.
```
