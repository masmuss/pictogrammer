# [khoirul.me](https://khoirul.me)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Personal portfolio and blog built with Astro. Features technical writing, project showcases, and reflective essays on software engineering.

## Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Astro 6                               |
| UI Engine | Svelte 5 (interactive islands)        |
| Styling   | Tailwind CSS 4                        |
| Language  | TypeScript 5                          |
| Content   | Astro Content Collections (MD + JSON) |
| Search    | Pagefind                              |
| Testing   | Vitest + Playwright                   |

## Getting Started

```bash
bun install
bun run dev
```

## Commands

| Command                 | Description                 |
| ----------------------- | --------------------------- |
| `bun run dev`           | Start dev server            |
| `bun run build`         | Production build            |
| `bun run preview`       | Preview production build    |
| `bun run check`         | Astro type checking         |
| `bun run lint`          | Biome linting               |
| `bun run format`        | Prettier + Biome formatting |
| `bun run test:unit:run` | Run unit tests (single run) |
| `bun run test:e2e`      | Run Playwright E2E tests    |

## Project Structure

```
src/
├── components/       # UI components (4-tier hierarchy)
│   ├── ui/primitives/  # Box, Container, Stack, Text
│   ├── ui/             # Button, Badge, Card, etc.
│   ├── shell/          # Header, Footer, BaseHead
│   ├── common/         # PostMetadata, Seo, SocialLinks
│   └── features/       # Page-specific components
├── layouts/          # BaseLayout, BlogPost
├── pages/            # File-based routing
├── content/          # Blog posts, series, experiences
├── lib/              # Utilities, constants, content access
├── config/           # Site-wide configuration
└── assets/           # Styles, images, scripts
```

## AI Context Docs

Reference documentation used as AI development context lives in `docs/`. See `docs/index.md` for an overview.

- `docs/design-system.md` — Design tokens and component library
- `docs/component-inventory.md` — Full component hierarchy
- `docs/astro-best-practices.md` — Development patterns and templates

## Testing

- **Unit tests**: Vitest for components and utilities
- **E2E tests**: Playwright with visual regression and a11y audits
- **Git hooks**: Lefthook runs checks pre-commit and pre-push

## License

- Source code: [MIT License](LICENSE)
- Content (posts, images): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
