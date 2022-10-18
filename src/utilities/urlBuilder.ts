import type { MarkdownInstance } from "astro";
import { DateTime } from "luxon";

interface Frontmatter {
  date: string;
}

interface UrlParts {
  slug: string;
  year: string;
  month: string;
  day: string;
}

function buildUrlParts(post: MarkdownInstance<Frontmatter>): UrlParts {
  const dateTime = DateTime.fromISO(post.frontmatter.date);
  const filename = post.file.split("/").pop()!.split("_").pop()!;
  return {
    slug: filename.split(".").shift()!,
    year: dateTime.toFormat("yyyy"),
    month: dateTime.toFormat("MM"),
    day: dateTime.toFormat("dd")
  }
}

function buildUrl(post: MarkdownInstance<Frontmatter>): string {
  const { slug, year, month, day } = buildUrlParts(post);
  return `/${year}/${month}/${day}/${slug}`;
}

export { buildUrl, buildUrlParts };
