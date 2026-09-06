// `z.coerce.date()` on a bare frontmatter date ("2026-08-02") parses it as
// UTC midnight. Without `timeZone: "UTC"` here, `toLocaleDateString` renders
// it in the server/build machine's local timezone instead, which can shift
// the displayed date back a full day (UTC midnight Aug 2 becomes 5pm Aug 1
// in US timezones). Content authors write a calendar date, not an instant —
// it should display exactly as written, regardless of where it's built.
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
