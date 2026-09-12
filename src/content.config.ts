import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    // First paragraph of the abstract. Shown on the card and as the lead
    // paragraph on the detail page, so it is never duplicated in the body.
    summary: z.string(),
    // Most recent appearance, used only for sorting the grid.
    date: z.string(),
    repo: z.url().optional(),
    repoLabel: z.string().default('GitHub'),
    note: z.string().optional(),
    appearances: z.array(z.object({
      venue: z.string(),
      url: z.url().optional(),
      videoId: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { blog, talks };
