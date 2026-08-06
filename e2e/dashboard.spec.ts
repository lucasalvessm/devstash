import { expect, test } from "@playwright/test";

test.describe("dashboard sidebar", () => {
  test("renders types and collections sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/dashboard");

    const sidebar = page.locator('[data-slot="sidebar"]');

    await expect(sidebar.getByText("Types")).toBeVisible();
    await expect(page.getByRole("link", { name: "Snippet", exact: true })).toBeVisible();
    await expect(sidebar.getByRole("button", { name: "Collections" })).toBeVisible();
    await expect(sidebar.getByText("Recent")).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "View all collections" })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("desktop sidebar trigger collapses and expands", async ({ page }) => {
    await page.goto("/dashboard");

    const sidebar = page.locator('[data-slot="sidebar"]');
    const trigger = page.locator('[data-slot="sidebar-trigger"]');

    await expect(sidebar).toHaveAttribute("data-state", "expanded");

    await trigger.click();
    await expect(sidebar).toHaveAttribute("data-state", "collapsed");

    await trigger.click();
    await expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  test("mobile viewport opens the sidebar as a drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");

    await expect(page.locator('[data-mobile="true"]')).toHaveCount(0);

    await page.locator('[data-slot="sidebar-trigger"]').click();

    await expect(page.locator('[data-mobile="true"]')).toBeVisible();
  });
});
