import React, { useState } from 'react';
import { CartItem } from '../types';
import { BookCoverGraphic } from './BookCoverGraphic';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Tag, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (bookId: string) => void;
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onCheckout: () => void;
  userRankTier?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  userRankTier = 0,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'TANSV20K') {
      setDiscount(20000);
      setPromoMessage({ text: 'Đã áp dụng mã giảm giá sinh viên: -20.000đ', isError: false });
    } else if (code === 'HUYENTHOAI10K' || code === 'HANG5_10K') {
      if (userRankTier >= 5) {
        setDiscount(10000);
        setPromoMessage({
          text: 'Đã áp dụng Voucher Hạng 5 – Huyền Thoại Tàng Kinh Các: -10.000đ',
          isError: false,
        });
      } else {
        setPromoMessage({
          text: 'Voucher này chỉ dành cho Hạng 5 – Huyền Thoại Tàng Kinh Các.',
          isError: true,
        });
      }
    } else {
      setPromoMessage({
        text: 'Mã giảm giá không hợp lệ. Hãy thử: TANSV20K',
        isError: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Giỏ Hàng Giáo Trình ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-zinc-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-zinc-600" />
                </div>
                <p className="font-bold text-slate-700 dark:text-white text-base">Giỏ hàng của bạn đang trống</p>
                <p className="text-xs text-slate-400 dark:text-zinc-400 mt-1">
                  Hãy dạo quanh tìm cuốn sách giáo trình chuẩn bị cho kỳ học tới nhé!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.book.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex gap-3 relative"
                >
                  <BookCoverGraphic
                    book={item.book}
                    compact
                    className="w-16 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.book.title}
                      </h4>
                      <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium truncate mt-0.5">
                        {item.book.universityName}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-500" />
                        <span className="truncate">Hẹn: {item.book.pickupLocations[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {formatVND(item.book.price)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRemoveItem(item.book.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 space-y-3">
              {userRankTier >= 5 && (
                <button
                  type="button"
                  onClick={() => {
                    setPromoCode('HUYENTHOAI10K');
                    setDiscount(10000);
                    setPromoMessage({
                      text: 'Đã áp dụng Voucher Hạng 5 – Huyền Thoại Tàng Kinh Các: -10.000đ',
                      isError: false,
                    });
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between cursor-pointer hover:bg-amber-200/70 transition-colors"
                >
                  <span>👑 Voucher Hạng 5: Giảm 10.000đ</span>
                  <span className="underline">Áp dụng ngay</span>
                </button>
              )}

              {/* Promo code */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Nhập mã: TANSV20K"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs uppercase font-mono bg-white dark:bg-zinc-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-sky-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>

              {promoMessage && (
                <div
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    promoMessage.isError
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {!promoMessage.isError && <Check className="w-3 h-3 shrink-0" />}
                  <span>{promoMessage.text}</span>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 pt-1 border-t border-slate-200/80 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span>Tạm tính ({items.length} cuốn):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatVND(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Mã giảm giá SV:</span>
                    <span className="font-bold">-{formatVND(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí nhận sách tại KTX/Canteen:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0đ (Miễn phí)</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-zinc-800">
                  <span>Tổng thanh toán:</span>
                  <span className="text-rose-600 dark:text-rose-400">{formatVND(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>XÁC NHẬN ĐẶT SÁCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
