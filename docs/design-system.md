# Design System

## Token System

### Spacing (4px base)

```
--space-1: 4px     --space-6: 24px    --space-16: 64px
--space-2: 8px     --space-8: 32px    --space-20: 80px
--space-3: 12px    --space-10: 40px   --space-24: 96px
--space-4: 16px    --space-12: 48px
--space-5: 20px
```

### Colors

- **Palette**: Flexoki — 8 hues (red, orange, yellow, green, cyan, blue, purple, magenta) in oklch
- **Semantic**: primary, secondary, accent, destructive, muted, border — light/dark pairs
- **Button primary**: `--btn-primary` — darker/lighter than `--primary` for contrast
- **CTA**: `--accent-cta` / `--accent-cta-text` for interactive elements
- **Dark mode**: Per-theme oklch mapping (`.dark` class)

### Radius

```
--radius: 0.25rem    --radius-lg: 0.625rem
--radius-sm: 0.375rem   --radius-xl: 0.875rem
--radius-md: 0.5rem
```

### Shadows

8-level scale: `--shadow-2xs` through `--shadow-2xl`, tinted to background hue per theme.

### Motion

- **Durations**: instant (50ms) → slower (600ms), mapped to utility classes
- **Easings**: default, in, out, spring, smooth
- **Animations**: `fade-up`, `fade-in`, `slide-in` in tokens; `scroll-reveal` (CSS `animation-timeline: view()`) for scroll-driven entrance
- **Reduced motion**: Respected globally via `@media (prefers-reduced-motion)` + IntersectionObserver early-return

## Component Library

| Component     | Status | Variants          | Notes |
| ------------- | ------ | ----------------- | ----- |
| Button        | Done   | 6                 | + `--btn-primary` token for contrast |
| Badge         | Done   | 7                 | Pill style (`rounded-full`) |
| Card          | Done   | Single (container)| Simplified from interactive/default to one style |
| Section       | Done   | Fade-up animation | `IntersectionObserver` + `prefers-reduced-motion` |
| Heading       | Done   | 9 sizes × 4 weights | Wraps `Text` primitive |
| Text          | Done   | 9 sizes × 5 colors × 5 weights | Primitive, all text components use this |
| Search        | Done   | Svelte interactive | Pagefind, keyboard nav, dialog |
| ThemeToggle   | Done   | Svelte interactive | Inline script prevents FOUC |
| BottomCTA     | Done   | Ghost links       | Homepage directional nav |
| PageHeader    | Done   | Title + description | Used on tools, projects, tags |

### Missing

- Gradient tokens

### Usage Patterns

```astro
---
import Button from "@/components/ui/Button.astro";
import Badge from "@/components/ui/Badge.astro";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
---

<Button variant="default" size="lg" />

<Badge variant="accent">New</Badge>

<Card>
	<CardHeader>
		<CardTitle>Title</CardTitle>
	</CardHeader>
	<CardContent>Content</CardContent>
</Card>
```

### Color Usage

```astro
<div class="bg-primary text-primary-foreground">Primary</div>
<div class="bg-btn-primary text-btn-primary-foreground">Button</div>
<div class="text-accent-foreground hover:bg-accent">Hover</div>
<div class="border-border">Bordered</div>
```

## Architecture

```
src/components/
├── ui/primitives/          # Box, Container, Stack, Text
├── ui/                     # Button, Badge, Card, Heading, Section, etc.
├── shell/                  # Header, Footer, BaseHead, NavLink, JSONLD
├── common/                 # PostMetadata, Seo, SocialLinks
└── features/               # home/, about/, blog/, projects/, tools/, og/
```

## CSS Files

```
src/assets/styles/
├── system/tokens.css       # Design tokens (@theme + runtime vars)
├── system/base.css         # Global styles + reduced-motion
├── global.css              # Import order, plugins, utilities
└── components/             # admonition.css, prose.css, scroll-reveal.css, etc.
```

## Verification Checklist

Before creating a new component:

- Follow the component template in `astro-best-practices.md`
- Use design tokens (no hardcoded values)
- Test both light and dark modes
- Run `bun run lint` and `bun run check`
- Verify accessibility (focus states, ARIA attributes, color contrast)
