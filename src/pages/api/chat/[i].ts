import type { APIRoute } from "astro";

export const prerender = true;

// Toy "agent" responder: each prerendered index returns a different canned
// reply. The client hashes the user's input to pick an index — same input
// produces the same reply, different inputs spread across the catalogue.
// In a real app this would be replaced with an LLM call; the prerendered
// shape here matches what a streaming endpoint would return fragment by
// fragment.
const REPLIES = [
  "Hi! I'm the demo agent — I can't actually run code, but I can show you how this UI handles streamed replies, suggested follow-ups, and tool call placeholders.",
  "Every component in this theme is a typed `.astro` file with a `Props` interface and a `Record<Variant, string>` of Tailwind classes — same pattern across the library.",
  "All tokens live in `src/styles/global.css` under `@theme`. Swap an OKLCH value there and the whole theme follows — accents, shadows, and focus ring included.",
  "Zero client JS by default. Interactivity uses plain data attributes and shared scripts (`src/scripts/dialog.ts`, `src/scripts/theme-toggle.ts`). Reactivity for things like this chat uses HTMX partials.",
  "Run `bun run build`. The output is fully static HTML in `dist/`. HTMX endpoints under `src/pages/api/` are also prerendered, so the whole thing deploys to any static host.",
  "Got it — I've noted that. (This is a canned demo response; a real agent would call a model here and stream tokens via Server-Sent Events.)",
];

export function getStaticPaths() {
  return REPLIES.map((reply, i) => ({
    params: { i: String(i) },
    props: { reply, index: i },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const i = Number(params.i ?? 0);
  const reply = REPLIES[i % REPLIES.length];

  const html = `<article class="flex items-start gap-3" data-role="assistant">
  <div class="flex size-8 shrink-0 items-center justify-center border-2 border-ink bg-lavender font-mono text-xs font-bold shadow-brutal-sm">
    AI
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-xs text-ink/50">Neubrutal Agent <span class="ml-1">just now</span></p>
    <p class="mt-1 inline-block max-w-prose border-2 border-ink bg-lavender/30 px-3 py-2 text-sm">
      ${reply}
    </p>
  </div>
</article>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
