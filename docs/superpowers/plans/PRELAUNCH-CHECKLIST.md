# Pre-launch checklist — commercial claims removed 2026-09-05

`src/pages/landing.astro` originally advertised deliverables that don't exist
in the repo. Per RUBRIC.md gate *"All advertised pages, components, and
features are included"* and finding P0-4, those bullets were removed from the
pricing tiers rather than left as false claims. This is the list of what to
actually build (or permanently drop) before adding each one back:

| Removed claim | What has to exist before it goes back on the pricing page |
|---|---|
| **Figma source files** (Pro tier) | A maintained Figma file mirroring the shipped components/blocks. This is real production work — a from-scratch design file, not an export. |
| **Priority email support** (Pro tier) | A support inbox or ticketing address, a stated response-time SLA, and someone committed to monitoring it. |
| **Lifetime updates** (Pro tier) | An actual update-delivery mechanism (versioned releases + a way buyers are notified/pull them) and a `CHANGELOG.md`. See Phase 2/6 of `2026-09-04-rubric-remediation.md`. |
| **Private Discord channel** (Team tier) | A created, moderated Discord server with an invite/onboarding flow for verified buyers. |
| **"MIT license" bullet** (was on Free tier) | Replaced outright — MIT is incompatible with a tiered commercial license. See `LICENSE.md`, which now defines Personal/Pro/Team tiers instead. `LICENSE.md` still has `[YOUR LEGAL NAME OR COMPANY]` and `[SUPPORT/CONTACT EMAIL]` placeholders that need real values, ideally reviewed by a lawyer before it's presented to a paying customer. |

Until these exist, the pricing tiers on `/landing` are intentionally thinner
than they were — Pro and Team differ from Personal mainly by license scope,
which is honest but not much of a sales pitch. That's expected: Phase 1 of
the remediation plan is "legal and truth," not "commercial polish." Building
real differentiation back in (support, updates, Figma) is Phase 2/6 work,
and CTA buttons across all three tiers still point at `#` pending an actual
checkout flow.
