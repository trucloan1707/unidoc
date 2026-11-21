import React, { useState } from 'react';
import { VerificationRequest, Book } from '../types';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  BookOpen,
  Building,
  Eye,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  verifications: VerificationRequest[];
  onApproveVerification: (id: string) => void;
  onRejectVerification: (id: string) => void;
  books: Book[];
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  verifications,
  onApproveVerification,
  onRejectVerification,
  books,
}) => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'books'>('verifications');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Bảng Quản Trị Hệ Thống UniDoc
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Kiểm duyệt hồ sơ sinh viên MSSV, duyệt sách và giám sát giao dịch an toàn
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 pt-2 bg-slate-50 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 cursor-pointer ${
              activeTab === 'verifications'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Duyệt Xác Thực MSSV ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 cursor-pointer ${
              activeTab === 'books'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Quản Lý Tin Đăng Sách ({books.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'verifications' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Hồ sơ sinh viên chờ phê duyệt
              </div>

              {verifications.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{v.studentName}</h4>
                      <span className="text-xs font-mono font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200">
                        MSSV: {v.studentIdNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {v.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-zinc-300 mt-1 space-y-0.5">
                      <div>Email trường: <span className="font-mono">{v.studentEmail}</span></div>
                      <div className="text-slate-400 dark:text-zinc-400 text-[11px]">{v.notes} • Gửi {v.submittedAt}</div>
                    </div>
                  </div>

                  {v.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveVerification(v.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Duyệt</span>
                      </button>
                      <button
                        onClick={() => onRejectVerification(v.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Từ chối</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'books' && (
            <div className="space-y-2.5">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={b.images[0]}
                      alt={b.title}
                      className="w-10 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{b.title}</div>
                      <div className="text-slate-500 dark:text-zinc-400 text-[11px]">Người bán: {b.seller.name} • {b.universityName}</div>
                    </div>
                  </div>

                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
