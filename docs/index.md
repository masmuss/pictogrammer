# Project Documentation

This directory contains reference documentation used as AI context during development. It covers the project's design system, architecture, code quality standards, and best practices.

## Files

| File                      | Content                                              |
| ------------------------- | ---------------------------------------------------- |
| `design-system.md`        | Design tokens, component library, and usage patterns |
| `code-audit.md`           | Code quality audit with issues and recommendations   |
| `accessibility-audit.md`  | WCAG 2.1 AA compliance audit                         |
| `component-inventory.md`  | Full component hierarchy and architecture map        |
| `astro-best-practices.md` | Component structure, styling, and testing guidelines |

## Quick Start

1. Read `design-system.md` for token and component reference
2. Read `astro-best-practices.md` for development patterns
3. Refer to `code-audit.md` for known issues and anti-patterns
4. Use `component-inventory.md` for navigation and architecture decisions

## Design System

- **Tokens**: CSS custom properties for spacing, colors, motion, typography
- **Components**: 4-tier hierarchy (primitives → ui → common → features)
- **Stack**: Astro 6.3 + Svelte 5 + Tailwind CSS 4 + TypeScript

## Known Issues

See `code-audit.md` for the full prioritized list. Critical items:

- Button baseClass is overly complex (41 inline classes)
- Section component uses unsafe DOM manipulation
- Duplicate animation definitions exist in global.css and tokens.css
