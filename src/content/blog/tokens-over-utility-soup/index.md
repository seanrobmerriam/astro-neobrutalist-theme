---
title: "Tokens over utility soup"
description: "How seven CSS variables replaced a hundred one-off Tailwind classes."
publishDate: 2026-03-10
author: sean-merriam
tags: ["design", "tokens"]
heroImage: "./hero.svg"
---

Early components hard-coded their colors: `bg-yellow-200`, `border-black`,
`shadow-[4px_4px_0_0]`. Every one of those is a perfectly valid Tailwind
utility, and every one of them is a dead end the moment someone wants to
change the palette — there's no single place to edit, only every file that
happens to reference that literal value.

## What actually changed

`src/styles/global.css`'s `@theme` block now owns the entire palette: two
structural neutrals (`--color-ink`, `--color-paper`), six categorical
accents, and the shadow scale. Every component references the token —
`bg-yellow`, `border-ink`, `shadow-brutal` — never the literal value behind
it.

## The test that matters

Can you change the entire visual identity of the theme by editing one file?
Before tokens, no — you'd be grepping for hex codes across forty components.
After, `global.css` alone can turn the whole thing from bold-and-flat into
something quieter, without touching a single `.astro` file. That's the bar
a design system should actually be held to, and "did we remember to write
documentation about it" is a distant second.
