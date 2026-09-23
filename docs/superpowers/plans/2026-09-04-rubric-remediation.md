# Rubric Remediation Plan

**Date:** 2026-09-04 (Phases 1–4 done as of 2026-09-05 — see revision log at the end)
**Scored against:** `RUBRIC.md` (Premium Astro Theme Quality Rubric)
**Original result:** **52.2 / 100** — "Not commercially ready" (below 60)
**Mandatory release gates (original):** 14 of 20 fail, 3 partial, 3 pass
**Mandatory release gates (current):** 2 of 20 fail, 4 partial, 14 pass

---

## 1. Scorecard

| # | Section | Weight | Avg /4 | Earned |
|---|---------|-------:|-------:|-------:|
| 1 | Visual Design and Art Direction | 12 | 2.67 | **8.http://localhost:4322/00** |
| 2 | Layout and Responsive Behavior | 8 | 2.50 | **5.00** |
| 3 | Information Architecture and Page Coverage | 7 | 1.30 | **2.28** |
| 4 | Components and Design System | 10 | 2.93 | **7.33** |
| 5 | Astro Architecture and Code Quality | 10 | 2.80 | **7.00** |
| 6 | Content Architecture and CMS Readiness | 7 | 0.92 | **1.60** |
| 7 | Accessibility | 10 | 2.00 | **5.00** |
| 8 | Performance and Asset Efficiency | 8 | 1.93 | **3.86** |
| 9 | SEO and Content Discovery | 7 | 0.93 | **1.63** |
| 10 | Customization and Buyer Experience | 8 | 2.00 | **4.00** |
| 11 | Documentation and Onboarding | 7 | 0.93 | **1.63** |
| 12 | Testing, Reliability, and Maintenance | 6 | 0.67 | **1.00** |
| 13 | Security, Privacy, and Production Safety | 4 | 1.60 | **1.60** |
| 14 | Deployment and Portability | 3 | 2.00 | **1.50** |
| 15 | Commercial Product Quality | 3 | 1.00 | **0.75** |
| | **Total** | **100** | | **52.18** |

### Reading the shape

The theme is strong exactly where a hand-built component library is strong — Astro
architecture, zero-JS output, typed component APIs, a real token system, a committed
visual concept. It is weak everywhere a *product* differs from a *demo*: content
modelling, SEO plumbing, buyer-facing configuration, documentation, testing, and
licensing. Sections 1–5 average 2.6/4. Sections 6, 9, 11, 12, 15 average 0.9/4.

Nothing in the low-scoring half is architecturally hard. It is almost entirely
missing scaffolding, not broken foundations.

---

## 2. Mandatory release gates

| Gate | Status |
|------|--------|
| Installs from a clean clone using documented commands | ✅ **2026-09-05**: README rewritten against the actual project (real tree, prerequisites, customization pointers) — no longer the stock Astro starter doc |
| Production build completes without theme errors/warnings | ✅ Verified — 16 pages (15 + `/404`), clean, re-verified after every phase |
| All advertised pages, components, and features included | ✅ **2026-09-05**: unbuilt-deliverable bullets (Figma, Discord, priority support, lifetime updates, "MIT license") removed from `landing.astro` rather than left as false claims — see `PRELAUNCH-CHECKLIST.md`. (The blog/portfolio content-depth gap is real but tracked separately under P1-3 / §3 Information Architecture, not this truth-in-advertising gate.) |
| ~~No broken internal links, missing assets, or dead nav items~~ | ✅ **2026-09-05**: the Glide 404 (Phase 1) and the dead `<a href="#">` blog cards (Phase 4 — every post now links to a real detail page) are both resolved |
| Primary journeys work without JS errors | ✅ Re-verified 2026-09-05 against the dev server after all Phase 1 changes |
| ~~Keyboard navigation works throughout~~ | ✅ **2026-09-05**: automated keyboard walk (Playwright) across all 7 pages — every focus stop has a visible indicator, no traps. This is also where the `focus:outline-none`/`focus-visible:outline` cascade hazard and the native-`<dialog>` focus-trap gap were found and fixed (see Phase 3 notes above) |
| ~~No serious automated a11y violations~~ | ✅ **2026-09-05**: axe-core (`@axe-core/playwright`, WCAG 2.0/2.1 A+AA) — 0 violations across all 7 pages. Repeatable via `bun run audit:a11y` |
| ~~WCAG AA contrast throughout~~ | ✅ **2026-09-05**: computed real contrast ratios (OKLCH→sRGB conversion + WCAG formula) for every token combination actually used in the codebase — all pass, minimum 4.90:1. The one real failure found was the Shiki code-comment color (4.36:1 against black), fixed to 6.16:1. **Re-verified 2026-09-05 (Phase 5)** after dark mode landed: Phase 3's audit predates dark mode and so couldn't have caught it, and Lighthouse (which runs with a dark `prefers-color-scheme` in this headless environment) found real new failures — an un-migrated `List.astro` item color ignoring its accent-fill container, and four page-level eyebrow badges (`/blog`, `/blog/tags/*`, `/portfolio`, `/404`) still on the old inverting `border-ink`/`text-ink` pair instead of the fixed `-on-accent` tokens. All fixed; axe + Lighthouse both clean across every audited route afterward |
| ~~No unintended mobile horizontal overflow~~ | ✅ **2026-09-05**: 0 overflow at 320/768/1280px across all 7 pages, verified programmatically and re-confirmed visually via screenshots at 375/768/1440px on 3 pages. This is what caught the skip-link sizing bug and the single-unbreakable-word heading overflow (see Phase 3 notes) |
| ~~Lighthouse Performance ≥ 90~~ | ✅ **2026-09-05**: 99 on all 4 representative pages, mobile throttled (4x CPU, 1.6 Mbps). Repeatable via `bun run audit:lighthouse` |
| ~~Lighthouse A11y / SEO / Best Practices ≥ 95~~ | ✅ **2026-09-05**: 100/100/100 on all 4 representative pages |
| ~~Responsive manually checked S/M/L~~ | ✅ **2026-09-05**: screenshots captured and visually reviewed at 375/768/1440px on `/`, `/landing`, `/docs` — clean reflow, no broken layouts, no clipping, no awkward stacking |
| Metadata, canonical, favicon, sitemap, robots, social previews valid | ⚠️ **Mostly resolved 2026-09-05**: canonical, OG, Twitter card, sitemap, and `robots.txt` all present and verified in build output. Still generic: favicon is the stock Astro icon (see `CLAUDE.md` known issues) and `site.ogImage` points at `/og-default.png`, which doesn't exist as a file yet |
| Sample secrets / debug code removed | ✅ No secrets committed |
| Every bundled asset has redistribution rights | ⚠️ **Mostly resolved 2026-09-05**: 58 of 59 unlicensed font files deleted (1.7 MB → 48 KB). The one remaining, actively-used face (`ClarizaSparks-Regular`) is a deliberate, tracked exception — see `src/assets/fonts/LICENSE-TODO.md` |
| License, support policy, compatibility, external requirements documented | ⚠️ **Mostly resolved 2026-09-05**: `LICENSE.md` added (Personal/Pro/Team commercial EULA, still has `[YOUR LEGAL NAME OR COMPANY]` / `[SUPPORT/CONTACT EMAIL]` placeholders) and Astro/Node compatibility is now stated in the README. Support policy is still genuinely undocumented — no support channel exists yet, tracked in `PRELAUNCH-CHECKLIST.md` |
| Docs followed successfully by someone other than the author | ❌ |
| Hosted demo represents the product | ❌ No hosted demo |
| Buyer can replace the sample brand without reconstructing the theme | ⚠️ **Mostly resolved 2026-09-05**: brand name, tagline, description, nav, and footer data are all centralized in `src/config/site.ts` and verified to propagate everywhere by temporarily renaming it and rebuilding. Still generic: the favicon and the (nonexistent) social-preview image — both called out in the README's "Known issues" |
| Documented Astro and Node compatibility range | ✅ **2026-09-05**: stated in the README ("Prerequisites" table — Node ≥ 22.12.0, Astro 7.x) |

**14 pass. 4 partial. 2 fail.** *(was 3 / 3 / 14 as of 2026-09-04 — see revision log at the end of this document)*

---

## 3. Findings by severity

### P0 — Blocks any release

| ID | Finding | Evidence |
|----|---------|----------|
| ~~P0-1~~ | ~~**Font licensing.** 59 font files, 58 unused, no licence documentation.~~ — **partially resolved 2026-09-05**: 58 unused/unlicensed files deleted (1.7 MB → 48 KB). The one remaining, actively-used face (`ClarizaSparks-Regular`) is a deliberate exception — the user chose to keep it and verify its license separately rather than delete it now; see `src/assets/fonts/LICENSE-TODO.md` | `src/assets/fonts/` |
| ~~P0-2~~ | ~~**No LICENSE file**~~ — **resolved 2026-09-05**: `LICENSE.md` added at repo root, a commercial EULA with Personal/Pro/Team tiers matching the pricing page. Contains `[YOUR LEGAL NAME OR COMPANY]` / `[SUPPORT/CONTACT EMAIL]` placeholders that still need real values before it's shown to a buyer | `LICENSE.md` |
| ~~P0-3~~ | ~~**Broken stylesheet on every page** — Glide CSS 404~~ — **resolved 2026-09-05**: dead `<link>` removed; verified gone from both `bun run build` output and the dev-server-served HTML | `src/layouts/Layout.astro` |
| ~~P0-4~~ | ~~**Marketing claims not backed by deliverables**~~ — **resolved 2026-09-05**: Figma source, priority email support, and private Discord bullets removed from the pricing tiers; "MIT license" bullet replaced with tier-matched license names. See `docs/superpowers/plans/PRELAUNCH-CHECKLIST.md` for what has to actually be built before each removed claim can go back on the page | `src/pages/landing.astro` |
| ~~P0-5~~ | ~~**Three Tabs variants are non-functional decorative markup**~~ — **resolved 2026-09-05**: `TabsPill.astro`, `TabsContained.astro`, `TabsVertical.astro` deleted; `Tabs.astro` extended with a `variant` prop (`underline` / `contained` / `pill` / `vertical`) on the existing working controller, plus arrow-key/Home/End roving-tabindex navigation that the original didn't have. Demoed in `src/pages/index.astro` | `src/components/Tab/Tabs.astro` |

### P1 — Required for "market-ready"

| ID | Finding | Evidence |
|----|---------|----------|
| ~~P1-1~~ | ~~**No site config.**~~ — **resolved 2026-09-05**: `src/config/site.ts` added; `landing.astro`, `blog.astro`, `portfolio.astro`, `index.astro` all consume it, and `Navbar`/`Footer`'s `brand` prop no longer defaults to `"Neubrutal"` | `src/config/site.ts` |
| ~~P1-2~~ | ~~**No SEO layer**~~ — **resolved 2026-09-05**: `SEO.astro` (canonical, OG, Twitter card, site-wide JSON-LD) wired into `Layout.astro`; `@astrojs/sitemap` installed; `site` set in `astro.config.mjs`. Per-collection JSON-LD deferred to Phase 4, once the blog is a real collection | `src/components/SEO/SEO.astro` |
| ~~P1-3~~ | ~~**Blog is fake**~~ — **resolved 2026-09-05**: real `blog` content collection (7 posts, one deliberately `draft: true`), real `authors` and `projects` collections, detail pages, tag archives, author profiles, pagination, and an RSS feed. See Phase 4 below | `src/content/blog/`, `src/pages/blog/` |
| ~~P1-4~~ | ~~**No 404 page**~~ — **resolved 2026-09-05**: `src/pages/404.astro`, confirmed to actually serve (not just exist) via a direct request to an unmatched route in dev | `src/pages/404.astro` |
| P1-5 | **No image pipeline** — zero `astro:assets` usage; raw `<img>` with no `width`/`height` in `Avatar` and `Gallery` → CLS | `Avatar.astro:66`, `Gallery.astro:32,43` |
| ~~P1-6~~ | ~~**Render-blocking Google Fonts**~~ — **resolved 2026-09-05**: migrated to Astro's Fonts API. Google-provided families (Inter, Space Mono) are now downloaded at build time and self-hosted — zero runtime request to Google, not just a faster one — and the local Clariza Sparks face is wired through the same system. Astro also generates metric-matched fallback fonts automatically, a CLS improvement the old setup lacked | `astro.config.mjs`, `src/layouts/Layout.astro` |
| ~~P1-7~~ | ~~**No `astro check`**~~ — **resolved 2026-09-05**: installed with `typescript`; `check` script added; passes clean (0 errors, 0 warnings, 5 pre-existing hints unrelated to this work) | `package.json` |
| ~~P1-8~~ | ~~**Phantom / unused dependencies** — `@astrojs/markdown-satteri` imported nowhere; `@astrojs/mdx` installed with zero `.mdx` files~~ — **resolved 2026-09-05**, both removed and the `mdx()` integration dropped from `astro.config.mjs`; clean rebuild verified | `package.json` |
| ~~P1-9~~ | ~~**README is the untouched Astro starter README**~~ — **resolved 2026-09-05**: rewritten against the actual project — real tree, prerequisites, customization pointers, deployment, license, known issues | `README.md` |
| P1-10 | **Components were propless, un-tokenized demo markup** using `border-black`, `bg-yellow-200`, `shadow-[4px_4px_0_0]` instead of theme tokens. *(Partially resolved 2026-09-05: the three Tabs offenders — `TabsContained`, `TabsPill`, `TabsVertical` — are gone, merged into `Tabs.astro`'s `variant` prop as part of P0-5. Six remain: `AccordionGroup`, `CheckboxDescription`, `Dropdown` — which still ships hard-coded guitarist names — `AccordionContained`, `TextAreaActions`, `TextAreaActionsOutside`.)* | `AccordionGroup`, `CheckboxDescription`, `Dropdown`, `TextAreaActions`, `TextAreaActionsOutside`, `AccordionContained` |
| P1-11 | **No skip link, no `prefers-reduced-motion`** — every button animates `translate` on hover with no reduced-motion escape | `src/` (no matches for either) |
| P1-12 | **No tests, no lint, no format, no CI.** *(Partially resolved 2026-09-05: Prettier + `prettier-plugin-astro` installed and configured, `format`/`format:check` scripts added — but run only against files touched this session, not the pre-existing codebase, which `format:check` now reports ~55 files against. No ESLint config, no tests, no CI yet.)* | repo root |
| ~~P1-13~~ | ~~**Dead files ship in the package**~~ — **resolved 2026-09-05**: `Welcome.astro`, `astro.svg`, `background.svg`, and the unused `src/assets/icons/` directory (680 KB) all deleted; confirmed unreferenced before removal | `src/components/`, `src/assets/` |

### P2 — Needed for "premium"

| ID | Finding |
|----|---------|
| P2-1 | Missing pages: About, Contact, Team, Pricing (standalone), Blog detail, Tag/category archives, Search, Privacy, Terms |
| P2-2 | No `.env.example`, no `CHANGELOG.md`, no deployment guide, no troubleshooting, no upgrade guide |
| P2-3 | Colour tokens are named by appearance (`--color-yellow`) not by role (`--color-accent-primary`) — Rubric §4 "Semantic naming" |
| P2-4 | No spacing, radius, z-index, or motion tokens — only colour, font, shadow |
| P2-5 | No icon system — one-off inline SVGs, while 680 KB of unused icon assets sit in `src/assets/icons/` |
| P2-6 | Form system has no error, required, validation-message, fieldset, or submission-state layer |
| P2-7 | No dark mode (a listed Premium Differentiator, and near-free given the token layer) |
| P2-8 | Container widths drift per page (`max-w-6xl` / `max-w-5xl` / `max-w-4xl`) with no shared container primitive |
| P2-9 | `package.json` `name` is `""`; version `0.0.1` with no versioning policy |
| P2-10 | `docs/superpowers/` planning artefacts would ship to buyers |

---

## 4. The plan

Six phases. Phases 1–3 clear every mandatory gate and should land ≈ 78–82.
Phases 4–6 take it to premium.

---

### Phase 1 — Legal and truth (P0) — ✅ largely done, 2026-09-05

*Nothing else matters until the package is legally shippable and the marketing is true.*

1. ~~**Audit `src/assets/fonts/`.**~~ **Done, with one deliberate exception.** 58 of 59
   files had no license documentation and were unused — deleted (1.7 MB → 48 KB).
   `ClarizaSparks-Regular` is still referenced by `global.css` and is the theme's
   signature display font; the user chose to keep it and clear its license separately
   rather than replace it now. Tracked in `src/assets/fonts/LICENSE-TODO.md`. If it
   turns out not to be redistributable, the fallback candidates below still apply:
   **Syne**, **Space Grotesk**, **Archivo Black** (all SIL-OFL).
   - `font.css` (referenced nonexistent `.eot`/`.ttf` files) was deleted along with
     the rest rather than kept — nothing pointed at it.
2. ~~**Add `LICENSE`.**~~ **Done.** `LICENSE.md` at repo root — a commercial EULA with
   Personal/Pro/Team tiers matching the pricing page, not MIT. Still has
   `[YOUR LEGAL NAME OR COMPANY]` / `[SUPPORT/CONTACT EMAIL]` placeholders and should
   get a legal review before it's shown to a real buyer.
3. ~~**Fix the Glide 404.**~~ **Done.** Dead `<link>` removed from `Layout.astro`.
4. ~~**Rewrite `landing.astro` pricing and FAQ to match reality.**~~ **Done, via
   removal rather than building the missing pieces.** Figma source, priority email
   support, and private Discord bullets are gone; "MIT license" replaced with the
   tier names from `LICENSE.md`. This leaves Pro/Team looking thin against Personal —
   expected, since Phase 1 is about truth, not sales copy. What has to exist before
   each bullet goes back on the page is tracked in
   `docs/superpowers/plans/PRELAUNCH-CHECKLIST.md`.
5. ~~**Fix or delete the three broken Tabs variants.**~~ **Done, as recommended.**
   `TabsPill`, `TabsContained`, `TabsVertical` deleted; `Tabs.astro` now takes a
   `variant="underline" | "pill" | "contained" | "vertical"` prop. Also picked up
   arrow-key / Home / End roving-tabindex navigation the original never had. Demoed
   in `src/pages/index.astro`.
6. ~~**Delete dead files.**~~ **Done.** `Welcome.astro`, `astro.svg`, `background.svg`
   deleted; `src/assets/icons/` (680 KB, confirmed unreferenced) deleted rather than
   wired up — nothing in the codebase called for icons beyond the inline SVGs already
   in use.
7. **Not done** — `docs/superpowers/` still isn't excluded from what ships. Low
   priority relative to the rest of Phase 1; rolled into Phase 6 packaging instead.

**Exit criteria status:** no unlicensed *unused* assets (one used asset still pending
license confirmation), no 404s, no false marketing claims, no non-functional
components. Substantially met — the one open item (#7) is cosmetic packaging, not a
legal or trust issue, so it's deferred to Phase 6 rather than blocking on it here.

---

### Phase 2 — Product scaffolding (P1) — ✅ done, 2026-09-05

*The files a buyer expects to find and cannot build themselves.*

1. ~~**`src/config/site.ts`**~~ **Done, as a plain typed object rather than
   Zod-validated.** The project has no runtime dependency on Zod (it only
   reaches Astro's re-export inside `content.config.ts`), so adding one
   solely to validate a handful of literal strings would itself have been an
   unjustified dependency — TypeScript's `satisfies`/`as const` gives the
   same compile-time guarantee without it. Exports `name`, `tagline`,
   `description`, `url`, `locale`, `ogImage`, `social.github`, the shared
   multi-page `nav`, and the shared `footerResources` group. `landing.astro`,
   `blog.astro`, `portfolio.astro`, and `index.astro` all read from it now;
   `Navbar.astro` and `Footer.astro`'s `brand` prop lost its `"Neubrutal"`
   default and is required, so a buyer replacing the brand can't miss a
   component silently still using the old one. Verified by temporarily
   renaming `site.name` and rebuilding — it propagated everywhere.

   One deliberate scope call: the anchor-based, single-page navs on `/` and
   `/landing` (`#features`, `#pricing`, etc.) were **not** centralized —
   they're genuinely specific to sections that exist only on those pages,
   not duplicated data. Only what was byte-identical across multiple pages
   (the multi-page nav, the "Resources" footer group) moved into config.
2. ~~**`src/components/SEO/SEO.astro`**~~ **Done**, consumed by `Layout.astro`:
   canonical (absolute, via `Astro.site`), `og:*`, `twitter:*`, and a
   site-wide `WebSite` JSON-LD block (with `<` escaped so config values can
   never break out of the script tag). Per-collection JSON-LD (`BlogPosting`,
   `BreadcrumbList`) is deferred to Phase 4 — writing it against the current
   hard-coded blog array would mean rewriting it again once the blog is a
   real content collection.
3. ~~**`astro.config.mjs`**~~ **Done**: `site: site.url` added,
   `@astrojs/sitemap` installed and wired in. The `fontProviders` import
   is no longer unused — see #6.
4. ~~**`public/robots.txt`**~~ **Done, but as a generated route
   (`src/pages/robots.txt.ts`) instead of a static file** — a static file's
   sitemap URL would be one more place to forget to update alongside
   `site.url`; the generated version reads `Astro.site` directly and can't
   drift.
5. ~~**`src/pages/404.astro`**~~ **Done** — branded, built from
   `LandingLayout` + `Button`, confirmed to actually serve on unmatched
   routes in dev (verified via a direct request to a nonexistent path,
   not just checking the file exists).
6. ~~**Fonts**~~ **Done**, via Astro's (now-stable, since v6.0.0 — no
   `experimental` flag needed) Fonts API. All three families — the local
   Clariza Sparks face and the two Google-provided families (Inter, Space
   Mono) — are now self-hosted: Google fonts are downloaded at build time
   and served from the site's own origin, so there's no runtime request to
   `fonts.googleapis.com`/`fonts.gstatic.com` at all, not just a faster one.
   Astro also auto-generated metric-matched fallback fonts (e.g. "Inter
   fallback: Arial"), which is a real CLS improvement the old setup didn't
   have. Verified in build output: `@font-face` rules present, `--font-*`
   CSS variables resolve to the generated font-family names, preload links
   present for Clariza Sparks and Inter (not Space Mono — a decorative
   accent face, not preload-worthy).
7. ~~**`.env.example`, `CHANGELOG.md`, `CONTRIBUTING.md`**~~ **Done.**
   `.env.example` is intentionally near-empty — the theme has zero external
   services or secrets today — with a comment explaining why, rather than
   fabricating placeholder keys that don't correspond to anything.
8. ~~**Tooling**~~ **Mostly done.** Installed `@astrojs/check`,
   `prettier`, `prettier-plugin-astro`; added `check`, `format`, and
   `format:check` scripts; set `package.json`'s `name`. `astro check` now
   passes clean (0 errors, 0 warnings, 5 pre-existing hints about a
   deprecated `z` re-export in `content.config.ts`, unrelated to this
   phase). **Not done: a `lint` script** — there's no ESLint config in the
   repo, and standing one up (flat config, Astro-aware plugin choice) is a
   separate decision from wiring up a formatter, so it's left for later
   rather than rushed. Prettier was run only against files touched this
   session, not the whole pre-existing codebase — `bun run format:check`
   currently reports ~55 files that predate the formatter and don't match
   its style; a repo-wide reformat is a large, purely-stylistic diff that
   deserves to be its own commit, not folded into this one.
9. ~~**Rewrite `README.md`**~~ **Done** — real project tree, prerequisites,
   quick start, customization pointers (brand config, tokens, fonts, nav),
   deployment (static, no adapter needed), license, and a "known issues"
   section pointing at the font-license TODO and the `example.com`
   placeholders that still need real values.

**Exit criteria status:** met, with two intentional placeholders that only
the buyer/owner can fill in — `site.url` (`https://example.com`) and
`site.ogImage` (`/og-default.png`, which doesn't exist as a file yet). Both
are called out in `site.ts`'s own comments and in the README, not silently
left wrong.

---

### Phase 3 — Accessibility and performance (P1) — ✅ done, 2026-09-05

1. ~~**Skip link**~~ **Done**, with a real bug of its own: the first version applied
   `border-2`/`bg-yellow`/`px-4 py-2` unconditionally instead of scoped to `:focus`,
   so the "invisible" `sr-only` link was actually rendering at ~36px wide (border-box
   sizing can't go below its own border+padding) — caught by the 320px overflow check
   in step 8, not by reading the markup. Fixed and re-verified.
2. ~~**`prefers-reduced-motion`**~~ **Done** — a global block in `global.css` collapses
   `transition`/`animation` duration to near-instant, so the hover/active state still
   shows, just without the animated glide.
3. ~~**Contrast pass**~~ **Done, computationally, not by eyeballing.** Converted every
   OKLCH token to sRGB and computed real WCAG contrast ratios (script + math in the
   audit report). Result: every text-opacity/accent combination *actually used* in the
   codebase already passed AA — `ink/60` on paper is 5.72:1, not "borderline" as
   originally guessed. The one real fix that came out of this pass was unrelated to
   the opacity tokens: the custom Shiki theme's code-comment color measured 4.36:1
   against the black editor background (caught by axe, not by the manual math) —
   raised from 0.45 to 0.55 alpha, now 6.16:1.
4. ~~**Colour independence**~~ **Re-scoped after investigation.** `BadgeStatus` and
   `Table`'s toned cells were re-checked against how they're *actually* used in the
   codebase (not just the component API) — every real usage already pairs the color
   with an explicit text label (`"Active"`, `"Suspended"`, `"Operational"`), so color
   was never the sole signal. The real gap was `Alert.astro`: all four variants
   (info/success/warning/error) rendered the *same* generic icon regardless of
   variant — a colorblind sighted user had no non-color way to distinguish them.
   Fixed with four distinct icons (info circle, check-circle, warning triangle,
   x-circle).
5. ~~**Forms**~~ **Done** for the three primary controls (`InputForm`, `TextArea`,
   `Select`): `error` prop wires `aria-invalid` + `aria-describedby` (combining with
   `helpText`'s own id) and renders an announced (`role="alert"`) error message using
   the same bordered-fill visual pattern as `Alert`/`Badge` — not raw `text-pink`/
   `border-pink` on paper, which would itself have failed contrast (2.72:1). A visual
   required-asterisk was added too. **Not done**: `RadioGroup`/`CheckboxGroup` don't
   yet have group-level error support, and `InputFormIcon`/`InputFormSearch` don't
   have `error`/`helpText` at all — disclosed scope trim, not an oversight.
6. ~~**Images**~~ **Re-scoped after investigation.** `astro:assets`'s `<Image>` doesn't
   cleanly fit `Avatar`/`Gallery`: both intentionally accept an arbitrary `src: string`
   (a public path or remote URL, per the docs example `<Avatar src="/team/marcus.jpg">`),
   not a build-time-imported `ImageMetadata` — forcing the `<Image>` component would
   mean a breaking API change for what is fundamentally dynamic content. Investigation
   also found the original CLS claim overstated: `Avatar`'s wrapper already has a fixed
   `size-*` class and `Gallery`'s thumbnail already uses `aspect-square`, both of which
   reserve layout space independent of whether the image has loaded. Added `width`/
   `height` anyway (correct `<img>` hygiene, not a CLS fix). The one real gap — the
   Gallery lightbox's preview `<img>` had no reserved space before a swapped-in image
   loads — got an `aspect-[4/3]` + background fill.
7. ~~**Run and record**~~ **Done, plus more than asked.** No system Chrome existed in
   this environment; installed Playwright's Chromium (`--with-deps` failed on
   passwordless sudo, but the plain browser download works headless without OS
   packages). Ran axe-core (`@axe-core/playwright`) and Lighthouse (mobile throttling)
   against all seven pages / four representative pages respectively. Rather than a
   one-off CLI invocation, formalized both as `scripts/audit-a11y.mjs` and
   `scripts/audit-lighthouse.mjs` (`bun run audit:a11y` / `bun run audit:lighthouse`) —
   repeatable, not just a number captured once. Results in `docs/audits/`.
8. ~~**Manual pass**~~ **Done, automated rather than eyeballed** — a keyboard-only
   walk, a 320px overflow check, and a Modal/Drawer focus-trap test were all driven
   through Playwright instead of manual inspection, which is precisely what surfaced
   the skip-link bug (step 1), a native-`<dialog>` focus-trap gap (see below), and a
   heading-order regression (see below) that reading the code would not have caught.
   200% zoom was not run as a literal browser-zoom test; 320px is a strictly more
   constrained case than 200% zoom on a common 1280px desktop, so a pass at 320px
   implies a pass there for the same content.

**Additional findings, not in the original plan, caught only by actually testing:**

- **Carousel had no keyboard access** (`scrollable-region-focusable`) — the scrollable
  track had no `tabindex`. Fixed, plus a follow-on `aria-prohibited-attr` violation
  from the first attempted fix (`aria-label` on a roleless `div`).
- **`focus:outline-none` + `focus-visible:outline-*` on the same element is a real
  hazard, not a style nit.** Both pseudo-classes match simultaneously for a
  keyboard-focused element, and Tailwind's *generated CSS order* — not the class
  attribute's order — decides which wins. This silently broke focus visibility on
  `Accordion`'s `<summary>`, `InputFormSearch`'s submit button, and (pre-existing,
  not introduced this session) all three `<summary>` elements in the legacy
  `AccordionContained` — fixed as a live, in-scope a11y defect even though that
  component's broader token rewrite is still deferred to Phase 5.
- **Native `<dialog>` focus-trapping has a one-tab gap.** Tabbing past the last
  focusable element inside an open `showModal()` dialog moved focus to
  `document.body` for one step before the next Tab correctly wrapped back —
  reproduced identically forward, backward, and with an added settle delay, so it's
  real behavior, not a test-timing artifact. This directly contradicts the Modal
  component's own demo copy ("traps focus... needs zero JS to wire up"). Fixed with
  an 8-line addition to the shared `dialog.ts` script, benefiting Modal and Drawer
  both since both run through it.
- **Heading order skipped a level on four pages.** `/blog`, `/portfolio`, and `/docs`
  all jumped `<h1>` → component-internal `<h3>` with no `<h2>` between (caught by
  Lighthouse's `heading-order` audit, which axe's WCAG-tagged ruleset doesn't
  include — it dinged `/blog` to 98). Separately, the homepage's `ShowcaseSection`
  renders an `<h2>` per section, but all 16 subsection labels inside used `<h4>`
  directly, skipping `<h3>` — systemic, not a one-off. Fixed both; the bulk find-
  replace for the 16 `<h4>`s also surfaced a pre-existing stray `bg-` class typo and
  a mismatched `<h4>…</h3>` tag pair from a subsection whose class attribute didn't
  match the sed pattern exactly.

**Exit criteria status:** met, with recorded evidence. `bun run audit:a11y`: 0 axe
violations, 0 heading-order skips, 0 horizontal overflow, 0 missing focus indicators
across all 7 pages. `bun run audit:lighthouse` (mobile throttling): Performance 99,
Accessibility 100, Best Practices 100, SEO 100 on all 4 representative pages — every
mandatory Lighthouse gate clears its target with margin. Full detail:
`docs/audits/2026-09-05-phase3-results.md`.

---

### Phase 4 — Content architecture — ✅ done, 2026-09-05

1. ~~**`blog` collection**~~ **Done**, schema exactly as planned, plus discovering the
   modern import path along the way: `z` and `image()` now come from `astro/zod`
   inside a `({ image }) =>` schema function — `z` from `astro:content` is deprecated
   in Astro 6+ and was producing the 5 pre-existing hints `astro check` had been
   reporting since before this session; switching resolved them as a side effect.
   7 posts written (not 6–8 exactly — 6 published + 1 `draft: true`, to prove
   filtering actually works rather than just asserting it does), each with its own
   generated SVG hero image in the theme's own palette (no stock photos, no lorem
   ipsum).
2. ~~**`authors`** and **`projects`** collections~~ **Done** — `src/data/authors/*.json`,
   `src/data/projects/*.json`. `portfolio.astro` now reads `projects` instead of a
   hard-coded array; the 4 existing hard-coded projects were migrated in, not
   replaced with new ones.
3. ~~**Routes**~~ **Done**: `/blog/[...slug]`, `/blog/[...page]` (6 posts/page),
   `/blog/tags/[tag]`, `/authors/[slug]`. Extracted the docs pages' scoped
   `.docs-prose` styles into a shared global `.prose` class (`global.css`) along the
   way, rather than duplicating ~80 lines of prose CSS for blog post bodies — two
   real consumers now exist, which is what justified the extraction.
4. ~~**`/rss.xml`**~~ **Done** via `@astrojs/rss`, sourced from the same
   `getPublishedPosts()` helper as every other blog route (see #5).
5. ~~**Draft filtering**~~ **Done**, centralized in `src/lib/blog.ts`'s
   `getPublishedPosts()` — every consumer (listing, tags, authors, RSS) calls this
   instead of `getCollection("blog")` directly, so there's exactly one place that
   can get the filter wrong instead of five. Verified in a production build that the
   draft post is absent from the listing, its own detail page, every tag page, its
   author's page, the RSS feed, and the sitemap — and confirmed it's *not* excluded
   from a dev build (`import.meta.env.PROD` gate), so it stays previewable while
   being written.
6. ~~**`formatDate` util**~~ **Done, and it caught a real bug immediately**: the
   first version rendered `2026-08-02` as "Aug 1, 2026" — `z.coerce.date()` parses a
   bare date as UTC midnight, and `toLocaleDateString` without `timeZone: "UTC"`
   renders it in the build machine's local timezone, silently shifting the date
   back a day. Caught by actually reading a screenshot of the rendered blog listing
   next to the source frontmatter, not by reasoning about the code. Fixed by forcing
   `timeZone: "UTC"`.
7. ~~**Empty-collection resilience**~~ **Done, tested three ways, one of which found
   a second real bug.** (a) Emptied `projects` only — built fine, but rendered a
   bare empty grid with no message, so `portfolio.astro` got a "no projects yet"
   empty state (`/blog`'s listing got the same treatment for consistency, since it
   had the identical gap). (b) Emptied `blog`+`authors`+`projects` together in the
   *working directory with a warm cache* — the build **failed** with
   `ImageNotFound: Could not find requested image './hero.svg'`, traced to a stale
   `node_modules/.astro/data-store.json` (Astro's persistent content-layer cache,
   separate from the project-root `.astro/` folder) still holding image references
   from before the files were deleted. (c) Cleared that cache too and rebuilt from
   a genuinely clean state — succeeded, with Astro's own (non-fatal) console warning
   that a referenced collection is empty, `/blog` and `/portfolio` rendering their
   new empty states, and `/rss.xml` producing a valid empty `<channel>`. (a) and (c)
   are what a real buyer would hit; (b) is a local-cache footgun worth knowing about
   but not a defect in the shipped theme.
8. ~~**Document the content layer**~~ **Done** — `src/docs/content.md` (order 11),
   covering all four collections' schemas, the draft workflow, empty-collection
   behavior, the date-formatting gotcha from #6, and a CMS-migration note explaining
   that swapping `blog`'s `loader` for a remote one requires no changes to any page
   that queries it through `getCollection()`/`getEntry()`.

**Additional finding, caught only by actually testing the new pages, not writing
them:** the shared `.prose` table styling (used by both docs and the new content
doc) had no horizontal-overflow handling — `content.md`'s own 5-column schema table
overflowed a 320px viewport by 157px. No existing docs page had a wide enough table
to trigger this before. Fixed by setting `.prose table` to `display: block;
overflow-x: auto` so a wide table scrolls on its own instead of forcing the page to.

**Exit criteria status:** met. `bun run audit:a11y` and `bun run audit:lighthouse` both
re-run against the new routes (`/blog`, a post detail page, a tag page, an author
page, `/portfolio`, `/docs/content`) — 0 violations, 0 overflow, 0 missing focus
indicators, and Lighthouse 99/100/100/100 held with real images now in play.

---

### Phase 5 — Design system depth — ⚠️ partially done, 2026-09-05 (items 4–7; see revision log)

1. ~~**Semantic token aliases**~~ — **not done.** `--color-accent`, `--color-surface`,
   `--color-border`, `--color-muted`, etc. were not added. Deferred, not forgotten.
2. ~~**Spacing, radius, z-index, and motion tokens**~~ — **not done**, same reason.
3. ~~**Rewrite the 9 legacy components**~~ (P1-10) — **not done this phase.** The three
   Tabs offenders were already resolved in Phase 3; `AccordionGroup`,
   `CheckboxDescription`, `Dropdown`, `TextAreaActions`, `TextAreaActionsOutside`,
   `AccordionContained` still ship hard-coded, un-tokenized demo markup.
4. ~~**Icon system**~~ — ✅ done: `<Icon name="…" />` (`src/components/Icon/Icon.astro`),
   a small `Record<IconName, IconDef>` registry, currently `"close" | "menu"`. Replaces
   every inline close/menu SVG in Modal, Drawer, Gallery, Toast, Navbar, DocsLayout.
   Deliberately not a full sprite system or `astro-icon` dependency — two icon shapes
   didn't justify either.
5. ~~**`<Container>` primitive**~~ — ✅ done: `src/components/Container/Container.astro`
   (`size: "sm" | "md" | "lg"` → `max-w-3xl/4xl/6xl`, polymorphic `as`). Applied to every
   block (Navbar, Hero, FeatureGrid, Pricing, Testimonials, FAQ, CTA). **Not** applied to
   `src/pages/index.astro`'s own kitchen-sink showcase markup — that page is the living
   component reference per `CLAUDE.md`, not a block consumer, and retrofitting its ad-hoc
   layout wasn't part of ending the *block* library's `max-w-*` drift.
6. ~~**Dark mode**~~ — ✅ done: `:root[data-theme="dark"]` + `prefers-color-scheme`
   (3-state pattern: bare `:root` light default → media-query dark → explicit
   `[data-theme]` override, all FOUC-guarded by a blocking inline script), `ThemeToggle`
   component + `theme-toggle.ts`. Required a two-token split
   (`--color-ink` inverts, `--color-ink-on-accent` fixed) after computing real contrast
   ratios showed a single inverting ink color goes to 1.37–2.64:1 against accent fills —
   applied across Button, Card, Badge, Alert, Toast, Table, TestimonialCard, PricingCard,
   Avatar, List, SpeedDial, and every block's eyebrow-badge pattern. Scoped to the
   reusable component/block library plus the site's real production pages (`/blog`,
   `/blog/tags/*`, `/portfolio`, `/404`) — **not** `index.astro`'s showcase content, same
   reasoning as Container.
7. ~~**Fluid type scale**~~ — ✅ done: 4 `clamp()`-based tokens in `@theme`
   (`--text-hero-split`, `--text-hero-centered`, `--text-section-lg`, `--text-section-sm`),
   min/max-matched to the exact `text-Nxl sm:text-Mxl` pairs they replace so no visual
   jump moved, just smoothed. Applied to Hero's two `<h1>` variants and every shared
   section-title `<h2>`/page `<h1>` using that pattern, including the three production
   pages above.

---

### Phase 6 — Testing, pages, and packaging — ⚠️ done except deploy, 2026-09-06

1. ~~**Playwright** e2e~~ — ✅ done: `tests/e2e/` covers nav (desktop + mobile
   drawer), modal/drawer focus trap (including a regression test for the exact
   Phase 3 Tab-boundary gap), tabs (click + arrow-key), accordion, gallery,
   contact-form submit, and theme toggle. Runs against Chromium, Firefox, and
   WebKit per `playwright.config.ts`. 56/56 pass on Chromium + Firefox in this
   sandbox; WebKit could not be exercised here (missing native libraries,
   `playwright install-deps` needs root this sandbox doesn't have — the exact
   constraint Phase 3 already hit) but is configured and will run in CI, which
   has root.
2. ~~**`@axe-core/playwright`** assertion per page type~~ — ✅ done:
   `tests/e2e/a11y.spec.ts`, one representative page per distinct template (15
   page types), asserting zero serious/critical violations. Deliberately not a
   re-run of every route — `bun run audit:a11y` already covers every actual route
   plus overflow and keyboard checks this suite doesn't duplicate.
3. ~~**Link checker**~~ — ✅ done: `scripts/audit-links.mjs`, a static crawler
   over the built `dist/` (no server needed). Internal links fail the check;
   external links are checked but only warn, so a flaky third party can't fail
   CI. 0 broken internal links found across all 38 built pages.
4. ~~**GitHub Actions**~~ — ✅ done: `.github/workflows/ci.yml` — install → type
   check → format check → build → link check → Playwright (3 browsers) → axe →
   Lighthouse. "Lint" is the Prettier format check, not ESLint — disclosed in
   the workflow comment, since no ESLint is configured (a Phase 2 gap, not new).
5. ~~**Remaining pages**~~ — ✅ done: `/about`, `/team` (driven by the real
   `authors` collection), `/contact` (a real form — InputForm/TextArea/Button —
   with a disclosed demo-only client-side submit handler, no backend), `/pricing`
   (plan data extracted to `src/config/plans.ts`, shared with `/landing` instead
   of duplicated), `/privacy`, `/terms`, and `/search` (Pagefind, indexed via a
   `postbuild` script — static, no service, verified with a real query returning
   real results). `site.nav` grew to 6 items, which pushed the Navbar's desktop
   breakpoint past 768px — found by re-running `audit:a11y`, fixed by moving the
   breakpoint from `md` to `lg` rather than cutting nav items.
6. **Deploy the demo** — **not done.** This is a live, externally-visible action
   (a new hosted deployment, possibly a real domain) that the user should
   explicitly approve and choose a host for, rather than something to do
   autonomously mid-phase. Flagged to the user; `site.url` in `src/config/site.ts`
   is still the `https://example.com` placeholder pending that decision.
7. ~~**Packaging**~~ — ✅ done, as a build script rather than a `files`
   allowlist (this isn't published to npm — it's a buyer-facing zip):
   `scripts/package-release.mjs` / `bun run package:release`, excluding
   `docs/superpowers/`, `docs/audits/`, `RUBRIC.md`, `.claude/`, `.agents/`,
   `.git/`, `node_modules/`, `dist/`, and `.github/` (a CI workflow describing
   *this* theme's own audit pipeline isn't buyer-facing either). Verified: 217
   files, 0.25 MB zipped, spot-checked for both leaked internal files (none)
   and real content (present).
8. ~~**Versioning + support policy**~~ — ✅ done: `package.json` bumped
   0.0.1 → 1.0.0, `CHANGELOG.md` rolled the `[Unreleased]` section (which had
   silently accumulated Phase 1–2 content but nothing from Phase 3 onward) into
   a real `[1.0.0]` release plus new entries for everything through Phase 6, and
   both files now state the SemVer policy that was referenced-but-never-written
   since Phase 1. README gained a Testing/CI section and a Support and
   Versioning section.

Two things found only by actually running the new CI gates against the real
repo, not by writing them:
- `bun run format:check` — newly wired into CI — failed on 46 files, mostly
  pre-existing content Phase 2 had explicitly deferred ("no repo-wide reformat
  ... left for a dedicated formatting commit"). Making format-check a real CI
  gate without doing that reformat would mean shipping a broken CI pipeline on
  day one, so this was the dedicated formatting commit Phase 2 deferred,
  finally done here (`bun run format`, then `.gitignore`/`.prettierignore` gained
  entries for `test-results/`, `playwright-report/`, and `release/`, which
  Prettier had also been trying and failing to parse).
- `scripts/audit-lighthouse.mjs`'s Chrome auto-detection had an unguarded
  `chromeLauncher.Launcher.getInstallations()` call that throws (not returns
  `[]`) when no system Chrome exists, which skipped the Playwright-cache
  fallback entirely below it — the real reason `CHROME_PATH` had to be set by
  hand every single time earlier in this session. Fixed by wrapping that call
  in its own try/catch; verified by unsetting `CHROME_PATH` and re-running.

---

## 5. Projected scores

| After | Total | Classification |
|-------|------:|----------------|
| Today | 52 | Not commercially ready |
| Phase 1–2 | ~68 | Significant refinement required — but legally shippable |
| Phase 3 | ~78 | Good foundation |
| Phase 4 | ~85 | Market-ready with minor improvements |
| Phase 5 (partial — items 4–7 only) | ~87 | Market-ready, approaching premium |
| Phase 6 (testing/pages/packaging done; no live demo) | ~92 | Strong premium theme |

## 6. Sequencing note

Phases 1 and 2 are independent of each other and of Phase 3, so they can run in
parallel. Phase 4 depends on Phase 2 (the SEO component and site config feed the
blog routes). Phase 5's token rework should land before Phase 6's visual regression
tests, or the snapshots get thrown away.

The single highest-leverage item is **Phase 2 step 1** — `src/config/site.ts`.
It alone moves Rubric §10 "Configuration entry point" and "Brand replacement" from
0 and 1 to 3 and 3, fixes §5 "Data separation" and "Duplication", and answers
Final Reviewer Question 4 ("Can branding and content be replaced without editing
dozens of files?"), which is currently a clear no.

---

## Revision log

**2026-09-05** — Phase 1 substantially completed:

- P0-1 through P0-5 resolved or deliberately scoped (see the strikethroughs in
  §3 and Phase 1 above). Mandatory gates moved from 3 pass / 3 partial / 14 fail
  to 4 pass / 7 partial / 9 fail.
- Two decisions were the user's to make, not mine, and both are now settled:
  the `ClarizaSparks-Regular` font is kept pending separate license verification
  (not replaced), and the theme is being built for commercial sale (not MIT/OSS),
  which shaped both `LICENSE.md` and the pricing-copy rewrite.
- P1-8 (phantom `@astrojs/markdown-satteri` / `@astrojs/mdx` dependencies) was
  also resolved separately, ahead of the rest of Phase 1 — both were confirmed
  accidental and removed.
- New file: `docs/superpowers/plans/PRELAUNCH-CHECKLIST.md` — tracks what still
  has to be built before the pricing-page claims stripped out in P0-4 can go back
  in (Figma file, support channel, update-delivery mechanism, Discord).
- No numerical rescore was run against the full rubric; the mandatory-gates count
  above is the reliable signal for now. A full rescore makes more sense once
  Phase 2 (site config + SEO layer) lands, since several §3/§9/§10 criteria are
  still gated on that work regardless of what Phase 1 fixed.

**2026-09-05 (later same day)** — Phase 2 substantially completed:

- `src/config/site.ts` added as a plain typed object, not Zod-validated (see
  Phase 2 step 1 above for why) — the highest-leverage single item identified
  in this plan's sequencing note. Verified to actually propagate by
  temporarily renaming `site.name` and rebuilding, not just by reading the
  code.
- `SEO.astro`, sitemap, generated `robots.txt`, branded `404.astro` all added
  and verified against both `bun run build` output and a running dev server
  (including a direct request to a nonexistent path, to confirm 404.astro
  actually serves rather than just existing as a file).
- Fonts fully migrated to Astro's Fonts API — this turned out to fully
  resolve P1-6, not just partially: Google-provided families are now
  self-hosted (downloaded at build time), not merely preloaded faster, and
  Astro's automatic metric-matched fallback fonts are a CLS improvement the
  original setup didn't have. Verified by inspecting the actual generated
  `@font-face` rules and resolved CSS variable values in build output, not
  just by reading the config.
- `astro check` installed and run for the first time: 0 errors, 0 warnings,
  5 pre-existing hints (a deprecated `z` re-export in `content.config.ts`,
  unrelated to this work).
- Mandatory gates moved from 4 pass / 7 partial / 9 fail to
  6 pass / 9 partial / 5 fail.
- Two items explicitly **not** done, disclosed rather than silently skipped:
  no ESLint/lint script (a separate setup decision from wiring up Prettier),
  and no repo-wide reformat (Prettier was run only against files touched
  this session — the pre-existing ~55 files that don't match its style are
  left for a dedicated formatting commit rather than folded into this diff).
- `site.url` (`https://example.com`) and `site.ogImage`
  (`/og-default.png`, not yet a real file) remain placeholders — flagged in
  both the config file's own comments and the README, for the buyer to set.

**2026-09-05 (later same day)** — Phase 3 completed:

- No system Chrome existed in this environment; installed Playwright's
  Chromium (`bun x playwright install chromium` — `--with-deps` failed
  on passwordless sudo, but the plain browser download runs headless fine
  without the OS packages). This is what made every finding below possible
  — none of it would have surfaced from reading the code.
- Real, reproducible bugs found and fixed that a code read would have
  missed: a skip link rendering at ~36px instead of 1px (border-box sizing
  with unconditional padding/border classes), a single-unbreakable-word
  heading overflowing a 320px viewport on one page but not a near-identical
  one, a `focus:outline-none`/`focus-visible:outline-*` cascade-order
  hazard silently killing focus visibility on three components (one
  pre-existing, two introduced earlier this same phase), a native
  `<dialog>` focus-trap gap landing on `document.body` for one Tab per
  cycle, and heading-order skips on four pages (three simple, one systemic
  — 16 subsection labels on the showcase page all one level too deep).
- Two items from the original plan were **re-scoped after investigation**
  rather than done as originally written: the "contrast pass" (step 3)
  found every actually-used token combination already passed AA — the
  original "text-ink/60 is borderline" guess in the initial audit was
  wrong, confirmed by computing real WCAG ratios rather than eyeballing —
  and the "migrate to `astro:assets` Image" plan for Avatar/Gallery (step
  6) didn't fit, since both intentionally accept a `src: string` (a public
  path or remote URL) rather than a build-time-imported image, which is a
  reasonable, disclosed design decision, not an oversight to route around.
- Formalized reusable tooling instead of leaving one-off scratch scripts:
  `scripts/audit-a11y.mjs` and `scripts/audit-lighthouse.mjs`, wired to
  `bun run audit:a11y` / `bun run audit:lighthouse`. Both exit non-zero on
  failure, so they're usable as a CI gate later (Phase 6) without rewriting
  them. `scripts/audit-screenshots.mjs` is a lighter one-off helper for
  manual visual review, not part of the repeatable suite.
- Mandatory gates moved from 6 pass / 9 partial / 5 fail to
  13 pass / 5 partial / 2 fail — the single largest jump of any phase so
  far, because Phase 3's gates (keyboard nav, a11y violations, contrast,
  overflow, both Lighthouse checks, responsive S/M/L) were previously all
  either unverified or blocked on Phase 2's SEO work, and closing all of
  them at once was the actual content of this phase.
- Full findings and methodology: `docs/audits/2026-09-05-phase3-results.md`.

**2026-09-05 (later same day)** — Phase 4 completed:

- Real `blog`, `authors`, and `projects` content collections replace the
  hard-coded arrays in the old `blog.astro` and `portfolio.astro`. 7 posts
  (6 published, 1 `draft: true`), 2 authors, 4 projects (migrated from the
  existing hard-coded ones, not invented fresh) — plus generated SVG hero
  images in the theme's own palette rather than stock photos or lorem ipsum.
- Along the way, switched `z`/`image()` imports from the deprecated
  `astro:content` re-export to `astro/zod`, which as a side effect resolved
  the 5 pre-existing `astro check` hints that had been present since before
  this remediation started.
- Two real bugs found by actually building and reading the output, not by
  reasoning about the code: a UTC/local-timezone date-display bug (frontmatter
  `2026-08-02` was rendering as "Aug 1, 2026"), and a `.prose` table with no
  overflow handling that overflowed a 320px viewport by 157px on the one new
  docs page wide enough to trigger it — an existing gap in Phase 2/3's own
  `.prose` extraction that nothing had exercised until now.
- Empty-collection resilience was tested three ways, not asserted: emptying
  one collection (fine, but needed an empty-state message added), emptying
  all three with a warm local cache (this genuinely **failed the build** —
  traced to a stale `node_modules/.astro/data-store.json`, a second,
  separate cache from the project-root `.astro/` folder that isn't cleared
  by the usual `rm -rf dist .astro`), and emptying all three from a fully
  clean cache (succeeded, as a real buyer's clean clone would).
- Mandatory gates moved from 13 pass / 5 partial / 2 fail to
  14 pass / 4 partial / 2 fail — smaller than Phase 3's jump, because only
  one gate ("no broken links") was directly gated on content architecture;
  most of Phase 4's value is in §3 (Information Architecture) and §6
  (Content Architecture) rubric sections, not the mandatory gates list.
- `bun run audit:a11y` and `bun run audit:lighthouse` re-run against every new
  route type (listing, detail, tag archive, author profile) — 0 violations,
  0 overflow (after the table fix), Lighthouse 99/100/100/100 held with
  real images now rendering, not placeholders.

**2026-09-05 (later same day)** — Phase 5 partially completed (items 4–7 of 7):

- Items 1–3 (semantic token aliases, spacing/radius/z-index/motion tokens,
  and rewriting the 6 remaining un-tokenized legacy demo components) were
  **not started** this phase — disclosed here rather than folded into a
  blanket "Phase 5 done." The scope that was completed (dark mode, in
  particular) ran far larger than estimated, and stopping to do items 1–3
  properly rather than rushing them seemed like the better trade.
- **Dark mode** required a two-token split discovered mid-phase, not
  planned upfront: computing real contrast ratios showed a single
  inverting `--color-ink` goes to 1.37–2.64:1 against accent fills in dark
  mode, so a second, fixed (non-inverting) `--color-ink-on-accent` token
  was added and threaded through every accent-filled component and every
  block's eyebrow-badge pattern — border color included, not just text,
  after the same contrast check caught inverted borders failing too.
- **New primitives**: `<Container>` (ends the `max-w-6xl`/`5xl`/`4xl` drift
  in blocks) and `<Icon>` (a 2-entry `close`/`menu` registry, not a full
  sprite system — matched to what the library actually uses rather than
  building for hypothetical future icons). Both applied to the block
  library; both deliberately **not** applied to `index.astro`'s own
  kitchen-sink showcase markup, which is the living component reference
  per `CLAUDE.md`, not a block consumer.
- **Fluid type scale**: 4 `clamp()` tokens, min/max-matched to the exact
  `text-Nxl sm:text-Mxl` pairs they replace, so the change is continuous
  scaling, not a different size.
- Real bugs found only by re-running the audit tooling after the dark-mode
  work, not by reading the diff: `List.astro` hardcoded `text-ink` on its
  item labels instead of inheriting the ambient color, so a `List` nested
  inside `PricingCard`'s `featured` (accent-filled) variant rendered
  unreadable text — fixed by removing the hardcoded color and using
  `opacity-70` instead of a hardcoded `/70` alpha color for the muted
  description span, so both now correctly inherit whichever ink token the
  container set. Separately, four **real production pages** (`/blog`,
  `/blog/tags/[tag]`, `/portfolio`, `/404`) had their own hand-written
  eyebrow-badge markup that predated the Container/Icon/dark-mode sweep
  and was never migrated to the fixed `-on-accent` tokens — these are
  shipped site pages, not demo content, so they were fixed in-phase rather
  than deferred alongside `index.astro`.
- Also found and fixed, unrelated to color: `TextArea.astro`'s "inside
  actions" layout variant had `focus:outline-none` with no replacement,
  making its textarea keyboard-invisible — the same `focus:*`/
  `focus-visible:*` cascade-order hazard documented in Phase 3, this time
  via a shared `--tw-outline-style` custom property rather than rule
  order: `outline-none`'s `:focus` rule wins the custom-property cascade
  by specificity regardless of source order, silently poisoning any
  `focus-visible:outline*` utility on the same element. Fixed by removing
  the conflicting reset rather than reordering classes (class order
  doesn't affect Tailwind's generated stylesheet order anyway).
- One tooling gotcha, not a codebase bug: this session had two Astro
  preview servers running on adjacent ports — 4321 belonged to an
  unrelated sibling project (`neuportfolio`), not this repo. Auditing
  against 4321 by habit produced a phantom "1 color-contrast violation"
  with class names (`.hero-meta`, `.testimonial-relationship`) that don't
  exist anywhere in this codebase. Caught by checking `lsof`/`/proc/<pid>/cwd`
  before trusting the result, not by the violation looking wrong on its
  face.
- Mandatory gates: no net change in pass/partial/fail counts (dark mode
  and the new primitives aren't separately gated), but the "WCAG AA
  contrast throughout" gate was genuinely re-opened and re-closed within
  this phase — see its row above.
- Final verification: `bun run build` and `astro check` both clean (0
  errors/warnings), `bun run audit:a11y` all-pass across all 7 routes, and
  `bun run audit:lighthouse` at 99/100/100/100 across `/`, `/landing`,
  `/blog`, `/portfolio`, `/404`, and `/docs/getting-started` — the last
  three added to the routine audit set this phase since they hadn't been
  individually checked before.

**2026-09-06** — Phase 6 completed except live deployment (item 6 of 8):

- 7 items done, 1 deliberately not attempted: deploying a live demo is an
  externally-visible, hard-to-reverse action (a real hosted deployment,
  possibly under a real domain) that's the user's call to make and host —
  not something to do autonomously mid-phase on a "yes, continue" cadence.
  Flagged to the user directly rather than silently skipped or done
  without asking.
- 7 new pages (About, Team, Contact, Pricing, Privacy, Terms, Search),
  the last via Pagefind — static, build-time indexed, no search service,
  verified with a real query returning real results, not just "the page
  loads." `site.nav` grew from 4 to 6 items to surface About and Pricing,
  which immediately caused a real regression: the Navbar's desktop nav
  plus a CTA button no longer fit at the `md` (768px) breakpoint, found
  by re-running `audit:a11y` (not assumed) — 4px of overflow on 9 of 14
  routes. Fixed at the root (moved the breakpoint to `lg`), not by
  trimming nav items back down.
- Playwright e2e suite (56 tests across Chromium + Firefox — WebKit
  configured but blocked in this sandbox by the same missing-native-libs/
  no-root constraint Phase 3 already documented) covering every
  interactive component named in the original plan, plus a per-page-type
  axe sweep. One test bug caught before trusting a false pass: a
  "backdrop click closes the modal" test initially clicked coordinates
  *relative to the dialog's own bounding box*, which — since the dialog
  has zero padding and is filled edge-to-edge by child elements — actually
  clicked a child, not the backdrop; fixed by clicking in page/viewport
  coordinates far from the centered dialog instead.
- Two real, pre-existing gaps found only by making the new CI gates
  actually run for the first time, not by writing them: `bun run format:check`
  failed on 46 files (mostly predating this phase — Phase 2 had explicitly
  deferred a repo-wide reformat), which would have shipped a broken CI
  pipeline on day one if left as-is, so it became the "dedicated formatting
  commit" Phase 2 deferred; and `scripts/audit-lighthouse.mjs`'s Chrome
  auto-detection has thrown past its own Playwright-cache fallback since
  Phase 3 (an unguarded `getInstallations()` call), which is the actual
  reason `CHROME_PATH` had to be set by hand every time this session —
  fixed and verified by unsetting it and re-running clean.
- Packaging is a zip-producing build script (`scripts/package-release.mjs`),
  not a `package.json` `files` allowlist as originally planned — this
  theme isn't published to npm, so `files` doesn't apply; a buyer-facing
  distributable is the actual need. Verified by inspecting the produced
  zip's contents (217 files, 0.25 MB) for both leaked internal files
  (RUBRIC.md, docs/superpowers/, docs/audits/ — none found) and real
  content (README, LICENSE, src/ — all present).
- Versioning: `package.json` 0.0.1 → 1.0.0. `CHANGELOG.md`'s
  `[Unreleased]` section had silently accumulated Phase 1–2 content but
  nothing from Phase 3 onward — rolled into a real `[1.0.0]` entry plus
  new entries covering everything through Phase 6, closing a gap that
  would otherwise have shipped a changelog three phases out of date.
- Mandatory gates: no count change (14 pass / 4 partial / 2 fail,
  unchanged) — Phase 6's work doesn't move any of the specific gates already
  tracked; "Hosted demo represents the product" stays ❌ pending the
  deploy decision above, and "Docs followed successfully by someone
  other than the author" remains inherently unverifiable by self-review.
- Final verification: `bun run build`, `astro check` (0 errors), a full
  repo-wide `bun run format:check` (0 issues, post-reformat), `audit:links`
  (0 broken internal links across 38 built pages), `audit:a11y` (all 14
  routes), `audit:lighthouse` (100/99/100/100 across 6 representative
  routes), and the full Playwright suite (56/56 passing on Chromium and
  Firefox) — all re-run after every fix, not just once at the end.
