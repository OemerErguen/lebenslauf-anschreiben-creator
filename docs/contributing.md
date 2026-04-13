# Contributing

Thanks for your interest in contributing! This project exists because essential tools should be free — and contributions help keep it that way.

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **pnpm** >= 10

### Setup

```bash
git clone https://github.com/OemerErguen/lebenslauf-anschreiben-creator.git
cd lebenslauf-anschreiben-creator
pnpm install
pnpm dev
```

The dev server starts at [http://localhost:5173](http://localhost:5173).

## Development Workflow

### Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm typecheck        # TypeScript check (all packages)
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with auto-fix
pnpm format:check     # Prettier check
pnpm format           # Prettier write
pnpm test             # Vitest (all packages)
pnpm test:e2e         # Playwright e2e tests
```

### Before Submitting a PR

Make sure all checks pass:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

CI runs these automatically on every PR.

---

## What Can You Contribute?

- [Layouts](#creating-a-new-layout) — New page layouts (grid structures, slot arrangements)
- [Components](#components) — CV rendering components
- [Presets](#presets) — Design presets combining a layout with token overrides
- [Translations](#translations) — Locale files (de/en)
- [Bug fixes & features](#bug-fixes--features)

---

## Creating a New Layout

This is the most impactful contribution. A layout defines the page structure, available slots, default components, design tokens, and CSS for a CV design.

### How It Works

Every layout is a single `design.ts` file that exports a `DesignDefinition` object using `defineDesign()` from `@cv/layout-engine`. There are no separate CSS files — the CSS is embedded in the definition. The layout engine takes this definition, resolves tokens and user overrides, and produces paginated HTML+CSS.

```
DesignDefinition + UserOverrides → resolveTokens() → renderDesignPage() → HTML + CSS
```

### Step-by-Step Guide

#### 1. Create the layout folder

```
packages/layouts/src/
└── your-layout/
    └── design.ts
```

#### 2. Define the design

Your `design.ts` must export a `DesignDefinition` using `defineDesign()`. Here is the full structure:

```typescript
import { defineDesign } from '@cv/layout-engine';
import {
  COMMON_COLOR_TOKENS,
  SECTION_TITLE_STYLE_VALUES,
  STANDARD_FONT_OPTIONS,
  STANDARD_SPACING_SCALE,
  TIMELINE_STYLE_VALUES,
} from '@cv/layout-engine/sharedTokens';

export const yourLayoutDesign = defineDesign({
  // --- Identity ---
  id: 'your-layout',                              // Unique, kebab-case
  name: { de: 'Dein Layout', en: 'Your Layout' },
  description: { de: '...', en: '...' },
  thumbnail: '',                                    // Preview image URL (can be empty initially)

  // --- Scope ---
  documentTypes: ['lebenslauf'],                   // Which document types this supports
  supportedLocales: ['de', 'en'],

  // --- Design tokens ---
  colors: [
    { key: 'primary', label: { de: 'Akzent', en: 'Accent' }, default: '#2563eb', cssVar: '--cv-primary' },
    COMMON_COLOR_TOKENS.text,
    COMMON_COLOR_TOKENS.muted,
    COMMON_COLOR_TOKENS.border,
    // Add more as needed (e.g. secondary, sidebar-bg)
  ],
  fonts: [
    {
      key: 'body',
      label: { de: 'Fließtext', en: 'Body' },
      default: "'Inter', system-ui, sans-serif",
      cssVar: '--cv-font-body',
      options: STANDARD_FONT_OPTIONS,
    },
    // Add 'heading' font if your layout uses separate heading fonts
  ],
  spacing: STANDARD_SPACING_SCALE,

  // --- Global options (optional) ---
  options: {
    sectionTitleStyle: {
      type: 'enum',
      key: 'sectionTitleStyle',
      label: { de: 'Titelstil', en: 'Title style' },
      values: SECTION_TITLE_STYLE_VALUES,
      default: 'uppercase-spaced',
    },
  },

  // --- Slots: what goes where ---
  slots: {
    main: {
      accepts: ['main'],
      defaultComponents: [
        { componentId: 'summary', options: {} },
        { componentId: 'experience-list', options: {} },
        { componentId: 'education-list', options: {} },
        { componentId: 'projects-list', options: {} },
      ],
    },
    // Add more slots: sidebar, header, footer, etc.
  },

  // --- CSS ---
  // Static string or function receiving resolved slot options:
  // css: (opts) => `.cv-page { ... }`
  css: `
    .cv-page {
      display: flex;
      flex-direction: column;
      font-family: var(--cv-font-body);
      color: var(--cv-text);
    }
    .cv-slot-main {
      padding: 14mm 16mm;
    }
  `,
});
```

#### 3. Register the layout

Add your design to `packages/layouts/src/registry.ts`:

```typescript
import { yourLayoutDesign } from './your-layout/design.js';

export const designDefinitions = [
  sidebarLeftDesign,
  fullWidthDesign,
  topHeaderDesign,
  yourLayoutDesign,        // ← Add here
] as const;
```

Export it from `packages/layouts/src/index.ts` if needed.

#### 4. Create a preset (optional but recommended)

Add a preset in `packages/presets/src/` that uses your layout:

```typescript
import { createPreset } from './createPreset.js';

export const yourPreset = createPreset({
  id: 'your-preset',
  name: { de: 'Dein Preset', en: 'Your Preset' },
  description: { de: '...', en: '...' },
  designId: 'your-layout',
  overrides: {
    // Optional: customize default tokens
    colors: { primary: '#059669' },
  },
});
```

Register it in the presets registry the same way.

#### 5. Test it

```bash
pnpm dev                    # Open the app and select your layout
pnpm typecheck              # Must pass
pnpm lint                   # Must pass
pnpm test                   # Must pass
pnpm build                  # Must pass
```

### Layout Rules

These rules are non-negotiable for any layout contribution:

1. **One file per layout** — Everything lives in `design.ts`. No separate CSS files.
2. **Print-safe units only** — Use `mm` and `pt` in CSS. Never `px` for anything that ends up on the printed page.
3. **CSS custom properties only** — All colors via `var(--cv-*)`, all fonts via `var(--cv-font-*)`. No hardcoded colors or font stacks in CSS.
4. **`.cv-` prefix** — All class names must start with `.cv-` (e.g. `.cv-page`, `.cv-slot-main`, `.cv-slot-sidebar`).
5. **`break-inside: avoid`** — Apply on logical groups (experience entries, education entries, etc.) to prevent mid-element page breaks.
6. **Bilingual** — All `name`, `label`, and `description` fields must have both `de` and `en` values.
7. **Reuse shared tokens** — Import `COMMON_COLOR_TOKENS`, `STANDARD_FONT_OPTIONS`, `STANDARD_SPACING_SCALE`, `SECTION_TITLE_STYLE_VALUES`, `TIMELINE_STYLE_VALUES` from `@cv/layout-engine/sharedTokens` instead of redefining them.
8. **Unique keys** — No duplicate `key` or `cssVar` values within a single design's `colors` or `fonts` arrays. The validator will reject them.
9. **Slot naming** — Use `main`, `sidebar`, `header`, `footer` as slot names. Components declare which slot type they belong to (`'main'` or `'sidebar'`), and your slot's `accepts` array must match.
10. **No Tailwind, no CSS Modules** — Layout CSS is plain CSS injected into the render iframe. Framework utilities don't exist there.

### Existing Layouts as Reference

| Layout | Slots | Key Feature |
|--------|-------|-------------|
| `sidebar-left` | `sidebar` + `main` | 2-column grid, sidebar position toggleable (left/right) |
| `full-width` | `main` only | Single-column flex, compact spacing |
| `top-header` | `header` + `sidebar` + `main` | 2D grid, full-width header row |

Study these in `packages/layouts/src/` before starting your own.

---

## Components

Add or improve CV components in `packages/components/`. Follow the conventions:

- Use `.cv-` prefixed class names
- Use `var(--cv-*)` for colors and `var(--cv-font-*)` for fonts
- Use print-safe units (`mm`, `pt`)
- Add `break-inside: avoid` on logical groups

## Presets

Create new design presets in `packages/presets/` combining a layout ID with token overrides. See [Step 4](#4-create-a-preset-optional-but-recommended) above.

## Translations

Locale files are in `packages/app/src/i18n/locales/`. Currently supported: `de` and `en`.

## Bug Fixes & Features

Check the [issues](https://github.com/OemerErguen/lebenslauf-anschreiben-creator/issues) for open items, or file a new one if you've found a bug.

---

## Definition of Done (DoD)

Every PR must satisfy **all** of the following before it can be merged:

### Code Quality
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm format:check` passes
- [ ] `pnpm typecheck` passes across all packages
- [ ] `pnpm test` passes (all existing tests green)
- [ ] `pnpm build` succeeds

### For Layout / Component / Preset PRs
- [ ] All user-facing strings have both `de` and `en` translations
- [ ] CSS uses only print-safe units (`mm`, `pt`) — no `px` on printed output
- [ ] CSS uses only `var(--cv-*)` custom properties — no hardcoded colors/fonts
- [ ] All class names use the `.cv-` prefix
- [ ] Logical groups have `break-inside: avoid`
- [ ] Layout renders correctly in the live preview at default zoom
- [ ] PDF export produces correct pagination (no cut-off content)
- [ ] Tested with sample data in both `de` and `en` locales

### For All PRs
- [ ] No unrelated changes included
- [ ] No `console.log`, debug code, or TODO comments left behind
- [ ] Branch is up to date with `main`
- [ ] PR description explains **what** changed and **why**

---

## Project Structure

See [architecture.md](architecture.md) for the full overview of the monorepo, rendering pipeline, and conventions.

## Code Style

- **ESLint** with flat config (v9) and `eslint-plugin-boundaries` for enforcing the dependency graph
- **Prettier** for formatting
- **TypeScript** strict mode
- No CSS Modules or Tailwind in CV components — only CSS custom properties

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
