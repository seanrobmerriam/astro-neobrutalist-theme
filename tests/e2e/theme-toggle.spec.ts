import { test, expect } from "@playwright/test";

test.describe("ThemeToggle", () => {
  test("cycles system -> light -> dark -> system, updating the DOM and persisting to localStorage", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /theme \(click for/ });

    await expect(html).not.toHaveAttribute("data-theme", /.+/);

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");

    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

    await toggle.click();
    await expect(html).not.toHaveAttribute("data-theme", /.+/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });

  test("persists the chosen theme across a reload with no flash of the wrong theme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /theme \(click for/ }).click(); // -> light
    await page.getByRole("button", { name: /theme \(click for/ }).click(); // -> dark

    await page.reload();
    // The blocking inline script in Layout.astro's <head> applies the stored
    // theme before first paint — by the time the DOM is queryable, it must
    // already be set, not applied a moment later by a deferred script.
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
