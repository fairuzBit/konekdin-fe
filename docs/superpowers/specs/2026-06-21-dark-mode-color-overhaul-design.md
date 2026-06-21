# Dark Mode Color Palette Overhaul & Glassmorphism Spec

- **Date:** 2026-06-21
- **Status:** Proposed
- **Author:** Antigravity (Google DeepMind Team)

## 1. Overview
The user wants to overhaul the KonekDin application's dark mode theme. Instead of using solid dark-teal backgrounds, the dark theme will use a **premium dark glassmorphic green/charcoal look** based on a reference image. This includes:
- Transparent, translucent, and gradient-filled components.
- Backdrop blur (glassmorphism) on cards and panels.
- Vibrant neon/lime green accents (`#8ae334` / `#98ec2e`) for active states, buttons, borders, and visual accents.
- Preserving the light mode style exactly as it is.

## 2. Design Tokens

### Dark Mode `.dark` Variables
We will redefine the following custom properties inside `src/index.css` under the `.dark` class:

| CSS Variable | Value / RGB | Description |
|---|---|---|
| `--bg-primary` | `6 11 8` | Deep charcoal green background (`#060b08`) |
| `--bg-secondary` | `12 22 17` | Card base dark green (`#0c1611`) |
| `--app-bg` | `6 11 8` | Global application background |
| `--text-primary` | `255 255 255` | High contrast white text |
| `--text-secondary` | `156 163 175` | Slate-400 secondary text |
| `--border-color` | `138 227 52 / 0.08` | Translucent neon-green border |
| `--brand-50` | `244 252 235` | Lightest neon green tint |
| `--brand-100` | `228 249 204` | Very light neon green tint |
| `--brand-400` | `172 239 88` | Active neon green tint |
| `--brand-500` | `138 227 52` | Primary Neon/Lime Green (`#8ae334`) |
| `--brand-600` | `110 189 36` | Medium-dark neon green |
| `--brand-700` | `84 147 25` | Darker neon green |
| `--brand-800` | `59 104 16` | Deep neon green |
| `--brand-900` | `42 75 10` | Darkest neon green |
| `--accent-green` | `138 227 52` | Vibrant accent green |

## 3. Implementation Strategy (Approach 1)

### Phase 1: CSS Variables Update
Update the `.dark` definition block in `src/index.css` to match the design tokens.

### Phase 2: Global Glassmorphic Overrides
Instead of manually refactoring all component files, we will use global overrides inside `src/index.css` under the `.dark` class to add backdrop filters, translucency, and subtle inner glows:
1. **Card Component Overrides**: Apply a linear gradient (`linear-gradient(135deg, rgba(16, 28, 22, 0.45) 0%, rgba(6, 11, 8, 0.75) 100%)`), `backdrop-filter: blur(16px)`, a subtle transparent neon border, and custom box-shadows to all elements using `.bg-bgSecondary`.
2. **Sidebar Override**: Ensure the sidebar has consistent styling, adapting the translucent background where appropriate.
3. **Scrollbar Override**: Stylize scrollbars to match the translucent neon-green design theme.

### Phase 3: Validation and Verification
Start the development server and verify the layout, page-by-page contrast, and dark mode toggling.

## 4. Verification Plan
- **Light Mode Check**: Ensure all light mode page components render exactly the same as before.
- **Dark Mode Check**: Verify the new dark mode aesthetics match the reference image (translucent, gradient cards, vibrant lime green accents).
- **Responsive Layout**: Check the glassmorphic sidebar and layout components on both desktop and mobile screens.
