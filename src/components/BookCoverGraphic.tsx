import React, { useState } from 'react';
import { Book } from '../types';
import { BookOpen } from 'lucide-react';

interface BookCoverGraphicProps {
  book: Book;
  imageIndex?: number;
  className?: string;
  compact?: boolean;
}

export const BookCoverGraphic: React.FC<BookCoverGraphicProps> = ({
  book,
  imageIndex = 0,
  className = '',
  compact = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const isDigital = book.itemType === 'digital' || Boolean(book.fileFormat);
  const src = book.images[imageIndex] || book.images[0];

  if (!isDigital && src && !hasError) {
    return (
      <img
        src={src}
        alt={book.title}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
    );
  }

  if (isDigital) {
    const format = book.fileFormat || 'PDF';
    const palette = {
      PDF: {
        softBg: 'bg-rose-50 dark:bg-rose-950/40',
        badgeBg: 'bg-[#ef4444]',
        border: 'border-rose-200 dark:border-rose-900/60',
        subtitle: 'Tài liệu PDF',
      },
      DOC: {
        softBg: 'bg-sky-50 dark:bg-sky-950/40',
        badgeBg: 'bg-[#4086ee]',
        border: 'border-[#b9e7ff] dark:border-sky-900/60',
        subtitle: 'Tài liệu Word',
      },
      XLS: {
        softBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        badgeBg: 'bg-[#10b981]',
        border: 'border-emerald-200 dark:border-emerald-900/60',
        subtitle: 'Bảng tính Excel',
      },
    }[format];

    if (compact) {
      return (
        <div
          className={`${className} ${palette.softBg} border ${palette.border} flex flex-col items-center justify-center p-1 select-none`}
        >
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-black text-white ${palette.badgeBg}`}
          >
            {format}
          </span>
        </div>
      );
    }

    return (
      <div
        className={`${className} ${palette.softBg} flex flex-col items-center justify-center p-4 select-none relative overflow-hidden`}
      >
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#b9e7ff]/35 dark:bg-sky-500/10 pointer-events-none" />
        <div className="absolute -top-8 -right-6 w-24 h-24 rounded-full bg-white/60 dark:bg-zinc-800/40 pointer-events-none" />
        <div
          className={`relative z-10 w-24 h-28 rounded-2xl bg-white dark:bg-zinc-900 border-2 ${palette.border} shadow-md flex flex-col justify-between p-2.5`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider text-white ${palette.badgeBg}`}
            >
              {format}
            </span>
            <div className="w-3 h-3 rounded-tr-md bg-[#edf8fe] dark:bg-zinc-800 border-b border-l border-[#b9e7ff] dark:border-zinc-700" />
          </div>
          {format === 'XLS' ? (
            <div className="grid grid-cols-3 gap-1 my-auto">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-xs ${
                    idx < 3
                      ? 'bg-emerald-400/70 dark:bg-emerald-500/50'
                      : 'bg-emerald-100 dark:bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5 my-auto">
              <div className="h-1.5 w-full rounded-full bg-[#b9e7ff] dark:bg-zinc-700" />
              <div className="h-1.5 w-4/5 rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-3/5 rounded-full bg-[#b9e7ff]/80 dark:bg-zinc-700" />
            </div>
          )}
          <div className="text-[9px] font-bold text-[#5b728f] dark:text-zinc-400 truncate text-center">
            {palette.subtitle}
          </div>
        </div>
      </div>
    );
  }

  /* Physical textbook fallback */
  if (compact) {
    return (
      <div
        className={`${className} bg-gradient-to-b from-[#4086ee] to-[#0860c9] flex items-center justify-center p-1 text-white select-none`}
      >
        <BookOpen className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-gradient-to-br from-[#edf8fe] via-[#dbeeff] to-[#c7e6ff] dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4 relative overflow-hidden select-none`}
    >
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/50 dark:bg-sky-500/10 pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#4086ee]/15 pointer-events-none" />
      <div className="relative z-10 w-24 h-32 rounded-r-xl rounded-l-sm bg-gradient-to-b from-[#4086ee] to-[#0860c9] shadow-lg border-l-4 border-[#054594] p-2.5 flex flex-col justify-between text-white">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider text-sky-100">
            {book.subjectCode || 'UNIDOC'}
          </span>
          <BookOpen className="w-3 h-3 text-sky-200" />
        </div>
        <div className="my-auto">
          <div className="text-[11px] font-black leading-tight line-clamp-3">
            {book.title}
          </div>
        </div>
        <div className="pt-1 border-t border-white/20 text-[8px] font-semibold text-sky-100 truncate">
          {book.universityName}
        </div>
      </div>
    </div>
  );
};
