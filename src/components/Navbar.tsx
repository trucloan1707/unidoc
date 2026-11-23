import React, { useState, useRef, useEffect } from 'react';
import { UniDocLogo } from './UniDocLogo';
import {
  Search,
  ShoppingCart,
  MessageCircle,
  Building2,
  GraduationCap,
  ShieldCheck,
  Store,
  X,
  Award,
  ChevronDown,
  Sun,
  Moon,
  Check,
  Bell,
  Heart,
  LogIn,
  UserPlus,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';
import { University } from '../types';
import { MAJORS_LIST } from '../data/mockData';

interface NavbarProps {
  universities: University[];
  selectedUniversityId: string;
  onSelectUniversity: (id: string) => void;
  selectedMajor: string;
  onSelectMajor: (major: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenTitlesGuide: () => void;
  onOpenSellerDashboard: () => void;
  onOpenVerificationModal: () => void;
  onOpenAdminPanel: () => void;
  currentNavTab?: 'home' | 'favorites' | 'profile';
  onNavigateTab?: (tab: 'home' | 'favorites' | 'profile') => void;
  unreadMessagesCount?: number;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  favoritesCount?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  universities,
  selectedUniversityId,
  onSelectUniversity,
  selectedMajor,
  onSelectMajor,
  searchQuery,
  onSearchChange,
  maxPrice,
  onMaxPriceChange,
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenTitlesGuide,
  onOpenSellerDashboard,
  onOpenVerificationModal,
  onOpenAdminPanel,
  currentNavTab,
  onNavigateTab,
  unreadMessagesCount = 2,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  favoritesCount = 0,
  darkMode = false,
  onToggleDarkMode,
  onOpenLogin,
  onOpenRegister,
  isLoggedIn = false,
  isAdmin = false,
}) => {
  // Searchable university popover state
  const [isUniOpen, setIsUniOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState('');
  const uniRef = useRef<HTMLDivElement>(null);

  // Searchable major popover state
  const [isMajorOpen, setIsMajorOpen] = useState(false);
  const [majorSearch, setMajorSearch] = useState('');
  const majorRef = useRef<HTMLDivElement>(null);

  // Price range slider popover state (0 - 200k)
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uniRef.current && !uniRef.current.contains(event.target as Node)) {
        setIsUniOpen(false);
      }
      if (majorRef.current && !majorRef.current.contains(event.target as Node)) {
        setIsMajorOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setIsPriceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPriceCompact = (val: number) => {
    if (val === 0) return '0đ';
    return `${Math.round(val / 1000)}k`;
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  const selectedUni = universities.find((u) => u.id === selectedUniversityId);

  // Filter universities dynamically by user typing
  const filteredUniversities = universities.filter((u) => {
    if (!uniSearch.trim()) return true;
    const q = uniSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );
  });

  // Filter majors dynamically by user typing
  const filteredMajors = MAJORS_LIST.filter((m) => {
    if (m === 'Tất cả ngành học') return true;
    if (!majorSearch.trim()) return true;
    return m.toLowerCase().includes(majorSearch.toLowerCase());
  });

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-black border-b border-slate-200/90 dark:border-zinc-800 shadow-xs transition-colors">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 text-white text-[11px] sm:text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
            <span className="font-semibold text-sky-100 truncate">
              UniDoc — Tài liệu chuẩn, học tập dễ dàng hơn!
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-sky-100 shrink-0">
            <div className="hidden md:flex items-center gap-4">
              {/* "Chuyển bảng danh hiệu hài hước thành Danh hiệu" */}
              <button
                onClick={onOpenTitlesGuide}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Danh hiệu</span>
              </button>
              <button
                onClick={onOpenVerificationModal}
                className="hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Xác thực MSSV</span>
              </button>
              <button
                onClick={onOpenAdminPanel}
                title={isAdmin ? 'Mở Bảng Quản Trị UniDoc' : 'Chỉ dành cho Quản trị viên UniDoc'}
                className="hover:text-white transition-colors cursor-pointer text-sky-200 text-xs inline-flex items-center gap-1"
              >
                {!isAdmin && <Lock className="w-3 h-3 text-sky-300/80" />}
                <span>Quản trị UniDoc</span>
              </button>
            </div>

            {!isLoggedIn && (onOpenLogin || onOpenRegister) && (
              <div className="flex items-center gap-2 md:pl-3 md:border-l md:border-white/25">
                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="hover:text-amber-300 transition-colors cursor-pointer font-bold text-white"
                  >
                    Đăng nhập
                  </button>
                )}
                {onOpenLogin && onOpenRegister && <span className="text-sky-200/70">|</span>}
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="hover:text-amber-300 transition-colors cursor-pointer font-bold text-sky-100"
                  >
                    Đăng ký
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2.5 md:gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('home');
              onSelectUniversity('all');
              onSelectMajor('all');
              onSearchChange('');
            }}
            className="cursor-pointer focus:outline-hidden shrink-0"
          >
            <UniDocLogo size="md" variant={darkMode ? 'dark' : 'light'} />
          </button>

          {/* ADVANCED SEARCH BAR + GIỎ HÀNG KẾ BÊN THANH TÌM KIẾM */}
          <div className="flex-1 max-w-3xl flex items-center gap-2 sm:gap-3">
            {/* Search container with interactive searchable dropdowns */}
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-100 dark:bg-zinc-900 focus-within:bg-white dark:focus-within:bg-zinc-900 border border-slate-200 dark:border-zinc-700 focus-within:border-sky-500 rounded-2xl p-1 gap-1 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all shadow-xs relative">
              {/* 1. TÌM KIẾM & LỌC THEO TRƯỜNG ĐẠI HỌC (Interactive Searchable Combobox) */}
              <div className="relative shrink-0" ref={uniRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsUniOpen(!isUniOpen);
                    setIsMajorOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 sm:bg-transparent sm:dark:bg-transparent rounded-xl border sm:border-0 border-slate-200 dark:border-zinc-700 text-xs text-left cursor-pointer transition-colors w-full sm:w-auto"
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-300 hidden xl:inline">Trường:</span>
                  <span className="font-bold text-slate-800 dark:text-white truncate max-w-[125px]">
                    {selectedUni ? selectedUni.shortName : 'Tất cả trường'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-300 shrink-0 ml-0.5" />
                </button>

                {/* University Searchable Dropdown Popover */}
                {isUniOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Tìm tên trường (ví dụ Bách Khoa, UEH, Y Dược...)"
                        value={uniSearch}
                        onChange={(e) => setUniSearch(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-transparent focus:border-sky-500 focus:outline-hidden"
                      />
                      {uniSearch && (
                        <button
                          type="button"
                          onClick={() => setUniSearch('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1">
                      {filteredUniversities.length} trường đại học phù hợp
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectUniversity('all');
                          setIsUniOpen(false);
                          setUniSearch('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedUniversityId === 'all'
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-white'
                        }`}
                      >
                        <span>Toàn bộ trường đại học trên cả nước</span>
                        {selectedUniversityId === 'all' && (
                          <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        )}
                      </button>

                      {filteredUniversities.map((uni) => (
                        <button
                          key={uni.id}
                          type="button"
                          onClick={() => {
                            onSelectUniversity(uni.id);
                            setIsUniOpen(false);
                            setUniSearch('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            selectedUniversityId === uni.id
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-white'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold truncate text-slate-900 dark:text-white">
                              {uni.shortName}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                              {uni.name} ({uni.city})
                            </div>
                          </div>
                          {selectedUniversityId === uni.id && (
                            <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block w-px h-5 bg-slate-300 dark:bg-zinc-700 shrink-0" />

              {/* 2. TÌM KIẾM & LỌC THEO NGÀNH HỌC (Interactive Searchable Combobox) */}
              <div className="relative shrink-0" ref={majorRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsMajorOpen(!isMajorOpen);
                    setIsUniOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 sm:bg-transparent sm:dark:bg-transparent rounded-xl border sm:border-0 border-slate-200 dark:border-zinc-700 text-xs text-left cursor-pointer transition-colors w-full sm:w-auto"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-300 hidden xl:inline">Ngành:</span>
                  <span className="font-bold text-slate-800 dark:text-white truncate max-w-[125px]">
                    {selectedMajor === 'all' ? 'Tất cả ngành' : selectedMajor}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-300 shrink-0 ml-0.5" />
                </button>

                {/* Major Searchable Dropdown Popover */}
                {isMajorOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-2.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Tìm tên ngành (ví dụ CNTT, Y khoa, Kinh tế...)"
                        value={majorSearch}
                        onChange={(e) => setMajorSearch(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 border border-transparent focus:border-sky-500 focus:outline-hidden"
                      />
                      {majorSearch && (
                        <button
                          type="button"
                          onClick={() => setMajorSearch('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-0.5">
                      {filteredMajors.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            onSelectMajor(m === 'Tất cả ngành học' ? 'all' : m);
                            setIsMajorOpen(false);
                            setMajorSearch('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            (m === 'Tất cả ngành học' && selectedMajor === 'all') || selectedMajor === m
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-white'
                          }`}
                        >
                          <span className="truncate">{m}</span>
                          {((m === 'Tất cả ngành học' && selectedMajor === 'all') ||
                            selectedMajor === m) && (
                            <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block w-px h-5 bg-slate-300 dark:bg-zinc-700 shrink-0" />

              {/* 3. LỌC THEO GIÁ KÉO TỪ 0 ĐẾN 200K */}
              <div className="relative shrink-0" ref={priceRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsPriceOpen(!isPriceOpen);
                    setIsUniOpen(false);
                    setIsMajorOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border sm:border-0 text-xs text-left cursor-pointer transition-colors w-full sm:w-auto ${
                    maxPrice < 200000
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 text-sky-700 dark:text-sky-300'
                      : 'bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 sm:bg-transparent sm:dark:bg-transparent border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#4086ee] dark:text-sky-400 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-white whitespace-nowrap">
                    {maxPrice < 200000 ? `0–${formatPriceCompact(maxPrice)}` : 'Giá 0–200k'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-300 shrink-0" />
                </button>

                {isPriceOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-4 z-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Lọc theo giá (0 – 200k)
                      </span>
                      <span className="text-xs font-extrabold text-[#4086ee] dark:text-sky-400">
                        0đ – {formatVND(maxPrice)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <input
                        type="range"
                        min={0}
                        max={200000}
                        step={5000}
                        value={maxPrice}
                        onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                        aria-label="Kéo chọn mức giá tối đa từ 0 đến 200k"
                        className="w-full accent-[#4086ee] cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-zinc-400">
                        <span>0đ</span>
                        <span>50k</span>
                        <span>100k</span>
                        <span>150k</span>
                        <span>200k</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100 dark:border-zinc-800">
                      {[
                        { label: '≤ 30k', value: 30000 },
                        { label: '≤ 50k', value: 50000 },
                        { label: '≤ 100k', value: 100000 },
                        { label: 'Tất cả (0–200k)', value: 200000 },
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => onMaxPriceChange(preset.value)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                            maxPrice === preset.value
                              ? 'bg-[#4086ee] text-white border-[#4086ee]'
                              : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-sky-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block w-px h-5 bg-slate-300 dark:bg-zinc-700 shrink-0" />

              {/* 4. Keyword Search Input */}
              <div className="relative flex-1 flex items-center min-w-[130px]">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 absolute left-2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm tên sách, tác giả, môn học..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-7 pr-6 py-1.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* GIỎ HÀNG KẾ BÊN THANH TÌM KIẾM */}
            <button
              onClick={onOpenCart}
              title="Giỏ hàng giáo trình"
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/20 active:scale-95 transition-all cursor-pointer shrink-0 border border-amber-300"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Giỏ hàng</span>
            </button>
          </div>

          {/* Right Utilities (Theme Sáng/Tối, Tin nhắn & Thẻ sinh viên) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Chế độ nền Sáng / Tối (Light/Dark Toggle) */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                title={darkMode ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
                className="p-2.5 rounded-xl text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                )}
              </button>
            )}

            {/* Favorites button (Yêu thích - icon trái tim) */}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('favorites')}
                title="Danh sách yêu thích"
                aria-label="Mở danh sách yêu thích"
                className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
                  currentNavTab === 'favorites'
                    ? 'bg-[#edf8fe] dark:bg-sky-500/20 text-[#4086ee] dark:text-sky-400'
                    : 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    currentNavTab === 'favorites'
                      ? 'fill-[#4086ee] text-[#4086ee] dark:fill-sky-400 dark:text-sky-400'
                      : ''
                  }`}
                />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#4086ee] text-white text-[10px] font-black flex items-center justify-center tabular-nums">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification button */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                title="Thông báo đơn hàng & danh hiệu"
                className="relative p-2.5 rounded-xl text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700 sm:border-transparent flex"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Chat button */}
            <button
              onClick={onOpenChat}
              title="Tin nhắn trao đổi sách"
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700 sm:border-transparent"
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Seller Hub shortcut */}
            <button
              onClick={onOpenSellerDashboard}
              title="Quản lý tin đăng & Tồn kho người bán"
              className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Kênh Người Bán</span>
            </button>

            {/* Mobile Admin shortcut (strictly visible only to authorized Admin) */}
            {isLoggedIn && isAdmin && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                title="Quản trị UniDoc"
                className="md:hidden inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#edf8fe] dark:bg-sky-950 border border-[#b9e7ff] dark:border-sky-800 text-[#0860c9] dark:text-sky-300 text-xs font-bold cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quản trị</span>
              </button>
            )}

            {/* Show Login / Register ONLY when NOT logged in; hide completely after login */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </button>
                )}
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 hover:bg-[#dceeff] dark:hover:bg-zinc-800 border border-[#b9e7ff] dark:border-zinc-700 text-[#0860c9] dark:text-sky-400 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Đăng ký</span>
                  </button>
                )}
              </div>
            ) : (
              /* Student Verified Profile Badge (only visible when logged in) */
              <button
                onClick={onOpenVerificationModal}
                title="Hồ sơ sinh viên đã xác thực"
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-white transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                  SV
                </div>
                <div className="hidden xl:flex flex-col text-left leading-tight">
                  <span className="text-[11px] font-bold">2010***</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Đã xác thực
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
