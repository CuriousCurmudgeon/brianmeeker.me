import type { MarkdownInstance } from "astro";
import { DateTime } from "luxon";

interface Frontmatter {
  date: string;
}

export default function buildUrl(post: MarkdownInstance<Frontmatter>): string {
  const dateTime = DateTime.fromISO(post.frontmatter.date);
  const slug = post.file.split("/").pop()!.split(".").shift();
  return `/${dateTime.toFormat("yyyy")}/${dateTime.toFormat("MM")}/${dateTime.toFormat("dd")}/${slug}`;
}
