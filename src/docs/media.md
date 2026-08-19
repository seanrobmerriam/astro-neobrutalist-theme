---
title: Media
description: Carousel, CarouselSlide, Gallery, and Terminal.
order: 9
---

## Carousel & CarouselSlide

`src/components/Carousel/Carousel.astro` wraps a horizontally-scrolling, CSS scroll-snap track with prev/next buttons. Each direct child should be a `CarouselSlide`.

**Carousel props:**

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (accessible carousel label) | `"Carousel"` |
| `class` | `string` | — |

**CarouselSlide props:**

| Prop | Type | Default |
|---|---|---|
| `class` | `string` — set a `max-w-*` here to control slide width | — |

```astro
<Carousel label="Testimonials">
  <CarouselSlide class="max-w-sm">
    <div class="border-[3px] border-ink bg-yellow p-6 shadow-brutal">…</div>
  </CarouselSlide>
  <CarouselSlide class="max-w-sm">…</CarouselSlide>
</Carousel>
```

The prev/next buttons target each slide directly via `scrollIntoView()` rather than a computed pixel offset, and wrap around in both directions — clicking "next" on the last slide returns to the first.

## Gallery

`src/components/Gallery/Gallery.astro` — a responsive image grid; clicking any thumbnail opens a lightbox `<dialog>` (using the same shared dialog controller described in [Overlays](/docs/overlays)).

| Prop | Type | Default |
|---|---|---|
| `images` | `{ src, alt }[]` | — (required) |
| `columns` | `2 \| 3 \| 4` | `3` |
| `class` | `string` | — |

```astro
<Gallery
  columns={3}
  images={[
    { src: "/photos/01.jpg", alt: "…" },
    { src: "/photos/02.jpg", alt: "…" },
  ]}
/>
```

## Terminal

`src/components/Terminal/Terminal.astro` — a mock terminal/code window with real Shiki syntax highlighting, using a custom theme built entirely from this theme's own OKLCH palette (see `src/lib/shiki-theme.ts`) instead of a generic code-theme.

| Prop | Type | Default |
|---|---|---|
| `code` | `string` | — (required) |
| `filename` | `string` | — |
| `lang` | `astro \| typescript \| javascript \| css \| bash` | `astro` |
| `class` | `string` | — |

```astro
---
import source from "../components/Button/Button.astro?raw";
---
<Terminal filename="Button.astro" code={source.trim()} />
```

Importing a component's source with Vite's `?raw` suffix (as shown above) means the displayed code can never drift out of sync with the real file — it's the same trick this documentation's [showcase page anatomy section](/#anatomy) uses.

The same `neubrutalTheme` object also styles fenced code blocks in this documentation's Markdown, via `markdown.shikiConfig` in `astro.config.mjs` — so every code block on this site, including the ones on this page, uses the same syntax colors.
