# Code Audit

## Issues by Severity

### Critical

1. **Button baseClass complexity** — 41 classes in a single string. Extract into grouped maps (layout, shape, interaction, state, disabled, SVG).

2. **Section DOM manipulation** — Uses `IntersectionObserver` with `querySelectorAll(".fade-up-section")` that runs before DOM ready, has no cleanup on navigation, and uses a generic class selector. Use Astro lifecycle hooks and scoped data attributes.

3. **Duplicate animation definitions** — `fade-up` keyframe defined in both `global.css` (0.7s, 20px translateY) and `system/tokens.css` (600ms, 16px translateY). Keep only in `tokens.css`.

### High

4. **Missing ARIA attributes on Button** — No `aria-busy` for loading state, no `aria-label` for icon-only buttons.

5. **Badge variant inconsistency** — `ghost` variant semantics are unclear, hover states only work for `<a>` elements. Standardize to match Button variant structure.

6. **Hardcoded motion values in Section** — Duration and easing hardcoded instead of using CSS token variables.

7. **Heading size/weight maps** — Duplicate Tailwind scale. Either remove and use Tailwind utilities directly, or create a config preset.

8. **Type safety** — Some props use `[key: string]: unknown` instead of extending HTMLAttributes.

### Medium

9. **Missing gradient tokens**
10. **Missing shadow system**
11. **Missing typography spacing tokens**
12. **Gaps in spacing scale** — `--space-7`, `--space-9`, `--space-11`, `--space-13` through `--space-15` not defined.

## Recommended Fix Order

1. Remove duplicate animation definitions
2. Fix Section component lifecycle
3. Refactor Button baseClass
4. Add ARIA attributes to Button
5. Standardize Badge variants
6. Extend token system

## Strengths

- Strong variant system with proper TypeScript union types
- Good subcomponent composition pattern (Card)
- Clean semantic HTML usage
- Proper dark mode support via CSS custom properties
- Consistent use of `cn()` for class merging
- Good focus-visible styling with design tokens
