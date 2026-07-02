import { test, expect } from "@playwright/test";
import { paths } from "../../utils/paths";
import { components } from "../../utils/components";

for (const [pageName, { path }] of Object.entries(paths)) {
  test.describe(`${pageName} - Components`, () => {
    for (const [compName, {selector, testID}] of Object.entries(components)) {
      test(`${testID} - ${compName} screenshot`, async ({ page, baseURL }) => {
        await page.goto(baseURL + path);
        const component = page.locator(selector);
        await expect(component).toBeVisible();
        await expect(component).toHaveScreenshot(
          `${pageName}-${compName}.png`,
          { animations: "disabled" },
        );
      });
    }
  });
}
