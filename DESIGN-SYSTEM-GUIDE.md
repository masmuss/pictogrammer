# 🎨 Design System & Architecture Guide

**Untuk Pengembang Personal Web Pictogrammer**

---

## 📚 Documentation Files

Saya telah membuat 5 file dokumentasi komprehensif untuk design system Anda:

### 1. **DESIGN-SYSTEM-SUMMARY.md** ← **START HERE** 📍

```
├─ Quick overview semua yang telah dibuat
├─ How to use files lainnya
├─ Token reference & component library
├─ Known issues & roadmap
└─ Verification checklist sebelum mulai coding
```

**Waktu baca: 10 menit**

### 2. **DESIGN-SYSTEM.md** ← **Reference untuk Coding** 📖

```
├─ Complete token documentation
│  ├─ Spacing scale (4px base)
│  ├─ Color system (Flexoki palette)
│  ├─ Motion & animation
│  └─ Typography
│
├─ Component usage guide
│  ├─ Button (6 variants × 7 sizes)
│  ├─ Badge (7 variants)
│  ├─ Card (subcomponent pattern)
│  ├─ Heading & Section
│  └─ Examples untuk setiap
│
├─ Best practices DO/DON'T
├─ Migration guide
└─ Color contrast & accessibility
```

**Waktu baca: 30 menit**

### 3. **ASTRO-BEST-PRACTICES.md** ← **Development Guide** 🔧

```
├─ Component structure & templates
├─ Props design patterns
├─ Styling dengan tokens & Tailwind
├─ Accessibility (a11y) guidelines
├─ Dark mode implementation
├─ TypeScript patterns
├─ Performance optimization
├─ Testing patterns
├─ Component checklist
└─ Complete examples
```

**Waktu baca: 40 menit**

### 4. **CODE-AUDIT.md** ← **Issues & Roadmap** ⚠️

```
├─ Executive summary (3 CRITICAL, 5 HIGH issues)
├─ Detailed analysis per component
│  ├─ Button (baseClass too complex)
│  ├─ Badge (variant inconsistency)
│  ├─ Section (unsafe DOM manipulation)
│  ├─ Heading & Cards
│  └─ Global CSS (duplicate animations)
│
├─ Recommendations per issue
├─ Priority roadmap
└─ Success criteria
```

**Waktu baca: 25 menit**

### 5. **COMPONENT-INVENTORY.md** ← **Architecture Map** 🗺️

```
├─ Full directory structure
├─ Component tier system (Atomic to Templates)
├─ Design system coverage checklist
├─ Missing components list
├─ Accessibility status
├─ Performance metrics
├─ Code quality stats
└─ Refactoring opportunities
```

**Waktu baca: 20 menit**

---

## 🚀 Quick Start

### For New Developers (30 min)

1. Baca **DESIGN-SYSTEM-SUMMARY.md** (10 min)
2. Baca **DESIGN-SYSTEM.md** → sections Design Tokens & Components (15 min)
3. Lihat examples di `src/components/ui/`
4. Siap untuk code! ✅

### For Code Review (15 min)

1. Open **ASTRO-BEST-PRACTICES.md** → Component Checklist
2. Reference **CODE-AUDIT.md** untuk anti-patterns
3. Verify dark mode & accessibility

### For Refactoring (depends on scope)

1. Read **CODE-AUDIT.md** → prioritized roadmap
2. Follow patterns di **ASTRO-BEST-PRACTICES.md**
3. Use checklist sebelum submit

---

## 📊 System Overview

### ✅ Sudah Ada (Solid Foundation)

- **Tokens** → Spacing, colors, motion, typography
- **Components** → Button, Badge, Card, Heading, Section
- **Patterns** → Variants, sizes, dark mode, accessibility
- **Stack** → Astro 6.3.1, TailwindCSS 4.2.1, Svelte 5

### ⚠️ Perlu Diperbaiki (Critical)

- Button component too complex (41 classes)
- Section component unsafe DOM manipulation
- Duplicate animation definitions
- Missing accessibility attributes

### 🔲 Perlu Ditambahkan (Nice to Have)

- Gradient tokens
- Shadow system
- Box, Stack, Text primitives
- Form components (Input, Select, etc)

---

## 🎯 Token System at a Glance

### Spacing (4px base)

```
--space-1: 4px    --space-6: 24px    --space-16: 64px
--space-2: 8px    --space-8: 32px    --space-20: 80px
--space-3: 12px   --space-10: 40px   --space-24: 96px
--space-4: 16px   --space-12: 48px
--space-5: 20px
```

### Colors

- **Flexoki Palette**: 8 hues (red, orange, yellow, green, cyan, blue, purple, magenta)
- **Semantic**: primary, secondary, accent, destructive, muted, border
- **CTA**: cyan untuk interactive elements
- **Light/Dark Mode**: Automatic HSL mapping

### Motion

- **Durations**: 50ms → 600ms
- **Easings**: default, in, out, spring, smooth
- **Animations**: fade-up, fade-in, slide-in

---

## 📋 Component Library

### Core Components

| Nama        | Variants | Sizes | Status | Docs        |
| ----------- | -------- | ----- | ------ | ----------- |
| Button      | 6        | 7     | ✅     | DS.md       |
| Badge       | 7        | 1     | ✅     | DS.md       |
| Card        | -        | -     | ✅     | DS.md       |
| Heading     | -        | 9     | ✅     | DS.md       |
| Section     | -        | -     | ✅     | DS.md       |
| Search      | -        | -     | ✅     | Interactive |
| ThemeToggle | -        | -     | ✅     | Interactive |

### Missing (Priority HIGH)

- [ ] Text component
- [ ] Box component
- [ ] Stack component
- [ ] Spacer component

---

## 🔍 Example Usage

### Button Component

```astro
---
import Button from "@/components/ui/Button.astro";
---

<!-- Simple button -->
<Button>Click me</Button>

<!-- With variants and size -->
<Button variant="outline" size="lg">Large secondary</Button>

<!-- With icons -->
<Button variant="default">
	<span slot="icon-before">⭐</span>
	Star this
</Button>

<!-- Link button -->
<Button href="/docs" variant="link">Read docs</Button>
```

### Color Usage

```astro
<!-- Using semantic colors -->
<div class="bg-primary text-primary-foreground">Primary</div>
<div class="text-accent-foreground hover:bg-accent">Hover</div>
<div class="border-border">Bordered</div>

<!-- Using CSS tokens (when needed) -->
<div style="color: var(--color-accent-cta)">CTA</div>
```

### Spacing

```astro
<!-- Tailwind utilities -->
<div class="mb-8 gap-4 p-6">
	<!-- Combines well -->
	<section class="container space-y-8">
		<h1>Title</h1>
		<div class="gap-6">Content</div>
	</section>
</div>
```

---

## 🐛 Known Issues

### 🔴 CRITICAL (3)

1. Button baseClass complexity (41 classes) → Should refactor into maps
2. Section DOM manipulation unsafe → Should use Astro lifecycle
3. Duplicate animation definitions → Keep only in tokens.css

**Estimate: 2-3 hours to fix**

### 🟡 HIGH (5)

4. Missing ARIA attributes on Button
5. Badge variants not consistent with Button
6. Hardcoded motion values in Section
7. Duplicate size/weight maps in Heading
8. Type safety could be stricter

**Estimate: 1-2 hours to fix**

### 🟡 MEDIUM (4)

9. Missing gradient tokens
10. Missing shadow system
11. Missing typography spacing tokens
12. Incomplete spacing scale (gaps in sequence)

**Estimate: 2-3 hours to add**

**Total refactor time: 8-12 hours**

---

## ✅ Checklist Sebelum Mulai Coding

- [ ] Sudah baca DESIGN-SYSTEM-SUMMARY.md
- [ ] Sudah baca DESIGN-SYSTEM.md token section
- [ ] Sudah baca ASTRO-BEST-PRACTICES.md component section
- [ ] Sudah lihat contoh component di `src/components/ui/`
- [ ] Sudah run `npm run lint` (no errors)
- [ ] Sudah test light & dark mode

---

## 📖 File Reference

```
Root Level Files (You created these today):
├── DESIGN-SYSTEM-SUMMARY.md       ← Overview & quick ref
├── DESIGN-SYSTEM.md               ← Complete token & component docs
├── ASTRO-BEST-PRACTICES.md        ← Development guidelines
├── CODE-AUDIT.md                  ← Issues & roadmap
├── COMPONENT-INVENTORY.md         ← Architecture map
└── DESIGN-SYSTEM-GUIDE.md         ← This file

Source Code:
└── src/assets/styles/DESIGN-SYSTEM.md  ← Duplicate copy for easy access
```

---

## 🎓 Learning Path

### Beginner (Baru pertama kali)

1. Read: DESIGN-SYSTEM-SUMMARY.md (10 min)
2. Read: DESIGN-SYSTEM.md - tokens section (15 min)
3. Read: ASTRO-BEST-PRACTICES.md - component template (10 min)
4. Copy-paste component template
5. Reference existing components
6. **Time: 45 minutes to first component**

### Intermediate (Sudah familiar)

1. Check DESIGN-SYSTEM.md for token reference
2. Use component checklist dari ASTRO-BEST-PRACTICES.md
3. Reference CODE-AUDIT.md untuk anti-patterns
4. **Time: 15 minutes to component**

### Advanced (Membuat architecture)

1. Read: COMPONENT-INVENTORY.md (architecture)
2. Read: All 4 docs (comprehensive understanding)
3. Plan: Refactor roadmap dari CODE-AUDIT.md
4. Execute: Following best practices
5. **Time: Project-dependent**

---

## 🤝 Contributing

### Before Writing Code

- [ ] Follow template dari ASTRO-BEST-PRACTICES.md
- [ ] Check token usage dalam DESIGN-SYSTEM.md
- [ ] Reference existing components
- [ ] No hardcoded values

### Before Submitting PR

- [ ] Run: `npm run lint` (no warnings)
- [ ] Run: `npm run check` (no TypeScript errors)
- [ ] Test locally: `npm run dev`
- [ ] Verify light/dark mode
- [ ] Check accessibility (focus, contrast)
- [ ] Complete component checklist

### For Refactoring

- [ ] Read: CODE-AUDIT.md (specific issue)
- [ ] Plan: Implementation approach
- [ ] Write: Tests first (TDD)
- [ ] Code: Following best practices
- [ ] Verify: No regressions

---

## 📞 FAQ

**Q: Saya perlu warna baru, gimana?**
A: Lihat DESIGN-SYSTEM.md → Flexoki Palette section, atau add ke tokens.css

**Q: Bagaimana membuat component yang konsisten?**
A: Follow template di ASTRO-BEST-PRACTICES.md + use checklist

**Q: Apa bedanya dengan component lama?**
A: Lihat CODE-AUDIT.md → anti-patterns section

**Q: Component mana yang perlu diperbaiki duluan?**
A: Lihat CODE-AUDIT.md → roadmap (Button → Section → Badge)

**Q: Gimana test component?**
A: Lihat ASTRO-BEST-PRACTICES.md → Testing section

---

## 🎯 Next Steps

### Week 1: Learn

- [ ] Read semua 5 docs (2-3 hours)
- [ ] Review current components (1 hour)
- [ ] Setup local environment

### Week 2: Fix Critical

- [ ] Fix duplicate animations (15 min)
- [ ] Refactor Button baseClass (1 hour)
- [ ] Fix Section component (30 min)

### Week 3: Improve

- [ ] Add ARIA attributes
- [ ] Standardize Badge
- [ ] Create primitive components

### Week 4+: Extend

- [ ] Add form components
- [ ] Create documentation site
- [ ] Visual regression testing

---

## 🏆 Success Criteria

✅ **System Criteria:**

- All tokens documented
- All components have examples
- Consistent naming across codebase
- Dark mode working everywhere
- Accessibility AA compliance

✅ **Developer Criteria:**

- New developers onboard in 1 hour
- Can create component in 15 minutes
- Can review code consistently
- Errors caught by linter/types
- Beautiful UX maintained

---

**Total Documentation: ~60 KB | Total Time to Read All: ~2 hours**

**Happy coding! 🚀**

_Design System Version: 2.0_
_Created: 2026-05-14_
_Last Updated: 2026-05-14_

---

## Document Relationships

```
Start Here
    ↓
DESIGN-SYSTEM-SUMMARY.md ← Overview
    ├─→ DESIGN-SYSTEM.md ← Token & Component Reference
    ├─→ ASTRO-BEST-PRACTICES.md ← Development Guide
    ├─→ CODE-AUDIT.md ← Issues & Roadmap
    └─→ COMPONENT-INVENTORY.md ← Architecture Map
```
