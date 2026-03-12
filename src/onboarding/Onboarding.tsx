"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { haptic } from "../components/haptics";
import LoginAccount from "../screens/LoginAccount";

function Scene1({ onNext }: { onNext: () => void }) {
  return (
    <div className="h-full w-full overflow-y-auto px-6 pt-8 pb-8 sm:pt-12">
      <div className="mx-auto max-w-md">
        <div className="relative mb-6 flex h-64 w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-amber-50/80 to-orange-100/80 shadow-sm sm:mb-8 sm:h-80">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-amber-400/60"
              initial={{
                x: Math.random() * 300,
                y: Math.random() * 300,
                opacity: 0.2,
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 20, -20, 20],
                opacity: [0.2, 0.5, 0.2],
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
              scale: [1, 1.08, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl">
              <span className="text-4xl font-light tracking-tight text-white">B</span>
            </div>
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/50 bg-white/90 shadow-md backdrop-blur-xs"
              animate={{
                x: [0, 80 * Math.cos(i * 60), 0],
                y: [0, 80 * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "linear",
              }}
            >
              <span className="text-lg font-light text-amber-600">B</span>
            </motion.div>
          ))}
        </div>

        <div className="px-1">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
            Биржа Бонусов от OEM Tech
          </h1>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className="mb-8 space-y-4">
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Добро пожаловать в новую экономику лояльности.
            </p>
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Здесь бонусы это не просто баллы. Это актив, которым можно управлять.
            </p>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              onClick={onNext}
              className="h-12 w-40 rounded-xl bg-zinc-900 text-base font-medium text-white shadow-md transition-colors hover:bg-zinc-800"
            >
              Далее
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene2() {
  return (
    <div className="h-full w-full overflow-y-auto px-6 pt-8 pb-8 sm:pt-12">
      <div className="mx-auto max-w-md">
        <div className="relative mb-6 flex h-60 w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-emerald-50/80 to-green-100/80 shadow-sm sm:mb-8 sm:h-80">
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-28 w-28 rounded-2xl bg-white p-3 shadow-lg sm:h-36 sm:w-36">
              <div className="grid grid-cols-7 gap-1">
                {[...Array(49)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 w-2.5 rounded-xs ${
                      Math.random() > 0.6 ? "bg-zinc-900" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-emerald-400/70"
              animate={{
                top: ["10%", "90%", "10%"],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-600/60"
              initial={{ x: Math.random() * 200 + 50, y: -50 }}
              animate={{ y: 400, rotate: 360 }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="px-1">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
            Покупки приносят больше
          </h2>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Ваши повседневные траты превращаются в ценность.
            </p>
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Показывайте QR-код у партнёров и получайте бонусы, которые можно конвертировать и использовать выгодно.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene3() {
  const candles = Array.from({ length: 40 }, () => ({
    height: Math.floor(Math.random() * 90) + 15,
    isGreen: Math.random() > 0.48,
  }));

  const chartData = Array.from({ length: 50 }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100) + 20,
  }));

  return (
    <div className="h-full w-full overflow-y-auto px-6 pt-8 pb-8 sm:pt-12">
      <div className="mx-auto max-w-md">
        <div className="relative mb-6 flex h-60 w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-slate-50/80 to-slate-100/80 shadow-sm sm:mb-8 sm:h-80">
          <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none">
            <motion.polyline
              points={chartData.map((p) => `${p.x * 8},${120 - p.y}`).join(" ")}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.polyline
              points={chartData.map((p) => `${p.x * 8 + 20},${140 - p.y * 0.8}`).join(" ")}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>

          <div className="relative z-10 flex h-40 w-full items-end gap-0.5 px-1 sm:h-48">
            {candles.map((candle, i) => (
              <motion.div
                key={i}
                className="relative max-w-2 flex-1"
                initial={{ height: 0 }}
                animate={{ height: candle.height }}
                transition={{
                  duration: 1.5 + Math.random() * 3,
                  delay: i * 0.03,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <div
                  className={`absolute bottom-0 w-full ${
                    candle.isGreen ? "bg-emerald-500/70" : "bg-rose-400/70"
                  }`}
                  style={{ height: "70%" }}
                />
                <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-zinc-400/50" />
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-4 left-0 right-0 z-20 overflow-hidden bg-zinc-800/80 py-2.5 text-white/90 backdrop-blur-sm">
            <motion.div
              className="whitespace-nowrap"
              animate={{ x: [300, -1200] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <span className="px-4 text-xs font-light tracking-wider">
                BON/VV <span className="text-emerald-400">+2.4%</span> • BON/DODO <span className="text-rose-400">-1.2%</span> • BON/CSKA <span className="text-emerald-400">+5.7%</span> • BON/WB <span className="text-emerald-400">+3.1%</span> • BON/FUEL <span className="text-rose-400">-0.8%</span> • BON/MG <span className="text-emerald-400">+1.9%</span> •
              </span>
            </motion.div>
          </div>
        </div>

        <div className="px-1">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
            Добро пожаловать на торги
          </h2>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Здесь бонусы работают по законам рынка.
            </p>
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Следите за спросом на бонусы партнёров. Выбирайте момент. Обменивайте с выгодой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene4() {
  return (
    <div className="h-full w-full overflow-y-auto px-6 pt-8 pb-8 sm:pt-12">
      <div className="mx-auto max-w-md">
        <div className="relative mb-6 flex h-60 w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-violet-50/80 to-purple-100/80 shadow-sm sm:mb-8 sm:h-80">
          <motion.div
            className="relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-28 w-28 rounded-full border-2 border-violet-400/30 border-t-violet-500/70" />
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-xs"
              style={{
                background: `linear-gradient(135deg, hsl(${i * 60}, 80%, 95%), hsl(${i * 60 + 30}, 80%, 92%))`,
              }}
              animate={{
                x: [0, 100 * Math.cos(i * 60), 0],
                y: [0, 100 * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
            >
              <span className="text-sm font-light text-zinc-700">B</span>
            </motion.div>
          ))}

          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-purple-400/40"
              animate={{
                x: [0, 120 * Math.cos(i * 30), 0],
                y: [0, 120 * Math.sin(i * 30), 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </div>

        <div className="px-1">
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-3xl">
            Теперь лояльность работает на вас
          </h2>

          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Вы управляете своими бонусами, а не наоборот.
            </p>
            <p className="text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Копите то, что нужно вам. Обменивайте то, что ценят другие.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isDoneRef = useRef(false);
  const swipeStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const isSwipeGestureRef = useRef(false);
  const activeSwipeInputRef = useRef<"pointer" | "touch" | null>(null);

  useEffect(() => {
    setSwipeOffset(0);
  }, [index]);

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

  const beginSwipe = (x: number, y: number) => {
    swipeStartRef.current = {
      x,
      y,
      t: Date.now(),
    };
    isSwipeGestureRef.current = false;
  };

  const updateSwipe = (x: number, y: number): boolean => {
    if (!swipeStartRef.current) return false;

    const dx = x - swipeStartRef.current.x;
    const dy = y - swipeStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!isSwipeGestureRef.current && absX > 10 && absX > absY * 1.15) {
      isSwipeGestureRef.current = true;
    }

    if (!isSwipeGestureRef.current) return false;

    const blockedAtStart = index === 0 && dx > 0;
    const blockedAtEnd = index === 4 && dx < 0;
    if (blockedAtStart || blockedAtEnd) {
      setSwipeOffset(0);
      return true;
    }

    // Subtle resistance to imitate native pull behavior.
    const resisted = Math.max(-86, Math.min(86, dx * 0.42));
    setSwipeOffset(resisted);
    return true;
  };

  const finalizeSwipe = (x: number, y: number) => {
    if (isExiting || !swipeStartRef.current) {
      swipeStartRef.current = null;
      isSwipeGestureRef.current = false;
      setSwipeOffset(0);
      return;
    }

    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    const dx = x - start.x;
    const dy = y - start.y;
    const dt = Date.now() - start.t;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const velocity = absX / Math.max(dt, 1);

    setSwipeOffset(0);

    if (absX < 42 || absX < absY * 1.25 || velocity < 0.12) {
      isSwipeGestureRef.current = false;
      return;
    }

    // Native behavior: left swipe -> next, right swipe -> previous.
    if (dx < 0) {
      next();
    } else {
      prev();
    }

    isSwipeGestureRef.current = false;
  };

  const cancelSwipe = () => {
    swipeStartRef.current = null;
    isSwipeGestureRef.current = false;
    setSwipeOffset(0);
    activeSwipeInputRef.current = null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (activeSwipeInputRef.current === "touch") return;
    activeSwipeInputRef.current = "pointer";
    beginSwipe(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (activeSwipeInputRef.current !== "pointer") return;
    updateSwipe(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (activeSwipeInputRef.current !== "pointer") return;
    finalizeSwipe(event.clientX, event.clientY);
    activeSwipeInputRef.current = null;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (activeSwipeInputRef.current === "pointer") return;
    activeSwipeInputRef.current = "touch";
    const touch = event.touches[0];
    if (!touch) return;
    beginSwipe(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (activeSwipeInputRef.current !== "touch") return;
    const touch = event.touches[0];
    if (!touch) return;
    const isHorizontalSwipe = updateSwipe(touch.clientX, touch.clientY);
    if (isHorizontalSwipe && event.cancelable) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (activeSwipeInputRef.current !== "touch") return;
    const touch = event.changedTouches[0];
    if (!touch) {
      cancelSwipe();
      return;
    }
    finalizeSwipe(touch.clientX, touch.clientY);
    activeSwipeInputRef.current = null;
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const showFooterNav = !isExiting && index > 0 && index < 4;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-hidden">
          <motion.div
            className="relative h-full"
            onPointerDownCapture={handlePointerDown}
            onPointerMoveCapture={handlePointerMove}
            onPointerUpCapture={handlePointerUp}
            onPointerCancelCapture={cancelSwipe}
            onTouchStartCapture={handleTouchStart}
            onTouchMoveCapture={handleTouchMove}
            onTouchEndCapture={handleTouchEnd}
            onTouchCancelCapture={cancelSwipe}
            style={{ touchAction: "pan-y" }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="absolute inset-0 overflow-hidden"
              >
                <motion.div
                  animate={{ x: swipeOffset }}
                  transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.5 }}
                  className="h-full"
                >
                  {index === 0 && <Scene1 onNext={next} />}
                  {index === 1 && <Scene2 />}
                  {index === 2 && <Scene3 />}
                  {index === 3 && <Scene4 />}
                  {index === 4 && <LoginAccount onLogin={handleDone} onBack={prev} />}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {showFooterNav && (
          <div
            className="shrink-0 border-t border-zinc-100 bg-white/95 px-6 pt-4 backdrop-blur-sm"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
          >
            <div className="mb-5 flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === i ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={prev}
                className="h-12 w-28 rounded-xl border border-zinc-200 bg-white text-base font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
              >
                Назад
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={next}
                className="h-12 w-28 rounded-xl bg-zinc-900 text-base font-medium text-white shadow-md transition-colors hover:bg-zinc-800"
              >
                Далее
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
