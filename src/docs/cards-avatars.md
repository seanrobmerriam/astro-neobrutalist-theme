---
title: Cards & Avatars
description: Card, CardMessage, CardStacked, Avatar, and AvatarGroup.
order: 4
---

## Card

`src/components/Card/Card.astro`

The base content container almost everything else in this theme is built on. Renders an `<a>` when `href` is set, making the whole card clickable.

| Prop | Type | Default |
|---|---|---|
| `href` | `string` | — |
| `eyebrow` | `string` | — |
| `title` | `string` | — |
| `description` | `string` | — |
| `accent` | `yellow \| pink \| blue \| green \| orange \| lavender \| none` | `none` |
| `interactive` | `boolean` | `true` |
| `class` | `string` | — |

Two slots: the default slot for arbitrary content, and a named `icon` slot rendered above the title.

```astro
<Card eyebrow="Design" title="Composable by default" description="Pass props, or drop in your own markup." accent="yellow" />

<!-- A static content container — no hover lift, no clickable affordance -->
<Card interactive={false}>
  <form>...</form>
</Card>
```

Set `interactive={false}` for anything that isn't meant to read as clickable — a form wrapper, a stat tile, a settings panel.

## CardMessage

`src/components/Card/CardMessage.astro`

A window-chrome card for system messages or notifications.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | `"System Message"` |
| `title` | `string` | — (required) |
| `message` | `string` | — (required) |
| `class` | `string` | — |

```astro
<CardMessage title="Deploy succeeded" message="Built and deployed in 42 seconds." />
```

## CardStacked

`src/components/Card/CardStacked.astro`

A clickable post/article card with a date.

| Prop | Type | Default |
|---|---|---|
| `date` | `string` (ISO, used as the `<time datetime>`) | — (required) |
| `dateLabel` | `string` (the displayed text) | — (required) |
| `title` | `string` | — (required) |
| `description` | `string` | — (required) |
| `href` | `string` | `"#"` |
| `class` | `string` | — |

```astro
<CardStacked date="2026-08-16" dateLabel="Aug 16, 2026" title="Shipping fast" description="Notes on building a component library in a weekend." />
```

## Avatar

`src/components/Avatar/Avatar.astro`

Falls back to initials (derived from `name`) when no `src` is given.

| Prop | Type | Default |
|---|---|---|
| `src` | `string` | — |
| `alt` | `string` | `""` |
| `name` | `string` (used for initials) | — |
| `size` | `sm \| md \| lg \| xl` | `md` |
| `shape` | `square \| circle` | `square` |
| `accent` | `yellow \| pink \| blue \| green \| orange \| lavender` | `yellow` |
| `class` | `string` | — |

```astro
<Avatar name="Ava Stone" accent="yellow" />
<Avatar name="Priya Anand" size="lg" shape="circle" accent="pink" />
<Avatar src="/team/marcus.jpg" alt="Marcus Lin" />
```

## AvatarGroup

`src/components/Avatar/AvatarGroup.astro`

Overlaps its `Avatar` children with a negative margin and a shadow on each, for a stacked "who's here" look.

| Prop | Type | Default |
|---|---|---|
| `class` | `string` | — |

```astro
<AvatarGroup>
  <Avatar name="Ava Stone" accent="yellow" />
  <Avatar name="Marcus Lin" accent="blue" />
  <Avatar name="+4" accent="green" />
</AvatarGroup>
```
