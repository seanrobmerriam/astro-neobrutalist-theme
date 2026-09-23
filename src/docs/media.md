---
title: Media
description: Carousel, CarouselSlide, Gallery, Terminal, and the interactive WTerminal sandbox.
order: 9
---

## Carousel & CarouselSlide

`src/components/Carousel/Carousel.astro` wraps a horizontally-scrolling, CSS scroll-snap track with prev/next buttons. Each direct child should be a `CarouselSlide`.

**Carousel props:**

| Prop    | Type                                 | Default      |
| ------- | ------------------------------------ | ------------ |
| `label` | `string` (accessible carousel label) | `"Carousel"` |
| `class` | `string`                             | —            |

**CarouselSlide props:**

| Prop    | Type                                                   | Default |
| ------- | ------------------------------------------------------ | ------- |
| `class` | `string` — set a `max-w-*` here to control slide width | —       |

```astro
<Carousel label="Testimonials">
  <CarouselSlide class="max-w-sm">
    <div class="border-[3px] border-ink bg-yellow p-6 shadow-brutal">…</div>
  </CarouselSlide>
  <CarouselSlide class="max-w-sm">…</CarouselSlide>
</Carousel>
```

The prev/next buttons target each slide directly via `scrollIntoView()` rather than a computed pixel offset, and wrap around in both directions — clicking "next" on the last slide returns to the first.

## Gallery

`src/components/Gallery/Gallery.astro` — a responsive image grid; clicking any thumbnail opens a lightbox `<dialog>` (using the same shared dialog controller described in [Overlays](/docs/overlays)).

| Prop      | Type             | Default      |
| --------- | ---------------- | ------------ |
| `images`  | `{ src, alt }[]` | — (required) |
| `columns` | `2 \| 3 \| 4`    | `3`          |
| `class`   | `string`         | —            |

```astro
<Gallery
  columns={3}
  images={[
    { src: "/photos/01.jpg", alt: "…" },
    { src: "/photos/02.jpg", alt: "…" },
  ]}
/>
```

## Terminal

`src/components/Terminal/Terminal.astro` — a mock terminal/code window with real Shiki syntax highlighting, using a custom theme built entirely from this theme's own OKLCH palette (see `src/lib/shiki-theme.ts`) instead of a generic code-theme.

| Prop       | Type                                               | Default      |
| ---------- | -------------------------------------------------- | ------------ |
| `code`     | `string`                                           | — (required) |
| `filename` | `string`                                           | —            |
| `lang`     | `astro \| typescript \| javascript \| css \| bash` | `astro`      |
| `class`    | `string`                                           | —            |

```astro
---
import source from "../components/Button/Button.astro?raw";
---

<Terminal filename="Button.astro" code={source.trim()} />
```

Importing a component's source with Vite's `?raw` suffix (as shown above) means the displayed code can never drift out of sync with the real file — it's the same trick this documentation's [showcase page anatomy section](/#anatomy) uses.

The same `neubrutalTheme` object also styles fenced code blocks in this documentation's Markdown, via `markdown.shikiConfig` in `astro.config.mjs` — so every code block on this site, including the ones on this page, uses the same syntax colors.

## WTerminal

`src/blocks/Terminal/WTermBash.astro` — the interactive terminal imported as `WTerminal` in the [living showcase](/#WTerminal). It runs a Bash-like shell against an in-memory filesystem in the browser, using the DOM renderer from `@wterm/dom`, `BashShell` from `@wterm/just-bash`, and the WebAssembly terminal core from `@wterm/ghostty`. It needs client-side JavaScript and WebAssembly, but no framework hydration directive or backend service.

Use the static `Terminal` component above to display source code. Use `WTerminal` when visitors should type commands and explore sample files.

### Usage

From a page in `src/pages/`:

```astro
---
import WTerminal from "../blocks/Terminal/WTermBash.astro";
---

<WTerminal />
```

The current component declares no props or slots. In particular, `code`, `filename`, and `class` are not supported or forwarded. The showcase currently passes `code` and `filename`, but these do not affect the terminal; the example above is sufficient.

Render one instance per page: the implementation uses the fixed `id="wterm-sandbox"` and initializes it with `document.getElementById()`.

### Dependencies and WASM asset

The required packages and `public/ghostty-vt.wasm` are already included in this repository. Run `bun install` as usual. If copying the block into another Astro project, install its dependencies:

```sh
bun add @wterm/dom @wterm/just-bash @wterm/ghostty just-bash
```

Copy `node_modules/@wterm/ghostty/wasm/ghostty-vt.wasm` into that project's `public/ghostty-vt.wasm`. Refresh this copy when upgrading the Ghostty package so the JavaScript and WASM versions stay aligned.

The block imports `@wterm/dom/src/terminal.css` and loads its core with:

```ts
const core = await GhosttyCore.load({ wasmPath: "/ghostty-vt.wasm" });
```

Astro serves the public asset at `/ghostty-vt.wasm` and copies it into the production output. A deployment under a subpath needs a matching `wasmPath` instead of this root-relative URL. If the terminal stays blank, check that the WASM request succeeds and inspect the browser console; the component currently has no loading or error UI.

### Shell content and customization

The initial working directory is `/home/user`. Try these commands:

```bash
pwd
ls
cat welcome.txt
cat projects/demo.js
```

The component seeds three virtual files: `welcome.txt`, `projects/demo.js`, and `about.md`. These are strings in the `BashShell` configuration, not files read from the host machine. This integration does not persist shell edits across page reloads or provide a host shell for installing packages and running a development server.

Customize the implementation in `WTermBash.astro`:

| Setting               | Where to edit                                |
| --------------------- | -------------------------------------------- |
| Initial files         | `files` in the `BashShell` constructor       |
| Welcome text          | `greeting` in the `BashShell` constructor    |
| Prompt                | `prompt(cwd)` in the `BashShell` constructor |
| Blinking cursor       | `cursorBlink` in the `WTerm` constructor     |
| Height and appearance | The scoped `#wterm-sandbox` styles           |

The terminal is full width and 480px tall, with a blue background, square border, and hard shadow. Its text uses `--font-mono` (Alma Mono Regular), with ink and blue colors supplied by the theme tokens.

Initialization waits for the DOM when necessary, loads the WASM core, creates `WTerm`, and attaches shell output through `term.write(data)`. Keyboard input is forwarded to `shell.handleInput(data)`. The block does not currently include teardown or Astro client-navigation lifecycle handling.

### Similarly named prototype

`src/blocks/Terminal/WTerminal.astro` is a separate, unfinished prototype; it is not the block imported by the showcase. Its `term.bridge.write(...)` call currently fails type checking. Use `WTermBash.astro` for the documented sandbox.
