"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2,
  Send,
  Mail,
  Check,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

type MoreMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCompanyClick = () => {
    window.open('https://oemservice.tech/', '_blank');
    onClose();
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/openexchangemarket_news', '_blank');
    onClose();
  };

  const handleEmailClick = async () => {
    const email = 'info@oe-media.ru';
    
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setShowToast(true);
      
      // Показываем уведомление и закрываем меню
      setTimeout(() => {
        setShowToast(false);
        setCopied(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      alert(`Наш email: ${email}`);
      onClose();
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
            className="fixed inset-0 bg-black/20 z-[100]"
          />

          {/* Выпадающее меню */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[101] w-64 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden"
            style={{
              top: '60px',
              right: '16px',
            }}
          >
            {/* Шапка меню */}
            <div className="px-4 py-3 bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100">
              <p className="text-xs font-medium text-zinc-500 text-center">Информация</p>
            </div>

            {/* Список пунктов */}
            <div className="p-2">
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompanyClick}
                className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                  <Building2 size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">О Компании</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTelegramClick}
                className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors shrink-0">
                  <Send size={18} className="text-sky-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">Наш Telegram</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailClick}
                className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors shrink-0">
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Mail size={18} className="text-rose-600" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">
                    {copied ? "Email скопирован!" : "Связаться с нами"}
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Подвал */}
            <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400 text-center">
                Open Exchange Market © 2026
              </p>
            </div>
          </motion.div>

          {/* Всплывающее уведомление о копировании email */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[200] bg-green-500/90 backdrop-blur-sm text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 w-[90%] max-w-md border border-green-400/50"
              >
                <Check size={24} className="text-white shrink-0" />
                <p className="text-sm font-medium leading-relaxed flex-1">
                  Адрес электронной почты скопирован
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}