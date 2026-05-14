import { test, expect } from "@playwright/test";
import { paths } from "../utils/paths";
import { forceFonts } from "../utils/helpers";

for (const [pageName, { path, title }] of Object.entries(paths)) {
  test.describe(`${pageName} - Visual Regression `, () => {
    test("full page screenshot", {
      tag: '@smoke'
    }, async ({ page, baseURL }) => {
      await page.goto(baseURL + path);

      await forceFonts(page);
      await expect(page).toHaveScreenshot(`${pageName}-full.png`, {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.3,
        maxDiffPixels: 100,
        threshold: 0.3
      });
    });
    
  });
}
