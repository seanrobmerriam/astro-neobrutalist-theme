# Theme variable namespaces (Tailwind v4)

Theme variables are CSS custom properties defined inside `@theme { ... }`. The namespace prefix (the part before the token name) determines what utility classes or variants get generated.

## Full namespace table

| Namespace | Utility classes / variants it drives |
|---|---|
| `--color-*` | Color utilities: `bg-red-500`, `text-sky-300`, `border-brand-600`, `fill-*`, `stroke-*`, etc. |
| `--font-*` | Font family utilities like `font-sans`, `font-display` |
| `--text-*` | Font size utilities like `text-xl` (also carries a paired `--text-{name}--line-height` for the default line-height) |
| `--font-weight-*` | `font-bold`, `font-medium`, etc. |
| `--tracking-*` | Letter spacing: `tracking-wide` |
| `--leading-*` | Line height: `leading-tight` |
| `--tab-size-*` | `tab-github`, etc. |
| `--breakpoint-*` | Responsive variants: `sm:*`, `3xl:*` |
| `--container-*` | Container query variants (`@sm:*`) and `max-w-*`-style container sizes |
| `--spacing-*` | Padding, margin, gap, width/height, inset, and many other spacing-driven utilities. Note: `--spacing` (no suffix) is the base spacing unit multiplier used by numeric utilities like `p-4` |
| `--radius-*` | `rounded-sm`, `rounded-xl`, etc. |
| `--shadow-*` | `shadow-md`, etc. |
| `--inset-shadow-*` | `inset-shadow-xs`, etc. |
| `--drop-shadow-*` | `drop-shadow-md` (filter, not box-shadow) |
| `--text-shadow-*` | `text-shadow-sm`, etc. |
| `--blur-*` | `blur-md` |
| `--perspective-*` | `perspective-near` |
| `--zoom-*` | `zoom-compact` |
| `--aspect-*` | `aspect-video` |
| `--ease-*` | Transition timing functions: `ease-out` |
| `--animate-*` | `animate-spin`, custom animations (pair with a `@keyframes` block — see below) |

Some utilities are static (`flex`, `object-cover`) and never driven by theme variables — no namespace touches them.

## Extending vs. overriding

**Extend** — add new tokens alongside the defaults:

```css
@theme {
  --color-brand-500: oklch(0.62 0.19 256);
  --font-script: "Great Vibes", cursive;
}
```

**Override one default value** — redefine the exact same variable name:

```css
@theme {
  --breakpoint-sm: 30rem; /* was 40rem */
}
```

**Override an entire namespace** — wipe it, then define only your own values, using the special asterisk syntax:

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-brand: oklch(0.62 0.19 256);
  --color-surface: oklch(0.98 0.01 256);
}
```
After this, `bg-red-500` and every other stock color utility no longer exists — only your custom ones do.

**Disable the default theme entirely** — for a fully custom, from-scratch token set:

```css
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  /* every utility that isn't backed by a token you define here will not exist */
}
```
This is a big move — utilities like `p-4`, `rounded-lg`, `shadow-md` disappear unless redefined. Confirm with the user before doing this on an existing project.

## `inline` — when a token references another CSS variable

If a theme variable's value is itself `var(--something-else)` (common when wiring in a variable injected by a framework, e.g. Next.js font loading), use `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

Without `inline`, the reference is resolved where `--font-sans` is *defined* (often `:root`), not where the utility class is *used*, which can silently fall back to a default instead of the intended value. `inline` makes the utility class use the variable's value directly instead of re-referencing it.

## `static` — always emit every variable

By default Tailwind only emits CSS variables for tokens that are actually used somewhere in the compiled output. Force full emission (useful if something outside Tailwind's scanning needs the variable, e.g. a JS animation library reading `getComputedStyle`):

```css
@theme static {
  --color-primary: var(--color-red-500);
  --color-secondary: var(--color-blue-500);
}
```

## Animation keyframes

Define `@keyframes` *inside* the `@theme` block, alongside the `--animate-*` variable that references them, so they get bundled into the output only when used:

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
}
```
If the keyframes should always ship regardless of whether the `--animate-*` token is referenced, define them *outside* `@theme` instead.

## Sharing a theme across projects

Theme variables are just CSS, so a shared design system can live in its own file/package and get pulled in with `@import`:

```css
/* app.css */
@import "tailwindcss";
@import "../brand/theme.css";
```

## Using tokens outside of utility classes

Every theme token becomes a real `:root`-level CSS custom property, so it's available in hand-written CSS, inline styles, and `calc()`:

```css
.typography h1 {
  font-size: var(--text-2xl);
  color: var(--color-gray-950);
}
```

```html
<div class="rounded-[calc(var(--radius-xl)-1px)]"><!-- concentric radius --></div>
```

Source: Tailwind CSS v4 "Theme variables" and "Functions and directives" docs (tailwindcss.com/docs/theme, /docs/functions-and-directives).