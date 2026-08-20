export const colors = {
  background: '#0F0B1A',
  surface: '#1A1428',
  surfaceAlt: '#241C38',
  border: '#2E2444',
  primary: '#A78BFA',
  primaryMuted: '#5B4B8A',
  gold: '#E8B44A',
  text: '#F5F3FF',
  textMuted: '#9C93B5',
  success: '#4ADE80',
  danger: '#F87171',
  warning: '#FBBF24',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};
