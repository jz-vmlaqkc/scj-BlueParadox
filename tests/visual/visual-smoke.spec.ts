import { test, expect } from "@playwright/test";
import {
  paths,
  forceFonts,
  emulateLazyLoadScroll,
  emulateLazyLoadScrollV2,
  getMaskedLocators,
} from "../../utils/index";
import path from "path";

for (const [pageName, { path, title, testID }] of Object.entries(paths)) {
  test.describe(`${testID} - ${pageName} - Visual Regression `, () => {
    test(
      "full page screenshot",
      {
        tag: "@smoke",
      },
      async ({ page, baseURL }) => {
        await page.goto(baseURL + path);
        await page.waitForLoadState("domcontentloaded");

        //await forceFonts(page);
        //await emulateLazyLoadScroll(page);
        await expect(page).toHaveScreenshot(`${pageName}-full.png`, {
          fullPage: true,
          animations: "disabled",
          maxDiffPixelRatio: 0.3,
          maxDiffPixels: 100,
          threshold: 0.3,
          //stylePath: path.join(__dirname, "screenshot.css"),
          mask: getMaskedLocators(page),
          maskColor: "#1CBAC4",
        });
      },
    );
  });
}
