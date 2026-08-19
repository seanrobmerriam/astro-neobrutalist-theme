# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a marketing landing page at `/landing`, plus index-only `/blog` and `/portfolio` stub pages, composed from the existing Astro block/component library.

**Architecture:** Extend three existing components (`Accordion`, `Hero`, `FeatureGrid`) with new default-preserving props, add three new primitive+block pairs (`PricingCard`/`Pricing`, `TestimonialCard`/`Testimonials`, `FAQ`), then assemble three new page files. `src/pages/index.astro` (the component showcase) is never modified.

**Tech Stack:** Astro 7.2.2, Tailwind CSS v4 (`@theme` tokens in `src/styles/global.css`), no client framework, no test runner.

**Spec:** `docs/superpowers/specs/2026-08-19-landing-page-redesign-design.md`

## Global Constraints

- Node **>=22.12.0** is required to run `astro` (package.json `engines`, and Astro/Vite's own check). If a shell's default `node -v` is older, prefix every command below with a matching nvm environment, e.g. `export PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH"` (any installed version >=22.12.0 works — check `nvm ls`).
- Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`). Do not use `npm`/`yarn`.
- **No test framework exists in this project** (confirmed: no test script in `package.json`, no test files anywhere). `@astrojs/check` is also not installed — do not add it as a side effect of this work. Verification for every task in this plan is: start/confirm the dev server, `curl` the affected route, and `grep` the response for expected content. This is the project's real, current verification method (see spec's Testing section) — not a shortcut.
- All new/modified `.astro` files must follow the existing component convention: typed `Props` interface, `class?: string` merged via `class:list`, `Record<Variant, string>` maps for variant/accent styling (see `src/components/Button/Button.astro` and `src/components/Card/Card.astro` as reference).
- Square corners, thick borders, hard offset shadows (`shadow-brutal*` tokens), and the six flat accent colors (`yellow`, `pink`, `blue`, `green`, `orange`, `lavender`) are the only visual language in this theme — no gradients, no blur, no border-radius.
- Copy for every section is fixed by the spec (verbatim in the tasks below) — do not paraphrase it.

## Dev server helper

Every task's verification step uses this pattern. It starts the background dev server only if one isn't already running, and is safe to run repeatedly:

```bash
export PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH"  # adjust to any installed >=22.12.0 version
cd /Users/sean/projects/01-main-workspace/projects/astro-neubrutalist-theme
./node_modules/.bin/astro dev status >/dev/null 2>&1 || ./node_modules/.bin/astro dev --background
sleep 1
```

---

### Task 1: Make `Accordion.astro` data-driven

**Files:**
- Modify: `src/components/Accordion/Accordion.astro` (currently no frontmatter — 3 hardcoded `<details>` blocks)

**Interfaces:**
- Produces: `Props.items?: { question: string; answer: string }[]` — defaults to the component's current 3 FAQ entries, so any existing call site (`<Accordion />`, no props) renders byte-for-byte the same questions/answers as today.

- [ ] **Step 1: Confirm current behavior on the showcase page (baseline)**

```bash
export PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH"
cd /Users/sean/projects/01-main-workspace/projects/astro-neubrutalist-theme
./node_modules/.bin/astro dev status >/dev/null 2>&1 || ./node_modules/.bin/astro dev --background
sleep 1
curl -s http://localhost:4321/ | grep -o "What are the basic features?"
```

Expected: prints `What are the basic features?` (proves the current hardcoded Accordion renders on `/`).

- [ ] **Step 2: Rewrite `Accordion.astro` with a typed, defaulted `items` prop**

Replace the entire file contents with:

```astro
---
interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items?: FaqItem[];
  class?: string;
}

const {
  items = [
    {
      question: "What are the basic features?",
      answer:
        "A full component library — buttons, cards, forms, tables, modals, and more — plus blocks and layouts, all built with Tailwind CSS v4 and typed Astro props.",
    },
    {
      question: "How do I get started?",
      answer:
        "Copy any component into your project, or clone the whole theme and start editing the page in src/pages/index.astro.",
    },
    {
      question: "What support options are available?",
      answer:
        'The theme ships as plain, readable Astro files — check the "Anatomy of a component" section further down this page to see exactly how one is built.',
    },
  ],
  class: className,
} = Astro.props;
---

<div class:list={["flex flex-col gap-3", className]}>
  {
    items.map((item) => (
      <details class="group [&_summary::-webkit-details-marker]:hidden">
        <summary class="flex cursor-pointer items-center justify-between gap-4 border-2 border-ink bg-paper px-4 py-3 font-heading font-semibold text-ink shadow-brutal-sm hover:bg-yellow focus:bg-yellow focus:outline-none">
          <span>{item.question}</span>

          <svg aria-hidden="true" class="size-5 shrink-0 group-open:-rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div class="p-4">
          <p class="text-ink/80">{item.answer}</p>
        </div>
      </details>
    ))
  }
</div>
```

- [ ] **Step 3: Verify the showcase page still renders identically**

```bash
curl -s http://localhost:4321/ | grep -o "What are the basic features?"
curl -s http://localhost:4321/ | grep -o "What support options are available?"
```

Expected: both grep commands print their matched text. If the dev server shows a compile error instead (check with `./node_modules/.bin/astro dev logs`, or read the terminal it's running in if it wasn't started with `--background`), fix the syntax before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/components/Accordion/Accordion.astro
git commit -m "$(cat <<'EOF'
Make Accordion.astro data-driven via an items prop

Defaults to the existing 3 FAQ entries so the showcase page's
prop-less usage is unaffected; enables reuse for the new FAQ block.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add a `split` layout to `Hero.astro`

**Files:**
- Modify: `src/blocks/Hero/Hero.astro`

**Interfaces:**
- Consumes: `Button` (`src/components/Button/Button.astro`) — already imported.
- Produces: `Props.layout?: "centered" | "split"` (default `"centered"`, preserving current rendering). In `"split"` mode, a named slot `graphic` renders in the right column; below `lg:`, the graphic stacks under the text column.

- [ ] **Step 1: Confirm current behavior on the showcase page (baseline)**

```bash
curl -s http://localhost:4321/ | grep -o "Neubrutalism, fully assembled. Fully Astro."
```

Expected: prints the title text (proves the current centered-only Hero renders on `/`).

- [ ] **Step 2: Rewrite `Hero.astro` to support both layouts**

Replace the entire file contents with:

```astro
---
import Button from "../../components/Button/Button.astro";

interface Cta {
  label: string;
  href: string;
}

interface Props {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  layout?: "centered" | "split";
  class?: string;
}

const {
  id,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  layout = "centered",
  class: className,
} = Astro.props;
---

{
  layout === "split" ? (
    <section id={id} class:list={["border-b-[3px] border-ink bg-paper", className]}>
      <div class="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
        <div>
          {eyebrow && (
            <span class="inline-block border-2 border-ink bg-yellow px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
              {eyebrow}
            </span>
          )}

          <h1 class="mt-6 text-balance font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl">{title}</h1>

          {subtitle && <p class="mt-6 max-w-xl text-pretty text-lg text-ink/75">{subtitle}</p>}

          {(primaryCta || secondaryCta) && (
            <div class="mt-10 flex flex-wrap items-center gap-4">
              {primaryCta && (
                <Button href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} size="lg" variant="outline">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>

        <div>
          <slot name="graphic" />
        </div>
      </div>
    </section>
  ) : (
    <section id={id} class:list={["relative overflow-hidden border-b-[3px] border-ink bg-paper", className]}>
      <div
        class="pointer-events-none absolute -top-12 -right-16 size-64 border-[3px] border-ink bg-lavender sm:size-80"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -bottom-16 -left-12 size-48 rotate-12 border-[3px] border-ink bg-orange sm:size-56"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        {eyebrow && (
          <span class="inline-block border-2 border-ink bg-yellow px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
            {eyebrow}
          </span>
        )}

        <h1 class="mt-6 text-balance font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-7xl">{title}</h1>

        {subtitle && <p class="mx-auto mt-6 max-w-xl text-pretty text-lg text-ink/75">{subtitle}</p>}

        {(primaryCta || secondaryCta) && (
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primaryCta && (
              <Button href={primaryCta.href} size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} size="lg" variant="outline">
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify the showcase page still renders identically**

```bash
curl -s http://localhost:4321/ | grep -o "Neubrutalism, fully assembled. Fully Astro."
```

Expected: prints the title text, unchanged from Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/Hero/Hero.astro
git commit -m "$(cat <<'EOF'
Add a split layout option to Hero.astro

Defaults to "centered" (current behavior, unaffected). "split" renders
text left / a graphic slot right, for the new landing page.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add optional `href` to `FeatureGrid.astro` cards

**Files:**
- Modify: `src/blocks/FeatureGrid/FeatureGrid.astro`

**Interfaces:**
- Consumes: `Card` (`src/components/Card/Card.astro`) — already imported. `Card` already accepts `href?: string`.
- Produces: `Feature.href?: string`, passed through to `Card`. Existing callers that omit it are unaffected (Card renders as a `<div>`, same as today).

- [ ] **Step 1: Confirm current behavior on the showcase page (baseline)**

```bash
curl -s http://localhost:4321/ | grep -o "Zero-JS by default"
```

Expected: prints the feature title text.

- [ ] **Step 2: Add `href` to the `Feature` type and pass it to `Card`**

In `src/blocks/FeatureGrid/FeatureGrid.astro`, change:

```astro
interface Feature {
  title: string;
  description: string;
  accent?: Accent;
}
```

to:

```astro
interface Feature {
  title: string;
  description: string;
  accent?: Accent;
  href?: string;
}
```

And change:

```astro
      features.map((feature, i) => (
        <Card title={feature.title} description={feature.description} accent={feature.accent ?? accentCycle[i % accentCycle.length]} />
      ))
```

to:

```astro
      features.map((feature, i) => (
        <Card
          title={feature.title}
          description={feature.description}
          accent={feature.accent ?? accentCycle[i % accentCycle.length]}
          href={feature.href}
        />
      ))
```

- [ ] **Step 3: Verify the showcase page still renders identically**

```bash
curl -s http://localhost:4321/ | grep -o "Zero-JS by default"
```

Expected: prints the feature title text, unchanged from Step 1. (Live proof that `href` actually links a card comes in Task 9, once a caller passes one.)

- [ ] **Step 4: Commit**

```bash
git add src/blocks/FeatureGrid/FeatureGrid.astro
git commit -m "$(cat <<'EOF'
Add optional href to FeatureGrid's Feature type

Passed through to the underlying Card. Existing callers that don't
set it are unaffected; needed by the landing page's Pages section to
link cards to /blog and /portfolio.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Create `PricingCard.astro`

**Files:**
- Create: `src/components/Pricing/PricingCard.astro`

**Interfaces:**
- Consumes: `Button` (`src/components/Button/Button.astro`), `List` (`src/components/List/List.astro`, `variant="check"`, `items: { text: string }[]`).
- Produces: `Props = { name: string; price: string; period?: string; description?: string; features: string[]; ctaLabel: string; ctaHref: string; featured?: boolean; class?: string }`. Used by Task 5's `Pricing.astro` as `<PricingCard {...plan} />`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/components/Pricing
```

Create `src/components/Pricing/PricingCard.astro`:

```astro
---
import Button from "../Button/Button.astro";
import List from "../List/List.astro";

interface Props {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  class?: string;
}

const {
  name,
  price,
  period,
  description,
  features,
  ctaLabel,
  ctaHref,
  featured = false,
  class: className,
} = Astro.props;

const listItems = features.map((text) => ({ text }));
---

<div
  class:list={[
    "relative flex flex-col gap-6 border-[3px] border-ink p-8",
    featured ? "bg-yellow shadow-brutal-lg" : "bg-paper shadow-brutal",
    className,
  ]}
>
  {
    featured && (
      <span class="absolute -top-3 right-6 border-2 border-ink bg-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-paper">
        Most popular
      </span>
    )
  }

  <div>
    <h3 class="font-heading text-lg font-bold uppercase tracking-wide">{name}</h3>
    {description && <p class="mt-1 text-sm text-ink/70">{description}</p>}
  </div>

  <p class="font-display text-5xl font-extrabold">
    {price}
    {period && <span class="font-heading text-base font-semibold text-ink/60"> {period}</span>}
  </p>

  <List variant="check" items={listItems} class="flex-1" />

  <Button href={ctaHref} variant={featured ? "primary" : "outline"} class="w-full justify-center">
    {ctaLabel}
  </Button>
</div>
```

- [ ] **Step 2: Verify it's syntactically valid by rendering it from a scratch route**

Astro components can't be curled directly — temporarily mount it on the docs index page to force a compile, then revert. `src/pages/docs/index.astro` currently reads:

```astro
---
import { getCollection } from "astro:content";
import DocsLayout from "../../layouts/DocsLayout.astro";
import Card from "../../components/Card/Card.astro";

const entries = (await getCollection("docs")).sort((a, b) => a.data.order - b.data.order);
---

<DocsLayout title="Documentation" description="Documentation for the Neubrutal Astro theme — every component, block, and layout.">
  <h1>Documentation</h1>
  <p>
    Everything you need to build with Neubrutal: the token system it's built on, and every component, block, and
    layout it ships with.
  </p>

  <div class="mt-8 grid gap-4 sm:grid-cols-2">
    {
      entries.map((entry) => (
        <Card href={`/docs/${entry.id}`} title={entry.data.title} description={entry.data.description} class="p-4!" />
      ))
    }
  </div>
</DocsLayout>
```

```bash
cp src/pages/docs/index.astro /tmp/docs-index.astro.bak
```

Add one import line after `import Card ...` and one render line before `</DocsLayout>`:

```astro
import Card from "../../components/Card/Card.astro";
import PricingCard from "../../components/Pricing/PricingCard.astro";
```

```astro
  </div>

  <PricingCard name="Test" price="$1" features={["a"]} ctaLabel="Go" ctaHref="#" />
</DocsLayout>
```

```bash
curl -s http://localhost:4321/docs | grep -o "Most popular"
```

Expected: no output (this test render didn't set `featured`, so "Most popular" shouldn't appear) — instead check for the plan name:

```bash
curl -s http://localhost:4321/docs | grep -o '\$1'
```

Expected: prints `$1`.

- [ ] **Step 3: Revert the temporary test render**

```bash
cp /tmp/docs-index.astro.bak src/pages/docs/index.astro
rm /tmp/docs-index.astro.bak
curl -s http://localhost:4321/docs | grep -c "PricingCard"
```

Expected: `0` (confirms the temporary test render is gone; `src/pages/docs/index.astro` is back to its original state — check with `git diff src/pages/docs/index.astro`, expected: no output).

- [ ] **Step 4: Commit**

```bash
git add src/components/Pricing/PricingCard.astro
git commit -m "$(cat <<'EOF'
Add PricingCard component

Plan name, price, feature checklist (via List), and CTA button, with
a featured variant (accent fill + "Most popular" badge) for the
landing page's Pricing section.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Create `Pricing.astro` block

**Files:**
- Create: `src/blocks/Pricing/Pricing.astro`

**Interfaces:**
- Consumes: `PricingCard` (Task 4) — `Props` as defined above.
- Produces: `Props = { id?: string; eyebrow?: string; title?: string; description?: string; plans: Plan[]; class?: string }` where `Plan` is `PricingCard`'s `Props` minus `class`. Used by Task 9's `landing.astro` as `<Pricing plans={plans} ... />`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/blocks/Pricing
```

Create `src/blocks/Pricing/Pricing.astro`:

```astro
---
import PricingCard from "../../components/Pricing/PricingCard.astro";

interface Plan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

interface Props {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  plans: Plan[];
  class?: string;
}

const { id, eyebrow, title, description, plans, class: className } = Astro.props;
---

<section id={id} class:list={["mx-auto max-w-6xl px-6 py-20", className]}>
  {
    (eyebrow || title || description) && (
      <div class="mx-auto mb-14 max-w-2xl text-center">
        {eyebrow && (
          <span class="inline-block border-2 border-ink bg-blue px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
            {eyebrow}
          </span>
        )}
        {title && <h2 class="mt-4 text-balance font-display text-4xl font-extrabold uppercase sm:text-5xl">{title}</h2>}
        {description && <p class="mt-4 text-pretty text-ink/70">{description}</p>}
      </div>
    )
  }

  <div class="grid gap-8 lg:grid-cols-3">
    {plans.map((plan) => <PricingCard {...plan} />)}
  </div>
</section>
```

Note: `grid` defaults to `align-items: stretch`, so all three cards match height and each `PricingCard`'s `flex-1` List pushes its CTA button to a common baseline — do not add `lg:items-start`.

- [ ] **Step 2: Verify (via the same docs-page mount technique as Task 4)**

```bash
cp src/pages/docs/index.astro /tmp/docs-index.astro.bak
```

Add one import line after `import Card ...` and one render block before `</DocsLayout>`:

```astro
import Card from "../../components/Card/Card.astro";
import Pricing from "../../blocks/Pricing/Pricing.astro";
```

```astro
  </div>

  <Pricing
    plans={[
      { name: "Basic", price: "$1", features: ["a"], ctaLabel: "Go", ctaHref: "#" },
      { name: "Pro", price: "$2", features: ["b"], ctaLabel: "Go", ctaHref: "#", featured: true },
    ]}
  />
</DocsLayout>
```

```bash
curl -s http://localhost:4321/docs | grep -o "Most popular"
```

Expected: prints `Most popular` (proves the featured badge renders).

- [ ] **Step 3: Revert**

```bash
cp /tmp/docs-index.astro.bak src/pages/docs/index.astro
rm /tmp/docs-index.astro.bak
git diff src/pages/docs/index.astro
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/Pricing/Pricing.astro
git commit -m "$(cat <<'EOF'
Add Pricing block

Heading + a grid of PricingCards from a plans prop, matching the
FeatureGrid/CTA block pattern.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Create `TestimonialCard.astro`

**Files:**
- Create: `src/components/Testimonial/TestimonialCard.astro`

**Interfaces:**
- Produces: `Props = { quote: string; name: string; role?: string; accent?: "yellow" | "pink" | "blue" | "green" | "orange" | "lavender"; class?: string }`. Used by Task 7's `Testimonials.astro`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/components/Testimonial
```

Create `src/components/Testimonial/TestimonialCard.astro`:

```astro
---
type Accent = "yellow" | "pink" | "blue" | "green" | "orange" | "lavender";

interface Props {
  quote: string;
  name: string;
  role?: string;
  accent?: Accent;
  class?: string;
}

const { quote, name, role, accent = "yellow", class: className } = Astro.props;

const accents: Record<Accent, string> = {
  yellow: "bg-yellow",
  pink: "bg-pink",
  blue: "bg-blue",
  green: "bg-green",
  orange: "bg-orange",
  lavender: "bg-lavender",
};
---

<figure
  class:list={["flex h-full flex-col justify-between gap-6 border-[3px] border-ink p-6 shadow-brutal", accents[accent], className]}
>
  <blockquote class="font-heading text-lg font-bold">"{quote}"</blockquote>
  <figcaption class="text-sm text-ink/70">
    — {name}
    {role ? `, ${role}` : ""}
  </figcaption>
</figure>
```

- [ ] **Step 2: Verify (via the docs-page mount technique)**

```bash
cp src/pages/docs/index.astro /tmp/docs-index.astro.bak
```

Add one import line after `import Card ...` and one render line before `</DocsLayout>`:

```astro
import Card from "../../components/Card/Card.astro";
import TestimonialCard from "../../components/Testimonial/TestimonialCard.astro";
```

```astro
  </div>

  <TestimonialCard quote="Test quote" name="Jane Doe" role="Engineer" />
</DocsLayout>
```

```bash
curl -s http://localhost:4321/docs | grep -o "Jane Doe"
```

Expected: prints `Jane Doe`.

- [ ] **Step 3: Revert**

```bash
cp /tmp/docs-index.astro.bak src/pages/docs/index.astro
rm /tmp/docs-index.astro.bak
git diff src/pages/docs/index.astro
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/Testimonial/TestimonialCard.astro
git commit -m "$(cat <<'EOF'
Add TestimonialCard component

Quote + attribution on a flat accent background, for the landing
page's Testimonials section.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Create `Testimonials.astro` block

**Files:**
- Create: `src/blocks/Testimonials/Testimonials.astro`

**Interfaces:**
- Consumes: `TestimonialCard` (Task 6).
- Produces: `Props = { id?: string; eyebrow?: string; title?: string; description?: string; testimonials: Testimonial[]; class?: string }` where `Testimonial = { quote: string; name: string; role?: string; accent?: Accent }`. Used by Task 9's `landing.astro`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/blocks/Testimonials
```

Create `src/blocks/Testimonials/Testimonials.astro`:

```astro
---
import TestimonialCard from "../../components/Testimonial/TestimonialCard.astro";

type Accent = "yellow" | "pink" | "blue" | "green" | "orange" | "lavender";

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  accent?: Accent;
}

interface Props {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  testimonials: Testimonial[];
  class?: string;
}

const { id, eyebrow, title, description, testimonials, class: className } = Astro.props;

const accentCycle: Accent[] = ["yellow", "blue", "pink", "green", "orange", "lavender"];
---

<section id={id} class:list={["mx-auto max-w-6xl px-6 py-20", className]}>
  {
    (eyebrow || title || description) && (
      <div class="mx-auto mb-14 max-w-2xl text-center">
        {eyebrow && (
          <span class="inline-block border-2 border-ink bg-pink px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
            {eyebrow}
          </span>
        )}
        {title && <h2 class="mt-4 text-balance font-display text-4xl font-extrabold uppercase sm:text-5xl">{title}</h2>}
        {description && <p class="mt-4 text-pretty text-ink/70">{description}</p>}
      </div>
    )
  }

  <div class="grid gap-6 sm:grid-cols-3">
    {
      testimonials.map((t, i) => (
        <TestimonialCard quote={t.quote} name={t.name} role={t.role} accent={t.accent ?? accentCycle[i % accentCycle.length]} />
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Verify (via the docs-page mount technique)**

```bash
cp src/pages/docs/index.astro /tmp/docs-index.astro.bak
```

Add one import line after `import Card ...` and one render line before `</DocsLayout>`:

```astro
import Card from "../../components/Card/Card.astro";
import Testimonials from "../../blocks/Testimonials/Testimonials.astro";
```

```astro
  </div>

  <Testimonials testimonials={[{ quote: "Great stuff", name: "Jane Doe" }]} />
</DocsLayout>
```

```bash
curl -s http://localhost:4321/docs | grep -o "Great stuff"
```

Expected: prints `Great stuff`.

- [ ] **Step 3: Revert**

```bash
cp /tmp/docs-index.astro.bak src/pages/docs/index.astro
rm /tmp/docs-index.astro.bak
git diff src/pages/docs/index.astro
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/Testimonials/Testimonials.astro
git commit -m "$(cat <<'EOF'
Add Testimonials block

Heading + a grid of TestimonialCards from a testimonials prop.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Create `FAQ.astro` block

**Files:**
- Create: `src/blocks/FAQ/FAQ.astro`

**Interfaces:**
- Consumes: `Accordion` (Task 1) — `Props.items: { question: string; answer: string }[]`.
- Produces: `Props = { id?: string; eyebrow?: string; title?: string; description?: string; items: FaqItem[]; class?: string }`. Used by Task 9's `landing.astro`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p src/blocks/FAQ
```

Create `src/blocks/FAQ/FAQ.astro`:

```astro
---
import Accordion from "../../components/Accordion/Accordion.astro";

interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FaqItem[];
  class?: string;
}

const { id, eyebrow, title, description, items, class: className } = Astro.props;
---

<section id={id} class:list={["mx-auto max-w-3xl px-6 py-20", className]}>
  {
    (eyebrow || title || description) && (
      <div class="mb-10 text-center">
        {eyebrow && (
          <span class="inline-block border-2 border-ink bg-green px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
            {eyebrow}
          </span>
        )}
        {title && <h2 class="mt-4 text-balance font-display text-4xl font-extrabold uppercase sm:text-5xl">{title}</h2>}
        {description && <p class="mt-4 text-pretty text-ink/70">{description}</p>}
      </div>
    )
  }

  <Accordion items={items} />
</section>
```

- [ ] **Step 2: Verify (via the docs-page mount technique)**

```bash
cp src/pages/docs/index.astro /tmp/docs-index.astro.bak
```

Add one import line after `import Card ...` and one render line before `</DocsLayout>`:

```astro
import Card from "../../components/Card/Card.astro";
import FAQ from "../../blocks/FAQ/FAQ.astro";
```

```astro
  </div>

  <FAQ items={[{ question: "Test question?", answer: "Test answer." }]} />
</DocsLayout>
```

```bash
curl -s http://localhost:4321/docs | grep -o "Test question?"
```

Expected: prints `Test question?`.

- [ ] **Step 3: Revert**

```bash
cp /tmp/docs-index.astro.bak src/pages/docs/index.astro
rm /tmp/docs-index.astro.bak
git diff src/pages/docs/index.astro
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/FAQ/FAQ.astro
git commit -m "$(cat <<'EOF'
Add FAQ block

Heading + Accordion wired to a data-driven items prop.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Create the `/landing` page

**Files:**
- Create: `src/pages/landing.astro`

**Interfaces:**
- Consumes: `LandingLayout`, `Hero` (layout="split"), `FeatureGrid` (x2), `Pricing`, `Testimonials`, `FAQ`, `CTA` — all as defined in Tasks 1–8 and the pre-existing `CTA` block.

- [ ] **Step 1: Confirm the route doesn't exist yet (baseline)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/landing
```

Expected: `404`.

- [ ] **Step 2: Create `src/pages/landing.astro`**

```astro
---
import LandingLayout from "../layouts/LandingLayout.astro";

import Hero from "../blocks/Hero/Hero.astro";
import FeatureGrid from "../blocks/FeatureGrid/FeatureGrid.astro";
import Pricing from "../blocks/Pricing/Pricing.astro";
import Testimonials from "../blocks/Testimonials/Testimonials.astro";
import FAQ from "../blocks/FAQ/FAQ.astro";
import CTA from "../blocks/CTA/CTA.astro";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: "/docs" },
];

const footerGroups = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Astro docs", href: "https://docs.astro.build" },
      { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    ],
  },
];

const featureItems = [
  { title: "Zero-JS by default", description: "Every component ships as static HTML — interactivity is opt-in and minimal." },
  { title: "Tokenized aesthetic", description: "Borders, shadows, and accents are Tailwind v4 theme tokens — change the vibe without rebuilding components." },
  { title: "Full component set", description: "Buttons to drawers, tables to toasts — everything a real product needs is here." },
  { title: "Composable blocks", description: "Hero, navbar, CTA, and feature grid blocks are built from the same primitives you get." },
  { title: "Accessible by construction", description: "Focus rings, contrast, and semantics are part of the design system, not an afterthought." },
  { title: "Astro-native", description: "Typed props, slots, and scoped styles — no framework runtime required." },
];

const pageItems = [
  {
    title: "Blog",
    description: "Long-form posts, tags, and a clean reading layout — built from the same components as everything else.",
    href: "/blog",
  },
  {
    title: "Landing",
    description: "The page you're on. Hero, pricing, testimonials, FAQ — swap the copy and ship.",
  },
  {
    title: "Portfolio",
    description: "A project grid for case studies and client work, styled with the same bold, flat-color system.",
    href: "/portfolio",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Personal projects",
    features: ["Components, blocks, and layouts", "MIT license", "Community support"],
    ctaLabel: "Get started",
    ctaHref: "#",
  },
  {
    name: "Pro",
    price: "$49",
    period: "one-time",
    description: "Solo developers & freelancers",
    features: ["Everything in Free", "Figma source files", "Priority email support", "Lifetime updates"],
    ctaLabel: "Get Pro",
    ctaHref: "#",
    featured: true,
  },
  {
    name: "Team",
    price: "$149",
    period: "one-time",
    description: "Agencies & product teams",
    features: ["Everything in Pro", "Up to 10 team seats", "Private Discord channel"],
    ctaLabel: "Get Team",
    ctaHref: "#",
  },
];

const testimonials = [
  { quote: "Finally, a theme with an opinion.", name: "Design lead", role: "seed-stage startup" },
  { quote: "Shipped our landing page in an afternoon.", name: "Solo founder" },
  { quote: "Every component just... matches.", name: "Freelance developer" },
];

const faqItems = [
  {
    question: "What's included?",
    answer:
      "A full component library — buttons, cards, forms, tables, modals, and more — plus blocks and layouts, all built with Tailwind CSS v4 and typed Astro props.",
  },
  {
    question: "How do I get started?",
    answer: "Copy any component into your project, or clone the whole theme and start editing the page in src/pages/index.astro.",
  },
  {
    question: "Can I change the color palette?",
    answer: "Every color is a single OKLCH token in global.css — swap the values there and the whole theme follows.",
  },
  {
    question: "Do I need to know Tailwind?",
    answer:
      "Not deeply — every component ships with its styling already written. You'll want basic Tailwind familiarity to customize layouts, but nothing more.",
  },
];
---

<LandingLayout
  title="Neubrutal — Build loud. Ship fast."
  description="A complete neubrutalist component library for Astro: components, blocks, and layouts built with Tailwind CSS v4."
  navLinks={navLinks}
  navCtaLabel="Get Theme"
  navCtaHref="#pricing"
  footerBrand="Neubrutal"
  footerTagline="An Astro + Tailwind theme, built loud on purpose."
  footerGroups={footerGroups}
>
  <Hero
    layout="split"
    eyebrow="Astro + Tailwind CSS v4"
    title="Build loud. Ship fast."
    subtitle="A complete neubrutalist component library for Astro — thick borders, hard shadows, and flat color, ready to assemble into any page you need."
    primaryCta={{ label: "Get Theme", href: "#pricing" }}
    secondaryCta={{ label: "Read Docs", href: "/docs" }}
  >
    <div slot="graphic" class="relative aspect-square w-full border-[3px] border-ink bg-blue shadow-brutal-xl">
      <div class="absolute inset-6 border-2 border-dashed border-ink/40" />
      <span class="absolute right-4 bottom-4 border-2 border-ink bg-paper px-2 py-1 font-mono text-xs font-bold uppercase tracking-wide">
        Image placeholder
      </span>
    </div>
  </Hero>

  <FeatureGrid
    id="features"
    eyebrow="Why Neubrutal"
    title="Everything a real product needs"
    description="Every piece below is a typed Astro component — copy it, compose it, or use it as-is."
    features={featureItems}
  />

  <FeatureGrid id="pages" eyebrow="Start here" title="Pages to build on" features={pageItems} />

  <Pricing
    id="pricing"
    eyebrow="Pricing"
    title="Get the whole theme"
    description="One-time purchase. No subscriptions, no seat-locked license servers."
    plans={plans}
  />

  <Testimonials id="testimonials" eyebrow="Testimonials" title="Don't take our word for it" testimonials={testimonials} />

  <FAQ id="faq" eyebrow="FAQ" title="Questions, answered" items={faqItems} />

  <CTA
    id="cta"
    title="Build your next project loud."
    description="Every component, block, and layout on this page is yours to copy."
    primaryCta={{ label: "Get Theme", href: "#pricing" }}
    secondaryCta={{ label: "Star on GitHub", href: "https://github.com" }}
    accent="lavender"
  />
</LandingLayout>
```

- [ ] **Step 3: Verify the page renders with every section's content**

```bash
curl -s http://localhost:4321/landing > /tmp/landing.html
grep -o "Build loud. Ship fast." /tmp/landing.html | head -1
grep -o "Image placeholder" /tmp/landing.html
grep -o 'href="/blog"' /tmp/landing.html
grep -o 'href="/portfolio"' /tmp/landing.html
grep -o "Most popular" /tmp/landing.html
grep -o "Every component just\.\.\. matches\." /tmp/landing.html
grep -o "Do I need to know Tailwind?" /tmp/landing.html
grep -o "Build your next project loud." /tmp/landing.html
rm /tmp/landing.html
```

Expected: every `grep` prints its matched text — one line each, no empty results.

- [ ] **Step 4: Confirm the showcase page is still unaffected**

```bash
git diff --stat src/pages/index.astro
```

Expected: no output (file untouched).

- [ ] **Step 5: Commit**

```bash
git add src/pages/landing.astro
git commit -m "$(cat <<'EOF'
Add /landing marketing page

Composes Hero (split layout), Features, Pages, Pricing, Testimonials,
FAQ, and a closing CTA from the block library. index.astro (the
component showcase) is untouched.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Create the `/blog` stub page

**Files:**
- Create: `src/pages/blog.astro`

**Interfaces:**
- Consumes: `LandingLayout`, `CardStacked` (`src/components/Card/CardStacked.astro` — pre-existing, `Props = { date, dateLabel, title, description, href?, class? }`).

- [ ] **Step 1: Confirm the route doesn't exist yet (baseline)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/blog
```

Expected: `404`.

- [ ] **Step 2: Create `src/pages/blog.astro`**

```astro
---
import LandingLayout from "../layouts/LandingLayout.astro";
import CardStacked from "../components/Card/CardStacked.astro";

const navLinks = [
  { label: "Home", href: "/landing" },
  { label: "Docs", href: "/docs" },
];

const posts = [
  {
    date: "2026-06-02",
    dateLabel: "Jun 2, 2026",
    title: "Shipping a full component library in a weekend",
    description: "Notes on building buttons, cards, and forms fast without reaching for a UI kit.",
  },
  {
    date: "2026-05-14",
    dateLabel: "May 14, 2026",
    title: "Why we went with hard shadows instead of blur",
    description: "The case for zero-blur, offset shadows in a design system built for clarity.",
  },
  {
    date: "2026-04-01",
    dateLabel: "Apr 1, 2026",
    title: "Square corners, on purpose",
    description: "Zeroing every border-radius, and why native form controls fight you on it.",
  },
  {
    date: "2026-03-10",
    dateLabel: "Mar 10, 2026",
    title: "Tokens over utility soup",
    description: "How seven CSS variables replaced a hundred one-off Tailwind classes.",
  },
];
---

<LandingLayout
  title="Blog — Neubrutal"
  description="Notes on building and shipping the Neubrutal theme."
  navLinks={navLinks}
>
  <div class="mx-auto max-w-4xl px-6 py-20">
    <div class="mb-14 text-center">
      <span class="inline-block border-2 border-ink bg-yellow px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
        Blog
      </span>
      <h1 class="mt-4 text-balance font-display text-4xl font-extrabold uppercase sm:text-5xl">Notes & updates</h1>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => <CardStacked {...post} />)}
    </div>
  </div>
</LandingLayout>
```

- [ ] **Step 3: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/blog
curl -s http://localhost:4321/blog | grep -o "Square corners, on purpose"
```

Expected: `200`, then prints `Square corners, on purpose`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog.astro
git commit -m "$(cat <<'EOF'
Add /blog index stub page

4 placeholder posts via the existing CardStacked component. No detail
pages — cards use CardStacked's default href="#", matching the
index-only scope agreed for this page.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Create the `/portfolio` stub page

**Files:**
- Create: `src/pages/portfolio.astro`

**Interfaces:**
- Consumes: `LandingLayout`, `Card` (`src/components/Card/Card.astro` — pre-existing).

- [ ] **Step 1: Confirm the route doesn't exist yet (baseline)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/portfolio
```

Expected: `404`.

- [ ] **Step 2: Create `src/pages/portfolio.astro`**

```astro
---
import LandingLayout from "../layouts/LandingLayout.astro";
import Card from "../components/Card/Card.astro";

type Accent = "yellow" | "pink" | "blue" | "green";

const navLinks = [
  { label: "Home", href: "/landing" },
  { label: "Docs", href: "/docs" },
];

const projects: { eyebrow: string; title: string; description: string; accent: Accent }[] = [
  {
    eyebrow: "Web App",
    title: "Ledger — expense tracking",
    description: "A dashboard for freelancers to track invoices and expenses.",
    accent: "yellow",
  },
  {
    eyebrow: "Branding",
    title: "Voltage Coffee",
    description: "Packaging and web identity for a specialty coffee roaster.",
    accent: "pink",
  },
  {
    eyebrow: "Mobile",
    title: "Trailhead — hiking companion",
    description: "Offline trail maps and route tracking for weekend hikers.",
    accent: "blue",
  },
  {
    eyebrow: "E-commerce",
    title: "Kiln Studio",
    description: "A storefront for handmade ceramics, built for slow, deliberate browsing.",
    accent: "green",
  },
];
---

<LandingLayout
  title="Portfolio — Neubrutal"
  description="Selected work built with the Neubrutal theme."
  navLinks={navLinks}
>
  <div class="mx-auto max-w-5xl px-6 py-20">
    <div class="mb-14 text-center">
      <span class="inline-block border-2 border-ink bg-blue px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide shadow-brutal-sm">
        Portfolio
      </span>
      <h1 class="mt-4 text-balance font-display text-4xl font-extrabold uppercase sm:text-5xl">Selected work</h1>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => <Card interactive={false} {...project} />)}
    </div>
  </div>
</LandingLayout>
```

- [ ] **Step 3: Verify**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/portfolio
curl -s http://localhost:4321/portfolio | grep -o "Kiln Studio"
```

Expected: `200`, then prints `Kiln Studio`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/portfolio.astro
git commit -m "$(cat <<'EOF'
Add /portfolio index stub page

4 placeholder projects via the existing Card component, categorized
via the eyebrow prop and cycled through the accent palette.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Full regression pass and cleanup

**Files:** none (verification only)

- [ ] **Step 1: Confirm every route is healthy**

```bash
export PATH="$HOME/.nvm/versions/node/v22.12.0/bin:$PATH"
cd /Users/sean/projects/01-main-workspace/projects/astro-neubrutalist-theme
for p in / /docs /docs/theming /landing /blog /portfolio; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$p")
  echo "$p -> $code"
done
```

Expected: every route prints `200`.

- [ ] **Step 2: Confirm no compile errors were logged**

```bash
./node_modules/.bin/astro dev logs 2>&1 | grep -i "error" || echo "no errors"
```

Expected: `no errors` (if the dev server wasn't started with `--background` by whoever ran these tasks, instead check the terminal it's running in directly for the same absence of errors).

- [ ] **Step 3: Confirm the showcase page (`index.astro`) and its docs sibling are byte-identical to before this plan**

```bash
git diff --stat src/pages/index.astro src/pages/docs/index.astro
```

Expected: no output for either file.

- [ ] **Step 4: Confirm the full file set matches the plan**

```bash
git log --oneline -12
git diff --stat c63bee4..HEAD
```

Expected: 11 feature commits (Tasks 1–11) directly on top of `c63bee4` ("Add design doc for landing page redesign"), touching exactly: `src/components/Accordion/Accordion.astro`, `src/blocks/Hero/Hero.astro`, `src/blocks/FeatureGrid/FeatureGrid.astro`, `src/components/Pricing/PricingCard.astro`, `src/blocks/Pricing/Pricing.astro`, `src/components/Testimonial/TestimonialCard.astro`, `src/blocks/Testimonials/Testimonials.astro`, `src/blocks/FAQ/FAQ.astro`, `src/pages/landing.astro`, `src/pages/blog.astro`, `src/pages/portfolio.astro`.

- [ ] **Step 5: Manual visual pass**

Open `http://localhost:4321/landing` in a browser. Confirm at both a mobile width (~375px) and desktop width (~1280px):
- Hero's graphic stacks below the text on mobile, sits beside it on desktop
- Pricing's "Pro" card is visibly featured (yellow fill, "Most popular" badge, larger shadow) and all 3 cards' CTA buttons align at the same baseline
- FAQ accordions expand/collapse on click and are reachable by keyboard (Tab + Enter/Space)
- All nav links (`#features`, `#pricing`, `#testimonials`, `#faq`) scroll to the right section
- `Blog` and `Portfolio` cards in the Pages section navigate to `/blog` and `/portfolio`

No commit for this step — it's a manual check. If anything looks wrong, fix it in a new commit and re-run Steps 1–4.

---

## Self-Review Notes

- **Spec coverage:** every section in the spec (Navbar, Hero split+graphic, Features, Pages+href, Pricing+featured, Testimonials, FAQ, closing CTA, Footer, Blog stub, Portfolio stub) has a corresponding task. The spec's three "modified files" (Hero, Accordion, FeatureGrid) are Tasks 1–3; its five "new files" tables are Tasks 4–11.
- **Placeholder scan:** no TBD/TODO; every step has real, complete code or an exact command with an exact expected result.
- **Type consistency:** `Plan` (Task 5), `Testimonial` (Task 7), and `FaqItem` (Tasks 1 & 8) are defined once and reused with matching field names/types everywhere they're consumed in Task 9. `PricingCard`'s `Props` (Task 4) match `Pricing.astro`'s `Plan` type field-for-field (minus `class`), so `<PricingCard {...plan} />` (Task 5) type-checks.
