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

- **Palette**: Flexoki — 8 hues (red, orange, yellow, green, cyan, blue, purple, magenta)
- **Semantic**: primary, secondary, accent, destructive, muted, border
- **CTA**: cyan for interactive elements
- **Dark mode**: Automatic HSL mapping per theme

### Motion

- **Durations**: instant (50ms) → slower (600ms)
- **Easings**: default, in, out, spring, smooth
- **Keyframes**: fade-up, fade-in, slide-in

## Component Library

| Component   | Status | Variants             | Sizes |
| ----------- | ------ | -------------------- | ----- |
| Button      | Done   | 6                    | 7     |
| Badge       | Done   | 7                    | 1     |
| Card        | Done   | Subcomponent pattern | —     |
| Heading     | Done   | —                    | 9     |
| Section     | Done   | With animations      | —     |
| Search      | Done   | Svelte interactive   | —     |
| ThemeToggle | Done   | Svelte interactive   | —     |

### Missing (Priority)

- Text component
- Shadow tokens
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
<div class="text-accent-foreground hover:bg-accent">Hover</div>
<div class="border-border">Bordered</div>
<div style="color: var(--color-accent-cta)">CTA</div>
```

## Architecture

```
src/components/
├── ui/primitives/          # Box, Container, Stack, Text
├── ui/                     # Button, Badge, Card, Heading, Section, etc.
├── shell/                  # Header, Footer, BaseHead, NavLink, JSONLD
├── common/                 # PostMetadata, Seo, SocialLinks
└── features/               # home/, about/, blog/, projects/, tools/
```

## CSS Files

```
src/assets/styles/
├── system/tokens.css       # Design tokens
├── system/base.css         # Global styles
├── global.css              # Import order and utilities
└── components/             # Component-specific styles
```

## Verification Checklist

Before creating a new component:

- Follow the component template in `astro-best-practices.md`
- Use design tokens (no hardcoded values)
- Test both light and dark modes
- Run `npm run lint` and `npm run check`
- Verify accessibility (focus states, ARIA attributes, color contrast)
