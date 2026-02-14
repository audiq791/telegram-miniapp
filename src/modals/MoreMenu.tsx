"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2,
  Send,
  Mail
} from "lucide-react";

type MoreMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const handleCompanyClick = () => {
    window.open('https://oemservice.tech/', '_blank');
    onClose();
  };

  const handleTelegramClick = () => {
    window.open('https://t.me/openexchangemarket_news', '_blank');
    onClose();
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@oe-media.ru';
    onClose();
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
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors shrink-0">
                  <Mail size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-900">Связаться с нами</p>
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
        </>
      )}
    </AnimatePresence>
  );
}