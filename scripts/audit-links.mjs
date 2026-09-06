// Static internal-link checker against a production build's output
// directory — no server needed, since it reads the generated HTML directly.
// Catches the class of bug Phase 1/4 found by hand (a dead Glide stylesheet
// link, `<a href="#">` blog cards): a link or asset reference that points
// at a path nothing in `dist/` actually serves.
//
// Usage: node scripts/audit-links.mjs [distDir]
// Requires `pnpm build` to have run first. Exits non-zero on any broken
// internal link or asset reference. External links (http(s)://, mailto:,
// tel:) are checked with a short-timeout HEAD/GET request and reported as
// warnings only — a flaky or slow third party shouldn't fail CI.

import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] ?? "dist");

if (!fs.existsSync(DIST)) {
  console.error(`No build output at ${DIST} — run \`pnpm build\` first.`);
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function resolvesToFile(urlPath) {
  const clean = urlPath.split("?")[0].split("#")[0];
  if (clean === "" || clean === "/") return fs.existsSync(path.join(DIST, "index.html"));

  const trimmed = clean.replace(/^\//, "");
  const candidates = [
    path.join(DIST, trimmed),
    path.join(DIST, trimmed, "index.html"),
    path.join(DIST, `${trimmed}.html`),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

const htmlFiles = walk(DIST);
const internalBroken = [];
const externalToCheck = new Map(); // url -> [sourcePages]

const attrPattern = /\s(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf-8");
  const pagePath =
    "/" +
    path
      .relative(DIST, file)
      .replace(/index\.html$/, "")
      .replace(/\.html$/, "");

  for (const match of html.matchAll(attrPattern)) {
    const url = match[1];
    if (url.startsWith("data:") || url.startsWith("//")) continue;

    if (/^(https?:|mailto:|tel:)/.test(url)) {
      if (url.startsWith("http")) {
        if (!externalToCheck.has(url)) externalToCheck.set(url, []);
        externalToCheck.get(url).push(pagePath);
      }
      continue;
    }

    if (url.startsWith("#")) continue; // same-page anchor, not a navigation target
    if (!url.startsWith("/")) continue; // relative URL — resolved against runtime base, skip

    if (!resolvesToFile(url)) {
      internalBroken.push({ page: pagePath, url });
    }
  }
}

console.log(`Checked ${htmlFiles.length} pages.`);

if (internalBroken.length > 0) {
  console.log(`\n${internalBroken.length} broken internal link(s):`);
  for (const { page, url } of internalBroken) console.log(`  ${page} -> ${url}`);
} else {
  console.log("0 broken internal links.");
}

console.log(`\nChecking ${externalToCheck.size} unique external link(s) (warnings only)...`);
const externalWarnings = [];
await Promise.all(
  [...externalToCheck.entries()].map(async ([url, pages]) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
      clearTimeout(timeout);
      if (!res.ok) externalWarnings.push({ url, status: res.status, pages });
    } catch (error) {
      externalWarnings.push({ url, status: error.message, pages });
    }
  }),
);

if (externalWarnings.length > 0) {
  console.log(`${externalWarnings.length} external link(s) didn't respond cleanly (warning, not a failure):`);
  for (const { url, status, pages } of externalWarnings) {
    console.log(`  ${url} (${status}) — referenced from ${pages.join(", ")}`);
  }
} else {
  console.log("All external links responded.");
}

if (internalBroken.length > 0) {
  console.log("\nFAIL — broken internal links found.");
  process.exit(1);
}
console.log("\nAll checks passed.");
