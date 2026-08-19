// A custom Shiki theme built from the neubrutalist palette tokens, so code
// block "syntax highlighting" is really just our own accent colors doing
// double duty. Shared between the Terminal component and astro.config.mjs
// (markdown fenced code blocks) so both stay in sync automatically.
export const neubrutalTheme = {
  name: "neubrutal",
  type: "dark" as const,
  colors: {
    "editor.background": "oklch(0 0 0)",
    "editor.foreground": "oklch(0.9934 0.0107 95.16)",
  },
  settings: [
    { scope: ["comment"], settings: { foreground: "oklch(0.9934 0.0107 95.16 / 0.45)" } },
    { scope: ["string", "string.quoted", "string.template"], settings: { foreground: "oklch(0.8046 0.1136 149.93)" } },
    { scope: ["constant.numeric", "constant.language", "constant.character"], settings: { foreground: "oklch(0.7969 0.1443 60.82)" } },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control", "keyword.operator.new"],
      settings: { foreground: "oklch(0.7116 0.1812 22.84)" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call", "variable.function"],
      settings: { foreground: "oklch(0.8789 0.1617 90.94)" },
    },
    {
      scope: ["variable.parameter", "variable.other", "variable.other.property", "variable.other.readwrite"],
      settings: { foreground: "oklch(0.7682 0.123 250.03)" },
    },
    {
      scope: ["entity.name.tag", "entity.name.type", "support.type", "entity.other.attribute-name", "support.class"],
      settings: { foreground: "oklch(0.7776 0.1147 292.01)" },
    },
    { scope: ["punctuation", "meta.brace", "punctuation.definition"], settings: { foreground: "oklch(0.9934 0.0107 95.16 / 0.75)" } },
  ],
};
