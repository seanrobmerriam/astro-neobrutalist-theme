# Landing Page Redesign — Design

## Goal

Build a real marketing landing page for the theme at `/landing`, composed from
the existing block/component library plus a small number of new pieces for
sections that don't have a match yet (pricing, testimonials, FAQ). Leave
`src/pages/index.astro` (the all-in-one component showcase) untouched.

Sections, top to bottom: Navbar → Hero → Features → Pages → Pricing →
Testimonials → FAQ → CTA → Footer.

## Scope decisions

- **New route, not a replacement.** `src/pages/index.astro` stays the
  component showcase. The new page lives at `src/pages/landing.astro`.
- **Blog and Portfolio get real index-only stub pages** (`/blog`,
  `/portfolio`) so the Pages section's cards link somewhere real, instead of
  describing capabilities that don't exist yet. No detail/slug pages, no
  content collection — just a card grid on each, built from existing
  primitives (`CardStacked`, `Card`). This is a deliberately small addition;
  a full content-collection-backed blog/portfolio (matching the `/docs`
  pattern) is out of scope.
- **Extend existing components rather than fork new ones**, wherever the
  extension is additive and default-preserving:
  - `Hero.astro` gets `layout?: "centered" | "split"` (default `"centered"`)
    and a `graphic` named slot. The showcase page's existing `<Hero>` call
    passes no `layout`, so it renders exactly as it does today. In `"split"`
    mode, the two columns sit side by side at `sm:` and up; below that they
    stack with the text column first and the graphic below it.
  - `Accordion.astro` gets `items: { question: string; answer: string }[]`,
    defaulting to its current 3 hardcoded FAQ entries. The showcase page's
    existing `<Accordion />` call (no props) renders identically.
  - `FeatureGrid.astro`'s `Feature` type gets an optional `href`, passed
    through to the underlying `Card`. Existing callers that don't set it are
    unaffected.
- **Reuse `FeatureGrid` twice** — once for the 6-card Features section (as
  today, on the showcase page) and again for the 3-card Pages section — since
  both are just "heading + N cards", which is exactly what `FeatureGrid`
  already does. No new component needed for either.
- **New primitives only where the card shape genuinely differs** from
  `Card`'s title/description/accent shape: `PricingCard` (plan name, price,
  feature checklist, CTA) and `TestimonialCard` (quote + attribution).

## New files

| File | Purpose |
|---|---|
| `src/pages/landing.astro` | The landing page itself |
| `src/pages/blog.astro` | Index-only blog stub, 4 placeholder posts via `CardStacked` |
| `src/pages/portfolio.astro` | Index-only portfolio stub, 4 placeholder projects via `Card` |
| `src/components/Pricing/PricingCard.astro` | Single pricing tier: name, price, period, feature list, CTA. A `featured?: boolean` prop swaps the flat `bg-paper` fill for an accent fill (`bg-yellow`), bumps the shadow to `shadow-brutal-lg`, and adds a "Most popular" badge — same accent/badge pattern already used for eyebrow tags elsewhere (e.g. `Hero`'s eyebrow pill) |
| `src/blocks/Pricing/Pricing.astro` | Heading + 3 `PricingCard`s from a `plans` prop |
| `src/components/Testimonial/TestimonialCard.astro` | Quote + name + role, flat accent background |
| `src/blocks/Testimonials/Testimonials.astro` | Heading + 3 `TestimonialCard`s from a `testimonials` prop |
| `src/blocks/FAQ/FAQ.astro` | Heading + `Accordion` with an `items` prop passed through |

## Modified files

| File | Change |
|---|---|
| `src/blocks/Hero/Hero.astro` | Add `layout` prop (default `"centered"`) and `graphic` slot. In `"split"` mode: two-column layout, text block left (eyebrow/title/subtitle/CTAs), `<slot name="graphic">` right. |
| `src/components/Accordion/Accordion.astro` | Add typed `items` prop, default value = current 3 hardcoded FAQs. Render via `.map()` instead of 3 copy-pasted `<details>` blocks. |
| `src/blocks/FeatureGrid/FeatureGrid.astro` | `Feature` type gains optional `href?: string`, passed to `<Card href={...}>`. |

No other existing files change. `AccordionContained.astro` and
`AccordionGroup.astro` are left as-is (out of scope — not used by this page).

## Section-by-section content

**Navbar** (via `LandingLayout`): brand "Neubrutal", links → Features
(`#features`), Pricing (`#pricing`), Testimonials (`#testimonials`), FAQ
(`#faq`), Docs (`/docs`). CTA button "Get Theme" → `#pricing`.

**Hero** (`layout="split"`):
- eyebrow: "Astro + Tailwind CSS v4"
- title: "Build loud. Ship fast."
- subtitle: "A complete neubrutalist component library for Astro — thick
  borders, hard shadows, and flat color, ready to assemble into any page you
  need."
- primaryCta: "Get Theme" → `#pricing`
- secondaryCta: "Read Docs" → `/docs`
- graphic slot: a bordered, hard-shadowed placeholder block (flat accent
  fill + simple geometric mark), sized to sit level with the text column.
  Swap-in point for a real product shot later.

**Features** (`FeatureGrid`, 6 cards) — reused verbatim from
`src/pages/index.astro`'s `featureItems`:
1. Zero-JS by default
2. Tokenized aesthetic
3. Full component set
4. Composable blocks
5. Accessible by construction
6. Astro-native

**Pages** (`FeatureGrid`, 3 cards, now with `href`):
1. Blog → `/blog` — "Long-form posts, tags, and a clean reading layout —
   built from the same components as everything else."
2. Landing → no href (current page) — "The page you're on. Hero, pricing,
   testimonials, FAQ — swap the copy and ship."
3. Portfolio → `/portfolio` — "A project grid for case studies and client
   work, styled with the same bold, flat-color system."

**Pricing** (`Pricing` block, 3 `PricingCard`s):
1. **Free** — $0 — "Personal projects" — Components, blocks, and layouts;
   MIT license; Community support — CTA "Get started" (outline variant)
2. **Pro** (featured) — $49 one-time — "Solo developers & freelancers" —
   Everything in Free; Figma source files; Priority email support; Lifetime
   updates — CTA "Get Pro" (primary variant), "Most popular" badge
3. **Team** — $149 one-time — "Agencies & product teams" — Everything in
   Pro; Up to 10 team seats; Private Discord channel — CTA "Get Team"
   (outline variant)

**Testimonials** (`Testimonials` block, 3 `TestimonialCard`s) — reused from
3 of the 7 carousel quotes already on the showcase page:
1. "Finally, a theme with an opinion." — Design lead, seed-stage startup
2. "Shipped our landing page in an afternoon." — Solo founder
3. "Every component just... matches." — Freelance developer

**FAQ** (`FAQ` block, 4 items) — 3 reused from the existing hardcoded
Accordion/AccordionContained defaults, 1 new:
1. "What's included?" — full component library, blocks, and layouts, built
   with Tailwind CSS v4 and typed Astro props
2. "How do I get started?" — copy a component or clone the theme and start
   editing
3. "Can I change the color palette?" — every color is a single OKLCH token
   in `global.css`
4. *(new)* "Do I need to know Tailwind?" — "Not deeply — every component
   ships with its styling already written. You'll want basic Tailwind
   familiarity to customize layouts, but nothing more."

**Closing CTA** (`CTA` block) — reused verbatim from
`src/pages/index.astro`: "Build your next project loud." / "Every
component, block, and layout on this page is yours to copy." / primary "Get
Theme" (→ `#pricing`), secondary "Star on GitHub" (external).

**Footer** (via `LandingLayout`) — two groups (not three — no fabricated
"Company" group with dead links):
- **Product**: Features (`#features`), Pricing (`#pricing`), FAQ (`#faq`)
- **Resources**: Documentation (`/docs`), Astro docs, Tailwind CSS

## Blog stub content (`/blog`)

4 `CardStacked` entries, `href="#"` (component's default — no detail pages):
1. "Shipping a full component library in a weekend" — Jun 2, 2026 (reused
   from the showcase page's existing example)
2. "Why we went with hard shadows instead of blur" — May 14, 2026
3. "Square corners, on purpose" — Apr 1, 2026
4. "Tokens over utility soup" — Mar 10, 2026

## Portfolio stub content (`/portfolio`)

4 `Card` entries, `eyebrow` = category, accent cycling yellow/pink/blue/green:
1. "Web App" — Ledger — expense tracking
2. "Branding" — Voltage Coffee
3. "Mobile" — Trailhead — hiking companion
4. "E-commerce" — Kiln Studio

## Testing

No test framework exists in this project (no test scripts in `package.json`,
no test files found). Verification is manual: run the dev server, visit
`/landing`, `/blog`, and `/portfolio`, and confirm:
- All 8 landing-page sections render with the content above
- The Hero's split layout and placeholder graphic look correct at mobile and
  desktop widths
- `Accordion`'s default (no-props) usage on `src/pages/index.astro` still
  renders its original 3 FAQs unchanged
- `Hero`'s default (no `layout` prop) usage on `src/pages/index.astro` still
  renders centered, unchanged
- Pricing/Testimonials/FAQ sections are keyboard-navigable and the Accordion
  items expand/collapse correctly
- No console errors, no broken internal links
