import { z } from "zod";

const HeroSchema = z.object({
  hasGradient: z.boolean(),
  autoplay: z.boolean(),
  mobileVideo: z.string().url().nullable(),
  desktopVideo: z.string().url().nullable(),
  mobileImage: z.string().url(),
  desktopImage: z.string().url(),
  altText: z.string(),
});

const CardSchema = z.object({
  size: z.string(),
  mediaSrc: z.string().url(),
  mediaType: z.string(),
  ctaType: z.string(),
  altText: z.string(),
  ctaText: z.string(),
});

const CoverSchema = z.object({
  src: z.string().url(),
  altText: z.string(),
});

const ChipSchema = z.object({
  label: z.string(),
  theme: z.string(),
});

const ContentImageSchema = z
  .object({
    src: z.string().url(),
    alt: z.string(),
    desktop: z.object({
      width: z.number(),
      height: z.number(),
      top: z.string(),
    }),
    mobile: z.object({
      width: z.number(),
      height: z.number(),
      top: z.string(),
    }),
  })
  .nullable();

const ThumbnailSchema = z
  .object({
    src: z.string().url(),
    width: z.number(),
    height: z.number(),
    altText: z.string(),
  })
  .nullable();

// Discriminated union on taxonomy.type
const FilmTaxonomy = z.object({
  type: z.literal("film"),
  youTubeId: z.string().min(1),
});

const ArticleTaxonomy = z.object({
  type: z.literal("article"),
  excerpt: z.string(),
  readTime: z.string(),
  publishDate: z.string(),
});

const TaxonomySchema = z.discriminatedUnion("type", [
  FilmTaxonomy,
  ArticleTaxonomy,
]);

export const ContentItemSchema = z.object({
  id: z.number().int().nonnegative(),
  slug: z.string().min(1),
  url: z.string().startsWith("/"),
  showChip: z.boolean(),
  taxonomy: TaxonomySchema,
  hero: HeroSchema,
  card: CardSchema,
  cover: CoverSchema,
  contentImage: ContentImageSchema,
  thumbnail: ThumbnailSchema,
  supportedLocales: z.array(z.string()).nonempty(),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string().min(1),
  chip: ChipSchema,
});

export type ContentItem = z.infer<typeof ContentItemSchema>;
