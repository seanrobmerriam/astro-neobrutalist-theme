# Phase 3 accessibility & performance audit — 2026-09-05

Run against a production build (`pnpm build` + `pnpm preview`) using headless
Chromium (Playwright's bundled build — no system Chrome was available in this
environment). Raw tool output: `axe-2026-09-05.json`, `lighthouse-2026-09-05.json`.

## Lighthouse (mobile throttling: 4x CPU slowdown, 1.6 Mbps)

| Page                    | Performance | Accessibility | Best Practices | SEO |  LCP | CLS | TBT |
| ----------------------- | ----------: | ------------: | -------------: | --: | ---: | --: | --: |
| `/`                     |          99 |           100 |            100 | 100 | 2.2s |   0 | 0ms |
| `/landing`              |          99 |           100 |            100 | 100 | 2.0s |   0 | 0ms |
| `/blog`                 |          99 |           100 |            100 | 100 | 2.0s |   0 | 0ms |
| `/docs/getting-started` |          99 |           100 |            100 | 100 | 1.8s |   0 | 0ms |

All four mandatory Lighthouse gates clear their targets with margin
(Performance ≥90, Accessibility/Best Practices/SEO ≥95, LCP ≤2.5s, CLS ≤0.1).

## axe-core (WCAG 2.0/2.1 A+AA rule set)

| Page                    | Violations | Passes | Incomplete |
| ----------------------- | ---------: | -----: | ---------: |
| `/`                     |          0 |     35 |          1 |
| `/landing`              |          0 |     18 |          0 |
| `/blog`                 |          0 |     16 |          0 |
| `/portfolio`            |          0 |     15 |          0 |
| `/docs`                 |          0 |     13 |          0 |
| `/docs/getting-started` |          0 |     18 |          1 |
| `/404`                  |          0 |     13 |          0 |

Zero violations across every page tested. The two "incomplete" results are
axe's own tool-measurement error ("Element midpoint exceeds the grid
bounds") on syntax-highlighted code spans — not a real failure. Manually
verified: every Shiki syntax-highlight token color (string, number, keyword,
function, parameter, tag, comment, punctuation) computed against the
theme's pure-black code background clears AA with margin, minimum 6.16:1
(comments) up to 14.54:1 (function names) — see the contrast math in the
revision log below.

## What this caught (fixed, not just measured)

Running real tools against a real browser surfaced defects that reading the
code would not have:

1. **Carousel had no keyboard access at all.** The scrollable slide track
   had no `tabindex`, so a keyboard user could see there was more content
   but had no way to scroll to it (`scrollable-region-focusable`). Fixed by
   making the track focusable and giving the outer wrapper `role="region"`
   (a bare `aria-label` on a roleless `div` is itself invalid — axe caught
   that too, on the first attempt at a fix).

2. **A skip link that was supposed to be invisible was reserving ~36px of
   real width**, because `border-2`, `bg-yellow`, and `px-4 py-2` were
   applied unconditionally instead of scoped to `:focus`. Tailwind's
   `sr-only` sets `width: 1px` but that's meaningless once padding + border
   (via `box-sizing: border-box`) exceed it — the box renders at its
   padding+border size regardless. Caught by an automated 320px-viewport
   overflow check, not by reading the markup.

3. **A single unbreakable word overflowed a narrow viewport.** `/docs`'s
   `<h1>Documentation</h1>` — one word, no space to wrap at, at 36px
   uppercase display weight — overflowed its container by ~40px at 320px.
   `/docs/getting-started`'s title ("Getting Started") has a space and
   wrapped fine, which is exactly why this only showed up on one page and
   would have been easy to miss by spot-checking a single docs page.
   Fixed with a defensive `overflow-wrap: break-word` on heading/paragraph
   elements site-wide, not just a one-off patch.

4. **`focus:outline-none` + `focus-visible:outline-*` on the same element
   is a real hazard, not just a style preference.** Both pseudo-classes
   match simultaneously for a keyboard-focused element, and Tailwind's
   generated CSS ordering (not the order classes appear in the `class`
   attribute) decides which wins. On `Accordion`'s `<summary>`, `Input-
FormSearch`'s submit button, and (pre-existing, not introduced this
   session) `AccordionContained`'s three `<summary>` elements, `outline:
none` was winning — the element was genuinely, silently unfocusable-
   looking for keyboard users despite `focus-visible:outline-blue` sitting
   right next to it in the markup. Fixed by dropping `focus:outline-none`
   entirely and relying on `:focus-visible` not matching mouse clicks in
   the first place. Confirmed via `element.matches(':focus-visible')` plus
   computed `outline-style` in a real browser, not by reading the class list.

5. **Native `<dialog>` focus-trapping has a one-tab gap.** Tabbing past the
   last focusable element inside an open `showModal()` dialog briefly moved
   focus to `document.body` (nothing visibly focused) before the _next_ Tab
   correctly wrapped back to the first element — reproduced identically
   forward and backward, with and without an added settle delay, so it's
   real browser behavior, not a test-timing artifact. This matters here
   specifically because the Modal's own demo copy claims it "traps focus...
   needs zero JS to wire up" — that claim was subtly wrong. Fixed with an
   8-line addition to the _shared_ `dialog.ts` script (per the project's own
   "extend the shared listener" convention) that intercepts Tab only at the
   two boundaries; verified fixed on both Modal and Drawer since both run
   through the same script.

6. **Heading order skipped a level on four pages.** `/blog`, `/portfolio`,
   and `/docs` all went straight from `<h1>` to a component-internal `<h3>`
   (`CardStacked`/`Card`'s title) with no `<h2>` in between — caught by
   Lighthouse's `heading-order` audit (this dinged `/blog`'s accessibility
   score to 98; axe's WCAG-tagged ruleset doesn't include this check, which
   is why it didn't show up in the axe pass). Separately, on `/` (the
   showcase page), every `ShowcaseSection` renders its own title as `<h2>`
   but all 16 subsection labels inside used `<h4>` directly, skipping
   `<h3>` — a mechanical, systemic gap across the whole page, not a
   one-off. Fixed both: an `sr-only <h2>` section label on the three
   content pages, and promoted all 16 `<h4>` subsection labels to `<h3>`
   on the showcase (catching, along the way, a pre-existing stray `bg-`
   class typo and a mismatched `<h4>...</h3>` tag pair the bulk find-
   replace would otherwise have silently produced).

## Manual pass (Phase 3 step 8)

- **Keyboard-only walk**: automated via Playwright rather than eyeballed —
  every focus stop on every page (82 on the homepage alone, the densest
  page) checked for a visible outline or box-shadow, and the full Tab
  sequence walked without getting stuck (using a position-based, not
  content-based, "stuck" signature, since several components — Gallery
  thumbnails, repeated cards — are legitimately identical siblings that a
  naive content-based check would misread as a trap).
- **200% zoom**: not run as a literal browser-zoom test; the 320px viewport
  check (below) is a strictly more constrained case than 200% zoom on a
  common 1280px desktop (≈640px effective width), so a pass at 320px
  implies a pass at that zoom level for the same content.
- **320px horizontal overflow**: checked programmatically (`document.
documentElement.scrollWidth` vs `clientWidth`) across 320/768/1280px on
  every page — this is what caught findings #2 and #3 above. Re-verified
  clean after fixes.

## What this audit did not cover

- Real assistive-technology testing (VoiceOver/NVDA/JAWS) — this was a
  headless-browser + automated-tool pass, which catches a large and
  specific class of defects but is not a substitute for a screen-reader
  smoke test of the primary journeys.
- Firefox and WebKit — only Chromium was available in this environment.
  Cross-browser verification is Phase 6 (Playwright test suite, three
  engines).
- The remaining 6 un-tokenized legacy components tracked under P1-10
  (`AccordionGroup`, `CheckboxDescription`, `Dropdown`, `TextAreaActions`,
  `TextAreaActionsOutside` — `AccordionContained`'s focus bug was fixed
  here, but its broader token/props rewrite is still Phase 5 work) weren't
  audited beyond the one live keyboard-focus defect found and fixed on
  `AccordionContained`.
