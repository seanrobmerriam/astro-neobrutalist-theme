---
title: Forms
description: InputForm, InputFormIcon, InputFormSearch, TextArea, Checkbox, CheckboxGroup, Select, and RadioGroup.
order: 5
---

Every form control shares the same border, shadow, and focus-visible language, so they compose into a real form without any extra styling — see the registration form on the [showcase page](/#forms) for all of these used together.

## InputForm

`src/components/Input/InputForm.astro` — extends `HTMLAttributes<'input'>`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `id` | `string` | — (required) |
| `helpText` | `string` | — |
| `type` | native input type | `text` |

```astro
<InputForm label="Email" id="email" name="email" type="email" autocomplete="email" required />
```

## InputFormIcon

`src/components/Input/InputFormIcon.astro` — an input with a trailing envelope icon, for email-style fields.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `id` | `string` | — (required) |
| `type` | native input type | `email` |

```astro
<InputFormIcon label="Email address" id="newsletter-email" name="email" placeholder="you@example.com" />
```

## InputFormSearch

`src/components/Input/InputFormSearch.astro` — an input with an attached submit button.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `id` | `string` | — (required) |
| `buttonLabel` | `string` | `"Search"` |

```astro
<InputFormSearch label="Search the docs" id="search" buttonLabel="Search" />
```

## TextArea

`src/components/TextArea/TextArea.astro` — extends `HTMLAttributes<'textarea'>`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `id` | `string` | — (required) |
| `helpText` | `string` | — |
| `rows` | `number` | `4` |

```astro
<TextArea label="Feedback" id="feedback" placeholder="Tell us what's working…" helpText="We read every message." />
```

## Checkbox

`src/components/Checkbox/Checkbox.astro` — a single checkbox with an optional description. Extends `HTMLAttributes<'input'>` (minus `type`).

| Prop | Type | Default |
|---|---|---|
| `id` | `string` | — (required) |
| `label` | `string` | — (required) |
| `description` | `string` | — |

```astro
<Checkbox id="terms" name="terms" label="I agree to the Terms of Service" required />
```

## CheckboxGroup

`src/components/Checkbox/CheckboxGroup.astro` — a bordered, dividered group of checkboxes for multi-select settings.

| Prop | Type | Default |
|---|---|---|
| `legend` | `string` | — (required) |
| `name` | `string` | — (required) |
| `options` | `{ value, label, description? }[]` | — (required) |

```astro
<CheckboxGroup
  legend="Notification preferences"
  name="notifications"
  options={[
    { value: "product", label: "Product updates", description: "New releases." },
    { value: "security", label: "Security alerts" },
  ]}
/>
```

## Select

`src/components/Forms/Select.astro` — extends `HTMLAttributes<'select'>`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | — (required) |
| `id` | `string` | — (required) |
| `options` | `{ label, value }[]` | — (required) |
| `placeholder` | `string` | — |

```astro
<Select
  label="Role"
  id="role"
  placeholder="What best describes you?"
  options={[{ label: "Designer", value: "designer" }, { label: "Engineer", value: "engineer" }]}
/>
```

## RadioGroup

`src/components/Forms/RadioGroup.astro`

| Prop | Type | Default |
|---|---|---|
| `legend` | `string` | — (required) |
| `name` | `string` | — (required) |
| `options` | `{ label, value }[]` | — (required) |
| `value` | `string` (preselected value) | — |

```astro
<RadioGroup
  legend="Account type"
  name="account-type"
  value="personal"
  options={[{ label: "Personal", value: "personal" }, { label: "Team", value: "team" }]}
/>
```
