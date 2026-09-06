---
title: "Square corners, on purpose"
description: "Zeroing every border-radius, and why native form controls fight you on it."
publishDate: 2026-04-01
author: marcus-lin
tags: ["design", "forms"]
heroImage: "./hero.svg"
---

Tailwind's preflight reset does a lot of quiet, sensible things to browser
defaults. Border-radius on native form controls isn't one of them — a
`<button>`, `<input>`, `<select>`, and `<textarea>` all ship with a small,
inconsistent default radius that varies by browser and platform, and no
utility class you apply to the element itself reliably overrides it in
every engine.

## The fix is three lines, not a component

```css
dialog,
select,
input,
textarea,
button {
  border-radius: 0;
}
```

That's the whole fix. It has to live in global CSS, not scoped per
component, because scoped styles in Astro (and most component frameworks)
can't guarantee they run after a browser's own user-agent stylesheet in
every case — a global rule targeting the elements directly is the only
version that's reliable everywhere.

## Why zero, specifically

Square corners aren't a neutral default here — they're load-bearing to the
whole visual language. A hard offset shadow against a rounded corner reads
as a mistake; the same shadow against a square one reads as intentional.
Once corners are square everywhere, the shadow scale, the border weights,
and the flat color fills all reinforce the same idea instead of fighting it.
