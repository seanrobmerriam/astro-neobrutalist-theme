import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// One representative page per distinct template/page-type in the theme —
// this is a CI gate on the templates, not a re-run of every route.
// `bun run audit:a11y` covers every actual route (including generated ones)
// and additional checks (overflow, keyboard walk) this suite doesn't.
const pageTypes: [name: string, path: string][] = [
  ["kitchen-sink showcase", "/"],
  ["marketing landing", "/landing"],
  ["simple content page", "/about"],
  ["collection-driven grid (team)", "/team"],
  ["form page", "/contact"],
  ["pricing table", "/pricing"],
  ["long-form prose", "/privacy"],
  ["search UI", "/search"],
  ["blog listing", "/blog"],
  ["blog post detail", "/blog/square-corners-on-purpose"],
  ["blog tag archive", "/blog/tags/forms"],
  ["author profile", "/authors/ava-stone"],
  ["portfolio grid", "/portfolio"],
  ["docs article", "/docs/getting-started"],
  ["error page", "/404"],
];

for (const [name, path] of pageTypes) {
  test(`${name} (${path}) has no serious/critical axe violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
