"use client";

import Image from "next/image";
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

const mascotPartnerCoins = [
  { src: "/logos/vkusvill.svg", alt: "ВкусВилл", hue: "from-emerald-100 to-emerald-50" },
  { src: "/logos/dodo.svg", alt: "Додо Пицца", hue: "from-orange-100 to-amber-50" },
  { src: "/logos/cska.svg", alt: "ЦСКА", hue: "from-blue-100 to-sky-50" },
  { src: "/logos/wildberries.svg", alt: "Wildberries", hue: "from-fuchsia-100 to-purple-50" },
  { src: "/logos/cofix.svg", alt: "Cofix", hue: "from-rose-100 to-orange-50" },
];

function ElephantMascot({ layout }: { layout: SceneLayoutProps }) {
  const elephantScale = layout.tier === "roomy" ? 1.12 : layout.tier === "compact" ? 0.9 : 1;
  const orbitWidth = layout.tier === "roomy" ? 270 : layout.tier === "compact" ? 190 : 228;
  const orbitHeight = layout.tier === "roomy" ? 128 : layout.tier === "compact" ? 90 : 108;
  const coinSize = layout.tier === "roomy" ? 66 : layout.tier === "compact" ? 48 : 56;
  const mascotY = layout.tier === "compact" ? 10 : 4;

  const orbitConfigs = mascotPartnerCoins.map((coin, index) => {
    const phase = (index / mascotPartnerCoins.length) * Math.PI * 2;
    const duration = 10 + index * 0.9;
    const frames = Array.from({ length: 9 }, (_, frameIndex) => {
      const t = phase + (frameIndex / 8) * Math.PI * 2;
      const depth = (Math.sin(t) + 1) / 2;
      return {
        x: Math.cos(t) * orbitWidth * 0.5,
        y: Math.sin(t) * orbitHeight * 0.5,
        scale: 0.72 + depth * 0.48,
        opacity: 0.42 + depth * 0.58,
        blur: (1 - depth) * 1.4,
        shadow: 0.14 + depth * 0.16,
        z: Math.round(depth * 100),
      };
    });

    return { ...coin, duration, frames };
  });

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.82),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.16),transparent_48%)]" />
      <div className="absolute inset-x-10 bottom-10 h-12 rounded-full bg-amber-200/30 blur-2xl" />

      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-amber-300/40"
          initial={{
            x: (i - 4.5) * 24,
            y: 70 + (i % 3) * 18,
            opacity: 0,
          }}
          animate={{
            y: [null, -18, 10, -12],
            opacity: [0.15, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.22,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.15,
          }}
        />
      ))}

      <motion.div
        className="absolute rounded-full bg-amber-200/35 blur-3xl"
        style={{
          width: orbitWidth * 0.9,
          height: orbitHeight * 1.35,
        }}
        animate={{ scale: [0.92, 1.04, 0.96], opacity: [0.3, 0.48, 0.34] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 [perspective:1200px]">
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: orbitWidth,
            height: orbitHeight,
            transform: "translate(-50%, -50%) rotateX(68deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-amber-300/35" />
        </div>

        {orbitConfigs.map((coin) => (
          <motion.div
            key={coin.alt}
            className="absolute left-1/2 top-1/2"
            style={{ marginLeft: -coinSize / 2, marginTop: -coinSize / 2 }}
            animate={{
              x: coin.frames.map((frame) => frame.x),
              y: coin.frames.map((frame) => frame.y),
              scale: coin.frames.map((frame) => frame.scale),
              opacity: coin.frames.map((frame) => frame.opacity),
              filter: coin.frames.map((frame) => `blur(${frame.blur}px)`),
              zIndex: coin.frames.map((frame) => frame.z),
            }}
            transition={{
              duration: coin.duration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 0, 8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className={`grid place-items-center rounded-full border border-white/85 bg-gradient-to-br ${coin.hue}`}
              style={{
                width: coinSize,
                height: coinSize,
                boxShadow: "0 12px 28px rgba(245,158,11,0.18)",
              }}
            >
              <div className="grid h-[74%] w-[74%] place-items-center rounded-full bg-white shadow-inner">
                <Image
                  src={coin.src}
                  alt={coin.alt}
                  width={coinSize * 0.42}
                  height={coinSize * 0.42}
                  className="h-auto w-auto max-h-[62%] max-w-[62%] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10"
        animate={{ y: [mascotY, mascotY - 8, mascotY], rotate: [0, -1.2, 0, 1.2, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ scale: elephantScale }}
      >
        <svg width="236" height="230" viewBox="0 0 236 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_26px_46px_rgba(24,24,27,0.16)]">
          <ellipse cx="118" cy="206" rx="58" ry="14" fill="rgba(24,24,27,0.08)" />
          <ellipse cx="176" cy="86" rx="42" ry="48" fill="#D7E3F6" stroke="#B5C4DE" strokeWidth="4" />
          <ellipse cx="83" cy="92" rx="50" ry="58" fill="#E7EEF9" stroke="#B5C4DE" strokeWidth="4" />
          <path d="M89 82C89 51.62 113.62 27 144 27C174.38 27 199 51.62 199 82V120C199 159.21 167.21 191 128 191H113C80.42 191 54 164.58 54 132V117C54 95.46 71.46 78 93 78H97C111.91 78 124 90.09 124 105V131C124 145.36 112.36 157 98 157C83.64 157 72 145.36 72 131V118" fill="#DDE7F7" />
          <path d="M89 82C89 51.62 113.62 27 144 27C174.38 27 199 51.62 199 82V120C199 159.21 167.21 191 128 191H113C80.42 191 54 164.58 54 132V117C54 95.46 71.46 78 93 78H97C111.91 78 124 90.09 124 105V131C124 145.36 112.36 157 98 157C83.64 157 72 145.36 72 131V118" stroke="#B5C4DE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M106 80C106 59.57 122.57 43 143 43C163.43 43 180 59.57 180 80V104C180 124.43 163.43 141 143 141H124C113.51 141 105 132.49 105 122V99C105 88.51 113.51 80 124 80H106Z" fill="url(#elephantBodyLight)" />
          <ellipse cx="97" cy="96" rx="43" ry="50" fill="#EEF4FD" stroke="#B5C4DE" strokeWidth="4" />
          <motion.path
            d="M70 78C63 72 54 69 44 68"
            stroke="#A0B0C9"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ rotate: [0, -7, 0], transformOrigin: "70px 78px" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M105 115C105 104.51 113.51 96 124 96H126C136.49 96 145 104.51 145 115V137C145 150.81 133.81 162 120 162C106.19 162 95 150.81 95 137V134" fill="#DDE7F7" stroke="#B5C4DE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M99 133C99 133 107 146 120 146C133 146 141 133 141 133" stroke="#B5C4DE" strokeWidth="4" strokeLinecap="round" />
          <motion.path
            d="M124 111C124 111 119 131 120 145C121 158 130 164 138 164C148 164 155 156 155 146C155 136 148 128 139 128H133"
            fill="none"
            stroke="#A8B7D0"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ d: [
              "M124 111C124 111 119 131 120 145C121 158 130 164 138 164C148 164 155 156 155 146C155 136 148 128 139 128H133",
              "M124 111C124 111 118 133 120 148C122 161 131 167 139 167C149 167 157 159 157 149C157 139 149 131 140 131H134",
              "M124 111C124 111 119 131 120 145C121 158 130 164 138 164C148 164 155 156 155 146C155 136 148 128 139 128H133",
            ] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="148" cy="94" r="8" fill="#273142" />
          <circle cx="151" cy="91" r="2.4" fill="white" />
          <circle cx="135" cy="117" r="3" fill="#F4B7C2" opacity="0.65" />
          <motion.path
            d="M143 108C148.33 112.67 156.67 112.67 162 108"
            stroke="#273142"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{
              d: [
                "M143 108C148.33 112.67 156.67 112.67 162 108",
                "M143 110C148.33 115 156.67 115 162 110",
                "M143 108C148.33 112.67 156.67 112.67 162 108",
              ],
            }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <path d="M86 170L84 200" stroke="#AAB8CF" strokeWidth="7" strokeLinecap="round" />
          <path d="M112 174L111 204" stroke="#AAB8CF" strokeWidth="7" strokeLinecap="round" />
          <path d="M150 174L151 204" stroke="#AAB8CF" strokeWidth="7" strokeLinecap="round" />
          <path d="M176 168L180 198" stroke="#AAB8CF" strokeWidth="7" strokeLinecap="round" />
          <motion.path
            d="M93 128C101 135 109 139 118 140"
            stroke="#93A3BC"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ opacity: [0.55, 0.95, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
          <motion.path
            d="M170 78C176 74 180 68 181 61"
            stroke="#93A3BC"
            strokeWidth="4"
            strokeLinecap="round"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="elephantBodyLight" x1="143" y1="43" x2="143" y2="141" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F7FAFF" />
              <stop offset="1" stopColor="#D8E3F5" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

function Scene1({ onNext, layout }: { onNext: () => void; layout: SceneLayoutProps }) {
  return (
    <FitToViewport contentClassName={`px-5 pb-6 pt-5 sm:px-6 sm:pt-7`}>
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-amber-50/80 to-orange-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
          <ElephantMascot layout={layout} />
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
