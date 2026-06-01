import { Page } from "@playwright/test";

//This was a suggestion from Christian for the other project. I haven't imported yours or this one, just adding stuff. JZ

async function emulateLazyLoadScrollV2(page: Page): Promise<void> {
  const scrollDistance: number = 90;
  const scrollInterval: number = 200;
  interface ScrollOptions {
    scrollDistance: number;
    scrollInterval: number;
  }

  await page.evaluate(
    async ({ scrollDistance, scrollInterval }: ScrollOptions) => {
      await new Promise<boolean>((resolve) => {
        let totalHeight = 0;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, scrollDistance);
          totalHeight += scrollDistance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve(true);
          }
        }, scrollInterval);
      });
    },
    { scrollDistance, scrollInterval },
  );
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3000);
}

export { emulateLazyLoadScrollV2 };


