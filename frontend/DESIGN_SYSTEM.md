# Design System

Premium, data-dense, ops-console aesthetic (inspired by the feel of the references in
`dashboard-ui-refrences/` — not their layouts). Built on **shadcn/ui (new-york style)** +
Tailwind v4 CSS variables. Default theme is **black**; a light theme exists as a secondary mode.

## Principles

1. **Near-black, not pure black.** Backgrounds sit at `oklch(0.1265 0 0)`, cards a step lighter
   at `0.1649`, popovers lighter still. Pure `#000` is never used — it kills depth and makes
   borders invisible.
2. **Depth from layering, not shadow.** Elevation is mostly conveyed by subtle background steps
   and 1px hairline borders (`border: oklch(1 0 0 / 9%)` in dark mode) rather than heavy shadows.
   Shadows exist (`--shadow-sm` … `--shadow-2xl`) but are used sparingly, for popovers/dialogs/
   dropdowns floating above content.
3. **Restrained color.** The UI is grayscale by default. Color is reserved for meaning:
   `success` (paid/active/healthy), `warning` (pending/at-risk), `destructive` (error/overdue),
   `info` (links/informational). Never use color for decoration.
4. **Typography does the hierarchy work.** Small, uppercase, tracked-out labels
   (`text-xs uppercase tracking-wide text-muted-foreground`) over large, high-contrast values.
   This is the single biggest driver of the "premium ops dashboard" feeling in the references.
5. **Numbers are tabular and monospaced.** Any metric, amount, ID, or timestamp uses
   `font-mono tabular-nums` so columns of numbers align and don't jiggle on hover/update.
6. **Density with breathing room.** Tight vertical rhythm inside data tables/rows, generous
   padding around section containers. Compact rows, spacious sections.

## Theme tokens

All tokens live in `src/index.css` as CSS variables, mapped through Tailwind's `@theme inline`
block so they're usable as `bg-background`, `text-muted-foreground`, `border-border`, etc.
`.dark` is the default (`<html class="dark">` in `index.html`); removing that class switches to
the light theme. Both palettes share the same variable names, so components never branch on
theme.

| Token | Dark | Light | Use |
|---|---|---|---|
| `background` | `oklch(0.1265 0 0)` | `oklch(0.9891 0 0)` | App canvas |
| `card` | `oklch(0.1649 0 0)` | `oklch(1 0 0)` | Cards, panels |
| `popover` | `oklch(0.1822 0 0)` | `oklch(1 0 0)` | Menus, dialogs, tooltips |
| `sidebar` | `oklch(0.1084 0 0)` | `oklch(0.9702 0 0)` | Nav rail (darkest surface) |
| `primary` | `oklch(0.9401 0 0)` (near-white) | `oklch(0.1649 0 0)` (near-black) | Primary buttons/actions — inverted-fill, not colored |
| `border` / `input` | `white @ 8–12% alpha` | `oklch(0.898 0 0)` | Hairlines |
| `muted-foreground` | `oklch(0.5824 0 0)` | `oklch(0.4386 0 0)` | Labels, secondary text |
| `success` / `warning` / `destructive` / `info` | semantic accents | same | Status only |

Custom additions beyond stock shadcn: `success`, `warning`, `info` (+ `-foreground` pairs), so
status badges/pills don't have to hijack `destructive` or raw Tailwind colors.

### Radius & shape

`--radius: 0.625rem` (10px) base. Cards/dialogs use `radius-lg`, inputs/buttons `radius-md`,
badges/pills/small chips `radius-sm` or full (`rounded-full`) for status dots and avatars.
Nothing sharp (`radius-none`), nothing overly rounded (no bubbly `2xl` on large containers) —
this is what keeps it "console", not "consumer app".

### Typography

- **Sans (UI):** `Inter` — variable weight, tight `tracking: -0.01em` at body size. Loaded via
  Google Fonts in `index.html`.
- **Mono (data):** `JetBrains Mono` — for amounts, IDs, timestamps, percentages, code.
- Scale: page titles `text-2xl font-semibold`, section titles `text-sm font-medium`, eyebrow/
  label `text-xs font-medium uppercase tracking-wide text-muted-foreground`, body `text-sm`.

### Elevation

Use shadows only for things that float over content (popover, dialog, dropdown, sheet, sticky
toolbar). Static page sections should rely on `bg-card` + `border-border`, never a shadow — that
distinction is what separates "flat premium panel" from "generic card-with-drop-shadow" look.

## Component conventions (shadcn)

- `components.json`: `style: new-york`, `baseColor: neutral`, `cssVariables: true`. Keep it this
  way — new-york gives tighter paddings/smaller radii than the "default" style, which reads more
  premium/dense.
- Buttons: default variant is the inverted fill (`primary` = near-white on dark bg / near-black on
  light bg) — mirrors the "Edit / Generate Report" solid-white buttons in the reference. Reserve
  `variant="secondary"` (translucent gray) for lower-emphasis actions, `outline` for tertiary,
  `ghost` for icon-only nav/table row actions.
- Status badges: build a thin wrapper around `Badge` with `success | warning | info | destructive`
  variants using the new semantic tokens (dot + label, `text-xs`, `rounded-full`, low-opacity
  tinted background — e.g. `bg-success/15 text-success`).
- Sidebar: use the existing `sidebar.tsx` primitive; keep it on the darkest surface (`--sidebar`)
  so content cards read as "elevated" relative to nav, matching the reference screenshots.
- Tables: `text-sm`, row height compact, header cells as uppercase muted labels, numeric columns
  right-aligned + `font-mono tabular-nums`, zebra/hover via `bg-accent/50` not a strong fill.

## What NOT to do

- No colored gradients, no glassmorphism/blur panels, no neumorphism.
- No pure black/pure white surfaces.
- No decorative use of brand color — color always encodes status/meaning.
- Don't reproduce the reference dashboards' exact layouts/copy/iconography — only the token
  system, density, and restraint described above.

## Files

- `src/index.css` — all tokens (`:root` = light, `.dark` = dark/default) + `@theme inline` map.
- `index.html` — font links (Inter, JetBrains Mono), `<html class="dark">` sets the default theme.
- `components.json` — shadcn config (new-york style, neutral base, CSS variables).
