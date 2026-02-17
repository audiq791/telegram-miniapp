"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { haptic } from "../components/haptics";
import SceneDigitize from "./SceneDigitize";
import SceneSwap from "./SceneSwap";
import LoginAccount from "../screens/LoginAccount";

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: назад, 1: вперед
  const isDoneRef = useRef(false);

  const handleDone = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    haptic("success");
    onDone();
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;

    // Свайп влево (следующий экран)
    if (swipe < -50 && velocity < -0.2 && index < 2) {
      setDirection(1);
      haptic("light");
      setIndex(index + 1);
    }
    // Свайп вправо (предыдущий экран)
    else if (swipe > 50 && velocity > 0.2 && index > 0) {
      setDirection(-1);
      haptic("light");
      setIndex(index - 1);
    }
  };

  // Варианты анимации в зависимости от направления
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
    <motion.div
      className="fixed inset-0 z-100 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="relative h-full">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {index === 0 && (
                <motion.div
                  key="screen1"
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
                  className="absolute inset-0 px-6 pt-10 overflow-y-auto"
                >
                  <SceneDigitize />
                  <div className="mt-6 max-w-md">
                    <div className="text-2xl font-semibold tracking-tight">
                      Деньги → Бонусы
                    </div>
                    <div className="text-sm text-zinc-500 mt-2 leading-relaxed">
                      Оцифровывайте покупки и превращайте их в бонусы партнёров.
                    </div>
                  </div>
                </motion.div>
              )}

              {index === 1 && (
                <motion.div
                  key="screen2"
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
                  className="absolute inset-0 px-6 pt-10 overflow-y-auto"
                >
                  <SceneSwap />
                  <div className="mt-6 max-w-md">
                    <div className="text-2xl font-semibold tracking-tight">
                      Обмен внутри партнёров
                    </div>
                    <div className="text-sm text-zinc-500 mt-2 leading-relaxed">
                      Меняйте бонусы между брендами — быстро, красиво и прозрачно.
                    </div>
                  </div>
                </motion.div>
              )}

              {index === 2 && (
                <motion.div
                  key="screen3"
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <LoginAccount onLogin={handleDone} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className={`h-2 rounded-full transition-all ${index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
          </div>

          {index < 2 && (
            <div className="text-center text-xs text-zinc-400 mt-3">
              Свайпните влево, чтобы продолжить
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}