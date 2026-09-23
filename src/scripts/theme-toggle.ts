// Cycles [data-theme-toggle] buttons through system -> light -> dark -> system.
// "System" is represented by the *absence* of a stored preference / the
// [data-theme] attribute, letting the prefers-color-scheme media query in
// global.css take over. The blocking inline script in Layout.astro's <head>
// (not this file, which loads as a normal deferred module) is what applies
// the stored preference before first paint, to avoid a flash of the wrong
// theme — this file only needs to handle clicks and keep button labels in
// sync after that.
type Theme = "light" | "dark" | null;

function getStored(): Theme {
  try {
    const value = localStorage.getItem("theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage can be unavailable (private browsing, disabled); the
      // attribute is still set for this page load either way.
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.removeItem("theme");
    } catch {
      // See above.
    }
  }
  updateButtons(theme);
}

function updateButtons(theme: Theme) {
  const label =
    theme === null
      ? "Light theme (click for dark)"
      : theme === "light"
        ? "Light theme (click for dark)"
        : "Dark theme (click for light)";
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", label);
    button.dataset.currentTheme = theme ?? "light";
  });
}

document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = getStored();
    const next: Theme = current === "dark" ? "light" : "dark";
    apply(next);
  });
});

updateButtons(getStored());
