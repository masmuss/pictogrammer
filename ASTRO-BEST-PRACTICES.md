# Astro + Design System Best Practices

## Overview

Panduan ini menjelaskan best practices untuk mengembangkan components dengan Astro, TailwindCSS, dan design system yang solid.

---

## 1. Component Structure

### File Organization

```
src/components/ui/
├── Button.astro              (Single component or wrapper)
├── Badge.astro
├── Card.astro
├── card/                     (Subcomponent folder)
│   ├── Card.astro
│   ├── CardHeader.astro
│   ├── CardTitle.astro
│   ├── CardDescription.astro
│   ├── CardContent.astro
│   └── CardFooter.astro
├── index.ts                  (Export all components)
└── primitives/               (Base building blocks)
    ├── Box.astro
    ├── Stack.astro
    └── Spacer.astro
```

### Component Template

```astro
---
import type { HTMLAttributes } from "astro/types";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<"button"> {
  /** Visual style variant */
  variant?: "default" | "outline" | "ghost";
  
  /** Component size */
  size?: "sm" | "default" | "lg";
  
  /** Additional CSS classes */
  class?: string;
}

const {
  variant = "default",
  size = "default",
  class: className,
  ...attrs
} = Astro.props;

// Base styles - layout, shape, interaction
const baseClass = "inline-flex items-center justify-center rounded-md transition-colors";

// Variant-specific styles
const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent",
  ghost: "hover:bg-accent hover:text-accent-foreground"
};

// Size-specific styles
const sizes = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg"
};

// Compose final class
const componentClass = cn(
  baseClass,
  variants[variant],
  sizes[size],
  className
);
---

<button
  class={componentClass}
  data-variant={variant}
  data-size={size}
  {...attrs}
>
  <slot />
</button>

<style is:global>
  /* Scoped CSS only when necessary */
  /* Prefer Tailwind utilities */
</style>
```

---

## 2. Props Design

### ✅ Good Props Design

```astro
interface Props {
  // 1. Semantic props
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  
  // 2. Content props (explicit slots preferred)
  title?: string;
  description?: string;
  
  // 3. Behavior props
  disabled?: boolean;
  loading?: boolean;
  
  // 4. HTML attributes (extends from HTMLAttributes)
  class?: string;
  
  // 5. Never use:
  // - [key: string]: unknown  (prefer explicit props)
  // - style?: string          (use class instead)
  // - variant?: string        (be specific)
}
```

### ❌ Avoid These Props

```astro
interface Props {
  // ❌ Too generic
  config?: Record<string, any>;
  options?: unknown;
  data?: any;
  
  // ❌ Mixing concerns
  onClickHandler?: () => void;  // For interactive, use Svelte/React instead
  
  // ❌ Styling props
  color?: string;               // Use variant + token
  padding?: string;             // Use class
  
  // ❌ Flag parameters
  compact?: boolean;            // Use size prop instead
  minimal?: boolean;
  full?: boolean;
}
```

### Props Typing Best Practices

```astro
---
import type { HTMLAttributes } from "astro/types";

// ✅ Always extend HTML attributes for flexibility
interface Props extends HTMLAttributes<"button"> {
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
}

// ✅ Use const assertion for readonly values
const VARIANT_MAP = {
  default: "bg-primary",
  outline: "border border-input"
} as const;

// ✅ Use NonNullable for strict types
const { variant = "default" } = Astro.props;
const variantClass = VARIANT_MAP[variant];

// ❌ Avoid
// interface Props extends Record<string, any>
// type Props = { [key: string]: unknown }
// const variant: string = "default"
---
```

---

## 3. Styling Patterns

### Use Tokens, Not Hardcoded Values

```astro
<!-- ✅ Good: Use design tokens -->
<div class="gap-4 p-6 transition-all duration-300 ease-out">
  
<!-- ✅ Good: Use CSS tokens -->
<div style="gap: var(--space-4); padding: var(--space-6);">

<!-- ❌ Bad: Hardcoded values -->
<div class="gap-[17px] p-[23px] transition-all 350ms cubic-bezier(...)">

<!-- ❌ Bad: Magic numbers -->
<div style="margin-top: 23px; border-radius: 7px;">
```

### CSS Token Reference

```astro
<!-- Spacing: Always from scale -->
class="gap-1 gap-2 gap-3 gap-4 gap-6 gap-8 gap-10 gap-12"
class="p-4 px-6 py-8 mx-auto"

<!-- Duration: Reference tokens -->
style="transition: all var(--transition-base)"
style="animation: fade-up var(--duration-slower) var(--ease-out) forwards"

<!-- Colors: Use semantic names -->
class="bg-primary text-primary-foreground"
class="border-border hover:bg-accent"
style="color: var(--color-accent-cta)"

<!-- Radius: From scale -->
class="rounded-sm rounded-md rounded-lg rounded-xl"
style="border-radius: var(--radius-lg)"
```

### Tailwind Utilities First

```astro
<!-- ✅ Prefer utilities -->
<div class="flex items-center justify-between gap-4 p-4 rounded-lg">

<!-- ❌ Avoid inline styles -->
<div style="display: flex; justify-content: space-between; gap: 16px;">

<!-- ❌ Avoid CSS modules -->
<!-- (Astro scopes <style> automatically) -->
```

---

## 4. Component Slots

### Slot Usage Patterns

```astro
---
import { Astro } from 'astro';

// Check for slot availability
const hasIcon = Astro.slots.has("icon");
const hasDefault = Astro.slots.has("default");
---

<!-- Simple named slots -->
<button>
  {hasIcon && <span slot="icon"><slot name="icon" /></span>}
  {hasDefault && <slot />}
</button>

<!-- Scoped slots (for advanced cases) -->
<div>
  <slot name="header" />
  <slot />
  <slot name="footer" />
</div>
```

### Slot Best Practices

```astro
<!-- ✅ Clear, semantic slot names -->
<slot name="icon-start" />
<slot name="icon-end" />
<slot name="header" />
<slot name="footer" />

<!-- ✅ Provide fallback content -->
<slot>
  <span class="text-muted-foreground">No content provided</span>
</slot>

<!-- ❌ Avoid unclear slot names -->
<slot name="left" />     <!-- Use "icon-start" instead -->
<slot name="before" />   <!-- Use "header" instead -->
<slot name="1" />        <!-- Never numeric -->

<!-- ❌ Avoid excessive slots (max 3-4) -->
<!-- If many slots needed, use component composition -->
```

---

## 5. Conditional Rendering

### Astro Conditional Patterns

```astro
---
const { isLoading, error, data } = Astro.props;
---

<!-- ✅ Simple if-then (Astro shorthand) -->
{data && <div>{data}</div>}

<!-- ✅ Ternary for alternatives -->
{isLoading ? (
  <div>Loading...</div>
) : error ? (
  <div>Error: {error}</div>
) : (
  <div>{data}</div>
)}

<!-- ✅ Multi-line fragments -->
{condition && (
  <>
    <div>Part 1</div>
    <div>Part 2</div>
  </>
)}

<!-- ❌ v-if style (not Astro) -->
<!-- <div v-if="condition"> -->

<!-- ❌ Complex logic (extract to variable) -->
{computeComplexCondition(a, b, c) ? <A /> : <B />}  // Hard to read

// Better:
const shouldShowA = computeComplexCondition(a, b, c);
```

---

## 6. Type Safety

### TypeScript in Astro Components

```astro
---
import type { HTMLAttributes } from "astro/types";

// ✅ Good: Strict typing
type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends HTMLAttributes<"div"> {
  variant: Variant;
  size?: Size;
  disabled?: boolean;
}

const { variant, size = "md", disabled = false, class: className } = Astro.props as Props;

// ✅ Type-safe maps
const variantMap: Record<Variant, string> = {
  primary: "bg-blue-500",
  secondary: "bg-gray-500",
  danger: "bg-red-500"
};

// ❌ Avoid: Any types
// interface Props { variant: any }
// const { variant }: Props = Astro.props;

// ❌ Avoid: Non-exhaustive discriminated unions
// type Variant = string;
---
```

### Export Types for Consumers

```astro
// Button.astro
export interface ButtonProps extends HTMLAttributes<"button"> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

// components/index.ts
export type { ButtonProps } from "./Button.astro";
```

---

## 7. Accessibility (a11y)

### ARIA Attributes

```astro
---
const { disabled, loading, title } = Astro.props;
---

<!-- ✅ Good: Complete a11y -->
<button
  aria-busy={loading}
  aria-disabled={disabled}
  aria-label={!title ? "Action button" : undefined}
  disabled={disabled}
  class="..."
>
  {title || <span>⭐</span>}
</button>

<!-- ✅ Focus visible -->
<a
  href={href}
  class="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
>

<!-- ❌ Incomplete a11y -->
<button disabled={disabled}>
  <!-- Missing aria-busy, aria-disabled -->

<!-- ❌ Semantic mismatch -->
<div role="button">
  <!-- Should be <button> -->
```

### Color Contrast

```astro
<!-- ✅ Check contrast ratios -->
<!-- foreground on background: 7.8:1 ✅ WCAG AAA -->
class="text-foreground"

<!-- accent-cta on background: 3.9:1 ✅ Large text only -->
class="text-lg text-accent-cta"

<!-- ❌ Too low contrast -->
class="text-muted-foreground"  <!-- 4.5:1 minimum -->
```

### Focus States

```astro
<!-- ✅ Always include focus-visible -->
<a
  class="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none"
>

<!-- ❌ Remove focus entirely -->
<!-- <a class="focus:outline-none"> -->
```

---

## 8. Dark Mode

### Implementing Dark Mode

```astro
<!-- ✅ Good: Use semantic colors with dark mode support -->
<div class="bg-background text-foreground">
  <h2 class="text-primary">Heading</h2>
  <div class="border-border">
    
<!-- ✅ Use dark: modifier -->
<div class="bg-white dark:bg-slate-950">

<!-- ✅ Test both modes -->
<!-- Light: bg-white foreground -->
<!-- Dark: bg-#100f0f foreground -->

<!-- ❌ Hardcoded colors -->
<div class="bg-white dark:bg-gray-900">

<!-- ❌ Inconsistent between themes -->
<div class="bg-blue-500">  <!-- Works in light, breaks in dark -->
```

### Color Token Strategy

```css
/* Light mode (default) */
:not(.dark) {
  --background: #fffcf0;
  --foreground: 0 3% 6%;
  --accent-cta: #3aa99f;
}

/* Dark mode */
.dark {
  --background: #100f0f;
  --foreground: 55 10% 79%;
  --accent-cta: #24837b;
}
```

---

## 9. Performance

### Image Optimization

```astro
---
import { Image } from "astro:assets";
import optimized from "@/assets/hero.jpg";
---

<!-- ✅ Use Image component for optimization -->
<Image 
  src={optimized}
  alt="Description"
  width={1200}
  height={600}
  class="w-full h-auto"
/>

<!-- ❌ Raw img tag (loses optimization) -->
<img src={optimized.src} alt="Description" />

<!-- ❌ External URLs without optimization -->
<img src="https://example.com/image.jpg" />
```

### Code Splitting

```astro
---
// ✅ Components load when visible
import Search from "@/components/Search.svelte";

// ✅ Explicit hydration
// client:idle = after page interactive
// client:visible = when in viewport
// client:load = immediately (use sparingly)
---

<Search client:visible />

<!-- ❌ Don't hydrate static content -->
<!-- <StaticCard client:load /> -->
```

### CSS Efficiency

```astro
<!-- ✅ Use Tailwind utilities (tree-shaken) -->
<div class="flex items-center gap-4">

<!-- ❌ Avoid generating dynamic classes -->
<!-- <div class={`gap-${gap}`}> -->
<!-- Use fixed utility names or CSS tokens -->
```

---

## 10. Testing Components

### Unit Test Template

```ts
// Button.test.ts
import { render } from "@testing-library/astro";
import Button from "@/components/ui/Button.astro";

describe("Button", () => {
  it("renders with default variant", async () => {
    const { container } = await render(Button, {
      slots: { default: "Click me" }
    });
    
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("applies correct size classes", async () => {
    const { container } = await render(Button, {
      size: "lg",
      slots: { default: "Click me" }
    });
    
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-9");
  });

  it("has correct accessibility attributes", async () => {
    const { container } = await render(Button, {
      disabled: true,
      slots: { default: "Click me" }
    });
    
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("disabled");
  });
});
```

### Visual Regression Testing

Use Playwright for screenshot comparisons:

```ts
// tests/visual.spec.ts
test("Button component visual regression", async ({ page }) => {
  await page.goto("http://localhost:3000/components/button");
  
  const button = page.locator("button[data-variant='default']");
  await expect(button).toHaveScreenshot();
});
```

---

## 11. Documentation

### Component JSDoc

```astro
---
/**
 * Primary action button component
 * 
 * @example
 * ```astro
 * <Button variant="primary" size="lg">Click me</Button>
 * ```
 * 
 * @param {Props} props - Component props
 * @param {ButtonVariant} [props.variant='default'] - Button style
 * @param {ButtonSize} [props.size='default'] - Button size
 * @param {boolean} [props.disabled=false] - Disable button
 */

import Button from "@/components/ui/Button.astro";

interface Props extends HTMLAttributes<"button"> {
  /** Visual style variant */
  variant?: "default" | "outline" | "ghost";
  
  /** Component size */
  size?: "sm" | "default" | "lg";
  
  /** Disable button interaction */
  disabled?: boolean;
}
---
```

### Create Component Stories

Document all variants:

```astro
---
// pages/components/button.astro
import Button from "@/components/ui/Button.astro";
import Section from "@/components/ui/Section.astro";
---

<Section title="Button Component">
  <h3>Variants</h3>
  <div class="flex gap-4">
    <Button variant="default">Default</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
  </div>

  <h3>Sizes</h3>
  <div class="flex gap-4">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
  </div>

  <h3>States</h3>
  <div class="flex gap-4">
    <Button disabled>Disabled</Button>
    <Button>Normal</Button>
  </div>
</Section>
```

---

## Summary: Component Checklist

Before shipping a component, verify:

- [ ] TypeScript props are strict and well-documented
- [ ] Uses semantic HTML (`<button>`, `<a>`, etc.)
- [ ] Includes required ARIA attributes
- [ ] Focus states are visible (focus-visible ring)
- [ ] Works in both light and dark mode
- [ ] Uses design tokens (not hardcoded values)
- [ ] Slots are named semantically
- [ ] Supports all needed props and variants
- [ ] Has JSDoc comments
- [ ] Tested for color contrast (WCAG AA)
- [ ] Includes example usage
- [ ] No console warnings/errors
- [ ] CSS is scoped or uses Tailwind
- [ ] Performance-optimized (lazy load if needed)
- [ ] Works with Astro Islands if interactive
