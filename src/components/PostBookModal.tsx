import React, { useState, useRef } from 'react';
import { Book, ConditionType, University } from '../types';
import {
  X,
  Camera,
  Video,
  Upload,
  Check,
  Award,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { HUMOROUS_SELLER_BADGES } from '../data/mockData';
import { processImageFiles } from '../utils/imageUpload';

interface PostBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  onAddBook: (newBook: Book) => void;
  currentSellerSalesCount?: number;
}

export const PostBookModal: React.FC<PostBookModalProps> = ({
  isOpen,
  onClose,
  universities,
  onAddBook,
  currentSellerSalesCount = 5,
}) => {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('Toán & Khoa học cơ bản');
  const [universityId, setUniversityId] = useState('');
  const [uniSearchFilter, setUniSearchFilter] = useState('');
  const [major, setMajor] = useState('Khoa học Máy tính');
  const [subjectName, setSubjectName] = useState('');
  const [condition, setCondition] = useState<ConditionType>('good');
  const [hasHighlight] = useState(true);
  const [hasPencilNotes] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(30000);
  const [originalPrice, setOriginalPrice] = useState<number>(85000);
  const [pickupLocations, setPickupLocations] = useState<string[]>([]);
  const [hasCustomizedLocations, setHasCustomizedLocations] = useState(false);
  const [locationType, setLocationType] = useState<'ktx' | 'campus' | 'other'>('ktx');
  const [newLocationInput, setNewLocationInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-turning-the-pages-of-a-book-41584-large.mp4'
  );
  const [includeVideo, setIncludeVideo] = useState(true);

  if (!isOpen) return null;

  const selectedUni = universities.find((u) => u.id === universityId);
  const filteredUniversities = universities.filter((u) => {
    if (!uniSearchFilter.trim()) return true;
    const q = uniSearchFilter.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    );
  });

  const suggestedLocations = Array.from(
    new Set([
      ...(selectedUni?.campuses || []),
      'KTX Khu A',
      'KTX Khu B',
      'Cơ sở chính',
      'Cơ sở 2',
      'Thư viện trung tâm',
    ])
  );

  const handleProcessSelectedFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsUploadingImages(true);
    setImageUploadError(null);
    const { dataUrls, error } = await processImageFiles(fileList, {
      maxCount: 6,
      currentCount: images.length,
      maxDimension: 1200,
      maxFileSizeMB: 10,
    });
    if (dataUrls.length > 0) {
      setImages((prev) => [...prev, ...dataUrls].slice(0, 6));
      setStepError(null);
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

  const handleSelectUniversity = (nextUniId: string) => {
    setUniversityId(nextUniId);
    setStepError(null);
    const uni = universities.find((u) => u.id === nextUniId);
    if (uni && !hasCustomizedLocations) {
      setPickupLocations(uni.campuses.slice(0, 2));
    }
  };

  const handleToggleSuggestedLocation = (loc: string) => {
    setHasCustomizedLocations(true);
    setPickupLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const handleAddLocation = () => {
    const raw = newLocationInput.trim();
    if (!raw) return;

    let formatted = raw;
    if (locationType === 'ktx' && !raw.toLowerCase().includes('ktx') && !raw.toLowerCase().includes('ký túc xá')) {
      formatted = `KTX: ${raw}`;
    } else if (locationType === 'campus' && !raw.toLowerCase().includes('cơ sở')) {
      formatted = `Cơ sở: ${raw}`;
    }

    if (!pickupLocations.includes(formatted)) {
      setHasCustomizedLocations(true);
      setPickupLocations([...pickupLocations, formatted]);
    }
    setNewLocationInput('');
  };

  const validateStep = (targetStep: number): string | null => {
    if (targetStep === 1) {
      if (!title.trim()) {
        return 'Vui lòng nhập Tên sách giáo trình / Tài liệu.';
      }
    }
    if (targetStep === 2) {
      if (!universityId || !selectedUni) {
        return 'Vui lòng chọn Trường đại học áp dụng sách.';
      }
      if (!subjectName.trim()) {
        return 'Vui lòng nhập Tên môn học.';
      }
    }
    if (targetStep === 3) {
      if (images.length === 0) {
        return 'Vui lòng tải lên ít nhất 1 hình ảnh thực tế của sách.';
      }
    }
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    for (const s of [1, 2, 3]) {
      const err = validateStep(s);
      if (err) {
        setStep(s);
        setStepError(err);
        return;
      }
    }

    if (!selectedUni) return;

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'Nhiều tác giả',
      publisher: publisher.trim() || 'NXB Giáo Dục',
      publishYear: 2023,
      price: Number(price),
      originalPrice: Number(originalPrice) || undefined,
      condition,
      conditionNotes: {
        hasHighlight,
        hasPencilNotes,
        hasCoverDamage: false,
        pagesMissing: false,
      },
      description: description.trim() || 'Sách giáo trình còn mới, thích hợp cho sinh viên chuẩn bị học phần.',
      category,
      universityId,
      universityName: selectedUni.name,
      major: major.trim() || 'Đại cương',
      subjectName: subjectName.trim(),
      images: images,
      videoUrl: includeVideo ? videoUrl : undefined,
      seller: {
        id: 'user_current',
        name: 'Trần Văn Nam',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        university: selectedUni.name,
        major: major.trim() || 'Đại cương',
        isVerifiedStudent: true,
        studentIdMasked: '2214***',
        sellerBadge: HUMOROUS_SELLER_BADGES[1], // Chiến Thần Pass Sách K70
        buyerBadge: {
          id: 'buyer_tier_2',
          name: 'Thần Đồng Ôn Thi Giờ Chót',
          category: 'buyer',
          tier: 2,
          minThreshold: 4,
          icon: '⚡',
          badgeColor: 'border-amber-500 bg-amber-50 text-amber-900',
          textColor: 'text-amber-900',
          bgGradient: 'from-amber-400 to-yellow-600',
          description: 'Đã mua 4-10 cuốn',
          funnyQuote: 'Trước ngày thi 48 giờ mới hốt hoảng mở UniDoc tìm sách cứu mạng!',
          perk: 'Ưu tiên ship hỏa tốc',
        },
        salesCount: currentSellerSalesCount + 1,
        buyCount: 6,
        rating: 5.0,
        reviewCount: 4,
        responseRate: '100%',
        responseTime: 'Trong 5 phút',
      },
      pickupLocations:
        pickupLocations.length > 0
          ? pickupLocations
          : selectedUni.campuses.slice(0, 1).length > 0
          ? selectedUni.campuses.slice(0, 1)
          : ['Cổng trường chính'],
      allowShipping: true,
      stock: 1,
      status: 'active',
      createdAt: 'Vừa xong',
      likesCount: 1,
      viewCount: 12,
    };

    onAddBook(newBook);
    setStep(1);
    setStepError(null);
    setTitle('');
    setAuthor('');
    setPublisher('');
    setUniversityId('');
    setUniSearchFilter('');
    setSubjectName('');
    setDescription('');
    setPickupLocations([]);
    setHasCustomizedLocations(false);
    setNewLocationInput('');
    setImages([]);
    setImageUploadError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                Bước {step}/4
              </span>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Đăng bán sách giáo trình
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {step === 1 && '1. Thông tin cơ bản sách'}
              {step === 2 && '2. Phân loại theo trường & môn học'}
              {step === 3 && '3. Hình ảnh & Video lật sách'}
              {step === 4 && '4. Tình trạng, Giá & Điểm hẹn KTX'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Humorous Title Progress Incentive Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-900 border-b border-amber-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-semibold">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              Pass thêm cuốn này để thăng hạng danh hiệu: <b>"Chiến Thần Pass Sách K70"</b> ⚔️
            </span>
          </div>
          <span className="text-[11px] font-bold text-orange-600 dark:text-amber-400 hidden sm:inline">
            +1 Điểm Uy Tín
          </span>
        </div>

        {/* Step Form Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Tên sách giáo trình / Tài liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giáo Trình Giải Tích 1, Nguyên Lý Kế Toán..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Tác giả / Giảng viên chủ biên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: PGS. TS. Nguyễn Đình Huy"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Nhà xuất bản
                  </label>
                  <input
                    type="text"
                    placeholder="NXB ĐHQG TP.HCM, NXB Kinh Tế..."
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Danh mục chuyên môn
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm focus:border-sky-500 focus:outline-hidden bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="Toán & Khoa học cơ bản">Toán & KHTN</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin (IT)</option>
                    <option value="Kinh tế & Quản trị kinh doanh">Kinh tế & QTKD</option>
                    <option value="Khoa học xã hội & Lý luận">Khoa học xã hội & Triết</option>
                    <option value="Y khoa & Sức khỏe">Y khoa & Dược</option>
                    <option value="Ngoại ngữ & Luyện thi">Ngoại ngữ & Chứng chỉ</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Trường đại học áp dụng sách ({universities.length} trường toàn quốc){' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="🔍 Gõ tìm nhanh trường (ví dụ Bách Khoa, UEH, Y Hà Nội...)"
                  value={uniSearchFilter}
                  onChange={(e) => setUniSearchFilter(e.target.value)}
                  className="w-full px-3.5 py-2 mb-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-sky-500"
                />
                <select
                  value={universityId}
                  onChange={(e) => handleSelectUniversity(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm focus:border-sky-500 focus:outline-hidden bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium"
                >
                  <option value="">-- Chọn trường đại học của bạn --</option>
                  {filteredUniversities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.shortName} — {uni.name} ({uni.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Khoa / Ngành học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Khoa học Máy tính, Kế toán, Kinh doanh Quốc tế..."
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Tên môn học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giải tích 1, Cấu trúc dữ liệu, Nguyên lý kế toán..."
                  value={subjectName}
                  onChange={(e) => {
                    setSubjectName(e.target.value);
                    if (stepError) setStepError(null);
                  }}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Hình ảnh thực tế cuốn sách (Bìa trước, gáy, trang trong){' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    {images.length}/6 ảnh (bắt buộc tối thiểu 1 ảnh)
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

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImages(true);
                  }}
                  onDragLeave={() => setIsDraggingImages(false)}
                  onDrop={handleImageDrop}
                  className={`p-3.5 rounded-2xl border-2 border-dashed transition-colors ${
                    isDraggingImages
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex flex-wrap gap-2.5">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-22 h-22 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-xs group bg-white dark:bg-zinc-900"
                      >
                        <img
                          src={img}
                          alt={`Ảnh sách ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-sky-600/90 text-white text-[9px] font-bold">
                            Ảnh bìa
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setImages(images.filter((_, idx) => idx !== i));
                            setImageUploadError(null);
                          }}
                          aria-label={`Xóa ảnh ${i + 1}`}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {images.length < 6 && (
                      <button
                        type="button"
                        disabled={isUploadingImages}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-22 h-22 rounded-xl border-2 border-dashed border-sky-400 hover:border-sky-600 bg-sky-50 dark:bg-zinc-900 hover:bg-sky-100 dark:hover:bg-zinc-800 text-sky-700 dark:text-sky-400 flex flex-col items-center justify-center gap-1 px-1 text-center text-[11px] font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        {isUploadingImages ? (
                          <span>Đang tải...</span>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            <span className="leading-tight">Tải ảnh từ máy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      Chọn nhiều ảnh JPG, PNG, WEBP từ điện thoại hoặc máy tính (tối đa 10MB/ảnh).
                    </span>
                  </div>
                </div>

                {imageUploadError && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}
              </div>

              {/* Video Preview Capability */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Đính kèm video lật từng trang (10-15s)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Giúp người mua tin tưởng 100% độ mới của sách
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={includeVideo}
                    onChange={(e) => setIncludeVideo(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded"
                  />
                </div>

                {includeVideo && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Link video MP4 lật sách..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {/* Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Độ mới của sách
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'like_new', label: 'Mới 99%', desc: 'Gần như chưa dùng' },
                    { id: 'good', label: 'Tốt 90%', desc: 'Gáy chắc, dùng tốt' },
                    { id: 'fair', label: 'Khá 80%', desc: 'Có sờn nhẹ ở mép' },
                    { id: 'acceptable', label: 'Dùng tạm', desc: 'Có khuyết điểm' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCondition(c.id as ConditionType)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        condition === c.id
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 font-bold text-sky-900 dark:text-white shadow-xs ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white'
                      }`}
                    >
                      <div>{c.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Giá bạn muốn bán (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:border-sky-500 font-bold text-rose-600 dark:text-rose-400 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Giá bìa tham khảo (VNĐ)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:border-sky-500 text-slate-500 dark:text-zinc-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Campus & KTX Meetup Spots */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                    Địa điểm giao dịch (Ký túc xá, Cơ sở)
                  </label>
                  <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    {pickupLocations.length} địa điểm
                  </span>
                </div>

                {/* Selected locations */}
                {pickupLocations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {pickupLocations.map((loc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
                      >
                        <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setHasCustomizedLocations(true);
                            setPickupLocations(pickupLocations.filter((_, idx) => idx !== i));
                          }}
                          className="hover:text-rose-600 cursor-pointer font-bold"
                          aria-label={`Xóa địa điểm ${loc}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick select KTX & Campus spots */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">
                    Chọn nhanh Ký túc xá / Cơ sở {selectedUni ? `(${selectedUni.shortName})` : ''}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedLocations.map((loc) => {
                      const isSelected = pickupLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleToggleSuggestedLocation(loc)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#4086ee] text-white border-[#4086ee]'
                              : 'bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-sky-400'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom KTX / Campus input */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value as 'ktx' | 'campus' | 'other')}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-800 dark:text-white text-xs font-semibold focus:outline-hidden focus:border-sky-500"
                  >
                    <option value="ktx">Ký túc xá (KTX)</option>
                    <option value="campus">Cơ sở trường</option>
                    <option value="other">Điểm hẹn khác</option>
                  </select>
                  <input
                    type="text"
                    placeholder={
                      locationType === 'ktx'
                        ? 'Ví dụ: KTX Khu B tòa B4, KTX Bách Khoa...'
                        : locationType === 'campus'
                        ? 'Ví dụ: Cơ sở B - 279 Nguyễn Tri Phương, Cơ sở 2 Dĩ An...'
                        : 'Ví dụ: Canteen C6, Cổng chính...'
                    }
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLocation();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs focus:outline-hidden focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors"
                  >
                    + Thêm địa điểm
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Mô tả thêm cho bạn học
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sách có sẵn lời giải bài tập giữa kỳ, bọc nylon cẩn thận..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {stepError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{stepError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setStepError(null);
                setStep(step - 1);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ĐĂNG BÁN NGAY LẬP TỨC</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
