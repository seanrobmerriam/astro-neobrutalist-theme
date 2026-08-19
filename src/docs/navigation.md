---
title: Navigation
description: Tabs, Accordion, and AccordionContained.
order: 8
---

## Tabs

`src/components/Tab/Tabs.astro`

A real, functional tab set — clicking a tab swaps the visible panel and updates `aria-selected`/`hidden` accordingly, via a small vanilla-JS click handler (no framework, no hydration directive needed).

| Prop | Type | Default |
|---|---|---|
| `tabs` | `{ label, content }[]` | — (required) |
| `label` | `string` (accessible label for the tablist) | `"Tabs"` |
| `class` | `string` | — |

```astro
<Tabs
  tabs={[
    { label: "Profile", content: "Every component accepts typed props." },
    { label: "Account", content: "No client framework required for the tab switching." },
    { label: "Notifications", content: "Panels are hidden with the native hidden attribute." },
  ]}
/>
```

Each tab's `content` is plain text — for richer panel content, render your own markup and manage visibility manually rather than reaching for this component.

## Accordion & AccordionContained

`src/components/Accordion/Accordion.astro` and `AccordionContained.astro` are static, content-authored components (no props) built on native `<details>`/`<summary>` — the browser handles the open/close toggling for free, no JavaScript at all. `AccordionContained` differs only in visual treatment: one continuous bordered box instead of separately-shadowed rows.

```astro
<Accordion />
<AccordionContained />
```

Since these ship with real content baked in, treat them as a starting template: copy the file, edit the questions and answers directly in the markup. There's no prop API to extend — that's a deliberate tradeoff for content that's meant to be hand-authored per page rather than data-driven.
