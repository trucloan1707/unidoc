import React, { useState } from 'react';
import { Book, ChatMessage } from '../types';
import { BookCoverGraphic } from './BookCoverGraphic';
import { HumorousBadge } from './HumorousBadge';
import {
  X,
  Send,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShoppingCart,
  Smile,
  Paperclip,
} from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBook: Book | null;
  onAddToCart: (book: Book) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  activeBook,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'seller',
      text: 'Chào bạn! Mình là chủ cuốn sách này. Mình thường có mặt ở KTX Khu B và Thư viện trung tâm ĐHQG nhé!',
      createdAt: '10:15',
    },
    {
      id: 'm2',
      senderId: 'buyer',
      text: 'Chào bạn, sách cuốn Giải tích này còn đầy đủ bài tập ôn giữa kỳ chứ bạn?',
      createdAt: '10:16',
    },
    {
      id: 'm3',
      senderId: 'seller',
      text: 'Đầy đủ 100% nha bạn ơi, có sẵn note bằng bút chì các công thức hay ra thi thầy Huy dặn nữa!',
      createdAt: '10:17',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen || !activeBook) return null;

  const quickIcebreakers = [
    'Sách còn không bạn ơi? 📚',
    'Bớt 10k tiền trà sữa được không bạn? 🧋',
    'Hẹn lấy tại KTX Khu B lúc 17h nha! 📍',
    'Gặp ở Canteen C6 được không?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      senderId: 'buyer',
      text: text.trim(),
      createdAt: 'Vừa xong',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulate friendly seller response after 1 second
    setTimeout(() => {
      const sellerReply: ChatMessage = {
        id: `m_reply_${Date.now()}`,
        senderId: 'seller',
        text: 'Okie chốt luôn bạn ơi! Chiều nay mình mang sách qua thư viện trường nha, cứ alo mình!',
        createdAt: 'Vừa xong',
      };
      setMessages((prev) => [...prev, sellerReply]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-3xl max-w-lg w-full h-[620px] max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col">
        {/* Header with Seller Profile & Humorous Title */}
        <div className="px-4 py-3 bg-slate-900 dark:bg-black text-white flex items-center justify-between border-b border-slate-800 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={activeBook.seller.avatar}
                alt={activeBook.seller.name}
                className="w-10 h-10 rounded-full object-cover border border-sky-400"
              />
              <span className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{activeBook.seller.name}</span>
                <HumorousBadge badge={activeBook.seller.sellerBadge} size="xs" interactive={false} />
              </div>
              <p className="text-[11px] text-slate-300">
                {activeBook.seller.university} • Đang online
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pinned Book Preview Card */}
        <div className="p-2.5 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookCoverGraphic
              book={activeBook}
              compact
              className="w-10 h-12 rounded-lg object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
            />
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{activeBook.title}</h5>
              <div className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activeBook.price)}
              </div>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(activeBook)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Đặt mua
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-black">
          {messages.map((m) => {
            const isMe = m.senderId === 'buyer';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 px-1">{m.createdAt}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Bargain & Icebreaker Chips */}
        <div className="px-3 py-2 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto">
          {quickIcebreakers.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(chip)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-sky-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white hover:text-sky-800 dark:hover:text-sky-300 border border-transparent dark:border-zinc-800 transition-colors shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat input box */}
        <div className="p-3 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
            placeholder="Nhắn tin với người bán sách..."
            className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-zinc-900 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 border border-slate-200 dark:border-zinc-700 focus:border-sky-500 focus:outline-hidden"
          />
          <button
            onClick={() => handleSend(inputVal)}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
