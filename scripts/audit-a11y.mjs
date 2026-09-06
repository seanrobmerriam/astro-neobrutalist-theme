// Repeatable accessibility + layout audit against a running production
// preview server. Requires `pnpm build && pnpm preview` (or any static
// server) running first, and Playwright's Chromium installed
// (`pnpm exec playwright install chromium`).
//
// Usage: node scripts/audit-a11y.mjs [baseUrl] [path1,path2,...]
// Defaults to http://localhost:4321 and a representative page set.
//
// Checks, per page:
//   - axe-core (WCAG 2.0/2.1 A+AA rules) — 0 violations is the bar.
//   - Heading order — no level skips (h1 -> h3 with no h2, etc).
//   - Horizontal overflow at 320/768/1280px — scrollWidth must not exceed
//     clientWidth. This is what catches "invisible" elements that still
//     reserve layout width (e.g. a broken sr-only utility), which neither
//     axe nor Lighthouse checks for.
//   - Keyboard walk — every Tab stop must show a visible outline or
//     box-shadow; the walk uses a position-based (not content-based)
//     "stuck" signature, since visually-identical sibling components
//     (repeated cards, gallery thumbnails) are not a real trap.

import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PAGES = (process.argv[3] ?? "/,/landing,/blog,/portfolio,/docs,/docs/getting-started,/404").split(",");
const VIEWPORTS = [
  { name: "320px", width: 320, height: 800 },
  { name: "768px", width: 768, height: 900 },
  { name: "1280px", width: 1280, height: 900 },
];

let failed = false;
const browser = await chromium.launch({ args: ["--no-sandbox"] });

// --- axe + heading order (default viewport is fine for both) ---
{
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("=== axe-core + heading order ===");
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });

    const axeResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const headingLevels = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => Number(h.tagName[1])),
    );
    let prevLevel = 0;
    const skips = [];
    for (const level of headingLevels) {
      if (prevLevel > 0 && level > prevLevel + 1) skips.push(`h${prevLevel} -> h${level}`);
      prevLevel = level;
    }

    const ok = axeResults.violations.length === 0 && skips.length === 0;
    if (!ok) failed = true;
    console.log(
      `${path}: ${axeResults.violations.length} axe violations, ${skips.length ? "heading skips: " + skips.join(", ") : "heading order OK"}`,
    );
    if (axeResults.violations.length) {
      for (const v of axeResults.violations)
        console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
    }
  }
  await context.close();
}

// --- horizontal overflow at three viewports ---
console.log("\n=== horizontal overflow ===");
for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const overflow = scrollWidth > clientWidth;
    if (overflow) failed = true;
    console.log(`${viewport.name} ${path}: ${overflow ? `OVERFLOW by ${scrollWidth - clientWidth}px` : "OK"}`);
  }
  await context.close();
}

// --- keyboard walk: every focus stop needs a visible indicator ---
console.log("\n=== keyboard focus visibility ===");
for (const path of PAGES) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const noIndicator = [];
  let lastSignature = null;
  let repeatCount = 0;
  for (let i = 0; i < 400; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 30),
        hasIndicator: (cs.outlineStyle !== "none" && cs.outlineWidth !== "0px") || cs.boxShadow !== "none",
        visible: rect.width > 0 && rect.height > 0,
        signature: `${el.tagName}|${Math.round(rect.x)},${Math.round(rect.y)},${Math.round(rect.width)},${Math.round(rect.height)}`,
      };
    });
    if (!info) break;
    if (info.signature === lastSignature) {
      if (++repeatCount > 2) break;
    } else {
      repeatCount = 0;
    }
    lastSignature = info.signature;
    if (info.visible && !info.hasIndicator) noIndicator.push(info);
  }
  if (noIndicator.length) failed = true;
  console.log(
    `${path}: ${noIndicator.length ? "NO INDICATOR: " + noIndicator.map((s) => `${s.tag}:"${s.text}"`).join(", ") : "all stops OK"}`,
  );
  await context.close();
}

await browser.close();

if (failed) {
  console.log("\nFAIL — see findings above.");
  process.exit(1);
} else {
  console.log("\nAll checks passed.");
}
