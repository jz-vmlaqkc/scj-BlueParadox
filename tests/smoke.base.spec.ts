import { test, expect } from "@playwright/test";
import { paths } from "../utils/paths";
import { components } from "../utils/components";

for (const [pageName, { path, title }] of Object.entries(paths)) {
  test(`${pageName} - has title, loads correctly, contains required components ` , { tag: '@smoke'}, async ({
    page,
    baseURL,
  }) => {
    const response = await page.goto(baseURL + path);

    // Log for debugging
    console.log(
      `[${pageName}] Navigated to: ${page.url()} | Status: ${response?.status()}`,
    );

    // Fail fast if the page didn't load
    expect(
      response?.status(),
      `Page "${pageName}" returned a non-OK status`,
    ).toBeLessThan(400);

    // Check expected title
    await expect(page).toHaveTitle(title);

    // Ensure it's not an error page
    await expect(page).not.toHaveTitle(/error/i);

    for (const [compName, selector] of Object.entries(components)) {
      await expect(
        page.locator(selector),
        `Expected "${compName}" to be visible on ${pageName}`,
      ).toBeVisible();
    }
  });
}
