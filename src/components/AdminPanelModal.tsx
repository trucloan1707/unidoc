import React, { useState } from 'react';
import { VerificationRequest, Book } from '../types';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  verifications: VerificationRequest[];
  onApproveVerification: (id: string) => void;
  onRejectVerification: (id: string) => void;
  books: Book[];
  onDeleteBook: (bookId: string) => Promise<boolean> | boolean | void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  verifications,
  onApproveVerification,
  onRejectVerification,
  books,
  onDeleteBook,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'verifications'>('books');
  const [bookSearch, setBookSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletedFeedback, setDeletedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-zinc-950 rounded-3xl max-w-md w-full shadow-2xl border border-[#b9e7ff] dark:border-zinc-800 p-6 text-center space-y-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Chỉ dành cho Quản trị viên
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Khu vực <b>Quản trị UniDoc</b> được bảo vệ riêng tư. Tài khoản hiện tại của bạn không có quyền truy cập và sử dụng chức năng này.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#4086ee] hover:bg-[#0860c9] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    );
  }

  const filteredBooks = books.filter((b) => {
    const q = bookSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.seller.name.toLowerCase().includes(q) ||
      b.universityName.toLowerCase().includes(q) ||
      b.major.toLowerCase().includes(q)
    );
  });

  const handleConfirmDelete = async (book: Book) => {
    const ok = await onDeleteBook(book.id);
    if (ok !== false) {
      setDeletedFeedback(`Đã xóa tin đăng "${book.title}" khỏi hệ thống.`);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#edf8fe] dark:bg-sky-950 text-[#0860c9] dark:text-sky-400 flex items-center justify-center font-black border border-[#b9e7ff] dark:border-sky-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0860c9] dark:text-white leading-tight">
                Bảng Quản Trị Hệ Thống UniDoc
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Quản trị tin đăng sách, xóa tin vi phạm/có sẵn và kiểm duyệt hồ sơ sinh viên
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng quản trị"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 pt-2 bg-slate-50 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab('books')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 cursor-pointer ${
              activeTab === 'books'
                ? 'border-[#4086ee] text-[#0860c9] dark:text-sky-400'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Quản Lý Tin Đăng Sách ({books.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 cursor-pointer ${
              activeTab === 'verifications'
                ? 'border-[#4086ee] text-[#0860c9] dark:text-sky-400'
                : 'border-transparent text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            Duyệt Xác Thực MSSV ({verifications.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {activeTab === 'books' && (
            <div className="space-y-3.5">
              {/* Search bar for listings */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#4086ee] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  placeholder="Tìm tin đăng theo tên sách, người bán, trường hoặc ngành..."
                  className="w-full h-10 pl-10 pr-9 rounded-xl bg-[#edf8fe]/60 dark:bg-zinc-900 border border-[#b9e7ff] dark:border-zinc-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#4086ee]"
                />
                {bookSearch && (
                  <button
                    type="button"
                    onClick={() => setBookSearch('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {deletedFeedback && (
                <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-2">
                  <span>{deletedFeedback}</span>
                  <button
                    type="button"
                    onClick={() => setDeletedFeedback(null)}
                    className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {filteredBooks.length === 0 ? (
                <div className="py-10 text-center rounded-2xl border border-dashed border-[#b9e7ff] dark:border-zinc-800 space-y-2">
                  <BookOpen className="w-8 h-8 text-[#4086ee] mx-auto opacity-80" />
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    {books.length === 0
                      ? 'Hiện không còn tin đăng nào trên hệ thống.'
                      : 'Không tìm thấy tin đăng phù hợp với từ khóa.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredBooks.map((b) => {
                    const isConfirming = confirmDeleteId === b.id;
                    return (
                      <div
                        key={b.id}
                        className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={b.images[0]}
                            alt={b.title}
                            className="w-11 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-zinc-700 bg-white"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {b.title}
                            </div>
                            <div className="text-slate-500 dark:text-zinc-400 text-[11px] truncate">
                              Người bán: <b>{b.seller.name}</b> • {b.universityName} • {b.major}
                            </div>
                            <div className="font-extrabold text-[#0860c9] dark:text-sky-400">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(b.price)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {isConfirming ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold hover:bg-slate-100 cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(b)}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xác nhận xóa</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(b.id)}
                              className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-200 dark:border-rose-900 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa tin</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {v.studentName}
                      </h4>
                      <span className="text-xs font-mono font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200">
                        MSSV: {v.studentIdNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : v.status === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {v.status === 'approved'
                          ? 'Đã duyệt'
                          : v.status === 'rejected'
                          ? 'Đã từ chối'
                          : 'Chờ duyệt'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-zinc-300 mt-1 space-y-0.5">
                      <div>
                        Email trường: <span className="font-mono">{v.studentEmail}</span>
                      </div>
                      <div className="text-slate-400 dark:text-zinc-400 text-[11px]">
                        {v.notes} • Gửi {v.submittedAt}
                      </div>
                    </div>
                  </div>

                  {v.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onApproveVerification(v.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Duyệt</span>
                      </button>
                      <button
                        type="button"
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
        </div>
      </div>
    </div>
  );
};
