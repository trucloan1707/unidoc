import React from 'react';
import { Lock, LogIn, UserPlus, X } from 'lucide-react';
import { UniDocLogo } from './UniDocLogo';

interface AuthRequiredModalProps {
  isOpen: boolean;
  actionLabel?: string | null;
  onClose: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  actionLabel,
  onClose,
  onGoToLogin,
  onGoToRegister,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-[20px] border border-[#b9e7ff] dark:border-zinc-800 shadow-2xl p-6 space-y-5 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#edf8fe] dark:bg-zinc-900 text-[#0860c9] dark:text-zinc-300 hover:bg-[#dceeff] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center pt-1">
          <UniDocLogo size="sm" colorScheme="blue-orange" showSubtitle={false} />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#edf8fe] dark:bg-sky-950/60 border border-[#b9e7ff] dark:border-sky-800 text-[#4086ee] flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-[#0860c9] dark:text-white leading-snug">
            Bạn cần đăng nhập / đăng ký tài khoản
          </h3>
          <p className="text-xs sm:text-sm text-[#5b728f] dark:text-zinc-400 leading-relaxed">
            {actionLabel
              ? `Vui lòng đăng nhập hoặc đăng ký tài khoản sinh viên (.edu.vn) để ${actionLabel}.`
              : 'Vui lòng đăng nhập hoặc đăng ký tài khoản sinh viên (.edu.vn) để tiếp tục thao tác trên UniDoc.'}
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onGoToLogin}
            className="w-full py-3 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white font-bold text-sm shadow-md shadow-[#4086ee]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={onGoToRegister}
            className="w-full py-3 rounded-2xl bg-[#edf8fe] dark:bg-zinc-900 hover:bg-[#dceeff] dark:hover:bg-zinc-800 border border-[#b9e7ff] dark:border-zinc-700 text-[#0860c9] dark:text-sky-400 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng ký tài khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
};
