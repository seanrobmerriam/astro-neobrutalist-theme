import { defineConfig, devices } from "@playwright/test";

// Runs against a production build + preview server, not the dev server —
// the dev server doesn't run the `postbuild` Pagefind indexing step, and a
// prod build is what a buyer's own CI would actually be testing.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:4322",
    trace: "on-first-retry",
  },

  webServer: {
    command: "bun run build && bun run astro preview --port 4322",
    url: "http://localhost:4322",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // WebKit needs native libraries (`playwright install-deps`) that this
    // theme's sandboxed dev environment couldn't install without root —
    // see CLAUDE.md's Known issues. CI installs them via
    // `playwright install --with-deps`, where this project runs normally.
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
