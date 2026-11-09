import React from 'react';

/**
 * Premium Apple-grade vector logo for Centrix
 * Features a high-precision kinetic squircle glyph + sleek typography
 */
const LogoImage = ({ 
  className = "w-full h-full", 
  variant = "mark", // 'mark' | 'full' | 'compact'
  size = 36,
  alt = "Centrix Clinical"
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Apple-grade Vector Mark */}
      <div 
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 flex items-center justify-center rounded-[22%] bg-gradient-to-br from-[#0071e3] via-[#3b82f6] to-[#6366f1] p-[2px] shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-transform duration-200 hover:scale-[1.02]"
      >
        {/* Subtle inner glass sheen */}
        <div className="absolute inset-0 rounded-[22%] bg-gradient-to-t from-black/10 via-transparent to-white/25 pointer-events-none" />
        
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          <defs>
            <linearGradient id="centrixGlow" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#e0e7ff" stopOpacity="0.85" />
            </linearGradient>
            <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Central Cognitive Kinetic Arc */}
          <path
            d="M 27 12 C 23.5 8.5 17 8.5 13.5 12 C 9.5 16 9.5 24 13.5 28 C 17.5 32 24 31.5 27 28"
            stroke="url(#centrixGlow)"
            strokeWidth="3.6"
            strokeLinecap="round"
            filter="url(#subtleShadow)"
          />
          
          {/* Inner Accent Synapse / Spark */}
          <path
            d="M 21 16 C 18.5 16 16.5 18 16.5 20.5 C 16.5 23 18.5 24.5 21 24.5 C 23 24.5 24.5 23.5 25 22"
            stroke="#ffffff"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Focal Node Dot */}
          <circle cx="27" cy="20" r="2.2" fill="#ffffff" />
        </svg>
      </div>

      {/* Optional Wordmark for expanded or full displays */}
      {(variant === 'full' || variant === 'compact') && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
              Centrix
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/40">
              PRO
            </span>
          </div>
          {variant === 'full' && (
            <span className="text-[10px] font-medium tracking-tight text-slate-500 dark:text-slate-400 mt-0.5">
              Clinical Therapy OS
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoImage;
