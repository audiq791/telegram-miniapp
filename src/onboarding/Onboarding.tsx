"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { haptic } from "../components/haptics";
import SceneDigitize from "./SceneDigitize";
import SceneSwap from "./SceneSwap";
import LoginAccount from "../screens/LoginAccount";

// Новые временные сцены
function SceneTemp1() {
  return (
    <div className="w-full h-full px-6 pt-10">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="h-85 w-full bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-zinc-400">Анимация 1</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Экран 1</h2>
        <p className="text-sm text-zinc-500">Тестовое описание первого нового экрана</p>
      </div>
    </div>
  );
}

function SceneTemp2() {
  return (
    <div className="w-full h-full px-6 pt-10">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="h-85 w-full bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-zinc-400">Анимация 2</span>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Экран 2</h2>
        <p className="text-sm text-zinc-500">Тестовое описание второго нового экрана</p>
      </div>
    </div>
  );
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isDoneRef = useRef(false);

  const handleDone = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    haptic("success");
    setIsExiting(true);
    setTimeout(() => {
      onDone();
    }, 300);
  };

  const next = () => {
    if (index < 4) {
      setDirection(1);
      haptic("light");
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      haptic("light");
      setIndex(index - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isExiting) return;

    const swipe = info.offset.x;
    const velocity = info.velocity.x;

    if (swipe < -50 && velocity < -0.2 && index < 4) {
      setDirection(1);
      haptic("light");
      setIndex(index + 1);
    }
    else if (swipe > 50 && velocity > 0.2 && index > 0) {
      setDirection(-1);
      haptic("light");
      setIndex(index - 1);
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
              {!isExiting && index === 0 && (
                <motion.div
                  key="screen0"
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
                  <SceneTemp1 />
                </motion.div>
              )}

              {!isExiting && index === 1 && (
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <SceneTemp2 />
                </motion.div>
              )}

              {!isExiting && index === 2 && (
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

              {!isExiting && index === 3 && (
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

              {!isExiting && index === 4 && (
                <motion.div
                  key="screen4"
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

              {isExiting && (
                <motion.div
                  key="exit"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="absolute inset-0 bg-white"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isExiting && index < 4 && (
          <div 
            className="absolute left-0 right-0 px-6"
            style={{ bottom: "160px" }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className={`h-2 rounded-full transition-all ${index === 0 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
              <div className={`h-2 rounded-full transition-all ${index === 1 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
              <div className={`h-2 rounded-full transition-all ${index === 2 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
              <div className={`h-2 rounded-full transition-all ${index === 3 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
              <div className={`h-2 rounded-full transition-all ${index === 4 ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"}`} />
            </div>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={next}
                className="w-56 h-14 rounded-2xl bg-zinc-900 text-white font-semibold text-lg shadow-sm"
              >
                Продолжить
              </motion.button>
            </div>

            {index === 0 && (
              <div className="text-center text-xs text-zinc-400 mt-3">
                Свайпните или нажмите "Продолжить"
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}