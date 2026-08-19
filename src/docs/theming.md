---
title: Theming
description: The color, type, and shadow tokens that drive the entire theme.
order: 2
---

Every visual decision in this theme — color, font, shadow — is a Tailwind v4 `@theme` token defined once in `src/styles/global.css`. There is no `tailwind.config.js`; change a value there and the whole site follows.

## Color

Seven flat colors, all defined in OKLCH for perceptually consistent lightness:

```css
@theme {
  --color-ink: oklch(0 0 0);
  --color-paper: oklch(0.9934 0.0107 95.16);    /* Off White */
  --color-yellow: oklch(0.8789 0.1617 90.94);   /* Bold Yellow */
  --color-pink: oklch(0.7116 0.1812 22.84);     /* Coral Pink */
  --color-blue: oklch(0.7682 0.123 250.03);     /* Sky Blue */
  --color-green: oklch(0.8046 0.1136 149.93);   /* Soft Green */
  --color-orange: oklch(0.7969 0.1443 60.82);   /* Orange */
  --color-lavender: oklch(0.7776 0.1147 292.01);/* Lavender */
}
```

Each generates the full set of Tailwind utilities for free: `bg-yellow`, `text-pink`, `border-blue`, `bg-green/25`, and so on. `ink` and `paper` are the structural neutrals — text, borders, and backgrounds — everything else is an accent, used deliberately rather than everywhere at once.

## Typography

| Role | Token | Face |
|---|---|---|
| Display / Heading | `font-display`, `font-heading` | Clariza Sparks (local, bundled font) |
| Body | `font-sans` | Inter |
| Mono / labels | `font-mono` | Space Mono |

Clariza Sparks ships as a single weight, so it's reserved for the loudest roles — hero titles, section headings, the logo. Body copy stays on Inter for legibility at small sizes.

## Shadows

A three-tier hard-shadow system, zero blur, always offset down-right:

| Token | Value | Use for |
|---|---|---|
| `shadow-brutal-sm` | `3px 3px 0 0` | Badges, chips, inline actions |
| `shadow-brutal` | `5px 5px 0 0` | Cards, buttons, panels |
| `shadow-brutal-lg` | `8px 8px 0 0` | Overlays, hero elements |
| `shadow-brutal-xl` | `12px 12px 0 0` | Dialogs |

Two inverted variants exist for components that sit on a dark surface — a black shadow disappears against a dark dialog backdrop:

| Token | Use for |
|---|---|
| `shadow-brutal-invert-lg` | Toasts on a dark background |
| `shadow-brutal-invert-xl` | — |

## Square corners

`border-radius: 0` is the point, not an oversight. A small global rule in `global.css` zeroes the browser-default radius on native controls (`dialog`, `select`, `input`, `textarea`, `button`) that would otherwise slip past Tailwind's reset. Everything else is square by default — deviations (like the circular dots on the `Terminal` window chrome, or `Avatar`'s optional `shape="circle"`) are deliberate exceptions, not accidents.

## Changing the palette

Swap any of the seven `oklch()` values in `global.css` and every component that uses that token updates automatically — nothing else in the codebase hardcodes a color.
