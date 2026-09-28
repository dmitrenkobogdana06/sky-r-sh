import type { TextStyle } from 'react-native';

/**
 * SPACE_COSMOS preset with ticket-specific accents (magnetic blue / violet,
 * cyan energy, gold beacon). The `name` field stays the preset name.
 */
export const THEME = {
  name: 'SPACE_COSMOS',

  bg: {
    base: '#10172F',
    deep: '#070C1C',
    lift: '#1A2454',
  },

  surface: {
    card: '#18224A',
    sheet: '#1E2A57',
    glass: 'rgba(244,246,255,0.07)',
    glassStrong: 'rgba(244,246,255,0.12)',
  },

  accent: {
    blue: '#2F7EFF',
    blueDeep: '#1B4FCC',
    violet: '#7C4BD2',
    violetDeep: '#4B2A86',
    cyan: '#35C5D0',
    gold: '#F1C450',
  },

  text: {
    primary: '#F4F6FF',
    secondary: '#A9B6DF',
    muted: '#6C7AA8',
  },

  border: {
    subtle: 'rgba(244,246,255,0.12)',
    accent: 'rgba(47,126,255,0.35)',
    strong: 'rgba(47,126,255,0.55)',
  },
} as const;

/** Gradient tuples kept as mutable string[] — LinearGradient expects string[]. */
export const GRAD: Record<string, string[]> = {
  loader: ['rgba(7,12,28,0.92)', 'rgba(16,23,47,0.88)', 'rgba(10,14,34,0.96)'],
  menuTop: ['rgba(16,23,47,0)', 'rgba(16,23,47,0.55)', '#10172F'],
  sheet: ['rgba(24,34,74,0.96)', 'rgba(16,23,47,0.99)'],
  panel: ['rgba(24,34,74,0.94)', 'rgba(16,23,47,0.97)'],
  primary: ['#2F7EFF', '#7C4BD2'],
  blue: ['#2F7EFF', '#1B4FCC'],
  violet: ['#7C4BD2', '#4B2A86'],
  energy: ['#35C5D0', '#2F7EFF'],
  progress: ['#2F7EFF', '#35C5D0', '#F1C450'],
  result: ['#10172F', '#1A2454', '#0A0E22'],
  screen: ['rgba(16,23,47,0.82)', 'rgba(10,14,34,0.94)'],
  game: ['rgba(16,23,47,0.62)', 'rgba(10,14,34,0.78)'],
};

export const TYPO = {
  hero: 44,
  title: 34,
  section: 17,
  body: 14,
  caption: 11,
} as const;

/** Tabular figures for every counter, so digits never jitter. */
export const NUM: TextStyle = { fontVariant: ['tabular-nums'] };
