import { APIRequestContext } from "@playwright/test";
import { STORYBOOK_CONFIG } from "./config";

export interface StoryEntry {
  id: string;
  type: string;
  name: string;
  title: string;
  tags: string[];
}

interface StorybookIndex {
  v: number;
  entries: Record<string, StoryEntry>;
}

export async function discoverStories(
  request: APIRequestContext,
): Promise<StoryEntry[]> {
  const response = await request.get(STORYBOOK_CONFIG.indexUrl);
  if (!response.ok()) {
    throw new Error(
      `Failed to fetch Storybook index (status: ${response.status()})`,
    );
  }

  const index: StorybookIndex = await response.json();
  const { requiredTags, excludePatterns } = STORYBOOK_CONFIG;

  return Object.values(index.entries).filter((entry) => {
    if (entry.type !== "story") return false;
    if (excludePatterns.some((p) => p.test(entry.id))) return false;
    if (requiredTags && !requiredTags.some((tag) => entry.tags.includes(tag)))
      return false;
    return true;
  });
}
