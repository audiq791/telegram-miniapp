"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Copy, 
  Share2,
  Check,
  MessageCircle,
  Mail,
  Link
} from "lucide-react";
import { useState } from "react";

type ReceiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Фиксированный адрес кошелька
const WALLET_ADDRESS = "UQA754XVVal-AHWEwK8t8YzSvGttHiDt1XoUzpY-2XFQWaTN";

export default function ReceiveModal({ isOpen, onClose }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Копирование адреса в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Открыть Telegram
  const handleTelegram = () => {
    const text = encodeURIComponent(`Мой BON-адрес: ${WALLET_ADDRESS}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(WALLET_ADDRESS)}&text=${text}`, '_blank');
  };

  // Открыть WhatsApp
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Мой BON-адрес: ${WALLET_ADDRESS}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Открыть Email
  const handleEmail = () => {
    const subject = encodeURIComponent('Мой BON-адрес');
    const body = encodeURIComponent(`Мой адрес для получения бонусов:\n\n${WALLET_ADDRESS}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Нативный шеринг
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мой BON-адрес',
          text: WALLET_ADDRESS,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h2 className="text-lg font-semibold">Зачисление Бонусов</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Контент */}
            <div className="p-6 space-y-6">
              {/* Заголовок QR */}
              <div className="text-center">
                <p className="text-sm text-zinc-600">
                  Отсканируйте QR-Код для Зачисления
                </p>
              </div>

              {/* QR-код */}
              <div className="flex justify-center">
                <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WALLET_ADDRESS)}`}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Адрес кошелька */}
              <div className="space-y-2">
                <div className="text-xs text-zinc-500 px-1">Адрес кошелька</div>
                <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="flex-1 font-mono text-sm truncate" title={WALLET_ADDRESS}>
                    {WALLET_ADDRESS}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="h-9 w-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors relative"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} className="text-zinc-600" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Кнопка поделиться */}
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNativeShare}
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-zinc-800 transition-colors"
                >
                  <Share2 size={18} />
                  Поделиться адресом
                </motion.button>

                {/* Меню быстрого шеринга (показывается если нет нативного) */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-4 gap-2 pt-2"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTelegram}
                        className="p-3 bg-sky-50 rounded-xl flex flex-col items-center gap-1 hover:bg-sky-100 transition-colors"
                      >
                        <MessageCircle size={20} className="text-sky-600" />
                        <span className="text-[10px] font-medium text-sky-700">Telegram</span>
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWhatsApp}
                        className="p-3 bg-green-50 rounded-xl flex flex-col items-center gap-1 hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle size={20} className="text-green-600" />
                        <span className="text-[10px] font-medium text-green-700">WhatsApp</span>
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEmail}
                        className="p-3 bg-blue-50 rounded-xl flex flex-col items-center gap-1 hover:bg-blue-100 transition-colors"
                      >
                        <Mail size={20} className="text-blue-600" />
                        <span className="text-[10px] font-medium text-blue-700">Email</span>
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopy}
                        className="p-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-100 transition-colors"
                      >
                        <Link size={20} className="text-gray-600" />
                        <span className="text-[10px] font-medium text-gray-700">Копия</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Примечание */}
              <p className="text-xs text-zinc-400 text-center">
                Адрес кошелька действителен для зачисления BON-бонусов
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}