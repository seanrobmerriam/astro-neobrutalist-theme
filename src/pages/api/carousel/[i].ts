import type { APIRoute } from "astro";

export const prerender = true;

// Each path returns the next batch of two slides. The button's hx-get
// points at the next index so the carousel keeps appending without any
// custom JS — every state is a separate prerendered file.
const SLIDES: Array<{ accent: string; quote: string; author: string }> = [
  { accent: "bg-yellow", quote: "Onboarding finally feels like us.", author: "Designer, fintech" },
  { accent: "bg-pink", quote: "Customers noticed the buttons.", author: "PM, consumer app" },
  { accent: "bg-blue", quote: "Three components in, two days saved.", author: "Solo founder" },
  { accent: "bg-green", quote: "It looks like a poster and ships like a system.", author: "Brand lead" },
  { accent: "bg-orange", quote: "Accessibility was built in.", author: "A11y consultant" },
  { accent: "bg-lavender", quote: "The hardest part was picking the accent.", author: "Marketing" },
];

const BATCH = 2;
const BATCHES = Math.ceil(SLIDES.length / BATCH);

export function getStaticPaths() {
  return Array.from({ length: BATCHES }, (_, i) => ({
    params: { i: String(i) },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const i = Number(params.i ?? 0);
  const start = i * BATCH;
  const batch = SLIDES.slice(start, start + BATCH);

  if (batch.length === 0) {
    return new Response("<!-- end of stream -->", {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const next = i + 1 < BATCHES ? String(i + 1) : "end";
  const slides = batch
    .map(
      (s) => `<div class="w-full shrink-0 basis-full snap-start px-2 sm:basis-1/2 lg:basis-1/3">
  <div class="flex h-full flex-col justify-between border-[3px] border-ink ${s.accent} p-6 shadow-brutal">
    <p class="font-heading text-lg font-bold">"${s.quote}"</p>
    <p class="mt-3 text-sm text-ink/70">— ${s.author}</p>
  </div>
</div>`,
    )
    .join("");

  // The batch fragment ends with a hidden "trigger" button that has
  // hx-get pointing at the next batch. When the previous trigger's
  // hx-trigger="revealed" fires after the batch settles into view,
  // HTMX swaps the button for the next batch — infinite scroll feel
  // without any custom JS.
  const trigger =
    next === "end"
      ? ""
      : `<button
  type="button"
  aria-hidden="true"
  style="display:none"
  hx-get="/api/carousel/${next}"
  hx-trigger="revealed"
  hx-swap="outerHTML"
  hx-target="[data-htmx-carousel]"
></button>`;

  return new Response(slides + trigger, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
