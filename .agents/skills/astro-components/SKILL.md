---
name: astro-components
description: Best practices and current API reference for building Astro (.astro) components — component structure, typed props, slots, scoped styles, client hydration directives for framework islands, content collections integration, and image optimization via astro:assets. Use when creating, reviewing, or refactoring .astro component files, or when asked about Astro component structure, props, slots, styling, client:* directives, or images.
---

# Building Astro Components

Astro components (`.astro` files) are HTML-only templating components with **no client-side runtime by default**. They render to HTML at build time or on-demand — any JavaScript in the component script is stripped from the page sent to the browser unless explicitly hydrated. Default to zero-JS; only add a client directive when a component genuinely needs to run in the browser.

## Component structure

Every `.astro` file has two parts:

```astro
---
// Component Script (runs at build/request time, never shipped to the browser)
import SomeComponent from './SomeComponent.astro';
const { title } = Astro.props;
const data = await fetch('https://api.example.com/data').then(r => r.json());
---
<!-- Component Template (HTML + JS expressions) -->
<h1>{title}</h1>
```

The code fence (`---`) is the frontmatter/script — safe to put expensive or sensitive work here (private API calls, DB queries) since it never reaches the client. The script is TypeScript by default.

## Typed props

Define a `Props` interface (or `type`) in the frontmatter. The Astro VS Code extension and the compiler pick it up automatically — no `export` needed.

```astro
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Default description' } = Astro.props;
---
```

Common patterns:
- No props/only slotted content: `type Props = Record<string, never>;`
- Requires children: `type Props = { children: any };`
- Mirror native HTML attributes: `import type { HTMLAttributes } from 'astro/types'; type Props = HTMLAttributes<'a'>;` (extend with `interface Props extends HTMLAttributes<'a'> { ... }` to add custom props)
- Reference another component's props: `import type { ComponentProps } from 'astro/types'; type ButtonProps = ComponentProps<typeof Button>;`
- Polymorphic "render as any tag" components: use `HTMLTag` + `Polymorphic` from `astro/types`.

## Slots

`<slot />` is the default placeholder for children passed into a component.

```astro
<!-- Wrapper.astro -->
<div id="content-wrapper">
  <Header />
  <slot>
    <p>Fallback content shown only if nothing is passed in</p>
  </slot>
  <Footer />
</div>
```

**Named slots** — child elements with a matching `slot="name"` attribute go into `<slot name="name" />`; everything else goes into the default slot. Named slots must be an immediate child of the component (not nested), and slot names cannot be generated dynamically (e.g. inside `.map()`).

```astro
<Wrapper>
  <img slot="after-header" src="..." />
  <h2>Default slot content</h2>
</Wrapper>
```

To pass multiple elements into one named slot without an extra wrapper `<div>`, use `<Fragment slot="name">...</Fragment>`.

Slots can be **transferred** to a nested layout using `<slot name="head" slot="head" />` — useful for layouts that wrap other layouts.

## Scoped styles

A `<style>` tag inside a component is scoped to that component by default (compiled with a `data-astro-cid-*` attribute) — low-specificity selectors like `h1 {}` are safe and won't leak.

```astro
<style>
  h1 { color: red; }
</style>
```

- **Global styles**: `<style is:global>` opts out of scoping. Mix scoped + global in one tag with the `:global()` selector, e.g. `article :global(h1) { color: blue; }`.
- **Combine classes dynamically**: `class:list={['box', { red: isRed }]}`.
- **CSS custom properties from frontmatter**: `<style define:vars={{ backgroundColor }}>` then `var(--backgroundColor)` in the CSS.
- **`class` doesn't auto-propagate to children.** Accept it explicitly and pass through the rest of props (needed for the parent's scope attribute to apply):
  ```astro
  ---
  const { class: className, ...rest } = Astro.props;
  ---
  <div class={className} {...rest}><slot /></div>
  ```
- **Cascading order** (lowest → highest precedence): `<link>` tags → imported stylesheets → scoped `<style>` tags. Within equal specificity, later wins.
- Preprocessors (Sass/SCSS, Less, Stylus) work via `<style lang="scss">` etc. after `npm install sass` (or the relevant package).

## Client hydration (framework islands)

`.astro` components themselves can't be hydrated with `client:*` — they have no client runtime. Hydration directives apply only to **UI framework components** (React, Vue, Svelte, etc.) imported directly into an `.astro` file:

| Directive | When JS loads | Use for |
|---|---|---|
| `client:load` | Immediately on page load | Above-the-fold interactive elements |
| `client:idle` | After `requestIdleCallback` (or `load` as fallback); accepts `{timeout}` | Lower-priority UI |
| `client:visible` | When it enters the viewport (`IntersectionObserver`); accepts `{rootMargin}` | Below-the-fold, heavy components |
| `client:media="(query)"` | When a CSS media query matches | Elements only relevant at certain breakpoints |
| `client:only="react"` | Skips server render entirely, renders client-only; **framework name is required** | Components that can't/shouldn't SSR |

No directive at all = the component still renders its HTML on the page, just with zero shipped JS (fully static).

For static content authored in Astro but rendered inside a framework component, pass it via slots — React/Preact/Solid receive slots as a `children` prop (or named-slot props, kebab-case → camelCase); Svelte/Vue use `<slot name="...">` as usual.

Astro components **cannot** be imported into framework component files (`.jsx`, `.svelte`, etc.) — the reverse (framework components inside `.astro`) is fine and can be nested/recursive.

For client-side interactivity without a full framework, use a plain `<script>` tag in the `.astro` file, or [Nano Stores](https://github.com/nanostores/nanostores) to share state between multiple Astro components' `<script>` tags.

## Images (`astro:assets`)

Prefer the built-in `<Image />` over a raw `<img>` whenever possible — it enforces `alt`, infers `width`/`height` to prevent layout shift, and optimizes format/quality at build time (or on-demand for server-rendered pages).

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/my_image.png'; // local: import it
---
<Image src={myImage} alt="A description of my image." />
```

- Local images (`src/`) must be imported; remote images pass a full URL string and require explicit `width`/`height` unless `inferSize` is set; `public/`-folder images also need explicit dimensions.
- `alt` is **required** — use `alt=""` only for purely decorative images.
- Build reusable, styled image components by wrapping `<Image />`/`<Picture />` in your own `.astro` component and forwarding props.
- For output destined somewhere other than direct HTML (e.g. an API route, a CSS `background-image`), use `getImage()` instead of the component.

## Composing with content collections

When a component's job is to render a content collection entry (e.g. a card, a full article body), type its prop with `CollectionEntry`:

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  post: CollectionEntry<'blog'>;
}
const { post } = Astro.props;
---
<h2>{post.data.title}</h2>
```

To render an entry's body content (Markdown/MDX), use `render()` from `astro:content` in the *page*, then pass the resulting `<Content />` down — `render()` is async and needs to run where you have the entry, typically outside small presentational components:

```astro
---
import { getEntry, render } from 'astro:content';
const entry = await getEntry('blog', post.id);
if (!entry) throw new Error('Entry not found');
const { Content } = await render(entry);
---
<Content />
```

## General component design conventions

- **Single responsibility.** Keep presentational components (cards, badges, layout chrome) separate from data-fetching/page-level composition — fetch in pages or thin wrapper components, pass data down as typed props.
- **File naming**: PascalCase filenames matching the component name (e.g. `MyCard.astro`) is the common Astro convention — stay consistent with whatever the project already uses.
- **Default to no client JS.** Reach for a framework component + `client:*` directive only when real interactivity is needed; otherwise a plain `.astro` component (optionally with an inline `<script>`) is faster and simpler.
- **Prefer `<Image />` to `<img>`** for anything in `src/`, and always supply real `alt` text.
- **Use `HTMLAttributes<'tag'>`** when wrapping a native element (links, buttons, inputs) so consumers get the full native attribute set with type-checking, not just the props you thought to add.
- Attributes map directly to prop names when a component is used as an HTML-like tag — camelCase props do work, but keep them attribute-friendly.

## Sources

Based on the official Astro documentation (docs.astro.build), retrieved live: Components & Slots (`/en/basics/astro-components/`), TypeScript & Component Props (`/en/guides/typescript/`), Styles and CSS (`/en/guides/styling/`), Front-end Frameworks / client directives (`/en/guides/framework-components/`, `/en/reference/directives-reference/`), Images (`/en/guides/images/`, `/en/reference/modules/astro-assets/`), and Content Collections (`/en/guides/content-collections/`, `/en/reference/modules/astro-content/`). Re-check these pages if a project is pinned to an older Astro major version, since some APIs here (`ComponentProps`, `inferSize`, live collections) are recent additions.