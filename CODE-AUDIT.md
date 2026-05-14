# Code Audit Report

## Executive Summary

Proyek memiliki **fondasi design system yang solid** tetapi membutuhkan **refactoring untuk consistency, maintainability, dan extensibility**. Audit mengidentifikasi:
- ✅ 5 hal yang sudah baik
- ⚠️ 8 isu kritis yang perlu diperbaiki
- 🔧 12 improvement opportunities

---

## 1. Button Component (`src/components/ui/Button.astro`)

### Issues Found

#### 1.1 Overly Complex baseClass (Lines 40-41)
```astro
const baseClass = 
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg ...";
  // 41 classes in single string - hard to maintain
```

**Problems:**
- ❌ Unmaintainable (41 classes in one line)
- ❌ Difficult to understand intent of each class
- ❌ Hard to override specific styles
- ❌ No separation of concerns

**Recommendation:**
Extract into grouped maps:
```astro
const baseClass = {
  layout: "inline-flex shrink-0 items-center justify-center",
  shape: "rounded-lg border border-transparent",
  interaction: "transition-all outline-none select-none",
  state: "focus-visible:border-ring focus-visible:ring-3 ...",
  disabled: "disabled:pointer-events-none disabled:opacity-50",
  svg: "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  icon: "[&_svg:not([class*='size-'])]:size-4"
};
```

**Impact:** 🔴 CRITICAL (readability, maintainability)

---

#### 1.2 Missing Accessibility Attributes (Lines 99-136)
```astro
<button
  type="button"
  data-slot="button"
  data-variant={resolvedVariant}
  {...attrs}
  // Missing: aria-busy, aria-disabled, aria-label for icon buttons
>
```

**Problems:**
- ❌ No `aria-disabled` when button is disabled
- ❌ No `aria-busy` for loading states
- ❌ Icon-only buttons need `aria-label` if no title
- ❌ No support for `aria-controls`, `aria-expanded`

**Recommendation:**
Add accessibility attributes:
```astro
<button
  type="button"
  data-slot="button"
  aria-busy={disabled && loading}
  aria-disabled={disabled}
  aria-label={!hasDefaultSlot && !title ? "Button" : undefined}
  {...attrs}
>
```

**Impact:** 🟡 HIGH (accessibility compliance)

---

#### 1.3 Inconsistent Focus Styles (Lines 41)
```astro
// Button has:
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50

// Should leverage token:
var(--transition-base) for focus animation
```

**Recommendation:** Use motion token for focus feedback

**Impact:** 🟡 MEDIUM (consistency)

---

### Strengths

✅ **Strong variant system** with 6 clear variants
✅ **Flexible sizing** with 7 size options
✅ **Good TypeScript typing** with union types
✅ **Prefetch support** for local links
✅ **Icon slot composition** with proper positioning

---

## 2. Badge Component (`src/components/ui/Badge.astro`)

### Issues Found

#### 2.1 Inconsistent Variant Naming (Lines 40-51)
```astro
const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  // ❌ What's the intent? Semantic meaning unclear
};
```

**Problems:**
- ❌ `ghost` variant is unclear (when to use vs `outline`?)
- ❌ Not all variants follow same pattern
- ⚠️ Differs from Button variants structure
- ⚠️ Hover states only for `<a>` elements

**Recommendation:**
```astro
const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border-border text-foreground hover:bg-border/20",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
  success: "bg-green-500 text-white hover:bg-green-600",
  ghost: "text-foreground hover:bg-muted",
};
```

**Document:**
```
default    → Primary badge, default state
outline    → Border-only badge, light appearance
secondary  → Secondary action/status
accent     → Highlighted/featured status
destructive→ Error/alert status
success    → Success/completed status
ghost      → Subtle, muted appearance
```

**Impact:** 🟡 HIGH (consistency, clarity)

---

#### 2.2 Missing Size Variants
```astro
// ❌ Only supports default size
// ✅ Button has: xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg

// Should add size prop:
interface Props {
  size?: "xs" | "sm" | "default" | "lg";
}
```

**Impact:** 🔴 MEDIUM (consistency)

---

### Strengths

✅ Clean, simple implementation
✅ Good use of `cn()` for class merging
✅ Proper semantic HTML (as prop for flexibility)
✅ Focus states included

---

## 3. Section Component (`src/components/ui/Section.astro`)

### Issues Found

#### 3.1 Unsafe DOM Manipulation in <script> Tag (Lines 70-98)
```astro
<script>
  function setupFadeUpObserver() {
    const observer = new IntersectionObserver((entries) => {
      // Direct DOM manipulation
      entry.target.classList.remove("opacity-0", "translate-y-4");
      entry.target.classList.add("opacity-100", "translate-y-0");
    });

    document.querySelectorAll(".fade-up-section").forEach(/* ... */);
  }

  setupFadeUpObserver();
  document.addEventListener("astro:page-load", setupFadeUpObserver);
</script>
```

**Problems:**
- ❌ Script runs immediately, may execute before DOM ready
- ❌ No cleanup on page navigation
- ❌ `querySelector` for generic class may select unwanted elements
- ❌ Not using Astro lifecycle hooks properly
- ⚠️ Re-runs `setupFadeUpObserver` on every page load (inefficient)

**Recommendation:**
Use Astro's lifecycle events:
```astro
<script>
  import type { AstroComponentFactory } from 'astro';

  function observeFadeUp() {
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
      { threshold: 0.1, rootMargin: "0px" }
    );

    // Scoped query selector to parent
    document.querySelectorAll('[data-fade-up="true"]').forEach((el) => {
      observer.observe(el);
    });
  }

  // Use astro:page-load for ViewTransitions support
  if (document.readyState === "loading") {
    document.addEventListener("astro:page-load", observeFadeUp);
  } else {
    observeFadeUp();
  }
</script>
```

Also update template:
```astro
<SectionTag
  data-fade-up="true"  <!-- Clear intent -->
  class={cn(
    className,
    "flex flex-col gap-y-4 opacity-0 translate-y-4 transition-all duration-500 ease-out"
  )}
  style={transitionDelay > 0
    ? { transitionDelay: `${transitionDelay}ms` }
    : undefined}
>
```

**Impact:** 🔴 CRITICAL (reliability, maintainability)

---

#### 3.2 Hardcoded Motion Values
```astro
// Line 43:
"fade-up-section opacity-0 translate-y-4 transition-all duration-500 ease-out"
// ❌ hardcoded duration-500, ease-out

// Should use tokens:
style={{
  transition: `all var(--transition-slow)`,
  transitionDelay: transitionDelay > 0 ? `${transitionDelay}ms` : undefined,
}}
```

**Impact:** 🟡 MEDIUM (consistency)

---

### Strengths

✅ Good composition with optional title
✅ Flexible `titleAs` for semantic HTML
✅ Nice transition delay support
✅ Intersection Observer pattern correct

---

## 4. Heading Component (`src/components/ui/Heading.astro`)

### Issues Found

#### 4.1 Hardcoded Size/Weight Maps (Lines 4-21)
```astro
const sizes = {
  "6xl": "text-6xl",
  "5xl": "text-5xl",
  // ... duplicate of Tailwind scale
};

// ❌ Duplicates Tailwind theme
// Should leverage theme directly or extend Tailwind config
```

**Recommendation:**
```astro
// Option 1: Remove completely, use Tailwind utilities directly
<Heading size="3xl" />  → <h2 class="text-3xl">

// Option 2: Create Tailwind config preset:
// In tailwind.config.mjs
export const headingSizes = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  // ... sync with design system
};
```

**Impact:** 🟡 MEDIUM (maintainability, consistency)

---

#### 4.2 Missing Text Color Token
```astro
// Heading inherits color from context
// Should have explicit foreground color:
<As class:list={[
  sizes[size],
  weights[weight],
  "text-foreground"  // Add
]} {...attrs}>
```

**Impact:** 🟡 LOW (clarity)

---

### Strengths

✅ Clean semantic HTML structure
✅ Good TypeScript typing
✅ Flexible weight system

---

## 5. Card Component (`src/components/ui/card/Card.astro`)

### Strengths

✅ **Excellent subcomponent composition pattern**
✅ Proper semantic wrapper
✅ Good separation of concerns
✅ Flexible layout support

### Minor Issues

#### 5.1 Missing Documentation
Add JSDoc comments explaining component hierarchy and props.

**Impact:** 🟡 LOW (documentation)

---

## 6. Global Styling Issues

### 6.1 Duplicate Animation Definitions

**File:** `src/assets/styles/global.css` (Lines 24-37)
```css
@theme {
  --animate-fade-up: fade-up 0.7s ease-out forwards;

  @keyframes fade-up {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}
```

**Conflicts with:** `src/assets/styles/system/tokens.css` (Lines 59-72)
```css
@theme {
  --animate-fade-up: fade-up var(--duration-slower) var(--ease-out) forwards;

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

**Problems:**
- ❌ Duplicate animation definitions
- ❌ Different values (20px vs 16px translateY)
- ❌ Different durations (0.7s vs 600ms)
- ❌ Second definition wins (CSS cascade)

**Recommendation:**
Keep definition in `tokens.css` only. Remove from `global.css`.

**Impact:** 🔴 CRITICAL (consistency, debugging)

---

### 6.2 Missing Spacing Tokens in Scale

Current scale has gaps:
```css
--space-1 through --space-6       ✅
--space-8, --space-10, --space-12 ✅
--space-16, --space-20, --space-24 ✅

// Missing:
--space-7   (1.75rem / 28px)      ❌
--space-9   (2.25rem / 36px)      ❌
--space-11  (2.75rem / 44px)      ❌
--space-13 through --space-15      ❌
--space-17 through --space-19      ❌
--space-21, --space-22, --space-23 ❌
```

**Recommendation:**
Extend to full scale for consistency with Tailwind:
```css
--space-7: 1.75rem;
--space-9: 2.25rem;
--space-11: 2.75rem;
--space-13: 3.25rem;
--space-14: 3.5rem;
--space-15: 3.75rem;
--space-18: 4.5rem;
--space-21: 5.25rem;
--space-22: 5.5rem;
--space-23: 5.75rem;
```

**Impact:** 🟡 MEDIUM (completeness)

---

## 7. Token System Issues

### 7.1 Missing Token Categories

**Gradients:** ❌ No gradient tokens
**Shadows:** ❌ No shadow tokens  
**Typography:** ❌ No line-height/letter-spacing tokens

**Recommendation:**
Add to `tokens.css` or new `tokens-extended.css`:

```css
@theme {
  /* Gradient presets */
  --gradient-primary-to-secondary: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  --gradient-accent-subtle: linear-gradient(to bottom, var(--color-accent-cta-subtle), transparent);
  
  /* Shadow system */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Typography spacing */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}
```

**Impact:** 🟡 MEDIUM (extensibility)

---

### 7.2 Container Token Incomplete

```css
--container-2xl: 1400px;  // Only 2xl defined

// Should have full container scale:
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;
```

**Impact:** 🟡 LOW (completeness)

---

## 8. TypeScript & Prop Typing

### 8.1 Button Props Could Be Stricter

```astro
interface Props {
  // ✅ Good:
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  
  // ⚠️ Could be improved:
  [key: string]: unknown;  // Allows any unknown prop
}
```

**Recommendation:**
```astro
interface Props extends HTMLAttributes<"a"> {
  // Inherit all valid HTML attributes
  variant?: NonNullable<Props["variant"]>;
  size?: NonNullable<Props["size"]>;
  href?: string;
  // Don't need [key: string]: unknown if extending HTMLAttributes
}
```

**Impact:** 🟡 LOW (type safety)

---

## Summary Table

| Issue | Component | Severity | Category |
|-------|-----------|----------|----------|
| Complex baseClass | Button | 🔴 CRITICAL | Maintainability |
| Missing a11y attrs | Button | 🟡 HIGH | Accessibility |
| Unsafe DOM manip | Section | 🔴 CRITICAL | Reliability |
| Duplicate animations | Global CSS | 🔴 CRITICAL | Consistency |
| Inconsistent variants | Badge | 🟡 HIGH | Consistency |
| Hardcoded motion | Section | 🟡 MEDIUM | Consistency |
| Duplicate maps | Heading | 🟡 MEDIUM | Maintainability |
| Missing gradients | Tokens | 🟡 MEDIUM | Completeness |
| Missing shadows | Tokens | 🟡 MEDIUM | Completeness |
| Missing typography | Tokens | 🟡 MEDIUM | Completeness |
| Missing spacing | Tokens | 🟡 MEDIUM | Completeness |
| Badge no sizes | Badge | 🟡 MEDIUM | Consistency |

---

## Recommended Fix Priority

### 🔴 CRITICAL (Do First)
1. Remove duplicate animation definitions
2. Fix Section component DOM manipulation
3. Refactor Button baseClass complexity

### 🟡 HIGH (Do Next)
4. Add missing accessibility attributes to Button
5. Standardize Badge variants

### 🟡 MEDIUM (Do After)
6. Extend token system (gradients, shadows, typography)
7. Consolidate size/weight maps

### 🟢 LOW (Nice to Have)
8. Add JSDoc documentation
9. Improve TypeScript strictness

---

## Next Steps

1. Create detailed implementation plan per component
2. Write unit tests before refactoring
3. Update documentation with new patterns
4. Set up automated linting for token consistency
5. Create component examples/storybook
