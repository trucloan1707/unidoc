import React, { useState } from 'react';
import { HUMOROUS_SELLER_BADGES, HUMOROUS_BUYER_BADGES } from '../data/mockData';
import { HumorousBadge } from './HumorousBadge';
import { X, Trophy, Sparkles, Zap } from 'lucide-react';

interface HumorousTitlesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSalesCount?: number;
  userBuyCount?: number;
}

export const HumorousTitlesGuideModal: React.FC<HumorousTitlesGuideModalProps> = ({
  isOpen,
  onClose,
  userSalesCount = 5,
  userBuyCount = 6,
}) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');

  if (!isOpen) return null;

  const currentBadges = activeTab === 'seller' ? HUMOROUS_SELLER_BADGES : HUMOROUS_BUYER_BADGES;
  const currentCount = activeTab === 'seller' ? userSalesCount : userBuyCount;

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
                Thăng hạng từ <b>Tân Binh</b> lên <b>Chiến Thần</b> & <b>Trùm Sách</b> để nhận đặc quyền bá đạo!
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
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Thành tích sinh viên của bạn
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <h3 className="text-lg font-black text-white">
                  {activeTab === 'seller' ? 'Chiến Thần Pass Sách K70' : 'Thần Đồng Ôn Thi Giờ Chót'}
                </h3>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-slate-300">
                  {currentCount} {activeTab === 'seller' ? 'sách đã pass' : 'sách đã tậu'}
                </span>
              </div>
            </div>

            {/* Quick stats & progress to next tier */}
            <div className="w-full sm:w-60 bg-white/10 rounded-xl p-3 border border-white/15">
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Tiến độ thăng hạng:</span>
                <span className="text-amber-300">
                  {activeTab === 'seller' ? '5/6 cuốn (83%)' : '6/10 cuốn (60%)'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  style={{ width: activeTab === 'seller' ? '83%' : '60%' }}
                />
              </div>
              <p className="text-[10px] text-slate-300 mt-1 italic">
                {activeTab === 'seller'
                  ? 'Chỉ cần pass thêm 1 cuốn để lên Tier 2!'
                  : 'Cần tậu thêm 4 cuốn để mở khóa Tier 3!'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-6 pt-3">
          <button
            onClick={() => setActiveTab('seller')}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'seller'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-black'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <span>Danh Hiệu Người Bán (Pass Sách)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-extrabold">
              5 Hạng
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buyer')}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'buyer'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <span>Danh Hiệu Người Mua (Săn Tri Thức)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold">
              5 Hạng
            </span>
          </button>
        </div>

        {/* Tier list */}
        <div className="p-6 space-y-4">
          {currentBadges.map((badge) => {
            const isUnlocked = currentCount >= badge.minThreshold;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-xs hover:shadow-md'
                    : 'bg-slate-50/70 dark:bg-zinc-900/50 border-dashed border-slate-200 dark:border-zinc-800 opacity-80'
                }`}
              >
                {/* Tier Number Pill */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {badge.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200">
                          Tier {badge.tier}/5
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">{badge.name}</h4>
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

                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{badge.description}</p>
                    </div>
                  </div>

                  <HumorousBadge badge={badge} size="sm" interactive={false} />
                </div>

                {/* Funny Quote */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 text-xs italic text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800">
                  {badge.funnyQuote}
                </div>

                {/* Perk */}
                <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-800/50">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Đặc quyền sinh viên: <b>{badge.perk}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
