import React, { useState, useEffect } from 'react';
import { UniDocLogo } from './UniDocLogo';
import { University } from '../types';
import {
  Building2,
  Hash,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Clock,
  RefreshCw,
  CheckCircle2,
  User,
  Loader2,
} from 'lucide-react';

interface RegisterScreenProps {
  universities: University[];
  onSwitchToLogin: () => void;
  onCompleteRegister: (data: {
    username: string;
    universityName: string;
    studentId: string;
    email: string;
  }) => void;
  onBackToHome: () => void;
}

/* Cute decorative illustration: stack of textbooks, white-blue email envelope, blue checkmark, flying papers & stars */
const RegisterDecorIllustration: React.FC = () => (
  <svg
    viewBox="0 0 280 96"
    className="w-60 h-20 mx-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Subtle stars & flying paper in background corners */}
    <path
      d="M28 24L30 29L35 31L30 33L28 38L26 33L21 31L26 29L28 24Z"
      fill="#b9e7ff"
    />
    <path
      d="M248 20L250 24L254 26L250 28L248 32L246 28L242 26L246 24L248 20Z"
      fill="#4086ee"
      fillOpacity="0.45"
    />
    <circle cx="52" cy="64" r="3" fill="#b9e7ff" />
    <circle cx="228" cy="66" r="2.5" fill="#4086ee" fillOpacity="0.35" />

    {/* Flying paper left */}
    <g transform="rotate(-14 54 44)">
      <rect
        x="42"
        y="26"
        width="26"
        height="32"
        rx="5"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="48" y1="36" x2="62" y2="36" stroke="#4086ee" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="43" x2="60" y2="43" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Soft shadow oval */}
    <ellipse cx="140" cy="84" rx="76" ry="8" fill="#d3edff" className="dark:opacity-20" />

    {/* Small stack of textbooks (center-left) */}
    <g>
      <rect x="80" y="60" width="60" height="15" rx="4" fill="#0860c9" />
      <rect x="80" y="60" width="10" height="15" rx="2" fill="#054594" />
      <line x1="96" y1="67.5" x2="132" y2="67.5" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />

      <rect x="86" y="45" width="54" height="15" rx="4" fill="#4086ee" />
      <rect x="86" y="45" width="9" height="15" rx="2" fill="#0860c9" />
      <line x1="100" y1="52.5" x2="132" y2="52.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      <rect x="92" y="31" width="46" height="14" rx="3.5" fill="#8fd2ff" />
      <line x1="102" y1="38" x2="130" y2="38" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    {/* White-blue Email Envelope with blue Checkmark (center-right) */}
    <g>
      <rect
        x="146"
        y="32"
        width="56"
        height="40"
        rx="8"
        fill="#ffffff"
        stroke="#4086ee"
        strokeWidth="2"
        className="dark:fill-zinc-900"
      />
      <path
        d="M148 36L174 55L200 36"
        stroke="#4086ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M149 69L165 55M199 69L183 55"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Blue checkmark badge */}
      <circle cx="198" cy="34" r="11" fill="#4086ee" stroke="#ffffff" strokeWidth="2.5" />
      <path
        d="M193.5 34.2L196.6 37.3L202.8 31"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Flying paper right */}
    <g transform="rotate(12 224 48)">
      <rect
        x="212"
        y="34"
        width="24"
        height="28"
        rx="5"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="218" y1="43" x2="230" y2="43" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
      <line x1="218" y1="50" x2="228" y2="50" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  universities,
  onSwitchToLogin,
  onCompleteRegister,
  onBackToHome,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 fields
  const [username, setUsername] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Step 2 OTP & 60s countdown state (verified on server)
  const [otpCode, setOtpCode] = useState('');
  const [normalizedVerifiedEmail, setNormalizedVerifiedEmail] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isOtpActive, setIsOtpActive] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCount, setResendCount] = useState<number>(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const selectedUniversity = universities.find((u) => u.id === universityId);

  // Strict .edu.vn format check without extra whitespace
  const hasExtraWhitespace = email !== email.trim() || /\s/.test(email);
  const eduVnRegex =
    /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.edu\.vn$/i;
  const normalizedEmailInput = email.toLowerCase();
  const isEduVnEmail =
    email.length > 0 &&
    !hasExtraWhitespace &&
    !normalizedEmailInput.includes('..') &&
    eduVnRegex.test(normalizedEmailInput);

  // Request private OTP from backend server (sent via SMTP/Email API, never shown publicly)
  const requestServerOtp = async (targetEmail: string, isResend: boolean) => {
    setIsSendingOtp(true);
    setErrorMsg(null);
    if (!isResend) setResendNotice(null);

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid || !data.emailSent) {
        setErrorMsg(
          data.error ||
            'Không thể gửi mã xác minh tới email của bạn. Vui lòng kiểm tra lại địa chỉ .edu.vn hoặc cấu hình máy chủ gửi thư.'
        );
        return false;
      }

      setNormalizedVerifiedEmail(data.email);
      setSecondsLeft(60);
      setIsOtpActive(true);
      setOtpCode('');

      if (isResend) {
        setResendCount((prev) => prev + 1);
        setResendNotice(`Đã gửi lại mã xác minh mới tới hộp thư ${data.email}`);
      } else {
        setResendNotice(null);
      }

      return true;
    } catch {
      setErrorMsg('Không thể kết nối máy chủ xác thực email. Vui lòng thử lại sau.');
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 60-second countdown timer when verifying email in Step 2
  useEffect(() => {
    if (step !== 2 || !isOtpActive || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, isOtpActive, secondsLeft]);

  // Immediately invalidate OTP on both UI and server when 60s countdown hits 0
  useEffect(() => {
    if (step === 2 && secondsLeft === 0 && isOtpActive) {
      setIsOtpActive(false);
      setResendNotice(null);
      if (normalizedVerifiedEmail) {
        fetch('/api/auth/invalidate-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedVerifiedEmail }),
        }).catch(() => {});
      }
    }
  }, [step, secondsLeft, isOtpActive, normalizedVerifiedEmail]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUsername = username.trim();

    if (cleanedUsername.length < 3) {
      setErrorMsg('Vui lòng nhập Username (tối thiểu 3 ký tự).');
      return;
    }
    if (/\s/.test(cleanedUsername)) {
      setErrorMsg('Username không được chứa khoảng trắng.');
      return;
    }
    if (!universityId) {
      setErrorMsg('Vui lòng chọn trường đại học của bạn.');
      return;
    }
    if (!studentId.trim()) {
      setErrorMsg('Vui lòng nhập mã số sinh viên (MSSV).');
      return;
    }
    if (hasExtraWhitespace) {
      setErrorMsg('Email không được chứa khoảng trắng thừa.');
      return;
    }
    if (!isEduVnEmail) {
      setErrorMsg(
        'Chỉ chấp nhận email sinh viên hợp lệ kết thúc chính xác bằng ".edu.vn" (ví dụ: mssv@st.ueh.edu.vn).'
      );
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại chưa khớp.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    setResendCount(0);
    const sentOk = await requestServerOtp(email, false);
    if (sentOk) {
      setStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedOtp = otpCode.trim();

    if (secondsLeft <= 0 || !isOtpActive) {
      setErrorMsg(
        'Mã xác minh đã hết hiệu lực sau 60 giây và bị vô hiệu. Vui lòng ấn "Gửi lại mã khác" để nhận mã mới.'
      );
      return;
    }
    if (cleanedOtp.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác minh đã gửi về email cá nhân.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedVerifiedEmail,
          code: cleanedOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.verified) {
        setErrorMsg(
          data.error ||
            'Mã xác minh không chính xác. Vui lòng kiểm tra lại email .edu.vn của bạn.'
        );
        return;
      }

      // Verified successfully: create & save student account with Username
      try {
        const existingRaw = localStorage.getItem('unidoc_registered_accounts');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const newAccount = {
          username: username.trim(),
          universityId,
          universityName: selectedUniversity?.shortName || 'ĐH Kinh tế TP.HCM',
          studentId: studentId.trim(),
          email: normalizedVerifiedEmail,
          verifiedAt: new Date().toISOString(),
        };
        const filtered = Array.isArray(existingList)
          ? existingList.filter(
              (acc: { email?: string }) => acc.email !== normalizedVerifiedEmail
            )
          : [];
        localStorage.setItem(
          'unidoc_registered_accounts',
          JSON.stringify([newAccount, ...filtered])
        );
      } catch {}

      setIsOtpActive(false);
      setStep(3);
    } catch {
      setErrorMsg('Không thể xác minh mã lúc này. Vui lòng thử lại.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const steps = [
    { num: 1, label: 'Thông tin' },
    { num: 2, label: 'Xác minh email' },
    { num: 3, label: 'Hoàn tất' },
  ];

  return (
    <div className="min-h-screen bg-[#edf8fe] dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between py-6 px-4 transition-colors">
      {/* Subtle Top Back Trigger (no left sidebar, no bottom bar) */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0860c9] dark:text-sky-400 hover:text-[#4086ee] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      {/* Centered Vertical Smartphone-Style Registration Layout */}
      <main className="w-full max-w-[440px] mx-auto my-auto space-y-4">
        {/* Top Centered Original UniDoc Logo & Slogan */}
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-300 tracking-tight">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>

          <div className="pt-1 space-y-1">
            <h1 className="text-2xl font-black text-[#0860c9] dark:text-white tracking-tight">
              Tạo tài khoản UniDoc
            </h1>
            <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 font-medium">
              Bắt đầu hành trình học tập hiệu quả hơn
            </p>
          </div>
        </div>

        {/* Decorative Academic Illustration (placed cleanly above card without covering form) */}
        <RegisterDecorIllustration />

        {/* White Rounded Card (16-20px radius, subtle blue shadow, #b9e7ff border) */}
        <section className="bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_10px_30px_rgba(64,134,238,0.09)] p-5 sm:p-6 space-y-5">
          {/* 3-Step Indicator: Thông tin -> Xác minh email -> Hoàn tất */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#edf8fe] dark:border-zinc-800">
            {steps.map((s, idx) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                        isActive || isDone
                          ? 'bg-[#4086ee] text-white shadow-xs'
                          : 'bg-[#edf8fe] dark:bg-zinc-900 text-[#5b728f] dark:text-zinc-400 border border-[#b9e7ff] dark:border-zinc-700'
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.8]" /> : s.num}
                    </span>
                    <span
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        isActive || isDone
                          ? 'text-[#0860c9] dark:text-sky-400'
                          : 'text-[#5b728f] dark:text-zinc-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 rounded-full min-w-[12px] ${
                        step > s.num
                          ? 'bg-[#4086ee]'
                          : 'bg-[#b9e7ff]/70 dark:bg-zinc-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Inline validation error */}
          {errorMsg && (
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: THÔNG TIN */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3.5">
              {/* 1. Username */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập username của bạn (VD: minhanh_ueh)"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#5b728f] dark:text-zinc-400">
                  Tên hiển thị công khai trên trang cá nhân của bạn.
                </p>
              </div>

              {/* 2. Trường học */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Trường học
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <select
                    value={universityId}
                    onChange={(e) => {
                      setUniversityId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className={`w-full h-12 pl-10 pr-9 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm appearance-none focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all cursor-pointer ${
                      universityId
                        ? 'text-slate-900 dark:text-white font-medium'
                        : 'text-[#7b93af] dark:text-zinc-400'
                    }`}
                  >
                    <option value="">Chọn trường đại học của bạn</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName} — {u.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#5b728f] absolute right-3.5 pointer-events-none" />
                </div>
              </div>

              {/* 3. Mã số sinh viên */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Mã số sinh viên
                </label>
                <div className="relative flex items-center">
                  <Hash className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập MSSV"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                </div>
              </div>

              {/* 4. Email sinh viên (.edu.vn) */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200">
                    Email sinh viên <span className="text-[#4086ee]">(.edu.vn)</span>
                  </label>
                  {email.length > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isEduVnEmail
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {isEduVnEmail ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Hợp lệ .edu.vn
                        </>
                      ) : hasExtraWhitespace ? (
                        'Không chứa khoảng trắng'
                      ) : (
                        'Cần đuôi .edu.vn'
                      )}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={
                      selectedUniversity?.studentEmailDomain
                        ? `mssv@${selectedUniversity.studentEmailDomain}`
                        : 'example@edu.vn'
                    }
                    className={`w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-zinc-900 border text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 transition-all ${
                      email.length > 0 && !isEduVnEmail
                        ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-400/15'
                        : 'border-[#b9e7ff] dark:border-zinc-700 focus:border-[#4086ee] focus:ring-[#4086ee]/15'
                    }`}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#5b728f] dark:text-zinc-400">
                  Mã xác minh riêng tư sẽ được gửi trực tiếp về email đuôi{' '}
                  <b className="text-[#0860c9] dark:text-sky-300">.edu.vn</b> của bạn (không khoảng trắng thừa).
                </p>
              </div>

              {/* 5. Mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Tạo mật khẩu"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-2.5 p-1.5 text-[#5b728f] hover:text-[#4086ee] dark:text-zinc-400 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 6. Nhập lại mật khẩu */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Nhập lại mật khẩu
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu nhập lại' : 'Hiện mật khẩu nhập lại'}
                    className="absolute right-2.5 p-1.5 text-[#5b728f] hover:text-[#4086ee] dark:text-zinc-400 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox Điều khoản */}
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#b9e7ff] text-[#4086ee] focus:ring-[#4086ee] cursor-pointer"
                />
                <span className="text-xs text-[#5b728f] dark:text-zinc-300 leading-relaxed">
                  Tôi đồng ý với{' '}
                  <span className="font-bold text-[#4086ee]">Điều khoản sử dụng</span> và{' '}
                  <span className="font-bold text-[#4086ee]">Chính sách bảo mật</span>
                </span>
              </label>

              {/* Primary CTA "Tiếp theo" */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] disabled:opacity-70 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi mã xác minh...</span>
                  </>
                ) : (
                  <span>Tiếp theo</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: XÁC MINH EMAIL RIÊNG TƯ (KHÔNG HIỂN THỊ CÔNG KHAI MÃ OTP) */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              {/* Header info + 60s countdown */}
              <div className="p-3.5 rounded-2xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 space-y-2.5 text-center">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-950 border border-[#b9e7ff] dark:border-zinc-700 text-[#4086ee] flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                    Kiểm tra hộp thư email cá nhân
                  </div>
                  <p className="text-xs text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                    Mã xác minh riêng tư gồm 6 chữ số đã được gửi trực tiếp về địa chỉ{' '}
                    <b className="text-[#0860c9] dark:text-sky-300 break-all">
                      {normalizedVerifiedEmail}
                    </b>
                    . Để bảo mật, mã không hiển thị công khai tại đây.
                  </p>
                </div>

                {/* 60-second countdown badge + progress bar */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold">
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        secondsLeft === 0 || !isOtpActive
                          ? 'text-rose-600 dark:text-rose-400'
                          : secondsLeft <= 15
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-[#4086ee]'
                      }`}
                    />
                    {secondsLeft > 0 && isOtpActive ? (
                      <span
                        className={`tabular-nums ${
                          secondsLeft <= 15
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-[#0860c9] dark:text-sky-300'
                        }`}
                      >
                        Mã có hiệu lực trong vòng {secondsLeft}s
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">
                        Hết 60s — Mã xác minh đã bị vô hiệu
                      </span>
                    )}
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white dark:bg-zinc-800 overflow-hidden border border-[#b9e7ff]/60 dark:border-zinc-700">
                    <div
                      className={`h-full transition-all duration-1000 ease-linear ${
                        secondsLeft === 0 || !isOtpActive
                          ? 'bg-rose-500'
                          : secondsLeft <= 15
                          ? 'bg-amber-500'
                          : 'bg-[#4086ee]'
                      }`}
                      style={{ width: `${Math.max(0, (secondsLeft / 60) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Resend notification */}
              {resendNotice && (
                <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendNotice}</span>
                </div>
              )}

              {/* OTP input */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Nhập mã xác minh 6 chữ số từ email
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={secondsLeft <= 0 || !isOtpActive}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={
                    secondsLeft > 0 && isOtpActive
                      ? 'Nhập mã 6 chữ số'
                      : 'Mã đã hết hạn — Hãy gửi lại mã khác'
                  }
                  className="w-full h-12 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-center text-lg font-black tracking-[0.35em] text-[#0860c9] dark:text-white placeholder:tracking-normal placeholder:text-xs sm:placeholder:text-sm placeholder:font-normal placeholder:text-[#7b93af] focus:outline-hidden focus:border-[#4086ee] disabled:bg-slate-100 disabled:dark:bg-zinc-900/60 disabled:opacity-70 disabled:cursor-not-allowed tabular-nums"
                />
              </div>

              {/* Actions row: Edit info + Resend new code */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setResendNotice(null);
                    setIsOtpActive(false);
                    setStep(1);
                  }}
                  className="font-bold text-[#5b728f] hover:text-[#0860c9] dark:text-zinc-400 cursor-pointer"
                >
                  ← Sửa email / thông tin
                </button>
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={() => requestServerOtp(email, true)}
                  className={`inline-flex items-center gap-1.5 font-bold cursor-pointer transition-colors disabled:opacity-60 ${
                    secondsLeft <= 0 || !isOtpActive
                      ? 'px-3 py-1.5 rounded-xl bg-[#edf8fe] dark:bg-sky-950 text-[#0860c9] dark:text-sky-300 border border-[#b9e7ff] dark:border-sky-800 hover:bg-[#dceeff]'
                      : 'text-[#4086ee] hover:text-[#0860c9] hover:underline'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  <span>
                    {secondsLeft <= 0 || !isOtpActive
                      ? 'Gửi lại mã khác'
                      : resendCount > 0
                      ? 'Không nhận được? Gửi lại mã khác'
                      : 'Chưa nhận được mã? Gửi lại mã khác'}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={secondsLeft <= 0 || !isOtpActive || isVerifyingOtp}
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:text-slate-500 dark:disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isVerifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xác minh...</span>
                  </>
                ) : secondsLeft > 0 && isOtpActive ? (
                  <span>Xác nhận & Tạo tài khoản</span>
                ) : (
                  <span>Mã đã hết hạn — Vui lòng gửi lại mã khác</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: HOÀN TẤT */}
          {step === 3 && (
            <div className="py-3 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#edf8fe] dark:bg-sky-950/60 border-2 border-[#4086ee] text-[#4086ee] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4086ee]" />
                  <span>Tạo tài khoản thành công!</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                  Chào mừng <b className="text-[#0860c9] dark:text-white">{username.trim()}</b> (MSSV{' '}
                  <b className="text-[#0860c9] dark:text-white">{studentId}</b> •{' '}
                  {selectedUniversity?.shortName}). Email{' '}
                  <b className="text-[#0860c9] dark:text-sky-300">{normalizedVerifiedEmail}</b> đã được xác thực.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCompleteRegister({
                    username: username.trim(),
                    universityName: selectedUniversity?.shortName || 'ĐH Kinh tế TP.HCM',
                    studentId: studentId.trim(),
                    email: normalizedVerifiedEmail,
                  })
                }
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                Bắt đầu khám phá UniDoc
              </button>
            </div>
          )}

          {/* Bottom Link: "Đã có tài khoản? Đăng nhập" */}
          <div className="pt-2 border-t border-[#edf8fe] dark:border-zinc-800 text-center text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-[#4086ee] hover:text-[#0860c9] hover:underline cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        </section>
      </main>

      <div className="h-2" />
    </div>
  );
};
