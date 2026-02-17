"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const next = () => {
    if (index < 2) {
      haptic("light");
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      haptic("light");
      setIndex(index - 1);
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
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {index === 0 && (
              <motion.div
                key="screen1"
                className="absolute inset-0 px-6 pt-10 overflow-y-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
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
                className="absolute inset-0 px-6 pt-10 overflow-y-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
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
                className="absolute inset-0 overflow-y-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <LoginAccount onLogin={handleDone} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className={`h-2 rounded-full transition-all ${index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
          </div>

          <div className="flex gap-3">
            {index > 0 && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 700, damping: 40 }}
                onClick={prev}
                className="flex-1 h-12 rounded-2xl border border-zinc-200 bg-white text-zinc-900 font-semibold shadow-sm"
              >
                Назад
              </motion.button>
            )}

            {index < 2 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 700, damping: 40 }}
                onClick={next}
                className="flex-1 h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm"
              >
                Продолжить
              </motion.button>
            ) : null}
          </div>

          {index === 0 && (
            <div className="text-center text-xs text-zinc-400 mt-3">
              Нажмите "Продолжить", чтобы узнать больше
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}