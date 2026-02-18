"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Wallet,
  Gift,
  ShoppingBag,
  Repeat,
  Send,
  Sparkles,
  Heart
} from "lucide-react";

type InfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
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
            {/* Шапка с градиентом */}
            <div className="relative bg-linear-to-br from-zinc-900 to-zinc-800 p-6 text-white">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <X size={18} className="text-white" />
              </motion.button>
              
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
                >
                  <Sparkles size={24} className="text-white" />
                </motion.div>
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold"
                  >
                    Биржа бонусов
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white/80"
                  >
                    Уникальная платформа
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Контент */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-zinc-600 leading-relaxed mb-6"
              >
                Биржа бонусов это уникальная платформа объединяющая программы лояльности, 
                бонусные системы и платежные сервисы в единую экосистему.
              </motion.p>

              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Wallet size={16} className="text-emerald-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-zinc-900">1. Уникальный бонусный кошелек</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Получите свой персональный кошелек для всех бонусов</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Gift size={16} className="text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-zinc-900">2. Копите бонусы партнеров</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Накапливайте бонусы наших партнеров при покупках</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <ShoppingBag size={16} className="text-purple-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-zinc-900">3. Списывайте бонусы</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      В ресторанах, магазинах и любимых сервисах
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Repeat size={16} className="text-amber-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-zinc-900">4. Обменивайте бонусы</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Меняйте бонусы между собой и пользуйтесь ими так, как удобно вам
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Send size={16} className="text-rose-600" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-zinc-900">5. Делитесь с близкими</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Отправляйте и принимайте бонусы от ваших друзей и членов семьи
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6 p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100"
              >
                <div className="flex items-start gap-2">
                  <Heart size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Следите за нашими обновлениями, чтобы первыми воспользоваться 
                    новыми возможностями платформы
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}