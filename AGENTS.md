## Project

A neubrutalist Astro + Tailwind CSS v4 component library and theme: 40+ typed `.astro` components composed into blocks, blocks composed into layouts, layouts composed into pages. Zero client JS by default — interactivity is plain `data-*` attributes and small vanilla-JS controllers, not a framework runtime.

## Development

- Node ≥ 22.12.0 (enforced via `package.json` `engines`).
- Use **Bun 1.4.2** with the committed `bun.lock`. Use `bun install` for dependencies and `bun run <script>` for project scripts.
- `bun install` for deps. **No third-party accounts or API keys required** — see `.env.example` (it's effectively empty).

### Scripts

| Command                                   | Purpose                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `bun run dev`                             | Astro dev server on `:4321`                                                            |
| `bun run build`                           | Production build to `./dist/`; runs `postbuild` automatically                          |
| `bun run postbuild` (auto)                | Runs `pagefind --site dist` to index the site for `/search`                            |
| `bun run preview`                         | Serve the production build locally                                                     |
| `bun run astro`                           | Pass-through to the Astro CLI                                                          |
| `bun run check`                           | `astro check` — type-check `.astro` files                                              |
| `bun run format` / `bun run format:check` | Prettier (with `prettier-plugin-astro`), 120-col                                       |
| `bun run test:e2e`                        | Playwright e2e (Chromium + Firefox + WebKit); manages its own build + preview          |
| `bun run audit:a11y [baseUrl]`            | axe-core + keyboard walk + horizontal-overflow check (needs `bun run preview` running) |
| `bun run audit:lighthouse [baseUrl]`      | Lighthouse mobile run with score thresholds                                            |
| `bun run audit:links`                     | Static broken-internal-link checker against `./dist/` (run after `bun run build`)      |
| `bun run package:release`                 | Zip a buyer-facing distributable to `./release/` (needs `zip` CLI)                     |

### Background dev server

When scripting or working alongside an agent, run the dev server in the background so the shell stays usable:

```
bun run astro dev --background
bun run astro dev status
bun run astro dev stop
bun run astro dev logs
```

## Architecture

```
src/
├── components/<Name>/<Name>.astro   # primitives: Button, Card, Modal, Table, ...
├── components/<Name>/<Sub>           # sub-variants, e.g. Card/{Card,CardMessage,CardStacked}
├── blocks/<Name>/<Name>.astro       # compositions: Hero, Navbar, CTA, FeatureGrid, Pricing, FAQ, Testimonials
├── layouts/                          # Layout.astro (base <head>/<body>), LandingLayout, DocsLayout
├── pages/                            # File-based routing — see "Pages" section
├── pages/_partials/                  # _-prefixed → not routed. Page-local chrome (e.g. ShowcaseSection).
├── pages/*.ts                        # API endpoints exporting GET/POST/ALL (rss.xml.ts, robots.txt.ts)
├── pages/blog/[...slug].astro        # Blog content collection routes
├── pages/docs/[...slug].astro        # Docs content collection routes
├── pages/authors/[slug].astro        # Authors collection (JSON)
├── config/site.ts, plans.ts          # Single source of truth: brand, nav, footer, pricing plans
├── content/blog/**/*.md              # Blog collection (Zod-validated frontmatter)
├── content.config.ts                 # Content collection schemas (docs, authors, blog, projects)
├── data/authors/*.json               # Author records loaded as `authors` collection
├── data/projects/*.json              # Project records loaded as `projects` collection
├── docs/*.md                         # Docs collection source — drives /docs
├── styles/global.css                 # @theme tokens: colors, fonts, shadow-brutal-* scale, .prose
├── scripts/dialog.ts                 # Shared open/close wiring for <dialog>-based components
├── scripts/theme-toggle.ts           # Three-state light/dark/system theme cycle
├── lib/blog.ts                       # getPublishedPosts() — shared by listing, RSS, tag archives
├── lib/format-date.ts                # UTC-locked toLocaleDateString (gotcha — see below)
├── lib/shiki-theme.ts                # Custom Shiki theme built from the palette
└── assets/fonts/                     # Self-hosted display face (Clariza Sparks — see Known issues)
```

`src/pages/index.astro` is the **living showcase** — every component's demo lives there. Check it before assuming how a component is meant to be used or composed. Updates to a component's public API must be reflected in its demo here.

## Component conventions

Follow the pattern in `Button.astro`:

- Typed `Props extends Omit<HTMLAttributes<"tag">, "class">`, with a `class?: string` field merged via `class:list`.
- `variant`/`size` as string union types, mapped through `Record<Variant, string>` objects of Tailwind classes — **not conditional chains**.
- Polymorphic tag rendering where relevant (`as?: "a" | "button"`, defaulting off whether `href` is set).
- **No client-side framework.** Interactivity (Modal, Drawer, Gallery, Tabs, Toast, ThemeToggle) is done with plain `data-*` attributes and vanilla JS in a `<script>` block at the bottom of the file, not hydration directives.

## Design system

Tokens live in `src/styles/global.css` under `@theme`:

- **Typography** — `--font-display`/`--font-heading` = Clariza Sparks (local, single weight — bold is synthesized); `--font-sans` = Inter; `--font-mono` = Space Mono. All three are wired up through Astro's Fonts API in `astro.config.mjs` (no hand-written `@font-face`). The `--font-*` CSS variables are defined via `<Font cssVariable="...">` tags in `Layout.astro`.
- **Fluid display sizes** — `--text-hero-split`, `--text-hero-centered`, `--text-section-lg`, `--text-section-sm` are `clamp()`-based so headings don't "snap" at the sm breakpoint. Pair with `text-balance` and `text-pretty` for headlines.
- **Structural neutrals** — `--color-ink` (black) and `--color-paper` (off-white). These **invert** in dark mode (three-state: bare `:root` is light, `prefers-color-scheme: dark` covers system, `:root[data-theme="dark"|"light"]` lets explicit choice win).
- **`--color-ink-on-accent`** — fixed (non-inverting) black for text/borders that sit _directly_ on a categorical accent fill. Categorical accents stay the same bright colors in both themes, so a border or text that inverts would lose contrast against a fill that didn't. **Only ever redefined inside `@theme`**, never inside the dark-mode blocks.
- **Categorical accents** — `--color-yellow`, `--color-pink`, `--color-blue`, `--color-green`, `--color-orange`, `--color-lavender`. Flat fills only, no gradients. Deliberately named by appearance, not role.
- **`--color-focus-ring`** — split out from blue so reassigning the `--color-blue` accent doesn't silently recolor every focus indicator.
- **Hard offset shadows** — `--shadow-brutal-{sm,'',lg,xl}` reference `--color-ink` (not hardcoded black) so they invert automatically. `--shadow-brutal-invert-{lg,xl}` are fixed-light shadows for components sitting on a dark backdrop scrim regardless of theme.
- **Square corners are load-bearing** — `dialog, select, input, textarea, button { border-radius: 0 }` is forced in global.css because Tailwind's reset doesn't reach native form elements.

For anything involving colors, shadows, typography pairing, or general neubrutalist styling, consult the **neubrutalism-design-system** and **tailwindcss-theming** project skills (`.claude/skills/`) rather than inventing new tokens.

## Interactivity pattern

`Modal`, `Drawer`, and `Gallery` are `<dialog>`-based and share **one** global click listener (`src/scripts/dialog.ts`), wired entirely through data attributes:

- `data-dialog-open="<id>"` on any element opens the `<dialog>` with that id (`dialog.showModal()`).
- `data-dialog-close` on any element inside a dialog closes it.
- Clicking the dialog element itself (the backdrop) closes it.
- The same module patches a browser bug where Tab past the last focusable lands on `<body>` briefly before wrapping — it intercepts Tab at the two boundaries.

Components that use it import the shared module once:

```astro
<script>
  import "../../scripts/dialog";
</script>
```

The browser's module cache means the listener is registered only once per page even when many components import it. **Don't add per-component open/close JS** — extend this shared listener instead.

`Tabs.astro` is self-contained: it has its own keyed event handler in its `<script>` block (Tab/arrow-key navigation, focus management, aria-selected). Don't lift it into the shared script — it's specific to tab semantics (role="tablist", roving tabindex, vertical-arrow-key variant).

`ThemeToggle` cycles system → light → dark → system via `src/scripts/theme-toggle.ts`. "System" is the _absence_ of `[data-theme]` on `<html>`, letting the `prefers-color-scheme` media query in global.css take over. The blocking inline script in `Layout.astro`'s `<head>` (not the deferred module) applies the stored preference before first paint to avoid a flash of the wrong theme.

## Layouts

- **`Layout.astro`** — base `<head>`/`<body>`. Renders the SEO component, three `<Font />` tags, the skip-to-main link, and applies the inline theme-pre-paint script. Has `class="bg-paper font-sans text-ink"` on `<body>`.
- **`LandingLayout.astro`** — composes Layout + Navbar + Footer + ToastViewport. Slots: default for `<main>`, named `footer-extra` for footer chrome, named `overlays` for one-off modals/drawers (renders once, outside `<main>`).
- **`DocsLayout.astro`** — Layout + sticky sidebar nav built from the `docs` collection + a `Drawer` for mobile. Sorts entries by frontmatter `order`. Highlights the current page via the `currentSlug` prop.

## Pages

- `/` — `index.astro`: kitchen-sink showcase of every component.
- `/landing`, `/about`, `/team`, `/contact`, `/pricing`, `/buy`, `/privacy`, `/terms`, `/search`, `/portfolio`, `/404` — standard marketing/legal pages.
- `/blog`, `/blog/[...page]`, `/blog/[...slug]`, `/blog/tags/[tag]` — blog content collection.
- `/docs`, `/docs/[...slug]` — docs content collection.
- `/authors/[slug]` — author profiles from the JSON collection.
- `/rss.xml`, `/robots.txt` — typed endpoints exporting `GET` (use `APIRoute`).

`/buy` is a **checkout stub**: it loads `plans` from `src/config/plans.ts`, surfaces a `<Badge>`/Banner explaining checkout isn't connected, and routes all plan buttons to `/contact` until `checkoutStatus.state` flips from `"stub"` to `"ready"`. There is a TODO for swapping in `import.meta.env.PUBLIC_CHECKOUT_ENABLED`.

## Content collections (`src/content.config.ts`)

Four collections defined via `glob()` loaders and `astro/zod`:

- **`docs`** — Markdown files in `src/docs/`. Frontmatter: `title`, `description`, `order` (number — used to sort the sidebar). Drives `/docs`.
- **`blog`** — Markdown files in `src/content/blog/`. Frontmatter: `title`, `description`, `publishDate`, `updatedDate?`, `author` (cross-collection `reference("authors")`), `tags` (string array, default `[]`), `heroImage` (Astro image schema), `draft` (boolean, default `false`).
- **`authors`** — JSON files in `src/data/authors/`. Frontmatter: `name`, `role`, `bio`, `avatar` (Astro image, optional).
- **`projects`** — JSON files in `src/data/projects/`. Frontmatter: `title`, `eyebrow`, `description`, `accent` (enum of the six colors), `order` (number, default `0`).

**Drafts are visible in dev and excluded in production** — see `src/lib/blog.ts`. Preview a draft by running `bun run dev`; it disappears from `bun run build` output.

## `.prose` shared styles

Long-form Markdown content (docs and blog posts) uses `class="prose"` on its wrapper. The single global class lives at the bottom of `global.css` and applies the theme's display/heading type, underlined links, `color-mix` body text, and `overflow-wrap: break-word` to all headings + paragraphs (catches the long brand-name overflow case).

## Single sources of truth

- `src/config/site.ts` — brand identity, site URL, social links, the multi-page shared `nav`, and the `footerResources` footer group. Anchor-based, single-page navs (`/`, `/landing`) are **not** centralized here — they're genuinely page-specific. Only what's byte-identical across pages lives here.
- `src/config/plans.ts` — pricing plan data shared between `/landing`'s embedded pricing section and the standalone `/pricing` page.
- `src/styles/global.css` — every visual token. Don't hardcode a hex value or raw Tailwind color utility (`bg-yellow-200`, `border-black`) where a token exists.

## Gotchas

- **`/search` is empty under `bun run dev`** — Pagefind indexing only runs in `postbuild`. Verify search with `bun run build && bun run preview`.
- **Date formatting** (`src/lib/format-date.ts`) — `z.coerce.date()` on a bare frontmatter date (`"2026-08-02"`) parses as UTC midnight. Without `timeZone: "UTC"`, `toLocaleDateString` shifts it back a day in US timezones. Always pass `timeZone: "UTC"` when rendering calendar dates from frontmatter.
- **Carousel/Glide stylesheet** — `src/layouts/Layout.astro` historically linked `node_modules/@glidejs/glide/dist/css/glide.core.min.css`, but `@glidejs/glide` is **not** a dependency in `package.json` — that stylesheet 404s. The current Carousel implementation has been reworked around this; flag any leftover Glide references before assuming carousel styling is wired up.
- **Bundled font license** — `src/assets/fonts/LICENSE-TODO.md`: the Clariza Sparks redistribution rights haven't been confirmed. Don't ship the distributable zip until that's resolved, or swap the display face for an OFL alternative (Syne, Archivo Black, Space Grotesk are listed as close matches).
- **Site URL and OG image are placeholders** — `src/config/site.ts`'s `url` (`https://example.com`) and `ogImage` (`/og-default.png`) are TODO placeholders. `astro.config.mjs`'s `site` is read from `site.url`, so canonical URLs, the sitemap, and Open Graph URLs are all wrong until that's set.
- **`/buy` checkout is a stub** — clicking any plan button goes to `/contact`, not Stripe. The Banner at the top of the page tells the buyer so the dead-end isn't silent.
- **WebKit tests need system libs** — `playwright.config.ts` includes WebKit, but the sandbox here can't `playwright install-deps` without root. CI installs them via `playwright install --with-deps`. Expect WebKit to be skipped/flaky locally.
- **No ESLint** — this is a deliberate gap, not an oversight (see `ci.yml`'s comment). `bun run format:check` is the closest equivalent lint gate today.
- **`docs/superpowers/` and `docs/audits/`** are excluded from Prettier (the markdown formatter fails on illustrative fenced snippets) and from the release zip (internal-only).
- **No live demo is deployed yet** — see `RUBRIC.md` and the linked plan doc for tracked in-progress work toward a commercial release.

## Testing

- **Playwright** (`tests/e2e/`) — covers nav (desktop + mobile drawer), modal/drawer focus trapping, tabs, accordion, gallery lightbox, contact form, theme toggling, and a per-page-type axe-core sweep. `playwright.config.ts` builds + serves preview on `:4322` itself, so `bun run test:e2e` alone runs the suite. In CI, `CI=true` enables 2 retries and the github reporter.
- **Audit scripts in `scripts/`** are repeatable, manual-run gates. `audit-a11y` (axe + heading order + 320/768/1280px overflow + keyboard-walk focus visibility) and `audit-lighthouse` (mobile-throttled, with score thresholds perf=90 / a11y=95 / best-practices=95 / seo=95) both need a preview server running first; `audit-links` needs `bun run build` to have run.
- **`audit-lighthouse.mjs` Chrome lookup** — tries `$CHROME_PATH`, system Chrome via `chrome-launcher`, then Playwright's bundled Chromium at `~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`. The `chrome-launcher.getInstallations()` call can throw on a Playwright-only machine — it's caught here, not propagated, so the Playwright fallback is reachable.

## CI (`.github/workflows/ci.yml`)

Runs on push/PR to `main`: install → `bun run check` → `bun run format:check` → `bun run build` → `bun run audit:links` → `bun x playwright install --with-deps chromium firefox webkit` → `bun run test:e2e` (with `CI=true`) → start `bun run preview` on `:4321` → `bun run audit:a11y` → `bun run audit:lighthouse`. Audit results upload to the `audit-results` artifact under `docs/audits/`.

## Releases

`bun run package:release` produces `release/<name>-v<version>.zip`. The exclusion list deliberately drops repo-root CI/agent config (`.github/`, `.agents/`, `.claude/`, `RUBRIC.md`) and this project's internal planning docs (`docs/superpowers/`, `docs/audits/`) — buyer-facing docs in `src/docs/` are untouched and render at `/docs`.

Requires the `zip` CLI; not available out of the box on Windows (run from WSL or a CI runner there).

## Project skills (`.claude/skills/`)

Use them, don't rely on general knowledge:

- **astro-components** — building/reviewing `.astro` files
- **astro-layouts** — layout structure, slots, nested layouts
- **neubrutalism-design-system** — palette, shadows, typography, component CSS
- **tailwindcss-theming** — Tailwind v4 `@theme` tokens, OKLCH colors, dark mode

## Conventions cheatsheet

- Prefer `Record<Union, string>` maps over conditional class chains for variants.
- `class:list={[base, variants[v], sizes[s], className]}` — always merge the `class?` prop last.
- Use `text-balance` on display headings and `text-pretty` on body paragraphs to avoid orphans.
- Use `border-ink-on-accent`/`text-ink-on-accent` on anything filled with a categorical accent; use `border-ink`/`text-ink` on anything filled with `bg-paper` (or transparent).
- Use `text-*` with the six accent token names directly (`text-pink`, `text-yellow`, etc.) — Tailwind v4 generates these from the `@theme` block automatically.
- Reference tokens (`var(--color-ink)`, `var(--shadow-brutal)`) in custom CSS, not hex/px literals.
- For SEO/head metadata, render the centralized `<SEO />` component (canonical, OG, Twitter, JSON-LD) — don't hand-write `<meta>` tags in a page.
