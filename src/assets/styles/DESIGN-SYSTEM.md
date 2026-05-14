# Design System Documentation

## 📋 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Components](#components)
3. [Color System](#color-system)
4. [Spacing & Layout](#spacing--layout)
5. [Typography](#typography)
6. [Motion & Animation](#motion--animation)
7. [Best Practices](#best-practices)
8. [Astro Integration](#astro-integration)

---

## Design Tokens

### Token Categories

Our design system uses CSS custom properties organized into semantic categories:

```
@theme {
  /* Typography tokens */
  --font-sans, --font-mono

  /* Spacing scale (4px base) */
  --space-1 through --space-24

  /* Motion tokens */
  --duration-instant, fast, base, slow, slower
  --ease-default, in, out, spring, smooth
  --transition-fast, base, slow, spring

  /* Color palette */
  --color-flexoki-{hue}-{weight}  /* Brand colors */
  --color-accent-cta                /* CTA semantic */
  --color-{semantic}-{variant}      /* UI colors */

  /* Border radius */
  --radius, radius-sm, radius-md, radius-lg, radius-xl
}
```

### Spacing Scale Reference

Based on **4px unit**, ensuring consistent rhythm:

| Token        | Value          | Use Case                   |
| ------------ | -------------- | -------------------------- |
| `--space-1`  | 0.25rem (4px)  | Tight spacing, icon gaps   |
| `--space-2`  | 0.5rem (8px)   | Component internal spacing |
| `--space-3`  | 0.75rem (12px) | Small gaps, padding        |
| `--space-4`  | 1rem (16px)    | Default padding, gaps      |
| `--space-5`  | 1.25rem (20px) | Medium spacing             |
| `--space-6`  | 1.5rem (24px)  | Section padding            |
| `--space-8`  | 2rem (32px)    | Large gaps                 |
| `--space-10` | 2.5rem (40px)  | Section top-bottom         |
| `--space-12` | 3rem (48px)    | Major sections             |
| `--space-16` | 4rem (64px)    | Layout gaps                |
| `--space-20` | 5rem (80px)    | Large sections             |
| `--space-24` | 6rem (96px)    | Full page gaps             |

**Usage in Tailwind:**

```astro
<!-- Using Tailwind scale -->
<div class="mb-8 gap-6 p-4">...</div>

<!-- Using CSS tokens (when needed) -->
<div style="padding: var(--space-4)">...</div>
```

---

## Components

### Button Component

**Location:** `src/components/ui/Button.astro`

#### Variants

| Variant       | Use Case                   | Example                    |
| ------------- | -------------------------- | -------------------------- |
| `default`     | Primary action             | "Save", "Submit", "Create" |
| `outline`     | Secondary action           | "Cancel", "Preview"        |
| `secondary`   | Alternative action         | "Learn more", "Read docs"  |
| `ghost`       | Tertiary action            | "Skip", inline actions     |
| `destructive` | Dangerous action           | "Delete", "Remove"         |
| `link`        | Text link styled as button | Inline navigation          |

#### Sizes

| Size      | Use Case                 | Dimensions  |
| --------- | ------------------------ | ----------- |
| `xs`      | Tight spaces, compact UI | 24px height |
| `sm`      | Small components         | 28px height |
| `default` | Standard components      | 32px height |
| `lg`      | CTA buttons              | 36px height |
| `icon`    | Icon-only buttons        | 32px square |
| `icon-xs` | Compact icon buttons     | 24px square |
| `icon-sm` | Small icon buttons       | 28px square |
| `icon-lg` | Large icon buttons       | 36px square |

#### Example Usage

```astro
---
import Button from "@/components/ui/Button.astro";
---

<!-- Primary action -->
<Button href="/dashboard" variant="default">Go to Dashboard</Button>

<!-- With icon -->
<Button as="button" variant="secondary" size="sm">
	<span slot="icon-before">⭐</span>
	Save for later
</Button>

<!-- Icon-only -->
<Button
	as="button"
	variant="ghost"
	size="icon-sm"
	title="Close"
	aria-label="Close menu"
>
	<span slot="icon-before">✕</span>
</Button>
```

### Badge Component

**Location:** `src/components/ui/Badge.astro`

#### Variants

| Variant       | Use Case           | Example            |
| ------------- | ------------------ | ------------------ |
| `default`     | Default badge      | Tags, labels       |
| `accent`      | Highlight status   | Featured, new      |
| `secondary`   | Alternative status | Related, secondary |
| `destructive` | Error/alert status | Broken, error      |
| `outline`     | Border-only badge  | Outlined tags      |
| `ghost`       | Subtle badge       | Muted labels       |
| `link`        | Clickable badge    | Filter tags        |

#### Example Usage

```astro
---
import Badge from "@/components/ui/Badge.astro";
---

<!-- Tag label -->
<Badge>astro</Badge>

<!-- Highlighted -->
<Badge variant="accent">New</Badge>

<!-- Error state -->
<Badge variant="destructive">Failed</Badge>

<!-- Clickable tag -->
<Badge as="a" href="/tags/typescript" variant="link">TypeScript</Badge>
```

### Card Components

**Location:** `src/components/ui/card/`

Card system uses **subcomponent composition pattern** for flexibility:

```astro
---
import Card from "@/components/ui/card/Card.astro";
import CardHeader from "@/components/ui/card/CardHeader.astro";
import CardTitle from "@/components/ui/card/CardTitle.astro";
import CardDescription from "@/components/ui/card/CardDescription.astro";
import CardContent from "@/components/ui/card/CardContent.astro";
import CardFooter from "@/components/ui/card/CardFooter.astro";
---

<Card>
	<CardHeader>
		<CardTitle>Feature Title</CardTitle>
		<CardDescription>Optional subtitle or description</CardDescription>
	</CardHeader>
	<CardContent>
		<!-- Main content -->
	</CardContent>
	<CardFooter>
		<!-- Actions or metadata -->
	</CardFooter>
</Card>
```

### Heading Component

**Location:** `src/components/ui/Heading.astro`

#### Semantic Levels & Sizes

```astro
---
import Heading from "@/components/ui/Heading.astro";
---

<!-- Page title -->
<Heading as="h1" size="6xl" weight="bold">Main Title</Heading>

<!-- Section heading -->
<Heading as="h2" size="3xl" weight="semibold">Section Title</Heading>

<!-- Subsection -->
<Heading as="h3" size="xl" weight="medium">Subsection</Heading>
```

**Available Sizes:** `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`
**Available Weights:** `light`, `medium`, `semibold`, `bold`

### Section Component

**Location:** `src/components/ui/Section.astro`

Wrapper component with built-in animation and spacing:

```astro
---
import Section from "@/components/ui/Section.astro";
---

<Section
	title="About Me"
	titleAs="h2"
	titleSize="2xl"
	titleWeight="semibold"
	transitionDelay={200}
>
	<!-- Content auto-animates in on scroll -->
</Section>
```

---

## Color System

### Flexoki Palette

8 accent hues with light (400) and dark (600) variants. Brand identity colors:

```
Red, Orange, Yellow, Green, Cyan, Blue, Purple, Magenta
```

**CSS Variable Format:**

```css
--color-flexoki-{hue}-{weight}

/* Examples */
--color-flexoki-cyan-400   /* Light mode cyan */
--color-flexoki-cyan-600   /* Dark mode cyan */
--color-flexoki-red-400    /* Light mode red */
```

### Semantic Colors

Colors mapped to semantic meaning and theme:

#### Light Mode

```css
--background: #fffcf0; /* Off-white/cream */
--foreground: 0 3% 6%; /* Near black */
--primary: 0 3% 6%; /* Same as foreground */
--accent: 51 21% 88%; /* Warm beige */
--destructive: 3 62% 42%; /* Alert red */
--muted: 51 33% 92%; /* Light gray */
--border: 50 14% 83%; /* Light border */
```

#### Dark Mode

```css
--background: #100f0f; /* Almost black */
--foreground: 55 10% 79%; /* Light gray */
--primary: 55 10% 79%; /* Same as foreground */
--accent: 30 3% 15%; /* Dark accent */
--destructive: 5 61% 54%; /* Alert red */
--muted: 30 4% 11%; /* Dark gray */
--border: 40 3% 20%; /* Dark border */
```

### CTA Accent (Semantic)

Interactive elements use **Flexoki cyan** for consistent CTA styling:

```css
/* Light mode */
--accent-cta: #3aa99f; /* Cyan accent */
--accent-cta-subtle: rgba(...); /* 10% opacity background */
--accent-cta-text: #1a5f5a; /* Darker cyan for text */

/* Dark mode */
--accent-cta: #24837b; /* Dark cyan */
--accent-cta-text: #3aa99f; /* Light cyan for text */
```

**Usage:**

```astro
<!-- CTA link -->
<a href="#" style="color: var(--color-accent-cta)">Learn more</a>

<!-- CTA button background -->
<button style="background: var(--color-accent-cta-subtle)"> Interact </button>
```

### Color Contrast & Accessibility

All color combinations must meet **WCAG AA** (4.5:1 for text):

- ✅ `foreground` on `background` (7.8:1)
- ✅ `primary` on `card` (7.8:1)
- ✅ `accent-cta` on `background` (3.9:1 ⚠️ Large text only)
- ✅ `destructive` on background (5.2:1)

---

## Spacing & Layout

### Container Utility

Pre-configured container with centered content:

```astro
<div class="container">
	<!-- Auto-centered, max-width 1400px, padding 32px -->
</div>
```

### Gap & Padding Scale

Always use Tailwind utilities with the spacing scale:

```astro
<!-- Vertical spacing -->
<div class="gap-y-4">
	<!-- 16px gap -->
	<div class="space-y-6">
		<!-- 24px spacing -->

		<!-- Horizontal spacing -->
		<div class="gap-x-3">
			<!-- 12px gap -->
			<div class="space-x-2">
				<!-- 8px spacing -->

				<!-- Padding -->
				<div class="p-4">
					<!-- 16px padding all sides -->
					<div class="px-6 py-4"><!-- 24px horizontal, 16px vertical --></div>
				</div>
			</div>
		</div>
	</div>
</div>
```

### Flexbox Patterns

```astro
<!-- Centered flex -->
<div class="flex items-center justify-center gap-4">
	<!-- Space-between layout -->
	<div class="flex items-start justify-between gap-6">
		<!-- Column layout with spacing -->
		<div class="flex flex-col gap-y-8"></div>
	</div>
</div>
```

---

## Typography

### Font Stack

```css
--font-sans: var(--font-ia-writer-quattro); /* Default body font */
--font-mono: var(--font-ibm-plex-mono); /* Code/monospace */
```

### Text Scale

Tailwind CSS text sizes aligned with design:

| Tailwind Class                | Use Case          | Example                |
| ----------------------------- | ----------------- | ---------------------- |
| `text-xs`                     | Small annotations | Meta info, helper text |
| `text-sm`                     | Subtext, labels   | Form labels, captions  |
| `text-base`                   | Body text         | Paragraphs, list items |
| `text-lg`                     | Emphasis          | Lead paragraphs        |
| `text-xl`                     | Small headings    | Subsection titles      |
| `text-2xl` through `text-6xl` | Headings          | Page/section titles    |

### Line Height & Spacing

```astro
<!-- Default body -->
<p class="text-base leading-7">Paragraph text</p>

<!-- Heading -->
<h2 class="text-3xl leading-tight font-semibold">Heading</h2>

<!-- Code block -->
<pre class="font-mono text-sm leading-relaxed">code</pre>
```

---

## Motion & Animation

### Motion Tokens

Durations for different animation contexts:

```css
--duration-instant: 50ms; /* Instant feedback */
--duration-fast: 150ms; /* Quick interaction */
--duration-base: 250ms; /* Default transition */
--duration-slow: 400ms; /* Noticeable animation */
--duration-slower: 600ms; /* Entrance animation */
--duration-page: 300ms; /* Astro page fade */
```

### Easing Functions

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1); /* Material standard */
--ease-in: cubic-bezier(0.4, 0, 1, 1); /* Accelerate */
--ease-out: cubic-bezier(0, 0, 0.2, 1); /* Decelerate */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful bounce */
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth */
```

### Composite Transitions

Pre-combined duration + easing:

```css
--transition-fast: var(--duration-fast) var(--ease-default);
--transition-base: var(--duration-base) var(--ease-default);
--transition-slow: var(--duration-slow) var(--ease-out);
--transition-spring: var(--duration-slow) var(--ease-spring);
```

### Built-in Keyframe Animations

```astro
<!-- Fade in from below -->
<div class="animate-fade-up">Content</div>

<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Slide in from left -->
<div class="animate-slide-in">Content</div>
```

### Creating Custom Animations

```css
@keyframes my-animation {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}
```

Then apply with:

```astro
<div style="animation: my-animation var(--transition-base)">Content</div>
```

---

## Best Practices

### ✅ DO

1. **Use semantic color names** — Prefer `primary`, `accent`, `destructive` over specific hues
2. **Reference tokens** — Always use `--space-*`, `--duration-*` tokens instead of hardcoding
3. **Leverage Tailwind utilities** — Use `gap-4`, `p-6` instead of inline CSS
4. **Compose with subcomponents** — Use Card, Badge, Button patterns for consistency
5. **Test light AND dark mode** — Ensure all color variants work in both
6. **Use motion for feedback** — Transitions on hover, animations on entrance
7. **Type component props** — Full TypeScript types, no `any`
8. **Document variants** — Show all prop combinations in comments

### ❌ DON'T

1. **Hardcode colors** — Don't use `#3aa99f` directly, use `var(--color-accent-cta)`
2. **Magic numbers for spacing** — Don't use `margin: 17px`, use `gap-4` (16px)
3. **Inconsistent transitions** — Don't mix `0.3s` and `300ms`, use token values
4. **Mix component systems** — Don't conditionally use different component types
5. **Ignore dark mode** — Always test both light and dark theme
6. **Forget accessibility** — Always include focus states, aria attributes
7. **Over-animate** — Keep animations subtle (fast, spring) for UX
8. **Nest too deep** — Avoid deeply nested slot structures in Astro components

### Naming Conventions

```astro
<!-- Component files: PascalCase -->Button.astro CardHeader.astro
SocialLinks.astro

<!-- Utility functions: camelCase -->
cn() /* class name merger */

<!-- CSS variables: kebab-case -->
--space-4 --color-accent-cta --duration-base --ease-spring

<!-- Props: camelCase, semantic -->
variant, size, as, href titleSize, titleWeight, transitionDelay
```

---

## Astro Integration

### Component Props Typing

Always type Astro component props:

```astro
---
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"button"> {
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "default" | "lg";
	class?: string;
}

const { variant = "default", size = "default", ...attrs } = Astro.props;
---
```

### CSS Scoping

Astro automatically scopes component `<style>` tags:

```astro
<button class="my-button">Click me</button>

<style>
	/* Only applies to this component */
	.my-button {
		@apply rounded px-4 py-2;
	}
</style>
```

### Client Hydration

Use explicit hydration directives for interactive components:

```astro
---
import Search from "@/components/Search.svelte";
---

<!-- Load after page interactive (Svelte component) -->
<Search client:idle />

<!-- Load when visible (progressive enhancement) -->
<Slider client:visible />

<!-- Load immediately (critical interactive) -->
<ThemeToggle client:load />
```

### Animation Triggers

Use Intersection Observer for scroll-triggered animations:

```astro
<script>
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.remove("opacity-0", "translate-y-4");
					entry.target.classList.add("opacity-100", "translate-y-0");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.1 }
	);

	document.querySelectorAll(".fade-up-section").forEach((el) => {
		observer.observe(el);
	});

	// Handle page transitions
	document.addEventListener("astro:page-load", () => {
		// Re-observe elements
	});
</script>
```

---

## Migration Guide

### From v1 to Current System

1. **Update color references:**

   ```diff
   - color: #3aa99f;
   + color: var(--color-accent-cta);
   ```

2. **Use spacing tokens:**

   ```diff
   - margin: 16px;
   + margin: var(--space-4);
   ```

3. **Reference motion tokens:**

   ```diff
   - transition: all 0.3s ease-out;
   + transition: all var(--transition-slow);
   ```

4. **Update component imports:**
   ```diff
   - import Button from './components/Button.astro'
   + import Button from '@/components/ui/Button.astro'
   ```

---

## Resources

- [Flexoki Palette](https://stephango.com/flexoki) — Brand color system
- [Tailwind CSS Utilities](https://tailwindcss.com/docs) — Styling utilities
- [Astro Components](https://docs.astro.build/en/basics/astro-components/) — Component docs
- [WCAG Color Contrast](https://webaim.org/resources/contrastchecker/) — Accessibility checker
