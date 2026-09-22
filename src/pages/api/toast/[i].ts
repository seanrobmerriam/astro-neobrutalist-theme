import type { APIRoute } from "astro";

export const prerender = true;

// One prerendered file per index in the sequence. The button uses hx-get
// pointing at /api/toast/N+1 so HTMX walks through the canned messages
// without any custom JS — the client doesn't track state at all.
const SEQUENCE: Array<{
  variant: "default" | "success" | "warning" | "error";
  title: string;
  description: string;
}> = [
  { variant: "default", title: "Build queued", description: "Commit a3f91d is being compiled." },
  { variant: "success", title: "Deploy succeeded", description: "v1.4.2 is live in 3 regions." },
  { variant: "warning", title: "Rate limit at 80%", description: "Slow down before the next batch." },
  { variant: "default", title: "New comment", description: "Ava replied to your PR." },
  { variant: "success", title: "Backup complete", description: "Snapshot 240 saved to us-east-1." },
  { variant: "error", title: "Webhook failed", description: "Stripe retries in 30 seconds." },
];

const SURFACE: Record<string, string> = {
  default: "border-ink bg-paper text-ink",
  success: "border-ink-on-accent bg-green text-ink-on-accent",
  warning: "border-ink-on-accent bg-orange text-ink-on-accent",
  error: "border-ink-on-accent bg-pink text-ink-on-accent",
};
const MUTED: Record<string, string> = {
  default: "text-ink/80",
  success: "text-ink-on-accent/80",
  warning: "text-ink-on-accent/80",
  error: "text-ink-on-accent/80",
};

export function getStaticPaths() {
  return SEQUENCE.map((_, i) => ({
    params: { i: String(i) },
    props: { index: i },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const i = Number(params.i ?? 0);
  const item = SEQUENCE[i % SEQUENCE.length];
  const next = (i + 1) % SEQUENCE.length;
  const surface = SURFACE[item.variant];
  const muted = MUTED[item.variant];

  // The button inside each toast has hx-get pointing at the next index
  // with a 3s trigger — click "Start" once, and the same button keeps
  // polling itself, rotating through the sequence.
  const html = `<div
  role="status"
  class="pointer-events-auto flex w-full max-w-sm items-start gap-3 border-[3px] p-4 shadow-brutal-invert-lg ${surface} animate-[toast-in_0.15s_ease-out]"
>
  <div class="min-w-0 flex-1">
    <p class="font-heading font-bold">${item.title}</p>
    <p class="mt-1 text-sm ${muted}">${item.description}</p>
  </div>
  <button
    type="button"
    aria-label="Dismiss notification"
    class="flex size-6 shrink-0 items-center justify-center border-2 border-ink bg-paper font-bold hover:bg-pink"
    onclick="this.closest('[role=status]').remove()"
  >
    <span aria-hidden="true">×</span>
  </button>
  <button
    type="button"
    hx-get="/api/toast/${next}"
    hx-trigger="every 3s"
    hx-swap="beforeend"
    hx-target="#ht-toast-stream"
    style="display:none"
    aria-hidden="true"
  ></button>
</div>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
