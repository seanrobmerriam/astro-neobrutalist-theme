import { test, expect } from "@playwright/test";

test.describe("Modal", () => {
  test("opens, traps focus at both boundaries, and closes via Escape and the close button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open modal" }).click();
    const modal = page.locator("#demo-modal");
    await expect(modal).toBeVisible();

    // Focus should land inside the dialog once open (native <dialog> autofocus).
    await expect(modal).toContainText("Confirm action");

    const closeButton = modal.getByRole("button", { name: "Close dialog" });
    const cancelButton = modal.getByRole("button", { name: "Cancel" });
    const confirmButton = modal.getByRole("button", { name: "Confirm" });

    // Walk focus to the last focusable element, then Tab once more: it must
    // land back on the first, not silently escape to <body> — the exact gap
    // scripts/dialog.ts patches (see its Tab-boundary keydown handler).
    await confirmButton.focus();
    await page.keyboard.press("Tab");
    await expect(closeButton).toBeFocused();

    // Shift+Tab from the first element must wrap to the last.
    await page.keyboard.press("Shift+Tab");
    await expect(confirmButton).toBeFocused();

    await cancelButton.click();
    await expect(modal).toBeHidden();

    // Re-open and confirm Escape also closes it (native <dialog> behavior).
    await page.getByRole("button", { name: "Open modal" }).click();
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });

  test("closes on backdrop click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open modal" }).click();
    const modal = page.locator("#demo-modal");
    await expect(modal).toBeVisible();

    // The dialog box itself is small and centered (max-w-md) with zero
    // padding — every pixel inside its bounding rect is covered by a child
    // element. The real backdrop is the ::backdrop pseudo-element filling
    // the rest of the viewport, so click there in page (not element)
    // coordinates, far from the centered box.
    await page.mouse.click(5, 5);
    await expect(modal).toBeHidden();
  });
});

test.describe("Drawer", () => {
  test("opens from the trigger and closes via its own close button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open drawer" }).click();
    const drawer = page.locator("#cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText("Your cart");

    await drawer.getByRole("button", { name: "Close drawer" }).click();
    await expect(drawer).toBeHidden();
  });
});
