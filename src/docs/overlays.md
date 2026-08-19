---
title: Overlays
description: Modal, Drawer, Toast, ToastViewport, and SpeedDial.
order: 7
---

Modal, Drawer, and Gallery's lightbox all share one small controller script (`src/scripts/dialog.ts`) instead of each wiring up their own open/close logic. Anywhere on the page, a `data-dialog-open="<id>"` attribute opens the `<dialog>` with that id; `data-dialog-close` (anywhere inside a dialog) closes it; clicking the backdrop also closes it. It's imported once per component that needs it — the browser's module cache means the listener only ever registers once per page, no matter how many Modals or Drawers are on it.

## Modal

`src/components/Modal/Modal.astro`

| Prop | Type | Default |
|---|---|---|
| `id` | `string` — matched by triggers | — (required) |
| `title` | `string` | — |
| `class` | `string` | — |

```astro
<Button data-dialog-open="confirm-modal">Delete account</Button>

<Modal id="confirm-modal" title="Are you sure?">
  <p>This can't be undone.</p>
  <Button data-dialog-close variant="danger">Confirm</Button>
</Modal>
```

## Drawer

`src/components/Drawer/Drawer.astro` — same trigger pattern as Modal, slides in from an edge instead of centering.

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | — (required) |
| `title` | `string` | — |
| `side` | `left \| right` | `right` |
| `class` | `string` | — |

```astro
<Button data-dialog-open="cart-drawer">Open cart</Button>

<Drawer id="cart-drawer" title="Your cart" side="right">
  <p>Cart contents go here.</p>
</Drawer>
```

## Toast & ToastViewport

`src/components/Toast/Toast.astro` is the static, presentational card. `src/components/Toast/ToastViewport.astro` is the piece that actually matters at runtime — include it **once**, anywhere in your layout, and it exposes `window.showToast()` plus a declarative `data-toast-trigger` attribute.

```astro
<!-- once, in your layout -->
<ToastViewport />

<!-- anywhere on the page -->
<Button data-toast-trigger data-toast-title="Saved" data-toast-description="Your changes were saved." data-toast-variant="success">
  Save
</Button>
```

Or imperatively:

```js
window.showToast({ title: "Saved", variant: "success", duration: 4000 });
```

`variant` is `default \| success \| error \| warning`. Toasts render fixed near the top-right of the viewport and auto-dismiss (paused on hover).

## SpeedDial

`src/components/SpeedDial/SpeedDial.astro` — a floating action button that fans out slotted actions on click.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (accessible label for the toggle) | `"Open actions"` |
| `class` | `string` | — |

```astro
<SpeedDial label="Quick actions">
  <a href="#top" aria-label="Back to top">…</a>
  <button type="button" data-dialog-open="cart-drawer" aria-label="Open cart">…</button>
</SpeedDial>
```

Slot content is up to you — usually a couple of small circular buttons or links, each with its own `aria-label`.
