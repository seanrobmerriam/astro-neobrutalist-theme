---
title: Data Display
description: Table, List, Progress, ProgressStatus, and Alert.
order: 6
---

## Table

`src/components/Table/Table.astro`

Zero client JS. Any cell value can be a plain string, or an object to render it as a color-coded pill.

| Prop | Type | Default |
|---|---|---|
| `columns` | `{ key, label }[]` | — (required) |
| `rows` | `Record<string, string \| { text, tone }>[]` | — (required) |
| `caption` | `string` | — |
| `class` | `string` | — |

`tone` accepts `yellow \| pink \| blue \| green \| orange \| lavender`.

```astro
<Table
  caption="Team members"
  columns={[{ key: "name", label: "Name" }, { key: "status", label: "Status" }]}
  rows={[
    { name: "Ava Stone", status: { text: "Active", tone: "green" } },
    { name: "Theo Brandt", status: { text: "Suspended", tone: "pink" } },
  ]}
/>
```

Rows alternate through three subtle accent tints automatically — no prop needed.

## List

`src/components/List/List.astro`

| Prop | Type | Default |
|---|---|---|
| `items` | `{ text, description? }[]` | — (required) |
| `variant` | `bullet \| check \| cross \| number` | `bullet` |
| `class` | `string` | — |

```astro
<List
  variant="check"
  items={[{ text: "Typed props on every component" }, { text: "Zero client JS unless you opt in" }]}
/>
```

`variant="number"` renders an `<ol>`; every other variant renders a `<ul>`.

## Progress

`src/components/Progress/Progress.astro` — a bare progress bar.

| Prop | Type | Default |
|---|---|---|
| `value` | `number` (0–100) | — (required) |
| `label` | `string` (accessible label only, not displayed) | `"Progress"` |

```astro
<Progress value={45} label="Downloading packages" />
```

## ProgressStatus

`src/components/Progress/ProgressStatus.astro` — a progress bar with a visible label and percentage.

| Prop | Type | Default |
|---|---|---|
| `value` | `number` (0–100) | — (required) |
| `label` | `string` (displayed) | `"Progress"` |

```astro
<ProgressStatus value={80} label="Building theme" />
```

## Alert

`src/components/Alerts/Alert.astro`

| Prop | Type | Default |
|---|---|---|
| `variant` | `info \| success \| warning \| error` | `info` |
| `message` | `string` | — (required) |
| `class` | `string` | — |

```astro
<Alert variant="success" message="Install complete — run npm run dev to preview the theme." />
```
