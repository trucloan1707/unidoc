import React, { useState } from 'react';
import { Book, BookReview, HumorousBadgeInfo } from '../types';
import { HumorousBadge } from './HumorousBadge';
import { BookCoverGraphic } from './BookCoverGraphic';
import { RankAvatar } from './RankAvatar';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Video,
  Play,
  ShoppingCart,
  MessageCircle,
  Share2,
  Heart,
  EyeOff,
  ThumbsUp,
  Building,
  BookOpen,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  reviews: BookReview[];
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  onChatWithSeller: (book: Book) => void;
  onOpenAddReview: (book: Book) => void;
  isLiked?: boolean;
  onToggleLike?: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  reviews,
  onClose,
  onAddToCart,
  onChatWithSeller,
  onOpenAddReview,
  isLiked = false,
  onToggleLike,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'with_media' | 'anonymous' | '5star'>('all');
  const [selectedReviewVideo, setSelectedReviewVideo] = useState<string | null>(null);
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  if (!book) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const discountPercent = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  const bookReviews = reviews.filter((r) => r.bookId === book.id || r.sellerId === book.seller.id);

  const filteredReviews = bookReviews.filter((r) => {
    if (reviewFilter === 'with_media') return (r.images && r.images.length > 0) || r.videoUrl;
    if (reviewFilter === 'anonymous') return r.isAnonymous;
    if (reviewFilter === '5star') return r.rating === 5;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Sticky top action bar */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2.5 py-1 rounded-lg">
              {book.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Mã sách: #{book.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike && onToggleLike(book.id)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-300 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Section: Media Gallery & Book Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                {isVideoActive && book.videoUrl ? (
                  <video
                    src={book.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookCoverGraphic
                    book={book}
                    imageIndex={selectedImgIndex}
                    className="w-full h-full object-cover"
                  />
                )}

                {book.videoUrl && !isVideoActive && (
                  <button
                    onClick={() => setIsVideoActive(true)}
                    className="absolute inset-0 flex items-center justify-center bg-slate-950/30 hover:bg-slate-950/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 text-sky-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-sky-600 ml-1" />
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-red-400" />
                      Xem video lật từng trang
                    </span>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {book.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedImgIndex(i);
                      setIsVideoActive(false);
                    }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                      selectedImgIndex === i && !isVideoActive
                        ? 'border-sky-500 scale-95'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}

                {book.videoUrl && (
                  <button
                    onClick={() => setIsVideoActive(true)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 bg-slate-800 text-white flex flex-col items-center justify-center gap-1 text-[10px] font-bold cursor-pointer ${
                      isVideoActive ? 'border-sky-500 ring-2 ring-sky-300' : 'border-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4 text-red-400" />
                    <span>Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Core Details Column */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* University Header */}
                <div className="flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-400 font-bold mb-1.5">
                  <Building className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{book.universityName}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {book.title}
                </h1>

                <div className="mt-2 text-xs text-slate-600 dark:text-zinc-300 space-y-1">
                  <div>
                    <span className="text-slate-400 dark:text-zinc-400">Tác giả:</span> <b>{book.author}</b>
                  </div>
                  {book.isbn && (
                    <div>
                      <span className="text-slate-400 dark:text-zinc-400">ISBN:</span>{' '}
                      <span className="font-mono">{book.isbn}</span>
                    </div>
                  )}
                  {book.publisher && (
                    <div>
                      <span className="text-slate-400 dark:text-zinc-400">Nhà xuất bản:</span>{' '}
                      <span>{book.publisher} ({book.publishYear})</span>
                    </div>
                  )}
                  {book.subjectCode && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-mono text-[11px] font-bold">
                        Môn: {book.subjectCode} - {book.subjectName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-zinc-900 border border-amber-200/80 dark:border-zinc-800 flex items-baseline justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      Giá sang nhượng sinh viên
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                        {formatVND(book.price)}
                      </span>
                      {book.originalPrice && (
                        <span className="text-sm text-slate-400 dark:text-zinc-500 line-through">
                          {formatVND(book.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {discountPercent && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow-xs">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Book Condition Breakdown */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-zinc-200">Tình trạng thực tế:</span>
                    <span className="font-bold text-sky-700 dark:text-sky-400 capitalize">
                      {book.condition === 'like_new'
                        ? 'Mới 99% (Chưa dùng)'
                        : book.condition === 'good'
                        ? 'Tốt 90% (Gáy chắc chắn)'
                        : 'Khá 80%'}
                    </span>
                  </div>

                  {book.conditionNotes && (
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            book.conditionNotes.hasHighlight ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span>{book.conditionNotes.hasHighlight ? 'Có highlight bài thi' : 'Không gạch xóa'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            book.conditionNotes.hasPencilNotes ? 'bg-sky-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span>{book.conditionNotes.hasPencilNotes ? 'Có ghi chú bút chì' : 'Sách sạch sẽ'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Đầy đủ 100% số trang</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Gáy sách nguyên vẹn</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => onAddToCart(book)}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-md hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
                <button
                  onClick={() => onChatWithSeller(book)}
                  className="py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md hover:shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Với Bạn Này</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description & Pickup Locations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50/70 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Mô tả từ bạn bán sách
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-zinc-900 border border-sky-200/70 dark:border-zinc-800 space-y-2">
              <h3 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Địa điểm giao trực tiếp
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-200">
                {book.pickupLocations.map((loc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 font-medium">
                    <span className="text-sky-600 dark:text-sky-400 font-bold">•</span>
                    <span>{loc}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium pt-2 border-t border-sky-200/60 dark:border-zinc-800">
                ✓ Tiết kiệm 0đ tiền ship khi gặp tại KTX/Canteen
              </div>
            </div>
          </div>

          {/* SELLER SHOWCASE WITH HUMOROUS TITLE ("danh hiệu đặc biệt và hài hước cho người bán nhiều và người mua nhiều") */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <RankAvatar
                  src={book.seller.avatar}
                  alt={book.seller.name}
                  tier={book.seller.sellerBadge.tier}
                  size="md"
                  fallbackText={book.seller.name.slice(0, 2).toUpperCase()}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-black text-white">{book.seller.name}</h4>
                    <span className="text-xs font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                      MSSV: {book.seller.studentIdMasked}
                    </span>
                    {book.seller.isVerifiedStudent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" /> Sinh viên xác thực
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-sky-200 mt-0.5">{book.seller.university} • {book.seller.major}</p>

                  {/* DISPLAY HUMOROUS SELLER & BUYER TITLES */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <HumorousBadge badge={book.seller.sellerBadge} size="sm" />
                    <HumorousBadge badge={book.seller.buyerBadge} size="sm" />
                  </div>
                </div>
              </div>

              {/* Seller metrics */}
              <div className="grid grid-cols-3 gap-3 w-full sm:w-auto text-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-4">
                <div>
                  <div className="text-base font-black text-amber-400">{book.seller.rating} ★</div>
                  <div className="text-[10px] text-slate-300">Đánh giá</div>
                </div>
                <div>
                  <div className="text-base font-black text-emerald-400">{book.seller.salesCount}</div>
                  <div className="text-[10px] text-slate-300">Sách đã bán</div>
                </div>
                <div>
                  <div className="text-base font-black text-sky-300">{book.seller.responseTime}</div>
                  <div className="text-[10px] text-slate-300">Phản hồi</div>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION ("đánh giá ẩn danh người bán", "hình ảnh/video sách đánh giá thang 5 sao") */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Đánh giá người bán & sách
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300">
                    {bookReviews.length} lượt đánh giá
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Hỗ trợ <b>đánh giá ẩn danh</b> để sinh viên nhận xét chân thật nhất kèm ảnh & video lật sách.
                </p>
              </div>

              <button
                onClick={() => onOpenAddReview(book)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Viết Đánh Giá (Có Ẩn Danh)</span>
              </button>
            </div>

            {/* Filter pills for reviews */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                  reviewFilter === 'all'
                    ? 'bg-slate-900 dark:bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
                }`}
              >
                Tất cả ({bookReviews.length})
              </button>
              <button
                onClick={() => setReviewFilter('with_media')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  reviewFilter === 'with_media'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Có Video / Hình ảnh
              </button>
              <button
                onClick={() => setReviewFilter('anonymous')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  reviewFilter === 'anonymous'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                Đánh giá ẩn danh ({bookReviews.filter((r) => r.isAnonymous).length})
              </button>
              <button
                onClick={() => setReviewFilter('5star')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                  reviewFilter === '5star'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                5 Sao
              </button>
            </div>

            {/* Review Cards List */}
            <div className="space-y-3.5">
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                  Chưa có đánh giá nào cho bộ lọc này. Hãy là người đầu tiên để lại đánh giá!
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 space-y-3"
                  >
                    {/* Reviewer Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {rev.isAnonymous ? (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <EyeOff className="w-4 h-4" />
                          </div>
                        ) : (
                          <img
                            src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                            alt={rev.reviewerName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                          />
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {rev.isAnonymous ? rev.anonymousAlias || 'Sinh viên ẩn danh' : rev.reviewerName}
                            </span>
                            {rev.isAnonymous && (
                              <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> Đánh giá ẩn danh
                              </span>
                            )}
                            {rev.verifiedStudent && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            {/* Humorous buyer badge of reviewer */}
                            {rev.reviewerBuyerBadge && (
                              <HumorousBadge badge={rev.reviewerBuyerBadge} size="xs" interactive={false} />
                            )}
                            <span className="text-[11px] text-slate-400 dark:text-zinc-400">{rev.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* 5-Star Visual Scale */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Criteria Sub-Breakdown */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-zinc-400 bg-white/70 dark:bg-zinc-950 p-2 rounded-lg border border-slate-100 dark:border-zinc-800">
                      <span>
                        Đúng mô tả: <b className="text-slate-700 dark:text-white">{rev.breakdown.conditionAccuracy}/5</b>
                      </span>
                      <span>
                        Hẹn giao KTX: <b className="text-slate-700 dark:text-white">{rev.breakdown.deliverySpeed}/5</b>
                      </span>
                      <span>
                        Nhiệt tình: <b className="text-slate-700 dark:text-white">{rev.breakdown.sellerAttitude}/5</b>
                      </span>
                      <span>
                        Bảo quản sách: <b className="text-slate-700 dark:text-white">{rev.breakdown.packaging}/5</b>
                      </span>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* PHOTO & VIDEO ATTACHMENTS */}
                    {(rev.images.length > 0 || rev.videoUrl) && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-1">
                        {rev.images.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedReviewImage(img)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shrink-0 hover:opacity-90 cursor-pointer"
                          >
                            <img src={img} alt={`Ảnh đánh giá ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}

                        {rev.videoUrl && (
                          <button
                            type="button"
                            onClick={() => setSelectedReviewVideo(rev.videoUrl!)}
                            className="relative w-24 h-16 rounded-xl overflow-hidden border border-sky-400 bg-slate-900 shrink-0 flex items-center justify-center group cursor-pointer"
                          >
                            {rev.videoThumbnail || rev.images[0] ? (
                              <img
                                src={rev.videoThumbnail || rev.images[0]}
                                alt="video-thumb"
                                className="w-full h-full object-cover opacity-60"
                              />
                            ) : (
                              <video
                                src={rev.videoUrl}
                                muted
                                className="w-full h-full object-cover opacity-60"
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="p-1 rounded-full bg-sky-500 text-white shadow-md group-hover:scale-110 transition-transform">
                                <Play className="w-3.5 h-3.5 fill-white" />
                              </span>
                            </div>
                            <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/75 px-1 rounded">
                              Video lật sách
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Seller Reply */}
                    {rev.sellerReply && (
                      <div className="ml-4 p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border-l-2 border-sky-500 text-xs text-slate-700 dark:text-zinc-200">
                        <div className="font-bold text-sky-800 dark:text-sky-400 flex items-center gap-1 mb-0.5">
                          <span>Phản hồi từ người bán</span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-400 font-normal">
                            ({rev.sellerReply.createdAt})
                          </span>
                        </div>
                        <p>{rev.sellerReply.comment}</p>
                      </div>
                    )}

                    {/* Thumbs up count */}
                    <div className="flex items-center justify-end text-xs text-slate-500 dark:text-zinc-400 pt-1">
                      <button className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Hữu ích ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Image Lightbox Modal */}
        {selectedReviewImage && (
          <div
            onClick={() => setSelectedReviewImage(null)}
            className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-zinc-950 rounded-2xl overflow-hidden border border-white/10"
            >
              <button
                type="button"
                onClick={() => setSelectedReviewImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedReviewImage}
                alt="Ảnh đánh giá chi tiết"
                className="w-full max-h-[80vh] object-contain mx-auto"
              />
            </div>
          </div>
        )}

        {/* Video Player Lightbox Modal */}
        {selectedReviewVideo && (
          <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
            <div className="relative max-w-lg w-full bg-black rounded-2xl overflow-hidden">
              <button
                onClick={() => setSelectedReviewVideo(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                src={selectedReviewVideo}
                controls
                autoPlay
                className="w-full aspect-video object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
