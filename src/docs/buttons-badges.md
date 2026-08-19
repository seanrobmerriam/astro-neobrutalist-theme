---
title: Buttons & Badges
description: Button and the three Badge components.
order: 3
---

## Button

`src/components/Button/Button.astro`

Renders an `<a>` when `href` is set, a `<button>` otherwise — or force one explicitly with `as`. Extends `HTMLAttributes<'a'>`, so native attributes (`type`, `disabled`, `aria-*`, `target`, …) all pass through untouched.

| Prop | Type | Default |
|---|---|---|
| `variant` | `primary \| secondary \| outline \| ghost \| borderless \| danger \| success \| warning` | `primary` |
| `size` | `sm \| md \| lg` | `md` |
| `as` | `a \| button` | inferred from `href` |
| `type` | `button \| submit \| reset` | `button` |
| `class` | `string` | — |

```astro
<Button variant="primary" size="lg">Get started</Button>
<Button variant="outline" href="/docs">Read the docs</Button>
<Button variant="danger" type="submit">Delete account</Button>
```

**Choosing a variant:** `primary`/`secondary` for default actions, `outline`/`borderless` for lower emphasis, `ghost` for near-invisible-until-hovered, `danger`/`success`/`warning` for semantic system actions. `borderless` still carries the full shadow and hover/active lift — it just has no visible border.

## Badge

`src/components/Badge/Badge.astro`

A flat, categorical label.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `accent` | `yellow \| pink \| blue \| green \| orange \| lavender` | `blue` |
| `class` | `string` | — |

```astro
<Badge label="New" accent="yellow" />
```

## BadgeDismiss

`src/components/Badge/BadgeDismiss.astro`

A removable chip — useful for active filters or selections.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `class` | `string` | — |

```astro
<BadgeDismiss label="React" />
```

The dismiss button is rendered but not wired to remove the chip from the DOM — that's left to whatever's managing the filter state in a real app.

## BadgeStatus

`src/components/Badge/BadgeStatus.astro`

A dot-plus-label pair for live system or presence state.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `status` | `online \| offline \| busy` | `online` |
| `class` | `string` | — |

```astro
<BadgeStatus label="Operational" status="online" />
```
