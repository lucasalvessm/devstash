import { expect, test } from "@playwright/test";

test.describe("dashboard main content", () => {
  test("renders stats, collections, pinned and recent items", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/dashboard");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await expect(main.getByText("Items", { exact: true })).toBeVisible();
    await expect(main.getByText("Favorite items")).toBeVisible();
    await expect(main.getByText("Favorite collections")).toBeVisible();

    await expect(main.getByRole("heading", { name: "Collections" })).toBeVisible();
    await expect(main.getByRole("link", { name: /React Patterns/ })).toBeVisible();

    // The seed data has no pinned items, so the Pinned section should not render.
    await expect(main.getByRole("heading", { name: "Pinned" })).toHaveCount(0);

    const recentSection = main
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Recent items" }) });
    await expect(recentSection.getByRole("heading", { name: "Recent items" })).toBeVisible();
    await expect(recentSection.getByRole("link")).toHaveCount(10);

    expect(consoleErrors).toEqual([]);
  });
});
