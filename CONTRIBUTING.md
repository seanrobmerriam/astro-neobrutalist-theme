# Contributing

This is a commercial theme (see `LICENSE.md`), not an open-source project
accepting outside pull requests for redistribution. This file covers the
day-to-day workflow for working on the theme itself.

## Setup

```sh
bun install
bun run astro dev --background   # starts the dev server without blocking your shell
```

Manage the background dev server with `bun run astro dev stop` and
`bun run astro dev status`.

## Before committing

```sh
bun run astro check   # type-check .astro files
bun run build         # production build must complete cleanly
```

## Conventions

- Follow the component pattern in `src/components/Button/Button.astro`:
  typed `Props extends Omit<HTMLAttributes<"tag">, "class">`, variants as
  `Record<Variant, string>` maps, `class?: string` merged via `class:list`.
- No client-side framework. Interactivity is `data-*` attributes and plain
  `<script>` — see `src/scripts/dialog.ts` for the shared dialog pattern
  that `Modal`, `Drawer`, and `Gallery` all use.
- Brand identity, nav, and footer data that's genuinely shared across pages
  lives in `src/config/site.ts` — don't reintroduce per-page copies of it.
- Colors, shadows, and fonts are tokens in `src/styles/global.css`'s
  `@theme` block. Don't hardcode a hex value or raw Tailwind color utility
  (`bg-yellow-200`, `border-black`) where a token exists.
- `src/pages/index.astro` is the living showcase — if you add or change a
  component's public API, update its demo there too.

## Reporting issues

There's no public issue tracker for this theme. Use whatever support channel
is documented for your license tier.
