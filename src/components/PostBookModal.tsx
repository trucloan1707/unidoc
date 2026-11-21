import React, { useState } from 'react';
import { Book, ConditionType, University } from '../types';
import {
  X,
  Plus,
  Camera,
  Video,
  Upload,
  Check,
  Building,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Trash2,
} from 'lucide-react';
import { HUMOROUS_SELLER_BADGES } from '../data/mockData';

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

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('Toán & Khoa học cơ bản');
  const [universityId, setUniversityId] = useState('dhqg_hcm');
  const [uniSearchFilter, setUniSearchFilter] = useState('');
  const [major, setMajor] = useState('Khoa học Máy tính');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [condition, setCondition] = useState<ConditionType>('good');
  const [hasHighlight, setHasHighlight] = useState(true);
  const [hasPencilNotes, setHasPencilNotes] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(30000);
  const [originalPrice, setOriginalPrice] = useState<number>(85000);
  const [pickupLocations, setPickupLocations] = useState<string[]>([
    'Thư viện trung tâm',
    'KTX Khu B',
  ]);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80',
  ]);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-turning-the-pages-of-a-book-41584-large.mp4'
  );
  const [includeVideo, setIncludeVideo] = useState(true);

  if (!isOpen) return null;

  const currentUni = universities.find((u) => u.id === universityId) || universities[0];

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    ];
    setImages([...images, samples[images.length % samples.length]]);
  };

  const handleAddLocation = () => {
    if (newLocationInput.trim() && !pickupLocations.includes(newLocationInput.trim())) {
      setPickupLocations([...pickupLocations, newLocationInput.trim()]);
      setNewLocationInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title,
      author: author || 'Nhiều tác giả',
      isbn: isbn || undefined,
      publisher: publisher || 'NXB Giáo Dục',
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
      description: description || 'Sách giáo trình còn mới, thích hợp cho sinh viên chuẩn bị học phần.',
      category,
      universityId,
      universityName: currentUni.name,
      major,
      subjectCode: subjectCode || 'MH101',
      subjectName: subjectName || title,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
      videoUrl: includeVideo ? videoUrl : undefined,
      seller: {
        id: 'user_current',
        name: 'Trần Văn Nam',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
        university: currentUni.name,
        major: major,
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
      pickupLocations: pickupLocations.length > 0 ? pickupLocations : ['Cổng trường chính'],
      allowShipping: true,
      stock: 1,
      status: 'active',
      createdAt: 'Vừa xong',
      likesCount: 1,
      viewCount: 12,
    };

    onAddBook(newBook);
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
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Mã ISBN (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    placeholder="978-604-..."
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden font-mono"
                  />
                </div>
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
                  Trường đại học áp dụng sách ({universities.length} trường toàn quốc)
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
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm focus:border-sky-500 focus:outline-hidden bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium"
                >
                  {universities
                    .filter((u) => {
                      if (!uniSearchFilter.trim()) return true;
                      const q = uniSearchFilter.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.shortName.toLowerCase().includes(q) ||
                        u.code.toLowerCase().includes(q) ||
                        u.city.toLowerCase().includes(q)
                      );
                    })
                    .map((uni) => (
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Mã học phần / Mã môn
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: MT1003, IT1110, ACC501..."
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Tên môn học
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giải tích 1, Cấu trúc dữ liệu..."
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Hình ảnh thực tế cuốn sách (Bìa trước, gáy, trang trong)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-xs group"
                    >
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddSampleImage}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-sky-400 hover:border-sky-600 bg-sky-50 dark:bg-zinc-900 hover:bg-sky-100 dark:hover:bg-zinc-800 text-sky-700 dark:text-sky-400 flex flex-col items-center justify-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>+ Thêm ảnh</span>
                  </button>
                </div>
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

              {/* Campus Meetup Spots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Điểm hẹn gặp giao sách trực tiếp (Miễn ship)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {pickupLocations.map((loc, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                    >
                      <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                      <span>{loc}</span>
                      <button
                        type="button"
                        onClick={() => setPickupLocations(pickupLocations.filter((_, idx) => idx !== i))}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Thêm điểm hẹn: Canteen C6, KTX Khu B cổng chính..."
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 text-xs focus:outline-hidden focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="px-3 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    + Thêm điểm
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
        </div>

        {/* Modal Footer Controls */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
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
              onClick={() => setStep(step + 1)}
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
