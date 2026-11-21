import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CenteredPostBar } from './components/CenteredPostBar';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';
import { AddReviewModal } from './components/AddReviewModal';
import { PostBookModal } from './components/PostBookModal';
import { HumorousTitlesGuideModal } from './components/HumorousTitlesGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatModal } from './components/ChatModal';
import { StudentVerificationModal } from './components/StudentVerificationModal';
import { SellerDashboardModal } from './components/SellerDashboardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProfileView } from './components/ProfileView';
import { FavoritesView } from './components/FavoritesView';
import { BottomNav } from './components/BottomNav';
import { NotificationsModal } from './components/NotificationsModal';
import { HumorousBadge } from './components/HumorousBadge';
import { UniDocLogo } from './components/UniDocLogo';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { AuthRequiredModal } from './components/AuthRequiredModal';
import {
  INITIAL_BOOKS,
  INITIAL_REVIEWS,
  UNIVERSITIES,
  CATEGORIES,
  INITIAL_VERIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  HUMOROUS_SELLER_BADGES,
  HUMOROUS_BUYER_BADGES,
} from './data/mockData';
import { Book, BookReview, CartItem, VerificationRequest, AppNotification } from './types';
import {
  Building2,
  Sparkles,
  Flame,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  Phone,
  Mail,
  Heart,
  BookOpen,
  Filter,
  ArrowUpDown,
  Search,
} from 'lucide-react';

export default function App() {
  // Theme state: Sáng / Tối (Dark / Light mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unidoc_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('unidoc_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('unidoc_dark_mode', 'false');
      }
    } catch {}
  }, [darkMode]);

  // App navigation & authentication state ('home' | 'favorites' | 'profile')
  const [currentNavTab, setCurrentNavTab] = useState<'home' | 'favorites' | 'profile'>('home');
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unidoc_is_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [authPromptAction, setAuthPromptAction] = useState<string | null>(null);

  const requireAuth = (actionLabel: string, callback: () => void) => {
    if (!isLoggedIn) {
      setAuthPromptAction(actionLabel);
      return;
    }
    callback();
  };

  const handleSetLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    try {
      localStorage.setItem('unidoc_is_logged_in', value ? 'true' : 'false');
    } catch {}
  };

  // App core data state
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [reviews, setReviews] = useState<BookReview[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [likedBookIds, setLikedBookIds] = useState<string[]>([
    'fav_kinh_te_vi_mo',
    'fav_marketing_pdf',
    'fav_excel_qttc',
    'book_1',
    'book_3',
    'fav_phap_luat_doc',
  ]);
  const [viewedBooks, setViewedBooks] = useState<Book[]>([
    INITIAL_BOOKS[0],
    INITIAL_BOOKS[1],
    INITIAL_BOOKS[2],
  ]);

  // Filters & Search (theo ngành, theo trường)
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_50k' | 'under_30k'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating'>('default');

  // Modals visibility
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [selectedBookForReview, setSelectedBookForReview] = useState<Book | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isTitlesGuideOpen, setIsTitlesGuideOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetBook, setChatTargetBook] = useState<Book | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User simulated badge
  const currentUserBuyerBadge = HUMOROUS_BUYER_BADGES[1]; // Thần Đồng Ôn Thi Giờ Chót

  // Filtering logic: Lọc sách theo ngành, theo trường và từ khóa
  const filteredBooks = books.filter((book) => {
    // 1. Lọc theo trường
    if (selectedUniversityId !== 'all' && book.universityId !== selectedUniversityId) {
      return false;
    }
    // 2. Lọc theo ngành
    if (selectedMajor !== 'all') {
      const matchMajor =
        book.major.toLowerCase().includes(selectedMajor.toLowerCase()) ||
        book.category.toLowerCase().includes(selectedMajor.toLowerCase()) ||
        selectedMajor.toLowerCase().includes(book.major.toLowerCase());
      if (!matchMajor) return false;
    }
    // 3. Lọc theo danh mục
    if (selectedCategory !== 'all' && book.category !== selectedCategory) {
      return false;
    }
    // 4. Lọc theo mức giá
    if (priceFilter === 'under_50k' && book.price > 50000) return false;
    if (priceFilter === 'under_30k' && book.price > 30000) return false;
    // 5. Tìm kiếm từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchMajor = book.major.toLowerCase().includes(q);
      const matchUni = book.universityName.toLowerCase().includes(q);
      const matchSubject = (book.subjectCode || '').toLowerCase().includes(q);
      const matchIsbn = (book.isbn || '').toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchMajor && !matchUni && !matchSubject && !matchIsbn) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.seller.rating - a.seller.rating;
    return 0;
  });

  // Track viewed book
  const handleSelectBook = (book: Book) => {
    requireAuth('xem chi tiết và đặt mua tài liệu', () => {
      setSelectedBookForDetail(book);
      setViewedBooks((prev) => [book, ...prev.filter((b) => b.id !== book.id)]);
    });
  };

  // Cart operations
  const handleAddToCart = (book: Book, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    requireAuth('thêm sản phẩm vào giỏ hàng', () => {
      const existing = cartItems.find((item) => item.book.id === book.id);
      if (existing) {
        setCartItems(
          cartItems.map((item) =>
            item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCartItems([
          ...cartItems,
          {
            book,
            quantity: 1,
            selectedPickupOption: 'meetup',
            selectedPickupLocation: book.pickupLocations[0],
          },
        ]);
      }
      setIsCartOpen(true);
    });
  };

  const handleToggleLike = (bookId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    requireAuth('lưu tài liệu vào danh sách yêu thích', () => {
      setLikedBookIds((prev) =>
        prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [bookId, ...prev]
      );
    });
  };

  const handleStartChatWithSeller = (book: Book) => {
    requireAuth('nhắn tin với người bán', () => {
      setChatTargetBook(book);
      setIsChatOpen(true);
    });
  };

  const handleAddReview = (newReviewData: Omit<BookReview, 'id' | 'createdAt' | 'likes'>) => {
    const newRev: BookReview = {
      ...newReviewData,
      id: `rev_${Date.now()}`,
      createdAt: 'Vừa xong',
      likes: 0,
    };
    setReviews([newRev, ...reviews]);
  };

  const handleAddNewBook = (newBook: Book) => {
    setBooks([newBook, ...books]);
    // Also notify
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Đăng sách thành công',
      message: `Giáo trình "${newBook.title}" đã được đăng lên UniDoc và sẵn sàng cho sinh viên tìm kiếm.`,
      type: 'order',
      createdAt: 'Vừa xong',
      read: false,
      relatedBookTitle: newBook.title,
    };
    setNotifications([notif, ...notifications]);
  };

  const handleDeleteMyBook = (bookId: string) => {
    setBooks(books.filter((b) => b.id !== bookId));
  };

  const handleCheckoutSuccess = () => {
    // Generate order in orders list
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      const newOrder = {
        id: `ord_${Date.now()}`,
        code: `UD-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'pending_confirmation', // Chờ xác nhận
        createdAt: 'Vừa xong',
        bookTitle: firstItem.book.title,
        bookImage:
          firstItem.book.images[0] ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        price: firstItem.book.price,
        quantity: firstItem.quantity,
        sellerName: firstItem.book.seller.name,
        sellerAvatar: firstItem.book.seller.avatar,
        sellerBadge: firstItem.book.seller.sellerBadge,
        university: firstItem.book.universityName,
        pickupLocation: firstItem.book.pickupLocations[0],
        paymentMethod: 'Tiền mặt khi nhận sách (Meetup)',
        notes: 'Hẹn gặp trực tiếp tại trường',
      };
      setOrders([newOrder, ...orders]);

      // Add notification
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: `Đơn sách mới: ${newOrder.code}`,
        message: `Đơn đặt sách "${firstItem.book.title}" đang chờ người bán xác nhận giờ hẹn.`,
        type: 'order',
        createdAt: 'Vừa xong',
        read: false,
        relatedBookTitle: firstItem.book.title,
      };
      setNotifications([newNotif, ...notifications]);
    }

    setCartItems([]);
    setIsCartOpen(false);
    setCurrentNavTab('profile');
    alert('Đặt sách thành công! Đơn hàng đã được chuyển vào mục "Chờ xác nhận" trong Trang cá nhân của bạn.');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  if (authScreen === 'login') {
    return (
      <LoginScreen
        onSwitchToRegister={() => setAuthScreen('register')}
        onLoginSuccess={(loggedInEmail) => {
          try {
            const raw = localStorage.getItem('unidoc_user_profile');
            const prev = raw ? JSON.parse(raw) : {};
            localStorage.setItem(
              'unidoc_user_profile',
              JSON.stringify({
                name: prev.name || 'Nguyễn Minh Anh',
                avatar: prev.avatar || '',
                email: loggedInEmail || prev.email || 'minhanh@edu.vn',
                university: prev.university || 'ĐH Kinh tế TP.HCM',
              })
            );
          } catch {}
          handleSetLoggedIn(true);
          setAuthScreen(null);
          setCurrentNavTab('home');
        }}
        onBackToHome={() => setAuthScreen(null)}
      />
    );
  }

  if (authScreen === 'register') {
    return (
      <RegisterScreen
        universities={UNIVERSITIES}
        onSwitchToLogin={() => setAuthScreen('login')}
        onCompleteRegister={(data) => {
          try {
            const raw = localStorage.getItem('unidoc_user_profile');
            const prev = raw ? JSON.parse(raw) : {};
            localStorage.setItem(
              'unidoc_user_profile',
              JSON.stringify({
                name: prev.name || 'Nguyễn Minh Anh',
                avatar: prev.avatar || '',
                email: data.email || prev.email || 'minhanh@edu.vn',
                university: data.universityName || prev.university || 'ĐH Kinh tế TP.HCM',
              })
            );
          } catch {}
          handleSetLoggedIn(true);
          setAuthScreen(null);
          setCurrentNavTab('home');
        }}
        onBackToHome={() => setAuthScreen(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F7FF] dark:bg-black text-slate-900 dark:text-white transition-colors pb-24 sm:pb-28">
      {/* Navbar with brand identity, search filter by university & major, and toolbar */}
      <Navbar
        universities={UNIVERSITIES}
        selectedUniversityId={selectedUniversityId}
        onSelectUniversity={(id) => setSelectedUniversityId(id)}
        selectedMajor={selectedMajor}
        onSelectMajor={(m) => setSelectedMajor(m)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        cartCount={isLoggedIn ? cartItems.reduce((acc, it) => acc + it.quantity, 0) : 0}
        onOpenCart={() => requireAuth('mở giỏ hàng', () => setIsCartOpen(true))}
        onOpenChat={() =>
          requireAuth('mở tin nhắn trao đổi sách', () => {
            setChatTargetBook(books[0]);
            setIsChatOpen(true);
          })
        }
        onOpenTitlesGuide={() => requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))}
        onOpenSellerDashboard={() =>
          requireAuth('mở Kênh Người Bán', () => setIsSellerDashboardOpen(true))
        }
        onOpenVerificationModal={() =>
          requireAuth('xác thực MSSV', () => setIsVerificationOpen(true))
        }
        onOpenAdminPanel={() =>
          requireAuth('truy cập Quản trị UniDoc', () => setIsAdminPanelOpen(true))
        }
        currentNavTab={currentNavTab}
        onNavigateTab={(tab) => {
          if (tab === 'home') {
            setCurrentNavTab('home');
            return;
          }
          requireAuth(
            tab === 'profile' ? 'truy cập Trang cá nhân' : 'xem Danh sách yêu thích',
            () => setCurrentNavTab(tab)
          );
        }}
        onOpenNotifications={() =>
          requireAuth('xem thông báo tài khoản', () => setIsNotificationsOpen(true))
        }
        unreadNotificationsCount={isLoggedIn ? unreadNotifsCount : 0}
        unreadMessagesCount={isLoggedIn ? 2 : 0}
        favoritesCount={isLoggedIn ? likedBookIds.length : 0}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLogin={() => setAuthScreen('login')}
        onOpenRegister={() => setAuthScreen('register')}
        isLoggedIn={isLoggedIn}
      />

      {/* VIEW ROUTING: HOME VIEW VS FAVORITES VIEW VS PERSONAL PROFILE VIEW */}
      {isLoggedIn && currentNavTab === 'favorites' ? (
        <FavoritesView
          favoriteBooks={likedBookIds
            .map((id) => books.find((b) => b.id === id))
            .filter((b): b is Book => Boolean(b))}
          onSelectBook={(b) => handleSelectBook(b)}
          onAddToCart={(b, e) => handleAddToCart(b, e)}
          onRemoveFavorite={(id, e) => handleToggleLike(id, e)}
          onExploreDocuments={() => setCurrentNavTab('home')}
        />
      ) : isLoggedIn && currentNavTab === 'profile' ? (
        /* PERSONAL PROFILE VIEW WITH ALL REQUESTED SECTIONS:
           - Chờ xác nhận
           - Chờ giao hàng
           - Đơn hàng đã giao
           - Đánh giá ẩn danh
           - Lịch sử mua hàng
           - Sản phẩm đã xem */
        <ProfileView
          orders={orders}
          viewedBooks={viewedBooks}
          anonymousReviews={reviews.filter((r) => r.isAnonymous)}
          favoritesCount={likedBookIds.length}
          postedBooksCount={books.filter((b) => b.seller.id === 'user_viet_anh').length}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onSelectBook={(b) => handleSelectBook(b)}
          onAddToCart={(b) => handleAddToCart(b)}
          onOpenTitlesGuide={() => setIsTitlesGuideOpen(true)}
          onOpenVerification={() => setIsVerificationOpen(true)}
          onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
          onNavigateFavorites={() => setCurrentNavTab('favorites')}
          onBackToHome={() => setCurrentNavTab('home')}
          onOpenChatWithSeller={(b) => handleStartChatWithSeller(b)}
          onLogout={() => {
            handleSetLoggedIn(false);
            setCurrentNavTab('home');
            setAuthScreen('login');
          }}
        />
      ) : (
        /* HOMEPAGE VIEW */
        <>
          {/* Hero Welcome Banner */}
          <section className="bg-gradient-to-b from-sky-600 via-sky-700 to-blue-800 text-white pt-6 pb-8 px-4 relative overflow-hidden">
            {/* Abstract book shapes background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="max-w-2xl text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-yellow-300 font-extrabold text-xs border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chợ Sách Giáo Trình Sinh Viên Toàn Quốc</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Sách Hay Trao Tay, <br className="hidden sm:inline" />
                  <span className="text-amber-300">Nhẹ Gánh Học Kỳ</span> Với UniDoc!
                </h1>

                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xl">
                  Nền tảng mua bán & pass sách giáo trình cũ xác thực MSSV. Tìm sách chính xác theo{' '}
                  <b>Trường</b> và <b>Ngành học</b>, hỗ trợ{' '}
                  <b>đánh giá ẩn danh kèm hình ảnh/video 5 sao</b> và vinh danh danh hiệu hài hước!
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Xác thực MSSV 100%
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" /> Giao miễn ship tại KTX/Thư viện
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" /> Đánh giá ẩn danh bảo mật
                  </span>
                </div>
              </div>

              {/* Humorous Title Spotlight Widget */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 p-4 rounded-3xl max-w-sm w-full text-white shadow-2xl shrink-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Bảng Vinh Danh Tuần Này
                  </span>
                  <button
                    onClick={() => requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))}
                    className="text-[11px] text-sky-300 hover:text-white underline cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚔️</span>
                      <div>
                        <div className="text-xs font-bold text-emerald-300">Chiến Thần Pass Sách K70</div>
                        <div className="text-[10px] text-slate-400">Vũ Việt Anh (14 sách đã pass)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      Tier 2
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <div className="text-xs font-bold text-amber-300">Thần Đồng Ôn Thi Giờ Chót</div>
                        <div className="text-[10px] text-slate-400">Trần Văn Nam (6 sách đã săn)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">
                      Tier 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CENTRALIZED POST TOOLBAR ("Thanh công cụ đăng bài nằm ở chính giữa") */}
          <section className="-mt-6 relative z-20">
            <CenteredPostBar
              onOpenPostModal={() =>
                requireAuth('đăng bán sách và tài liệu', () => setIsPostModalOpen(true))
              }
              onOpenTitlesGuide={() =>
                requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))
              }
              onQuickFilter50k={() =>
                requireAuth('lọc sách ưu đãi dưới 50.000đ', () =>
                  setPriceFilter(priceFilter === 'under_50k' ? 'all' : 'under_50k')
                )
              }
              activeFilter={priceFilter}
              totalBooksCount={books.length}
            />
          </section>

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex-1 w-full space-y-6">
            {/* Active Search & Filter Indicators */}
            {(selectedUniversityId !== 'all' || selectedMajor !== 'all' || searchQuery) && (
              <div className="bg-sky-50 dark:bg-zinc-950 border border-sky-200 dark:border-zinc-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sky-900 dark:text-sky-300">Bộ lọc đang áp dụng:</span>
                  {selectedUniversityId !== 'all' && (
                    <span className="bg-white dark:bg-zinc-900 border border-sky-300 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-sky-800 dark:text-white font-semibold flex items-center gap-1">
                      Trường:{' '}
                      {UNIVERSITIES.find((u) => u.id === selectedUniversityId)?.shortName}
                      <button
                        onClick={() => setSelectedUniversityId('all')}
                        className="hover:text-rose-600 ml-1 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedMajor !== 'all' && (
                    <span className="bg-white dark:bg-zinc-900 border border-sky-300 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-sky-800 dark:text-white font-semibold flex items-center gap-1">
                      Ngành: {selectedMajor}
                      <button
                        onClick={() => setSelectedMajor('all')}
                        className="hover:text-rose-600 ml-1 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-white dark:bg-zinc-900 border border-sky-300 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-sky-800 dark:text-white font-semibold flex items-center gap-1">
                      Từ khóa: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:text-rose-600 ml-1 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedUniversityId('all');
                    setSelectedMajor('all');
                    setSelectedCategory('all');
                    setPriceFilter('all');
                    setSearchQuery('');
                  }}
                  className="font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-200 underline cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* University Filter Carousel */}
            <section className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-500" />
                  <span>Sách Giáo Trình Theo Trường Đại Học (Toàn Quốc)</span>
                </h3>
                {selectedUniversityId !== 'all' && (
                  <button
                    onClick={() => setSelectedUniversityId('all')}
                    className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
                  >
                    Xem toàn bộ trường
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedUniversityId('all')}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedUniversityId === 'all'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-white'
                  }`}
                >
                  Toàn quốc ({books.length})
                </button>

                {UNIVERSITIES.map((uni) => {
                  const count = books.filter((b) => b.universityId === uni.id).length;
                  return (
                    <button
                      key={uni.id}
                      onClick={() => setSelectedUniversityId(uni.id)}
                      className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedUniversityId === uni.id
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-white'
                      }`}
                    >
                      <span>{uni.shortName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedUniversityId === uni.id
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Categories Bar & Sorting Row */}
            <section className="space-y-3">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Sub-filtering & Sorting Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-slate-500 dark:text-zinc-300 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Lọc nhanh:
                  </span>
                  <button
                    onClick={() =>
                      setPriceFilter(priceFilter === 'under_50k' ? 'all' : 'under_50k')
                    }
                    className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                      priceFilter === 'under_50k'
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                        : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Dưới 50.000đ ⚡
                  </button>
                  <button
                    onClick={() =>
                      setPriceFilter(priceFilter === 'under_30k' ? 'all' : 'under_30k')
                    }
                    className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                      priceFilter === 'under_30k'
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                        : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Dưới 30.000đ (Tiết kiệm khủng)
                  </button>
                </div>

                {/* Sorter */}
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-300" />
                  <span className="text-slate-500 dark:text-zinc-300">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1 font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="default">Mới đăng gần đây</option>
                    <option value="price_asc">Giá từ thấp đến cao</option>
                    <option value="price_desc">Giá từ cao đến thấp</option>
                    <option value="rating">Người bán uy tín nhất</option>
                  </select>
                </div>
              </div>
            </section>


            {/* Books Marketplace Grid */}
            <section>
              {filteredBooks.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-zinc-950 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-zinc-900 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Không tìm thấy cuốn giáo trình phù hợp
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                    Bạn có thể thử tìm theo tên môn, mã môn, hoặc đăng bài tìm mua để bạn học cùng trường pass lại nhé!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedUniversityId('all');
                      setSelectedMajor('all');
                      setSelectedCategory('all');
                      setPriceFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onSelect={(b) => handleSelectBook(b)}
                      onAddToCart={(b, e) => handleAddToCart(b, e)}
                      onToggleLike={(id, e) => handleToggleLike(id, e)}
                      isLiked={likedBookIds.includes(book.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* System Titles Explanatory Banner */}
            <section className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 rounded-3xl p-6 text-white border border-sky-700/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> TÍNH NĂNG ĐỘC QUYỀN UNIDOC
                </div>
                <h3 className="text-xl font-black text-white">
                  Hệ Thống Danh Hiệu Sinh Viên
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Càng pass nhiều sách cũ hoặc càng săn nhiều giáo trình, bạn càng nhận được danh hiệu uy tín như{' '}
                  <b>"Chiến Thần Pass Sách K70"</b> hay <b>"Mọt Sách Xuyên Lục Địa"</b> cùng nhiều ưu đãi phí sàn và quà tặng KTX!
                </p>
              </div>

              <button
                onClick={() => requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                Xem bảng Danh hiệu & Đặc quyền
              </button>
            </section>
          </main>
        </>
      )}

      {/* PRIMARY BOTTOM TOOLBAR (4 evenly divided tabs: Trang chủ, Đăng bài, Yêu thích, Cá nhân) */}
      <BottomNav
        currentTab={isLoggedIn ? currentNavTab : 'home'}
        onNavigateHome={() => setCurrentNavTab('home')}
        onNavigateFavorites={() =>
          requireAuth('xem Danh sách yêu thích', () => setCurrentNavTab('favorites'))
        }
        onNavigateProfile={() =>
          requireAuth('truy cập Trang cá nhân', () => setCurrentNavTab('profile'))
        }
        onOpenPostBook={() =>
          requireAuth('đăng bán sách và tài liệu', () => setIsPostModalOpen(true))
        }
        favoritesCount={isLoggedIn ? likedBookIds.length : 0}
      />

      {/* Footer (Đã bỏ mục Trường đối tác, chữ Uni có màu trắng) */}
      <footer className="mt-12 bg-slate-900 dark:bg-black text-slate-400 dark:text-zinc-300 text-xs border-t border-slate-800 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            {/* Logo ở chân trang với chữ 'Uni' màu trắng theo đúng yêu cầu */}
            <UniDocLogo size="md" variant="footer" uniColor="text-white" />
            <p className="text-slate-400 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              UniDoc - Nền tảng chợ sách giáo trình sinh viên số 1 Việt Nam. Kết nối bạn đọc từ hơn 40+ trường đại học trên cả nước, đồng hành cùng sinh viên mọi kỳ thi.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2.5">
              Tính năng nổi bật
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>• Lọc sách theo ngành và theo trường toàn quốc</li>
              <li>• Xác thực sinh viên bằng MSSV & Email trường</li>
              <li>• Đánh giá ẩn danh người bán bảo mật</li>
              <li>• Video / Hình ảnh kiểm tra sách 5 sao</li>
              <li>• Hệ thống Danh hiệu Người Bán & Người Mua</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2.5">
              Hỗ trợ sinh viên
            </h4>
            <p className="text-xs text-slate-400 dark:text-zinc-400">
              Có thắc mắc hoặc cần giải đáp tranh chấp nhận sách tại KTX?
            </p>
            <div className="mt-2 text-white font-bold">
              hotro@unidoc.edu.vn • 1900 6868
            </div>
            <div className="mt-2 text-[11px] text-slate-400 dark:text-zinc-400">
              Thời gian hỗ trợ: 7:00 - 22:00 hàng ngày (kể cả mùa thi)
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 dark:border-zinc-800 py-3 text-center text-[11px] text-slate-500 dark:text-zinc-400">
          © 2026 UniDoc - Chợ Sách Sinh Viên Toàn Quốc. Bản quyền giao diện & thương hiệu đã được đăng ký.
        </div>
      </footer>

      {/* ALL MODALS */}
      {/* 1. Notifications Modal ("thông báo") */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNavigateToOrder={() => {
          setIsNotificationsOpen(false);
          setCurrentNavTab('profile');
        }}
      />

      {/* 2. Book Detail Modal with Anonymous Reviews & Video Player */}
      <BookDetailModal
        book={selectedBookForDetail}
        reviews={reviews}
        onClose={() => setSelectedBookForDetail(null)}
        onAddToCart={(b) => handleAddToCart(b)}
        onChatWithSeller={(b) => handleStartChatWithSeller(b)}
        onOpenAddReview={(b) => setSelectedBookForReview(b)}
        isLiked={selectedBookForDetail ? likedBookIds.includes(selectedBookForDetail.id) : false}
        onToggleLike={(id) => handleToggleLike(id)}
      />

      {/* 3. Add 5-Star Review with Anonymous Switch & Video Upload Modal */}
      {selectedBookForReview && (
        <AddReviewModal
          book={selectedBookForReview}
          currentUserBuyerBadge={currentUserBuyerBadge}
          isOpen={!!selectedBookForReview}
          onClose={() => setSelectedBookForReview(null)}
          onSubmitReview={(newRev) => handleAddReview(newRev)}
        />
      )}

      {/* 4. Post a Book Step-by-Step Wizard Modal (Hình dấu cộng "+") */}
      <PostBookModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        universities={UNIVERSITIES}
        onAddBook={(newBook) => handleAddNewBook(newBook)}
      />

      {/* 5. Humorous Titles & Badges Guide Modal */}
      <HumorousTitlesGuideModal
        isOpen={isTitlesGuideOpen}
        onClose={() => setIsTitlesGuideOpen(false)}
        userSalesCount={5}
        userBuyCount={6}
      />

      {/* 6. Cart Drawer & Checkout Flow */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={(id) => setCartItems(cartItems.filter((i) => i.book.id !== id))}
        onUpdateQuantity={(id, q) =>
          setCartItems(cartItems.map((i) => (i.book.id === id ? { ...i, quantity: q } : i)))
        }
        onCheckout={handleCheckoutSuccess}
      />

      {/* 7. Chat Drawer with Seller */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeBook={chatTargetBook}
        onAddToCart={(b) => handleAddToCart(b)}
      />

      {/* 8. Student Verification Modal (MSSV & Email trường) */}
      <StudentVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        universities={UNIVERSITIES}
        isVerified={true}
      />

      {/* 9. Seller Hub / Store Management Modal */}
      <SellerDashboardModal
        isOpen={isSellerDashboardOpen}
        onClose={() => setIsSellerDashboardOpen(false)}
        myBooks={books.filter((b) => b.seller.id === 'user_viet_anh')}
        onOpenPostBook={() => setIsPostModalOpen(true)}
        onDeleteBook={(id) => handleDeleteMyBook(id)}
      />

      {/* 10. Admin Moderation Panel */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        verifications={verifications}
        onApproveVerification={(id) =>
          setVerifications(
            verifications.map((v) => (v.id === id ? { ...v, status: 'approved' } : v))
          )
        }
        onRejectVerification={(id) =>
          setVerifications(
            verifications.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v))
          )
        }
        books={books}
      />

      {/* 11. Auth Required Modal for unauthenticated interactions */}
      <AuthRequiredModal
        isOpen={authPromptAction !== null}
        actionLabel={authPromptAction}
        onClose={() => setAuthPromptAction(null)}
        onGoToLogin={() => {
          setAuthPromptAction(null);
          setAuthScreen('login');
        }}
        onGoToRegister={() => {
          setAuthPromptAction(null);
          setAuthScreen('register');
        }}
      />
    </div>
  );
}
