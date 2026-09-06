---
title: Content
description: The blog, authors, and portfolio content collections — schemas, frontmatter, images, drafts, and a CMS pathway.
order: 11
---

The blog, portfolio, and this documentation are all backed by [Astro
content collections](https://docs.astro.build/en/guides/content-collections/),
defined in `src/content.config.ts`. Four collections exist: `docs`, `blog`,
`authors`, and `projects`.

## Blog

Each post lives in its own folder under `src/content/blog/<slug>/`, with an
`index.md` and (conventionally) a `hero.svg` or `hero.jpg` alongside it:

```
src/content/blog/my-post-slug/
├── index.md
└── hero.jpg
```

Frontmatter schema:

| Field         | Type                   | Required | Notes                                                        |
| ------------- | ---------------------- | -------- | ------------------------------------------------------------ |
| `title`       | string                 | yes      |                                                              |
| `description` | string                 | yes      | Used in listings and page `<meta description>`.              |
| `publishDate` | date                   | yes      | Any format `z.coerce.date()` accepts, e.g. `2026-06-02`.     |
| `updatedDate` | date                   | no       |                                                              |
| `author`      | reference to `authors` | yes      | The author's filename without extension, e.g. `ava-stone`.   |
| `tags`        | string array           | no       | Defaults to `[]`. Powers `/blog/tags/[tag]`.                 |
| `heroImage`   | image                  | yes      | A path relative to the post's own folder, e.g. `./hero.jpg`. |
| `draft`       | boolean                | no       | Defaults to `false`. See **Drafts** below.                   |

Body content is standard Markdown, rendered through the shared `.prose`
class (`src/styles/global.css`) — the same styling used for the docs pages
you're reading now.

## Authors

One JSON file per author under `src/data/authors/`:

```json
{
  "name": "Ava Stone",
  "role": "Design Lead",
  "bio": "One or two sentences."
}
```

The filename (minus `.json`) is the id a post's `author` field references.
Each author automatically gets a profile page at `/authors/<id>` listing
their published posts.

## Projects (portfolio)

One JSON file per project under `src/data/projects/`:

```json
{
  "title": "Ledger — expense tracking",
  "eyebrow": "Web App",
  "description": "A dashboard for freelancers to track invoices and expenses.",
  "accent": "yellow",
  "order": 1
}
```

`accent` must be one of the six theme accents (`yellow`, `pink`, `blue`,
`green`, `orange`, `lavender`). `/portfolio` reads this collection directly
and sorts by `order`.

## Drafts

Set `draft: true` on a post to keep working on it without publishing it.
Drafts are visible in `pnpm dev` (so you can preview them) and excluded
everywhere in a production build — the listing, tag pages, author pages,
the RSS feed, and the sitemap. This is centralized in `src/lib/blog.ts`'s
`getPublishedPosts()`, which every blog route calls instead of
`getCollection("blog")` directly — if you add a new blog route, use that
helper too, or drafts will leak into it.

## Empty collections

The site builds successfully with zero entries in any collection — the
blog listing, portfolio, and RSS feed all render a plain "nothing here yet"
message instead of an empty grid or crashing. Tag and author pages simply
don't generate any routes if there's nothing to show.

## Dates

Use `src/lib/format-date.ts`'s `formatDate()` for any date you display —
it forces UTC when formatting, which matters because a bare frontmatter
date like `2026-08-02` parses as UTC midnight, and formatting that in a
build machine's _local_ timezone can silently shift the displayed date
back a day. Every date shown on the site should go through this function.

## Connecting a headless CMS

Nothing here is hard-wired to the filesystem. Astro's content collections
support [remote loaders](https://docs.astro.build/en/reference/content-loader-reference/)
in addition to the local `glob()` loader used here — to move `blog` to a
CMS (Contentful, Sanity, a headless WordPress, a Git-based CMS like Keystatic
or Tina), replace that one collection's `loader` in `src/content.config.ts`
with the CMS's loader (or a small custom one that fetches and returns
matching shapes), while keeping the same `schema`. Every page in
`src/pages/blog/` and `src/pages/authors/` queries the collection through
`getCollection()`/`getEntry()` and would need no changes at all.
