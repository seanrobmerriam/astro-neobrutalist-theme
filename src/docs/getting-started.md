---
title: Getting Started
description: How the theme is organized and how to start building with it.
order: 1
---

Neubrutal is a neubrutalist design system for Astro, built with Tailwind CSS v4: thick borders, hard offset shadows, flat color, and square corners everywhere. It ships as **plain, readable `.astro` files** — nothing to install beyond Astro and Tailwind, nothing to configure beyond `src/styles/global.css`.

## Project structure

```bash
src/
├── components/   # The base building blocks — Button, Card, Modal, Table, etc.
├── blocks/       # Larger sections composed from components — Hero, Navbar, FeatureGrid, Pricing, Testimonials, FAQ, CTA
├── layouts/      # Page shells — Layout (base HTML), LandingLayout, DocsLayout
├── pages/        # Routes — index.astro is the full component showcase; landing, blog, and portfolio are example pages built from blocks
├── docs/         # This documentation, as Markdown content collection entries
└── styles/
    └── global.css  # Every design token lives here — colors, fonts, shadows
```

The rule of thumb: **components build blocks, blocks build layouts and pages.** A `Hero` block is just a `Button` and some typography; a `Navbar` block is a `Button` and a `Drawer`. Nothing in `blocks/` or `layouts/` reaches for a color, border, or shadow value that isn't already a token — see [Theming](/docs/theming).

## Running the theme

This project's dev server runs as a managed background process:

```bash
astro dev --background   # start
astro dev status         # check if it's running
astro dev logs           # tail its output
astro dev stop           # stop it
```

## Using a component

Every component is a typed Astro file — import it and pass props like any other `.astro` component:

```astro
---
import Button from "../components/Button/Button.astro";
---

<Button variant="primary" size="lg" href="/docs">
  Read the docs
</Button>
```

Props are documented per-component in the rest of this section. Most components also accept a `class` prop, which is appended to (not replacing) the component's own classes via `class:list`.

## Where to look next

- **[Theming](/docs/theming)** — the seven-color palette, type scale, and shadow tokens that everything else is built from.
- **[Buttons & Badges](/docs/buttons-badges)** through **[Blocks & Layouts](/docs/blocks-layouts)** — every component, grouped the way you'd actually reach for them.
- `src/pages/index.astro` — the single largest reference: every component in this theme, used together on one real page.
