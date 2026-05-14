# Component Inventory & Architecture

## Current Components (Directory Map)

```
src/components/
├── ui/                              [Design System Core]
│   ├── Button.astro                 ⭐ 6 variants × 7 sizes
│   ├── Badge.astro                  ⭐ 7 variants
│   ├── Heading.astro                ⭐ 9 sizes × 4 weights
│   ├── Section.astro                ⭐ With scroll animation
│   ├── PageHeader.astro             📌 Page title wrapper
│   ├── Paginator.astro              📌 Pagination control
│   ├── InfoPanel.astro              📌 Alert/info box
│   ├── AsideListPanel.astro         📌 Sidebar list
│   ├── ThemeProvider.astro          🔧 Theme toggle logic
│   ├── ThemeToggle.astro            🔧 Dark mode button
│   ├── card/                        [Subcomponent Pattern]
│   │   ├── Card.astro               Base container
│   │   ├── CardHeader.astro         Header section
│   │   ├── CardTitle.astro          Title element
│   │   ├── CardDescription.astro    Description text
│   │   ├── CardContent.astro        Main content
│   │   └── CardFooter.astro         Footer section
│   └── search/                      [Svelte Interactive]
│       ├── Search.svelte            Search component
│       ├── SearchBar.svelte         Input + results
│       ├── SearchModal.svelte       Modal wrapper
│       ├── SearchResultItem.svelte  Result item
│       ├── SearchTrigger.svelte     Trigger button
│       ├── Kbd.svelte               Keyboard hint
│       └── search-state.svelte.ts   State management
│
├── layout/                          [Page Structure]
│   ├── BaseHead.astro               <head> content
│   ├── Header.astro                 Navigation bar
│   ├── Footer.astro                 Page footer
│   ├── NavLink.astro                Nav item link
│   ├── Tag.astro                    Tag element
│   └── JSONLD.astro                 Schema.org markup
│
├── common/                          [Shared Utilities]
│   ├── FormattedDate.astro          Date formatter
│   ├── PostMetadata.astro           Post info display
│   ├── Seo.astro                    SEO metadata
│   └── SocialLinks.astro            Social links group
│
└── features/                        [Feature-Specific]
    ├── home/
    │   ├── Hero.astro               Landing hero
    │   ├── About.astro              About section
    │   ├── FeaturedProjects.astro   Projects showcase
    │   ├── FeaturedProjectItem.astro Project card
    │   └── Posts.astro              Recent posts
    │
    ├── about/
    │   ├── CertificationItem.astro  Cert item
    │   ├── Certifications.astro     Cert list
    │   ├── EducationItem.astro      Education item
    │   ├── Educations.astro         Education list
    │   ├── ExperienceItem.astro     Work item
    │   ├── ExperienceOrgHeader.astro Company info
    │   ├── Experiences.astro        Work history
    │   ├── ExperienceSkillPills.astro Skill tags
    │   ├── SkillsTabs.astro         Skill categories
    │   └── GitHubCalendar.astro     Contribution graph
    │
    ├── blog/
    │   ├── Hero.astro               Blog header
    │   ├── BlogListLayout.astro     Post list layout
    │   ├── BlogTabs.astro           Category tabs
    │   ├── PostPreview.astro        Post card
    │   ├── RelatedPost.astro        Related articles
    │   ├── PostImage.astro          Post cover
    │   ├── TOC.astro                Table of contents
    │   ├── TOCHeading.astro         TOC item
    │   └── Comment.astro            Comment component
    │
    ├── projects/
    │   └── ProjectCard.astro        Project showcase
    │
    └── tools/
        ├── ToolItem.astro           Tool/service item
        └── ToolSection.astro        Tool group
```

## Component Tiers

### Tier 1: Atomic/Primitives

```
Button
Badge
Heading
Spacer (missing - should create)
Box (missing - should create)
```

### Tier 2: Composed/Molecules

```
Card (composition of 6 subcomponents)
PageHeader
InfoPanel
SearchBar
FormattedDate
SocialLinks
```

### Tier 3: Features/Organisms

```
Hero sections (home, blog)
Section containers
Project cards
Experience items
Education items
Skill displays
```

### Tier 4: Page Templates

```
Blog list layout
Project showcase
About page structure
Home page layout
```

## Design System Coverage

### Core Tokens ✅

- [x] Spacing (--space-1 through --space-24)
- [x] Colors (Flexoki palette + semantic)
- [x] Motion (durations, easings, keyframes)
- [x] Typography (font stack)
- [x] Border radius (radius scale)
- [ ] Gradients (MISSING)
- [ ] Shadows (MISSING)
- [ ] Line heights (MISSING)

### Component Coverage

- [x] Button → All sizes/variants implemented
- [x] Badge → Basic variants
- [x] Card → Full subcomponent pattern
- [x] Heading → Multiple sizes
- [x] Section → With animations
- [ ] Box → MISSING
- [ ] Stack → MISSING
- [ ] Spacer → MISSING

### Interactive Components

- [x] Search (Svelte - client:idle)
- [x] ThemeToggle (Svelte - client:load)
- [x] Navigation (Astro static)
- [ ] Modal/Dialog (MISSING)
- [ ] Dropdown/Menu (MISSING)
- [ ] Tabs (MISSING)

## Component Statistics

- **Total Components**: ~70+
- **UI System Components**: 17 (Button, Badge, Card + variants, etc)
- **Interactive (Svelte)**: 8 (Search, ThemeToggle)
- **Feature Components**: 30+
- **Layout Components**: 6

## Accessibility Status

| Component | Focus States | ARIA          | Color Contrast |
| --------- | ------------ | ------------- | -------------- |
| Button    | ✅ Partial   | ⚠️ Incomplete | ✅             |
| Badge     | ✅           | ✅            | ✅             |
| Heading   | ✅           | N/A           | ✅             |
| Section   | ⚠️           | N/A           | N/A            |
| Card      | ✅           | N/A           | ✅             |
| Search    | ✅           | ⚠️            | ✅             |

## Performance

- **Static Components (Astro)**: ~99% → Zero JavaScript
- **Interactive Components**: Search, ThemeToggle (client:idle)
- **Bundle Impact**: Minimal (design tokens only)

## Missing Components (To Create)

### Priority HIGH

- [ ] **Text** - Semantic text/paragraph component
- [ ] **Box** - Layout primitive (div wrapper)
- [ ] **Stack** - Flex direction helper (gap utilities)
- [ ] **Spacer** - Consistent spacing component

### Priority MEDIUM

- [ ] **Dialog/Modal** - Modal overlay
- [ ] **Dropdown/Menu** - Dropdown selection
- [ ] **Tabs** - Tabbed interface
- [ ] **Input** - Form input component
- [ ] **Select** - Dropdown select
- [ ] **Checkbox** - Checkbox input
- [ ] **Radio** - Radio input
- [ ] **Textarea** - Multi-line text input

### Priority LOW

- [ ] **Tooltip** - Hover information
- [ ] **Popover** - Context menu
- [ ] **Alert** - Alert message (expand InfoPanel)
- [ ] **Toast** - Notification message
- [ ] **Skeleton** - Loading placeholder
- [ ] **Breadcrumb** - Navigation path

## Component Patterns Used

### ✅ Patterns Applied

1. **Subcomponent Composition** (Card)
2. **Variant System** (Button, Badge)
3. **Size System** (Button, Badge)
4. **Semantic HTML** (All components)
5. **CSS Scoping** (Astro native)
6. **TypeScript Props** (All components)
7. **Slot Composition** (Flexible layouts)
8. **Dark Mode** (All color components)

### ❌ Anti-Patterns Found

1. Hardcoded values instead of tokens
2. Complex inline styles
3. Mixed concerns in components
4. Unsafe DOM manipulation
5. Duplicate code/styles
6. Magic numbers for sizing

## Code Quality Metrics

```
Lines of Code: ~807 (UI components)
Components: 17 core
Variants: 50+
Sizes: 30+
Type Coverage: 95%
Test Coverage: ~20%
Documentation: 70%
```

## Refactoring Opportunities

### High Impact, Quick Win

1. Extract Button baseClass (30 min)
2. Fix duplicate animations (15 min)
3. Add Box & Stack primitives (1 hour)

### High Impact, Medium Effort

1. Create Text component (45 min)
2. Add form components (2 hours)
3. Extend token system (1 hour)

### Lower Priority

1. Create Dialog/Modal (2 hours)
2. Visual regression tests (3 hours)
3. Component documentation site (4 hours)

## Next Actions

1. **Read**: DESIGN-SYSTEM.md (token reference)
2. **Review**: CODE-AUDIT.md (known issues)
3. **Follow**: ASTRO-BEST-PRACTICES.md (when creating new components)
4. **Prioritize**: Critical fixes from CODE-AUDIT.md roadmap
5. **Create**: Missing primitive components (Box, Stack, Text)
