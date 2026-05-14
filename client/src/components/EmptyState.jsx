import React from 'react';

/**
 * Reusable EmptyState component — Task 2.6
 *
 * Props:
 *  icon        — Lucide/react-icon component (e.g. FiUser)
 *  iconColor   — Tailwind text color class (default: "text-blue-400")
 *  iconBg      — Tailwind bg color class (default: "bg-blue-50 dark:bg-blue-900/20")
 *  heading     — Main heading string
 *  subtext     — Secondary description string
 *  ctaLabel    — CTA button label (optional)
 *  onCta       — CTA button onClick handler (optional)
 *  className   — Extra wrapper classes (optional)
 */
export default function EmptyState({
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-900/20',
  heading,
  subtext,
  ctaLabel,
  onCta,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {Icon && (
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${iconBg}`}
        >
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
      )}

      {heading && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {heading}
        </h3>
      )}

      {subtext && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
          {subtext}
        </p>
      )}

      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
