import React, { useState, useEffect } from 'react';
import { UniDocLogo } from './UniDocLogo';
import { findAccountByEmail } from '../utils/accountRegistry';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface LoginScreenProps {
  initialEmail?: string;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: (prefillEmail?: string) => void;
  onLoginSuccess: (email: string) => void;
  onBackToHome: () => void;
}

/* Academic SVG illustration below logo: small books, email envelope, blue checkmark, corner stars & papers */
const LoginAcademicIllustration: React.FC = () => (
  <svg
    viewBox="0 0 280 100"
    className="w-60 h-22 mx-auto select-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Corner stars & tiny pages */}
    <path
      d="M24 22L26 27L31 29L26 31L24 36L22 31L17 29L22 27L24 22Z"
      fill="#4086ee"
      fillOpacity="0.45"
    />
    <path
      d="M254 24L256 28L260 30L256 32L254 36L252 32L248 30L252 28L254 24Z"
      fill="#b9e7ff"
    />
    <g transform="rotate(-10 48 56)">
      <rect
        x="36"
        y="40"
        width="24"
        height="30"
        rx="5"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="42" y1="49" x2="54" y2="49" stroke="#4086ee" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="56" x2="52" y2="56" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform="rotate(14 232 58)">
      <rect
        x="220"
        y="44"
        width="24"
        height="28"
        rx="5"
        fill="#ffffff"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        className="dark:fill-zinc-900 dark:stroke-zinc-700"
      />
      <line x1="226" y1="53" x2="238" y2="53" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
      <line x1="226" y1="60" x2="236" y2="60" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Ground soft ellipse */}
    <ellipse cx="140" cy="88" rx="74" ry="8" fill="#d3edff" className="dark:opacity-20" />

    {/* Stack of books */}
    <g>
      <rect x="78" y="64" width="58" height="15" rx="4" fill="#0860c9" />
      <rect x="78" y="64" width="10" height="15" rx="2" fill="#054594" />
      <line x1="94" y1="71.5" x2="128" y2="71.5" stroke="#b9e7ff" strokeWidth="2" strokeLinecap="round" />

      <rect x="85" y="49" width="52" height="15" rx="4" fill="#4086ee" />
      <rect x="85" y="49" width="9" height="15" rx="2" fill="#0860c9" />
      <line x1="100" y1="56.5" x2="129" y2="56.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Email envelope + checkmark */}
    <g>
      <rect
        x="142"
        y="34"
        width="58"
        height="42"
        rx="9"
        fill="#ffffff"
        stroke="#4086ee"
        strokeWidth="2"
        className="dark:fill-zinc-900"
      />
      <path
        d="M144 38L171 58L198 38"
        stroke="#4086ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M145 73L161 58M197 73L181 58"
        stroke="#b9e7ff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Checkmark badge */}
      <circle cx="197" cy="36" r="11" fill="#4086ee" stroke="#ffffff" strokeWidth="2.5" />
      <path
        d="M192.5 36.2L195.8 39.4L201.8 33"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialEmail = '',
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onLoginSuccess,
  onBackToHome,
}) => {
  const [email, setEmail] = useState(() => {
    if (initialEmail) return initialEmail;
    try {
      return localStorage.getItem('unidoc_saved_email') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail || !cleanedEmail.includes('@')) {
      setErrorMsg('Vui lòng nhập email sinh viên hợp lệ.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu để đăng nhập.');
      return;
    }

    // Verify locally stored/reset password if account exists in registry
    const localAccount = findAccountByEmail(cleanedEmail);
    if (
      localAccount &&
      typeof localAccount.password === 'string' &&
      localAccount.password.length > 0 &&
      localAccount.password !== password
    ) {
      setErrorMsg('Mật khẩu không chính xác. Vui lòng thử lại hoặc chọn "Quên mật khẩu?".');
      return;
    }

    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const verifyRes = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanedEmail, password }),
      });
      if (verifyRes.status === 401) {
        const errData = await verifyRes.json().catch(() => ({}));
        setErrorMsg(
          errData.error ||
            'Mật khẩu không chính xác. Vui lòng thử lại hoặc chọn "Quên mật khẩu?".'
        );
        return;
      }

      if (rememberMe) {
        try {
          localStorage.setItem('unidoc_saved_email', cleanedEmail);
        } catch {}
      }
      onLoginSuccess(cleanedEmail);
    } catch {
      if (rememberMe) {
        try {
          localStorage.setItem('unidoc_saved_email', cleanedEmail);
        } catch {}
      }
      onLoginSuccess(cleanedEmail);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf8fe] dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between py-6 px-4 transition-colors relative overflow-hidden">
      {/* Subtle corner decorations */}
      <div className="absolute top-14 -left-16 w-48 h-48 rounded-full bg-[#b9e7ff]/30 dark:bg-sky-500/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-14 -right-16 w-52 h-52 rounded-full bg-[#4086ee]/10 dark:bg-sky-500/5 blur-2xl pointer-events-none" />

      {/* Minimal top return action (no left sidebar, no bottom nav) */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0860c9] dark:text-sky-400 hover:text-[#4086ee] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      {/* Centered Vertical Smartphone-Style Login Layout */}
      <main className="w-full max-w-[420px] mx-auto my-auto space-y-4 relative z-10 py-4">
        {/* Top Centered Original UniDoc Logo & Slogan */}
        <div className="text-center space-y-2">
          <div className="flex flex-col items-center justify-center">
            <UniDocLogo size="lg" colorScheme="blue-orange" showSubtitle={false} />
            <p className="mt-2 text-xs sm:text-sm font-bold text-[#0860c9] dark:text-sky-300 tracking-tight">
              Tài liệu chuẩn – Học tập dễ dàng hơn!
            </p>
          </div>
        </div>

        {/* Small illustration below logo */}
        <LoginAcademicIllustration />

        {/* Welcome Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-[26px] font-black text-[#0860c9] dark:text-white tracking-tight">
            Chào mừng trở lại!
          </h1>
          <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 font-medium">
            Đăng nhập để tiếp tục hành trình học tập của bạn
          </p>
        </div>

        {/* Login Form Card (rounded 20px) */}
        <section className="bg-white dark:bg-zinc-950 rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-[0_10px_30px_rgba(64,134,238,0.09)] p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email sinh viên */}
            <div>
              <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                Email sinh viên
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email sinh viên"
                  autoComplete="email"
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-sm text-slate-900 dark:text-white placeholder:text-[#7b93af] dark:placeholder:text-zinc-400 focus:outline-hidden focus:border-[#4086ee] focus:ring-2 focus:ring-[#4086ee]/15 transition-all"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-xs font-bold text-[#0860c9] dark:text-zinc-200 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
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

            {/* Checkbox "Ghi nhớ đăng nhập" + "Quên mật khẩu?" */}
            <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[#5b728f] dark:text-zinc-300 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#b9e7ff] text-[#4086ee] focus:ring-[#4086ee] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button
                type="button"
                onClick={() => onSwitchToForgotPassword(email.trim())}
                className="font-bold text-[#4086ee] hover:text-[#0860c9] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Primary CTA "Đăng nhập" */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] disabled:opacity-70 text-white font-bold text-sm sm:text-base shadow-md shadow-[#4086ee]/25 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          {/* Thin Divider + "Bạn chưa có tài khoản?" */}
          <div className="relative flex items-center py-1">
            <div className="flex-1 border-t border-[#edf8fe] dark:border-zinc-800" />
            <span className="px-3 text-xs font-medium text-[#5b728f] dark:text-zinc-400 whitespace-nowrap">
              Bạn chưa có tài khoản?
            </span>
            <div className="flex-1 border-t border-[#edf8fe] dark:border-zinc-800" />
          </div>

          {/* Secondary CTA "Tạo tài khoản mới" */}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="w-full py-3 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-[#edf8fe] dark:hover:bg-zinc-800 border border-[#b9e7ff] dark:border-zinc-700 text-[#4086ee] dark:text-sky-400 font-bold text-sm transition-colors cursor-pointer"
          >
            Tạo tài khoản mới
          </button>
        </section>
      </main>

      <div className="h-2" />
    </div>
  );
};
