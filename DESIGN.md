---
version: 4
name: Khoirul Minimal
description: A quiet personal portfolio system with light and dark themes, editorial headlines, and restrained monochrome UI with one Flexoki green accent.
dial: ENERGY 1 / RHYTHM 1 / MOTION 2
colors:
  primary: "#100F0F"
  secondary: "#6F6E69"
  tertiary: "#403E3C"
  neutral: "#F2F0E5"
  surface: "#FFFCF0"
  on-surface: "#100F0F"
  outline: "#E6E4D9"
  outline-subtle: "#DAD8CE"
  link: "flexoki-green-700 text with green-600 fills (light) / green-400 (dark), see tokens.css"
  background: "#FFFCF0"
  error: "#AF3029"
typography:
  # Serif (Merriweather) is opt-in only, via `font-serif`: prose headings,
  # the `serif` prop on Heading.astro, and BlogTabs titles. The default
  # heading stack is Geist Sans (`--font-heading` in tokens.css).
  headline-display:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.6px
  headline-lg:
    fontFamily: Geist Sans
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.6px
  headline-md:
    fontFamily: Geist Sans
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.5px
  headline-sm:
    fontFamily: Geist Sans
    fontSize: 20px
    fontWeight: 600
    lineHeight: 24px
  headline-xs:
    fontFamily: Geist Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 22px
  body-lg:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
  body-md:
    fontFamily: Geist Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
  body-sm:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
  label-lg:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label-md:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label-sm:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.01em
  caption:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  # Editorial rhythm mapped onto the 4px token scale in tokens.css:
  # sm 12px = space-3, md 24px = space-6 (also gutter), lg 32px = space-8,
  # xl/section 96px = space-24. xs 2px is fine adjustment outside the scale.
  xs: 2px
  sm: 12px
  md: 24px
  lg: 32px
  xl: 96px
  gutter: 24px
  section: 96px
components:
  button-primary:
    backgroundColor: "#100F0F (light) / #FFFCF0 (dark), see tokens.css --btn-primary"
    textColor: "#FFFCF0 (light) / #100F0F (dark), see tokens.css --btn-primary-foreground"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    size: "inline-flex"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    size: "inline-flex"
    height: "32px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
    size: "inline-flex"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
  chip:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
---

# Khoirul Minimal

## Overview

This interface feels calm, personal, and intellectually grounded. It uses a restrained sans-serif system throughout, reserving the Merriweather serif for opt-in emphasis moments (prose headings, select titles), keeping the portfolio professional without feeling corporate. The light background, sparse chrome, and wide breathing room suggest a thoughtful maker who values clarity, craft, and low-friction browsing.

## Colors

> Dark mode is supported via `src/assets/styles/system/tokens.css` (`html.dark`).
> Dark scale: background Flexoki black, foreground base-200,
> card/popover base-950, primary paper, muted base-950,
> muted-foreground base-500, accent 16% green-400 mix,
> accent-foreground green-400, border/input base-900,
> ring mirrors accent-foreground.
> Light/dark AA pairings are verified with the antislop-human contrast checker
> (see audit). R-34: both themes must keep working; verify every component in
> each mode before shipping.

- **Primary (#100F0F):** The main ink color for headings, navigation, icons, and body copy.
- **Background (#FFFCF0):** Flexoki paper, used as the light theme canvas.
- **Neutral (#F2F0E5):** Flexoki base-50, used for secondary surfaces and subtle fills.
- **Surface (#FFFCF0):** Flexoki paper, used for the primary reading surface.
- **Secondary (#6F6E69):** Flexoki base-600, used for supporting text and metadata.
- **Outline (#E6E4D9):** Flexoki base-100, used for separators and control boundaries.
- **Outline-subtle (#DAD8CE):** Flexoki base-150, used for quieter edge treatments.
- **Link (Flexoki green):** The main accent. Green-600 supplies light-theme fills, green-700 supplies accessible light-theme text, and green-400 supplies dark-theme text and accents.
- **Error (flexoki red):** flexoki-red-600 in light (white on fill 7.77:1), flexoki-red-400 in dark. Reserved for validation and destructive states.
- **Flexoki proportion rules:** chrome stays monochrome and carries exactly one accent (blue). Other flexoki hues appear only as content semantics, never as chrome: admonition callouts keep their per-type hues, the Draft badge is flexoki orange (light 600 at 4.98:1, dark raw 400 at 5.08:1), charts use categorical 600 tones in light and 400 tones in dark. No new hue enters the system without a semantic role and a contrast check.
- **Accent CTA (compat):** `accent-cta`, `accent-cta-subtle`, `accent-cta-text` are legacy aliases for the Flexoki green accent (see tokens.css). Do not use them in new components; use `accent` / `accent-foreground` instead.
- **R-02 scope:** the em dash ban covers UI and site copy. It does not cover `content/` prose, post titles, or series titling conventions, which are the author's deliberate voice (per the copywriting skill's voice calibration).

## Typography

The system is sans-first: **Geist Sans** carries the whole interface, including the main hero headline. **Merriweather** serif is strictly opt-in for emphasis, via the `font-serif` utility: prose headings (`prose-headings:font-serif`), the `serif` prop on `Heading.astro`, and `BlogTabs` titles. The serif moments give select passages a literary character while the sans keeps everything readable and modern. Weights are restrained: 600 for headlines and 400–500 for body and labels, with tight negative letter spacing on the larger headings to preserve a compact editorial feel.

- **Headline display / lg:** Geist Sans at 24px, 600, for the main name and other prominent title moments. Reach for `font-serif` only for a deliberate editorial accent.
- **Headline md / sm / xs:** Geist Sans at 22px, 20px, and 18px for section headings and subheadings, all semibold and compact.
- **Body lg / md:** Geist Sans at 16px with a 26px line height for comfortable reading in dense paragraph sections.
- **Body sm:** Geist Sans at 14px for supporting text, buttons, and compact metadata.
- **Label lg / md / sm:** Geist Sans semibold labels for buttons, chips, and utility text; keep them clean rather than shouting.
- **Caption:** Geist Sans 12px for timestamps, hints, and low-emphasis metadata.

There is no strong uppercase or tracking-heavy convention in the source. Labels stay sentence case, and the overall voice is understated.

## Layout & Spacing

The page uses a centered content column with generous side gutters and very large vertical spacing between major sections. The result is spacious rather than dense, letting each content block breathe as an independent editorial module. Rhythm is built from a small set of spacing values: 2px for fine adjustment, 12px for compact gaps, 24px for standard separation, 32px for section rhythm, and 96px for major vertical breathing room.

Use wide page margins, a fixed-feeling reading column, and predictable vertical stacking for sections like hero, about, projects, and posts. Cards and buttons should keep internal padding modest so the overall layout remains light.

## Elevation & Depth

The system is intentionally flat. There are no meaningful shadows or layered elevations; hierarchy comes from typography contrast, whitespace, and thin borders instead of depth effects. When separation is needed, use a subtle outline or a slightly different neutral fill rather than shadows.

## Shapes

The shape language is soft and minimal. Buttons use a 6px radius, cards sit at 12px (`rounded-xl` in Card.astro), and chips should be fully rounded for a pill-like utility feel. Nothing is overly rounded or ornate; the geometry stays pragmatic and quiet.

## Components

**Buttons**

- Primary buttons are compact, solid controls using the primary fill (`--btn-primary`: near-black in light, white in dark), 8px 10px padding, and a 32px target height. They are the most visually weighted control on the page, so reserve them for the single most important action in a view.
- Secondary buttons may use the neutral background with a subtle outline for a slightly more visible affordance.
- Link buttons should be borderless, underlined, and visually lightweight for navigation such as external links or “See all projects.”
- Keep button text at 14px and medium weight. Avoid oversized CTAs; the page favors restraint.

**Cards**

- Cards use the neutral background, 1px outline, 12px radius, and 16px padding.
- Keep cards flat and low-contrast. Their job is containment, not emphasis.

**Inputs**

- Inputs should feel understated: white or near-white fill, 6px radius, and a thin outline.
- Avoid heavy focus rings or embossed styles. Clear contrast and spacing are enough.

**Chips / Pills**

- Chips are small utility tags with full rounding, compact padding, and a neutral background.
- Use them for repo/live badges and other micro-actions. Keep icons tiny and aligned with text.

**Navigation and icon actions**

- Top navigation is minimalist and text-led, with small icon actions aligned horizontally.
- Icons should remain monochrome and thin-stroked, matching the quiet visual language of the page.

**Lists**

- Project lists should use strong vertical separation between items rather than boxed rows.
- Pair the title on the left with small action chips on the right, maintaining an airy, editorial alignment.

## Do's and Don'ts

- Do keep the interface light, airy, and restrained.
- Do use serif headlines sparingly for identity and emphasis.
- Do rely on whitespace and typography for hierarchy before adding decorative effects.
- Do keep controls compact, thin-bordered, and low-chroma.
- Don't introduce heavy shadows, gradients, or glassmorphism.
- Exception: floating controls layered over scrolling content (back-to-top button, tooltip, popover) use `bg-card` plus one restrained shadow for separation. `bg-muted` is forbidden there because it equals the page background in light mode and the control disappears into it.
- Don't use bright accent colors outside of a small link treatment or functional states.
- Don't make buttons bulky or highly saturated.
- Don't crowd sections; preserve the generous vertical rhythm seen in the source.
