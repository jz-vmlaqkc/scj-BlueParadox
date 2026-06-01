import { test, expect } from "@playwright/test";
import { paths } from "../utils/index";
import { forceFonts } from "../utils/index";
import { emulateLazyLoadScroll } from "../utils/index"
import { emulateLazyLoadScrollV2 } from "../utils/index";
import path from "path";

for (const [pageName, { path, title }] of Object.entries(paths)) {
  test.describe(`${pageName} - Visual Regression `, () => {
    test("full page screenshot", {
      tag: '@smoke'
    }, async ({ page, baseURL }) => {
      await page.goto(baseURL + path);
      await page.waitForLoadState("domcontentloaded");

      await forceFonts(page);
      await emulateLazyLoadScroll(page);
      await expect(page).toHaveScreenshot(`${pageName}-full.png`, {
        fullPage: true,
        animations: "disabled",
        maxDiffPixelRatio: 0.3,
        maxDiffPixels: 100,
        threshold: 0.3,
        //stylePath: path.join(__dirname, "screenshot.css"),
      });
    });
    
  });
}
