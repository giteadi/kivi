/**
 * Task 2.10 — Centrix Design System Constants
 * Spacing scale: 4, 8, 16, 24, 32, 48, 64 (px)
 * Use these instead of hardcoded pixel values.
 */

export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '16px',
  lg:  '24px',
  xl:  '32px',
  '2xl': '48px',
  '3xl': '64px',
};

/**
 * Task 2.9 — Icon sizes
 * inline: 16px  (inside text / labels)
 * button: 20px  (inside buttons)
 * heading: 24px (section headings)
 */
export const iconSize = {
  inline:  16,
  button:  20,
  heading: 24,
};

/**
 * Color palette (matches Tailwind classes used in the app)
 */
export const colors = {
  primary:   '#2563EB',   // blue-600
  success:   '#059669',   // emerald-600
  danger:    '#DC2626',   // red-600
  warning:   '#D97706',   // amber-600
  neutral:   '#6B7280',   // gray-500
  textMain:  '#111827',   // gray-900
  textMuted: '#6B7280',   // gray-500
  border:    '#E5E7EB',   // gray-200
  bgPage:    '#F9FAFB',   // gray-50
  bgCard:    '#FFFFFF',
};

/**
 * Border radius
 */
export const radius = {
  sm:  '6px',
  md:  '8px',
  lg:  '12px',
  xl:  '16px',
  full: '9999px',
};

/**
 * Transition presets
 */
export const transition = {
  fast:   'all 0.15s ease',
  normal: 'all 0.2s ease',
  slow:   'all 0.3s ease',
};
