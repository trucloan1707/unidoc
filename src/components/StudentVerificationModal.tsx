import React, { useState } from 'react';
import { University } from '../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Upload,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  Award,
} from 'lucide-react';

interface StudentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  universities: University[];
  isVerified?: boolean;
  onVerifySuccess?: () => void;
}

export const StudentVerificationModal: React.FC<StudentVerificationModalProps> = ({
  isOpen,
  onClose,
  universities,
  isVerified = true,
  onVerifySuccess,
}) => {
  const [selectedUniId, setSelectedUniId] = useState('dhqg_hcm');
  const [studentName, setStudentName] = useState('Vũ Việt Anh');
  const [mssv, setMssv] = useState('2010482');
  const [emailDomain, setEmailDomain] = useState('vnuhcm.edu.vn');
  const [emailPrefix, setEmailPrefix] = useState('vietanh.vu');
  const [cardUploaded, setCardUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedState, setVerifiedState] = useState(isVerified);

  if (!isOpen) return null;

  const currentUni = universities.find((u) => u.id === selectedUniId) || universities[0];

  const handleUniChange = (id: string) => {
    setSelectedUniId(id);
    const uni = universities.find((u) => u.id === id);
    if (uni) {
      setEmailDomain(uni.studentEmailDomain);
    }
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setVerifiedState(true);
      if (onVerifySuccess) onVerifySuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Xác Thực Sinh Viên Chính Chủ
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Xác thực bằng MSSV & Email trường để đảm bảo giao dịch 100% an toàn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        {verifiedState ? (
          <div className="p-6 space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-emerald-900 dark:text-emerald-300">
                Tài khoản của bạn đã được xác thực thành công!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-200">
                MSSV: <b>{mssv.slice(0, 4)}***</b> • Trường: <b>{currentUni.name}</b>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-2.5 text-xs text-slate-700 dark:text-zinc-300">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Đặc quyền tài khoản sinh viên đã xác minh:
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600 dark:text-zinc-300">
                <li>Hiển thị tích xanh "Sinh viên xác thực" trên mọi bài đăng sách</li>
                <li>Được mở khóa chức năng Đăng bán sách không giới hạn số lượng</li>
                <li>Huy hiệu danh hiệu hài hước được vinh danh trên trang chủ</li>
                <li>Được bảo vệ quyền lợi khi giao dịch gặp tại KTX/Thư viện</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSimulateSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Chọn trường đại học của bạn
              </label>
              <select
                value={selectedUniId}
                onChange={(e) => handleUniChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs sm:text-sm font-medium bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
              >
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} ({uni.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Họ và tên theo thẻ SV
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Mã số sinh viên (MSSV)
                </label>
                <input
                  type="text"
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value)}
                  placeholder="2010482..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Email sinh viên chính thức
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-l-xl border border-r-0 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-xs sm:text-sm text-right"
                  placeholder="nguyenvana"
                  required
                />
                <span className="px-3 py-2 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-r-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 flex items-center">
                  @{emailDomain}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-zinc-400 mt-1">
                UniDoc chỉ dùng email để gửi mã kích hoạt bảo mật, không spam.
              </p>
            </div>

            {/* Photo Card Proof */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Chụp ảnh thẻ sinh viên hoặc màn hình cổng đào tạo
              </label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-sky-500 bg-slate-50 dark:bg-zinc-900 text-center cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-slate-700 dark:text-white">
                  {cardUploaded ? '✓ Đã tải lên thẻ sinh viên mẫu' : 'Bấm để tải lên ảnh thẻ SV'}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-zinc-400 mt-0.5">
                  Chỉ che số CCCD, giữ rõ họ tên và niên khóa.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang kiểm tra hệ thống...' : 'Gửi Yêu Cầu Xác Thực'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
