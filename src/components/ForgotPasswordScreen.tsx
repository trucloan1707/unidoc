import React, { useState, useEffect } from 'react';
import { UniDocLogo } from './UniDocLogo';
import {
  isEmailRegisteredLocally,
  updateAccountPasswordLocally,
} from '../utils/accountRegistry';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
  Clock,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ForgotPasswordScreenProps {
  initialEmail?: string;
  onReturnToLogin: (prefillEmail?: string) => void;
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
}

const ForgotDecorIllustration: React.FC = () => (
  <svg
    viewBox="0 0 280 96"
    className="w-60 h-20 mx-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M28 24L30 29L35 31L30 33L28 38L26 33L21 31L26 29L28 24Z"
      fill="#b9e7ff"
    />
    <path
      d="M248 20L250 24L254 26L250 28L248 32L246 28L242 26L246 24L248 20Z"
      fill="#4086ee"
      fillOpacity="0.45"
    />
    <ellipse cx="140" cy="84" rx="76" ry="8" fill="#d3edff" className="dark:opacity-20" />

    {/* Shield + Lock icon centerpiece */}
    <g>
      <rect
        x="96"
        y="26"
        width="88"
        height="50"
        rx="12"
        fill="#ffffff"
        stroke="#4086ee"
        strokeWidth="2"
        className="dark:fill-zinc-900"
      />
      <path
        d="M98 31L140 55L182 31"
        stroke="#b9e7ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="140" cy="50" r="14" fill="#edf8fe" stroke="#4086ee" strokeWidth="2" />
      <rect x="134" y="49" width="12" height="9" rx="2.5" fill="#4086ee" />
      <path
        d="M136.5 49V46.5C136.5 44.6 138 43 140 43C142 43 143.5 44.6 143.5 46.5V49"
        stroke="#0860c9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Check badge */}
    <circle cx="184" cy="28" r="11" fill="#4086ee" stroke="#ffffff" strokeWidth="2.5" />
    <path
      d="M179.5 28.2L182.6 31.3L188.8 25"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  initialEmail = '',
  onReturnToLogin,
  onSwitchToRegister,
  onBackToHome,
}) => {
  // 4 steps:
  // 1: Nhập email để gửi mã xác thực
  // 2: Nhập mã xác thực 6 chữ số (OTP)
  // 3: Đặt lại mật khẩu mới (2 lần nhập)
  // 4: Đổi mật khẩu thành công -> Quay lại đăng nhập ngay
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = useState(initialEmail);
  const [normalizedEmail, setNormalizedEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Step 2: OTP verification
  const [otpCode, setOtpCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isOtpActive, setIsOtpActive] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCount, setResendCount] = useState<number>(0);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string>('');

  // Step 3: Reset password (2 inputs)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const hasExtraWhitespace = email !== email.trim() || /\s/.test(email);
  const eduVnRegex =
    /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.edu\.vn$/i;
  const trimmedEmailLower = email.trim().toLowerCase();
  const isEduVnEmail =
    email.length > 0 &&
    !hasExtraWhitespace &&
    !trimmedEmailLower.includes('..') &&
    eduVnRegex.test(trimmedEmailLower);

  // 60s countdown for Step 2 OTP
  useEffect(() => {
    if (step !== 2 || !isOtpActive || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, isOtpActive, secondsLeft]);

  useEffect(() => {
    if (step === 2 && secondsLeft === 0 && isOtpActive) {
      setIsOtpActive(false);
      setResendNotice(null);
      if (normalizedEmail) {
        fetch('/api/auth/invalidate-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalizedEmail }),
        }).catch(() => {});
      }
    }
  }, [step, secondsLeft, isOtpActive, normalizedEmail]);

  const sendResetOtp = async (targetEmail: string, isResend: boolean) => {
    setIsSendingOtp(true);
    setErrorMsg(null);
    if (!isResend) setResendNotice(null);

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, purpose: 'reset' }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid || !data.emailSent) {
        setErrorMsg(
          data.error ||
            'Không thể gửi mã xác thực tới email của bạn. Vui lòng kiểm tra lại cấu hình gửi email hoặc thử lại.'
        );
        return false;
      }

      setNormalizedEmail(data.email);
      setSecondsLeft(60);
      setIsOtpActive(true);
      setOtpCode('');

      if (isResend) {
        setResendCount((prev) => prev + 1);
        setResendNotice(`Đã gửi lại mã xác thực mới tới hộp thư ${data.email}`);
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

  // Step 1: Enter email & send verification code
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email sinh viên của bạn.');
      return;
    }
    if (hasExtraWhitespace) {
      setErrorMsg('Email không được chứa khoảng trắng thừa.');
      return;
    }
    if (!isEduVnEmail) {
      setErrorMsg(
        'Vui lòng nhập email sinh viên hợp lệ có đuôi ".edu.vn" đã đăng ký trên UniDoc.'
      );
      return;
    }

    // Verify account exists locally or on server before sending reset OTP
    let existsOnServer = false;
    try {
      const checkRes = await fetch('/api/auth/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmailLower }),
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existsOnServer = Boolean(checkData.emailTaken);
      }
    } catch {}

    const existsLocally = isEmailRegisteredLocally(trimmedEmailLower);
    if (!existsLocally && !existsOnServer) {
      setErrorMsg(
        'Email này chưa được đăng ký tài khoản trên UniDoc. Vui lòng kiểm tra lại hoặc tạo tài khoản mới.'
      );
      return;
    }

    setResendCount(0);
    const sent = await sendResetOtp(email.trim(), false);
    if (sent) {
      setStep(2);
    }
  };

  // Step 2: Verify 6-digit OTP code
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedOtp = otpCode.trim();

    if (secondsLeft <= 0 || !isOtpActive) {
      setErrorMsg(
        'Mã xác thực đã hết hiệu lực sau 60 giây. Vui lòng ấn "Gửi lại mã khác" để nhận mã mới.'
      );
      return;
    }
    if (cleanedOtp.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực đã gửi về email của bạn.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code: cleanedOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.verified) {
        setErrorMsg(
          data.error || 'Mã xác thực không chính xác. Vui lòng kiểm tra lại email của bạn.'
        );
        return;
      }

      setResetToken(typeof data.resetToken === 'string' ? data.resetToken : '');
      setIsOtpActive(false);
      setStep(3);
    } catch {
      setErrorMsg('Không thể xác thực mã lúc này. Vui lòng thử lại.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Enter new password twice & save
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới cần tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu nhập lại chưa khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setIsResettingPassword(true);
    try {
      if (resetToken) {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: normalizedEmail,
            resetToken,
            newPassword,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(
            data.error || 'Không thể cập nhật mật khẩu mới. Vui lòng thử lại.'
          );
          return;
        }
      }

      // Persist new password locally so LoginScreen enforces it immediately
      updateAccountPasswordLocally(normalizedEmail, newPassword);
      setStep(4);
    } catch {
      setErrorMsg('Lỗi kết nối khi đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const steps = [
    { num: 1, label: 'Nhập email' },
    { num: 2, label: 'Xác thực' },
    { num: 3, label: 'Mật khẩu mới' },
    { num: 4, label: 'Thành công' },
  ];

  return (
    <div className="min-h-screen bg-[#edf8fe] dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between py-6 px-4 transition-colors">
      {/* Top Return */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => onReturnToLogin(email.trim())}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0860c9] dark:text-sky-400 hover:text-[#4086ee] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại đăng nhập</span>
        </button>

        <button
          type="button"
          onClick={onBackToHome}
          className="text-xs font-semibold text-[#5b728f] dark:text-zinc-400 hover:text-[#0860c9] dark:hover:text-white transition-colors cursor-pointer"
        >
          Trang chủ
        </button>
      </div>

      {/* Centered Vertical Smartphone-Style Layout */}
      <main className="w-full max-w-[440px] mx-auto my-auto space-y-4">
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-300 tracking-tight">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>

          <div className="pt-1 space-y-1">
            <h1 className="text-2xl font-black text-[#0860c9] dark:text-white tracking-tight">
              Khôi phục mật khẩu
            </h1>
            <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 font-medium">
              {step === 1 && 'Nhập email sinh viên để nhận mã xác thực'}
              {step === 2 && 'Nhập mã xác thực 6 chữ số đã gửi về email'}
              {step === 3 && 'Tạo mật khẩu mới an toàn cho tài khoản của bạn'}
              {step === 4 && 'Tài khoản của bạn đã sẵn sàng đăng nhập'}
            </p>
          </div>
        </div>

        <ForgotDecorIllustration />

        <section className="bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_10px_30px_rgba(64,134,238,0.09)] p-5 sm:p-6 space-y-5">
          {/* 4-Step Progress Bar */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#edf8fe] dark:border-zinc-800">
            {steps.map((s, idx) => {
              const isActive = step === s.num;
              const isDone = step > s.num || step === 4;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-1 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 transition-colors ${
                        isActive || isDone
                          ? 'bg-[#4086ee] text-white shadow-xs'
                          : 'bg-[#edf8fe] dark:bg-zinc-900 text-[#5b728f] dark:text-zinc-400 border border-[#b9e7ff] dark:border-zinc-700'
                      }`}
                    >
                      {isDone && (step > s.num || s.num === 4) ? (
                        <Check className="w-3 h-3 stroke-[2.8]" />
                      ) : (
                        s.num
                      )}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold truncate ${
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
                      className={`flex-1 h-0.5 rounded-full min-w-[8px] ${
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

          {/* Inline Error */}
          {errorMsg && (
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: NHẬP EMAIL ĐỂ GỬI MÃ XÁC THỰC */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200">
                    Email sinh viên đã đăng ký <span className="text-[#4086ee]">(.edu.vn)</span>
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
                    placeholder="mssv@st.ueh.edu.vn"
                    autoComplete="email"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#5b728f] dark:text-zinc-400">
                  Hệ thống sẽ gửi mã xác thực gồm 6 chữ số tới hộp thư email sinh viên của bạn.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] disabled:opacity-70 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi mã xác thực...</span>
                  </>
                ) : (
                  <span>Gửi mã xác thực</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: NHẬP MÃ XÁC THỰC OTP */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 space-y-2.5 text-center">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-950 border border-[#b9e7ff] dark:border-zinc-700 text-[#4086ee] flex items-center justify-center mx-auto">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0860c9] dark:text-white">
                    Kiểm tra hộp thư email của bạn
                  </div>
                  <p className="text-xs text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                    Mã xác thực 6 chữ số đã được gửi riêng tới{' '}
                    <b className="text-[#0860c9] dark:text-sky-300 break-all">
                      {normalizedEmail}
                    </b>
                    .
                  </p>
                </div>

                {/* 60-second countdown */}
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
                        Hết 60s — Mã xác thực đã hết hiệu lực
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

              {resendNotice && (
                <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendNotice}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Nhập mã xác thực 6 chữ số
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
                  ← Đổi email khác
                </button>
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={() => sendResetOtp(normalizedEmail || email.trim(), true)}
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
                      ? 'Chưa nhận được? Gửi lại mã khác'
                      : 'Gửi lại mã'}
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
                    <span>Đang xác thực...</span>
                  </>
                ) : secondsLeft > 0 && isOtpActive ? (
                  <span>Xác thực mã</span>
                ) : (
                  <span>Mã đã hết hạn — Vui lòng gửi lại</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: ĐẶT LẠI MẬT KHẨU (2 LẦN NHẬP) */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-800 flex items-center gap-2.5 text-xs">
                <KeyRound className="w-4 h-4 text-[#4086ee] shrink-0" />
                <span className="text-[#0860c9] dark:text-sky-300 font-semibold">
                  Xác thực thành công cho <b>{normalizedEmail}</b>. Hãy nhập mật khẩu mới 2 lần bên dưới.
                </span>
              </div>

              {/* Lần 1: Mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    autoComplete="new-password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                    className="absolute right-2.5 p-1.5 text-[#5b728f] hover:text-[#4086ee] dark:text-zinc-400 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Lần 2: Nhập lại mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                  Nhập lại mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Nhập lại mật khẩu mới để xác nhận"
                    autoComplete="new-password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    aria-label={
                      showConfirmNewPassword
                        ? 'Ẩn mật khẩu nhập lại'
                        : 'Hiện mật khẩu nhập lại'
                    }
                    className="absolute right-2.5 p-1.5 text-[#5b728f] hover:text-[#4086ee] dark:text-zinc-400 cursor-pointer"
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isResettingPassword}
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] disabled:opacity-70 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu mật khẩu mới...</span>
                  </>
                ) : (
                  <span>Xác nhận đặt lại mật khẩu</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: ĐỔI MẬT KHẨU THÀNH CÔNG -> QUAY LẠI ĐĂNG NHẬP NGAY */}
          {step === 4 && (
            <div className="py-3 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#edf8fe] dark:bg-sky-950/60 border-2 border-[#4086ee] text-[#4086ee] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg font-black text-[#0860c9] dark:text-white flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4086ee]" />
                  <span>Đổi mật khẩu thành công!</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 leading-relaxed">
                  Mật khẩu mới cho tài khoản{' '}
                  <b className="text-[#0860c9] dark:text-sky-300">{normalizedEmail}</b> đã được cập nhật an toàn. Bạn có thể đăng nhập ngay bây giờ.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onReturnToLogin(normalizedEmail)}
                className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer"
              >
                Quay lại đăng nhập ngay
              </button>
            </div>
          )}

          {/* Footer helper links */}
          {step !== 4 && (
            <div className="pt-2 border-t border-[#edf8fe] dark:border-zinc-800 flex items-center justify-between text-xs text-[#5b728f] dark:text-zinc-400">
              <button
                type="button"
                onClick={() => onReturnToLogin(email.trim())}
                className="font-bold text-[#4086ee] hover:text-[#0860c9] hover:underline cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-[#4086ee] hover:text-[#0860c9] hover:underline cursor-pointer"
              >
                Tạo tài khoản mới
              </button>
            </div>
          )}
        </section>
      </main>

      <div className="h-2" />
    </div>
  );
};
