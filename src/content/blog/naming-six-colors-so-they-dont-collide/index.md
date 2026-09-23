---
title: "Naming six colors so they don't collide"
description: "Categorical, not semantic — why the accent tokens are named yellow, pink, and blue, not primary and success."
publishDate: 2026-08-02
author: sean-merriam
tags: ["design", "tokens"]
heroImage: "./hero.svg"
---

The six accents are named `--color-yellow`, `--color-pink`, `--color-blue`,
`--color-green`, `--color-orange`, and `--color-lavender` — by appearance,
not by role. That was a deliberate choice, and it's the opposite of what
most token systems recommend.

## Why not `--color-primary` / `--color-success`

Semantic names are the right call when a color has exactly one job —
`--color-error` should always mean error, everywhere, forever. But this
theme's accents are used categorically: a pricing card is "featured" in
yellow, a testimonial cycles through all six, a badge takes whichever
accent looks good next to its neighbors. None of that is a semantic role.
Naming yellow `--color-primary` would just be lying about what it's for
the first time someone used yellow on a non-primary element — which is
most of the time, here.

## Where semantic naming still wins

Not every color in the theme is categorical. `Alert`'s four variants
(info/success/warning/error) _do_ have a fixed meaning, so `Alert.astro`
maps each variant to a specific accent internally — `success` always
resolves to green, `error` always resolves to pink — rather than exposing
the raw accent name as a prop. The rule isn't "never use semantic names,"
it's "name the thing that has the fixed meaning, not the palette
underneath it."
