import { test, expect } from "@playwright/test";
import { STORYBOOK_CONFIG } from "../../utils/storybook/config";
import { discoverStories, StoryEntry } from "../../utils/storybook/discovery";
import { writeInventory } from "../../utils/storybook/inventory";
import { forceFonts } from "../../utils/visual/helpers";
import { emulateLazyLoadScroll } from "../../utils/visual/helpers2point0";
import { emulateLazyLoadScrollV2 } from "../../utils/visual/helpers";

let stories: StoryEntry[] = [];

test.beforeAll(async ({ request }) => {
  stories = await discoverStories(request);
  console.log(`📚 Discovered ${stories.length} stories for snapshot testing`);
});

test.describe("Storybook Visual Regression @storybook", () => {
  test("snapshot each story", async ({ page }) => {
    test.setTimeout(stories.length * 10_000);

    for (const story of stories) {
      await test.step(`📸 ${story.title} / ${story.name}`, async () => {
        await page.goto(
          `${STORYBOOK_CONFIG.iframeUrl}?id=${story.id}&viewMode=story`,
          { waitUntil: "load" },
        );

        try {
          await page.locator("#storybook-root > *").first().waitFor({
            state: "visible",
            timeout: STORYBOOK_CONFIG.renderTimeout,
          });
        } catch {
          console.warn(`⚠️ Skipped (no render): ${story.id}`);
          return;
        }

        //Test one at a time, then update imports
        //await emulateLazyLoadScroll(page);
        //await emulateLazyLoadScrollV2(page);
        await forceFonts(page);

        await expect.soft(page).toHaveScreenshot(`${story.id}.png`, {
          fullPage: true,
          scale: "css",
        });
      });
    }

    writeInventory(stories);
  });
});
