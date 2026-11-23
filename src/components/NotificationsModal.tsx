import React, { useState } from 'react';
import { AppNotification } from '../types';
import {
  X,
  Bell,
  Package,
  Star,
  Award,
  ShieldCheck,
  Check,
  ArrowRight,
  EyeOff,
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNavigateToOrder?: (orderId?: string) => void;
  onNavigateToReviews?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNavigateToOrder,
  onNavigateToReviews,
}) => {
  const [filter, setFilter] = useState<'all' | 'order' | 'review' | 'badge'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-sky-600" />;
      case 'review':
        return <EyeOff className="w-4 h-4 text-indigo-600" />;
      case 'badge':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Thông Báo Hoạt Động
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                {notifications.length === 0
                  ? 'Chưa có thông báo hoạt động nào'
                  : unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : 'Bạn đã đọc hết thông báo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Đã đọc tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 dark:bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            {notifications.length > 0 ? `Tất cả (${notifications.length})` : 'Tất cả'}
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filter === 'order'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Đơn hàng
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filter === 'review'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Đánh giá ẩn danh
          </button>
          <button
            onClick={() => setFilter('badge')}
            className={`px-3 py-1 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              filter === 'badge'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Danh hiệu
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-zinc-400 text-xs">
              Không có thông báo nào trong mục này.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  n.read
                    ? 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-200'
                    : 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/70 text-slate-900 dark:text-white shadow-xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-400 shrink-0">{n.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">{n.message}</p>

                  {n.relatedBookTitle && (
                    <div className="mt-1 text-[11px] font-semibold text-sky-700 dark:text-sky-400 truncate">
                      Sách: {n.relatedBookTitle}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
