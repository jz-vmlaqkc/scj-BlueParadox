import { Page, Locator } from "@playwright/test";

const MASKED_SELECTORS = [
  '#onetrust-banner-sdk"',
  ".scj-infinite-news-carousel.relative.overflow-hidden.w-full",
];

export function getMaskedLocators(page: Page): Locator[] {
  return MASKED_SELECTORS.map((selector) => page.locator(selector));
}
