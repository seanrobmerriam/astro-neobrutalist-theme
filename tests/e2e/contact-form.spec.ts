import { test, expect } from "@playwright/test";

test("Contact form submits (client-side) and shows a success toast", async ({ page }) => {
  await page.goto("/contact");

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Message").fill("Does this theme support a dark mode toggle?");

  await page.getByRole("button", { name: "Send message" }).click();

  const toast = page.getByRole("status").filter({ hasText: "Message sent" });
  await expect(toast).toBeVisible();

  // The demo handler resets the form after a simulated submit.
  await expect(page.getByLabel("Name")).toHaveValue("");
});

test("Contact form blocks submission when required fields are empty", async ({ page }) => {
  await page.goto("/contact");

  await page.getByRole("button", { name: "Send message" }).click();

  // Native required-field validation should keep the browser from firing
  // the submit handler at all, so no toast appears and the field is flagged.
  const toast = page.getByRole("status").filter({ hasText: "Message sent" });
  await expect(toast).toBeHidden();
  await expect(page.getByLabel("Name")).toHaveJSProperty("validity.valid", false);
});
