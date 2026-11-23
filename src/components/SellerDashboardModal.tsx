import React from 'react';
import { Book } from '../types';
import { HumorousBadge } from './HumorousBadge';
import { getRankBadgeForCount } from './RankAvatar';
import {
  X,
  PlusCircle,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  Award,
  Trash2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface SellerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  myBooks: Book[];
  onOpenPostBook: () => void;
  onDeleteBook: (id: string) => void;
}

export const SellerDashboardModal: React.FC<SellerDashboardModalProps> = ({
  isOpen,
  onClose,
  myBooks,
  onOpenPostBook,
  onDeleteBook,
}) => {
  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const totalRevenue = myBooks.reduce((sum, b) => sum + b.price, 0);
  const hasBooks = myBooks.length > 0;
  const currentBadge = getRankBadgeForCount(myBooks.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Kênh quản lý người bán
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Quản Lý Tủ Sách & Đơn Hàng Của Bạn
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Humorous Title Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {currentBadge ? (
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Danh hiệu UniDoc hiện tại
                  </span>
                  <HumorousBadge badge={currentBadge} size="xs" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Hạng {currentBadge.tier} – {currentBadge.name}
                </h3>
                <p className="text-xs text-emerald-200 mt-1 italic">
                  {currentBadge.funnyQuote}
                </p>
                <div className="text-[11px] text-amber-300 font-medium mt-1">
                  ✓ Đặc quyền: {currentBadge.perk}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Danh hiệu bán hàng
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Chưa có hoạt động đăng bán
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Đăng cuốn sách đầu tiên ngay để tích điểm uy tín và mở khóa danh hiệu đầu tiên!
                </p>
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenPostBook();
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>ĐĂNG SÁCH MỚI</span>
            </button>
          </div>

          {/* Quick Metrics — only show numbers once user has posted books */}
          {hasBooks && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Sách đang đăng</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{myBooks.length}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Giá trị tủ sách</div>
                <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">{formatVND(totalRevenue)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Trạng thái uy tín</div>
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-2">Đã kích hoạt</div>
              </div>
            </div>
          )}

          {/* Books Management Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {hasBooks
                  ? `Danh sách giáo trình của bạn (${myBooks.length})`
                  : 'Danh sách giáo trình của bạn'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Hiển thị công khai trên UniDoc
              </span>
            </div>

            {!hasBooks ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-900/50 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-800 dark:text-white">
                  Bạn chưa đăng bán tài liệu nào
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Hãy đăng bán sách giáo trình hoặc tài liệu học tập đầu tiên để bắt đầu tích điểm uy tín!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {myBooks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={b.images[0]}
                        alt={b.title}
                        className="w-12 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {b.title}
                        </h4>
                        <p className="text-xs text-sky-700 dark:text-sky-400 font-medium truncate mt-0.5">
                          {b.universityName} • {b.major}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                          <span className="font-bold text-rose-600 dark:text-rose-400">{formatVND(b.price)}</span>
                          <span>• {b.pickupLocations[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t dark:border-zinc-800 sm:border-t-0 pt-2 sm:pt-0">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Đang bán
                      </span>
                      <button
                        onClick={() => onDeleteBook(b.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Gỡ cuốn sách này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
