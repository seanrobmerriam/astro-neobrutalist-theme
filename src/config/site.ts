// Single source of truth for brand identity, the site URL, and the nav/footer
// data that's genuinely identical across pages. This is a plain typed object
// rather than a Zod schema: the project has no runtime dependency on Zod (it
// only reaches Astro's re-export inside content.config.ts), and adding one
// solely to validate a handful of literal strings would be an unjustified
// dependency for what TypeScript already checks at compile time.
//
// Anchor-based, single-page navs (the marketing sections on `/` and
// `/landing`) are NOT centralized here — they're genuinely specific to the
// sections on that one page, not duplicated data. Only what's byte-identical
// across multiple pages lives here.

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  heading: string;
  links: NavLink[];
}

export const site = {
  name: "Neubrutal",
  tagline: "An Astro + Tailwind theme, built loud on purpose.",
  description:
    "A loud, high-contrast Astro theme built with Tailwind CSS v4: thick borders, hard shadows, and a full component library.",

  /** TODO: replace with the real production domain before deploying — this
   * feeds `astro.config.mjs`'s `site`, which canonical URLs, the sitemap,
   * and Open Graph URLs are all generated from. */
  url: "https://example.com",
  locale: "en",

  /** TODO: add a real 1200×630 social-preview image at this path before
   * launch — nothing currently exists at `public/og-default.png`. */
  ogImage: "/og-default.png",

  social: {
    github: "https://github.com",
  },

  /** The nav shared verbatim across the multi-page site (blog, portfolio).
   * The homepage (`/`) and `/landing` use their own anchor-based navs. */
  nav: [
    { label: "Home", href: "/landing" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
  ] satisfies NavLink[],

  /** The "Resources" footer group — identical on every page that has a
   * footer. Each page still supplies its own first ("Product"-type) group,
   * since that content is genuinely page-specific. */
  footerResources: {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Search", href: "/search" },
      { label: "Astro docs", href: "https://docs.astro.build" },
      { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    ],
  } satisfies FooterGroup,
} as const;
