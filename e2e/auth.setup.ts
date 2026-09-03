import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");

  await page.getByLabel("Email").fill("demo@devstash.io");
  await page.getByLabel("Password").fill("12345678");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await page.waitForURL("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
