import React from 'react';
import { UNIDOC_RANK_BADGES } from '../data/mockData';
import { HumorousBadge } from './HumorousBadge';
import { RankAvatar, getRankBadgeForCount, getNextRankBadgeForCount } from './RankAvatar';
import { X, Trophy, Sparkles, CheckCircle2, Crown, Award } from 'lucide-react';

interface HumorousTitlesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSalesCount?: number;
  userBuyCount?: number;
  userAvatar?: string;
  userName?: string;
}

export const HumorousTitlesGuideModal: React.FC<HumorousTitlesGuideModalProps> = ({
  isOpen,
  onClose,
  userSalesCount = 0,
  userBuyCount = 0,
  userAvatar,
  userName = 'Sinh viên UniDoc',
}) => {
  if (!isOpen) return null;

  const totalBooksCount = userSalesCount + userBuyCount;
  const currentBadge = getRankBadgeForCount(totalBooksCount);
  const nextBadge = getNextRankBadgeForCount(totalBooksCount);
  const progressPercent =
    totalBooksCount === 0
      ? 0
      : nextBadge
      ? Math.min(100, Math.round((totalBooksCount / nextBadge.minThreshold) * 100))
      : 100;
  const remainingCount = nextBadge ? Math.max(0, nextBadge.minThreshold - totalBooksCount) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                Hệ Thống Danh Hiệu UniDoc
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Tích lũy sách & tài liệu từ <b>Hạng 1 – Sứ Giả Sách Mới</b> đến <b>Hạng 5 – Huyền Thoại Tàng Kinh Các</b>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Current Tier Status Card */}
        <div className="p-6 bg-gradient-to-r from-sky-900 via-blue-950 to-slate-900 text-white border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <RankAvatar
                src={userAvatar}
                alt={userName}
                tier={currentBadge?.tier ?? 0}
                size="md"
                fallbackText={userName.slice(0, 2).toUpperCase()}
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Thành tích UniDoc của bạn
                </span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {currentBadge
                      ? `Hạng ${currentBadge.tier} – ${currentBadge.name}`
                      : 'Chưa có danh hiệu'}
                  </h3>
                  <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-slate-200">
                    {totalBooksCount > 0
                      ? `${totalBooksCount} sách/tài liệu`
                      : 'Chưa có hoạt động'}
                  </span>
                </div>
                {currentBadge?.avatarFrameLabel && (
                  <p className="text-[11px] text-sky-200 mt-1">
                    Đang trang bị: <b>{currentBadge.avatarFrameLabel}</b>
                  </p>
                )}
              </div>
            </div>

            {/* Quick stats & progress to next tier */}
            <div className="w-full sm:w-64 bg-white/10 rounded-xl p-3 border border-white/15 shrink-0">
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Tiến độ thăng hạng:</span>
                <span className="text-amber-300">
                  {totalBooksCount === 0
                    ? 'Chưa bắt đầu'
                    : nextBadge
                    ? `${totalBooksCount}/${nextBadge.minThreshold} cuốn (${progressPercent}%)`
                    : 'Đã đạt Hạng tối đa'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-300 mt-1 italic">
                {totalBooksCount === 0
                  ? 'Hãy mua hàng hoặc đăng bán sách ngay để tích điểm uy tín và mở khóa Hạng 1 – Sứ Giả Sách Mới!'
                  : nextBadge
                  ? `Cần thêm ${remainingCount} sách/tài liệu để lên Hạng ${nextBadge.tier} – ${nextBadge.name}!`
                  : 'Chúc mừng! Bạn đã đạt Hạng 5 và được vinh danh vĩnh viễn trên Bảng Vàng UniDoc!'}
              </p>
            </div>
          </div>
        </div>

        {/* Tier list (5 Tiers) */}
        <div className="p-5 sm:p-6 space-y-4">
          {UNIDOC_RANK_BADGES.map((badge) => {
            const isUnlocked = totalBooksCount >= badge.minThreshold;
            const isLegendary = badge.tier === 5;
            const isPlatinum = badge.tier === 4;

            return (
              <div
                key={badge.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isLegendary
                    ? isUnlocked
                      ? 'bg-gradient-to-br from-amber-50 via-yellow-50/70 to-orange-50 dark:from-amber-950/30 dark:via-zinc-900 dark:to-orange-950/25 border-amber-400 shadow-lg shadow-amber-500/15'
                      : 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 dark:from-zinc-900/90 dark:to-zinc-950 border-amber-300/80 dark:border-amber-700/60'
                    : isPlatinum
                    ? 'bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/50 dark:from-sky-950/25 dark:via-zinc-900 dark:to-zinc-950 border-cyan-300 dark:border-cyan-700/70 shadow-xs'
                    : isUnlocked
                    ? 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-zinc-900/50 border-dashed border-slate-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Live preview of the Rank Avatar Frame */}
                    <RankAvatar
                      src={userAvatar}
                      alt={`Khung ${badge.name}`}
                      tier={badge.tier}
                      size="sm"
                      fallbackText={badge.icon}
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200">
                          Hạng {badge.tier}
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {badge.name}
                        </h4>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            ✓ Đã mở khóa
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                            Chưa mở khóa
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-[#0860c9] dark:text-sky-400 mt-0.5">
                        {badge.milestoneLabel || badge.description}
                      </p>
                    </div>
                  </div>

                  <HumorousBadge badge={badge} size="sm" interactive={false} />
                </div>

                {/* Perks list */}
                <div
                  className={`mt-3.5 p-3 rounded-xl border space-y-1.5 ${
                    isLegendary
                      ? 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-700/60'
                      : isPlatinum
                      ? 'bg-sky-100/50 dark:bg-sky-950/35 border-cyan-200 dark:border-cyan-800/60'
                      : 'bg-amber-50/70 dark:bg-zinc-950/80 border-amber-200/60 dark:border-zinc-800'
                  }`}
                >
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    {isLegendary ? (
                      <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>
                      {badge.tier === 2 ? 'Đặc quyền sinh viên:' : 'Đặc quyền:'}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-800 dark:text-zinc-200 font-medium">
                    {(badge.perks || [badge.perk]).map((perkItem, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perkItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
