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
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { AuthRequiredModal } from './components/AuthRequiredModal';
import { getRankBadgeForCount } from './components/RankAvatar';
import { getRandomAnimalAvatar, isCustomUploadedAvatar } from './utils/animalAvatars';
import {
  INITIAL_BOOKS,
  INITIAL_REVIEWS,
  UNIVERSITIES,
  CATEGORIES,
  INITIAL_VERIFICATIONS,
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

interface StoredUserActivity {
  orders: any[];
  likedBookIds: string[];
  viewedBookIds: string[];
  notifications: AppNotification[];
}

const getActivityStorageKey = (email: string) =>
  `unidoc_activity_${email.trim().toLowerCase()}`;

function loadInitialBooksFromStorage(): Book[] {
  let deletedIds: string[] = [];
  let userPosted: Book[] = [];
  try {
    const deletedRaw = localStorage.getItem('unidoc_deleted_book_ids');
    const parsedDeleted = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (Array.isArray(parsedDeleted)) {
      deletedIds = parsedDeleted;
    }
    const postedRaw = localStorage.getItem('unidoc_user_posted_books');
    const parsedPosted = postedRaw ? JSON.parse(postedRaw) : [];
    if (Array.isArray(parsedPosted)) {
      userPosted = parsedPosted;
    }
  } catch {}

  const seenIds = new Set<string>();
  const combined: Book[] = [];
  for (const b of [...userPosted, ...INITIAL_BOOKS]) {
    if (b && b.id && !deletedIds.includes(b.id) && !seenIds.has(b.id)) {
      seenIds.add(b.id);
      combined.push(b);
    }
  }
  return combined;
}

function loadInitialReviewsFromStorage(): BookReview[] {
  let userReviews: BookReview[] = [];
  try {
    const raw = localStorage.getItem('unidoc_user_reviews');
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      userReviews = parsed;
    }
  } catch {}

  const seenIds = new Set<string>();
  const combined: BookReview[] = [];
  for (const r of [...userReviews, ...INITIAL_REVIEWS]) {
    if (r && r.id && !seenIds.has(r.id)) {
      seenIds.add(r.id);
      combined.push(r);
    }
  }
  return combined;
}

function loadStoredActivity(
  email: string,
  availableBooks: Book[]
): {
  orders: any[];
  likedBookIds: string[];
  viewedBooks: Book[];
  notifications: AppNotification[];
} {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return { orders: [], likedBookIds: [], viewedBooks: [], notifications: [] };
  }
  try {
    const raw = localStorage.getItem(getActivityStorageKey(normalized));
    if (!raw) {
      return { orders: [], likedBookIds: [], viewedBooks: [], notifications: [] };
    }
    const parsed = JSON.parse(raw) as Partial<StoredUserActivity>;
    const orders = Array.isArray(parsed.orders) ? parsed.orders : [];
    const likedBookIds = Array.isArray(parsed.likedBookIds) ? parsed.likedBookIds : [];
    const viewedBookIds = Array.isArray(parsed.viewedBookIds) ? parsed.viewedBookIds : [];
    const viewedBooks = viewedBookIds
      .map((id) => availableBooks.find((b) => b.id === id))
      .filter((b): b is Book => Boolean(b));
    const notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
    return { orders, likedBookIds, viewedBooks, notifications };
  } catch {
    return { orders: [], likedBookIds: [], viewedBooks: [], notifications: [] };
  }
}

function saveStoredActivity(email: string, activity: StoredUserActivity) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  try {
    localStorage.setItem(getActivityStorageKey(normalized), JSON.stringify(activity));
  } catch {}
}

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
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | 'forgot-password' | null>(
    null
  );
  const [authPrefillEmail, setAuthPrefillEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('unidoc_is_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [authPromptAction, setAuthPromptAction] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('unidoc_current_email') || '';
    } catch {
      return '';
    }
  });
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('unidoc_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed.avatar === 'string' &&
          parsed.avatar.trim().length > 0 &&
          !parsed.avatar.includes('photo-1534528741775-53994a69daeb')
        ) {
          return parsed.avatar;
        }
      }
    } catch {}
    return getRandomAnimalAvatar();
  });
  const [userDisplayName, setUserDisplayName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('unidoc_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.username || parsed.name || '';
      }
    } catch {}
    return '';
  });
  const [userUniversity, setUserUniversity] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('unidoc_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.university || 'ĐH Kinh tế TP.HCM';
      }
    } catch {}
    return 'ĐH Kinh tế TP.HCM';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkoutToast, setCheckoutToast] = useState<string | null>(null);

  const currentUserId = currentUserEmail
    ? `user_${currentUserEmail.trim().toLowerCase()}`
    : 'user_guest';

  const verifyAdminStatus = async (emailToCheck: string) => {
    const normalized = emailToCheck.trim().toLowerCase();
    if (!normalized) {
      setIsAdmin(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalized }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(Boolean(data.isAdmin));
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      verifyAdminStatus(currentUserEmail);
    } else {
      setIsAdmin(false);
    }
  }, [isLoggedIn, currentUserEmail]);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [currentNavTab]);

  const requireAuth = (actionLabel: string, callback: () => void) => {
    if (!isLoggedIn) {
      setAuthPromptAction(actionLabel);
      return;
    }
    callback();
  };

  const handleSetLoggedIn = (value: boolean, emailValue?: string) => {
    setIsLoggedIn(value);
    try {
      localStorage.setItem('unidoc_is_logged_in', value ? 'true' : 'false');
      if (value && emailValue) {
        const normalized = emailValue.trim().toLowerCase();
        setCurrentUserEmail(normalized);
        localStorage.setItem('unidoc_current_email', normalized);
      } else if (!value) {
        setCurrentUserEmail('');
        setIsAdmin(false);
        localStorage.removeItem('unidoc_current_email');
      }
    } catch {}
  };

  // App core data state (excluding listings removed by administrator)
  const [books, setBooks] = useState<Book[]>(() => loadInitialBooksFromStorage());
  const [reviews, setReviews] = useState<BookReview[]>(() => loadInitialReviewsFromStorage());
  const [verifications, setVerifications] = useState<VerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Per-user personal activity (empty by default for new & first-time logged-in accounts)
  const [activeActivityEmail, setActiveActivityEmail] = useState<string>(() =>
    isLoggedIn && currentUserEmail ? currentUserEmail.trim().toLowerCase() : ''
  );
  const [orders, setOrders] = useState<any[]>(() =>
    isLoggedIn && currentUserEmail
      ? loadStoredActivity(currentUserEmail, loadInitialBooksFromStorage()).orders
      : []
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    isLoggedIn && currentUserEmail
      ? loadStoredActivity(currentUserEmail, loadInitialBooksFromStorage()).notifications
      : []
  );
  const [likedBookIds, setLikedBookIds] = useState<string[]>(() =>
    isLoggedIn && currentUserEmail
      ? loadStoredActivity(currentUserEmail, loadInitialBooksFromStorage()).likedBookIds
      : []
  );
  const [viewedBooks, setViewedBooks] = useState<Book[]>(() =>
    isLoggedIn && currentUserEmail
      ? loadStoredActivity(currentUserEmail, loadInitialBooksFromStorage()).viewedBooks
      : []
  );

  useEffect(() => {
    const normalized = currentUserEmail.trim().toLowerCase();
    if (isLoggedIn && normalized && activeActivityEmail === normalized) {
      saveStoredActivity(normalized, {
        orders,
        likedBookIds,
        viewedBookIds: viewedBooks.map((b) => b.id),
        notifications,
      });
    }
  }, [isLoggedIn, currentUserEmail, activeActivityEmail, orders, likedBookIds, viewedBooks, notifications]);

  // Filters & Search (theo ngành, theo trường)
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
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

  // User real activity counts & dynamic rank badge
  const myBooks = isLoggedIn ? books.filter((b) => b.seller.id === currentUserId) : [];
  const myReviews = isLoggedIn ? reviews.filter((r) => r.reviewerId === currentUserId) : [];
  const currentRankBadge = isLoggedIn
    ? getRankBadgeForCount(myBooks.length + orders.length)
    : null;
  const currentRankTier = currentRankBadge?.tier ?? 0;
  const currentUserBuyerBadge =
    HUMOROUS_BUYER_BADGES.slice()
      .reverse()
      .find((b) => orders.length >= b.minThreshold) || HUMOROUS_BUYER_BADGES[0];

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
    // 4. Lọc theo mức giá (0 - 200k)
    if (maxPrice < 200000 && book.price > maxPrice) return false;
    // 5. Tìm kiếm từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchMajor = book.major.toLowerCase().includes(q);
      const matchUni = book.universityName.toLowerCase().includes(q);
      const matchSubject = (book.subjectCode || '').toLowerCase().includes(q);
      const matchSubjectName = (book.subjectName || '').toLowerCase().includes(q);
      const matchIsbn = (book.isbn || '').toLowerCase().includes(q);
      if (
        !matchTitle &&
        !matchAuthor &&
        !matchMajor &&
        !matchUni &&
        !matchSubject &&
        !matchSubjectName &&
        !matchIsbn
      ) {
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
    setReviews((prev) => [newRev, ...prev]);
    try {
      const raw = localStorage.getItem('unidoc_user_reviews');
      const prevSaved: BookReview[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        'unidoc_user_reviews',
        JSON.stringify([newRev, ...(Array.isArray(prevSaved) ? prevSaved : [])])
      );
    } catch {}
  };

  const handleAddNewBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    try {
      const raw = localStorage.getItem('unidoc_user_posted_books');
      const prevSaved: Book[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        'unidoc_user_posted_books',
        JSON.stringify([newBook, ...(Array.isArray(prevSaved) ? prevSaved : [])])
      );
    } catch {}
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
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleDeleteMyBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
    setLikedBookIds((prev) => prev.filter((id) => id !== bookId));
    setViewedBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      const raw = localStorage.getItem('unidoc_user_posted_books');
      const prevSaved: Book[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(prevSaved)) {
        localStorage.setItem(
          'unidoc_user_posted_books',
          JSON.stringify(prevSaved.filter((b) => b.id !== bookId))
        );
      }
    } catch {}
  };

  const handleAdminDeleteBook = async (bookId: string): Promise<boolean> => {
    if (!isLoggedIn || !isAdmin || !currentUserEmail) {
      return false;
    }

    try {
      const authRes = await fetch('/api/admin/authorize-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUserEmail }),
      });
      if (!authRes.ok) {
        setIsAdmin(false);
        return false;
      }
      const authData = await authRes.json();
      if (!authData.authorized) {
        setIsAdmin(false);
        return false;
      }
    } catch {
      return false;
    }

    const removedBook = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
    setLikedBookIds((prev) => prev.filter((id) => id !== bookId));
    setViewedBooks((prev) => prev.filter((b) => b.id !== bookId));

    try {
      const postedRaw = localStorage.getItem('unidoc_user_posted_books');
      const prevPosted: Book[] = postedRaw ? JSON.parse(postedRaw) : [];
      if (Array.isArray(prevPosted)) {
        localStorage.setItem(
          'unidoc_user_posted_books',
          JSON.stringify(prevPosted.filter((b) => b.id !== bookId))
        );
      }
      const deletedRaw = localStorage.getItem('unidoc_deleted_book_ids');
      const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      const nextDeleted = Array.isArray(deletedIds)
        ? Array.from(new Set([...deletedIds, bookId]))
        : [bookId];
      localStorage.setItem('unidoc_deleted_book_ids', JSON.stringify(nextDeleted));
    } catch {}

    if (removedBook) {
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: 'Quản trị: Đã xóa tin đăng',
        message: `Tin đăng "${removedBook.title}" đã được quản trị viên gỡ bỏ khỏi UniDoc.`,
        type: 'order',
        createdAt: 'Vừa xong',
        read: false,
        relatedBookTitle: removedBook.title,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return true;
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
    setCheckoutToast(
      'Đặt sách thành công! Đơn hàng đã được chuyển vào mục "Lịch sử mua hàng" và bạn đã tích Điểm uy tín.'
    );
    setTimeout(() => {
      setCheckoutToast(null);
    }, 5000);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  if (authScreen === 'login') {
    return (
      <LoginScreen
        initialEmail={authPrefillEmail}
        onSwitchToRegister={() => setAuthScreen('register')}
        onSwitchToForgotPassword={(typedEmail) => {
          if (typedEmail) setAuthPrefillEmail(typedEmail);
          setAuthScreen('forgot-password');
        }}
        onLoginSuccess={async (loggedInEmail) => {
          const normalized = loggedInEmail.trim().toLowerCase();
          setAuthPrefillEmail('');
          try {
            const accRaw = localStorage.getItem('unidoc_registered_accounts');
            const accList = accRaw ? JSON.parse(accRaw) : [];
            const matchedAccount = Array.isArray(accList)
              ? accList.find(
                  (acc: { email?: string }) =>
                    (acc.email || '').toLowerCase() === normalized
                )
              : null;

            const raw = localStorage.getItem('unidoc_user_profile');
            const prev = raw ? JSON.parse(raw) : {};
            const resolvedUsername =
              matchedAccount?.username ||
              (prev.email?.toLowerCase() === normalized ? prev.username || prev.name : '') ||
              normalized.split('@')[0];
            const resolvedUniversity =
              matchedAccount?.universityName ||
              (prev.email?.toLowerCase() === normalized ? prev.university : '') ||
              'ĐH Kinh tế TP.HCM';

            const resolvedAvatar =
              prev.email?.toLowerCase() === normalized && isCustomUploadedAvatar(prev.avatar)
                ? prev.avatar
                : getRandomAnimalAvatar();

            setUserAvatar(resolvedAvatar);
            setUserDisplayName(resolvedUsername);
            setUserUniversity(resolvedUniversity);
            localStorage.setItem(
              'unidoc_user_profile',
              JSON.stringify({
                name: resolvedUsername,
                username: resolvedUsername,
                avatar: resolvedAvatar,
                email: normalized,
                university: resolvedUniversity,
              })
            );
          } catch {
            setUserAvatar(getRandomAnimalAvatar());
          }
          const loaded = loadStoredActivity(normalized, books);
          setOrders(loaded.orders);
          setLikedBookIds(loaded.likedBookIds);
          setViewedBooks(loaded.viewedBooks);
          setNotifications(loaded.notifications);
          setCartItems([]);
          setActiveActivityEmail(normalized);
          handleSetLoggedIn(true, normalized);
          await verifyAdminStatus(normalized);
          setAuthScreen(null);
          setCurrentNavTab('home');
        }}
        onBackToHome={() => setAuthScreen(null)}
      />
    );
  }

  if (authScreen === 'forgot-password') {
    return (
      <ForgotPasswordScreen
        initialEmail={authPrefillEmail}
        onReturnToLogin={(verifiedEmail) => {
          if (verifiedEmail) setAuthPrefillEmail(verifiedEmail);
          setAuthScreen('login');
        }}
        onSwitchToRegister={() => setAuthScreen('register')}
        onBackToHome={() => setAuthScreen(null)}
      />
    );
  }

  if (authScreen === 'register') {
    return (
      <RegisterScreen
        universities={UNIVERSITIES}
        onSwitchToLogin={() => setAuthScreen('login')}
        onSwitchToForgotPassword={(typedEmail) => {
          if (typedEmail) setAuthPrefillEmail(typedEmail);
          setAuthScreen('forgot-password');
        }}
        onCompleteRegister={async (data) => {
          const normalized = data.email.trim().toLowerCase();
          const resolvedUniversity = data.universityName || 'ĐH Kinh tế TP.HCM';
          setAuthPrefillEmail('');
          try {
            const raw = localStorage.getItem('unidoc_user_profile');
            const prev = raw ? JSON.parse(raw) : {};
            const resolvedAvatar =
              prev.email?.toLowerCase() === normalized && isCustomUploadedAvatar(prev.avatar)
                ? prev.avatar
                : getRandomAnimalAvatar();

            setUserAvatar(resolvedAvatar);
            setUserDisplayName(data.username);
            setUserUniversity(resolvedUniversity);
            localStorage.setItem(
              'unidoc_user_profile',
              JSON.stringify({
                name: data.username,
                username: data.username,
                avatar: resolvedAvatar,
                email: normalized,
                university: resolvedUniversity,
              })
            );
          } catch {
            setUserAvatar(getRandomAnimalAvatar());
          }
          // Brand new account: strictly zero activity across all sections
          saveStoredActivity(normalized, {
            orders: [],
            likedBookIds: [],
            viewedBookIds: [],
            notifications: [],
          });
          setOrders([]);
          setLikedBookIds([]);
          setViewedBooks([]);
          setNotifications([]);
          setCartItems([]);
          setActiveActivityEmail(normalized);
          handleSetLoggedIn(true, normalized);
          await verifyAdminStatus(normalized);
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
        maxPrice={maxPrice}
        onMaxPriceChange={(price) => setMaxPrice(price)}
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
          scrollToTop();
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
        unreadMessagesCount={0}
        favoritesCount={isLoggedIn ? likedBookIds.length : 0}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLogin={() => setAuthScreen('login')}
        onOpenRegister={() => setAuthScreen('register')}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        userAvatar={userAvatar}
        userDisplayName={userDisplayName}
        userRankTier={currentRankTier}
      />

      {checkoutToast && (
        <div className="max-w-3xl mx-auto px-4 pt-3 w-full">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-sm">
            <span>{checkoutToast}</span>
            <button
              type="button"
              onClick={() => setCheckoutToast(null)}
              className="text-xs font-bold underline cursor-pointer shrink-0"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* VIEW ROUTING: HOME VIEW VS FAVORITES VIEW VS PERSONAL PROFILE VIEW */}
      {isLoggedIn && currentNavTab === 'favorites' ? (
        <FavoritesView
          favoriteBooks={likedBookIds
            .map((id) => books.find((b) => b.id === id))
            .filter((b): b is Book => Boolean(b))}
          onSelectBook={(b) => handleSelectBook(b)}
          onAddToCart={(b, e) => handleAddToCart(b, e)}
          onRemoveFavorite={(id, e) => handleToggleLike(id, e)}
          onExploreDocuments={() => {
            scrollToTop();
            setCurrentNavTab('home');
          }}
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
          anonymousReviews={myReviews}
          favoritesCount={likedBookIds.length}
          postedBooksCount={myBooks.length}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onSelectBook={(b) => handleSelectBook(b)}
          onAddToCart={(b) => handleAddToCart(b)}
          onOpenTitlesGuide={() => setIsTitlesGuideOpen(true)}
          onOpenVerification={() => setIsVerificationOpen(true)}
          onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
          onOpenPostBook={() => {
            scrollToTop();
            setIsPostModalOpen(true);
          }}
          onNavigateFavorites={() => {
            scrollToTop();
            setCurrentNavTab('favorites');
          }}
          onBackToHome={() => {
            scrollToTop();
            setCurrentNavTab('home');
          }}
          onOpenChatWithSeller={(b) => handleStartChatWithSeller(b)}
          onLogout={() => {
            setOrders([]);
            setLikedBookIds([]);
            setViewedBooks([]);
            setNotifications([]);
            setCartItems([]);
            setActiveActivityEmail('');
            setUserDisplayName('');
            handleSetLoggedIn(false);
            setCurrentNavTab('home');
            setAuthScreen('login');
          }}
          onAvatarUpdated={(nextAvatar) => setUserAvatar(nextAvatar)}
          onUsernameUpdated={(nextName) => setUserDisplayName(nextName)}
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

              {/* Bảng Vàng UniDoc Spotlight Widget */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 p-4 rounded-3xl max-w-sm w-full text-white shadow-2xl shrink-0">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Bảng Vàng UniDoc
                  </span>
                  <button
                    onClick={() => requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))}
                    className="text-[11px] text-sky-300 hover:text-white underline cursor-pointer"
                  >
                    Xem 5 Hạng
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-400/30">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👑</span>
                      <div>
                        <div className="text-xs font-bold text-amber-300">Huyền Thoại Tàng Kinh Các</div>
                        <div className="text-[10px] text-slate-300">Trên 50 sách/tài liệu • Khung Vàng lấp lánh</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded shrink-0">
                      Hạng 5
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-sky-500/10 border border-cyan-400/30">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💎</span>
                      <div>
                        <div className="text-xs font-bold text-cyan-300">Đại Sư Tàng Thư</div>
                        <div className="text-[10px] text-slate-300">31 – 40 sách • Khung Bạch Kim phát sáng</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-sky-950 px-1.5 py-0.5 rounded shrink-0">
                      Hạng 4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CENTRALIZED POST TOOLBAR ("Thanh công cụ đăng bài nằm ở chính giữa") */}
          <section className="-mt-6 relative z-20">
            <CenteredPostBar
              onOpenPostModal={() => {
                scrollToTop();
                requireAuth('đăng bán sách và tài liệu', () => setIsPostModalOpen(true));
              }}
              onOpenTitlesGuide={() =>
                requireAuth('xem bảng Danh hiệu', () => setIsTitlesGuideOpen(true))
              }
              onQuickFilter50k={() =>
                requireAuth('lọc sách ưu đãi dưới 50.000đ', () =>
                  setMaxPrice(maxPrice === 50000 ? 200000 : 50000)
                )
              }
              activeFilter={maxPrice === 50000 ? 'under_50k' : 'all'}
              totalBooksCount={books.length}
            />
          </section>

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 flex-1 w-full space-y-6">
            {/* Active Search & Filter Indicators */}
            {(selectedUniversityId !== 'all' ||
              selectedMajor !== 'all' ||
              searchQuery ||
              maxPrice < 200000) && (
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
                  {maxPrice < 200000 && (
                    <span className="bg-white dark:bg-zinc-900 border border-sky-300 dark:border-zinc-700 px-2.5 py-1 rounded-lg text-sky-800 dark:text-white font-semibold flex items-center gap-1">
                      Giá: 0đ – {new Intl.NumberFormat('vi-VN').format(maxPrice)}đ
                      <button
                        onClick={() => setMaxPrice(200000)}
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
                    setMaxPrice(200000);
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-zinc-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-slate-500 dark:text-zinc-300 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> Lọc nhanh:
                    </span>
                    <button
                      onClick={() => setMaxPrice(maxPrice === 50000 ? 200000 : 50000)}
                      className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                        maxPrice === 50000
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                          : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      Dưới 50.000đ ⚡
                    </button>
                    <button
                      onClick={() => setMaxPrice(maxPrice === 30000 ? 200000 : 30000)}
                      className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${
                        maxPrice === 30000
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                          : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      Dưới 30.000đ
                    </button>
                  </div>

                  {/* Interactive 0 - 200k Price Range Slider */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-xs flex-1 max-w-md">
                    <span className="font-bold text-[#0860c9] dark:text-sky-400 whitespace-nowrap">
                      Giá: 0đ – {maxPrice === 0 ? '0đ' : `${Math.round(maxPrice / 1000)}k`}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={200000}
                      step={5000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      aria-label="Lọc theo giá từ 0 đến 200k"
                      className="flex-1 min-w-[110px] accent-[#4086ee] cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap">
                      200k
                    </span>
                  </div>
                </div>

                {/* Sorter */}
                <div className="flex items-center gap-2 text-xs shrink-0">
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
                    Bạn có thể thử tìm theo tên sách, tên môn học, điều chỉnh khoảng giá hoặc đăng bài tìm mua nhé!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedUniversityId('all');
                      setSelectedMajor('all');
                      setSelectedCategory('all');
                      setMaxPrice(200000);
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
                  <Sparkles className="w-3.5 h-3.5" /> HỆ THỐNG DANH HIỆU UNIDOC
                </div>
                <h3 className="text-xl font-black text-white">
                  Thăng Hạng Từ Sứ Giả Sách Mới Đến Huyền Thoại Tàng Kinh Các
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Tích lũy sách và tài liệu để mở khóa khung Avatar{' '}
                  <b>Đồng · Bạc · Vàng · Bạch Kim phát sáng · Vàng lấp lánh</b>, ghim bài đăng, tự động duyệt tin, vinh danh <b>Bảng Vàng UniDoc</b> và Voucher giảm 10k!
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
        onNavigateHome={() => {
          scrollToTop();
          setCurrentNavTab('home');
        }}
        onNavigateFavorites={() => {
          scrollToTop();
          requireAuth('xem Danh sách yêu thích', () => setCurrentNavTab('favorites'));
        }}
        onNavigateProfile={() => {
          scrollToTop();
          requireAuth('truy cập Trang cá nhân', () => setCurrentNavTab('profile'));
        }}
        onOpenPostBook={() => {
          scrollToTop();
          requireAuth('đăng bán sách và tài liệu', () => setIsPostModalOpen(true));
        }}
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
              unidoc819@gmail.com • 1900 6868
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
          currentUser={{
            id: currentUserId,
            name: userDisplayName || 'Sinh viên UniDoc',
            avatar: userAvatar,
          }}
        />
      )}

      {/* 4. Post a Book Step-by-Step Wizard Modal (Hình dấu cộng "+") */}
      <PostBookModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        universities={UNIVERSITIES}
        onAddBook={(newBook) => handleAddNewBook(newBook)}
        currentSellerSalesCount={myBooks.length}
        currentUser={{
          id: currentUserId,
          name: userDisplayName || 'Sinh viên UniDoc',
          avatar: userAvatar,
          university: userUniversity,
        }}
      />

      {/* 5. UniDoc Rank & Badges Guide Modal */}
      <HumorousTitlesGuideModal
        isOpen={isTitlesGuideOpen}
        onClose={() => setIsTitlesGuideOpen(false)}
        userSalesCount={myBooks.length}
        userBuyCount={orders.length}
        userAvatar={userAvatar}
        userName={userDisplayName || 'Sinh viên UniDoc'}
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
        userRankTier={currentRankTier}
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
        myBooks={myBooks}
        onOpenPostBook={() => setIsPostModalOpen(true)}
        onDeleteBook={(id) => handleDeleteMyBook(id)}
      />

      {/* 10. Admin Moderation Panel (Only authorized administrator can view/use) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        isAdmin={isAdmin}
        onClose={() => setIsAdminPanelOpen(false)}
        verifications={isAdmin ? verifications : []}
        onApproveVerification={(id) => {
          if (!isAdmin) return;
          setVerifications(
            verifications.map((v) => (v.id === id ? { ...v, status: 'approved' } : v))
          );
        }}
        onRejectVerification={(id) => {
          if (!isAdmin) return;
          setVerifications(
            verifications.map((v) => (v.id === id ? { ...v, status: 'rejected' } : v))
          );
        }}
        books={isAdmin ? books : []}
        onDeleteBook={handleAdminDeleteBook}
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
