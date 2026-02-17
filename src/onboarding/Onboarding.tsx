"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { haptic } from "../components/haptics";
import SceneDigitize from "./SceneDigitize";
import SceneSwap from "./SceneSwap";
import ProfileScreen from "../screens/ProfileScreen";

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const isDoneRef = useRef(false);

  const handleDone = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    haptic("success");
    onDone();
  };

  return (
    <motion.div
      className="fixed inset-0 z-100 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="h-full flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              if (swipe < -70 && index < 2) {
                haptic("light");
                setIndex(index + 1);
              } else if (swipe > 70 && index > 0) {
                haptic("light");
                setIndex(index - 1);
              }
            }}
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

            {/* Экран 3 — ProfileScreen */}
            <div className="w-full shrink-0">
              <ProfileScreen onLogin={handleDone} />
            </div>
          </motion.div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className={`h-2 rounded-full transition-all ${index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            <div className={`h-2 rounded-full transition-all ${index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
          </div>

          <motion.button
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            onClick={() => {
              if (index === 2) {
                // На третьем экране кнопка не нужна, вход через ProfileScreen
                return;
              } else {
                haptic("light");
                setIndex(index + 1);
              }
            }}
            className={`w-full h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm ${
              index === 2 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            Продолжить
          </motion.button>

          {index < 2 && (
            <div className="text-center text-xs text-zinc-400 mt-3">
              Свайпните, чтобы увидеть следующий шаг
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}