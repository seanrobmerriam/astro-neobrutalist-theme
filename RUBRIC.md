# Premium Astro Theme Quality Rubric

Use this rubric to evaluate whether an Astro theme is ready to be sold as a premium product. Score each criterion from **0–4**, multiply by its point value, and enforce the mandatory release gates separately.

## Scoring scale

| Score | Meaning                                        |
| ----: | ---------------------------------------------- |
|     0 | Missing, broken, or unusable                   |
|     1 | Present but substantially incomplete           |
|     2 | Functional, with noticeable limitations        |
|     3 | Polished and production-ready                  |
|     4 | Exceptional; meaningfully exceeds expectations |

For each section:

$$
\text{Section Score} =
\frac{\text{Average Criterion Rating}}{4}
\times
\text{Section Weight}
$$

## Final rating

|    Total | Classification                       |
| -------: | ------------------------------------ |
|   95–100 | Exceptional premium theme            |
|    90–94 | Strong premium theme                 |
|    80–89 | Market-ready with minor improvements |
|    70–79 | Good foundation, not yet premium     |
|    60–69 | Significant refinement required      |
| Below 60 | Not commercially ready               |

A theme must also pass every mandatory release gate, regardless of its numerical score.

---

# 1. Visual Design and Art Direction — 12 points

| Criterion          | Premium standard                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Design concept     | Has a clear visual concept appropriate for its intended audience rather than looking like a generic component collection. |
| Originality        | Avoids obvious imitation, default framework styling, and common template-marketplace clichés.                             |
| Visual consistency | Color, spacing, typography, borders, shadows, imagery, and iconography follow a coherent system.                          |
| Composition        | Pages demonstrate intentional hierarchy, rhythm, balance, density, and use of whitespace.                                 |
| Typography         | Uses a deliberate type scale, readable line lengths, appropriate weights, and consistent text roles.                      |
| Color system       | Colors have clear semantic roles and work together across backgrounds, components, and states.                            |
| Imagery            | Images have a consistent subject, treatment, aspect-ratio strategy, and art direction.                                    |
| Detail quality     | Small details—dividers, icons, hover states, controls, captions, and empty space—feel considered.                         |
| Brand neutrality   | Buyers can replace the sample brand without fighting assumptions embedded throughout the design.                          |
| Template identity  | The theme is visually recognizable without making every page repetitive.                                                  |
| Content realism    | Demo content resembles a credible finished website rather than placeholder filler.                                        |
| Perceived value    | The finished demo immediately looks valuable enough to justify a premium price.                                           |

---

# 2. Layout and Responsive Behavior — 8 points

| Criterion               | Premium standard                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Mobile-first behavior   | Every page is intentionally designed for small screens, not merely compressed.                               |
| Breakpoint quality      | Layout changes happen where the content requires them rather than at arbitrary device widths.                |
| Fluid sizing            | Typography, spacing, and containers scale smoothly where appropriate.                                        |
| Container system        | Page widths and gutters remain consistent across sections and templates.                                     |
| Content reflow          | Navigation, tables, cards, grids, forms, media, and sidebars reflow without clipping or awkward stacking.    |
| Touch usability         | Interactive targets are comfortably sized and spaced on touch devices.                                       |
| Zoom support            | The site remains usable at 200% browser zoom and with increased text size.                                   |
| Orientation support     | Important layouts work in narrow portrait and wider landscape configurations.                                |
| Long-content resilience | Components tolerate long titles, translations, missing images, and varying amounts of content.               |
| No fragile positioning  | Content does not depend on fixed heights or pixel-perfect absolute positioning unless genuinely appropriate. |

---

# 3. Information Architecture and Page Coverage — 7 points

| Criterion               | Premium standard                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| Target-market fit       | Page selection matches the needs of the theme’s stated audience.                                |
| Complete user journey   | Buyers can assemble a credible website without designing major missing pages themselves.        |
| Navigation architecture | Primary, secondary, utility, mobile, and footer navigation are logically organized.             |
| Page hierarchy          | Index, listing, detail, conversion, support, and legal pages have distinct purposes.            |
| URL design              | Routes are understandable, consistent, and free from unnecessary coupling to demo content.      |
| Error states            | Includes a useful, branded 404 page and appropriate empty or failure states.                    |
| Content discovery       | Search, filtering, tags, categories, pagination, or related content are included when relevant. |
| Conversion paths        | Calls to action form intentional paths rather than appearing randomly throughout pages.         |
| Legal foundations       | Includes adaptable privacy, terms, cookie, licensing, or disclosure pages when relevant.        |
| Sitemap completeness    | Every demo page is reachable and no abandoned or duplicate pages remain.                        |

Examples of market-dependent page coverage might include:

* Homepage
* About
* Contact
* Pricing
* Services or features
* Blog or resources
* Article detail
* Category and tag archives
* Author profile
* Case studies or portfolio
* FAQ
* Testimonials
* Team
* Careers
* Newsletter confirmation
* Search
* 404
* Privacy and terms

Not every theme needs every page. Premium quality means supplying the pages necessary for the advertised use case.

---

# 4. Components and Design System — 10 points

| Criterion            | Premium standard                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Token system         | Colors, spacing, typography, radii, shadows, borders, layers, and motion use centralized tokens.                      |
| Semantic naming      | Tokens and component APIs describe purpose rather than incidental appearance.                                         |
| Component boundaries | Components have focused responsibilities and can be understood independently.                                         |
| Reusability          | Repeated UI is implemented once and configured through explicit props, slots, or content data.                        |
| Composition          | Complex sections are assembled from smaller components without excessive prop drilling.                               |
| Variant quality      | Variants are deliberate, documented, and consistent rather than accumulated special cases.                            |
| Prop typing          | Public component props are strongly typed and provide sensible defaults.                                              |
| Slot design          | Slots are used where buyers need flexible content composition.                                                        |
| HTML passthrough     | Wrapper components accept appropriate native HTML attributes where useful.                                            |
| State coverage       | Components include hover, focus, active, selected, disabled, loading, empty, success, and error states as applicable. |
| Content resilience   | Components handle long, short, missing, and user-generated content gracefully.                                        |
| Icon system          | Icons share a consistent visual style and accessible implementation.                                                  |
| Form system          | Inputs, labels, descriptions, validation messages, grouping, and submission states are consistent.                    |
| Isolation            | Changing one component or token does not unpredictably break unrelated pages.                                         |
| Discoverability      | Buyers can quickly locate the component responsible for a visible part of the demo.                                   |

---

# 5. Astro Architecture and Code Quality — 10 points

Astro treats component code as TypeScript and recommends strict or strictest TypeScript configurations for typed projects. A premium theme should take advantage of that rather than relying on loosely typed data and props. [Astro TypeScript documentation](https://docs.astro.build/en/guides/typescript/)

| Criterion                 | Premium standard                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Current Astro practices   | Uses supported, current Astro APIs without deprecated conventions.                                          |
| Static-first architecture | Defaults to static HTML and adds runtime rendering only where the use case requires it.                     |
| Minimal client JavaScript | Interactive islands are used selectively and hydration directives are chosen intentionally.                 |
| Framework restraint       | React, Vue, Svelte, or another UI runtime is included only when it provides real value.                     |
| Type safety               | Uses strict TypeScript, typed props, typed configuration, and typed content structures.                     |
| Project organization      | Components, layouts, pages, content, data, styles, scripts, assets, and utilities have clear locations.     |
| Layout architecture       | Shared document metadata, headers, footers, and page structures are implemented through composable layouts. |
| Data separation           | Reusable content is not unnecessarily hard-coded inside presentation components.                            |
| Import quality            | Uses predictable imports and aliases without confusing resolution tricks.                                   |
| Naming                    | Files, components, props, tokens, and routes use consistent naming conventions.                             |
| Readability               | Code is straightforward and does not use abstraction merely to appear sophisticated.                        |
| Duplication               | Repeated structures and business rules are appropriately consolidated.                                      |
| Dependency discipline     | Every dependency has a clear purpose and unnecessary packages are removed.                                  |
| Configuration clarity     | `astro.config.*`, TypeScript, linting, formatting, and integration configuration are understandable.        |
| Build cleanliness         | Development and production builds complete without warnings attributable to the theme.                      |

---

# 6. Content Architecture and CMS Readiness — 7 points

Astro Content Collections provide schema validation, editor assistance, and type-safe content APIs for structured local or remote content. Premium content-heavy themes should use them where appropriate. [Astro Content Collections documentation](https://docs.astro.build/en/guides/content-collections/)

| Criterion            | Premium standard                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| Structured content   | Repeated content types use collections or clearly defined data structures.                            |
| Schema validation    | Required fields, optional fields, formats, references, and defaults are validated.                    |
| Authoring experience | Buyers can add content without editing presentation code.                                             |
| Example content      | Includes enough realistic content to demonstrate listings, detail pages, tags, media, and pagination. |
| Frontmatter quality  | Fields are predictable, documented, and free from page-specific hacks.                                |
| Asset relationships  | Featured images, social images, authors, categories, and related entries are modeled clearly.         |
| Draft support        | Content can be marked as draft or excluded from production where relevant.                            |
| Date handling        | Published, updated, scheduled, and formatted dates are handled consistently.                          |
| Taxonomy             | Categories and tags have clear semantics and avoid unnecessary duplication.                           |
| Content portability  | Sample content can be replaced without restructuring the entire site.                                 |
| CMS pathway          | Documentation explains how the content layer could be connected to a headless CMS when applicable.    |
| Empty collections    | The site builds and renders reasonably when optional collections contain few or no entries.           |

---

# 7. Accessibility — 10 points

Accessibility is a release requirement, not an optional enhancement.

| Criterion              | Premium standard                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Semantic HTML          | Uses landmarks, headings, lists, buttons, links, forms, tables, and disclosure elements correctly.               |
| Heading hierarchy      | Every page has a logical heading structure without skipped levels used for appearance.                           |
| Keyboard access        | Every action can be completed using a keyboard alone.                                                            |
| Focus visibility       | Focus indicators are obvious, consistent, and never removed without replacement.                                 |
| Focus order            | Keyboard navigation follows the visual and logical reading order.                                                |
| Focus management       | Dialogs, menus, drawers, and route transitions manage focus appropriately.                                       |
| Skip navigation        | Repeated navigation can be bypassed.                                                                             |
| Accessible names       | Controls, icon buttons, fields, regions, and media have meaningful accessible names.                             |
| Color contrast         | Text, controls, borders, states, and focus indicators meet WCAG AA contrast expectations.                        |
| Color independence     | Meaning is never communicated through color alone.                                                               |
| Form accessibility     | Labels, instructions, required states, errors, and field relationships are programmatically connected.           |
| Motion preferences     | Animations respect `prefers-reduced-motion`.                                                                     |
| Screen-reader behavior | Dynamic and interactive components communicate names, roles, values, and state changes correctly.                |
| Media alternatives     | Meaningful images have useful alternative text; decorative images are hidden appropriately.                      |
| Zoom and reflow        | Content remains usable at increased zoom and text size without two-dimensional scrolling except where necessary. |
| Automated audit        | Automated checks report no serious accessibility violations.                                                     |
| Manual audit           | Keyboard and screen-reader smoke tests cover primary journeys.                                                   |

---

# 8. Performance and Asset Efficiency — 8 points

Astro’s core model emphasizes shipping minimal JavaScript, while its image tools support optimized formats and reduced layout shift. Premium themes should preserve those advantages. [Astro features](https://astro.build/)

| Criterion              | Premium standard                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| JavaScript budget      | Ships little or no client JavaScript on non-interactive pages.                                                 |
| Hydration strategy     | Uses the least aggressive hydration directive appropriate to each island.                                      |
| Image optimization     | Responsive images have appropriate dimensions, formats, sizes, and loading behavior.                           |
| Layout stability       | Images, embeds, advertisements, and dynamic elements reserve space.                                            |
| Font loading           | Fonts are subset where practical, preloaded selectively, and configured to minimize blocking and layout shift. |
| CSS efficiency         | Avoids large unused stylesheets, excessive specificity, and duplicated utility output.                         |
| Dependency weight      | Heavy client libraries are avoided for trivial interactions.                                                   |
| Critical rendering     | Above-the-fold content is not delayed by optional scripts or third-party services.                             |
| Lazy loading           | Offscreen media and expensive enhancements load only when needed.                                              |
| Third-party scripts    | Analytics, embeds, video, maps, and widgets use privacy- and performance-conscious loading strategies.         |
| Caching                | Static assets use fingerprinting and deployment-appropriate caching behavior.                                  |
| Production testing     | Performance is measured against the built production site, not only the development server.                    |
| Mobile performance     | Testing includes throttled mobile conditions rather than desktop-only results.                                 |
| Performance regression | Important page types have documented budgets or repeatable checks.                                             |

Recommended release targets for representative pages:

| Metric                    |                                      Target |
| ------------------------- | ------------------------------------------: |
| Lighthouse Performance    |                                         90+ |
| Lighthouse Accessibility  |                                         95+ |
| Lighthouse Best Practices |                                         95+ |
| Lighthouse SEO            |                                         95+ |
| Largest Contentful Paint  |                               ≤ 2.5 seconds |
| Interaction to Next Paint |                                    ≤ 200 ms |
| Cumulative Layout Shift   |                                       ≤ 0.1 |
| Initial client JavaScript | As close to zero as the feature set permits |

These are targets, not permission to manipulate audits by removing realistic content.

---

# 9. SEO and Content Discovery — 7 points

| Criterion                   | Premium standard                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| Metadata architecture       | Titles, descriptions, canonical URLs, robots directives, and social metadata are managed centrally. |
| Unique metadata             | Every indexable page can produce an appropriate unique title and description.                       |
| Canonical URLs              | Canonicals are absolute and accurately reflect the preferred URL.                                   |
| Open Graph                  | Provides suitable social title, description, URL, image, and content type.                          |
| Social images               | Includes configurable default images and supports page-specific overrides.                          |
| Structured data             | Uses valid JSON-LD for applicable content without claiming unsupported facts.                       |
| Sitemap                     | Generates a correct sitemap containing public canonical pages.                                      |
| Robots handling             | Includes intentional indexing rules for production and safe behavior for previews.                  |
| RSS                         | Content themes include a valid feed when appropriate.                                               |
| Pagination                  | Paginated archives use crawlable links and sensible metadata.                                       |
| Internal linking            | Important pages are connected contextually, not only through global navigation.                     |
| URL stability               | Slugs and permalink conventions are predictable.                                                    |
| Heading and content quality | Pages provide meaningful text structure rather than image-only marketing layouts.                   |
| Error handling              | Missing pages return the correct status where the deployment model allows it.                       |
| SEO configurability         | Buyers can update global identity, URLs, social accounts, and defaults in one obvious location.     |

Astro supports integrations for capabilities such as sitemap generation, SSR adapters, MDX, and framework renderers. Premium themes should integrate only what serves the advertised product. [Astro integrations documentation](https://docs.astro.build/en/guides/integrations/)

---

# 10. Customization and Buyer Experience — 8 points

| Criterion                 | Premium standard                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Configuration entry point | Global site identity, navigation, contact information, social links, and defaults live in obvious configuration files. |
| Brand replacement         | Name, logo, favicon, colors, fonts, and imagery can be replaced without searching the entire project.                  |
| Design tokens             | Most visual customization happens through tokens rather than editing individual components.                            |
| Component APIs            | Common changes are supported through props, slots, variants, or content data.                                          |
| Feature toggles           | Optional sections can be disabled cleanly without leaving broken spacing or imports.                                   |
| Sample isolation          | Demo-specific content is distinguishable from reusable theme code.                                                     |
| Styling predictability    | Buyers can identify which layer controls global, component, utility, and content styles.                               |
| Safe modification         | Customizations survive routine dependency updates and do not require patching installed packages.                      |
| Escape hatches            | Advanced users can extend components and styles without rewriting the architecture.                                    |
| Environment configuration | External services and secrets are represented with a complete `.env.example`.                                          |
| Sensible defaults         | The theme looks finished immediately after installation.                                                               |
| Minimal lock-in           | Buyers are not unnecessarily tied to a hosting provider, CMS, analytics service, or UI framework.                      |
| Cleanup guide             | Documentation explains how to remove optional demo features and dependencies.                                          |

---

# 11. Documentation and Onboarding — 7 points

| Criterion             | Premium standard                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Quick start           | A buyer can install dependencies, run development, build, and preview without guesswork.                |
| Prerequisites         | Supported runtime, package manager, Astro version, and required accounts are stated.                    |
| Project map           | Documentation explains what each important directory and configuration file contains.                   |
| Customization guide   | Covers branding, typography, colors, navigation, content, layouts, and components.                      |
| Content guide         | Explains schemas, frontmatter, images, authors, tags, drafts, and publishing.                           |
| Component reference   | Documents reusable components, props, slots, variants, and examples.                                    |
| Deployment guide      | Covers static or server-rendered deployment requirements accurately.                                    |
| Integration guide     | Explains analytics, forms, CMSs, search, email, commerce, or authentication when included.              |
| Environment variables | Every variable is documented with purpose, requirement, and example format.                             |
| Troubleshooting       | Covers likely installation, build, image, path, adapter, and deployment issues.                         |
| Upgrade guide         | Explains how buyers receive and apply updates.                                                          |
| Changelog             | Releases clearly identify fixes, changes, migrations, and breaking changes.                             |
| License explanation   | Buyers can understand permitted commercial and client use.                                              |
| No hidden knowledge   | The theme does not depend on instructions provided only in marketing copy or support messages.          |
| Writing quality       | Instructions are concise, accurate, grammatical, and tested by following them from a clean environment. |

A premium theme should support the standard Astro creation and build workflow cleanly, including installation as a starter template where that distribution model is advertised.

---

# 12. Testing, Reliability, and Maintenance — 6 points

Astro documents both component testing and end-to-end browser testing, including Playwright coverage across Chromium, Firefox, and WebKit. [Astro testing documentation](https://docs.astro.build/en/guides/testing/)

| Criterion            | Premium standard                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Type checking        | `astro check` or an equivalent type-checking command passes.                                       |
| Production build     | A clean production build succeeds from a fresh clone.                                              |
| Preview verification | The built output is tested through the intended preview or server environment.                     |
| Unit coverage        | Utilities and content transformations with meaningful logic have focused tests.                    |
| Component coverage   | Important reusable components have rendering or interaction tests where valuable.                  |
| End-to-end coverage  | Primary navigation, forms, menus, search, theme switching, and conversion journeys are tested.     |
| Browser coverage     | Critical behavior is checked in Chromium, Firefox, and WebKit or documented supported browsers.    |
| Responsive testing   | Important pages are checked at multiple small, medium, and large viewport sizes.                   |
| Link validation      | Internal links, assets, anchors, canonical URLs, and feeds are checked.                            |
| Content edge cases   | Tests include missing optional fields, long text, empty collections, and unusual media dimensions. |
| Lint and formatting  | Repeatable commands enforce consistent code and content formatting.                                |
| Dependency health    | Dependencies are current, justified, and free of known critical vulnerabilities.                   |
| CI                   | Automated checks run on pushes or pull requests.                                                   |
| Reproducibility      | Lockfiles are committed and installation is reliable in a clean environment.                       |
| Maintenance intent   | Buyers are told which Astro versions are supported and how long updates will be provided.          |

---

# 13. Security, Privacy, and Production Safety — 4 points

| Criterion                | Premium standard                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Secret handling          | No secrets, private URLs, tokens, or credentials are committed.                                                     |
| Environment separation   | Public and server-only environment variables are clearly distinguished.                                             |
| Form safety              | Forms document required server-side validation, spam protection, and submission handling.                           |
| HTML safety              | Untrusted HTML is not rendered without sanitization.                                                                |
| External links           | Links using new tabs include appropriate protection where needed.                                                   |
| Dependency safety        | The theme contains no abandoned, suspicious, or unnecessary packages.                                               |
| Third-party transparency | Analytics, fonts, embeds, cookies, and trackers are disclosed.                                                      |
| Privacy defaults         | Optional tracking is disabled until intentionally configured where practical.                                       |
| Security headers         | Recommended production headers are documented when deployment-specific configuration is required.                   |
| Demo protection          | Demo endpoints cannot accidentally send mail, process payments, or expose private data when copied into production. |

---

# 14. Deployment and Portability — 3 points

| Criterion            | Premium standard                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Output mode clarity  | Clearly states whether the theme is static, server-rendered, hybrid, or adaptable.           |
| Adapter clarity      | Server-rendered features document their required Astro adapter.                              |
| Static compatibility | Static themes do not depend on server-only behavior.                                         |
| Base-path support    | Assets and links work when deployed under a subpath if that capability is advertised.        |
| Platform neutrality  | Core functionality is not unintentionally tied to the demo host.                             |
| Deployment examples  | Includes at least one verified production deployment path.                                   |
| Failure clarity      | Build-time errors explain missing environment variables or configuration.                    |
| Preview parity       | The hosted demo accurately represents the product buyers receive.                            |
| Clean output         | Production output contains no debug tools, source demo secrets, or development-only scripts. |

---

# 15. Commercial Product Quality — 3 points

| Criterion               | Premium standard                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Accurate listing        | Marketing claims match the code, pages, integrations, and support actually included.                       |
| Demo quality            | The public demo is fast, complete, responsive, and free of broken links or unfinished sections.            |
| Feature differentiation | The product has a clear reason to be chosen over free starters and competing themes.                       |
| Audience clarity        | Buyers immediately understand who the theme is for and what it helps them build.                           |
| Licensing               | Personal, commercial, client, redistribution, and resale rights are unambiguous.                           |
| Asset licensing         | Fonts, icons, photos, illustrations, and demo assets have valid distribution rights.                       |
| Support policy          | Support channels, scope, hours, response expectations, and exclusions are stated.                          |
| Update policy           | Buyers know whether updates are lifetime, subscription-based, or version-limited.                          |
| Versioning              | Releases follow a predictable versioning policy.                                                           |
| Product packaging       | Download contents are organized and contain no build caches, private files, or irrelevant source material. |
| Honest dependencies     | Required paid accounts, services, plugins, or external licenses are disclosed before purchase.             |
| Refund expectations     | Marketplace or vendor refund terms are discoverable.                                                       |

---

# Mandatory Release Gates

A theme cannot be labeled premium if any of these fail:

* [ ] Installs successfully from a clean clone using documented commands.
* [ ] Production build completes without theme-generated errors or warnings.
* [ ] All advertised pages, components, and features are included.
* [ ] No broken internal links, missing assets, or dead navigation items exist.
* [ ] Primary user journeys work without JavaScript errors.
* [ ] Keyboard navigation works throughout the site.
* [ ] No serious automated accessibility violations remain.
* [ ] Text and interactive elements meet WCAG AA contrast requirements.
* [ ] Mobile layouts have no unintended horizontal overflow.
* [ ] Representative pages score at least 90 in Lighthouse Performance.
* [ ] Representative pages score at least 95 in Lighthouse Accessibility, SEO, and Best Practices.
* [ ] Critical responsive layouts are manually checked on small, medium, and large screens.
* [ ] Metadata, canonical URLs, favicon, sitemap, robots behavior, and social previews are valid.
* [ ] All sample secrets, private credentials, personal data, and debug code are removed.
* [ ] Every bundled asset has redistribution rights.
* [ ] License, support policy, compatibility, and external requirements are documented.
* [ ] Installation and customization documentation has been followed successfully by someone other than the author.
* [ ] The hosted demo represents the exact product being sold.
* [ ] A buyer can replace the sample brand without reconstructing the theme.
* [ ] The theme has a documented Astro and Node compatibility range.

# Premium Differentiators

These are not required for every theme, but they can distinguish an exceptional product:

* Multiple complete homepage compositions rather than minor hero variations
* Light, dark, and system color modes
* Carefully art-directed dark mode rather than mechanically inverted colors
* Internationalization and right-to-left layout support
* Search with a no-service static option
* CMS integration examples
* Configurable MDX components
* Automatic social-image generation
* Accessible view transitions
* Print styles for relevant page types
* Command-palette navigation
* Schema-validated global configuration
* Component showcase or internal design-system page
* Visual regression testing
* Automated dependency and accessibility checks
* Multiple deployment examples
* Migration scripts for breaking updates
* Figma design source matching the implemented theme
* Documented extension recipes
* Sample integration branches that keep the core theme lightweight
* Import scripts or sample data generators
* Reduced-motion, high-contrast, and forced-colors support

# Final Reviewer Questions

Before approving the theme, the reviewer should be able to answer “yes” to each of these:

1. Does this look like a deliberate product rather than a dressed-up starter?
2. Can the intended customer build a complete website from what is included?
3. Can a buyer understand the architecture without contacting the author?
4. Can branding and content be replaced without editing dozens of files?
5. Does the theme preserve Astro’s static-first, minimal-JavaScript strengths?
6. Are components genuinely reusable rather than copied between pages?
7. Does the site remain polished with real-world content and edge cases?
8. Is it accessible using a keyboard, screen reader, zoom, and reduced motion?
9. Does the production build perform well on realistic mobile conditions?
10. Are SEO, metadata, structured content, and deployment handled as product features?
11. Is every advertised feature tested and documented?
12. Would a professional developer feel that the theme saved substantial design and engineering time?

A premium Astro theme is not simply a beautiful demo. It is a maintainable, adaptable, accessible, well-documented product that reduces the buyer’s design and engineering workload without transferring hidden technical debt to them.
