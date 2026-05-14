// spacing.js — Centrix Design System
// Task 2.7 / 2.10 — Consistent spacing scale + constants file
// Scale: 4 | 8 | 16 | 24 | 32 | 48 | 64 (px)

export const spacing = {
  xs:  4,   // 4px  — tight gaps, icon padding
  sm:  8,   // 8px  — small gaps, compact padding
  md:  16,  // 16px — standard padding, card inner
  lg:  24,  // 24px — section padding, card outer
  xl:  32,  // 32px — page section gaps
  xxl: 48,  // 48px — large section separators
  xxxl: 64, // 64px — page-level top/bottom padding
};

// CSS pixel strings (for inline styles)
export const sp = {
  xs:   '4px',
  sm:   '8px',
  md:   '16px',
  lg:   '24px',
  xl:   '32px',
  xxl:  '48px',
  xxxl: '64px',
};

// Border radius scale
export const radius = {
  sm:  '6px',
  md:  '8px',
  lg:  '12px',
  xl:  '16px',
  full: '9999px',
};

// Font size scale
export const fontSize = {
  xs:   '11px',
  sm:   '12px',
  base: '13px',
  md:   '14px',
  lg:   '16px',
  xl:   '18px',
  xxl:  '20px',
  h1:   '24px',
};

// Color tokens
export const colors = {
  primary:   '#2563EB',
  success:   '#059669',
  danger:    '#DC2626',
  warning:   '#D97706',
  info:      '#0891B2',
  gray: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export default { spacing, sp, radius, fontSize, colors };
