// Single source of truth for pricing plans — shared by the `/landing` page's
// embedded pricing section and the standalone `/pricing` page, so the two
// never drift the way the plan copy and the actual `<Pricing>` block props
// would if each page defined its own array.

export interface Plan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: "Personal",
    price: "$29",
    description: "Personal, non-commercial projects",
    features: ["Components, blocks, and layouts", "Personal license", "Documentation & component reference"],
    ctaLabel: "Get started",
    ctaHref: "#",
  },
  {
    name: "Pro",
    price: "$49",
    period: "one-time",
    description: "Solo developers & freelancers",
    features: ["Everything in Personal", "Pro license — 1 commercial project"],
    ctaLabel: "Get Pro",
    ctaHref: "#",
    featured: true,
  },
  {
    name: "Team",
    price: "$149",
    period: "one-time",
    description: "Agencies & product teams",
    features: ["Everything in Pro", "Team license — multiple client projects", "Up to 10 team seats"],
    ctaLabel: "Get Team",
    ctaHref: "#",
  },
];
