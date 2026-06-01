import { Page } from "@playwright/test";
export async function forceFonts(page: Page) {
  await page.evaluate(() => {
    // Force complete rendering
    window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, 0);
  });
}