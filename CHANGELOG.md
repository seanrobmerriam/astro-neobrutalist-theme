# Changelog

All notable changes to this theme are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). As of 1.0.0 this
project follows [Semantic Versioning](https://semver.org/): breaking changes
to a component's props or a page's URL bump the major version, new
components/pages/props bump the minor version, and fixes bump the patch
version.

## [Unreleased]

## [1.0.0] - 2026-09-06

First versioned release. Everything below was built against
`docs/superpowers/plans/2026-09-04-rubric-remediation.md`, a 6-phase plan
written after scoring the theme against `RUBRIC.md` (a 100-point premium
Astro theme quality rubric) at 52.2/100, "not commercially ready." Full
phase-by-phase detail, including what was deliberately deferred and why,
lives in that plan document's revision log.

### Added

- `src/config/site.ts` — single source of truth for brand name, tagline,
  description, URL, social links, and the shared multi-page nav/footer data.
- `SEO.astro` — canonical URLs, Open Graph, Twitter card, and site-wide
  JSON-LD, centralized instead of hand-written per layout.
- XML sitemap via `@astrojs/sitemap`.
- Generated `robots.txt` (`src/pages/robots.txt.ts`), kept in sync with
  `site.url` automatically instead of a static file that can drift.
- Branded `404.astro`.
- `LICENSE.md` — commercial EULA with Personal/Pro/Team tiers.
- `Tabs.astro` now supports a `variant` prop (`underline` / `contained` /
  `pill` / `vertical`) with arrow-key/Home/End roving-tabindex navigation.
- `docs`, `authors`, and `blog` content collections, replacing hard-coded
  arrays — 7 blog posts, 2 authors, and real (generated) hero images.
  `src/lib/blog.ts` and `format-date.ts` for the shared reading logic.
- 11-page `/docs` reference (`DocsLayout.astro`, sidebar nav, mobile drawer).
- Dark mode: `<ThemeToggle>`, `data-theme` attribute cycling system → light →
  dark → system, persisted to `localStorage`, applied before first paint by
  a blocking inline script (no flash of the wrong theme).
- `<Container>` (`size: sm/md/lg`, polymorphic `as`) and `<Icon>` (a small
  `close`/`menu` registry) primitives, applied across every block.
- A fluid `clamp()` type scale (`--text-hero-split`, `--text-hero-centered`,
  `--text-section-lg`, `--text-section-sm`) replacing hard breakpoint jumps
  on every major heading.
- Six new pages: `/about`, `/team`, `/contact`, `/pricing`, `/privacy`,
  `/terms` — and `/search`, a full-text site search via Pagefind (indexed
  at build time via a `postbuild` script, no search service required).
- `pnpm audit:a11y`, `pnpm audit:lighthouse`, and `pnpm audit:links` —
  repeatable, CI-usable scripts for accessibility (axe-core + a keyboard
  walk + viewport-overflow check), Lighthouse, and internal-link checking.
- Playwright e2e suite (`tests/e2e/`) covering navigation, the mobile
  drawer, modal/drawer focus trapping, tabs, accordion, gallery, the
  contact form, theme toggling, and per-page-type axe assertions — runs
  against Chromium, Firefox, and WebKit.
- `.github/workflows/ci.yml`: install → type check → format check → build
  → link check → e2e tests → accessibility audit → Lighthouse audit.

### Changed

- Fonts (Clariza Sparks, Inter, Space Mono) now load through Astro's Fonts
  API (`astro.config.mjs` `fonts`) instead of a hand-written `@font-face`
  block plus a render-blocking Google Fonts `<link>`. Google-provided
  families are downloaded at build time and self-hosted; the local Clariza
  Sparks face is read from disk. No third-party font request at runtime.
- `Navbar.astro` and `Footer.astro` no longer default their `brand` prop to
  `"Neubrutal"` — brand name is required and flows from `site.name`, so a
  buyer replacing the brand can't miss a component that's silently still
  using the old default.
- `--color-ink` now inverts between light and dark mode; a new, fixed
  `--color-ink-on-accent` token covers text/borders sitting on a flat accent
  fill (which doesn't itself invert) — see `global.css`. Applied across
  Button, Card, Badge, Alert, Toast, Table, TestimonialCard, PricingCard,
  Avatar, List, SpeedDial, and every block's eyebrow-badge pattern.
- `Navbar.astro`'s full desktop nav now appears at the `lg` breakpoint
  instead of `md` — six shared nav links plus a CTA button genuinely didn't
  fit at 768px once `/about` and `/pricing` were added to `site.nav`.
- Pricing plan data extracted to `src/config/plans.ts`, shared by `/landing`
  and the new standalone `/pricing` page instead of being duplicated.

### Removed

- Three non-functional `Tabs` variants (`TabsPill`, `TabsContained`,
  `TabsVertical`) — decorative markup with no controller, merged into
  `Tabs.astro`'s `variant` prop instead.
- 58 of 59 bundled font files that had no license documentation and were
  unused (1.7 MB). The one retained, actively-used face is tracked in
  `src/assets/fonts/LICENSE-TODO.md` pending a license check.
- Dead files: `Welcome.astro`, `astro.svg`, `background.svg`, and an unused
  680 KB icon set.
- A broken `@glidejs/glide` stylesheet link that 404'd on every page.
- `@astrojs/markdown-satteri` and `@astrojs/mdx` — both accidental additions
  with no corresponding usage in the project.

### Fixed

- Landing page pricing tiers no longer advertise deliverables that don't
  exist (Figma source files, a private Discord channel, priority email
  support, lifetime updates, an "MIT license" bullet incompatible with the
  tiered commercial license). See `docs/superpowers/plans/
PRELAUNCH-CHECKLIST.md` for what has to exist before each goes back.
- A skip link rendering at ~36px instead of 1px; a single unbreakable word
  overflowing a 320px viewport on one page; a `focus:outline-none` /
  `focus-visible:outline-*` cascade-order hazard silently killing focus
  visibility on several components (recurred twice more later — see the
  plan doc's Phase 3 and Phase 5 notes for the two different root causes);
  a native `<dialog>` focus-trap gap landing on `<body>` for one Tab per
  cycle; heading-order skips on four pages.
- A UTC/local-timezone date bug (`2026-08-02` rendering as "Aug 1, 2026")
  and a `.prose` table overflowing 320px by 157px with no scroll container.
- `List.astro` hardcoded `text-ink` on its item labels instead of inheriting
  the ambient color, breaking when nested in `PricingCard`'s accent-filled
  `featured` variant.
- Four pages' hand-written eyebrow badges (`/blog`, `/blog/tags/*`,
  `/portfolio`, `/404`) were never migrated to the fixed dark-mode tokens.
- `scripts/audit-lighthouse.mjs`'s Chrome auto-detection threw before ever
  reaching its Playwright-cache fallback, requiring `CHROME_PATH` to be set
  by hand on any machine without a system Chrome install.
