# Astro Development Best Practices

## Component Structure

### Template

```astro
---
import type { HTMLAttributes } from "astro/types";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<"button"> {
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg";
	class?: string;
}

const {
	variant = "default",
	size = "default",
	class: className,
	...attrs
} = Astro.props;

const baseClass =
	"inline-flex items-center justify-center rounded-md transition-colors";

const variants = {
	default: "bg-primary text-primary-foreground hover:bg-primary/90",
	outline: "border border-input bg-background hover:bg-accent",
	ghost: "hover:bg-accent hover:text-accent-foreground"
};

const sizes = {
	sm: "h-8 px-3 text-sm",
	default: "h-10 px-4 text-base",
	lg: "h-12 px-6 text-lg"
};

const componentClass = cn(baseClass, variants[variant], sizes[size], className);
---

<button
	class={componentClass}
	data-variant={variant}
	data-size={size}
	{...attrs}
>
	<slot />
</button>
```

### File Organization

- Single component: `ComponentName.astro`
- Subcomponents: `component-name/ComponentName.astro` with barrel `index.ts`
- Primitives in `ui/primitives/`

## Props Design

### Good

- Semantic props (variant, size) with union types
- Extends `HTMLAttributes` for native attribute passthrough
- Explicit boolean props (disabled, loading)

### Avoid

- `[key: string]: unknown` — use explicit props or extend HTMLAttributes
- Generic `config`/`options`/`data` props
- Styling props (use variant + class instead)
- Flag parameters (use size instead of compact/minimal)

## Styling

### Priority Order

1. Tailwind utilities
2. Design token CSS variables
3. Scoped `<style>` tag (rarely)

### Do

- Use semantic colors: `bg-primary text-primary-foreground`
- Use token-based spacing: `gap-4 p-6`
- Use `cn()` from `@/lib/utils` for class merging

### Don't

- Hardcode values: no `gap-[17px]`, no `padding: 23px`
- Use `style` attribute when Tailwind works
- Generate dynamic class names: no `` `gap-${gap}` ``

## Slots

- Clear semantic names: `icon-start`, `icon-end`, `header`, `footer`
- Check slot existence with `Astro.slots.has()`
- Provide fallback content

## Conditional Rendering

```tsx
{
	condition && <div>Content</div>;
}
{
	isLoading ? <Loading /> : <Content />;
}
```

Extract complex logic into variables in the frontmatter.

## Type Safety

```typescript
type Variant = "primary" | "secondary" | "danger";
const variantMap: Record<Variant, string> = {/* ... */};
```

- Use `as const` for readonly maps
- Use `NonNullable` for strict types
- Export Props type for consumers

## Accessibility

- `aria-busy`, `aria-disabled` for button states
- `aria-label` for icon-only buttons
- `role="switch"` + `aria-checked` for toggles
- `focus-visible:ring-*` for consistent focus indicators
- Semantic HTML over div soup

## Dark Mode

- Use semantic colors with automatic theme switching
- Test both modes before shipping

```html
<div class="bg-background text-foreground">
	<h2 class="text-primary">Heading</h2>
	<div class="border-border"></div>
</div>
```

## Performance

- Use `<Image />` from `astro:assets` for optimization
- Use explicit hydration directives: `client:visible` > `client:idle` > `client:load`
- Don't hydrate static content
- Use Tailwind utilities (tree-shaken by default)

## Testing

### Unit Tests (Vitest)

```ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Component from "./Component.astro";

test("renders with default props", async () => {
	const container = await AstroContainer.create();
	const result = await container.renderToString(Component, {
		props: {/* ... */}
	});
	expect(result).toContain("expected content");
});
```

## New Component Checklist

- [ ] TypeScript props are strict with union types
- [ ] Uses semantic HTML element
- [ ] ARIA attributes included where needed
- [ ] Focus states are visible (`focus-visible:ring-*`)
- [ ] Works in light and dark mode
- [ ] Uses design tokens (no hardcoded values)
- [ ] Slots are named semantically
- [ ] No console warnings or errors
- [ ] Tested at 200% zoom for reflow
- [ ] Uses Tailwind utilities (not inline styles)
