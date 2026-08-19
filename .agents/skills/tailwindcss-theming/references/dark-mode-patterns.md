# Dark mode & multi-theme patterns (Tailwind v4)

## Pattern 1 — OS preference only

Do nothing. `dark:*` utilities already respond to the `prefers-color-scheme` media query out of the box:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

Fine for sites with no in-app toggle. Not appropriate if the brief wants a user-controllable switch.

## Pattern 2 — manually toggleable, class-based

Override the `dark` variant to key off a class instead of the media query:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black"><!-- ... --></div>
  </body>
</html>
```

Toggle the class with a small script and persist the choice (localStorage is the common default, but check whether the project already has a preference-persistence mechanism, e.g. a server-rendered cookie, before assuming localStorage):

```js
document.documentElement.classList.toggle('dark', /* boolean */);
```

## Pattern 3 — manually toggleable, data-attribute based

Same idea, keyed off an attribute instead of a class — useful if the project's theming system already uses `data-*` attributes, or if you want to layer this cleanly with pattern 4 (multi-theme):

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">
```

## Pattern 4 — three-way toggle (light / dark / system)

Combine pattern 2 or 3 with `window.matchMedia` so "system" is a real third option, not just "whatever the media query says at load time." This needs to run before paint (inline in `<head>`) to avoid a flash of the wrong theme:

```js
// Inline in <head>, before any stylesheet that depends on it
document.documentElement.classList.toggle(
  'dark',
  localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
);

// When the user explicitly picks light:
localStorage.theme = 'light';
// When the user explicitly picks dark:
localStorage.theme = 'dark';
// When the user explicitly picks "match system":
localStorage.removeItem('theme');
```

Storage mechanism (localStorage vs. a cookie for SSR, vs. something else) is a project decision — this is the reference implementation, adapt persistence to fit.

## Pattern 5 — 3+ named themes (not just light/dark)

When the brief wants more than two themes (e.g. "light / dark / high-contrast" or several branded skins), don't try to force it through the binary `dark:` variant. Instead, scope each theme's token *values* under a `data-theme` selector, and let components reference the same semantic token names throughout:

```css
@import "tailwindcss";

@theme {
  /* semantic tokens with sensible defaults (acts as the "light" theme) */
  --color-surface: oklch(0.99 0.005 250);
  --color-on-surface: oklch(0.20 0.01 250);
  --color-accent: oklch(0.62 0.19 256);
}

[data-theme="dark"] {
  --color-surface: oklch(0.16 0.01 250);
  --color-on-surface: oklch(0.95 0.005 250);
  --color-accent: oklch(0.72 0.15 256);
}

[data-theme="cyberpunk"] {
  --color-surface: oklch(0.12 0.03 300);
  --color-on-surface: oklch(0.90 0.20 340);
  --color-accent: oklch(0.75 0.25 200);
}
```

Then use the semantic utilities everywhere (`bg-surface`, `text-on-surface`, `bg-accent`) instead of scale-specific ones (`bg-brand-500`) — the utility class stays the same across themes; only the underlying custom property value changes per `data-theme`. This is the key structural difference from pattern 2/3: those swap *which utilities apply* (via the `dark:` variant), this swaps *what a fixed set of utilities resolve to*.

Note this means the color tokens driving these overrides should generally be declared as plain `:root`/selector-scoped custom properties layered on top of `@theme`-registered semantic names, not redefined per-theme inside `@theme` itself (`@theme` values aren't meant to be conditionally scoped).

## Choosing a pattern

| Brief says... | Use |
|---|---|
| "just support dark mode" / no toggle mentioned | Pattern 1 |
| "let users switch light/dark" | Pattern 2 or 3 (3 if project already uses data-attributes) |
| "light/dark/system like [some app]" | Pattern 4 |
| "multiple themes" / "seasonal themes" / more than 2 named options | Pattern 5 |

Source: Tailwind CSS v4 "Dark mode" docs (tailwindcss.com/docs/dark-mode).