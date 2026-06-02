---
name: Nobel Laureate Archive
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#44474d'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#515f7a'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0c1b33'
  on-primary-container: '#7684a1'
  inverse-primary: '#b9c7e6'
  secondary: '#7a580f'
  on-secondary: '#ffffff'
  secondary-container: '#ffd07d'
  on-secondary-container: '#79570d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#858383'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#b9c7e6'
  on-primary-fixed: '#0c1b33'
  on-primary-fixed-variant: '#394761'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#edc06e'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is centered on the concept of a "Digital Curated Gallery." It serves an academic and prestigious audience, ranging from researchers and students to history enthusiasts. The emotional response is one of reverence, intellectual curiosity, and timelessness. 

The aesthetic blends **Modern Minimalism** with **Editorial Sophistication**. It avoids flashy trends in favor of structured layouts, generous whitespace, and a high-contrast visual hierarchy that mimics the experience of a premium physical encyclopedia or a high-end museum wing. Precision, clarity, and authority are the primary design drivers.

## Colors

The palette is rooted in tradition and excellence. 
- **Primary (Deep Navy):** Used for global navigation, primary headings, and heavy structural elements to establish a grounded, academic tone.
- **Secondary (Noble Gold):** Reserved for accents, interactive states, and celebratory moments (like the prize year or medal icons). It should be used sparingly to maintain its premium impact.
- **Tertiary (Charcoal):** Used for body text and subtle borders to ensure high legibility without the harshness of pure black.
- **Neutral (Ivory):** The primary background color, providing a warmer, more "paper-like" feel than stark white, reducing eye strain for long-form reading.

## Typography

This design system utilizes a high-contrast typographic pairing to bridge the gap between historical record and modern interface.

- **Headlines:** Libre Caslon Text brings an authoritative, literary quality. Display sizes use slight negative letter-spacing to appear more cohesive on screen.
- **Body:** Inter provides a neutral, systematic counterpoint to the serif headings. Its high x-height and clear apertures ensure that dense biographical information remains accessible.
- **Labels:** Use `label-caps` for metadata, categories (e.g., "PHYSICS", "PEACE"), and small UI markers to create a clear visual distinction from narrative content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a "curated" feel, preventing content from becoming over-extended. 

- **Grid:** A 12-column grid is used for the main library and gallery views.
- **Rhythm:** Spacing follows an 8px base unit. Large sections of content should be separated by significant vertical padding (80px or 120px) to allow the "exhibits" to breathe.
- **Mobile Adaption:** For mobile, the margins tighten to 20px, and the grid collapses to a single column. Timeline elements should switch from a horizontal orientation to a vertical left-aligned "thread."

## Elevation & Depth

This design system avoids heavy shadows and floating effects to maintain a grounded, architectural feel.

- **Tonal Layers:** Depth is communicated through subtle shifts in background color. Primary content sits on Ivory (#F9F8F6), while sidebars or secondary modules sit on a slightly darker "Paper" tint (#F2F1EE).
- **Outlines:** Instead of shadows, use 1px solid borders in a very light neutral (e.g., #E5E4E1).
- **Interactive Depth:** When a card or element is hovered, use a subtle 2px vertical lift and a soft, low-opacity "Gold" glow or tint to indicate interactivity without breaking the flat museum aesthetic.

## Shapes

The shape language is conservative and sharp. Elements use "Soft" (0.25rem) corner radii to appear modern and refined without feeling "bubbly" or overly consumer-tech. 

- **Images:** Portraits of Laureates should be strictly rectangular or use a circular "Medallion" crop for specific decorative highlights.
- **Buttons:** Use sharp corners or the base 4px radius. Avoid pill-shaped buttons as they conflict with the formal academic tone.

## Components

- **Gallery Cards:** Cards feature a generous top-aligned image, followed by a `label-caps` category, a `headline-md` name, and a short `body-md` excerpt. Use a thin 1px border.
- **Refined Search:** The search bar should be centered and oversized, using a serif placeholder text. It is a focal point, not a utility hidden in a corner.
- **Chronological Timelines:** A thin vertical or horizontal line in Gold (#B38B3F). The "nodes" on the timeline are small filled circles that expand into a tool-tip with the Laureate's name upon hover.
- **Buttons:**
  - *Primary:* Solid Deep Navy with Ivory text.
  - *Secondary:* Transparent with a 1px Navy or Gold border.
- **Metadata Chips:** Small, rectangular boxes with a light neutral fill and `label-caps` text. No rounded corners.
- **Exhibition Lists:** Vertical lists for bibliographies or related works should use a subtle hairline divider between items, with generous 24px padding between rows.
