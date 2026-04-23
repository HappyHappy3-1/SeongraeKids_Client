export const colors = {
  primary: '#FDCB35',
  primaryDark: '#E0AE17',
  primarySoft: '#FFF4D2',

  black: '#000000',
  white: '#FFFFFF',

  text: {
    primary: '#1F1F1F',
    secondary: '#757575',
    muted: '#999999',
    placeholder: '#937725',
    inverse: '#FFFFFF',
  },

  surface: {
    white: '#FFFFFF',
    muted: '#F5F5F5',
    dark: '#3F3F3F',
    option: '#D9D9D9',
  },

  border: {
    default: '#E5E5E5',
    strong: '#FDCB35',
    soft: '#D9D9D9',
  },

  state: {
    danger: '#D33333',
    warning: '#FFB020',
    success: '#2EA84B',
  },

  sidebar: {
    activeBg: '#FDCB35',
    activeFg: '#1F1F1F',
    inactiveFg: '#1F1F1F',
    inactiveLabel: '#9A9A9A',
    hoverBg: 'rgba(253,203,53,0.12)',
  },
} as const;

export const fonts = {
  family: {
    laundry: "'LaundryGothic', sans-serif",
    pretendard: 'Pretendard, Inter, sans-serif',
    inter: 'Inter, sans-serif',
  },
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 42,
    '4xl': 50,
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const space = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80,
} as const;

export const radii = { none: 0, sm: 2, md: 5, lg: 8, xl: 15, '2xl': 20, full: 9999 } as const;

export const shadows = {
  card: '0 4px 7.5px rgba(0,0,0,0.07)',
  panel: '0 4px 5px rgba(0,0,0,0.08)',
  popover: '0 4px 12px rgba(0,0,0,0.20)',
  float: '0 12px 28px rgba(0,0,0,0.30)',
} as const;

export const zIndex = { base: 0, raised: 1, nav: 10, overlay: 20, modal: 30, toast: 40 } as const;

export const design = { width: 1440, height: 1024 } as const;

export const filters = {
  activeYellow:
    'brightness(0) saturate(100%) invert(82%) sepia(45%) saturate(1000%) hue-rotate(355deg) brightness(100%) contrast(95%)',
  inactiveIcon: 'brightness(0) saturate(100%) opacity(0.38)',
  muted: 'grayscale(60%) opacity(0.6)',
} as const;

export const motion = {
  duration: { fast: '0.15s', base: '0.22s', slow: '0.38s' },
  easing: { standard: 'cubic-bezier(0.4, 0, 0.2, 1)', out: 'ease-out' },
} as const;
