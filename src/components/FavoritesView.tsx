import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import { UniDocLogo } from './UniDocLogo';
import {
  Heart,
  Search,
  ArrowUpDown,
  ShoppingCart,
  Star,
  GraduationCap,
  BookOpen,
  X,
  ArrowLeft,
} from 'lucide-react';

interface FavoritesViewProps {
  favoriteBooks: Book[];
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book, e?: React.MouseEvent) => void;
  onRemoveFavorite: (bookId: string, e?: React.MouseEvent) => void;
  onExploreDocuments: () => void;
}

type TypeFilter = 'all' | 'book' | 'digital';
type SortOption = 'recent' | 'price_asc' | 'price_desc' | 'newest';

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

/* Cute File Illustration (PDF / DOC / XLS) matching UniDoc ice-blue & academic theme */
const DigitalFileIllustration: React.FC<{
  format?: 'PDF' | 'DOC' | 'XLS';
  title: string;
}> = ({ format = 'PDF', title }) => {
  const palette = {
    PDF: {
      accent: '#e11d48',
      softBg: 'bg-rose-50 dark:bg-rose-950/40',
      badgeBg: 'bg-[#ef4444]',
      border: 'border-rose-200 dark:border-rose-900/60',
      subtitle: 'Tài liệu PDF',
    },
    DOC: {
      accent: '#4086ee',
      softBg: 'bg-sky-50 dark:bg-sky-950/40',
      badgeBg: 'bg-[#4086ee]',
      border: 'border-[#b9e7ff] dark:border-sky-900/60',
      subtitle: 'Tài liệu Word',
    },
    XLS: {
      accent: '#10b981',
      softBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badgeBg: 'bg-[#10b981]',
      border: 'border-emerald-200 dark:border-emerald-900/60',
      subtitle: 'Bảng tính Excel',
    },
  }[format];

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-4 ${palette.softBg} select-none relative overflow-hidden`}
    >
      {/* Subtle decorative rings */}
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#b9e7ff]/35 dark:bg-sky-500/10 pointer-events-none" />
      <div className="absolute -top-8 -right-6 w-24 h-24 rounded-full bg-white/60 dark:bg-zinc-800/40 pointer-events-none" />

      {/* Crisp SVG Paper Sheet */}
      <div
        className={`relative z-10 w-24 h-28 rounded-2xl bg-white dark:bg-zinc-900 border-2 ${palette.border} shadow-md flex flex-col justify-between p-2.5`}
      >
        {/* Folded corner effect */}
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider text-white ${palette.badgeBg}`}
          >
            {format}
          </span>
          <div className="w-3 h-3 rounded-tr-md bg-[#edf8fe] dark:bg-zinc-800 border-b border-l border-[#b9e7ff] dark:border-zinc-700" />
        </div>

        {/* Simulated document lines or mini spreadsheet grid */}
        {format === 'XLS' ? (
          <div className="grid grid-cols-3 gap-1 my-auto">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-xs ${
                  idx < 3
                    ? 'bg-emerald-400/70 dark:bg-emerald-500/50'
                    : 'bg-emerald-100 dark:bg-zinc-800'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1.5 my-auto">
            <div className="h-1.5 w-full rounded-full bg-[#b9e7ff] dark:bg-zinc-700" />
            <div className="h-1.5 w-4/5 rounded-full bg-slate-200 dark:bg-zinc-800" />
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-800" />
            <div className="h-1.5 w-3/5 rounded-full bg-[#b9e7ff]/80 dark:bg-zinc-700" />
          </div>
        )}

        <div className="text-[9px] font-bold text-[#5b728f] dark:text-zinc-400 truncate text-center">
          {palette.subtitle}
        </div>
      </div>

      <span className="sr-only">{title}</span>
    </div>
  );
};

/* Styled Academic Textbook Cover Fallback (when book has no photo or fails to load) */
const TextbookCoverFallback: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#edf8fe] via-[#dbeeff] to-[#c7e6ff] dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4 relative overflow-hidden select-none">
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/50 dark:bg-sky-500/10 pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#4086ee]/15 pointer-events-none" />

      {/* Standing mini textbook cover */}
      <div className="relative z-10 w-24 h-32 rounded-r-xl rounded-l-sm bg-gradient-to-b from-[#4086ee] to-[#0860c9] shadow-lg border-l-4 border-[#054594] p-2.5 flex flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider text-sky-100">
            {book.subjectCode || 'UNIDOC'}
          </span>
          <BookOpen className="w-3 h-3 text-sky-200" />
        </div>

        <div className="my-auto">
          <div className="text-[11px] font-black leading-tight line-clamp-3">
            {book.title}
          </div>
        </div>

        <div className="pt-1 border-t border-white/20 text-[8px] font-semibold text-sky-100 truncate">
          {book.universityName}
        </div>
      </div>
    </div>
  );
};

/* Cute Academic Empty State Illustration: blue heart + small stack of books + paper sheet + checkmark */
const EmptyFavoritesIllustration: React.FC = () => (
  <svg
    viewBox="0 0 240 190"
    className="w-52 h-40 sm:w-60 sm:h-44 mx-auto"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Soft ice-blue halo */}
    <ellipse cx="120" cy="156" rx="86" ry="14" fill="#d4efff" className="dark:opacity-20" />
    <circle cx="120" cy="86" r="68" fill="#ffffff" stroke="#b9e7ff" strokeWidth="2" className="dark:fill-zinc-900 dark:stroke-zinc-800" />

    {/* Stack of small books (left-bottom) */}
    <g>
      {/* Bottom book */}
      <rect x="44" y="128" width="70" height="18" rx="4" fill="#4086ee" />
      <rect x="48" y="131" width="58" height="12" rx="2" fill="#ffffff" fillOpacity="0.22" />
      <rect x="44" y="128" width="10" height="18" rx="2" fill="#0860c9" />
      {/* Middle book */}
      <rect x="50" y="110" width="64" height="18" rx="4" fill="#7ec8ff" />
      <rect x="50" y="110" width="10" height="18" rx="2" fill="#4086ee" />
      <line x1="66" y1="119" x2="104" y2="119" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top angled small book */}
      <rect x="56" y="94" width="54" height="16" rx="4" fill="#0860c9" />
      <line x1="68" y1="102" x2="98" y2="102" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Paper sheet with lines & checkmark badge (right) */}
    <g>
      <rect x="122" y="70" width="60" height="76" rx="10" fill="#ffffff" stroke="#b9e7ff" strokeWidth="2.5" className="dark:fill-zinc-950" />
      <line x1="134" y1="88" x2="168" y2="88" stroke="#4086ee" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="134" y1="100" x2="170" y2="100" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <line x1="134" y1="111" x2="162" y2="111" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <line x1="134" y1="122" x2="154" y2="122" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

      {/* Green-blue Checkmark Circle */}
      <circle cx="176" cy="136" r="14" fill="#4086ee" stroke="#ffffff" strokeWidth="3" />
      <path
        d="M170 136.5L174.2 140.5L182.5 132"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Cute floating blue Heart (top-center) */}
    <g>
      <path
        d="M120 58C120 58 95 43 95 27C95 19.8 100.8 14 108 14C112.8 14 117 16.6 119.2 20.4C119.6 21.1 120.4 21.1 120.8 20.4C123 16.6 127.2 14 132 14C139.2 14 145 19.8 145 27C145 43 120 58 120 58Z"
        fill="#4086ee"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <path
        d="M104 26C104 23 106.5 20.5 109.5 20.5"
        stroke="#b9e7ff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteBooks,
  onSelectBook,
  onAddToCart,
  onRemoveFavorite,
  onExploreDocuments,
}) => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredFavorites = useMemo(() => {
    return favoriteBooks
      .filter((item) => {
        const isDigital = item.itemType === 'digital' || Boolean(item.fileFormat);
        if (typeFilter === 'book' && isDigital) return false;
        if (typeFilter === 'digital' && !isDigital) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchUni = item.universityName.toLowerCase().includes(q);
          const matchSubject = (item.subjectName || item.major).toLowerCase().includes(q);
          if (!matchTitle && !matchUni && !matchSubject) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'newest') return (b.publishYear || 2023) - (a.publishYear || 2023);
        return 0; // 'recent' keeps saved order
      });
  }, [favoriteBooks, typeFilter, sortBy, searchTerm]);

  const booksCount = favoriteBooks.filter(
    (b) => !(b.itemType === 'digital' || Boolean(b.fileFormat))
  ).length;
  const digitalCount = favoriteBooks.filter(
    (b) => b.itemType === 'digital' || Boolean(b.fileFormat)
  ).length;

  return (
    <div className="min-h-[75vh] bg-[#edf8fe] dark:bg-black transition-colors py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Subtle Back Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExploreDocuments}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-400 hover:text-[#4086ee] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </button>
        </div>

        {/* 1 & 2. HEADER: CENTERED UNIDOC LOGO + SLOGAN + PAGE TITLE */}
        <header className="text-center space-y-3 pt-1">
          <div className="flex flex-col items-center justify-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-300 tracking-tight">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>

          <div className="pt-2 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0860c9] dark:text-white tracking-tight">
              Danh sách yêu thích
            </h1>
            <p className="text-sm text-[#5b728f] dark:text-zinc-400 font-medium">
              Những tài liệu bạn muốn lưu lại
            </p>
          </div>
        </header>

        {/* OVERVIEW ROW & RIGHT CONTENT SEARCH / SORT ICON ACTIONS */}
        <div className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Overview line: "Bạn đang lưu X sản phẩm" or clean empty message */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0860c9] dark:text-white">
              <Heart className="w-4 h-4 fill-[#4086ee] text-[#4086ee] shrink-0" />
              <span className="tabular-nums">
                {favoriteBooks.length > 0
                  ? `Bạn đang lưu ${favoriteBooks.length} sản phẩm`
                  : 'Chưa có sản phẩm yêu thích nào'}
              </span>
            </div>

            {/* Top-right content action icons: Search & Sort */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                title="Tìm kiếm trong danh sách yêu thích"
                aria-label="Tìm kiếm trong danh sách yêu thích"
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  showSearch
                    ? 'bg-[#4086ee] text-white border-[#4086ee]'
                    : 'bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700 hover:bg-[#dcf1fd] dark:hover:bg-zinc-800'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setSortBy((prev) =>
                    prev === 'recent'
                      ? 'price_asc'
                      : prev === 'price_asc'
                      ? 'price_desc'
                      : prev === 'price_desc'
                      ? 'newest'
                      : 'recent'
                  )
                }
                title="Chuyển nhanh kiểu sắp xếp"
                aria-label="Sắp xếp danh sách yêu thích"
                className="p-2.5 rounded-xl border bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700 hover:bg-[#dcf1fd] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Quick Search Input */}
          {showSearch && (
            <div className="relative">
              <Search className="w-4 h-4 text-[#5b728f] dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên sách, tài liệu, môn học hoặc trường đại học..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-[#0860c9] dark:text-white placeholder:text-[#5b728f] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b728f] hover:text-[#0860c9] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* 3. CHIP FILTERS + SORT DROPDOWN */}
          <div className="space-y-3 pt-1">
            {/* Filter Chips: Tất cả | Sách cũ | Tài liệu số */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  typeFilter === 'all'
                    ? 'bg-[#4086ee] text-white border-[#4086ee] shadow-sm shadow-[#4086ee]/25'
                    : 'bg-white dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700 hover:bg-[#edf8fe] dark:hover:bg-zinc-800'
                }`}
              >
                {favoriteBooks.length > 0 ? `Tất cả (${favoriteBooks.length})` : 'Tất cả'}
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter('book')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  typeFilter === 'book'
                    ? 'bg-[#4086ee] text-white border-[#4086ee] shadow-sm shadow-[#4086ee]/25'
                    : 'bg-[#edf8fe]/70 dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700 hover:bg-[#edf8fe] dark:hover:bg-zinc-800'
                }`}
              >
                {booksCount > 0 ? `Sách cũ (${booksCount})` : 'Sách cũ'}
              </button>

              <button
                type="button"
                onClick={() => setTypeFilter('digital')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  typeFilter === 'digital'
                    ? 'bg-[#4086ee] text-white border-[#4086ee] shadow-sm shadow-[#4086ee]/25'
                    : 'bg-[#edf8fe]/70 dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700 hover:bg-[#edf8fe] dark:hover:bg-zinc-800'
                }`}
              >
                {digitalCount > 0 ? `Tài liệu số (${digitalCount})` : 'Tài liệu số'}
              </button>
            </div>

            {/* Sort Dropdown below chips */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#edf8fe] dark:border-zinc-800">
              <span className="text-xs font-semibold text-[#5b728f] dark:text-zinc-400">
                Sắp xếp danh sách:
              </span>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Sắp xếp sản phẩm yêu thích"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee] cursor-pointer"
                >
                  <option value="recent">Mới lưu gần đây</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="newest">Mới đăng</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 4 vs 5. EITHER FAVORITES LIST OR EMPTY STATE (NEVER BOTH AT ONCE) */}
        {favoriteBooks.length === 0 ? (
          /* 5. EMPTY STATE ILLUSTRATION */
          <section className="bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] py-12 px-6 text-center space-y-4">
            <EmptyFavoritesIllustration />

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-black text-[#0860c9] dark:text-white">
                Bạn chưa có sản phẩm yêu thích
              </h2>
              <p className="text-sm text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                Lưu sách và tài liệu hữu ích để tìm lại dễ dàng hơn
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreDocuments}
                className="px-6 py-3 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm shadow-md shadow-[#4086ee]/25 transition-all active:scale-95 cursor-pointer"
              >
                Khám phá tài liệu
              </button>
            </div>
          </section>
        ) : filteredFavorites.length === 0 ? (
          /* Filtered search/chip yielded 0 matches */
          <section className="bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] py-10 px-6 text-center space-y-3">
            <p className="text-base font-bold text-[#0860c9] dark:text-white">
              Không có sản phẩm nào khớp bộ lọc hiện tại
            </p>
            <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400">
              Bạn hãy thử chọn lại tab Tất cả hoặc xóa từ khóa tìm kiếm nhé.
            </p>
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all');
                setSearchTerm('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Xem tất cả ({favoriteBooks.length})
            </button>
          </section>
        ) : (
          /* 4. FAVORITES PRODUCT CARDS (Vertical priority, 1-2-3 responsive columns with crisp spacing) */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFavorites.map((item) => {
              const isDigital = item.itemType === 'digital' || Boolean(item.fileFormat);
              const hasValidPhoto =
                !isDigital && item.images.length > 0 && !failedImages[item.id];
              const typeLabel = isDigital ? 'Tài liệu' : 'Sách cũ';

              return (
                <article
                  key={item.id}
                  onClick={() => onSelectBook(item)}
                  className="group bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] hover:border-[#4086ee] dark:hover:border-sky-500 hover:shadow-[0_12px_28px_rgba(64,134,238,0.16)] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
                >
                  {/* Top Media / Cover or File Illustration */}
                  <div className="relative h-48 w-full bg-[#edf8fe] dark:bg-zinc-900 border-b border-[#b9e7ff]/70 dark:border-zinc-800 overflow-hidden shrink-0">
                    {isDigital ? (
                      <DigitalFileIllustration
                        format={item.fileFormat || 'PDF'}
                        title={item.title}
                      />
                    ) : hasValidPhoto ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <TextbookCoverFallback book={item} />
                    )}

                    {/* Top-right heart button on cover (blue or warm orange when favorited) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(item.id, e);
                      }}
                      title="Bỏ khỏi danh sách yêu thích"
                      aria-label={`Bỏ yêu thích ${item.title}`}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 dark:bg-black/85 border border-[#b9e7ff] dark:border-zinc-700 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isDigital
                            ? 'fill-[#fb923c] text-[#fb923c]'
                            : 'fill-[#4086ee] text-[#4086ee]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body: Clean Non-Overlapping Metadata */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                    <div className="space-y-2">
                      {/* Label & Rating Row */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span
                          className={`font-bold ${
                            isDigital
                              ? 'text-[#ea580c] dark:text-amber-400'
                              : 'text-[#4086ee] dark:text-sky-400'
                          }`}
                        >
                          {typeLabel}
                          {isDigital && item.fileFormat ? ` · ${item.fileFormat}` : ''}
                        </span>

                        <span className="inline-flex items-center gap-1 font-bold text-[#0860c9] dark:text-white tabular-nums">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{item.seller.rating.toFixed(1)}</span>
                        </span>
                      </div>

                      {/* Document / Book Title */}
                      <h3 className="text-base font-extrabold text-[#0860c9] dark:text-white group-hover:text-[#4086ee] dark:group-hover:text-sky-400 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      {/* University */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5b728f] dark:text-zinc-300">
                        <GraduationCap className="w-3.5 h-3.5 text-[#4086ee] dark:text-sky-400 shrink-0" />
                        <span className="truncate">{item.universityName}</span>
                      </div>

                      {/* Subject & Academic Year (clean text with middot separator) */}
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                        <span>{item.subjectName || item.major}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{item.academicYear || 'Năm học 2024 - 2025'}</span>
                      </div>
                    </div>

                    {/* Footer: Price + Remove Heart + Add to Cart CTA */}
                    <div className="pt-3 border-t border-[#edf8fe] dark:border-zinc-800 flex items-center justify-between gap-2">
                      <div className="text-lg font-black text-[#0860c9] dark:text-sky-400 tabular-nums shrink-0">
                        {formatVND(item.price)}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite(item.id, e);
                          }}
                          title="Bỏ yêu thích"
                          aria-label={`Xóa ${item.title} khỏi yêu thích`}
                          className="p-2 rounded-xl border border-[#b9e7ff] dark:border-zinc-700 bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-700 transition-colors cursor-pointer"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item, e);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#4086ee]/25 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span>Thêm vào giỏ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};
