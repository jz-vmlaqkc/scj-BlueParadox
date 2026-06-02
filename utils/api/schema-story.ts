import { z } from "zod";

export const StorySchema = z.object({
  title: z.string().min(1),
  slug: z.string(),
  locale: z.string(),
  publishedAt: z.string().datetime(),
  body: z.array(z.unknown()).nonempty(),
  // ...
});
export type Story = z.infer<typeof StorySchema>;
