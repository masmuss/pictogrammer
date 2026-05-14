# Component Primitives Guide

## Overview

Primitives adalah layout building blocks yang reusable dan konsisten. Gunakan untuk membangun layout tanpa manual class composition.

## Components

### Box
Semantic layout wrapper dengan spacing, borders, dan flex/grid support.

```astro
---
import { Box } from "@/components/ui/primitives";
---

<Box 
  padding="md" 
  rounded="lg" 
  border="border" 
  bg="surface"
  display="flex"
  flexDirection="col"
  gap="md"
>
  Content here
</Box>
```

**Props:**
- `padding` - xs, sm, md, lg, xl
- `margin` - xs, sm, md, lg, xl
- `rounded` - none, sm, md, lg, xl, full
- `border` - border, ring, none
- `bg` - surface, surface-alt, muted, none
- `maxWidth` - sm, md, lg, xl, full
- `display` - flex, grid, block
- `flexDirection` - row, col (flex only)
- `flexWrap` - wrap, nowrap
- `justifyContent` - start, center, between, end
- `alignItems` - start, center, end, stretch
- `gap` - xs, sm, md, lg, xl

---

### Stack
Flex convenience component untuk consistent spacing antar children.

```astro
---
import { Stack } from "@/components/ui/primitives";
import Button from "@/components/ui/Button.astro";
---

<Stack gap="md" alignItems="center" justifyContent="between">
  <Button>First</Button>
  <Button>Second</Button>
</Stack>
```

**Props:**
- `direction` - row, col (default: col)
- `gap` - xs, sm, md, lg, xl, none (default: md)
- `alignItems` - start, center, end, stretch
- `justifyContent` - start, center, between, end
- `wrap` - wrap, nowrap

---

### Text
Semantic text wrapper dengan token-based sizing, weights, dan colors.

```astro
---
import { Text } from "@/components/ui/primitives";
---

<Text size="lg" weight="medium" color="muted">
  Subtitle here
</Text>

<Text as="label" size="sm" weight="semibold">
  Form label
</Text>
```

**Props:**
- `as` - p, span, div, label (default: p)
- `size` - xs, sm, base, lg, xl
- `weight` - regular, medium, semibold, bold
- `color` - default, muted, subtle, accent
- `lineClamp` - 1, 2, 3, 4, 5, none
- `align` - left, center, right, justify

---

## Usage Patterns

### Layout Grid
```astro
<Box display="grid" gap="lg">
  <Box bg="surface" padding="lg" rounded="lg">
    Card 1
  </Box>
  <Box bg="surface" padding="lg" rounded="lg">
    Card 2
  </Box>
</Box>
```

### Centered Content
```astro
<Stack gap="md" alignItems="center" justifyContent="center">
  <Text size="lg" weight="bold">Heading</Text>
  <Text color="muted">Subtitle</Text>
</Stack>
```

### Form Group
```astro
<Stack gap="sm">
  <Text as="label" weight="medium">Email</Text>
  <input type="email" />
  <Text as="caption" size="sm" color="muted">
    We'll never share your email
  </Text>
</Stack>
```

---

## Token Reference

### Spacing Scale (4px base)
- xs = --space-1 (0.25rem / 4px)
- sm = --space-2 (0.5rem / 8px)
- md = --space-3 (0.75rem / 12px)
- lg = --space-4 (1rem / 16px)
- xl = --space-6 (1.5rem / 24px)

### Border Radius
- sm = 0.25rem (4px)
- md = 0.5rem (8px)
- lg = 0.75rem (12px)
- xl = 1rem (16px)
- full = 9999px (fully rounded)

### Typography Sizes
- xs = 0.75rem (12px)
- sm = 0.875rem (14px)
- base = 1rem (16px)
- lg = 1.125rem (18px)
- xl = 1.25rem (20px)

---

## Best Practices

✅ **DO:**
- Use Box for consistent spacing and layout
- Use Stack for flex containers (cleaner API)
- Use Text for semantic text content
- Combine primitives for complex layouts
- Prefer gap over margins for spacing

❌ **DON'T:**
- Mix Tailwind classes with primitives (use primitives props)
- Use Box for single text content (use Text)
- Hardcode colors (use color prop variants)
- Override primitive classes with `class` prop unless necessary

---

## Examples

### Card with Title & Description
```astro
---
import { Box, Stack, Text } from "@/components/ui/primitives";
---

<Box bg="surface" padding="lg" rounded="lg" border="border">
  <Stack gap="md">
    <Text size="lg" weight="semibold">Card Title</Text>
    <Text color="muted">Card description goes here</Text>
  </Stack>
</Box>
```

### Feature List
```astro
<Stack gap="lg">
  {features.map((feature) => (
    <Stack gap="sm" direction="row" alignItems="start">
      <div class="text-accent">✓</div>
      <Stack gap="xs">
        <Text weight="medium">{feature.title}</Text>
        <Text size="sm" color="muted">{feature.description}</Text>
      </Stack>
    </Stack>
  ))}
</Stack>
```

### Header Section
```astro
<Box bg="surface" padding="lg" rounded="lg">
  <Stack gap="sm" alignItems="center" justifyContent="between">
    <Stack gap="xs">
      <Text size="xl" weight="bold">Main Heading</Text>
      <Text color="muted">Supporting text</Text>
    </Stack>
    <Button>Action</Button>
  </Stack>
</Box>
```
