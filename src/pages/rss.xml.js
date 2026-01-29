import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { buildUrl } from "../utilities/urlBuilder";

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) =>
      new Date(b.data.date).valueOf() -
      new Date(a.data.date).valueOf()
  );

  return rss({
    title: 'Brian Meeker',
    description: 'Yet Another Developer Blog',
    site: context.site,
    items: posts.map((post) => ({
      link: buildUrl(post),
      title: post.data.title,
      pubDate: new Date(post.data.date),
    })),
    customData: `<language>en-us</language>`,
  });
}
