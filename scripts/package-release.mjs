// Builds a buyer-facing distributable zip of the theme: the repo, minus
// build output, dependencies, and internal-only working files that were
// never meant to ship (the rubric audit itself, this project's own planning
// docs, agent tooling config). Buyer-facing documentation lives under
// `src/docs/` (rendered at `/docs`) and is unaffected — this only excludes
// repo-root files used to build *this specific theme*, not doc content.
//
// Usage: node scripts/package-release.mjs
// Writes release/<name>-v<version>.zip. Requires the `zip` CLI (present on
// macOS and virtually every Linux distro; not available out of the box on
// Windows — run this from WSL or a CI runner there).

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));

const EXCLUDES = [
  ".git/*",
  ".github/*", // CI workflow describes *our* audit pipeline, not a generic starter — buyers wire up their own.
  "node_modules/*",
  "dist/*",
  ".astro/*",
  "test-results/*",
  "playwright-report/*",
  "docs/superpowers/*", // this theme's own internal planning docs, not buyer-facing documentation
  "docs/audits/*", // internal audit run output (see docs/superpowers/plans/2026-09-04-rubric-remediation.md)
  "RUBRIC.md", // the internal quality rubric this theme was scored against
  ".agents/*",
  ".claude/*",
  ".env",
  "*.DS_Store",
  "release/*",
];

const outDir = path.join(root, "release");
fs.mkdirSync(outDir, { recursive: true });

const zipName = `${pkg.name}-v${pkg.version}.zip`;
const zipPath = path.join(outDir, zipName);
fs.rmSync(zipPath, { force: true });

execFileSync("zip", ["-r", "-q", path.relative(root, zipPath), ".", "-x", ...EXCLUDES], {
  cwd: root,
  stdio: "inherit",
});

const { size } = fs.statSync(zipPath);
console.log(`Wrote ${path.relative(root, zipPath)} (${(size / 1024 / 1024).toFixed(2)} MB)`);
