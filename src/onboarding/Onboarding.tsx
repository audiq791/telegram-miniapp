"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { haptic } from "../components/haptics";
import LoginAccount from "../screens/LoginAccount";

// ==================== ЭКРАН 1 ====================
function Scene1() {
  return (
    <div className="w-full h-full px-6 pt-10 overflow-y-auto">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="relative h-80 w-full bg-linear-to-br from-amber-50 to-orange-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              initial={{
                x: Math.random() * 300,
                y: Math.random() * 300,
                opacity: 0.3,
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 20, -20, 20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <motion.div
            className="relative z-10"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-32 w-32 rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 shadow-2xl flex items-center justify-center">
              <span className="text-5xl font-bold text-white">B</span>
            </div>
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute h-12 w-12 rounded-2xl bg-white border-2 border-amber-200 shadow-lg flex items-center justify-center"
              animate={{
                x: [0, 100 * Math.cos(i * 60), 0],
                y: [0, 100 * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <span className="text-xl font-bold text-amber-600">B</span>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-1">Биржа Бонусов от OEM Tech</h2>
        <p className="text-sm text-zinc-500 mb-3">Где бонусы становятся активом.</p>
        <p className="text-base font-medium text-zinc-700">
          Обменивайте. Управляйте. Умножайте.
        </p>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 2 ====================
function Scene2() {
  return (
    <div className="w-full h-full px-6 pt-10 overflow-y-auto">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="relative h-80 w-full bg-linear-to-br from-emerald-50 to-green-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="h-40 w-40 bg-white rounded-2xl shadow-lg p-2">
              <div className="grid grid-cols-7 gap-1">
                {[...Array(49)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${
                      Math.random() > 0.6 ? "bg-black" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="absolute left-0 right-0 h-1 bg-emerald-400"
              animate={{
                top: ["10%", "90%", "10%"],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600"
              initial={{ x: Math.random() * 200 + 50, y: -50 }}
              animate={{ y: 400, rotate: 360 }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-1">Покупки приносят больше</h2>
        <p className="text-sm text-zinc-500 mb-3">Ваши повседневные траты превращаются в ценность.</p>
        <p className="text-base font-medium text-zinc-700">
          Показывайте QR-код у партнёров и получайте бонусы, которые можно конвертировать и использовать выгодно.
        </p>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 3 ====================
function Scene3() {
  return (
    <div className="w-full h-full px-6 pt-10 overflow-y-auto">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="relative h-80 w-full bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          <div className="flex items-end gap-2 h-48">
            {[40, 70, 45, 90, 60, 85, 55].map((height, i) => (
              <motion.div
                key={i}
                className="relative w-8"
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <div
                  className={`absolute bottom-0 w-full ${
                    height > 50 ? "bg-green-500" : "bg-red-500"
                  } rounded-t-sm`}
                  style={{ height: height * 0.7 }}
                />
                <div className="absolute w-0.5 bg-black/30 left-1/2 -translate-x-1/2 h-full" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute bottom-4 left-0 right-0 bg-slate-800/80 text-white py-2"
            animate={{ x: [300, -300] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <p className="text-sm whitespace-nowrap">
              BON/VV: +2.4% • BON/DODO: -1.2% • BON/CSKA: +5.7% • BON/WB: +3.1% •
            </p>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-1">Добро пожаловать на торги</h2>
        <p className="text-sm text-zinc-500 mb-3">Здесь бонусы работают по законам рынка.</p>
        <p className="text-base font-medium text-zinc-700">
          Следите за спросом на бонусы партнёров. Выбирайте момент. Обменивайте с выгодой.
        </p>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 4 ====================
function Scene4() {
  return (
    <div className="w-full h-full px-6 pt-10 overflow-y-auto">
      <div className="mt-6 rounded-[28px] border border-zinc-200 bg-white overflow-hidden shadow-sm p-6">
        <div className="relative h-80 w-full bg-linear-to-br from-violet-50 to-purple-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          <motion.div
            className="relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-32 w-32 rounded-full border-4 border-violet-400 border-t-violet-600" />
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute h-12 w-12 rounded-2xl bg-white shadow-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 50%), hsl(${i * 60 + 30}, 70%, 50%))`,
              }}
              animate={{
                x: [0, 120 * Math.cos(i * 60), 0],
                y: [0, 120 * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
            >
              <span className="text-white font-bold">B</span>
            </motion.div>
          ))}

          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              animate={{
                x: [0, 150 * Math.cos(i * 30), 0],
                y: [0, 150 * Math.sin(i * 30), 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-1">Теперь лояльность работает на вас</h2>
        <p className="text-sm text-zinc-500 mb-3">Вы управляете своими бонусами — а не наоборот.</p>
        <p className="text-base font-medium text-zinc-700">
          Копите то, что нужно вам. Обменивайте то, что ценят другие.
        </p>
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isExiting) return;

    const swipe = info.offset.x;
    const velocity = info.velocity.x;

    // свайп влево → следующий экран (кроме последнего)
    if (swipe < -50 && velocity < -0.2 && index < 4) {
      setDirection(1);
      haptic("light");
      setIndex(index + 1);
    }
    // свайп вправо → предыдущий экран (кроме первого)
    else if (swipe > 50 && velocity > 0.2 && index > 0) {
      setDirection(-1);
      haptic("light");
      setIndex(index - 1);
    }
    // на первом экране свайп вправо ничего не делает (только резинка)
    // на последнем экране свайп влево ничего не делает (только резинка)
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
          <motion.div
            className="relative h-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <Scene1 />
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <Scene2 />
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <Scene3 />
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
                  className="absolute inset-0 overflow-y-auto"
                >
                  <Scene4 />
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
          </motion.div>
        </div>

        {!isExiting && index < 4 && (
          <div 
            className="absolute left-0 right-0 px-6"
            style={{ bottom: "140px" }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    index === i ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={() => {
                  if (index < 4) {
                    setDirection(1);
                    haptic("light");
                    setIndex(index + 1);
                  }
                }}
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