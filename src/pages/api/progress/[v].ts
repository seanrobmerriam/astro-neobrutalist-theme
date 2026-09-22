import type { APIRoute } from "astro";

export const prerender = true;

// Each call returns a progress bar at a specific step. Because Astro
// prerenders one response per distinct URL path, we enumerate every step
// in `getStaticPaths` — the build emits /api/progress/0.html through
// /api/progress/12.html, and the client just picks the right path.
//
// The button inside each fragment has `hx-get` pointing at the next step,
// so HTMX walks through the sequence without any custom JS.
const STEPS = [
  0, 8, 18, 27, 35, 44, 56, 67, 78, 86, 94, 100,
];

export function getStaticPaths() {
  return STEPS.map((v) => ({
    params: { v: String(v) },
  }));
}

function render(value: number): string {
  const done = value >= 100;
  const tone = done ? "bg-green" : "bg-blue";
  const nextLabel = done ? "Restart" : `Tick (${value}%)`;
  const nextIndex = done ? 0 : STEPS.indexOf(value) + 1;
  const nextPath = `/api/progress/${STEPS[nextIndex]}`;

  return `<div
  role="progressbar"
  aria-valuenow="${value}"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Demo progress"
  class="space-y-2"
>
  <div class="flex justify-between gap-4 text-ink">
    <span class="text-sm font-semibold">Demo progress</span>
    <span class="font-mono text-sm font-bold">${value}%</span>
  </div>
  <div class="w-full border-2 border-ink bg-paper p-1 shadow-brutal-sm">
    <div class="h-3 ${tone}" style="width: ${value}%"></div>
  </div>
  <button
    type="button"
    hx-get="${nextPath}"
    hx-trigger="click"
    hx-swap="outerHTML"
    hx-target="closest [role='progressbar']"
    class="mt-2 inline-flex border-2 border-ink bg-paper px-4 py-2 font-heading text-sm font-semibold shadow-brutal-sm hover:bg-yellow"
  >
    ${nextLabel}
  </button>
</div>`;
}

export const GET: APIRoute = async ({ params }) => {
  const value = Number(params.v ?? 0);
  return new Response(render(value), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
