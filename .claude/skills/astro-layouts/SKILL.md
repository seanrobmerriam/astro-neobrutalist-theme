---
name: astro-layouts
description: Best practices and current API reference for building Astro layout components (.astro files in src/layouts/) — page shells, slots, nesting layouts, Markdown/MDX layout frontmatter, typed layout props, SEO/head patterns, and adding the ClientRouter for view transitions. Use when creating, reviewing, or refactoring an Astro layout, or when asked about layout structure, nesting layouts, Markdown layout frontmatter, or shared <head> content.
---

# Building Astro Layouts

A **layout** is just an Astro component (`.astro`) used by convention to provide reusable UI structure — headers, nav, footers, and (usually) the `<html>`/`<head>`/`<body>` page shell — that other pages wrap themselves in via a `<slot />`. There is nothing structurally special about a layout component: it accepts props, imports other components, can include framework islands and client scripts, exactly like any other `.astro` component. Conventionally placed in `src/layouts/`, but that's organizational only — layouts can even be colocated with pages by prefixing the filename with `_` so Astro excludes it from routing.

**If** a layout does contain the page shell, its `<html>` element must be the parent of everything else in the component.

## Basic layout

```astro
---
// src/layouts/MySiteLayout.astro
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <BaseHead title={title} />
  </head>
  <body>
    <nav>
      <a href="#">Home</a>
      <a href="#">Posts</a>
    </nav>
    <h1>{title}</h1>
    <article>
      <slot /> <!-- page content is injected here -->
    </article>
    <Footer />
  </body>
</html>
```

Used from a page:

```astro
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout title="Home Page">
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

## Typed props

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
```

Standard Astro component prop typing applies (optional props with `?`, defaults on destructure, `HTMLAttributes`, `ComponentProps`, etc.) — layouts aren't special here.

## Nesting layouts

Break a big layout into smaller composable ones instead of one monolith. A common split: a page-type-specific layout (e.g. blog post title/author/date styling) wraps a site-wide base layout (nav, footer, global SEO/meta, fonts). Pass props straight through to the inner layout like any nested component.

```astro
---
// src/layouts/BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
const { frontmatter } = Astro.props;
---
<BaseLayout url={frontmatter.url}>
  <h1>{frontmatter.title}</h1>
  <h2>Post author: {frontmatter.author}</h2>
  <slot />
</BaseLayout>
```

## Markdown layouts (individual `.md` pages in `src/pages/`)

For standalone Markdown files routed via `src/pages/`, a special `layout` frontmatter property points at the `.astro` component to wrap the page in. **This only applies to file-based Markdown pages — it is not recognized when using content collections** (for collections, import and wrap manually instead; see below).

```md
---
layout: ../layouts/BlogPostLayout.astro
title: "Hello, World!"
author: "Matthew Phillips"
date: "09 Aug 2022"
---
All frontmatter properties are available as props to the layout.
```

```astro
---
// src/layouts/BlogPostLayout.astro
const { frontmatter } = Astro.props;
---
<html>
  <head>
    <meta charset="utf-8">
    <title>{frontmatter.title}</title>
  </head>
  <body>
    <h1>{frontmatter.title} by {frontmatter.author}</h1>
    <slot /> <!-- rendered Markdown HTML goes here -->
    <p>Written on: {frontmatter.date}</p>
  </body>
</html>
```

Markdown layouts receive via `Astro.props`: `frontmatter` (all frontmatter, plus nested `frontmatter.file`/`frontmatter.url`), top-level `file` and `url`, `headings` (`{ depth, slug, text }[]`), `rawContent()`, and `compiledContent()`.

Type these props with the `MarkdownLayoutProps` helper:

```astro
---
import type { MarkdownLayoutProps } from 'astro';
type Props = MarkdownLayoutProps<{
  title: string;
  author: string;
  date: string;
}>;
const { frontmatter, url } = Astro.props;
---
```

For MDX, the same `layout` frontmatter property works and additionally passes `headings`. If you need to pass data that isn't in frontmatter, import the layout manually as a component instead and pass props directly — in that case you must add `<meta charset="utf-8">` yourself, since Astro no longer adds it automatically.

## Content collections: wrap manually (no `layout` frontmatter)

Content collection entries don't support the `layout` frontmatter shortcut. Import the layout in the page and wrap the rendered `<Content />`:

```astro
---
// src/pages/blog/[id].astro
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { id: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogPostLayout frontmatter={post.data}>
  <Content />
</BlogPostLayout>
```

Type the entry prop with `CollectionEntry<'collectionName'>` for full type safety on `post.data`.

## Shared `<head>` / SEO pattern

Astro's config isn't used for meta tags — write standard `<link>`/`<meta>` tags in the layout, same as plain HTML. The common pattern is a dedicated `<Head />` (or `<BaseHead />`) component, included once inside your base layout so every page gets it:

```astro
---
// src/components/Head.astro
import Favicon from '../assets/Favicon.astro';

const { title = 'My Astro Website', description } = Astro.props;
---
<link rel="sitemap" href="/sitemap-index.xml">
<title>{title}</title>
<meta name="description" content={description}>

<!-- Open Graph tags -->
<meta property="og:title" content={title} />
<meta property="og:type" content="website" />
<meta property="og:description" content={description} />

<Favicon />
```

```astro
---
// src/layouts/MainLayout.astro
import Head from '../components/Head.astro';
const { title, description, ...props } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8">
    <Head title={title} description={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Canonical URLs** are built from `Astro.url` (not the removed `Astro.canonicalURL`), combined with `Astro.site` (which you should set in `astro.config.mjs`):

```astro
---
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const socialImageURL = new URL('/images/preview.png', Astro.url);
---
<link rel="canonical" href={canonicalURL} />
<meta property="og:image" content={socialImageURL} />
```

## View transitions / client-side routing

To enable Astro's `<ClientRouter />` (client-side navigation + animated transitions) site-wide, import it once into your shared `<head>` component/layout — no other configuration needed:

```astro
---
import { ClientRouter } from 'astro:transitions';
const { title, description } = Astro.props;
---
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="generator" content={Astro.generator} />
<title>{title}</title>
<meta name="description" content={description} />
<ClientRouter />
```

Notes worth knowing when it lives in a layout:
- Always include a real `<title>` per page — the router's accessibility announcer prefers it (falls back to the first `<h1>`, then the pathname).
- `fallback="animate" | "swap" | "none"` controls behavior in browsers without native View Transition support.
- Scripts may not re-run on client-side navigation the way they do on a full reload; use the `astro:page-load` / `astro:after-swap` lifecycle events (or `data-astro-rerun` on inline scripts) rather than `DOMContentLoaded` for anything that must run on every navigation.
- Individual `<a>`/`<form>` tags can opt out of client routing with `data-astro-reload`.

## Layout design conventions

- **A layout should own the page shell and shared chrome (nav, footer, `<head>`) once** — pages should delete anything now handled by the layout rather than duplicating it.
- **Keep page-specific `<style>` scoped to the page**, not the layout, unless it's genuinely shared; use `<style is:global>` sparingly and only in the layout for truly site-wide rules.
- **Prefer composition over one giant layout.** Split a base shell layout from content-type-specific layouts (blog post, docs page, landing page) and nest them.
- **Layouts are still just components** — they can accept typed props, render framework islands with `client:*` directives, and use everything else covered in the Astro components skill (slots, scoped styles, `class:list`, etc.).
- **Set `site` in `astro.config.mjs`** as soon as canonical URLs, sitemaps, or `og:` tags matter — `Astro.site` is `undefined` otherwise.

## Sources

Based on the official Astro documentation (docs.astro.build), retrieved live: Layouts (`/en/basics/layouts/`), Markdown Layouts & `MarkdownLayoutProps` (same page), Content Collections rendering (`/en/guides/content-collections/`, `/en/reference/modules/astro-content/`), Configuration overview / site metadata pattern (`/en/guides/configuring-astro/`), `Astro.url`/canonical URLs (`/en/reference/api-reference/`), and View Transitions / `<ClientRouter />` (`/en/guides/view-transitions/`, `/en/reference/modules/astro-transitions/`). Re-check these if the project is pinned to an Astro major version older than 5, since `render()`, `<ClientRouter />` (renamed from `<ViewTransitions />`), and some content collection APIs are recent.