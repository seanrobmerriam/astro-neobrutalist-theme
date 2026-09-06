// Repeatable Lighthouse audit (mobile throttling) against a running
// production preview server. Requires `pnpm build && pnpm preview` running
// first.
//
// Usage: node scripts/audit-lighthouse.mjs [baseUrl] [path1,path2,...]
//
// Needs a Chromium binary. Tries, in order: $CHROME_PATH, a system Chrome/
// Chromium, then Playwright's bundled Chromium (requires
// `pnpm exec playwright install chromium` — this is what CI without a
// system browser should use).

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PAGES = (process.argv[3] ?? "/,/landing,/blog,/docs/getting-started").split(",");

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    // getInstallations() throws (rather than returning []) when it can't
    // find Chrome at any of its known system paths — which is the normal
    // case on a machine that only has Playwright's own downloaded browser.
    // This must be caught here, not left to propagate, or the Playwright-
    // cache fallback below is unreachable.
    const installations = chromeLauncher.Launcher.getInstallations();
    if (installations.length) return installations[0];
  } catch {
    // fall through to the Playwright cache
  }
  try {
    // Playwright's cache layout: ~/.cache/ms-playwright/chromium-<rev>/chrome-linux64/chrome
    const cacheDir = `${process.env.HOME}/.cache/ms-playwright`;
    const rev = fs.readdirSync(cacheDir).find((d) => d.startsWith("chromium-") && !d.includes("headless_shell"));
    if (rev) return `${cacheDir}/${rev}/chrome-linux64/chrome`;
  } catch {
    // fall through
  }
  throw new Error("No Chrome/Chromium found. Set CHROME_PATH, or run `pnpm exec playwright install chromium`.");
}

const chrome = await chromeLauncher.launch({
  chromePath: findChrome(),
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const TARGETS = { performance: 90, accessibility: 95, "best-practices": 95, seo: 95 };
let failed = false;
const results = {};

for (const path of PAGES) {
  const { lhr } = await lighthouse(BASE + path, {
    port: chrome.port,
    output: "json",
    onlyCategories: Object.keys(TARGETS),
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2, disabled: false },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  });

  const scores = Object.fromEntries(Object.keys(TARGETS).map((k) => [k, Math.round(lhr.categories[k].score * 100)]));
  results[path] = {
    scores,
    LCP: lhr.audits["largest-contentful-paint"]?.numericValue,
    CLS: lhr.audits["cumulative-layout-shift"]?.numericValue,
  };

  const misses = Object.entries(TARGETS).filter(([k, min]) => scores[k] < min);
  if (misses.length) failed = true;

  console.log(
    `${path}: ${Object.entries(scores)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ")} — LCP=${Math.round(results[path].LCP)}ms CLS=${results[path].CLS?.toFixed(3)}`,
  );
  for (const [k, min] of misses) console.log(`  MISS: ${k} scored ${scores[k]}, needed >=${min}`);
}

chrome.kill();

const outPath = `docs/audits/lighthouse-${new Date().toISOString().slice(0, 10)}.json`;
fs.mkdirSync("docs/audits", { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nWrote ${outPath}`);

if (failed) {
  console.log("FAIL — see MISS lines above.");
  process.exit(1);
}
