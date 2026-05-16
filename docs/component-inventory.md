# Component Inventory

## Component Hierarchy

```
src/components/
├── ui/primitives/              # Atomic layout building blocks
│   ├── Box.astro               # Generic div with configurable layout props
│   ├── Container.astro         # Max-width centered container with responsive padding
│   ├── Stack.astro             # Flex wrapper for consistent spacing
│   └── Text.astro              # Semantic text with color, size, and alignment props
│
├── ui/                         # Generic reusable UI components
│   ├── AsideListPanel.astro
│   ├── Badge.astro             # 7 variants
│   ├── Button.astro            # 6 variants x 7 sizes
│   ├── Heading.astro           # 9 sizes x 4 weights
│   ├── InfoPanel.astro
│   ├── PageHeader.astro
│   ├── Paginator.astro
│   ├── Section.astro           # With scroll animation
│   ├── ThemeProvider.astro
│   ├── ThemeToggle.astro       # Svelte
│   ├── card/                   # Subcomponent pattern
│   │   ├── Card.astro
│   │   ├── CardHeader.astro
│   │   ├── CardTitle.astro
│   │   ├── CardDescription.astro
│   │   ├── CardContent.astro
│   │   └── CardFooter.astro
│   └── search/                 # Svelte interactive
│       ├── Search.svelte
│       ├── SearchBar.svelte
│       ├── SearchModal.svelte
│       ├── SearchResultItem.svelte
│       ├── SearchTrigger.svelte
│       ├── Kbd.svelte
│       └── search-state.svelte.ts
│
├── shell/                      # Structural page components
│   ├── BaseHead.astro          # HTML head content
│   ├── Header.astro            # Navigation bar
│   ├── Footer.astro            # Page footer
│   ├── NavLink.astro           # Navigation item
│   └── JSONLD.astro            # Schema.org markup
│
├── common/                     # Shared presentational components
│   ├── PostMetadata.astro      # Post info display
│   ├── Seo.astro               # SEO metadata
│   └── SocialLinks.astro       # Social links group
│
└── features/                   # Page-specific domain components
    ├── home/                   # Hero, About, FeaturedProjects, Posts
    ├── about/                  # Experiences, Educations, Certifications, SkillsTabs
    ├── blog/                   # Hero, PostPreview, TOC, RelatedPost, Comment
    ├── projects/               # ProjectCard
    └── tools/                  # ToolItem, ToolSection
```

## Component Tiers

| Tier | Category           | Examples                                |
| ---- | ------------------ | --------------------------------------- |
| 1    | Primitives         | Box, Container, Stack, Text             |
| 2    | UI Molecules       | Button, Badge, Card, Search             |
| 3    | Features/Organisms | ExperienceItem, PostPreview, SkillsTabs |
| 4    | Page Templates     | BlogListLayout, page files              |

## Design System Coverage

### Implemented

- Spacing (--space-1 through --space-24)
- Colors (Flexoki palette + semantic)
- Motion (durations, easings, keyframes)
- Typography (font stack)
- Border radius scale

### Missing

- Gradient tokens
- Shadow system
- Line height and letter spacing tokens
- Form components (Input, Select, Checkbox, Textarea)
- Dialog/Modal

## Accessibility Status

| Component | Focus States | ARIA       | Color Contrast |
| --------- | ------------ | ---------- | -------------- |
| Button    | Partial      | Incomplete | Pass           |
| Badge     | Pass         | Pass       | Pass           |
| Heading   | Pass         | N/A        | Pass           |
| Section   | Partial      | N/A        | N/A            |
| Card      | Pass         | N/A        | Pass           |
| Search    | Pass         | Partial    | Pass           |
