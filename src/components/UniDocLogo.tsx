import React from 'react';

interface UniDocLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  variant?: 'light' | 'dark' | 'auto' | 'footer';
  uniColor?: string;
  colorScheme?: 'default' | 'blue-orange';
}

export const UniDocLogo: React.FC<UniDocLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  className = '',
  variant = 'auto',
  uniColor,
  colorScheme = 'default',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', text: 'text-lg', cartSize: 32 },
    md: { box: 'w-10 h-10 rounded-2xl', text: 'text-xl', cartSize: 40 },
    lg: { box: 'w-14 h-14 rounded-3xl', text: 'text-2xl', cartSize: 56 },
    xl: { box: 'w-20 h-20 rounded-3xl', text: 'text-3xl', cartSize: 80 },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* App Icon Container - Sky blue rounded badge matching user screenshot */}
      <div
        className={`${current.box} relative flex items-center justify-center p-1 bg-gradient-to-b from-[#87CEFA] via-[#61B8EC] to-[#42A5E8] shadow-md border border-white/60 overflow-hidden flex-shrink-0 group`}
      >
        {/* Soft gloss highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* SVG Drawing of the Shopping Cart with Books (U & D) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] filter"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White Sticker Outline Effect */}
          <g filter="drop-shadow(0px 0px 2.5px rgba(255,255,255,0.95))">
            {/* Book 1 (Back Left - Deep Forest Green) */}
            <path
              d="M32 20 L48 24 L45 58 L28 54 Z"
              fill="#2D5A43"
              stroke="#1D3E2D"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M48 24 L52 27 L49 61 L45 58 Z"
              fill="#F4E9D0"
              stroke="#D3C3A0"
              strokeWidth="1"
            />
            {/* Book 2 (Middle - Golden Brown Leather with Letter "U") */}
            <path
              d="M44 23 L62 27 L58 64 L40 60 Z"
              fill="#C47535"
              stroke="#8D4C18"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Pages edge */}
            <path
              d="M62 27 L67 31 L63 67 L58 64 Z"
              fill="#FDF6E3"
              stroke="#CDBF9E"
              strokeWidth="1"
            />
            {/* Gold Ribbon / Emboss */}
            <rect
              x="45"
              y="28"
              width="13"
              height="28"
              rx="2"
              fill="#E59955"
              transform="rotate(6 51 42)"
            />
            {/* Letter U */}
            <text
              x="52"
              y="48"
              textAnchor="middle"
              fill="#223B2A"
              fontSize="16"
              fontWeight="900"
              fontFamily="Georgia, serif"
              transform="rotate(6 52 48)"
            >
              U
            </text>

            {/* Book 3 (Right - Emerald Green with Letter "D") */}
            <path
              d="M59 29 L78 32 L75 68 L56 65 Z"
              fill="#3A7053"
              stroke="#214833"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Pages edge */}
            <path
              d="M78 32 L83 36 L80 71 L75 68 Z"
              fill="#F9F6ED"
              stroke="#D4C9AD"
              strokeWidth="1"
            />
            {/* Cream center on cover */}
            <rect
              x="62"
              y="36"
              width="12"
              height="24"
              rx="2"
              fill="#D9B774"
              transform="rotate(4 68 48)"
            />
            {/* Letter D */}
            <text
              x="68"
              y="53"
              textAnchor="middle"
              fill="#223B2A"
              fontSize="15"
              fontWeight="900"
              fontFamily="Georgia, serif"
              transform="rotate(4 68 53)"
            >
              D
            </text>

            {/* Shopping Cart Basket (Wireframe) */}
            {/* Handle Bar (Orange Grip) */}
            <path
              d="M20 28 L30 33"
              stroke="#EA580C"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Cart Frame Upper Rim */}
            <path
              d="M28 32 L84 37 L78 65 L36 65 Z"
              fill="rgba(255,255,255,0.15)"
              stroke="#596A78"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Orange Corner Bumpers */}
            <circle cx="83" cy="38" r="3" fill="#EA580C" />
            <circle cx="29" cy="33" r="3" fill="#EA580C" />

            {/* Cart Grid Wires */}
            <line x1="43" y1="34" x2="43" y2="65" stroke="#7E8E9E" strokeWidth="1.8" />
            <line x1="53" y1="35" x2="52" y2="65" stroke="#7E8E9E" strokeWidth="1.8" />
            <line x1="63" y1="36" x2="61" y2="65" stroke="#7E8E9E" strokeWidth="1.8" />
            <line x1="73" y1="36" x2="70" y2="65" stroke="#7E8E9E" strokeWidth="1.8" />

            <line x1="32" y1="42" x2="81" y2="46" stroke="#8A9AA8" strokeWidth="1.8" />
            <line x1="34" y1="53" x2="79" y2="56" stroke="#8A9AA8" strokeWidth="1.8" />

            {/* Lower Frame & Chassis */}
            <path
              d="M34 65 L40 76 L70 76 L74 65"
              stroke="#4D5D6B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26 31 L35 76"
              stroke="#4D5D6B"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Front & Rear Wheels */}
            <circle cx="43" cy="83" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="68" cy="83" r="4.5" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="43" cy="83" r="1.5" fill="#F8FAFC" />
            <circle cx="68" cy="83" r="1.5" fill="#F8FAFC" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${current.text} font-black tracking-tight leading-none flex items-center ${
              variant === 'footer' || variant === 'dark'
                ? 'text-white'
                : variant === 'light'
                ? 'text-slate-900'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {colorScheme === 'blue-orange' ? (
              <>
                <span className="text-[#0860c9] dark:text-[#60a5fa]">Uni</span>
                <span className="text-[#f97316]">Doc</span>
              </>
            ) : (
              <>
                <span
                  className={
                    uniColor
                      ? uniColor
                      : variant === 'footer'
                      ? 'text-white'
                      : ''
                  }
                >
                  Uni
                </span>
                <span className="text-[#38BDF8] drop-shadow-xs">Doc</span>
              </>
            )}
          </span>
          {showSubtitle && (
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest leading-none mt-1 ${
                variant === 'footer' || variant === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Chợ sách SV
            </span>
          )}
        </div>
      )}
    </div>
  );
};
