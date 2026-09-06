import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { site } from "../config/site";
import { getPublishedPosts } from "../lib/blog";

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();

  return rss({
    title: `${site.name} Blog`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
};
