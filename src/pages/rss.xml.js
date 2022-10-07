import rss from '@astrojs/rss';
import { buildUrl } from "../utilities/urlBuilder";

const postImportResult = import.meta.glob('../blog/**/*.md', { eager: true });
const posts = Object.values(postImportResult)
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).valueOf() -
      new Date(a.frontmatter.date).valueOf()
  );

export const get = () => rss({
  // `<title>` field in output xml
  title: 'Brian Meeker',
  // `<description>` field in output xml
  description: 'Yet Another Developer Blog',
  // base URL for RSS <item> links
  // SITE will use "site" from your project's astro.config.
  site: import.meta.env.SITE,
  // list of `<item>`s in output xml
  // simple example: generate items for every md file in /src/pages
  // see "Generating items" section for required frontmatter and advanced use cases
  items: posts.map((post) => ({
    link: buildUrl(post),
    title: post.frontmatter.title,
    pubDate: post.frontmatter.date,
  })),
  // (optional) inject custom xml
  customData: `<language>en-us</language>`,
});
