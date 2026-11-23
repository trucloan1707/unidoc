import React from 'react';
import { UNIDOC_RANK_BADGES } from '../data/mockData';
import { HumorousBadgeInfo } from '../types';

export function getRankBadgeForCount(count: number): HumorousBadgeInfo | null {
  if (!count || count <= 0) return null;
  return (
    UNIDOC_RANK_BADGES.slice()
      .reverse()
      .find((b) => count >= b.minThreshold) || UNIDOC_RANK_BADGES[0]
  );
}

export function getNextRankBadgeForCount(count: number): HumorousBadgeInfo | null {
  return UNIDOC_RANK_BADGES.find((b) => count < b.minThreshold) || null;
}

interface RankAvatarProps {
  src?: string;
  alt: string;
  tier?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackText?: string;
  onError?: () => void;
  hasError?: boolean;
  className?: string;
}

export const RankAvatar: React.FC<RankAvatarProps> = ({
  src,
  alt,
  tier = 0,
  size = 'md',
  fallbackText = 'SV',
  onError,
  hasError = false,
  className = '',
}) => {
  const sizeMap = {
    xs: {
      outer: 'w-7 h-7',
      pad: 'p-[2px]',
      text: 'text-[10px]',
      sparkle: 'text-[8px] -top-1 -right-1',
    },
    sm: {
      outer: 'w-10 h-10',
      pad: 'p-[2.5px]',
      text: 'text-xs',
      sparkle: 'text-[10px] -top-1 -right-1',
    },
    md: {
      outer: 'w-14 h-14',
      pad: 'p-[3px]',
      text: 'text-sm',
      sparkle: 'text-xs -top-1.5 -right-1',
    },
    lg: {
      outer: 'w-16 h-16 sm:w-20 sm:h-20',
      pad: 'p-[3.5px]',
      text: 'text-xl',
      sparkle: 'text-sm -top-1.5 -right-1',
    },
    xl: {
      outer: 'w-20 h-20',
      pad: 'p-[4px]',
      text: 'text-xl',
      sparkle: 'text-sm -top-1.5 -right-1',
    },
  };

  const s = sizeMap[size];

  const getFrameStyle = () => {
    switch (tier) {
      case 1:
        // Hạng 1: Khung viền Avatar Đồng
        return {
          wrapperClass:
            'bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 shadow-[0_0_8px_rgba(180,83,9,0.4)]',
          innerRingClass: 'ring-1 ring-amber-200/60',
          isLegendary: false,
          isPlatinum: false,
        };
      case 2:
        // Hạng 2: Khung viền Avatar Bạc
        return {
          wrapperClass:
            'bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 shadow-[0_0_10px_rgba(148,163,184,0.55)]',
          innerRingClass: 'ring-1 ring-white/80',
          isLegendary: false,
          isPlatinum: false,
        };
      case 3:
        // Hạng 3: Khung viền Avatar Vàng
        return {
          wrapperClass:
            'bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-[0_0_12px_rgba(245,158,11,0.55)]',
          innerRingClass: 'ring-1 ring-yellow-100/80',
          isLegendary: false,
          isPlatinum: false,
        };
      case 4:
        // Hạng 4: Khung viền Bạch Kim phát sáng
        return {
          wrapperClass:
            'bg-gradient-to-br from-cyan-100 via-sky-300 to-indigo-400 unidoc-frame-platinum',
          innerRingClass: 'ring-2 ring-white/90',
          isLegendary: false,
          isPlatinum: true,
        };
      case 5:
        // Hạng 5: Khung Avatar Vàng lấp lánh đẹp hơn hạng vàng
        return {
          wrapperClass: 'unidoc-frame-legendary-aura',
          innerRingClass: 'ring-2 ring-yellow-100',
          isLegendary: true,
          isPlatinum: false,
        };
      default:
        return {
          wrapperClass: 'bg-[#b9e7ff] dark:bg-zinc-700',
          innerRingClass: '',
          isLegendary: false,
          isPlatinum: false,
        };
    }
  };

  const frame = getFrameStyle();

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${s.outer} ${className}`}>
      {/* Animated rotating ring for Tier 5 Sparkling Gold */}
      {frame.isLegendary ? (
        <div className="absolute inset-0 rounded-full unidoc-frame-legendary-ring" />
      ) : null}

      <div
        className={`relative w-full h-full rounded-full ${s.pad} ${
          frame.isLegendary ? 'unidoc-frame-legendary-aura' : frame.wrapperClass
        }`}
      >
        <div className={`w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900 ${frame.innerRingClass}`}>
          {src && !hasError ? (
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={onError}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-[#4086ee] text-white flex items-center justify-center font-black ${s.text}`}
            >
              {fallbackText}
            </div>
          )}
        </div>
      </div>

      {/* Sparkling stars / glow accents for Tier 4 & Tier 5 */}
      {frame.isPlatinum && (
        <span
          aria-hidden="true"
          className={`absolute ${s.sparkle} pointer-events-none select-none drop-shadow unidoc-sparkle-twinkle`}
        >
          ✦
        </span>
      )}
      {frame.isLegendary && (
        <>
          <span
            aria-hidden="true"
            className={`absolute ${s.sparkle} text-amber-300 pointer-events-none select-none drop-shadow unidoc-sparkle-twinkle`}
          >
            ✨
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -left-1 text-[10px] text-yellow-200 pointer-events-none select-none drop-shadow unidoc-sparkle-twinkle"
          >
            ✦
          </span>
        </>
      )}
    </div>
  );
};
