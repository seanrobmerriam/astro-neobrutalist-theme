---
name: tailwindcss-theming
description: Create and customize Tailwind CSS v4 themes using the CSS-first @theme directive — design tokens, OKLCH color scales, typography, spacing, shadows, and dark/multi-theme switching. Use this whenever the user wants a Tailwind theme, custom color palette, design tokens, dark mode, or a themed CSS file for a Tailwind v4 project (no tailwind.config.js). Also trigger on "make this look like [brand/vibe]", "give this a [aesthetic] theme", "add dark mode to my Tailwind site", or "generate a color palette for Tailwind".
---

# Tailwind CSS v4 Theming

Tailwind v4 has no `tailwind.config.js` by default. Theming happens entirely in CSS via the `@theme` directive: you define CSS custom properties in a namespaced form, and Tailwind auto-generates matching utility classes and variants from them. This skill covers the workflow for building a complete, coherent theme this way — not just "here's how @theme works," but how to go from a vibe or brand brief to a finished, well-organized theme file.

If the project actually uses a legacy `tailwind.config.js` (v3), stop and confirm — the mental model is different (JS objects, not CSS custom properties) and this skill's specifics won't transfer directly, though the design-token thinking still applies.

## Quick mental model

- `@import "tailwindcss";` pulls in Tailwind's default theme (colors, type scale, shadows, etc.) as CSS.
- `@theme { --namespace-name: value; }` both defines a CSS variable **and** registers a new utility/variant. Writing `--color-brand: oklch(0.62 0.19 256);` gives you `bg-brand`, `text-brand`, `border-brand`, etc. for free.
- The namespace prefix (`--color-`, `--font-`, `--spacing-`, ...) determines what kind of utility gets generated. See `references/theme-namespaces.md` for the full table.
- `@theme` blocks are **additive by default** — new variables extend the default theme. Override a single default value by redefining it. Wipe a whole namespace with `--color-*: initial;` before your own values. Wipe everything with `--*: initial;` for a fully custom token set (see `references/theme-namespaces.md` for exact syntax).
- Tailwind also emits every theme variable as a plain CSS custom property on `:root`, so you can use `var(--color-brand)` in hand-written CSS or inline styles — one source of truth for both utility classes and custom CSS.

## Workflow

### 1. Gather the brief

Before writing any tokens, get (or infer, then confirm) the essentials — don't ask more than needed if the user already gave enough to proceed:

- **Aesthetic/vibe or existing brand colors.** A mood ("dark terminal", "playful SaaS", "neubrutalist") or literal hex/brand colors to build from.
- **Light, dark, or both?** And if both, how switching should work (see step 5).
- **Any fixed constraints**: an existing logo color, an accessibility requirement (e.g. WCAG AA contrast), a font already in use.
- **Scope**: a full design system (colors + type + spacing + radius + shadows) or just a color palette dropped into an existing setup?

Default to a full, coherent token set (colors, type scale anchor, radius, shadow) unless the user clearly only wants one piece.

### 2. Design the color system in OKLCH

Tailwind's own default palette is defined in OKLCH, and it's the right space for hand-authored scales too — lightness is perceptually uniform across hues, so a `-500` step reads as "the same brightness" whether it's the brand blue or the destructive red. Don't hand-roll scales in hex/HSL and eyeball it.

For each semantic color (`brand`, `accent`, `neutral`, `success`, `warning`, `danger`, ...):
1. Pick a base hue and chroma that match the brief.
2. Generate a 50–950 (or 950–50 for a dark-first palette) lightness ramp, holding hue roughly constant and tapering chroma at the extremes (very light and very dark steps should desaturate, or they look muddy/neon).
3. Cross-check contrast for the steps that will actually pair as text-on-background (typically 500–700 on white, 50–200 on a dark surface).

See `references/oklch-palettes.md` for the ramp heuristic, worked examples, and a copy-pasteable generation approach. Don't just reuse Tailwind's stock `blue`/`slate`/etc. scales and call it a custom theme unless the user's brief is genuinely close to Tailwind defaults — the point of a custom theme is usually to *not* look like default Tailwind.

### 3. Write the `@theme` block

Structure the CSS file top to bottom as: import → `@theme` block → (optional) `@custom-variant` for dark mode → base/component styles. Keep the `@theme` block itself just tokens — no selectors, no nesting (it's a hard requirement, not just a style choice).

```css
@import "tailwindcss";

@theme {
  /* Color: semantic scales, not just brand + neutral */
  --color-brand-50: oklch(0.97 0.02 256);
  --color-brand-500: oklch(0.62 0.19 256);
  --color-brand-900: oklch(0.28 0.12 256);
  /* ...full ramp per references/oklch-palettes.md */

  /* Typography */
  --font-display: "Space Grotesk", sans-serif;
  --font-sans: "Inter", sans-serif;

  /* Radius / shadow / spacing overrides, only if the brief calls for them */
  --radius-card: 0.75rem;
  --shadow-brand: 0 4px 24px oklch(0.62 0.19 256 / 0.25);
}
```

Naming: prefer semantic scale names (`brand`, `accent`, `surface`, `danger`) over literal color names (`blue`, `midnight`) unless the user explicitly wants literal names — semantic names survive a future rebrand without renaming every utility class in the codebase.

### 4. Extend vs. override — pick deliberately, per namespace

- **Extend** (just add new `--color-brand-*` alongside the defaults) when the project still wants Tailwind's stock palette available as a fallback/utility grab-bag.
- **Override one namespace** (`--color-*: initial;` then define only your scales) when you want `bg-blue-500` etc. to simply not exist — forces the team onto your palette.
- **Override everything** (`--*: initial;`) only for a from-scratch design system with its own spacing scale, type scale, etc. This is a bigger commitment — confirm before doing it, since it silently removes utilities the user may not realize they were relying on (e.g. `p-4`, `rounded-lg`).

Full syntax for each in `references/theme-namespaces.md`.

### 5. Dark mode / multi-theme switching

Three patterns, pick based on the brief from step 1:

| Need | Pattern |
|---|---|
| Just follow OS preference | Do nothing extra — `dark:` already uses `prefers-color-scheme` |
| User-toggleable light/dark | `@custom-variant dark (&:where(.dark, .dark *));` + toggle a `.dark` class on `<html>` |
| 3+ named themes (not just light/dark) | Data-attribute variants (`[data-theme=cyberpunk]`) driving separate token overrides, not the `dark:` variant |

Full patterns, the three-way (light/dark/system) toggle script, and the multi-theme token-swap structure are in `references/dark-mode-patterns.md`. Don't invent a different toggle mechanism (localStorage keys, class names) without checking whether the project already has one — grep for `dark:` or `data-theme` in existing CSS/components first if working in an existing codebase.

### 6. Verify

- If you have code execution: build a small static HTML swatch page using the actual generated utility classes (`bg-brand-500`, `text-brand-900`, etc.) so contrast and vibe can be eyeballed before handing it off — don't just describe the palette in prose.
- Check that every custom utility the theme is meant to unlock actually has a plausible use in the project (no orphaned tokens).
- If overriding a whole namespace, double check nothing in the existing codebase depends on a default value that just disappeared (e.g. `rounded-lg`, `shadow-md`).

## Common mistakes to avoid

- **Nesting or scoping `@theme`.** It must be top-level in the CSS file — no wrapping selector, no media query.
- **Hex/HSL hand-rolled scales.** Use OKLCH so lightness steps are perceptually consistent (see step 2).
- **Forgetting `inline` when a theme variable references another custom property** (e.g. wiring in a Next.js font variable): `@theme inline { --font-sans: var(--font-inter); }`. Without `inline`, the reference can resolve unexpectedly. See `references/theme-namespaces.md`.
- **Reaching for `tailwind.config.js` patterns.** `theme.extend.colors` in JS has no direct v4 equivalent — everything is namespace + CSS custom property now. If porting an old config, translate namespace-by-namespace rather than copy-pasting JS.
- **Treating `:root` and `@theme` as interchangeable.** Use `@theme` only for tokens that should generate a utility class; use plain `:root { --foo: ... }` for CSS variables that shouldn't.

## Reference files

- `references/theme-namespaces.md` — full namespace table, extend/override/full-reset syntax, `inline` and `static` modifiers, animation keyframes.
- `references/oklch-palettes.md` — how to build a perceptually even 50–950 OKLCH ramp by hand, worked examples, contrast-pairing notes.
- `references/dark-mode-patterns.md` — class-based, data-attribute, and system-aware dark mode; multi-theme (3+) token-swap structure.