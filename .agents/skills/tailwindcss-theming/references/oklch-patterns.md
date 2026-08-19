# Building OKLCH color ramps

## Why OKLCH

`oklch(L C H)` — Lightness (0–1 or 0%–100%), Chroma (roughly 0–0.4, saturation-like), Hue (0–360°, degrees). Unlike HSL, OKLCH lightness is *perceptually* uniform: `oklch(0.7 ...)` looks equally bright regardless of hue, so a `-500` step in a blue scale and a `-500` step in a red scale read as the same "weight." That's what makes Tailwind's own default palette (and any custom scale built the same way) feel consistent across colors. Building a scale in hex or HSL and eyeballing it tends to produce steps that don't feel evenly spaced — some hues (yellow, green) look artificially bright at the same raw lightness value as others (blue, purple).

## The 50–950 ramp shape

A Tailwind-style scale has 11 steps: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. The general shape, independent of hue:

- **Lightness** falls roughly monotonically from ~0.97–0.99 at `50` down to ~0.12–0.15 at `950`. It's not linear — steps get closer together in the middle of the scale (400–700) where most UI usage concentrates, and spread out more at the extremes.
- **Chroma** follows an arch: low at `50` (near-white, so it must desaturate or it looks pastel-neon), rises to a peak somewhere around `400–600` (the most "colorful" steps — this is usually where your brand/accent color itself sits), then falls again toward `950` (very dark colors need less chroma or they look muddy/oversaturated instead of "deep").
- **Hue** stays roughly constant across the ramp, maybe drifting a few degrees at the extremes to correct for how hue perception shifts at very high/low lightness (this is a refinement, not a requirement for a first pass).

A reasonable starting heuristic if you don't have exact numbers to match:

| Step | Lightness | Chroma (relative to peak) | Notes |
|---|---|---|---|
| 50 | 0.97–0.99 | ~10–15% of peak | near-white, just a tint |
| 100 | 0.94–0.96 | ~20% | |
| 200 | 0.88–0.92 | ~35% | |
| 300 | 0.80–0.85 | ~55% | |
| 400 | 0.70–0.75 | ~80% | |
| 500 | 0.60–0.65 | **100% (peak)** | this is usually "the" brand color |
| 600 | 0.52–0.58 | ~95% | |
| 700 | 0.45–0.50 | ~85% | |
| 800 | 0.36–0.40 | ~70% | |
| 900 | 0.28–0.32 | ~55% | |
| 950 | 0.15–0.20 | ~35% | near-black, just a shade |

## Worked example: a "brand teal" scale

Say the brief is a brand color around teal, hue ≈ 195°, with a punchy but not neon feel (peak chroma ≈ 0.14):

```css
@theme {
  --color-brand-50:  oklch(0.98 0.02 195);
  --color-brand-100: oklch(0.95 0.03 195);
  --color-brand-200: oklch(0.90 0.05 195);
  --color-brand-300: oklch(0.82 0.08 195);
  --color-brand-400: oklch(0.72 0.11 195);
  --color-brand-500: oklch(0.62 0.14 195); /* peak chroma, the "base" brand color */
  --color-brand-600: oklch(0.54 0.135 195);
  --color-brand-700: oklch(0.47 0.12 195);
  --color-brand-800: oklch(0.38 0.10 195);
  --color-brand-900: oklch(0.30 0.08 195);
  --color-brand-950: oklch(0.18 0.05 195);
}
```

If the brief gives you a literal starting color (hex or an existing brand swatch), convert it to OKLCH first (any color picker with OKLCH support, or a quick script with a color library) to get your target hue and approximate peak chroma/lightness, then place that value at whichever step it naturally falls in (often 500 or 600) and generate the rest of the ramp around it using the table above.

## Contrast pairing notes

- For "colored text on white/near-white surface," steps 600–800 are usually the safe range for body-text-level contrast (~4.5:1 WCAG AA). Step 500 is often borderline — fine for large text/UI elements, risky for small body text.
- For "colored text on a dark surface," steps 200–400 usually work.
- Don't assume — if the brief has an explicit accessibility bar, check actual contrast (e.g. via a contrast checker) rather than relying on the heuristic ranges above, since chroma and hue both shift perceived contrast independent of raw lightness.
- Neutral/gray scales matter as much as the brand color — most UI text and surfaces are neutral, not brand-colored. Give the neutral scale a slight chroma (~0.005–0.02) tinted toward the brand or a cool/warm direction rather than pure gray (chroma 0) — pure grays often read as lifeless next to a saturated brand color.

## Semantic colors (success/warning/danger)

Don't just grab Tailwind's stock green/amber/red — run them through the same ramp process so their peak lightness/chroma matches the rest of your custom scales, or they'll visually clash (e.g. a punchy custom brand teal next to Tailwind's stock desaturated default red).