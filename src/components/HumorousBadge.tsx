import React, { useState } from 'react';
import { HumorousBadgeInfo } from '../types';
import { Sparkles, Trophy, Info } from 'lucide-react';

interface HumorousBadgeProps {
  badge: HumorousBadgeInfo;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showPerk?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

export const HumorousBadge: React.FC<HumorousBadgeProps> = ({
  badge,
  size = 'sm',
  showPerk = false,
  onClick,
  interactive = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-bold',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center font-bold rounded-full border shadow-xs transition-all duration-200 ${
          sizeClasses[size]
        } ${badge.badgeColor} ${
          interactive ? 'hover:scale-105 hover:shadow-md cursor-pointer' : 'cursor-default'
        } ${badge.tier === 5 ? 'ring-2 ring-amber-400 ring-offset-1 animate-pulse' : ''}`}
      >
        <span className="text-sm leading-none drop-shadow-xs">{badge.icon}</span>
        <span className="truncate max-w-[170px]">{badge.name}</span>
        {badge.tier >= 4 && <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />}
      </button>

      {/* Interactive Tooltip Card for Humorous Badge */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700 text-xs pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{badge.icon}</span>
              <span className="font-bold text-amber-300">{badge.name}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">
              Tier {badge.tier}/5 ({badge.category === 'seller' ? 'Người bán' : 'Người mua'})
            </span>
          </div>

          <p className="text-slate-300 italic mb-2 leading-relaxed">
            {badge.funnyQuote}
          </p>

          <div className="bg-slate-800/80 rounded-lg p-2 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Yêu cầu:</span>
              <span className="text-emerald-400 font-medium">{badge.description}</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-amber-300 pt-1 border-t border-slate-700/50">
              <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
              <span>{badge.perk}</span>
            </div>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};
