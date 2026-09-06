import { getCollection } from "astro:content";

// Centralized so the listing, tag archives, author pages, and the RSS feed
// can't drift out of sync on what counts as "published" or what order posts
// come in. Drafts stay visible in dev (so you can preview them) and are
// excluded everywhere in a production build.
export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => (import.meta.env.PROD ? data.draft !== true : true));
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}
