"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { haptic } from "../components/haptics";
import LoginAccount from "../screens/LoginAccount";

type LayoutTier = "compact" | "regular" | "roomy";

type SceneLayoutProps = {
  tier: LayoutTier;
  frameHeightClass: string;
  titleClass: string;
  bodyClass: string;
  bodyGapClass: string;
  sectionGapClass: string;
  buttonClass: string;
};

function FitToViewport({
  children,
  contentClassName = "",
}: {
  children: React.ReactNode;
  contentClassName?: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      const content = contentRef.current;
      if (!frame || !content) return;

      const availableHeight = frame.clientHeight;
      const naturalHeight = content.scrollHeight;
      if (!availableHeight || !naturalHeight) return;

      const rawScale = Math.min(1, availableHeight / naturalHeight);
      const nextScale = rawScale > 0.985 ? 1 : rawScale;
      setScale(nextScale);
      setScaledHeight(naturalHeight * nextScale);
    };

    measure();
    const raf1 = window.requestAnimationFrame(measure);
    const raf2 = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(measure);
    });
    const timeoutIds = [80, 180, 320, 520, 900].map((delay) =>
      window.setTimeout(measure, delay),
    );

    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    window.visualViewport?.addEventListener("resize", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      timeoutIds.forEach((id) => window.clearTimeout(id));
      window.visualViewport?.removeEventListener("resize", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return (
    <div ref={frameRef} className="min-h-0 flex-1 overflow-hidden">
      <div
        className="mx-auto flex w-full justify-center"
        style={{
          height: scaledHeight ?? undefined,
          maxWidth: "28rem",
        }}
      >
        <div
          ref={contentRef}
          className={contentClassName}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function getSceneLayout(viewportHeight: number, viewportWidth: number): SceneLayoutProps {
  const shortSide = Math.min(viewportHeight, viewportWidth);
  const compact = viewportHeight <= 710 || shortSide <= 350;
  const roomy = viewportHeight >= 860 && shortSide >= 390;
  const tier: LayoutTier = compact ? "compact" : roomy ? "roomy" : "regular";

  return {
    tier,
    frameHeightClass: compact
      ? "min-h-[220px] basis-[34vh] max-h-[280px]"
      : roomy
        ? "min-h-[320px] basis-[44vh] max-h-[430px]"
        : "min-h-[270px] basis-[40vh] max-h-[360px]",
    titleClass: compact
      ? "text-[1.6rem] leading-[1.05]"
      : roomy
        ? "text-4xl leading-[1.02]"
        : "text-[1.9rem] leading-[1.04]",
    bodyClass: compact
      ? "text-[0.95rem] leading-[1.45]"
      : roomy
        ? "text-[1.18rem] leading-[1.6]"
        : "text-[1.04rem] leading-[1.52]",
    bodyGapClass: compact ? "space-y-2.5" : roomy ? "space-y-4.5" : "space-y-3.5",
    sectionGapClass: compact ? "gap-4" : roomy ? "gap-7" : "gap-5",
    buttonClass: compact ? "h-11 w-36 text-[0.95rem]" : "h-12 w-40 text-base",
  };
}

function createFloatingDots(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 300,
    y: Math.random() * 300,
    duration: 5 + Math.random() * 3,
    delay: Math.random() * 2,
  }));
}

function createCoinRain(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 200 + 50,
    delay: Math.random() * 2,
    duration: 4 + Math.random() * 2,
  }));
}

function createCandles(count: number) {
  return Array.from({ length: count }, () => ({
    height: Math.floor(Math.random() * 90) + 15,
    isGreen: Math.random() > 0.48,
    duration: 1.5 + Math.random() * 3,
  }));
}

function createChartData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100) + 20,
  }));
}

function Scene1({ onNext, layout }: { onNext: () => void; layout: SceneLayoutProps }) {
  const orbitDistance = layout.tier === "roomy" ? 104 : layout.tier === "compact" ? 70 : 84;
  const iconSize = layout.tier === "roomy" ? "h-11 w-11" : "h-10 w-10";
  const centerSize = layout.tier === "roomy" ? "h-32 w-32 text-[2.65rem]" : layout.tier === "compact" ? "h-24 w-24 text-3xl" : "h-28 w-28 text-4xl";
  const [dots] = useState(() => createFloatingDots(20));

  return (
    <FitToViewport contentClassName={`px-5 pb-6 pt-5 sm:px-6 sm:pt-7`}>
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-amber-50/80 to-orange-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
          {dots.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-amber-400/60"
              initial={{
                x: dot.x,
                y: dot.y,
                opacity: 0.2,
              }}
              animate={{
                y: [null, -30, 30, -30],
                x: [null, 20, -20, 20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                delay: dot.delay,
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
            <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl ${centerSize}`}>
              <span className="font-light tracking-tight text-white">B</span>
            </div>
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className={`absolute flex items-center justify-center rounded-xl border border-amber-200/50 bg-white/90 shadow-md backdrop-blur-xs ${iconSize}`}
              animate={{
                x: [0, orbitDistance * Math.cos(i * 60), 0],
                y: [0, orbitDistance * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "linear",
              }}
            >
              <span className={layout.tier === "compact" ? "text-base font-light text-amber-600" : "text-lg font-light text-amber-600"}>
                B
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col px-1">
          <h1 className={`font-semibold tracking-tight text-zinc-900 ${layout.titleClass}`}>
            Биржа Бонусов от OEM Tech
          </h1>

          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className={`min-h-0 flex-1 ${layout.bodyGapClass}`}>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Добро пожаловать в новую экономику лояльности.
            </p>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Здесь бонусы это не просто баллы. Это актив, которым можно управлять.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              onClick={onNext}
              className={`rounded-xl bg-zinc-900 font-medium text-white shadow-md transition-colors hover:bg-zinc-800 ${layout.buttonClass}`}
            >
              Далее
            </motion.button>
          </div>
        </div>
      </div>
    </FitToViewport>
  );
}

function Scene2({ layout }: { layout: SceneLayoutProps }) {
  const qrSize = layout.tier === "roomy" ? "h-40 w-40" : layout.tier === "compact" ? "h-24 w-24" : "h-32 w-32";
  const [rain] = useState(() => createCoinRain(6));
  const [qrCells] = useState(() =>
    Array.from({ length: 49 }, () => Math.random() > 0.6),
  );

  return (
    <FitToViewport contentClassName="px-5 pb-6 pt-5 sm:px-6 sm:pt-7">
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-emerald-50/80 to-green-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className={`rounded-2xl bg-white p-3 shadow-lg overflow-hidden ${qrSize}`}>
              <div className="grid aspect-square w-full grid-cols-7 gap-[6%]">
                {qrCells.map((isFilled, i) => (
                  <div
                    key={i}
                    className={`aspect-square w-full rounded-[2px] ${
                      isFilled ? "bg-zinc-900" : "bg-transparent"
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

          {rain.map((drop, i) => (
            <motion.div
              key={i}
              className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-amber-400/60 to-amber-600/60"
              initial={{ x: drop.x, y: -50 }}
              animate={{ y: 400, rotate: 360 }}
              transition={{
                duration: drop.duration,
                repeat: Infinity,
                delay: drop.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col px-1">
          <h2 className={`font-semibold tracking-tight text-zinc-900 ${layout.titleClass}`}>
            Покупки приносят больше
          </h2>

          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className={`min-h-0 flex-1 ${layout.bodyGapClass}`}>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Ваши повседневные траты превращаются в ценность.
            </p>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Показывайте QR-код у партнёров и получайте бонусы, которые можно конвертировать и использовать выгодно.
            </p>
          </div>
        </div>
      </div>
    </FitToViewport>
  );
}

function Scene3({ layout }: { layout: SceneLayoutProps }) {
  const [candles] = useState(() => createCandles(40));
  const [chartData] = useState(() => createChartData(50));

  return (
    <FitToViewport contentClassName="px-5 pb-6 pt-5 sm:px-6 sm:pt-7">
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-slate-50/80 to-slate-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
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

          <div
            className={`relative z-10 flex w-full items-end gap-0.5 px-1 ${
              layout.tier === "roomy" ? "h-52" : layout.tier === "compact" ? "h-36" : "h-44"
            }`}
          >
            {candles.map((candle, i) => (
              <motion.div
                key={i}
                className="relative max-w-2 flex-1"
                initial={{ height: 0 }}
                animate={{ height: candle.height }}
                transition={{
                  duration: candle.duration,
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

        <div className="flex flex-col px-1">
          <h2 className={`font-semibold tracking-tight text-zinc-900 ${layout.titleClass}`}>
            Добро пожаловать на торги
          </h2>

          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className={`min-h-0 flex-1 ${layout.bodyGapClass}`}>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Здесь бонусы работают по законам рынка.
            </p>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Следите за спросом на бонусы партнёров. Выбирайте момент. Обменивайте с выгодой.
            </p>
          </div>
        </div>
      </div>
    </FitToViewport>
  );
}

function Scene4({ layout }: { layout: SceneLayoutProps }) {
  const orbitDistance = layout.tier === "roomy" ? 124 : layout.tier === "compact" ? 82 : 100;

  return (
    <FitToViewport contentClassName="px-5 pb-6 pt-5 sm:px-6 sm:pt-7">
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-violet-50/80 to-purple-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
          <motion.div
            className="relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <div
              className={`rounded-full border-2 border-violet-400/30 border-t-violet-500/70 ${
                layout.tier === "roomy" ? "h-32 w-32" : layout.tier === "compact" ? "h-24 w-24" : "h-28 w-28"
              }`}
            />
          </motion.div>

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className={`absolute flex items-center justify-center rounded-xl bg-white/90 shadow-md backdrop-blur-xs ${
                layout.tier === "roomy" ? "h-11 w-11" : "h-10 w-10"
              }`}
              style={{
                background: `linear-gradient(135deg, hsl(${i * 60}, 80%, 95%), hsl(${i * 60 + 30}, 80%, 92%))`,
              }}
              animate={{
                x: [0, orbitDistance * Math.cos(i * 60), 0],
                y: [0, orbitDistance * Math.sin(i * 60), 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
            >
              <span className={layout.tier === "compact" ? "text-xs font-light text-zinc-700" : "text-sm font-light text-zinc-700"}>
                B
              </span>
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

        <div className="flex flex-col px-1">
          <h2 className={`font-semibold tracking-tight text-zinc-900 ${layout.titleClass}`}>
            Теперь лояльность работает на вас
          </h2>

          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

          <div className={`min-h-0 flex-1 ${layout.bodyGapClass}`}>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Вы управляете своими бонусами, а не наоборот.
            </p>
            <p className={`text-zinc-600 ${layout.bodyClass}`}>
              Копите то, что нужно вам. Обменивайте то, что ценят другие.
            </p>
          </div>
        </div>
      </div>
    </FitToViewport>
  );
}

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [viewportSize, setViewportSize] = useState({ width: 390, height: 844 });
  const [isFirstSceneReady, setIsFirstSceneReady] = useState(false);
  const swipeAreaRef = useRef<HTMLDivElement | null>(null);
  const isDoneRef = useRef(false);
  const firstViewportHeightRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const isSwipeGestureRef = useRef(false);
  const activeSwipeInputRef = useRef<"pointer" | "touch" | null>(null);

  const next = useCallback(() => {
    setSwipeOffset(0);
    setIndex((current) => {
      if (current >= 4) return current;
      setDirection(1);
      haptic("light");
      return current + 1;
    });
  }, []);

  const prev = useCallback(() => {
    setSwipeOffset(0);
    setIndex((current) => {
      if (current <= 0) return current;
      setDirection(-1);
      haptic("light");
      return current - 1;
    });
  }, []);

  const beginSwipe = useCallback((x: number, y: number) => {
    swipeStartRef.current = {
      x,
      y,
      t: Date.now(),
    };
    isSwipeGestureRef.current = false;
  }, []);

  const updateSwipe = useCallback((x: number, y: number): boolean => {
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

    const resisted = Math.max(-86, Math.min(86, dx * 0.42));
    setSwipeOffset(resisted);
    return true;
  }, [index]);

  const finalizeSwipe = useCallback((x: number, y: number) => {
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

    if (dx < 0) {
      next();
    } else {
      prev();
    }

    isSwipeGestureRef.current = false;
  }, [isExiting, next, prev]);

  const cancelSwipe = useCallback(() => {
    swipeStartRef.current = null;
    isSwipeGestureRef.current = false;
    setSwipeOffset(0);
    activeSwipeInputRef.current = null;
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      const viewport = window.visualViewport;
      setViewportSize({
        width: Math.round(viewport?.width ?? window.innerWidth),
        height: Math.round(viewport?.height ?? window.innerHeight),
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (index !== 0) return;

    const viewport = window.visualViewport;
    let settleTimer: number | null = null;

    const markReadyWhenStable = (height: number) => {
      if (firstViewportHeightRef.current !== null && Math.abs(firstViewportHeightRef.current - height) > 1) {
        setIsFirstSceneReady(false);
      }
      firstViewportHeightRef.current = height;
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
      settleTimer = window.setTimeout(() => {
        setIsFirstSceneReady(true);
      }, 180);
    };

    markReadyWhenStable(Math.round(viewport?.height ?? window.innerHeight));

    const onResize = () => {
      markReadyWhenStable(Math.round(viewport?.height ?? window.innerHeight));
    };

    viewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);

    return () => {
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
      }
      viewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, [index]);

  useEffect(() => {
    const node = swipeAreaRef.current;
    if (!node) return;

    const onTouchStart = (event: TouchEvent) => {
      if (activeSwipeInputRef.current === "pointer") return;
      activeSwipeInputRef.current = "touch";
      const touch = event.touches[0];
      if (!touch) return;
      beginSwipe(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (activeSwipeInputRef.current !== "touch") return;
      const touch = event.touches[0];
      if (!touch) return;
      const isHorizontalSwipe = updateSwipe(touch.clientX, touch.clientY);
      if (isHorizontalSwipe && event.cancelable) {
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (activeSwipeInputRef.current !== "touch") return;
      const touch = event.changedTouches[0];
      if (!touch) {
        cancelSwipe();
        return;
      }
      finalizeSwipe(touch.clientX, touch.clientY);
      activeSwipeInputRef.current = null;
    };

    const onTouchCancel = () => {
      cancelSwipe();
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd, { passive: true });
    node.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [beginSwipe, cancelSwipe, finalizeSwipe, index, isExiting, updateSwipe]);

  const handleDone = () => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    haptic("success");
    setIsExiting(true);
    setTimeout(() => {
      onDone();
    }, 300);
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
  const sceneLayout = getSceneLayout(viewportSize.height, viewportSize.width);

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
            ref={swipeAreaRef}
            className="relative h-full"
            onPointerDownCapture={handlePointerDown}
            onPointerMoveCapture={handlePointerMove}
            onPointerUpCapture={handlePointerUp}
            onPointerCancelCapture={cancelSwipe}
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
                  {index === 0 &&
                    (isFirstSceneReady ? (
                      <Scene1 onNext={next} layout={sceneLayout} />
                    ) : (
                      <div className="h-full w-full bg-white" />
                    ))}
                  {index === 1 && <Scene2 layout={sceneLayout} />}
                  {index === 2 && <Scene3 layout={sceneLayout} />}
                  {index === 3 && <Scene4 layout={sceneLayout} />}
                  {index === 4 && <LoginAccount onLogin={handleDone} onBack={prev} />}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {showFooterNav && (
          <div
            className="shrink-0 border-t border-zinc-100 bg-white/95 px-5 pt-3 backdrop-blur-sm sm:px-6"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
          >
            <div className={`flex items-center justify-center gap-2 ${sceneLayout.tier === "compact" ? "mb-4" : "mb-5"}`}>
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
                className={`rounded-xl border border-zinc-200 bg-white font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 ${
                  sceneLayout.tier === "compact" ? "h-11 w-26 text-[0.95rem]" : "h-12 w-28 text-base"
                }`}
              >
                Назад
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={next}
                className={`rounded-xl bg-zinc-900 font-medium text-white shadow-md transition-colors hover:bg-zinc-800 ${
                  sceneLayout.tier === "compact" ? "h-11 w-26 text-[0.95rem]" : "h-12 w-28 text-base"
                }`}
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
