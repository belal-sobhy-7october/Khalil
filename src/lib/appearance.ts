/**
 * Colour palettes and themes. Each one overrides the app's CSS colour
 * variables (the same ones Tailwind's bg-card / text-ink / bg-clay-soft use)
 * for light and dark mode; themes can also add a background pattern and a
 * heading font. Applied as inline variables on <html>, so they win over the
 * defaults in index.css.
 */
import { create } from 'zustand';
import { loadKv, readLocalKv, saveKv } from './userKv';

type Vars = {
  bg: string;
  card: string;
  ink: string;
  inkLight: string;
  inkLighter: string;
  accent: string;
  accentDark: string;
  border: string;
  sage?: string;
  sageDark?: string;
  gold?: string;
  goldDark?: string;
};

export interface Appearance {
  id: string;
  kind: 'default' | 'palette' | 'theme';
  /** Two colours shown on the picker card (dark, light). */
  swatches: [string, string];
  preferredMode?: 'light' | 'dark';
  light: Vars | null;
  dark: Vars | null;
  background?: { light?: string; dark?: string };
  headingFont?: string;
}

// Plaid like a flannel blanket (autumn theme).
const plaid = (a: string, b: string) =>
  `repeating-linear-gradient(0deg, ${a} 0 22px, transparent 22px 44px), repeating-linear-gradient(90deg, ${a} 0 22px, transparent 22px 44px), repeating-linear-gradient(0deg, ${b} 0 2px, transparent 2px 11px)`;

// Eight-pointed Andalusian star tile.
const andalusianTile = (color: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><g fill='none' stroke='${color}' stroke-width='1'><rect x='18' y='18' width='28' height='28'/><rect x='18' y='18' width='28' height='28' transform='rotate(45 32 32)'/><circle cx='32' cy='32' r='6'/><path d='M0 0L18 18M64 0L46 18M0 64L18 46M64 64L46 46'/></g></svg>`
  )}")`;

export const APPEARANCES: Appearance[] = [
  { id: 'default', kind: 'default', swatches: ['#3d2c1e', '#f3efe7'], light: null, dark: null },

  // Swatches are the original palette colours; the accent values below were
  // tuned (same hue) so white button text stays ≥ 4.5:1 and buttons stay
  // ≥ 3:1 against cards, in both modes.

  // ---- Palettes ----
  {
    id: 'wood',
    kind: 'palette',
    swatches: ['#39191A', '#FFFBD6'],
    light: { bg: '#FFFBD6', card: '#F7F0CC', ink: '#39191A', inkLight: '#7A5A4F', inkLighter: '#A89283', accent: '#8B3A2E', accentDark: '#6E2A21', border: '#39191A1F' },
    dark: { bg: '#2A1213', card: '#39191A', ink: '#FFFBD6', inkLight: '#D9CFA8', inkLighter: '#A8987A', accent: '#9F6A34', accentDark: '#7F5429', border: '#FFFBD61A' },
  },
  {
    id: 'pine',
    kind: 'palette',
    swatches: ['#0E4027', '#F7F1E5'],
    light: { bg: '#F7F1E5', card: '#EFE7D6', ink: '#0E4027', inkLight: '#4F6E5C', inkLighter: '#8DA393', accent: '#1F6B45', accentDark: '#0E4027', border: '#0E40271F' },
    dark: { bg: '#06200F', card: '#0A2E1C', ink: '#F7F1E5', inkLight: '#C5D3C4', inkLighter: '#8FA796', accent: '#8E7231', accentDark: '#715B27', border: '#F7F1E51A' },
  },
  {
    id: 'velvet',
    kind: 'palette',
    swatches: ['#65444E', '#EFDFCD'],
    light: { bg: '#EFDFCD', card: '#F6EADB', ink: '#4A2F37', inkLight: '#7E626A', inkLighter: '#A8929A', accent: '#65444E', accentDark: '#4F3540', border: '#65444E24' },
    dark: { bg: '#2C1D23', card: '#3A272E', ink: '#EFDFCD', inkLight: '#D8C2B4', inkLighter: '#B09A92', accent: '#B45D40', accentDark: '#8F4A33', border: '#EFDFCD1F' },
  },
  {
    id: 'copper',
    kind: 'palette',
    swatches: ['#9F4209', '#E0E7E6'],
    light: { bg: '#E0E7E6', card: '#EEF2F1', ink: '#3B2A20', inkLight: '#5C6764', inkLighter: '#98A3A0', accent: '#9F4209', accentDark: '#7E3407', border: '#9F42091F' },
    dark: { bg: '#24160C', card: '#33200F', ink: '#E0E7E6', inkLight: '#BFC9C7', inkLighter: '#8E9997', accent: '#BA5A24', accentDark: '#94481D', border: '#E0E7E61A' },
  },

  // ---- Themes ----
  {
    id: 'autumn',
    kind: 'theme',
    swatches: ['#4A2A1E', '#D9822B'],
    preferredMode: 'dark',
    light: { bg: '#F6E9D7', card: '#FFF6EA', ink: '#4A2A1E', inkLight: '#8A5A3C', inkLighter: '#B08A6A', accent: '#B45F1B', accentDark: '#8F4B16', border: '#4A2A1E1F', sage: '#8A9B5C', gold: '#D9A441' },
    dark: { bg: '#26150F', card: '#3A2117', ink: '#F3E3CF', inkLight: '#D7B998', inkLighter: '#A88768', accent: '#AA651F', accentDark: '#875018', border: '#F3E3CF1F', sage: '#8A9B5C', gold: '#D9A441' },
    background: {
      light: plaid('rgba(160, 82, 45, 0.07)', 'rgba(160, 82, 45, 0.05)'),
      dark: plaid('rgba(120, 30, 30, 0.35)', 'rgba(0, 0, 0, 0.18)'),
    },
  },
  {
    id: 'pink',
    kind: 'theme',
    swatches: ['#E8789A', '#FCE4EC'],
    preferredMode: 'light',
    light: { bg: '#FBE3EC', card: '#FFF4F8', ink: '#7A3550', inkLight: '#995670', inkLighter: '#C08AA0', accent: '#DC2F63', accentDark: '#B31E4B', border: '#E8789A26', sage: '#9BC4B0', gold: '#E8B4C8' },
    dark: { bg: '#24141B', card: '#331D29', ink: '#FCE4EC', inkLight: '#E2B3C5', inkLighter: '#A87C8E', accent: '#E22060', accentDark: '#B5184C', border: '#FCE4EC1A', sage: '#9BC4B0', gold: '#E8B4C8' },
    background: {
      light: 'linear-gradient(180deg, #FBE3EC 0%, #F3E6F3 55%, #E3E8FA 100%)',
      dark: 'linear-gradient(180deg, #2A1820 0%, #261A2A 60%, #1C1C30 100%)',
    },
  },
  {
    id: 'black',
    kind: 'theme',
    swatches: ['#121212', '#C2566B'],
    preferredMode: 'dark',
    light: { bg: '#F4F4F5', card: '#FFFFFF', ink: '#18181B', inkLight: '#52525B', inkLighter: '#A1A1AA', accent: '#18181B', accentDark: '#000000', border: '#18181B1A', sage: '#3F9F6E', gold: '#C79A1E' },
    dark: { bg: '#0E0E0E', card: '#1B1B1B', ink: '#EDEDED', inkLight: '#A3A3A3', inkLighter: '#6B6B6B', accent: '#B34B60', accentDark: '#963D50', border: '#FFFFFF14', sage: '#4CAF7A', gold: '#D4A72C' },
  },
  {
    id: 'andalusian',
    kind: 'theme',
    swatches: ['#0F6E73', '#C9A227'],
    preferredMode: 'light',
    light: { bg: '#F5EEDC', card: '#FBF6EA', ink: '#0F3440', inkLight: '#4E6B70', inkLighter: '#8FA3A3', accent: '#0F6E73', accentDark: '#0B5357', border: '#0F34401F', sage: '#6E8B5A', gold: '#C9A227' },
    dark: { bg: '#071E25', card: '#0B2A31', ink: '#F5EEDC', inkLight: '#CFC6AE', inkLighter: '#8FA0A0', accent: '#8E721C', accentDark: '#705B16', border: '#F5EEDC1A', sage: '#7FA36A', gold: '#C9A227' },
    background: { light: andalusianTile('rgba(15, 110, 115, 0.12)'), dark: andalusianTile('rgba(201, 162, 39, 0.10)') },
    headingFont: "'Amiri', 'Noto Naskh Arabic', serif",
  },
  {
    id: 'downtown',
    kind: 'theme',
    swatches: ['#1E2619', '#C9A24A'],
    preferredMode: 'dark',
    light: { bg: '#EFE6CF', card: '#F7F0DD', ink: '#1F2A1A', inkLight: '#5A6248', inkLighter: '#8E8E70', accent: '#8F7229', accentDark: '#725B21', border: '#1F2A1A1F', sage: '#6E7F4F', gold: '#B08A35' },
    dark: { bg: '#11160F', card: '#1C2418', ink: '#EADFC0', inkLight: '#C2B58E', inkLighter: '#8A8462', accent: '#90712B', accentDark: '#725A22', border: '#EADFC01A', sage: '#6E7F4F', gold: '#C9A24A' },
    background: {
      light: 'radial-gradient(ellipse at top, rgba(201, 162, 74, 0.18), transparent 60%)',
      dark: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 74, 0.16), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.5), transparent 60%)',
    },
    headingFont: "'Amiri', 'Noto Naskh Arabic', serif",
  },
];

const VAR_MAP: Record<keyof Vars, string[]> = {
  bg: ['--bg-primary', '--color-paper'],
  card: ['--color-card'],
  ink: ['--color-ink'],
  inkLight: ['--color-ink-light'],
  inkLighter: ['--color-ink-lighter'],
  accent: ['--color-clay-soft'],
  accentDark: ['--color-clay-soft-dark'],
  border: ['--color-border-subtle'],
  sage: ['--color-sage-soft'],
  sageDark: ['--color-sage-soft-dark'],
  gold: ['--color-gold-soft'],
  goldDark: ['--color-gold-soft-dark'],
};
const ALL_VARS = [...new Set(Object.values(VAR_MAP).flat()), '--app-bg-image', '--app-heading-font'];

export function applyAppearance(id: string, mode: 'light' | 'dark', root: HTMLElement = document.documentElement) {
  const a = APPEARANCES.find((x) => x.id === id) ?? APPEARANCES[0];
  for (const v of ALL_VARS) root.style.removeProperty(v);
  root.dataset.appearance = a.id;
  const vars = mode === 'dark' ? a.dark : a.light;
  if (vars) {
    for (const [key, names] of Object.entries(VAR_MAP) as Array<[keyof Vars, string[]]>) {
      const value = vars[key];
      if (value) for (const n of names) root.style.setProperty(n, value);
    }
  }
  const bg = a.background?.[mode];
  if (bg) root.style.setProperty('--app-bg-image', bg);
  if (a.headingFont) root.style.setProperty('--app-heading-font', a.headingFont);
}

const KEY = 'appearance';

export const useAppearance = create<{ id: string; set: (id: string, userId?: string) => void; load: (userId: string) => Promise<void> }>((set) => ({
  id: readLocalKv<string>(KEY, 'default'),
  set: (id, userId) => {
    set({ id });
    if (userId) void saveKv(userId, KEY, id);
    else {
      try {
        localStorage.setItem(`khalil-kv:${KEY}`, JSON.stringify(id));
      } catch {
        // ignore
      }
    }
  },
  load: async (userId) => {
    const id = await loadKv<string>(userId, KEY, readLocalKv<string>(KEY, 'default'));
    if (APPEARANCES.some((a) => a.id === id)) set({ id });
  },
}));
