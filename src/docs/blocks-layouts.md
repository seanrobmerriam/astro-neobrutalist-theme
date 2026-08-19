---
title: Blocks & Layouts
description: Hero, Navbar, FeatureGrid, CTA, Footer, and the page layouts.
order: 10
---

Blocks are larger, pre-composed sections built entirely from the components documented elsewhere in this section — none of them introduce a new color, border, or shadow value of their own.

## Hero

`src/blocks/Hero/Hero.astro`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | — |
| `eyebrow` | `string` | — |
| `title` | `string` | — (required) |
| `subtitle` | `string` | — |
| `primaryCta` | `{ label, href }` | — |
| `secondaryCta` | `{ label, href }` | — |
| `class` | `string` | — |

```astro
<Hero
  eyebrow="Astro + Tailwind CSS v4"
  title="Neubrutalism, fully assembled."
  primaryCta={{ label: "Browse components", href: "#buttons" }}
/>
```

## Navbar

`src/blocks/Navbar/Navbar.astro` — a sticky header with a `Drawer`-based mobile menu built in.

| Prop | Type | Default |
|---|---|---|
| `brand` | `string` | `"Neubrutal"` |
| `links` | `{ label, href }[]` | `[]` |
| `ctaLabel` / `ctaHref` | `string` | — |
| `class` | `string` | — |

```astro
<Navbar brand="Neubrutal" links={[{ label: "Docs", href: "/docs" }]} ctaLabel="Get the theme" ctaHref="/#cta-block" />
```

## FeatureGrid

`src/blocks/FeatureGrid/FeatureGrid.astro` — a grid of `Card`s, cycling through the six accent colors automatically unless a feature specifies its own.

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | — |
| `eyebrow` / `title` / `description` | `string` | — |
| `features` | `{ title, description, accent? }[]` | — (required) |
| `class` | `string` | — |

## CTA

`src/blocks/CTA/CTA.astro` — a full-bleed banner with one or two buttons.

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | — |
| `title` | `string` | — (required) |
| `description` | `string` | — |
| `primaryCta` | `{ label, href }` | — (required) |
| `secondaryCta` | `{ label, href }` | — |
| `accent` | `yellow \| pink \| blue \| green \| orange \| lavender` | `yellow` |
| `class` | `string` | — |

## Footer

`src/components/Footer/Footer.astro`

| Prop | Type | Default |
|---|---|---|
| `brand` | `string` | `"Neubrutal"` |
| `tagline` | `string` | — |
| `groups` | `{ heading, links: { label, href }[] }[]` | `[]` |
| `class` | `string` | — |

Two slots: a default slot (rendered on the bottom-right, next to the copyright line) and a named `social` slot (rendered under the brand/tagline).

## Layouts

**`src/layouts/Layout.astro`** — the base HTML shell: `<html>`/`<head>`/`<body>`, fonts, meta tags. Props: `title`, `description`.

**`src/layouts/LandingLayout.astro`** — wraps `Layout` and adds the `Navbar`, `Footer`, and a `ToastViewport`, plus a named `overlays` slot for page-level `Modal`/`Drawer`/`SpeedDial` instances that should render once, outside the main content flow.

```astro
---
import LandingLayout from "../layouts/LandingLayout.astro";
---
<LandingLayout title="My Page" navLinks={[{ label: "Docs", href: "/docs" }]}>
  <p>Page content</p>

  <Fragment slot="overlays">
    <Modal id="demo-modal" title="Hello">…</Modal>
  </Fragment>
</LandingLayout>
```

**`src/layouts/DocsLayout.astro`** — the layout this documentation site itself uses: `Layout` plus a sidebar of every entry in the `docs` content collection, sorted by its `order` frontmatter field.
