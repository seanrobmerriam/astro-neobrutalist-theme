import { test, expect } from "@playwright/test";

test("Accordion expands and collapses a native <details> item on click", async ({ page }) => {
  await page.goto("/");

  const item = page.locator("#tabs-accordion details").first();
  await expect(item).not.toHaveAttribute("open", "");

  await item.locator("summary").click();
  await expect(item).toHaveAttribute("open", "");

  await item.locator("summary").click();
  await expect(item).not.toHaveAttribute("open", "");
});
