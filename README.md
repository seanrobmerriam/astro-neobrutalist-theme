# Neubrutal

A neubrutalist Astro + Tailwind CSS v4 component library and theme: 40+
typed `.astro` components composed into blocks, blocks composed into
layouts, layouts composed into pages. Zero client JavaScript by default —
interactivity is plain `data-*` attributes and small vanilla-JS controllers,
not a framework runtime.

## Prerequisites

| Requirement                   | Version                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| [Node.js](https://nodejs.org) | ≥ 22.12.0                                                    |
| [Bun](https://bun.sh)         | 1.4.2 — package manager and script runner; commit `bun.lock` |
| [Astro](https://astro.build)  | 7.x (bundled as a dependency, no global install needed)      |

No third-party accounts are required to run the theme locally. It has no
external services or API keys — see `.env.example`.

## Quick start

```sh
bun install
bun run dev              # http://localhost:4321
```

Other commands:

```sh
bun run build            # production build to ./dist/ (also indexes search via Pagefind)
bun run preview           # serve the production build locally
bun run check             # type-check .astro files (astro check)
bun run format            # format the codebase with Prettier
bun run format:check      # check formatting without writing
```

Quality gates — all require `bun run build && bun run preview` (or any static server) running first, except `test:e2e` and `audit:links`, which manage their own server/build:

```sh
bun run test:e2e                          # Playwright e2e suite (Chromium, Firefox, WebKit)
bun run audit:a11y   [baseUrl]            # axe-core + keyboard walk + viewport overflow
bun run audit:lighthouse [baseUrl]        # Lighthouse: performance, a11y, best practices, SEO
bun run audit:links                       # broken internal links in ./dist/ (run after bun run build)
bun run package:release                   # zips a buyer-facing distributable to ./release/
```

For background dev-server workflows (useful when scripting or working
alongside an agent):

```sh
bun run astro dev --background
bun run astro dev status
bun run astro dev stop
bun run astro dev logs
```

## Project map

```
src/
├── components/<Name>/<Name>.astro   # primitives: Button, Card, Modal, Table, ...
├── blocks/<Name>/<Name>.astro       # compositions of components: Hero, Navbar, CTA, FeatureGrid
├── layouts/                         # Layout.astro (base <head>/<body>), LandingLayout, DocsLayout
├── pages/                           # index.astro (kitchen-sink showcase), landing/about/team/contact/pricing/
│                                    #   privacy/terms/search, blog/portfolio, docs/[...slug]
├── config/site.ts, plans.ts         # brand/nav/footer data and pricing-plan data, single source of truth
├── docs/*.md                        # content-collection source for /docs — schema in content.config.ts
├── styles/global.css                # @theme tokens: colors, fonts, shadow-brutal-* scale
└── scripts/dialog.ts                # shared open/close wiring for dialog-based components
```

`src/pages/index.astro` is the living showcase/reference for every
component — check it before assuming how a component is meant to be used or
composed.

## Interactive terminal

The showcase imports `src/blocks/Terminal/WTermBash.astro` as `WTerminal`.
This block runs a browser-based shell with an in-memory filesystem and
requires client JavaScript plus the bundled `public/ghostty-vt.wasm` asset.
See [the WTerminal documentation](src/docs/media.md#wterminal) for usage,
setup, customization, and current limitations.

## Customization

**Brand, URL, and shared nav/footer data** live in one place:
`src/config/site.ts`. Change `site.name`, `site.url`, `site.social`, and the
two files it exports before deploying — everything else (page titles, the
footer, Open Graph tags, the sitemap, `robots.txt`) reads from it.

**Colors, typography, and shadows** are Tailwind v4 `@theme` tokens in
`src/styles/global.css` — six categorical accent colors, two structural
neutrals, and a three-tier hard-offset shadow scale (`shadow-brutal-sm` /
`shadow-brutal` / `shadow-brutal-lg` / `shadow-brutal-xl`). Change a token
there and every component that uses it follows.

**Fonts** are configured in `astro.config.mjs`'s `fonts` array using Astro's
[Fonts API](https://docs.astro.build/en/guides/fonts/) — Google-provided
families are downloaded and self-hosted at build time, and the local
Clariza Sparks display face is read from `src/assets/fonts/`. See
`src/assets/fonts/LICENSE-TODO.md` before distributing — that face's
license hasn't been confirmed to cover redistribution.

**Navigation, CTAs, and page content** are plain props/data passed into
`LandingLayout` and the block components from each page in `src/pages/` —
no CMS or content collection is required to edit them.

**Documentation content** (`/docs`) is a real Astro content collection
(`src/content.config.ts` + `src/docs/*.md`) with a validated frontmatter
schema (`title`, `description`, `order`). Add a new `.md` file there to add
a docs page — no route file needed.

## Testing and CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: install → type
check → format check → build → link check → Playwright e2e (Chromium,
Firefox, WebKit) → accessibility audit → Lighthouse audit. There's no
ESLint configured (a deliberate gap, not an oversight — see the CI workflow
comment); the format check is the closest equivalent lint gate today.

The Playwright suite (`tests/e2e/`) covers navigation (desktop + mobile
drawer), modal/drawer focus trapping, tabs, the accordion, the gallery
lightbox, the contact form, theme toggling, and a per-page-type axe-core
sweep. It manages its own build + preview server (`playwright.config.ts`),
so `bun run test:e2e` alone is enough to run it locally.

## Support and versioning

This project follows [Semantic Versioning](https://semver.org/) as of
1.0.0 — see `CHANGELOG.md` for the full history, in
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Breaking
changes to a component's props or a page's URL bump the major version.

Support channels and response-time commitments vary by license tier — see
your purchase confirmation or `LICENSE.md`. Bug reports and feature
requests for the theme itself are welcome through whatever issue tracker
this repository is hosted on.

## Deployment

This is a fully static site (`output: "static"`, the Astro default) — no
SSR adapter is required. Deploy the contents of `bun run build`'s `./dist/`
output to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages,
S3 + CloudFront, etc.). No environment variables are required at build or
runtime.

## License

See `LICENSE.md` — a commercial license with Personal/Pro/Team tiers, not
MIT. Fill in the placeholders in that file (legal name, contact) before
presenting it to a buyer.

## Known issues

- `src/assets/fonts/LICENSE-TODO.md` — the bundled Clariza Sparks font's
  redistribution rights haven't been confirmed.
- `src/config/site.ts`'s `url` and `ogImage` are placeholders
  (`https://example.com`, `/og-default.png`) — set the real domain and add a
  real social-preview image before launch.
- `/search`'s Pagefind index is generated by the `postbuild` script and only
  exists after a real `bun run build` — the search box is empty under
  `bun run dev`. Verify it with `bun run build && bun run preview`.
- No live demo is deployed yet — see the plan doc for the deployment step.
- See `docs/superpowers/plans/2026-09-04-rubric-remediation.md` for the full
  list of what's tracked as in-progress toward a commercial release, and
  `docs/superpowers/plans/PRELAUNCH-CHECKLIST.md` for what has to exist
  before specific pricing-page claims (Figma file, support channel, update
  delivery) are accurate.
