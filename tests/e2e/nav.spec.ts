import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("desktop nav links are visible and navigate at wide viewports", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/about");

    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await expect(primaryNav).toBeVisible();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();

    await primaryNav.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test("mobile drawer opens, lists links, and closes on backdrop-adjacent close button", async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await page.goto("/about");

    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    await expect(primaryNav).toBeHidden();

    const openButton = page.getByRole("button", { name: "Open menu" });
    await expect(openButton).toBeVisible();
    await openButton.click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Docs" })).toBeVisible();

    await drawer.getByRole("button", { name: "Close drawer" }).click();
    await expect(drawer).toBeHidden();
  });
});
