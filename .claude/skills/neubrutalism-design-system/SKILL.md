---
name: neubrutalism-design-system
description: Complete neubrutalist (neobrutalism) design reference — color palette, border and shadow tokens, typography pairings, layout rules, component CSS, and accessibility guidance for building loud, high-contrast web UI with thick black borders and hard offset shadows. Use this whenever building, styling, critiquing, or theming a neubrutalist/neobrutalist interface, landing page, or component — or whenever the user mentions hard shadows, zero border-radius, thick black outlines, Syne/Space Grotesk/Space Mono fonts, or asks for that bold, colorful, poster-like web aesthetic, even if they don't say "neubrutalism" explicitly.
---
 
# Neubrutalism Design System
 
Neubrutalism is not a single "look" — it's a repeatable visual grammar that reduces to a small set of tokens and rules: flat categorical color, heavy black borders, hard offset shadows, oversized display type, and grids that look broken but aren't. Use this reference to generate tokens, components, and copy that stay consistent with the style instead of drifting into generic flat design or into visual noise.
 
## Color
 
Neubrutalist color is categorical, not ambient — it carves surfaces into obvious, discrete objects rather than creating atmosphere. Flat fills only, no gradients. The base is a black-and-white structural pairing punctuated by one to three saturated accents.
 
### Reference palette
 
| Hex | Role |
|---|---|
| `#000000` | Black — borders, text, structural ink |
| `#FFFDF5` | Off-white — base background (`--bg`) |
| `#FFD23F` | Yellow — primary accent (`--yellow`) |
| `#FF6B6B` | Pink/coral — accent (`--pink`) |
| `#74B9FF` | Blue — accent, focus states (`--blue`) |
| `#88D498` | Green — accent |
| `#FFA552` | Orange — accent |
| `#BBA9FA` | Lavender — accent |
 
**Do**
- Keep the palette structurally simple even when it reads visually loud: one neutral base + one dark outline color + a handful of accents.
- Ensure body text hits at least 4.5:1 contrast (WCAG AA).
- Use color to carve surfaces into discrete, identifiable objects.
**Don't**
- Use gradients — flat fills are the grammar.
- Let every component compete at maximum saturation.
- Mistake "loud" for accessible — yellow on white, for example, fails contrast.
- Rely on color alone to convey state or meaning.
## Geometry & Borders
 
The signature move is the heavy outline: cards, buttons, inputs, and illustrations read as if stamped, boxed, or screen-printed. The border is both brand signal and structural language, restoring edge clarity in an era of soft cards and low-contrast surfaces. Corners are square — `border-radius: 0` is a defining marker of the style, not an oversight.
 
**Production rule:** use a single canonical stroke width for most components (2–3px is typical), and only deviate intentionally for hierarchy (e.g. a thicker border on a hero section or divider). Treat border-width as a design token. The outline should clarify the object, not overpower its content.
 
## Shadows & Depth
 
Neubrutalist depth is anti-naturalistic. Instead of blurred, atmospheric elevation, it uses hard, offset shadows with zero blur — elements feel stacked, shifted, or physically misregistered, like printed layers that don't quite align. For example: `5px 5px 0 0 #000` for a moderate offset, `10px 10px 0 0 #000` for a much larger one.
 
In production, standardize these offsets into a three-tier system rather than picking offsets ad hoc:
 
| Tier | Value | Use for |
|---|---|---|
| Small | `3px 3px 0 0 #000` | Badges, chips, inline actions |
| Medium | `5px 5px 0 0 #000` | Cards, buttons, panels |
| Large | `8px 8px 0 0 #000` | Overlays, hero elements, focus states |
 
## Typography
 
Neubrutalist typography is assertive contrast: oversized sans-serif display headlines, abrupt scale shifts, and occasional tension elements. The best implementations separate expressive display type from calm, operational body copy.
 
Quick reference:
 
| Role | Face |
|---|---|
| Display | Syne 800 |
| Heading | Space Grotesk 700 |
| Body | Inter 400 |
| Mono | Space Mono 400 |
 
**Do**
- Use an impact face for headlines: grotesque/display sans, high weight, tight tracking.
- Use a utility face for body: highly legible sans, generous line-height.
- Reserve extreme typographic gestures for headlines and CTAs.
- Contrast via scale and weight, not novelty letterforms.
**Don't**
- Make the entire typographic system shout at the same volume.
- Use ornate or decorative fonts — the style is loud in scale, not letterform.
- Sacrifice body readability for aesthetic consistency.
- Ignore line-height and spacing in pursuit of impact.
## Layout
 
Neubrutalist layouts appear "broken," but the good ones aren't random — they run on an underlying grid, then selectively disrupt it through offset modules, asymmetric spacing, and overscaled elements. The operative rule: **broken but not random.**
 
- **Structured disruption:** keep navigation and core reading flows predictable. Allow local "breaks" — offset cards, overlapped panels, rotated elements — to create energy.
- **Macro vs. micro:** use asymmetry at the macro level (heroes, card stacks, illustrations). Keep the micro level mechanically aligned (labels, fields, buttons, error states). Once disruption interferes with comprehension, the design has crossed from expression into sabotage.
## Typeface Library
 
All fonts below are freely available on Google Fonts, organized by role.
 
### Display — poster fonts, hero statements, brand-defining moments
 
| Face | Weights | Style | Why |
|---|---|---|---|
| **Syne** *(flagship pairing)* | 400–800 | Quirky grotesque | Assertive geometry with just enough character to feel designed, not generic |
| Bebas Neue | 400 (single) | Condensed display | Pure poster energy — narrow, impossible to ignore, a classic brutalist choice |
| Archivo Black | 400 (single) | Heavy grotesque | Maximum typographic weight for a headline that physically dominates the page |
 
### Heading — section headers, card titles, navigation
 
| Face | Weights | Style |
|---|---|---|
| **Space Grotesk** *(flagship pairing)* | 300–700 | Geometric sans with quirk |
| Plus Jakarta Sans | 200–800 | Modern geometric, clean warmth |
| Outfit | 100–900 | Round geometric, zero fuss |
 
### Body — the calm counterweight; should be boring on purpose
 
| Face | Weights | Why |
|---|---|---|
| **Inter** *(flagship pairing)* | 100–900 | Designed for screens; the industry-standard utility face |
| DM Sans | 100–1000 | Warmer than Inter with more character; works from body to bold headings |
 
### Monospace — code blocks, labels, tokens, meta information
 
| Face | Weights | Why |
|---|---|---|
| **Space Mono** *(flagship pairing)* | 400, 700 | Geometric, brutalist character; feels mechanical and deliberate |
| JetBrains Mono | 100–800 | Developer favorite; excellent legibility, built-in ligatures |
 
### Recommended pairings
 
**1. Syne / Space Grotesk / Inter / Space Mono** — the flagship stack. Inter keeps body copy calm while everything else shouts; Space Mono carries tokens and labels.
 
**2. Bebas Neue / Plus Jakarta Sans / DM Sans / JetBrains Mono** — condensed display energy softened by DM Sans's warmth; JetBrains Mono for code.
 
**3. Archivo Black / Outfit / Inter / Space Mono** — Inter provides maximum contrast against the heaviest possible display face.
 
## Token System
 
```css
:root {
  /* The border is the main structural signifier */
  --border: 3px solid #000;
  --border-thin: 2px solid #000;
  --border-thick: 4px solid #000;
 
  /* Hard shadows: offset, zero blur, always */
  --shadow-sm: 3px 3px 0 0 #000;
  --shadow: 5px 5px 0 0 #000;
  --shadow-lg: 8px 8px 0 0 #000;
  --shadow-xl: 12px 12px 0 0 #000;
 
  /* Square corners. That's the point. */
  --radius: 0;
 
  /* Palette: neutral base + loud accents */
  --bg: #FFFDF5;
  --yellow: #FFD23F;
  --pink: #FF6B6B;
  --blue: #74B9FF;
}
```
 
### Full token reference
 
| Token | Value | Purpose |
|---|---|---|
| `--border` | `3px solid #000` | Default component border |
| `--border-thin` | `2px solid #000` | Secondary borders, dividers |
| `--border-thick` | `4px solid #000` | Section dividers, hero elements |
| `--shadow-sm` | `3px 3px 0 0 #000` | Badges, chips, small controls |
| `--shadow` | `5px 5px 0 0 #000` | Cards, buttons, panels |
| `--shadow-lg` | `8px 8px 0 0 #000` | Hover states, overlays |
| `--shadow-xl` | `12px 12px 0 0 #000` | Hero elements, dialogs |
| `--radius` | `0` | All components |
 
## Component Reference
 
### Button
 
```css
.btn {
  border: 3px solid #000;
  border-radius: 0;
  background: #FFD23F;
  color: #000;
  box-shadow: 5px 5px 0 0 #000;
  font-weight: 700;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.1s ease;
}
 
.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 0 #000;
}
 
.btn:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}
 
/* Never forget focus */
.btn:focus-visible {
  outline: 3px solid #74B9FF;
  outline-offset: 3px;
}
```
 
### Card
 
```css
.card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 0 #000;
  padding: 1.5rem;
  transition: transform 0.15s, box-shadow 0.15s;
}
 
.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 0 #000;
}
```
 
### Form elements
 
```css
.nb-input {
  padding: 0.75rem 1rem;
  border: 3px solid #000;
  border-radius: 0;
  background: #fff;
  box-shadow: 3px 3px 0 0 #000;
  transition: box-shadow 0.15s, transform 0.15s;
}
 
.nb-input:focus {
  outline: 3px solid #74B9FF;
  outline-offset: 2px;
  box-shadow: 5px 5px 0 0 #000;
  transform: translate(-1px, -1px);
}
```
 
## Accessibility
 
**Where the style helps**
- Large headings and strong edge definition support scanning.
- Clear borders improve control discoverability versus ultra-flat UI.
- A high-contrast palette can exceed WCAG thresholds naturally.
- Hard shadows make interactive elements feel obviously clickable.
**Common failure modes**
- **Contrast failures:** yellow on white, pink on orange, and mid-tone combinations frequently fail WCAG — check every accent pair against its background, not just against black.
- **Color-only state:** using color alone to convey meaning (error, success, selected) violates WCAG 1.4.1.
- **Fake hit areas:** thick borders visually imply a larger target than the actual clickable/tappable area provides — size hit targets independently of border weight.
- **Focus obscured:** decorative hard shadows can visually compete with or hide keyboard focus indicators — always give `:focus-visible` its own explicit treatment (see the button/input examples above).
Test every foreground/background combination against WCAG AA (4.5:1 for body text, 3:1 for large text and UI components) before shipping a palette — neubrutalism's loud combinations don't automatically pass.
 
## Best Practices
 
1. **Separate expression from interaction.** Use neubrutalism aggressively on hero sections, marketing blocks, and editorial modules. Dial it down inside dashboards, forms, and transactional flows.
2. **Tokenize the aesthetic.** Define explicit tokens for stroke widths, shadow offsets, and accent colors. Change the variables, change the intensity, without rebuilding components.
3. **Make "loud" serve hierarchy.** Let backgrounds be weird but keep type systematic and readable. If every object is loud, nothing is legible.
4. **Prove WCAG compliance early.** Palette freedom is where neubrutalist projects fail — enforce contrast ratios during design, not after launch.
5. **Treat borders as semantics.** A border should communicate one of: container, interactive, focus, selected, or error. If it doesn't communicate any of these, remove it.
6. **Reserve the harshest gestures.** One bold border system, one hard-shadow behavior, one loud display scale. The style deteriorates when every component tries to be the poster.
## Background: The Neubrutalist Ecosystem
 
Neubrutalism is a distributed movement with no single founding figure — it was crystallized by an ecosystem of platforms, kit-makers, educators, and open-source libraries, roughly in four layers:
 
1. **Showcase** — designers whose public shots made the style legible and desirable. Dribbble, Behance, and Awwwards galleries served as the initial circulation layer, with work tagged "neobrutalism" clustering through the spring of 2022.
2. **Education** — people and communities who translated the aesthetic into recipes, including Michał Malewicz's widely-read March 2022 essay, UX-publication explainers, and Behance challenge culture, which moved the style from pure inspiration into teachable visual logic.
3. **Productization** — kit makers and marketplace sellers. Dozens of Figma Community kits and WhiteUI's "Bruddle" SaaS kit packaged neubrutalism as reusable infrastructure, sold on Gumroad, ThemeForest, and Awwwards Market.
4. **Implementation** — open-source libraries and developer-facing component systems, such as neobrutalism.dev (Tailwind/React) and neubrutalism-css (vanilla CSS), which converted the style into installable production code.