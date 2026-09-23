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
      name: "Eustace",
      cssVariable: "--font-eustace",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Eustace.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Devina Rodent",
      cssVariable: "--font-devina-rodent",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 100,
            style: "normal",
            src: ["./src/assets/fonts/DevinaRodent-Thin.woff2"],
          },
          {
            weight: 100,
            style: "italic",
            src: ["./src/assets/fonts/DevinaRodent-ThinItalic.woff2"],
          },
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/Devina Rodent.woff2"],
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/assets/fonts/DevinaRodent-Italic.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/DevinaRodent-Semibold.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/DevinaRodent-Bold.woff2"],
          },
          {
            weight: 700,
            style: "italic",
            src: ["./src/assets/fonts/DevinaRodent-BoldItalic.woff2"],
          },
          {
            weight: 800,
            style: "normal",
            src: ["./src/assets/fonts/DevinaRodent-Extrabold.woff2"],
          },
          {
            weight: 800,
            style: "italic",
            src: ["./src/assets/fonts/DevinaRodent-ExtraboldItalic.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Alma Mono",
      cssVariable: "--font-alma-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/almamono-regular-webfont.woff2"],
          },
        ],
      },
    },
  ],
});
