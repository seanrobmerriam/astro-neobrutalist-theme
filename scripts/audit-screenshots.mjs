// One-off visual capture helper for manual S/M/L review — not part of the
// repeatable audit suite (that's audit-a11y.mjs / audit-lighthouse.mjs).
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4321";
const OUT = process.argv[3] ?? "/tmp/screenshots";
const pages = (process.argv[4] ?? "/,/landing,/docs").split(",");
const viewports = {
  small: { width: 375, height: 900 },
  medium: { width: 768, height: 1000 },
  large: { width: 1440, height: 1000 },
};

const browser = await chromium.launch({ args: ["--no-sandbox"] });
for (const [name, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  for (const path of pages) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const safeName = path === "/" ? "home" : path.replace(/\//g, "_");
    await page.screenshot({ path: `${OUT}/${safeName}-${name}.png`, fullPage: true });
    console.log(`${OUT}/${safeName}-${name}.png`);
  }
  await context.close();
}
await browser.close();
