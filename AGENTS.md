## Project

A neubrutalist Astro + Tailwind CSS v4 component library and theme: 40+ typed `.astro` components composed into blocks, blocks composed into layouts, layouts composed into pages. Zero client JS by default.

## Development

Use pnpm (this is a pnpm workspace — `pnpm-workspace.yaml`, `pnpm-lock.yaml`).

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Other commands: `pnpm build`, `pnpm preview`, `pnpm astro check`.

## Architecture

```
src/
├── components/<Name>/<Name>.astro   # primitives: Button, Card, Modal, Table, ...
├── blocks/<Name>/<Name>.astro       # compositions of components: Hero, Navbar, CTA, FeatureGrid
├── layouts/                          # Layout.astro (base <head>/<body>), LandingLayout, DocsLayout
├── pages/                            # index.astro (kitchen-sink showcase), docs/[...slug].astro
├── docs/*.md                         # content-collection source for /docs, schema in content.config.ts
├── styles/global.css                 # @theme tokens: colors, fonts, shadow-brutal-* scale
└── scripts/dialog.ts                 # shared open/close wiring for dialog-based components
```

`src/pages/index.astro` is the living showcase/reference for every component — check it before assuming how a component is meant to be used or composed.

## Component conventions

Follow the pattern in `Button.astro`:
- Typed `Props extends Omit<HTMLAttributes<"tag">, "class">`, with a `class?: string` field merged via `class:list`
- `variant`/`size` as string union types, mapped through `Record<Variant, string>` objects of Tailwind classes — not conditional chains
- Polymorphic tag rendering where relevant (`as?: "a" | "button"`, defaulting off whether `href` is set)
- No client-side framework — interactivity (Modal, Drawer, Gallery, Tabs) is done with plain `data-*` attributes and vanilla JS, not hydration directives

## Design system

Tokens live in `src/styles/global.css` under `@theme`: `--color-ink`/`--color-paper` (structural neutrals), six flat categorical accents (`--color-yellow`, `-pink`, `-blue`, `-green`, `-orange`, `-lavender`), and a three-tier `--shadow-brutal-{sm,'',lg,xl}` hard-offset shadow scale (plus `-invert-*` variants for dark surfaces). Square corners are load-bearing — native form elements have `border-radius: 0` forced in global.css since Tailwind's reset doesn't reach them.

For anything involving colors, shadows, typography pairing, or general neubrutalist styling, consult the **neubrutalism-design-system** and **tailwindcss-theming** project skills (`.claude/skills/`) rather than inventing new tokens.

## Interactivity pattern

Modal, Drawer, Gallery, and similar overlay components share one global click listener (`src/scripts/dialog.ts`), wired entirely through data attributes: `data-dialog-open="<id>"` opens the `<dialog>` with that id, `data-dialog-close` (anywhere inside it) closes it, and backdrop clicks close it too. Don't add per-component open/close JS — extend this shared listener instead.

## Project skills

This repo has scoped skills in `.claude/skills/` — use them, don't rely on general knowledge:
- **astro-components** — building/reviewing `.astro` component files
- **astro-layouts** — layout structure, slots, nested layouts
- **neubrutalism-design-system** — palette, shadows, typography, component CSS
- **tailwindcss-theming** — Tailwind v4 `@theme` tokens, OKLCH colors, dark mode

## Known issues

- `src/layouts/Layout.astro` links `node_modules/@glidejs/glide/dist/css/glide.core.min.css`, but `@glidejs/glide` is not a dependency in `package.json` — this stylesheet 404s. Flag before assuming carousel/glide styling is wired up.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
