"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { haptic } from "../components/haptics";
import SceneDigitize from "./SceneDigitize";
import SceneSwap from "./SceneSwap";
import ProfileScreen from "../screens/ProfileScreen"; // <-- целиком экран профиля

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
              <TextBlock
                title="Деньги → Бонусы"
                subtitle="Оцифровывайте покупки и превращайте их в бонусы партнёров."
              />
            </div>

            {/* Экран 2 */}
            <div className="w-full shrink-0 px-6 pt-10">
              <SceneSwap />
              <TextBlock
                title="Обмен внутри партнёров"
                subtitle="Меняйте бонусы между брендами — быстро, красиво и прозрачно."
              />
            </div>

            {/* Экран 3 — ProfileScreen целиком */}
            <div className="w-full shrink-0">
              <ProfileScreen />
            </div>
          </motion.div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Dot active={index === 0} />
            <Dot active={index === 1} />
            <Dot active={index === 2} />
          </div>

          <motion.button
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            onClick={() => {
              if (index === 2) {
                handleDone();
              } else {
                haptic("light");
                setIndex(index + 1);
              }
            }}
            className="w-full h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm"
          >
            {index === 2 ? "Начать" : "Продолжить"}
          </motion.button>

          <div className="text-center text-xs text-zinc-400 mt-3">
            Свайпните, чтобы увидеть следующий шаг
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Dot({ active }: { active: boolean }) {
  return (
    <div className={["h-2 rounded-full transition-all", active ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"].join(" ")} />
  );
}

function TextBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-6 max-w-md">
      <div className="text-2xl font-semibold tracking-tight">{title}</div>
      <div className="text-sm text-zinc-500 mt-2 leading-relaxed">{subtitle}</div>
    </div>
  );
}