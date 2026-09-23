---
title: "Shipping a full component library in a weekend"
description: "Notes on building buttons, cards, and forms fast without reaching for a UI kit."
publishDate: 2026-06-02
author: sean-merriam
tags: ["process", "components"]
heroImage: "./hero.svg"
---

We didn't start with a design system. We started with a button, because every
page needed one and none of the existing options looked right next to a
6px black border.

## Start with the loudest component

Buttons get touched more than almost anything else in a UI, so they're a
good forcing function for the whole visual language: border weight, shadow
depth, how hover and active states should feel. Once `Button.astro` had a
`variant`/`size` API we were happy with, every other component followed the
same shape — a `Record<Variant, string>` map, not a chain of conditionals.

## Reuse the shadow scale immediately

The three-tier `shadow-brutal-{sm,'',lg}` scale existed before the second
component did. Once it was a token instead of a magic number, every card,
modal, and dropdown could reach for the same three depths without anyone
re-deriving "how many pixels should this shadow be."

## What we'd do differently

Componentize the form primitives earlier — we hand-rolled three slightly
different input styles before consolidating on one `InputForm` with a
`class` override, and untangling that cost more time than building it right
the first time would have.
