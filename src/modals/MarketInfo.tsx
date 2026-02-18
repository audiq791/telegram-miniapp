"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Repeat,
  Award
} from "lucide-react";

type MarketInfoProps = {
  isOpen: boolean;
  onClose: () => void;
};

const pages = [
  {
    icon: Sparkles,
    title: "Добро пожаловать в Маркет",
    text: "Здесь вы можете покупать и продавать бонусы партнёров по рыночной цене.",
    text2: "Маркет работает по принципам спроса и предложения — как настоящий рынок.",
    color: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-100"
  },
  {
    icon: Repeat,
    title: "Как это устроено",
    text: "Основной инструмент обмена — BRUB. 1 BRUB всегда равен 1 российскому рублю.",
    text2: "BRUB нельзя вывести или обналичить. Это нейтральный бонус, который можно хранить в кошельке и использовать в любой момент для покупки нужных бонусов партнёров.",
    color: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-100"
  },
  {
    icon: TrendingUp,
    title: "О ценах",
    text: "У бонусов партнёров есть рыночная стоимость. Она меняется в зависимости от спроса и предложения.",
    text2: "Если вы продаёте бонус дороже 1 BRUB и покупаете дешевле 1 BRUB — вы увеличиваете общее количество бонусов в своём портфеле.",
    color: "from-amber-500 to-orange-600",
    iconColor: "text-amber-100"
  },
  {
    icon: Award,
    title: "Главное правило",
    text: "Как и на любом рынке, важны момент и стратегия. Покупайте вовремя. Продавайте вовремя.",
    text2: "Подходите к Маркету осознанно — и лояльность партнёров начнёт работать на вас.",
    color: "from-purple-500 to-pink-600",
    iconColor: "text-purple-100"
  }
];

export default function MarketInfo({ isOpen, onClose }: MarketInfoProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;

    if (swipe < -50 && velocity < -0.2 && currentPage < pages.length - 1) {
      next();
    } else if (swipe > 50 && velocity > 0.2 && currentPage > 0) {
      prev();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Шапка с градиентом */}
            <div className={`relative bg-linear-to-br ${pages[currentPage].color} p-6 text-white`}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <X size={18} className="text-white" />
              </motion.button>
              
              <div className="flex items-center gap-3">
                <motion.div
                  key={currentPage}
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
                >
                  {pages.map((page, idx) => {
                    const Icon = page.icon;
                    return idx === currentPage ? (
                      <Icon key={idx} size={24} className="text-white" />
                    ) : null;
                  })}
                </motion.div>
                <motion.h2 
                  key={`title-${currentPage}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {pages[currentPage].title}
                </motion.h2>
              </div>
            </div>

            {/* Контент со свайпом — улучшенная типографика */}
            <div className="relative h-80">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 p-6 overflow-y-auto"
                >
                  <div className="space-y-6">
                    <p className="text-lg font-light leading-relaxed tracking-wide text-zinc-700">
                      {pages[currentPage].text}
                    </p>
                    <p className="text-lg font-light leading-relaxed tracking-wide text-zinc-700">
                      {pages[currentPage].text2}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Навигация */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={prev}
                  className={`h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center transition-colors ${
                    currentPage === 0 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-200'
                  }`}
                >
                  <ChevronLeft size={20} className="text-zinc-600" />
                </motion.button>

                {/* Индикаторы страниц */}
                <div className="flex items-center gap-2">
                  {pages.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentPage ? 1 : -1);
                        setCurrentPage(idx);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentPage ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-300'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={next}
                  className={`h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center transition-colors ${
                    currentPage === pages.length - 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-200'
                  }`}
                >
                  <ChevronRight size={20} className="text-zinc-600" />
                </motion.button>
              </div>

              {/* Кнопка закрытия на последней странице */}
              {currentPage === pages.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full mt-4 py-3 bg-zinc-900 text-white rounded-xl font-medium tracking-wide"
                >
                  Понятно, спасибо
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}