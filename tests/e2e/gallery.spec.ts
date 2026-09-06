import { test, expect } from "@playwright/test";

test("Gallery opens a lightbox with the clicked image and closes it", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("#gallery");
  const thumbnails = section.locator("[data-gallery-open]");
  const count = await thumbnails.count();
  expect(count).toBeGreaterThan(1);

  const secondThumbSrc = await thumbnails.nth(1).locator("img").getAttribute("src");
  await thumbnails.nth(1).click();

  const lightbox = page.locator("dialog:has([data-gallery-image])");
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator("[data-gallery-image]")).toHaveAttribute("src", secondThumbSrc ?? "");

  await lightbox.getByRole("button", { name: "Close preview" }).click();
  await expect(lightbox).toBeHidden();
});
