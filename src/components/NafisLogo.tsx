import React from 'react';

interface NafisLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'emblem' | 'full';
  animated?: boolean;
}

export const NafisLogo: React.FC<NafisLogoProps> = ({
  className = '',
  size = 44,
  variant = 'emblem',
  animated = true,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${animated ? 'nafis-logo-animated' : ''} ${className}`}
      style={{ width: size, height: variant === 'full' ? 'auto' : size }}
    >
      <svg
        viewBox={variant === 'full' ? '0 0 200 240' : '0 0 100 120'}
        className="w-full h-full overflow-visible drop-shadow-[0_2px_8px_rgba(11,31,51,0.2)] dark:drop-shadow-[0_2px_12px_rgba(198,161,91,0.25)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Emerald Green Rich Gradient */}
          <linearGradient id="emeraldDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#144D3C" />
            <stop offset="40%" stopColor="#0E382C" />
            <stop offset="100%" stopColor="#07241B" />
          </linearGradient>

          {/* Emerald Green Light/Shaded Edge */}
          <linearGradient id="emeraldSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1C5E4A" />
            <stop offset="50%" stopColor="#104233" />
            <stop offset="100%" stopColor="#08281E" />
          </linearGradient>

          {/* Metallic Gold Ribbon Gradient */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9D39B" />
            <stop offset="25%" stopColor="#C6A15B" />
            <stop offset="50%" stopColor="#F4E4BA" />
            <stop offset="75%" stopColor="#B8924B" />
            <stop offset="100%" stopColor="#8C6A28" />
          </linearGradient>

          {/* Gold Diamond Gradient */}
          <linearGradient id="goldDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBF2D5" />
            <stop offset="45%" stopColor="#D8B56C" />
            <stop offset="100%" stopColor="#9C772F" />
          </linearGradient>

          {/* Animated Gold Shimmer Sweep */}
          <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B38E46" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#D4B36D" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFF9E6" stopOpacity="1">
              {animated && (
                <animate
                  attributeName="offset"
                  values="-0.3; 1.3"
                  dur="3.6s"
                  repeatCount="indefinite"
                />
              )}
            </stop>
            <stop offset="65%" stopColor="#D4B36D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8C6824" stopOpacity="0.9" />
          </linearGradient>

          {/* Subtle Ambient Radial Glow */}
          <radialGradient id="emblemAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#144D3C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0B1F33" stopOpacity="0" />
          </radialGradient>

          {/* Filter for subtle gold sheen */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Pulsing Aura (Auto-animation) */}
        {animated && (
          <ellipse
            cx={variant === 'full' ? 100 : 50}
            cy={variant === 'full' ? 80 : 55}
            rx={variant === 'full' ? 45 : 32}
            ry={variant === 'full' ? 60 : 42}
            fill="url(#emblemAura)"
            className="animate-pulse opacity-60"
            style={{ animationDuration: '4s' }}
          />
        )}

        <g transform={variant === 'full' ? 'translate(50, 10)' : 'translate(0, 0)'}>
          
          {/* ==================================================== */}
          {/* 1. TOP GOLD DIAMOND (Nuqta)                         */}
          {/* ==================================================== */}
          <g className={animated ? 'nafis-diamond-pulse' : ''}>
            <polygon
              points="50,7 57.5,14.5 50,22 42.5,14.5"
              fill="url(#goldDiamond)"
              stroke="#E8CE90"
              strokeWidth="0.6"
              filter="url(#softGlow)"
            />
            {/* Diamond inner facet highlight */}
            <polygon
              points="50,9 55.5,14.5 50,16.5 44.5,14.5"
              fill="#FFFDF7"
              opacity="0.6"
            />
          </g>

          {/* ==================================================== */}
          {/* 2. LEFT & OUTER GREEN CALLIGRAPHIC STROKE (Flame wing)*/}
          {/* ==================================================== */}
          {/* Main outer emerald loop sweeping from bottom to top-left */}
          <path
            d="M 50.5,108
               C 46,104 39,94 33,83
               C 27,72 24.5,58 26.5,46
               C 28.5,34 35.5,23 44.5,22
               C 49,21.5 53,24 55,27.5
               C 56.5,30 56,33 54,35.5
               C 51.5,38.5 47,40 43,42
               C 38.5,44.5 35.5,48.5 34.5,54
               C 33.5,60 35,66.5 38,73
               C 41.5,80.5 46.5,88 50,94
               C 50.8,96 51,99 50.5,101
               C 49.8,103.5 48.5,106 50.5,108 Z"
            fill="url(#emeraldDark)"
            stroke="#195543"
            strokeWidth="0.4"
          />

          {/* Inner counter / loop opening on top-left of Nun/Fa */}
          <path
            d="M 44,27
               C 41,27.5 37.5,31.5 37,36
               C 36.5,40.5 38.5,43 41.5,43.5
               C 44.5,44 47.5,41 48,37
               C 48.5,33 47,26.5 44,27 Z"
            fill="#F8F6F0"
            className="dark:fill-[#0B1F33] transition-colors duration-300"
            opacity="0.95"
          />

          {/* ==================================================== */}
          {/* 3. CENTER GOLDEN FLOWING RIBBON (Metallic Sheen)     */}
          {/* ==================================================== */}
          <path
            d="M 37.5,75
               C 36,68 37.5,59 41.5,51
               C 45.5,43 51,36 57,30
               C 59,28 61,29 61.5,31.5
               C 62,34 60.5,37 58.5,40.5
               C 54,48 48.5,56.5 46,65.5
               C 44,72.5 45.5,79.5 48,86.5
               C 50,92 53,97 56,102
               C 56.5,103 56,104 55,104
               C 51.5,103 46,97.5 42.5,91
               C 39.5,85.5 38,80 37.5,75 Z"
            fill="url(#goldShimmer)"
            stroke="#F5E4B5"
            strokeWidth="0.5"
            filter="url(#softGlow)"
          />

          {/* Inner golden crest highlight facet */}
          <path
            d="M 57,30
               C 59,28 61,29 61.5,31.5
               C 62,34 60,37.5 57,41.5
               C 53,47 48,54.5 45.5,63
               C 44.8,61 45.5,56 47.5,51
               C 50.5,43.5 54,36.5 57,30 Z"
            fill="#FFF5D6"
            opacity="0.75"
          />

          {/* ==================================================== */}
          {/* 4. RIGHT GREEN WING & TAIL (Sin/Swoop)               */}
          {/* ==================================================== */}
          <path
            d="M 58.5,33
               C 63,30.5 68,31 71.5,34.5
               C 75.5,38.5 77.5,44.5 77.5,51.5
               C 77.5,60 74.5,69 70.5,77.5
               C 66.5,86 61.5,94 56.5,101.5
               C 54.5,104.5 52.5,107.5 50.5,110.5
               C 49.5,112 48.5,113.5 48,115
               C 48.5,114 50,111.5 51.5,109
               C 56,102 61.5,94.5 65.5,86.5
               C 69.5,78.5 72,70.5 71.5,63
               C 71,55.5 68,49 63.5,44.5
               C 60.5,41.5 57.5,39 55.5,36.5
               C 55,36 56.5,34 58.5,33 Z"
            fill="url(#emeraldSecondary)"
            stroke="#1B5947"
            strokeWidth="0.4"
          />

          {/* Delicate Sharp Bottom Tip Flick */}
          <path
            d="M 50.5,108
               C 49.8,111 48.5,114.5 47,117.5
               C 46.5,118.5 47.5,118.8 48.2,118
               C 50,115.5 51.8,112 52.5,108.5 Z"
            fill="url(#emeraldDark)"
          />

          {/* Specular Light Reflection Sweep on Green Loop */}
          <path
            d="M 28,50
               C 27.5,42 32,32 39,26
               C 42,23.5 46,23 48,24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.1"
            strokeLinecap="round"
            className={animated ? 'nafis-sheen-line' : ''}
          />
        </g>

        {/* ==================================================== */}
        {/* FULL VARIANT: Typography (NAFIS + SUBTITLE)         */}
        {/* ==================================================== */}
        {variant === 'full' && (
          <g transform="translate(100, 165)" textAnchor="middle">
            {/* NAFIS Title */}
            <text
              x="0"
              y="15"
              fontFamily="'Cinzel', 'Playfair Display', 'Georgia', serif"
              fontSize="24"
              fontWeight="800"
              letterSpacing="6"
              fill="#0E382C"
              className="dark:fill-[#F8F6F0] transition-colors"
            >
              NAFIS
            </text>

            {/* Subtitle */}
            <text
              x="0"
              y="34"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="3"
              fill="#3E7180"
              className="dark:fill-[#C6A15B] uppercase transition-colors"
            >
              FROM KNOWLEDGE TO IMPACT
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
