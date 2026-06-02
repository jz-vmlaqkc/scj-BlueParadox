import { SitemapEntry } from "../sitemap";

export type ContentType = "stories" | "films" | "exhibits";

/**
 * Matches /{locale}/{type}/{slug} OR /{type}/{slug}
 * Locale segment is optional and treated as 2-5 letter code (e.g. en, en-gb).
 * NOTE: not regex — uses pathname segment parsing.
 */
export function filterByContentType(
  entries: SitemapEntry[],
  type: ContentType,
): SitemapEntry[] {
  return entries.filter(({ pathname }) => {
    const segments = pathname.split("/").filter(Boolean);
    // [type, slug]  OR  [locale, type, slug]
    if (segments.length === 2 && segments[0] === type) return true;
    if (segments.length === 3 && segments[1] === type) return true;
    return false;
  });
}
