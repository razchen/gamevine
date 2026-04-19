// Plain constants module — intentionally NOT marked `'use client'`.
//
// Server Components in this route group (the /design index, surface pages)
// need to import THEMES / THEME_LABELS / THEME_BLURBS as real values at render
// time. If these lived in `theme-provider.tsx` (which is `'use client'`), the
// Server Component import would resolve to a client-reference object instead
// of the actual array/record, and `.map` would crash. Keep value exports here;
// the Provider + hook stay in `theme-provider.tsx`.

export const THEMES = ['graphite', 'ember', 'obsidian'] as const;
export const MODES = ['light', 'dark'] as const;
export const FONTS = ['geist', 'jakarta', 'grotesk'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;

export type ThemeId = (typeof THEMES)[number];
export type ModeId = (typeof MODES)[number];
export type FontId = (typeof FONTS)[number];
export type DensityId = (typeof DENSITIES)[number];

export const THEME_LABELS: Record<ThemeId, string> = {
  graphite: 'Graphite',
  ember: 'Ember',
  obsidian: 'Obsidian',
};

export const THEME_BLURBS: Record<ThemeId, string> = {
  graphite: 'Cool ink neutrals with indigo and amber. Technical and precise.',
  ember: 'Warm charcoal with muted violet and gold. Editorial and premium.',
  obsidian: 'Pure monochrome with deep plum and bronze. The most restrained.',
};

export const FONT_LABELS: Record<FontId, string> = {
  geist: 'Geist',
  jakarta: 'Plus Jakarta Sans',
  grotesk: 'Space Grotesk',
};

export const DENSITY_LABELS: Record<DensityId, string> = {
  comfortable: 'Comfortable',
  compact: 'Compact',
};

export type Persisted = {
  theme: ThemeId;
  mode: ModeId;
  font: FontId;
  density: DensityId;
};

export const STORAGE_KEY = 'gv-design-sandbox';

export const DEFAULT_STATE: Persisted = {
  theme: 'graphite',
  mode: 'dark',
  font: 'geist',
  density: 'comfortable',
};
