import React from 'react';
import { PlusCircle, BookOpen, Sparkles, Award, Flame } from 'lucide-react';

interface CenteredPostBarProps {
  onOpenPostModal: () => void;
  onOpenTitlesGuide: () => void;
  onQuickFilter50k: () => void;
  activeFilter?: string;
  totalBooksCount?: number;
}

export const CenteredPostBar: React.FC<CenteredPostBarProps> = ({
  onOpenPostModal,
  onOpenTitlesGuide,
  onQuickFilter50k,
  activeFilter,
  totalBooksCount = 8,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-4 px-3 sm:px-4">
      {/* Centralized Post & Quick Action Deck */}
      <div className="relative bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 rounded-2xl p-3 sm:p-4 shadow-xl shadow-blue-500/15 border border-sky-400/40 text-white overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-44 h-44 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3.5">
          {/* Left mini highlight */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md items-center justify-center border border-white/20 shrink-0 shadow-inner">
              <BookOpen className="w-6 h-6 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400 text-slate-900 shadow-xs">
                  Sàn Sinh Viên 100%
                </span>
                <span className="text-xs text-blue-100 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
                  {totalBooksCount} sách sẵn sàng sang tay
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight mt-0.5 text-white">
                Thi xong rồi? Pass sách kiếm tiền trà sữa ngay!
              </h3>
            </div>
          </div>

          {/* THE CENTER MAIN POST BUTTON ("Thanh công cụ đăng bài nằm ở chính giữa") */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-center">
            <button
              onClick={onOpenPostModal}
              className="group relative flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-amber-200/60 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
              <span>+ ĐĂNG BÁN SÁCH NGAY</span>
              <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 bg-slate-950/15 rounded-md">
                30s
              </span>
            </button>

            {/* Quick action: Danh hiệu guide */}
            <button
              onClick={onOpenTitlesGuide}
              title="Khám phá hệ thống danh hiệu sinh viên cho Người Bán & Người Mua"
              className="inline-flex items-center gap-1.5 px-3.5 py-3.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/25 transition-all duration-200 backdrop-blur-md cursor-pointer shrink-0"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Danh Hiệu</span>
            </button>
          </div>
        </div>

        {/* Quick shortcut pills under the bar */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-blue-100 flex-wrap">
            <span className="font-semibold text-yellow-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Gợi ý nhanh:
            </span>
            <button
              onClick={onQuickFilter50k}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'under_50k'
                  ? 'bg-yellow-400 text-slate-900 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Sách dưới 50.000đ ⚡
            </button>
            <button
              onClick={() => {}}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              Nhận trực tiếp tại KTX / Canteen 📍
            </button>
            <button
              onClick={onOpenTitlesGuide}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer hidden md:inline-flex items-center gap-1"
            >
              Hạng 5: "Huyền Thoại Tàng Kinh Các" 👑
            </button>
          </div>
          <div className="text-[11px] text-blue-200/90 ml-auto hidden sm:block">
            Bảo mật sinh viên & Đánh giá ẩn danh
          </div>
        </div>
      </div>
    </div>
  );
};
