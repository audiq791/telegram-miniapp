"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { haptic } from "../components/haptics";
import LoginAccount from "../screens/LoginAccount";

// ==================== ЭКРАН 1 ====================
function Scene1({ onNext }: { onNext: () => void }) {
  return (
    <div className="w-full h-full px-6 pt-12 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="relative h-80 w-full bg-linear-to-br from-amber-50/80 to-orange-100/80 rounded-3xl flex items-center justify-center mb-8 overflow-hidden border border-zinc-200/50 shadow-sm">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/60 rounded-full"
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
            <div className="h-28 w-28 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-xl flex items-center justify-center">
              <span className="text-4xl font-light text-white tracking-tight">B</span>
            </div>
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute h-10 w-10 rounded-xl bg-white/90 border border-amber-200/50 shadow-md flex items-center justify-center backdrop-blur-xs"
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
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 leading-tight">
            Биржа Бонусов от OEM Tech
          </h1>
          
          <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent my-4" />
          
          <div className="space-y-4 mb-8">
            <p className="text-xl text-zinc-600 leading-relaxed">
              Добро пожаловать в новую экономику лояльности.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Здесь бонусы — это не просто баллы. Это актив, которым можно управлять.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Обменивайте, выбирайте выгодные моменты, увеличивайте ценность своих покупок.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed font-medium">
              Ваши бонусы начинают работать на вас.
            </p>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              onClick={onNext}
              className="w-40 h-12 rounded-xl bg-zinc-900 text-white font-medium text-base shadow-md hover:bg-zinc-800 transition-colors"
            >
              Далее
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 2 ====================
function Scene2() {
  return (
    <div className="w-full h-full px-6 pt-12 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="relative h-80 w-full bg-linear-to-br from-emerald-50/80 to-green-100/80 rounded-3xl flex items-center justify-center mb-8 overflow-hidden border border-zinc-200/50 shadow-sm">
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-36 w-36 bg-white rounded-2xl shadow-lg p-3">
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
              className="absolute h-6 w-6 rounded-full bg-linear-to-br from-amber-400/60 to-amber-600/60"
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
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 leading-tight">
            Покупки приносят больше
          </h2>
          
          <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent my-4" />
          
          <div className="space-y-4">
            <p className="text-xl text-zinc-600 leading-relaxed">
              Ваши повседневные траты превращаются в ценность.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Показывайте QR-код у партнёров и получайте бонусы, которые можно конвертировать и использовать выгодно.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 3 ====================
function Scene3() {
  // Генерируем 40 свечей с рандомными высотами
  const candles = Array.from({ length: 40 }, () => ({
    height: Math.floor(Math.random() * 90) + 15,
    isGreen: Math.random() > 0.48,
  }));

  // Генерируем данные для фонового графика
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100) + 20,
  }));

  return (
    <div className="w-full h-full px-6 pt-12 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="relative h-80 w-full bg-linear-to-br from-slate-50/80 to-slate-100/80 rounded-3xl flex items-center justify-center mb-8 overflow-hidden border border-zinc-200/50 shadow-sm">
          
          {/* Фоновый график */}
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
            <motion.polyline
              points={chartData.map(p => `${p.x * 8},${120 - p.y}`).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.polyline
              points={chartData.map(p => `${p.x * 8 + 20},${140 - p.y * 0.8}`).join(' ')}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>

          {/* Свечи */}
          <div className="flex items-end gap-0.5 h-48 w-full px-1 relative z-10">
            {candles.map((candle, i) => (
              <motion.div
                key={i}
                className="relative flex-1 max-w-2"
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
                  style={{ height: '70%' }}
                />
                <div className="absolute w-px bg-zinc-400/50 left-1/2 -translate-x-1/2 h-full" />
              </motion.div>
            ))}
          </div>

          {/* Бегущая строка */}
          <div className="absolute bottom-4 left-0 right-0 bg-zinc-800/80 backdrop-blur-sm text-white/90 py-2.5 overflow-hidden z-20">
            <motion.div
              className="whitespace-nowrap"
              animate={{ x: [300, -1200] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-xs font-light tracking-wider px-4">
                BON/VV <span className="text-emerald-400">+2.4%</span> • BON/DODO <span className="text-rose-400">-1.2%</span> • BON/CSKA <span className="text-emerald-400">+5.7%</span> • BON/WB <span className="text-emerald-400">+3.1%</span> • BON/FUEL <span className="text-rose-400">-0.8%</span> • BON/MG <span className="text-emerald-400">+1.9%</span> • BON/VV <span className="text-emerald-400">+2.4%</span> • BON/DODO <span className="text-rose-400">-1.2%</span> • BON/CSKA <span className="text-emerald-400">+5.7%</span> •
              </span>
            </motion.div>
          </div>
        </div>

        <div className="px-1">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 leading-tight">
            Добро пожаловать на торги
          </h2>
          
          <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent my-4" />
          
          <div className="space-y-4">
            <p className="text-xl text-zinc-600 leading-relaxed">
              Здесь бонусы работают по законам рынка.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Следите за спросом на бонусы партнёров. Выбирайте момент. Обменивайте с выгодой.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ЭКРАН 4 ====================
function Scene4() {
  return (
    <div className="w-full h-full px-6 pt-12 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="relative h-80 w-full bg-linear-to-br from-violet-50/80 to-purple-100/80 rounded-3xl flex items-center justify-center mb-8 overflow-hidden border border-zinc-200/50 shadow-sm">
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
              className="absolute h-10 w-10 rounded-xl bg-white/90 shadow-md flex items-center justify-center backdrop-blur-xs"
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
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
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
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 leading-tight">
            Теперь лояльность работает на вас
          </h2>
          
          <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent my-4" />
          
          <div className="space-y-4">
            <p className="text-xl text-zinc-600 leading-relaxed">
              Вы управляете своими бонусами — а не наоборот.
            </p>
            <p className="text-xl text-zinc-600 leading-relaxed">
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

    if (index === 4 && swipe > 50 && velocity > 0.2) {
      prev();
    } else if (index < 4) {
      if (swipe < -50 && velocity < -0.2) {
        next();
      } else if (swipe > 50 && velocity > 0.2) {
        prev();
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
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
            dragMomentum={false}
            onDragEnd={handleDragEnd}
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
                className="absolute inset-0 overflow-y-auto"
              >
                {index === 0 && <Scene1 onNext={next} />}
                {index === 1 && <Scene2 />}
                {index === 2 && <Scene3 />}
                {index === 3 && <Scene4 />}
                {index === 4 && (
                  <LoginAccount 
                    onLogin={handleDone} 
                    onBack={() => prev()} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* На экранах 2–4 кнопки остаются внизу */}
        {!isExiting && index > 0 && index < 4 && (
          <div className="absolute left-0 right-0 px-6" style={{ bottom: "140px" }}>
            <div className="flex items-center justify-center gap-2 mb-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === i ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              {index > 0 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                  onClick={prev}
                  className="w-28 h-12 rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-xs text-zinc-700 font-medium text-base shadow-sm hover:bg-white transition-colors"
                >
                  Назад
                </motion.button>
              )}
              
              {index < 4 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                  onClick={next}
                  className="w-28 h-12 rounded-xl bg-zinc-900 text-white font-medium text-base shadow-md hover:bg-zinc-800 transition-colors"
                >
                  Далее
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}