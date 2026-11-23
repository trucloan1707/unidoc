import React, { useState, useRef } from 'react';
import { Book, BookReview, HumorousBadgeInfo } from '../types';
import {
  X,
  Star,
  Camera,
  Video,
  Shield,
  EyeOff,
  Check,
  AlertCircle,
  Play,
  Trash2,
  Upload,
} from 'lucide-react';
import { processImageFiles } from '../utils/imageUpload';

interface AddReviewUser {
  id: string;
  name: string;
  avatar?: string;
}

interface AddReviewModalProps {
  book: Book;
  currentUserBuyerBadge: HumorousBadgeInfo;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Omit<BookReview, 'id' | 'createdAt' | 'likes'>) => void;
  currentUser?: AddReviewUser;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  book,
  currentUserBuyerBadge,
  isOpen,
  onClose,
  onSubmitReview,
  currentUser,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-turning-the-pages-of-a-book-41584-large.mp4'
  );
  const [hasVideo, setHasVideo] = useState(true);

  // Criteria ratings
  const [breakdown, setBreakdown] = useState({
    conditionAccuracy: 5,
    deliverySpeed: 5,
    sellerAttitude: 5,
    packaging: 5,
  });

  const quickTags = [
    'Sách mới hơn tưởng tượng ✨',
    'Ghi chú thi cử cực chuẩn 📝',
    'Chủ shop rep nhanh 5 sao ⚡',
    'Hẹn lấy tại KTX đúng giờ 📍',
    'Tiết kiệm tiền kỳ này 💰',
    'Bọc sách kỹ càng 📦',
  ];

  if (!isOpen) return null;

  const handleAddTag = (tag: string) => {
    if (!comment.includes(tag)) {
      setComment((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleProcessSelectedFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploadingImages(true);
    setImageUploadError(null);
    const { dataUrls, error } = await processImageFiles(fileList, {
      maxCount: 5,
      currentCount: images.length,
      maxDimension: 1080,
      maxFileSizeMB: 10,
    });
    if (dataUrls.length > 0) {
      setImages((prev) => [...prev, ...dataUrls].slice(0, 5));
    }
    if (error) {
      setImageUploadError(error);
    }
    setIsUploadingImages(false);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    await handleProcessSelectedFiles(files);
    e.target.value = '';
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    await handleProcessSelectedFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitReview({
      bookId: book.id,
      bookTitle: book.title,
      sellerId: book.seller.id,
      reviewerId: currentUser?.id || 'user_current',
      reviewerName: currentUser?.name || 'Sinh viên UniDoc',
      isAnonymous,
      anonymousAlias: isAnonymous
        ? `Sinh viên ${book.major.slice(0, 10)} ẩn danh`
        : undefined,
      reviewerAvatar: isAnonymous ? undefined : currentUser?.avatar,
      rating,
      breakdown,
      comment,
      images,
      videoUrl: hasVideo ? videoUrl : undefined,
      videoThumbnail: hasVideo ? images[0] : undefined,
      verifiedStudent: true,
      reviewerBuyerBadge: currentUserBuyerBadge,
    });

    setComment('');
    setImages([]);
    setImageUploadError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Đánh giá sách & người bán
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {book.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* ANONYMOUS REVIEW TOGGLE ("đánh giá ẩn danh người bán") */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 border border-sky-200/80 dark:border-zinc-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0 mt-0.5">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Đánh giá ẩn danh (Bảo mật sinh viên)
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      Khuyên dùng
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 mt-0.5">
                    Tên thật, avatar và MSSV của bạn sẽ được ẩn. Bạn cùng lớp hoặc người bán sẽ không nhận ra bạn.
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-zinc-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            {isAnonymous && (
              <div className="mt-2.5 pt-2 border-t border-sky-200/60 dark:border-zinc-800 text-[11px] font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>
                  Hiển thị công khai: <b>Sinh viên {book.major.slice(0, 12)} ẩn danh (K22)</b>
                </span>
              </div>
            )}
          </div>

          {/* 5-STAR OVERALL RATING */}
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
            <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Chấm điểm tổng quan cho cuốn sách
            </div>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-slate-300 dark:text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
              {rating === 5 && 'Tuyệt vời! Sách xuất sắc & người bán uy tín'}
              {rating === 4 && 'Hài lòng! Sách chất lượng tốt đúng cam kết'}
              {rating === 3 && 'Bình thường, sách dùng được'}
              {rating === 2 && 'Chưa hài lòng, sách có khuyết điểm chưa báo'}
              {rating === 1 && 'Kém, không đúng mô tả'}
            </div>
          </div>

          {/* DETAILED CRITERIA BREAKDOWN */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Chi tiết tiêu chí đánh giá
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'conditionAccuracy', label: 'Đúng mô tả độ mới' },
                { key: 'deliverySpeed', label: 'Tốc độ hẹn giao tại trường' },
                { key: 'sellerAttitude', label: 'Thái độ người bán' },
                { key: 'packaging', label: 'Đóng gói/Bảo quản sách' },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800"
                >
                  <span className="font-medium text-slate-700 dark:text-white">{label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() =>
                          setBreakdown((prev) => ({
                            ...prev,
                            [key]: s,
                          }))
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            s <= breakdown[key as keyof typeof breakdown]
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHOTO & VIDEO UPLOADS ("thêm hình ảnh/video sách đánh giá thang 5 sao") */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Hình ảnh & Video thực tế sách
              </label>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                {images.length}/5 ảnh & 1 video lật sách
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Media previews */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingImages(true);
              }}
              onDragLeave={() => setIsDraggingImages(false)}
              onDrop={handleImageDrop}
              className={`p-3 rounded-2xl border-2 border-dashed transition-colors ${
                isDraggingImages
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/50'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Photo previews */}
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-18 h-18 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden group shadow-xs bg-white dark:bg-zinc-900"
                  >
                    <img
                      src={img}
                      alt={`Ảnh đánh giá ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== idx));
                        setImageUploadError(null);
                      }}
                      aria-label={`Xóa ảnh ${idx + 1}`}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add image button from device */}
                {images.length < 5 && (
                  <button
                    type="button"
                    disabled={isUploadingImages}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-18 h-18 rounded-xl border-2 border-dashed border-sky-400 dark:border-sky-700 hover:border-sky-600 text-sky-700 dark:text-sky-400 flex flex-col items-center justify-center gap-1 px-1 text-center text-[10px] font-bold transition-colors cursor-pointer bg-sky-50 dark:bg-zinc-900 hover:bg-sky-100 dark:hover:bg-zinc-800 disabled:opacity-60"
                  >
                    {isUploadingImages ? (
                      <span>Đang tải...</span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span className="leading-tight">Tải ảnh từ máy</span>
                      </>
                    )}
                  </button>
                )}

                {/* Video preview / toggle */}
                {hasVideo ? (
                  <div className="relative w-28 h-18 rounded-xl border-2 border-sky-400 overflow-hidden bg-slate-900 flex items-center justify-center group shadow-xs">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover opacity-80"
                      muted
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="p-1 rounded-full bg-sky-500 text-white shadow-md">
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </div>
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-slate-950/80 px-1 rounded">
                      Video lật trang
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasVideo(false)}
                      aria-label="Xóa video đính kèm"
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setHasVideo(true)}
                    className="h-18 px-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>+ Đính kèm Video</span>
                  </button>
                )}
              </div>

              <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400">
                Chọn ảnh JPG, PNG, WEBP trực tiếp từ thiết bị (tối đa 5 ảnh, mỗi ảnh dưới 10MB).
              </p>
            </div>

            {imageUploadError && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{imageUploadError}</span>
              </div>
            )}
          </div>

          {/* TEXT COMMENT */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Nội dung nhận xét
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn: sách có highlight không, người bán giao đúng hẹn không..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
              required
            />

            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-sky-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white hover:text-sky-800 dark:hover:text-sky-300 border border-transparent dark:border-zinc-800 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Gửi Đánh Giá {isAnonymous ? '(Ẩn Danh An Toàn)' : ''}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
