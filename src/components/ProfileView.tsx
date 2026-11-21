import React, { useState, useRef } from 'react';
import { Book, BookReview } from '../types';
import { UniDocLogo } from './UniDocLogo';
import { BookCoverGraphic } from './BookCoverGraphic';
import {
  Pencil,
  Star,
  Award,
  CheckCircle2,
  Receipt,
  FileText,
  Heart,
  ShieldAlert,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
  ArrowLeft,
  Clock,
  Truck,
  CheckCheck,
  EyeOff,
  MapPin,
  X,
  Check,
  Sun,
  Moon,
  ShieldCheck,
  Send,
  ShoppingCart,
  Camera,
  Upload,
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  university: string;
  avatar: string;
}

interface ReportItem {
  id: string;
  title: string;
  target: string;
  status: 'resolved' | 'reviewing';
  date: string;
  detail: string;
}

interface ProfileViewProps {
  orders: any[];
  viewedBooks: Book[];
  anonymousReviews: BookReview[];
  favoritesCount: number;
  postedBooksCount: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onOpenTitlesGuide: () => void;
  onOpenVerification: () => void;
  onOpenSellerDashboard: () => void;
  onNavigateFavorites: () => void;
  onBackToHome: () => void;
  onOpenChatWithSeller?: (book: Book) => void;
  onLogout?: () => void;
}

type ActiveSubView =
  | null
  | 'orders'
  | 'reviews'
  | 'reports'
  | 'help'
  | 'settings';

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

/* Subtle bottom illustration: small books, flying paper sheet, and blue checkmark */
const AccountBottomIllustration: React.FC = () => (
  <svg
    viewBox="0 0 260 110"
    className="w-56 h-24 mx-auto opacity-95 select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Soft ice-blue cloud base */}
    <ellipse cx="130" cy="94" rx="92" ry="10" fill="#d4efff" className="dark:opacity-20" />

    {/* Flying paper sheet left */}
    <g transform="rotate(-12 64 56)">
      <rect
        x="46"
        y="34"
        width="36"
        height="44"
        rx="6"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="2"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="54" y1="46" x2="74" y2="46" stroke="#4086ee" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="54" y1="54" x2="72" y2="54" stroke="#b9e7ff" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="54" y1="62" x2="68" y2="62" stroke="#b9e7ff" strokeWidth="2.2" strokeLinecap="round" />
    </g>

    {/* Motion curve lines */}
    <path
      d="M84 44C96 36 106 38 112 43"
      stroke="#b9e7ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="3 4"
    />

    {/* Stack of small books center */}
    <g>
      <rect x="96" y="70" width="68" height="16" rx="4" fill="#4086ee" />
      <rect x="96" y="70" width="11" height="16" rx="2" fill="#0860c9" />
      <line x1="114" y1="78" x2="154" y2="78" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />

      <rect x="104" y="54" width="58" height="16" rx="4" fill="#82c9ff" />
      <rect x="104" y="54" width="10" height="16" rx="2" fill="#4086ee" />
      <line x1="120" y1="62" x2="152" y2="62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Flying paper + blue checkmark right */}
    <g transform="rotate(8 194 52)">
      <rect
        x="176"
        y="30"
        width="38"
        height="46"
        rx="7"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="2"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="185" y1="44" x2="205" y2="44" stroke="#cbd5e1" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="185" y1="53" x2="200" y2="53" stroke="#cbd5e1" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="210" cy="68" r="12" fill="#4086ee" stroke="#ffffff" strokeWidth="2.5" />
      <path
        d="M205 68.5L208.5 72L215.5 64.5"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  viewedBooks,
  anonymousReviews,
  favoritesCount,
  postedBooksCount,
  darkMode = false,
  onToggleDarkMode,
  onSelectBook,
  onAddToCart,
  onOpenTitlesGuide,
  onOpenVerification,
  onOpenSellerDashboard,
  onNavigateFavorites,
  onBackToHome,
  onLogout,
}) => {
  const DEFAULT_AVATAR =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80';

  const [profile, setProfile] = useState<UserProfile>(() => {
    const fallback: UserProfile = {
      name: 'Nguyễn Minh Anh',
      email: 'minhanh@edu.vn',
      university: 'ĐH Kinh tế TP.HCM',
      avatar: DEFAULT_AVATAR,
    };
    try {
      const saved = localStorage.getItem('unidoc_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...fallback, ...parsed };
      }
    } catch {}
    return fallback;
  });
  const [avatarError, setAvatarError] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const directAvatarInputRef = useRef<HTMLInputElement>(null);
  const modalAvatarInputRef = useRef<HTMLInputElement>(null);

  const [activeSubView, setActiveSubView] = useState<ActiveSubView>(null);
  const [orderTab, setOrderTab] = useState<
    'all' | 'pending_confirmation' | 'preparing' | 'completed' | 'viewed'
  >('all');

  // Edit profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);

  // Reports state
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep_1',
      title: 'Xác minh tình trạng sách giao dịch #UD-510924',
      target: 'Đơn sách Triết học Mác - Lênin',
      status: 'resolved',
      date: '4 ngày trước',
      detail: 'Ban quản trị UniDoc đã xác nhận sách đúng mô tả và hoàn tất đối soát.',
    },
  ]);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportDetail, setNewReportDetail] = useState('');

  // Account settings toggles
  const [notifyOrderUpdates, setNotifyOrderUpdates] = useState(true);
  const [defaultAnonymousReview, setDefaultAnonymousReview] = useState(true);

  // Logout confirmation & signed-out state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const persistProfile = (next: UserProfile) => {
    setProfile(next);
    try {
      localStorage.setItem('unidoc_user_profile', JSON.stringify(next));
    } catch {}
  };

  const handleAvatarFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: 'direct' | 'draft'
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarUploadError('Vui lòng chọn tệp hình ảnh (JPG, PNG, WEBP...).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError('Dung lượng ảnh tối đa là 5MB.');
      return;
    }

    setAvatarUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;

      // Resize large photos via offscreen canvas for crisp square avatar & fast storage
      const img = new Image();
      img.onload = () => {
        const size = 320;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarError(false);
          if (mode === 'direct') {
            const updated = { ...profile, avatar: dataUrl };
            persistProfile(updated);
            setDraftProfile(updated);
          } else {
            setDraftProfile((prev) => ({ ...prev, avatar: dataUrl }));
          }
        } else {
          setAvatarError(false);
          if (mode === 'direct') {
            const updated = { ...profile, avatar: result };
            persistProfile(updated);
            setDraftProfile(updated);
          } else {
            setDraftProfile((prev) => ({ ...prev, avatar: result }));
          }
        }
      };
      img.onerror = () => {
        setAvatarError(false);
        if (mode === 'direct') {
          const updated = { ...profile, avatar: result };
          persistProfile(updated);
          setDraftProfile(updated);
        } else {
          setDraftProfile((prev) => ({ ...prev, avatar: result }));
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: draftProfile.name.trim() || 'Nguyễn Minh Anh',
      email: draftProfile.email.trim() || 'minhanh@edu.vn',
      university: draftProfile.university.trim() || 'ĐH Kinh tế TP.HCM',
      avatar: draftProfile.avatar || profile.avatar,
    };
    setAvatarError(false);
    persistProfile(updated);
    setIsEditingProfile(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportTitle.trim()) return;
    setReports((prev) => [
      {
        id: `rep_${Date.now()}`,
        title: newReportTitle.trim(),
        target: 'Tài khoản / Đơn hàng UniDoc',
        status: 'reviewing',
        date: 'Vừa gửi',
        detail: newReportDetail.trim() || 'Đang chờ đội ngũ hỗ trợ sinh viên UniDoc xem xét.',
      },
      ...prev,
    ]);
    setNewReportTitle('');
    setNewReportDetail('');
  };

  // Filtered orders for the Orders sub-view
  const filteredOrders =
    orderTab === 'all'
      ? orders
      : orders.filter((o) => o.status === orderTab);

  // Signed-out recovery view
  if (isLoggedOut) {
    return (
      <div className="min-h-[75vh] bg-[#edf8fe] dark:bg-black py-10 px-4 transition-colors">
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-7 text-center space-y-5">
          <div className="flex flex-col items-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs font-bold text-[#0860c9] dark:text-sky-300">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>

          <AccountBottomIllustration />

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-[#0860c9] dark:text-white">
              Bạn đã đăng xuất
            </h2>
            <p className="text-sm text-[#5b728f] dark:text-zinc-400">
              Đăng nhập lại để tiếp tục quản lý sách, tài liệu và đơn hàng sinh viên của bạn.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsLoggedOut(false)}
              className="w-full py-3 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm shadow-md shadow-[#4086ee]/25 transition-colors cursor-pointer"
            >
              Đăng nhập lại ({profile.name})
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full py-2.5 rounded-2xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-[#0860c9] dark:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-[#edf8fe] dark:bg-black transition-colors py-6 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Top subtle back link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (activeSubView) {
                setActiveSubView(null);
              } else {
                onBackToHome();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-400 hover:text-[#4086ee] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{activeSubView ? 'Quay lại Tài khoản của tôi' : 'Quay lại trang chủ'}</span>
          </button>
        </div>

        {/* 1. LOGO UNIDOC (XE ĐẨY CHỨA SÁCH, CHỮ XANH DƯƠNG - CAM, SLOGAN BÊN DƯỚI) CĂN GIỮA TRÊN CÙNG */}
        <header className="text-center space-y-3 pt-1">
          <div className="flex flex-col items-center justify-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-300 tracking-tight">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0860c9] dark:text-white tracking-tight pt-1">
            Tài khoản của tôi
          </h1>
        </header>

        {/* SUB-VIEW PANELS WHEN USER CLICKS A MENU ROW */}
        {activeSubView === 'orders' ? (
          <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white">
                  Lịch sử mua hàng
                </h2>
                <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                  Theo dõi đơn chờ xác nhận, đang giao, đã giao và sách đã xem gần đây.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `Tất cả (${orders.length})` },
                {
                  id: 'pending_confirmation',
                  label: `Chờ xác nhận (${orders.filter((o) => o.status === 'pending_confirmation').length})`,
                },
                {
                  id: 'preparing',
                  label: `Chờ giao (${orders.filter((o) => o.status === 'preparing').length})`,
                },
                {
                  id: 'completed',
                  label: `Đã giao (${orders.filter((o) => o.status === 'completed').length})`,
                },
                { id: 'viewed', label: `Đã xem (${viewedBooks.length})` },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setOrderTab(t.id as any)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                    orderTab === t.id
                      ? 'bg-[#4086ee] text-white border-[#4086ee]'
                      : 'bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white border-[#b9e7ff] dark:border-zinc-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {orderTab === 'viewed' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {viewedBooks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBook(b)}
                    className="p-3 rounded-2xl border border-[#b9e7ff] dark:border-zinc-800 bg-[#edf8fe]/40 dark:bg-zinc-900 flex items-center justify-between gap-3 cursor-pointer hover:border-[#4086ee]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookCoverGraphic
                        book={b}
                        compact
                        className="w-14 h-18 rounded-xl object-cover shrink-0 border border-[#b9e7ff] dark:border-zinc-700"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#0860c9] dark:text-white line-clamp-2">
                          {b.title}
                        </h4>
                        <div className="text-sm font-black text-[#4086ee] dark:text-sky-400 mt-1 tabular-nums">
                          {formatVND(b.price)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(b);
                      }}
                      className="p-2.5 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white shrink-0 cursor-pointer"
                      aria-label="Thêm vào giỏ"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#5b728f] dark:text-zinc-400">
                Không có đơn hàng nào trong mục này.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-[#b9e7ff] dark:border-zinc-800 bg-[#edf8fe]/40 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ord.bookImage}
                        alt={ord.bookTitle}
                        referrerPolicy="no-referrer"
                        className="w-14 h-18 rounded-xl object-cover border border-[#b9e7ff] dark:border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-[11px] font-bold text-[#5b728f] dark:text-zinc-400">
                          <span className="font-mono text-[#0860c9] dark:text-sky-400">{ord.code}</span>
                          <span> · {ord.createdAt}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0860c9] dark:text-white truncate">
                          {ord.bookTitle}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-[#5b728f] dark:text-zinc-400 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#4086ee] shrink-0" />
                          <span>{ord.pickupLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#b9e7ff]/60 dark:border-zinc-800">
                      <span className="text-base font-black text-[#0860c9] dark:text-sky-400 tabular-nums">
                        {formatVND(ord.price)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4086ee] dark:text-sky-300">
                        {ord.status === 'completed' ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5" /> Đã giao
                          </>
                        ) : ord.status === 'preparing' ? (
                          <>
                            <Truck className="w-3.5 h-3.5" /> Chờ giao hàng
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeSubView === 'reviews' ? (
          <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white">
                  Đánh giá của tôi ({anonymousReviews.length})
                </h2>
                <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                  Các nhận xét 5 sao và đánh giá ẩn danh bạn đã gửi cho người bán.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {anonymousReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-[#b9e7ff] dark:border-zinc-800 bg-[#edf8fe]/40 dark:bg-zinc-900 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0860c9] dark:text-white">
                      <EyeOff className="w-4 h-4 text-[#4086ee]" />
                      <span>{rev.anonymousAlias || 'Sinh viên ẩn danh'}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#5b728f] dark:text-zinc-400">
                    {rev.bookTitle} · {rev.createdAt}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : activeSubView === 'reports' ? (
          <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white">
                  Báo cáo của tôi
                </h2>
                <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                  Theo dõi yêu cầu kiểm tra sách hoặc báo cáo vi phạm tài liệu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-2.5 p-3.5 rounded-2xl bg-[#edf8fe]/70 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800">
              <div className="text-xs font-bold text-[#0860c9] dark:text-white">
                Gửi báo cáo mới
              </div>
              <input
                type="text"
                value={newReportTitle}
                onChange={(e) => setNewReportTitle(e.target.value)}
                placeholder="Tiêu đề vấn đề (vd: Tài liệu thiếu trang, sai môn học...)"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-[#b9e7ff] dark:border-zinc-700 text-xs sm:text-sm text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee]"
              />
              <textarea
                rows={2}
                value={newReportDetail}
                onChange={(e) => setNewReportDetail(e.target.value)}
                placeholder="Mô tả chi tiết để UniDoc hỗ trợ nhanh..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-[#b9e7ff] dark:border-zinc-700 text-xs sm:text-sm text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi báo cáo</span>
              </button>
            </form>

            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl border border-[#b9e7ff] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0860c9] dark:text-white">
                      {rep.title}
                    </span>
                    <span className="text-[11px] font-bold text-[#4086ee] dark:text-sky-400 shrink-0">
                      {rep.status === 'resolved' ? 'Đã xử lý' : 'Đang xem xét'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5b728f] dark:text-zinc-400">
                    {rep.target} · {rep.date}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300">{rep.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ) : activeSubView === 'help' ? (
          <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white">
                  Trung tâm trợ giúp UniDoc
                </h2>
                <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                  Câu hỏi thường gặp và kênh hỗ trợ sinh viên toàn quốc.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {[
                {
                  q: 'Làm sao nhận sách giáo trình miễn phí ship tại trường?',
                  a: 'Bạn chọn phương thức "Hẹn gặp trực tiếp (Meetup)" tại Thư viện, Canteen hoặc cổng KTX để kiểm tra sách tận tay và không tốn phí vận chuyển.',
                },
                {
                  q: 'Đánh giá ẩn danh có giữ bí mật MSSV của tôi không?',
                  a: 'Có. Khi bật chế độ ẩn danh, hệ thống sẽ thay tên thật và MSSV thành biệt danh sinh viên trước khi hiển thị công khai.',
                },
                {
                  q: 'Làm thế nào để tăng Điểm uy tín lên 5.0?',
                  a: 'Hoàn tất giao dịch đúng hẹn, mô tả trung thực tình trạng sách giáo trình và tích cực đóng góp tài liệu chuẩn.',
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#edf8fe]/60 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 space-y-1"
                >
                  <div className="font-bold text-[#0860c9] dark:text-white">{faq.q}</div>
                  <p className="text-xs text-[#5b728f] dark:text-zinc-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#4086ee] text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold">Tổng đài hỗ trợ sinh viên UniDoc</div>
                <div className="text-sky-100">hotro@unidoc.edu.vn · 1900 6868 (7:00 – 22:00)</div>
              </div>
              <button
                type="button"
                onClick={onOpenVerification}
                className="px-3.5 py-2 rounded-xl bg-white text-[#0860c9] font-bold text-xs cursor-pointer self-start sm:self-auto"
              >
                Xác thực MSSV
              </button>
            </div>
          </section>
        ) : activeSubView === 'settings' ? (
          <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white">
                  Cài đặt tài khoản
                </h2>
                <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                  Tùy chỉnh giao diện, quyền riêng tư và thông báo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubView(null)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#edf8fe] dark:divide-zinc-800">
              {onToggleDarkMode && (
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center">
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Chế độ giao diện tối
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Chuyển đổi nền sáng xanh băng và nền tối bảo vệ mắt
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleDarkMode}
                    className={`w-12 h-7 rounded-full transition-colors p-1 cursor-pointer ${
                      darkMode ? 'bg-[#4086ee]' : 'bg-[#b9e7ff]'
                    }`}
                    aria-label="Bật tắt chế độ tối"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        darkMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}

              <div className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                    Thông báo đơn hàng & tin nhắn mới
                  </div>
                  <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                    Nhận nhắc nhở lịch hẹn giao sách tại trường
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyOrderUpdates(!notifyOrderUpdates)}
                  className={`w-12 h-7 rounded-full transition-colors p-1 cursor-pointer ${
                    notifyOrderUpdates ? 'bg-[#4086ee]' : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Bật tắt thông báo đơn hàng"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      notifyOrderUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                    Mặc định ẩn danh khi đánh giá
                  </div>
                  <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                    Bảo vệ thông tin cá nhân khi đánh giá người bán
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDefaultAnonymousReview(!defaultAnonymousReview)}
                  className={`w-12 h-7 rounded-full transition-colors p-1 cursor-pointer ${
                    defaultAnonymousReview ? 'bg-[#4086ee]' : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                  aria-label="Bật tắt ẩn danh mặc định"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      defaultAnonymousReview ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenVerification}
                className="w-full py-3.5 flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                      Xác thực thẻ sinh viên (MSSV)
                    </div>
                    <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                      Trạng thái: Đã xác thực sinh viên {profile.university}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5b728f] group-hover:text-[#4086ee]" />
              </button>
            </div>
          </section>
        ) : (
          /* MAIN ACCOUNT LANDING SCREEN */
          <>
            {/* 2. THẺ HỒ SƠ NGƯỜI DÙNG (Avatar tròn cho phép tải ảnh từ máy, Nguyễn Minh Anh, minhanh@edu.vn, ĐH Kinh tế TP.HCM, nút Chỉnh sửa hồ sơ) */}
            <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Avatar hình tròn + nút camera tải ảnh từ thiết bị */}
                  <div className="relative shrink-0">
                    <input
                      ref={directAvatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarFileSelect(e, 'direct')}
                      className="hidden"
                      aria-label="Tải ảnh đại diện từ máy"
                    />
                    <button
                      type="button"
                      onClick={() => directAvatarInputRef.current?.click()}
                      title="Đổi ảnh đại diện từ máy"
                      aria-label="Đổi ảnh đại diện từ máy"
                      className="relative group rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4086ee]"
                    >
                      {avatarError ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#4086ee] text-white flex items-center justify-center text-xl font-black border-2 border-[#b9e7ff]">
                          MA
                        </div>
                      ) : (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#b9e7ff] dark:border-zinc-700 shadow-xs group-hover:brightness-90 transition-all"
                        />
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#4086ee] hover:bg-[#0860c9] text-white border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                        <Camera className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h2 className="text-lg sm:text-xl font-black text-[#0860c9] dark:text-white truncate">
                      {profile.name}
                    </h2>
                    <div className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 truncate">
                      {profile.email}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#4086ee] dark:text-sky-400 truncate">
                      {profile.university}
                    </div>
                  </div>
                </div>

                {/* Nút "Chỉnh sửa hồ sơ" có icon bút chì, nền xanh nhạt, chữ xanh đậm */}
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUploadError(null);
                    setDraftProfile(profile);
                    setIsEditingProfile(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#edf8fe] hover:bg-[#dceffb] dark:bg-sky-950/60 dark:hover:bg-sky-900/60 border border-[#b9e7ff] dark:border-sky-800 text-[#0860c9] dark:text-sky-300 font-bold text-xs sm:text-sm transition-colors shrink-0 cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-[#0860c9] dark:text-sky-300" />
                  <span>Chỉnh sửa hồ sơ</span>
                </button>
              </div>
              {avatarUploadError && !isEditingProfile && (
                <p className="mt-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {avatarUploadError}
                </p>
              )}
            </section>

            {/* 3. THẺ ĐIỂM UY TÍN VÀ DANH HIỆU */}
            <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0860c9] dark:text-white">
                    Điểm uy tín
                  </h2>
                  <p className="text-xs text-[#5b728f] dark:text-zinc-400">
                    Đánh giá từ cộng đồng sinh viên UniDoc
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5" aria-label="4.8 trên 5 sao">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4
                            ? 'fill-[#4086ee] text-[#4086ee]'
                            : 'fill-[#b9e7ff] text-[#4086ee]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-black text-[#0860c9] dark:text-white tabular-nums">
                    4.8/5
                  </span>
                </div>
              </div>

              {/* Thanh tiến độ uy tín gọn gàng */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-[#edf8fe] dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4086ee]"
                    style={{ width: '96%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium text-[#5b728f] dark:text-zinc-400">
                  <span>Mức độ tin cậy: 96%</span>
                  <button
                    type="button"
                    onClick={onOpenTitlesGuide}
                    className="font-bold text-[#4086ee] hover:text-[#0860c9] hover:underline cursor-pointer"
                  >
                    Xem bảng danh hiệu
                  </button>
                </div>
              </div>

              {/* Các huy hiệu nhỏ tinh tế cùng tông xanh dương (không dùng quá nhiều màu) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 text-xs font-bold text-[#0860c9] dark:text-sky-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4086ee]" />
                  <span>Người mua tích cực</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 text-xs font-bold text-[#0860c9] dark:text-sky-300">
                  <Award className="w-3.5 h-3.5 text-[#4086ee]" />
                  <span>Người bán uy tín</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 text-xs font-bold text-[#0860c9] dark:text-sky-300">
                  <Star className="w-3.5 h-3.5 text-[#4086ee]" />
                  <span>Đóng góp tài liệu</span>
                </span>
              </div>
            </section>

            {/* 4. DANH SÁCH 7 CHỨC NĂNG (Nền trắng, icon xanh dương bên trái, mũi tên bên phải, đường phân cách mảnh) */}
            <section className="bg-white dark:bg-zinc-950 rounded-[18px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_6px_22px_rgba(64,134,238,0.08)] overflow-hidden">
              <div className="divide-y divide-[#edf8fe] dark:divide-zinc-800">
                {/* 1. Lịch sử mua hàng — icon hóa đơn */}
                <button
                  type="button"
                  onClick={() => setActiveSubView('orders')}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Lịch sử mua hàng
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        {orders.length} đơn hàng đã đặt · Sách đã xem
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 2. Tài liệu đã đăng — icon tệp tài liệu */}
                <button
                  type="button"
                  onClick={onOpenSellerDashboard}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Tài liệu đã đăng
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Quản lý {postedBooksCount} sách & tài liệu đang chia sẻ
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 3. Đánh giá của tôi — icon ngôi sao */}
                <button
                  type="button"
                  onClick={() => setActiveSubView('reviews')}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Đánh giá của tôi
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        {anonymousReviews.length} nhận xét 5 sao & đánh giá ẩn danh
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 4. Yêu thích — icon trái tim */}
                <button
                  type="button"
                  onClick={onNavigateFavorites}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Yêu thích
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Đang lưu {favoritesCount} sách & tài liệu học tập
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 5. Báo cáo của tôi — icon lá chắn */}
                <button
                  type="button"
                  onClick={() => setActiveSubView('reports')}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Báo cáo của tôi
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Theo dõi phản ánh chất lượng tài liệu ({reports.length})
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 6. Trung tâm trợ giúp — icon dấu hỏi */}
                <button
                  type="button"
                  onClick={() => setActiveSubView('help')}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Trung tâm trợ giúp
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Hướng dẫn giao dịch & hỗ trợ sinh viên
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>

                {/* 7. Cài đặt tài khoản — icon bánh răng */}
                <button
                  type="button"
                  onClick={() => setActiveSubView('settings')}
                  className="w-full px-4 sm:px-5 py-4 min-h-[58px] flex items-center justify-between gap-3 hover:bg-[#edf8fe]/60 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center shrink-0">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                        Cài đặt tài khoản
                      </div>
                      <div className="text-xs text-[#5b728f] dark:text-zinc-400">
                        Chế độ sáng/tối, thông báo và xác thực MSSV
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b728f] dark:text-zinc-400 group-hover:text-[#4086ee] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </div>
            </section>

            {/* 5. NÚT ĐĂNG XUẤT MÀU XANH #4086ee, CHỮ TRẮNG, BO TRÒN (Không dùng màu đỏ) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>

            {/* 6. MINH HỌA TINH TẾ Ở CUỐI MÀN HÌNH (Sách nhỏ, giấy bay và dấu tick xanh) */}
            <div className="pt-2 pb-4 text-center">
              <AccountBottomIllustration />
            </div>
          </>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsEditingProfile(false)}
        >
          <div
            className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0860c9] dark:text-white">
                Chỉnh sửa hồ sơ
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-2 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Đổi ảnh đại diện từ máy */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#edf8fe]/70 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800">
                <img
                  src={draftProfile.avatar}
                  alt={draftProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#b9e7ff] dark:border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="text-xs font-bold text-[#0860c9] dark:text-white">
                    Ảnh đại diện cá nhân
                  </div>
                  <input
                    ref={modalAvatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarFileSelect(e, 'draft')}
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => modalAvatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy</span>
                    </button>
                    {draftProfile.avatar !== DEFAULT_AVATAR && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraftProfile((prev) => ({ ...prev, avatar: DEFAULT_AVATAR }))
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-[#b9e7ff] dark:border-zinc-700 text-[#5b728f] dark:text-zinc-300 text-xs font-semibold hover:text-[#0860c9] cursor-pointer"
                      >
                        Khôi phục mặc định
                      </button>
                    )}
                  </div>
                  {avatarUploadError && (
                    <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                      {avatarUploadError}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-300 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={draftProfile.name}
                  onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#edf8fe]/60 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-300 mb-1">
                  Email sinh viên
                </label>
                <input
                  type="email"
                  value={draftProfile.email}
                  onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#edf8fe]/60 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-300 mb-1">
                  Trường đại học
                </label>
                <input
                  type="text"
                  value={draftProfile.university}
                  onChange={(e) =>
                    setDraftProfile({ ...draftProfile, university: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#edf8fe]/60 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-[#0860c9] dark:text-white focus:outline-hidden focus:border-[#4086ee]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-white text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION DIALOG (Clean blue theme, no glaring red) */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-2xl p-6 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#edf8fe] dark:bg-zinc-900 text-[#4086ee] flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0860c9] dark:text-white">
                Đăng xuất tài khoản?
              </h3>
              <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400">
                Danh sách yêu thích và lịch sử mua hàng của bạn vẫn được lưu lại trên UniDoc.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-[#0860c9] dark:text-white text-xs font-bold cursor-pointer"
              >
                Ở lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    setIsLoggedOut(true);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-xs font-bold cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
