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

    // Порог свайпа
    const swipeThreshold = 70;

    // Экран 1
    if (index === 0) {
      // Свайп вправо → на экран 2 (только если достаточно быстро и далеко)
      if (swipe < -swipeThreshold && velocity < -0.3) {
        haptic("light");
        setIndex(1);
      }
      // Свайп влево — ничего не делаем (только резинка)
    }

    // Экран 2
    else if (index === 1) {
      // Свайп влево → на экран 1
      if (swipe > swipeThreshold && velocity > 0.3) {
        haptic("light");
        setIndex(0);
      }
      // Свайп вправо → на экран 3
      else if (swipe < -swipeThreshold && velocity < -0.3) {
        haptic("light");
        setIndex(2);
      }
    }

    // Экран 3
    else if (index === 2) {
      // Свайп влево → на экран 2
      if (swipe > swipeThreshold && velocity > 0.3) {
        haptic("light");
        setIndex(1);
      }
      // Свайп вправо — ничего не делаем (только резинка)
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-100 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="h-full flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
              mass: 1.2,
              restDelta: 0.5,
              restSpeed: 0.5
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            dragTransition={{
              power: 0.2,
              timeConstant: 200,
              modifyTarget: target => target // без прилипания
            }}
            onDragEnd={handleDragEnd}
          >
            {/* Экран 1 */}
            <motion.div
              className="w-full shrink-0 px-6 pt-10"
              layout
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <SceneDigitize />
              <div className="mt-6 max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  Деньги → Бонусы
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-sm text-zinc-500 mt-2 leading-relaxed"
                >
                  Оцифровывайте покупки и превращайте их в бонусы партнёров.
                </motion.div>
              </div>
            </motion.div>

            {/* Экран 2 */}
            <motion.div
              className="w-full shrink-0 px-6 pt-10"
              layout
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <SceneSwap />
              <div className="mt-6 max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  Обмен внутри партнёров
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-sm text-zinc-500 mt-2 leading-relaxed"
                >
                  Меняйте бонусы между брендами — быстро, красиво и прозрачно.
                </motion.div>
              </div>
            </motion.div>

            {/* Экран 3 — LoginAccount */}
            <motion.div
              className="w-full shrink-0"
              layout
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <LoginAccount onLogin={handleDone} />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="px-6 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"
              }`}
              animate={{ scale: index === 0 ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"
              }`}
              animate={{ scale: index === 1 ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <motion.div
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"
              }`}
              animate={{ scale: index === 2 ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </div>

          {index < 2 && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                onClick={() => {
                  haptic("light");
                  setIndex(index + 1);
                }}
                className="w-full h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm"
              >
                Продолжить
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-zinc-400 mt-3"
              >
                Свайпните, чтобы увидеть следующий шаг
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}