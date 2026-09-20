import React from 'react';

interface GoldenEagleCrestProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const GoldenEagleCrest: React.FC<GoldenEagleCrestProps> = ({
  className = '',
  size = 44,
  glow = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-600/30 rounded-full blur-md animate-pulse pointer-events-none" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative drop-shadow-[0_2px_8px_rgba(255,215,0,0.6)]"
      >
        <defs>
          <linearGradient id="eagleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1220" />
            <stop offset="100%" stopColor="#04070D" />
          </linearGradient>
          <linearGradient id="crestGleam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="goldShine" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer Circular Ring with Imperial Dots */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#eagleGoldGrad)"
          strokeWidth="1.8"
          strokeDasharray="2 3"
          opacity="0.85"
        />
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke="url(#eagleGoldGrad)"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Imperial Sovereign Eagle Wings (Spread Wings) */}
        {/* Left Wing Feathers */}
        <path
          d="M50 34 C44 26 33 22 17 24 C14 24.5 12 28 14 30 C19 32 25 33 29 36 C22 36 15 38 10 42 C9 43.5 10.5 45.5 12.5 45.5 C18 45 24 45 28 47 C21 48 16 51 13 55 C12 56.5 13.5 58.5 15.5 58 C21 56 26 55 31 56 C25 58 20 62 18 66 C17.5 67.5 19 69 20.5 68.5 C26 66 31 63 36 62 C32 65 28 70 27 74 C26.5 75.5 28 77 29.5 76.5 C35 73 40 68 44 63 L47 52 L50 34 Z"
          fill="url(#eagleGoldGrad)"
          filter="url(#goldShine)"
        />

        {/* Right Wing Feathers (Mirrored) */}
        <path
          d="M50 34 C56 26 67 22 83 24 C86 24.5 88 28 86 30 C81 32 75 33 71 36 C78 36 85 38 90 42 C91 43.5 89.5 45.5 87.5 45.5 C82 45 76 45 72 47 C79 48 84 51 87 55 C88 56.5 86.5 58.5 84.5 58 C79 56 74 55 69 56 C75 58 80 62 82 66 C82.5 67.5 81 69 79.5 68.5 C74 66 69 63 64 62 C68 65 72 70 73 74 C73.5 75.5 72 77 70.5 76.5 C65 73 60 68 56 63 L53 52 L50 34 Z"
          fill="url(#eagleGoldGrad)"
          filter="url(#goldShine)"
        />

        {/* Eagle Tail Feathers */}
        <path
          d="M44 68 L41 84 C41 85.5 43 86.5 44.5 85.5 L48 81 L50 86 L52 81 L55.5 85.5 C57 86.5 59 85.5 59 84 L56 68 Z"
          fill="url(#eagleGoldGrad)"
        />

        {/* Central Heraldic Shield */}
        <path
          d="M36 43 C36 41 50 39 50 39 C50 39 64 41 64 43 C64 57 58 69 50 74 C42 69 36 57 36 43 Z"
          fill="url(#shieldFill)"
          stroke="url(#eagleGoldGrad)"
          strokeWidth="1.6"
        />

        {/* Guilloche / Crosshatch Inside Shield */}
        <path
          d="M40 46 L60 66 M60 46 L40 66"
          stroke="url(#eagleGoldGrad)"
          strokeWidth="0.6"
          opacity="0.35"
        />

        {/* Imperial Star & Cipher in Shield */}
        <path
          d="M50 48 L52.2 53.5 L58 54.2 L53.7 58 L54.9 63.8 L50 60.8 L45.1 63.8 L46.3 58 L42 54.2 L47.8 53.5 Z"
          fill="url(#eagleGoldGrad)"
        />

        {/* Eagle Head Profile & Beak */}
        <path
          d="M47 30 C47 25 49 20 50 18 C52 19 55 21 57 23 C59 25 61 27 60 29 C58 30 55 29 53 31 C51 33 49 35 48 37 Z"
          fill="url(#eagleGoldGrad)"
        />
        {/* Eagle Sharp Golden Beak */}
        <path
          d="M58 24 L64 27 L58 29 Z"
          fill="#FFF2A3"
        />
        {/* Eye */}
        <circle cx="53" cy="24.5" r="1.1" fill="#06090F" />
        <circle cx="53" cy="24.5" r="0.4" fill="#FFF2A3" />

        {/* Imperial Sovereign Crown atop Eagle */}
        <path
          d="M43 17 L44.5 13 L47.5 15.5 L50 11 L52.5 15.5 L55.5 13 L57 17 Z"
          fill="url(#eagleGoldGrad)"
          stroke="#FFF2A3"
          strokeWidth="0.5"
        />
        <circle cx="50" cy="9.5" r="1" fill="#FFF2A3" />
        <circle cx="44.5" cy="11.5" r="0.7" fill="#FFD700" />
        <circle cx="55.5" cy="11.5" r="0.7" fill="#FFD700" />
      </svg>
    </div>
  );
};
