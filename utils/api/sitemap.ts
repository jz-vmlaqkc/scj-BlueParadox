import { APIRequestContext } from "@playwright/test";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false });

export type SitemapEntry = {
  loc: string; // re-anchored to current baseURL
  pathname: string; // path only, useful for page.goto()
  lastmod?: string;
};

/**
 * Fetches /sitemap.xml and returns entries re-anchored to the target baseURL.
 * Handles sitemap-index files recursively.
 */
export async function fetchSitemapUrls(
  request: APIRequestContext,
  targetBaseUrl: string,
  sitemapPath = "/sitemap.xml",
): Promise<SitemapEntry[]> {
  const response = await request.get(sitemapPath);
  if (!response.ok()) {
    throw new Error(
      `Sitemap fetch failed at ${sitemapPath}: ${response.status()}`,
    );
  }

  const parsed = parser.parse(await response.text());

  // Sitemap index → recurse
  if (parsed.sitemapindex?.sitemap) {
    const children = toArray(parsed.sitemapindex.sitemap);
    const nested = await Promise.all(
      children.map((child: { loc: string }) => {
        const childPath = new URL(child.loc).pathname; // strip prod origin here too
        return fetchSitemapUrls(request, targetBaseUrl, childPath);
      }),
    );
    return nested.flat();
  }

  // urlset → re-anchor each entry
  if (parsed.urlset?.url) {
    return toArray(parsed.urlset.url).map(
      (entry: { loc: string; lastmod?: string }) => {
        const pathname = new URL(entry.loc).pathname;
        return {
          loc: new URL(pathname, targetBaseUrl).toString(),
          pathname,
          lastmod: entry.lastmod,
        };
      },
    );
  }

  return [];
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
