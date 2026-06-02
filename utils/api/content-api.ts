import { APIRequestContext } from "@playwright/test";

export type ContentItem = {
  id: number;
  slug: string;
  url: string;
  supportedLocales: string[];
  taxonomy: { type: string; [key: string]: unknown };
  [key: string]: unknown;
};

const DEFAULT_LOCALE = "en-us";

/**
 * Fetches the unified content list from /api/stories.
 */
export async function fetchAllContent(
  request: APIRequestContext,
): Promise<ContentItem[]> {
  const res = await request.get("/api/stories");
  if (!res.ok()) {
    throw new Error(`/api/stories fetch failed: ${res.status()}`);
  }
  const body = (await res.json()) as ContentItem[];
  if (!Array.isArray(body)) {
    throw new Error(`/api/stories did not return an array`);
  }
  return body;
}

/**
 * Filters content by taxonomy type ("film", "article", etc.).
 */
export function filterByType(
  items: ContentItem[],
  type: string,
): ContentItem[] {
  return items.filter((item) => item.taxonomy?.type === type);
}

/**
 * Builds the canonical public URLs for an item, one per supported locale.
 * en-us → no prefix; all others → /{locale} prefix.
 */
export function buildLocalizedUrls(item: ContentItem): string[] {
  return item.supportedLocales.map((locale) =>
    locale === DEFAULT_LOCALE ? item.url : `/${locale}${item.url}`,
  );
}
