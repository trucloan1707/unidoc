export type ConditionType = 'like_new' | 'good' | 'fair' | 'acceptable';

export interface HumorousBadgeInfo {
  id: string;
  name: string;
  category: 'seller' | 'buyer';
  tier: number; // 1 to 5
  minThreshold: number;
  icon: string;
  badgeColor: string;
  textColor: string;
  bgGradient: string;
  description: string;
  funnyQuote: string;
  perk: string;
}

export interface ReviewBreakdown {
  conditionAccuracy: number; // 1-5
  deliverySpeed: number; // 1-5
  sellerAttitude: number; // 1-5
  packaging: number; // 1-5
}

export interface BookReview {
  id: string;
  bookId: string;
  bookTitle: string;
  sellerId: string;
  reviewerId: string;
  reviewerName: string;
  isAnonymous: boolean; // "đánh giá ẩn danh người bán"
  anonymousAlias?: string; // e.g. "Kỳ thủ giấu tên K21 (ĐH Bách Khoa)"
  reviewerAvatar?: string;
  rating: number; // 1-5 sao
  breakdown: ReviewBreakdown;
  comment: string;
  images: string[];
  videoUrl?: string; // "hình ảnh/video sách đánh giá thang 5 sao"
  videoThumbnail?: string;
  verifiedStudent: boolean;
  reviewerBuyerBadge?: HumorousBadgeInfo;
  createdAt: string;
  likes: number;
  sellerReply?: {
    comment: string;
    createdAt: string;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  edition?: string;
  publishYear?: number;
  price: number;
  originalPrice?: number;
  condition: ConditionType;
  conditionNotes?: {
    hasHighlight: boolean;
    hasPencilNotes: boolean;
    hasCoverDamage: boolean;
    pagesMissing: boolean;
  };
  description: string;
  category: string;
  universityId: string;
  universityName: string;
  major: string;
  subjectCode?: string;
  subjectName?: string;
  images: string[];
  videoUrl?: string; // Short video preview of the textbook
  seller: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    major: string;
    isVerifiedStudent: boolean;
    studentIdMasked: string; // e.g. "211****"
    sellerBadge: HumorousBadgeInfo;
    buyerBadge: HumorousBadgeInfo;
    salesCount: number;
    buyCount: number;
    rating: number;
    reviewCount: number;
    responseRate: string;
    responseTime: string;
  };
  pickupLocations: string[]; // e.g. ["KTX Khu B", "Thư viện trung tâm ĐHQG", "Canteen C6"]
  allowShipping: boolean;
  stock: number;
  status: 'active' | 'reserved' | 'sold';
  createdAt: string;
  likesCount: number;
  viewCount: number;
  itemType?: 'book' | 'digital';
  fileFormat?: 'PDF' | 'DOC' | 'XLS';
  academicYear?: string;
}

export interface University {
  id: string;
  code: string;
  name: string;
  shortName: string;
  city: string;
  logo: string;
  studentEmailDomain: string;
  popularMajors: string[];
  campuses: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedPickupOption: 'meetup' | 'shipping';
  selectedPickupLocation?: string;
}

export interface Order {
  id: string;
  code: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: 'cash_on_meetup' | 'momo' | 'vnpay' | 'cod';
  pickupType: 'meetup' | 'shipping';
  meetupLocation?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    university: string;
    dormRoom?: string;
  };
  status: 'pending_confirmation' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled';
  createdAt: string;
  reviewed?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isOffer?: boolean;
  offerPrice?: number;
  bookAttachment?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

export interface VerificationRequest {
  id: string;
  studentName: string;
  universityId: string;
  studentIdNumber: string;
  studentEmail: string;
  cardImage: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'badge' | 'review' | 'system';
  createdAt: string;
  read: boolean;
  relatedBookTitle?: string;
}

