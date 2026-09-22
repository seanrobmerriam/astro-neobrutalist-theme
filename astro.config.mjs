// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { neubrutalTheme } from "./src/lib/shiki-theme.ts";
import { site } from "./src/config/site.ts";

// https://astro.build/config
export default defineConfig({
  // TODO: site.url in src/config/site.ts is a placeholder — update it to the
  // real production domain before deploying. Canonical URLs, the sitemap,
  // and Open Graph URLs are all generated from this.
  site: site.url,

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: neubrutalTheme,
    },
  },

  integrations: [sitemap()],

  // Self-hosted via Astro's Fonts API: local files are read from disk, and
  // Google-provided families are downloaded at build time and served from
  // this origin — no runtime request to fonts.googleapis.com/gstatic.com,
  // and no render-blocking third-party connection.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Clariza Sparks",
      cssVariable: "--font-clariza-sparks",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/ClarizaSparks-Regular.woff2", "./src/assets/fonts/ClarizaSparks-Regular.woff"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Vaneska",
      cssVariable: "--font-vaneska",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Vaneska.woff"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Gorga Grotesque",
      cssVariable: "--font-gorga-grotesque",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/GorgaGrotesque-Bold.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "TBJ Terminal Mono",
      cssVariable: "--font-tbj-terminal-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/TBJTerminalMono-Medium.woff2"],
          },
        ],
      },
    },
  ],
});
