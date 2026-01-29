import type { CollectionEntry } from 'astro:content';
import { DateTime } from "luxon";

interface UrlParts {
  slug: string;
  year: string;
  month: string;
  day: string;
}

function buildUrlParts(post: CollectionEntry<'blog'>): UrlParts {
  const dateTime = DateTime.fromISO(post.data.date);

  // Extract slug from ID: "2025-01-26_slug-name.md" -> "slug-name"
  const filename = post.id.replace('.md', '');
  const slug = filename.split('_').pop()!;

  return {
    slug,
    year: dateTime.toFormat("yyyy"),
    month: dateTime.toFormat("MM"),
    day: dateTime.toFormat("dd")
  }
}

function buildUrl(post: CollectionEntry<'blog'>): string {
  const { slug, year, month, day } = buildUrlParts(post);
  return `/${year}/${month}/${day}/${slug}`;
}

export { buildUrl, buildUrlParts };
