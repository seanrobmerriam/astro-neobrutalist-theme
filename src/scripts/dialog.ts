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
