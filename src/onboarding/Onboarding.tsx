"use client";

import { useState, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { haptic } from "../components/haptics";
import SceneDigitize from "./SceneDigitize";
import SceneSwap from "./SceneSwap";
import LoginAccount from "../screens/LoginAccount";

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
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
    const threshold = 70;

    // Экран 1
    if (index === 0) {
      if (swipe < -threshold && velocity < -0.3) {
        haptic("light");
        setIndex(1);
      }
    }
    // Экран 2
    else if (index === 1) {
      if (swipe > threshold && velocity > 0.3) {
        haptic("light");
        setIndex(0);
      } else if (swipe < -threshold && velocity < -0.3) {
        haptic("light");
        setIndex(2);
      }
    }
    // Экран 3
    else if (index === 2) {
      if (swipe > threshold && velocity > 0.3) {
        haptic("light");
        setIndex(1);
      }
    }
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
          <motion.div
            className="h-full flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Экран 1 */}
            <div className="w-full shrink-0 px-6 pt-10">
              <SceneDigitize />
              <div className="mt-6 max-w-md">
                <div className="text-2xl font-semibold tracking-tight">
                  Деньги → Бонусы
                </div>
                <div className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Оцифровывайте покупки и превращайте их в бонусы партнёров.
                </div>
              </div>
            </div>

            {/* Экран 2 */}
            <div className="w-full shrink-0 px-6 pt-10">
              <SceneSwap />
              <div className="mt-6 max-w-md">
                <div className="text-2xl font-semibold tracking-tight">
                  Обмен внутри партнёров
                </div>
                <div className="text-sm text-zinc-500 mt-2 leading-relaxed">
                  Меняйте бонусы между брендами — быстро, красиво и прозрачно.
                </div>
              </div>
            </div>

            {/* Экран 3 — LoginAccount */}
            <div className="w-full shrink-0">
              <LoginAccount onLogin={handleDone} />
            </div>
          </motion.div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className={`h-2 rounded-full transition-all ${index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
          </div>

          {index < 2 && (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 700, damping: 40 }}
                onClick={() => {
                  haptic("light");
                  setIndex(index + 1);
                }}
                className="w-full h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm"
              >
                Продолжить
              </motion.button>

              <div className="text-center text-xs text-zinc-400 mt-3">
                Свайпните, чтобы увидеть следующий шаг
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}