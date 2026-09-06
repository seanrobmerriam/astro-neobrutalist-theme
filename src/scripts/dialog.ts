// Shared open/close wiring for any <dialog>-based component (Modal, Drawer, Gallery).
// A trigger anywhere on the page opens a dialog via [data-dialog-open="<id>"];
// any element inside a dialog closes it via [data-dialog-close]; clicking the
// backdrop (the dialog element itself, outside its content box) also closes it.
// Imported once per component that needs it — the browser's module cache
// ensures this listener is only ever registered a single time per page.
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  const opener = target.closest<HTMLElement>("[data-dialog-open]");
  if (opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen ?? "");
    if (dialog instanceof HTMLDialogElement) dialog.showModal();
  }

  const closer = target.closest<HTMLElement>("[data-dialog-close]");
  if (closer) {
    closer.closest("dialog")?.close();
  }

  if (target instanceof HTMLDialogElement && event.target === target) {
    target.close();
  }
});

// Native <dialog> focus-trapping has a gap in some browsers: tabbing past the
// last focusable element inside an open modal briefly lands focus on <body>
// (nothing visibly focused) before the *next* Tab correctly wraps back to the
// first element. Intercept Tab at the two boundaries so the wrap happens on
// the same keystroke instead, with no dead stop in between.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;

  const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
  if (!dialog) return;

  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
});
