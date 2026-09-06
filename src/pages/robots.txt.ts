import type { APIRoute } from "astro";
import { site } from "../config/site";

// Generated rather than a static public/robots.txt file so the sitemap URL
// can never drift out of sync with site.url.
export const GET: APIRoute = ({ site: astroSite }) => {
  const sitemapURL = new URL("sitemap-index.xml", astroSite ?? site.url);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
};
