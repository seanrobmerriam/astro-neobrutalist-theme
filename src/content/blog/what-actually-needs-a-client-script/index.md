---
title: "What actually needs a client script"
description: "An audit of every <script> tag in the theme, and why most components don't have one."
publishDate: 2026-07-08
author: marcus-lin
tags: ["process", "performance"]
heroImage: "./hero.svg"
---

Forty-some components ship in this theme. Nine of them import a
`<script>` tag. The rest are static HTML, styled with Tailwind, with no
runtime behavior at all — and that ratio wasn't an accident, it was a
question asked of every single component before it shipped: does this
genuinely need JavaScript, or does it just need a native HTML feature
someone forgot exists?

## The native-first checklist

- A disclosure widget (an accordion) doesn't need JS — `<details>` and
  `<summary>` do the job, with keyboard support built in for free.
- A modal doesn't need a focus-trap library — `<dialog>`'s `showModal()`
  traps focus and closes on Escape natively (with one edge case we found
  and patched — see the shared dialog script).
- A tab interface _does_ need a script, because there's no native
  multi-panel-with-one-visible element. That's one of the nine.

## Where the line actually is

The rule that held up: if the interaction can be expressed as a state a
browser already understands — open/closed, checked/unchecked, focused/not
— reach for the element that already knows how to do that. Reach for
`<script>` only when the interaction is genuinely bespoke, and even then,
share one listener across every component that needs the same pattern
(`src/scripts/dialog.ts` backs Modal, Drawer, and Gallery at once) instead
of writing the same wiring three times.
