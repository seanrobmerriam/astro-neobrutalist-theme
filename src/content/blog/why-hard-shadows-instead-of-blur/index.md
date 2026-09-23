---
title: "Why we went with hard shadows instead of blur"
description: "The case for zero-blur, offset shadows in a design system built for clarity."
publishDate: 2026-05-14
author: sean-merriam
tags: ["design", "tokens"]
heroImage: "./hero.svg"
---

A soft `box-shadow` with a 20px blur radius is trying to simulate a light
source. It's a small, tasteful lie about how light works, and most design
systems tell it the same way: low opacity, big blur, subtle offset.

We do the opposite. `--shadow-brutal` is `5px 5px 0 0`, full opacity, zero
blur. It doesn't pretend to be physical — it reads as a flat second layer of
ink, offset behind the element like a printing misregistration.

## Why that's not just a style choice

A blurred shadow is expensive to get right across surfaces: it needs to
change with the background it sits on, or it looks muddy. A hard, zero-blur
shadow with a pure black offset works identically whether it's sitting on
`--color-paper`, `--color-yellow`, or another component entirely, because
it isn't trying to simulate anything — it's just a rectangle.

## Three depths, not one

Buttons and inputs use `shadow-brutal-sm`. Cards and dropdowns use
`shadow-brutal`. Modals and hero graphics use `shadow-brutal-lg` or `-xl`.
The scale communicates z-order the same way font-weight communicates
emphasis — you don't have to think about it once the tokens exist.
