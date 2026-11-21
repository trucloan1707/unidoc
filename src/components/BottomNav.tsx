import React from 'react';
import { Home, Plus, Heart, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'favorites' | 'profile';
  onNavigateHome: () => void;
  onNavigateFavorites: () => void;
  onNavigateProfile: () => void;
  onOpenPostBook: () => void;
  favoritesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigateHome,
  onNavigateFavorites,
  onNavigateProfile,
  onOpenPostBook,
  favoritesCount = 0,
}) => {
  return (
    /* Thanh trắng cố định với bốn mục chia đều: Trang chủ, Đăng bài (+), Yêu thích, Cá nhân */
    <nav className="fixed bottom-0 inset-x-0 w-full z-50 bg-white dark:bg-black border-t border-[#b9e7ff] dark:border-zinc-800 shadow-[0_-4px_20px_rgba(64,134,238,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.85)] transition-colors">
      <div className="max-w-2xl mx-auto px-2 sm:px-6 py-1.5 grid grid-cols-4 items-center">
        {/* 1. Trang chủ — icon xám xanh */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer group ${
            currentTab === 'home'
              ? 'text-[#4086ee] dark:text-sky-400 font-bold'
              : 'text-[#5b728f] dark:text-white hover:text-[#4086ee] dark:hover:text-sky-300 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              currentTab === 'home'
                ? 'bg-[#edf8fe] dark:bg-sky-500/20'
                : 'group-hover:bg-[#edf8fe] dark:group-hover:bg-zinc-900'
            }`}
          >
            <Home
              className={`w-5 h-5 ${
                currentTab === 'home'
                  ? 'text-[#4086ee] dark:text-sky-400 stroke-[2.4]'
                  : 'text-[#5b728f] dark:text-white stroke-2'
              }`}
            />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
            Trang chủ
          </span>
        </button>

        {/* 2. Đăng bài — nút cộng tròn xanh, nhãn bên dưới */}
        <div className="flex flex-col items-center justify-center py-0.5">
          <button
            type="button"
            onClick={onOpenPostBook}
            title="Đăng bài bán sách hoặc tài liệu"
            aria-label="Đăng bài"
            className="group w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#4086ee] hover:bg-[#0860c9] text-white flex items-center justify-center shadow-md shadow-[#4086ee]/30 border-2 border-white dark:border-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.8] text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>
          <span className="text-[11px] font-bold text-[#0860c9] dark:text-white mt-0.5 whitespace-nowrap">
            Đăng bài
          </span>
        </div>

        {/* 3. Yêu thích — icon trái tim xám xanh */}
        <button
          type="button"
          onClick={onNavigateFavorites}
          className={`flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer group ${
            currentTab === 'favorites'
              ? 'text-[#4086ee] dark:text-sky-400 font-bold'
              : 'text-[#5b728f] dark:text-white hover:text-[#4086ee] dark:hover:text-sky-300 font-medium'
          }`}
        >
          <div
            className={`relative p-1 rounded-xl transition-colors ${
              currentTab === 'favorites'
                ? 'bg-[#edf8fe] dark:bg-sky-500/20'
                : 'group-hover:bg-[#edf8fe] dark:group-hover:bg-zinc-900'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                currentTab === 'favorites'
                  ? 'fill-[#4086ee] text-[#4086ee] dark:fill-sky-400 dark:text-sky-400 stroke-[2.2]'
                  : 'text-[#5b728f] dark:text-white stroke-2'
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#4086ee] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs tabular-nums">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
            Yêu thích
          </span>
        </button>

        {/* 4. Cá nhân — icon người dùng màu xanh khi được chọn */}
        <button
          type="button"
          onClick={onNavigateProfile}
          className={`flex flex-col items-center justify-center py-1 min-h-[48px] transition-colors cursor-pointer group ${
            currentTab === 'profile'
              ? 'text-[#4086ee] dark:text-sky-400 font-bold'
              : 'text-[#5b728f] dark:text-white hover:text-[#4086ee] dark:hover:text-sky-300 font-medium'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              currentTab === 'profile'
                ? 'bg-[#edf8fe] dark:bg-sky-500/20'
                : 'group-hover:bg-[#edf8fe] dark:group-hover:bg-zinc-900'
            }`}
          >
            <User
              className={`w-5 h-5 ${
                currentTab === 'profile'
                  ? 'fill-[#4086ee]/15 text-[#4086ee] dark:text-sky-400 stroke-[2.4]'
                  : 'text-[#5b728f] dark:text-white stroke-2'
              }`}
            />
          </div>
          <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
            Cá nhân
          </span>
        </button>
      </div>
    </nav>
  );
};
