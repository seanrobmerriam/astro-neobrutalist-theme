import { test, expect } from "@playwright/test";

test.describe("Tabs", () => {
  test("click switches the active tab and its panel", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#tabs-accordion");
    const tablist = section.getByRole("tablist").first();

    const profileTab = tablist.getByRole("tab", { name: "Profile" });
    const accountTab = tablist.getByRole("tab", { name: "Account" });

    await expect(profileTab).toHaveAttribute("aria-selected", "true");
    await expect(accountTab).toHaveAttribute("aria-selected", "false");

    await accountTab.click();
    await expect(accountTab).toHaveAttribute("aria-selected", "true");
    await expect(profileTab).toHaveAttribute("aria-selected", "false");

    const panelId = await accountTab.getAttribute("aria-controls");
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("vanilla JS");
  });

  test("ArrowRight moves focus and selection to the next tab", async ({ page }) => {
    await page.goto("/");
    const tablist = page.locator("#tabs-accordion").getByRole("tablist").first();
    const profileTab = tablist.getByRole("tab", { name: "Profile" });
    const accountTab = tablist.getByRole("tab", { name: "Account" });

    await profileTab.focus();
    await page.keyboard.press("ArrowRight");

    await expect(accountTab).toBeFocused();
    await expect(accountTab).toHaveAttribute("aria-selected", "true");
  });
});
