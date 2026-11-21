import React from 'react';
import { Book } from '../types';
import { HumorousBadge } from './HumorousBadge';
import { BookCoverGraphic } from './BookCoverGraphic';
import {
  Star,
  MapPin,
  CheckCircle2,
  Video,
  Heart,
  ShoppingCart,
} from 'lucide-react';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book, e: React.MouseEvent) => void;
  onToggleLike?: (bookId: string, e: React.MouseEvent) => void;
  isLiked?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  onAddToCart,
  onToggleLike,
  isLiked = false,
}) => {
  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  const conditionLabels: Record<string, { label: string; color: string }> = {
    like_new: { label: 'Mới 99%', color: 'bg-emerald-500 text-white' },
    good: { label: 'Tốt 90%', color: 'bg-blue-600 text-white' },
    fair: { label: 'Khá 80%', color: 'bg-amber-500 text-white' },
    acceptable: { label: 'Có khuyết điểm', color: 'bg-rose-500 text-white' },
  };

  const currentCondition = conditionLabels[book.condition] || {
    label: 'Đã qua sử dụng',
    color: 'bg-slate-600 text-white',
  };

  return (
    <div
      onClick={() => onSelect(book)}
      className="group bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 hover:border-sky-400 dark:hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Media & Badges Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden">
        <BookCoverGraphic
          book={book}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Condition Badge */}
        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${currentCondition.color}`}
        >
          {currentCondition.label}
        </span>

        {/* Video Preview Tag */}
        {book.videoUrl && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/75 text-white backdrop-blur-xs flex items-center gap-1">
            <Video className="w-3 h-3 text-red-400" />
            Video lật sách
          </span>
        )}

        {/* Discount Tag */}
        {discountPercent && discountPercent > 0 && (
          <span className="absolute bottom-2.5 left-2.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-xs">
            Tiết kiệm {discountPercent}%
          </span>
        )}

        {/* Quick Like Button */}
        <button
          type="button"
          onClick={(e) => onToggleLike && onToggleLike(book.id, e)}
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-xs hover:bg-white dark:hover:bg-black text-slate-600 dark:text-white hover:text-rose-500 flex items-center justify-center shadow-xs transition-transform active:scale-90"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Book Content Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* University & Major Tag */}
          <div className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-semibold mb-1">
            <MapPin className="w-3 h-3 shrink-0 text-sky-500" />
            <span className="truncate">{book.universityName}</span>
          </div>

          {/* Book Title */}
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
            {book.title}
          </h4>

          {/* Subject Code & Author */}
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5 truncate">
            {book.subjectCode && (
              <span className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 px-1.5 py-0.2 rounded font-mono font-medium text-[10px] border border-transparent dark:border-zinc-800">
                {book.subjectCode}
              </span>
            )}
            <span className="truncate">{book.author}</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
              {formatVND(book.price)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-zinc-500 line-through">
                {formatVND(book.originalPrice)}
              </span>
            )}
          </div>

          {/* Seller Profile & Humorous Badge */}
          <div className="mt-2 pt-2 border-t border-slate-100/80 dark:border-zinc-800 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <img
                src={book.seller.avatar}
                alt={book.seller.name}
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-white truncate max-w-[90px]">
                {book.seller.name}
              </span>
              {book.seller.isVerifiedStudent && (
                <span title="Sinh viên đã xác thực MSSV">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                </span>
              )}
            </div>

            {/* Display Seller Title Badge */}
            <HumorousBadge badge={book.seller.sellerBadge} size="xs" interactive={false} />
          </div>

          {/* Rating & Quick Buy */}
          <div className="mt-2.5 flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 text-slate-600 dark:text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-white text-[11px]">{book.seller.rating}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400">({book.seller.reviewCount})</span>
            </div>

            <button
              onClick={(e) => onAddToCart(book, e)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-500 dark:hover:bg-sky-500 text-sky-700 dark:text-sky-300 hover:text-white dark:hover:text-white font-bold text-[11px] transition-all cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
