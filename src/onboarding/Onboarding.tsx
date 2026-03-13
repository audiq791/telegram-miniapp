"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

// Legacy scene kept temporarily as reference during animation iteration.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ElephantMascot({ layout }: { layout: SceneLayoutProps }) {
  const figureScale = layout.tier === "roomy" ? 1.1 : layout.tier === "compact" ? 0.9 : 1;
  const coinSize = layout.tier === "roomy" ? 64 : layout.tier === "compact" ? 46 : 54;
  const orbits = [
    {
      width: layout.tier === "roomy" ? 270 : layout.tier === "compact" ? 190 : 224,
      height: layout.tier === "roomy" ? 122 : layout.tier === "compact" ? 84 : 100,
      rotate: -14,
      duration: 10.5,
      offset: 0,
    },
    {
      width: layout.tier === "roomy" ? 238 : layout.tier === "compact" ? 168 : 198,
      height: layout.tier === "roomy" ? 168 : layout.tier === "compact" ? 118 : 140,
      rotate: 56,
      duration: 12.2,
      offset: Math.PI / 3,
    },
    {
      width: layout.tier === "roomy" ? 228 : layout.tier === "compact" ? 160 : 188,
      height: layout.tier === "roomy" ? 88 : layout.tier === "compact" ? 62 : 74,
      rotate: 90,
      duration: 9.4,
      offset: Math.PI / 6,
    },
  ];
  const orbitWidth = Math.max(...orbits.map((orbit) => orbit.width));
  const orbitHeight = Math.max(...orbits.map((orbit) => orbit.height));

  const orbitCoins = mascotPartnerCoins.map((coin, index) => {
    const orbit = orbits[index % orbits.length];
    const phase = orbit.offset + (index / mascotPartnerCoins.length) * Math.PI * 2;
    const frames = Array.from({ length: 11 }, (_, frameIndex) => {
      const t = phase + (frameIndex / 10) * Math.PI * 2;
      const depth = (Math.sin(t) + 1) / 2;
      return {
        x: Math.cos(t) * orbit.width * 0.5,
        y: Math.sin(t) * orbit.height * 0.5,
        scale: 0.7 + depth * 0.5,
        opacity: 0.38 + depth * 0.62,
        blur: (1 - depth) * 1.6,
        z: Math.round(depth * 100),
        shadowOpacity: 0.12 + depth * 0.22,
        rotateY: -22 + depth * 44,
      };
    });

    return { ...coin, orbit, frames };
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

      <div className="absolute inset-0 [perspective:1400px]">
        {orbits.map((orbit, index) => (
          <div
            key={index}
            className="absolute left-1/2 top-1/2"
            style={{
              width: orbit.width,
              height: orbit.height,
              transform: `translate(-50%, -50%) rotateX(70deg) rotateZ(${orbit.rotate}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-amber-300/28" />
          </div>
        ))}

        {orbitCoins.map((coin) => (
          <motion.div
            key={coin.alt}
            className="absolute left-1/2 top-1/2"
            style={{ marginLeft: -coinSize / 2, marginTop: -coinSize / 2, transformStyle: "preserve-3d" }}
            animate={{
              x: coin.frames.map((frame) => frame.x),
              y: coin.frames.map((frame) => frame.y),
              scale: coin.frames.map((frame) => frame.scale),
              opacity: coin.frames.map((frame) => frame.opacity),
              filter: coin.frames.map((frame) => `blur(${frame.blur}px)`),
              zIndex: coin.frames.map((frame) => frame.z),
              rotateY: coin.frames.map((frame) => frame.rotateY),
            }}
            transition={{
              duration: coin.orbit.duration,
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
        animate={{ y: [4, -4, 4], rotate: [0, -1.2, 0, 1.2, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ scale: figureScale }}
      >
        <svg width="222" height="226" viewBox="0 0 222 226" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_26px_46px_rgba(24,24,27,0.16)]">
          <ellipse cx="111" cy="206" rx="50" ry="12" fill="rgba(24,24,27,0.08)" />
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
            <circle cx="111" cy="44" r="20" fill="#FFD9B8" />
            <path d="M91 43C91 28 100 19 112 19C123 19 132 27 132 42V48H91V43Z" fill="#1F2937" />
            <circle cx="103.5" cy="43.5" r="2.5" fill="#1F2937" />
            <circle cx="118.5" cy="43.5" r="2.5" fill="#1F2937" />
            <path d="M104 52C108 56 114 56 118 52" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
            <path d="M95 67L84 97" stroke="#FFC7A1" strokeWidth="7" strokeLinecap="round" />
            <path d="M127 67L138 97" stroke="#FFC7A1" strokeWidth="7" strokeLinecap="round" />
            <path d="M111 64V129" stroke="#FFC7A1" strokeWidth="8" strokeLinecap="round" />
            <path d="M82 94C82 82.95 90.95 74 102 74H120C131.05 74 140 82.95 140 94V143C140 154.05 131.05 163 120 163H102C90.95 163 82 154.05 82 143V94Z" fill="#0F172A" />
            <path d="M92 86C92 83.79 93.79 82 96 82H126C128.21 82 130 83.79 130 86V145C130 147.21 128.21 149 126 149H96C93.79 149 92 147.21 92 145V86Z" fill="url(#phoneScreen)" />
            <path d="M100 93H122" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M100 104H118" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <path d="M100 115H114" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <circle cx="111" cy="138.5" r="4.5" fill="#E2E8F0" />
            <path d="M94 165L87 198" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
            <path d="M128 165L135 198" stroke="#1F2937" strokeWidth="8" strokeLinecap="round" />
            <path d="M84 97L70 127" stroke="#FFC7A1" strokeWidth="7" strokeLinecap="round" />
            <path d="M138 97L152 127" stroke="#FFC7A1" strokeWidth="7" strokeLinecap="round" />
          </motion.g>
          <defs>
            <linearGradient id="phoneScreen" x1="111" y1="82" x2="111" y2="149" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D4ED8" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

const orbitHeroCoins = [
  { kind: "bonus" as const, src: "/logos/vkusvill.svg", alt: "VkusVill", hue: "from-emerald-100 to-emerald-50" },
  { kind: "bonus" as const, src: "/logos/dodo.svg", alt: "Dodo", hue: "from-orange-100 to-amber-50" },
  { kind: "bonus" as const, src: "/logos/cska.svg", alt: "CSKA", hue: "from-blue-100 to-sky-50" },
  { kind: "bonus" as const, src: "/logos/wildberries.svg", alt: "Wildberries", hue: "from-fuchsia-100 to-purple-50" },
  { kind: "bonus" as const, src: "/logos/cofix.svg", alt: "Cofix", hue: "from-rose-100 to-orange-50" },
  { kind: "bonus" as const, src: "/logos/logo1.svg", alt: "Partner", hue: "from-cyan-100 to-sky-50" },
  { kind: "ruble" as const, alt: "Ruble 1", hue: "from-amber-100 to-yellow-50" },
  { kind: "ruble" as const, alt: "Ruble 2", hue: "from-lime-100 to-emerald-50" },
  { kind: "ruble" as const, alt: "Ruble 3", hue: "from-sky-100 to-cyan-50" },
];

function OrbitHero({ layout, isActive }: { layout: SceneLayoutProps; isActive: boolean }) {
  const phoneScale = layout.tier === "roomy" ? 0.95 : layout.tier === "compact" ? 0.78 : 0.86;
  const coinSize = layout.tier === "roomy" ? 54 : layout.tier === "compact" ? 38 : 46;
  const orbits = useMemo(
    () => [
      {
        width: layout.tier === "roomy" ? 172 : layout.tier === "compact" ? 124 : 148,
        height: layout.tier === "roomy" ? 304 : layout.tier === "compact" ? 220 : 252,
        rotate: 0,
        duration: 11.8,
        phase: 0,
      },
      {
        width: layout.tier === "roomy" ? 306 : layout.tier === "compact" ? 224 : 254,
        height: layout.tier === "roomy" ? 132 : layout.tier === "compact" ? 96 : 110,
        rotate: 0,
        duration: 12.6,
        phase: Math.PI / 3,
      },
      {
        width: layout.tier === "roomy" ? 298 : layout.tier === "compact" ? 214 : 246,
        height: layout.tier === "roomy" ? 132 : layout.tier === "compact" ? 96 : 110,
        rotate: -42,
        duration: 10.9,
        phase: Math.PI / 6,
      },
    ],
    [layout.tier],
  );
  const orbitWidth = Math.max(...orbits.map((orbit) => orbit.width));
  const orbitHeight = Math.max(...orbits.map((orbit) => orbit.height));
  const orbitStroke = "rgba(82, 82, 91, 0.34)";
  const orbitGlow = "rgba(255, 255, 255, 0.28)";
  const coinsPerOrbit = orbitHeroCoins.length / orbits.length;
  const [marketChart] = useState(() => createChartData(18));
  const [marketCandles] = useState(() => createCandles(14));
  const [phoneIntroDone, setPhoneIntroDone] = useState(false);

  const orbitCoins = useMemo(
    () =>
      orbits.flatMap((orbit, orbitIndex) => {
        const orbitCoinsForTrack = orbitHeroCoins.slice(
          orbitIndex * coinsPerOrbit,
          orbitIndex * coinsPerOrbit + coinsPerOrbit,
        );

        return orbitCoinsForTrack.map((coin, coinIndex) => {
          const totalCoins = orbitCoinsForTrack.length;
          const frames = Array.from({ length: 25 }, (_, frameIndex) => {
            const progress = frameIndex / 24;
            const theta = orbit.phase + ((coinIndex + progress) / totalCoins) * Math.PI * 2;
            const rawX = Math.cos(theta) * (orbit.width / 2);
            const rawY = Math.sin(theta) * (orbit.height / 2);
            const rotateRad = (orbit.rotate * Math.PI) / 180;
            const x = rawX * Math.cos(rotateRad) - rawY * Math.sin(rotateRad);
            const y = rawX * Math.sin(rotateRad) + rawY * Math.cos(rotateRad);
            const depth = (Math.sin(theta) + 1) / 2;
            const frontOpacity = depth > 0.52 ? 0.58 + (depth - 0.52) * 0.95 : 0;
            const backOpacity = depth <= 0.52 ? 0.36 + (0.52 - depth) * 0.55 : 0;

            return {
              x,
              y,
              scale: 0.8 + depth * 0.26,
              blur: (1 - depth) * 1.05,
              opacity: 0.74 + depth * 0.26,
              shadowOpacity: 0.16 + depth * 0.24,
              };
          });

          return {
            ...coin,
            key: `${coin.alt}-${orbitIndex}-${coinIndex}`,
            orbit,
            frames,
          };
        });
      }),
    [coinsPerOrbit, orbits],
  );

  const renderCoinFace = (coin: (typeof orbitCoins)[number]) => (
    <motion.div
      animate={isActive ? { rotate: [0, -10, 0, 10, 0] } : { rotate: 0 }}
      transition={{ duration: 3.6, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      className={`grid place-items-center rounded-full border border-white/90 bg-gradient-to-br ${coin.hue}`}
      style={{
        width: coinSize,
        height: coinSize,
        boxShadow: "0 14px 24px rgba(24,24,27,0.12), inset 0 1px 0 rgba(255,255,255,0.88)",
      }}
    >
      <div className="grid h-[74%] w-[74%] place-items-center rounded-full bg-white/95 shadow-inner">
        {coin.kind === "bonus" ? (
          <Image
            src={coin.src}
            alt={coin.alt}
            width={coinSize * 0.42}
            height={coinSize * 0.42}
            className="h-auto w-auto max-h-[62%] max-w-[62%] object-contain"
          />
        ) : (
          <span
            className={`font-semibold text-red-600 ${
              layout.tier === "roomy" ? "text-[1.2rem]" : layout.tier === "compact" ? "text-[0.9rem]" : "text-[1rem]"
            }`}
          >
            ₽
          </span>
        )}
      </div>
    </motion.div>
  );

  const phoneWidth = layout.tier === "roomy" ? 124 : layout.tier === "compact" ? 92 : 108;
  const phoneHeight = layout.tier === "roomy" ? 226 : layout.tier === "compact" ? 168 : 196;

  useEffect(() => {
    if (!isActive) {
      setPhoneIntroDone(false);
    }
  }, [isActive]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.92),transparent_36%),radial-gradient(circle_at_50%_72%,rgba(251,191,36,0.14),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_100%)]" />
      <div
        className="absolute rounded-full bg-amber-200/24 blur-3xl"
        style={{
          width: orbitWidth * 0.92,
          height: orbitHeight * 0.62,
          animation: "orbit-hero-glow 5.2s ease-in-out infinite",
        }}
      />

      <div className="absolute inset-0 z-[1]">
        {orbits.map((orbit, index) => (
          <svg
            key={`back-orbit-${index}`}
            className="absolute left-1/2 top-1/2 overflow-visible"
            width={orbit.width}
            height={orbit.height}
            viewBox={`0 0 ${orbit.width} ${orbit.height}`}
            style={{
              marginLeft: -orbit.width / 2,
              marginTop: -orbit.height / 2,
              transform: `rotate(${orbit.rotate}deg)`,
            }}
          >
            <path
              d={`M ${orbit.width / 2} 0 A ${orbit.width / 2} ${orbit.height / 2} 0 0 0 ${orbit.width / 2} ${orbit.height}`}
              fill="none"
              stroke={orbitGlow}
              strokeWidth="0.4"
            />
            <path
              d={`M ${orbit.width / 2} 0 A ${orbit.width / 2} ${orbit.height / 2} 0 0 0 ${orbit.width / 2} ${orbit.height}`}
              fill="none"
              stroke={orbitStroke}
              strokeWidth="0.7"
            />
          </svg>
        ))}
      </div>

      <motion.div
        className="relative z-[4]"
        animate={
          isActive
            ? {
                y: [2, -2, 1, -1, 1, -1],
                rotateX: [15, 14.2, 15.6, 14.6, 15.6, 14.6],
              }
            : { rotateX: 15, y: 0 }
        }
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: isActive ? Infinity : 0,
          times: [0, 0.12, 0.32, 0.5, 0.75, 1],
        }}
        style={{
          scale: phoneScale,
          transformStyle: "preserve-3d",
          perspective: 1800,
        }}
      >
        <motion.div
          animate={
            isActive
              ? phoneIntroDone
                ? { rotateY: [35, -70, 70, -70, 70] }
                : { rotateY: [0, 35] }
              : { rotateY: 0 }
          }
          transition={
            isActive
              ? phoneIntroDone
                ? {
                    duration: 11.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }
                : {
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                  }
              : { duration: 0.4, ease: "easeOut" }
          }
          onAnimationComplete={() => {
            if (isActive && !phoneIntroDone) {
              setPhoneIntroDone(true);
            }
          }}
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative rounded-[34px] border border-white/18 bg-[linear-gradient(180deg,#1e293b_0%,#111827_22%,#0f172a_70%,#020617_100%)] shadow-[0_34px_70px_rgba(15,23,42,0.34)]"
            style={{
              width: phoneWidth,
              height: phoneHeight,
              transformStyle: "preserve-3d",
              boxShadow:
                "0 34px 70px rgba(15,23,42,0.32), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -10px 28px rgba(0,0,0,0.42)",
            }}
          >
          <div
            className="absolute inset-[3px] rounded-[31px] bg-[linear-gradient(180deg,#334155_0%,#111827_18%,#0f172a_55%,#020617_100%)]"
            style={{
              transform: "translateZ(-9px)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 10px 18px rgba(255,255,255,0.05), inset 0 -16px 22px rgba(0,0,0,0.34), 0 16px 24px rgba(2,6,23,0.25)",
            }}
          />
          <div
            className="absolute inset-[1px] rounded-[33px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 22%, transparent 74%, rgba(255,255,255,0.06) 100%)",
              boxShadow:
                "inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25)",
            }}
          />
          <div
            className="absolute inset-[6px] rounded-[28px] border border-white/8"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01) 28%, rgba(0,0,0,0.12) 100%)",
              transform: "translateZ(1px)",
            }}
          />
          <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.22),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%,rgba(255,255,255,0.02)_68%,transparent_100%)]" />
          <div
            className="absolute inset-[5px] rounded-[29px] border border-white/8 bg-[linear-gradient(180deg,#020617_0%,#000000_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            style={{ transform: "translateZ(8px)" }}
          >
            <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-2.5">
              <div className="h-1.5 w-16 rounded-full bg-black/65 shadow-[0_1px_0_rgba(255,255,255,0.06)]" />
            </div>
            <div className="absolute left-1/2 top-4 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-slate-700 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_10px_rgba(14,165,233,0.2)]" />
            <div className="absolute inset-[7px] overflow-hidden rounded-[25px] bg-[linear-gradient(180deg,#07111f_0%,#0f172a_22%,#020617_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,255,255,0.03)_68%,transparent_100%)]" />
              <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
              <div className="absolute inset-x-[10px] top-[14px] z-10 rounded-[18px] border border-sky-300/16 bg-[linear-gradient(180deg,rgba(14,165,233,0.12),rgba(15,23,42,0.08))] px-3 pb-3 pt-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-[0.42rem] font-medium uppercase tracking-[0.22em] text-slate-400">
                      BON / OEM
                    </div>
                    <div className="mt-0.5 text-[0.8rem] font-semibold text-white">
                      +12.4%
                    </div>
                  </div>
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2 py-0.5 text-[0.42rem] font-medium uppercase tracking-[0.18em] text-emerald-300">
                    Market
                  </div>
                </div>

                <svg className="h-[58px] w-full overflow-visible" viewBox="0 0 120 58" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="market-hero-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(56,189,248,0.42)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`M 0 58 L ${marketChart
                      .map((point, index) => `${index * 7} ${48 - point.y * 0.28}`)
                      .join(" L ")} L 119 58 Z`}
                    fill="url(#market-hero-fill)"
                    initial={{ opacity: 0.45 }}
                    animate={isActive ? { opacity: [0.28, 0.45, 0.28] } : { opacity: 0.34 }}
                    transition={{ duration: 3.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <motion.path
                    d={`M ${marketChart
                      .map((point, index) => `${index * 7},${48 - point.y * 0.28}`)
                      .join(" L ")}`}
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0.2, opacity: 0.55 }}
                    animate={isActive ? { pathLength: [0.3, 1, 0.3], opacity: [0.55, 0.95, 0.55] } : { pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 4.6, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                  />
                </svg>

                <div className="mt-2 flex h-10 items-end gap-[2px]">
                  {marketCandles.map((candle, index) => (
                    <motion.div
                      key={`market-candle-${index}`}
                      className="relative flex-1"
                      animate={
                        isActive
                          ? { height: [Math.max(8, candle.height * 0.14), Math.max(12, candle.height * 0.2), Math.max(8, candle.height * 0.14)] }
                          : { height: Math.max(9, candle.height * 0.17) }
                      }
                      transition={{
                        duration: 2.8 + index * 0.05,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut",
                        delay: index * 0.04,
                      }}
                    >
                      <div className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/18" style={{ height: "100%" }} />
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-[2px] ${
                          candle.isGreen ? "bg-emerald-400/78" : "bg-rose-400/78"
                        }`}
                        style={{ height: "70%" }}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 rounded-[14px] border border-white/8 bg-white/5 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="text-[0.62rem] font-semibold tracking-[0.18em] text-white/94">
                    Биржа Бонусов
                  </div>
                  <div className="mt-1 text-[0.44rem] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Торги бонусами партнеров
                  </div>
                </div>
              </div>
              <div className="absolute -left-7 top-10 h-28 w-16 rotate-[14deg] rounded-full bg-white/8 blur-2xl" />
              <div className="absolute -right-4 bottom-7 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
            </div>
          </div>
          <div className="absolute left-[1px] top-14 h-9 w-[2px] rounded-full bg-white/12" />
          <div className="absolute left-[1px] top-24 h-14 w-[2px] rounded-full bg-white/10" />
          <div className="absolute right-[1px] top-20 h-16 w-[2px] rounded-full bg-white/12" />
        </div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-[5] pointer-events-none">
        {orbits.map((orbit, index) => (
          <svg
            key={`front-orbit-${index}`}
            className="absolute left-1/2 top-1/2 overflow-visible"
            width={orbit.width}
            height={orbit.height}
            viewBox={`0 0 ${orbit.width} ${orbit.height}`}
            style={{
              marginLeft: -orbit.width / 2,
              marginTop: -orbit.height / 2,
              transform: `rotate(${orbit.rotate}deg)`,
            }}
          >
            <path
              d={`M ${orbit.width / 2} 0 A ${orbit.width / 2} ${orbit.height / 2} 0 0 1 ${orbit.width / 2} ${orbit.height}`}
              fill="none"
              stroke={orbitGlow}
              strokeWidth="0.4"
            />
            <path
              d={`M ${orbit.width / 2} 0 A ${orbit.width / 2} ${orbit.height / 2} 0 0 1 ${orbit.width / 2} ${orbit.height}`}
              fill="none"
              stroke={orbitStroke}
              strokeWidth="0.7"
            />
          </svg>
        ))}
      </div>

      <div className="absolute inset-0 z-[6] pointer-events-none">
        {orbitCoins.map((coin) => (
          <motion.div
            key={coin.key}
            className="absolute left-1/2 top-1/2"
            animate={
              isActive
                ? {
                    x: coin.frames.map((frame) => frame.x),
                    y: coin.frames.map((frame) => frame.y),
                    scale: coin.frames.map((frame) => frame.scale),
                    opacity: coin.frames.map((frame) => frame.opacity),
                    filter: coin.frames.map((frame) => `blur(${frame.blur}px)`),
                  }
                : {
                    x: coin.frames[0].x,
                    y: coin.frames[0].y,
                    scale: coin.frames[0].scale,
                    opacity: coin.frames[0].opacity,
                    filter: `blur(${coin.frames[0].blur}px)`,
                  }
            }
            transition={{ duration: coin.orbit.duration, ease: "linear", repeat: isActive ? Infinity : 0 }}
            whileHover={undefined}
            style={{
              width: coinSize,
              height: coinSize,
              marginLeft: -coinSize / 2,
              marginTop: -coinSize / 2,
            }}
          >
            <div
              style={{
                filter: `drop-shadow(0 10px 16px rgba(24,24,27,${coin.frames[0].shadowOpacity}))`,
              }}
            >
              {renderCoinFace(coin)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Scene1({ onNext, layout, isHeroActive }: { onNext: () => void; layout: SceneLayoutProps; isHeroActive: boolean }) {
  return (
    <FitToViewport contentClassName={`px-5 pb-6 pt-5 sm:px-6 sm:pt-7`}>
      <div className={`mx-auto flex flex-col ${layout.sectionGapClass}`}>
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-br from-amber-50/80 to-orange-100/80 shadow-sm ${layout.frameHeightClass}`}
        >
          <OrbitHero layout={layout} isActive={isHeroActive} />
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
  const [isFirstSceneAnimationActive, setIsFirstSceneAnimationActive] = useState(false);
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
    if (index !== 0 || !isFirstSceneReady) {
      setIsFirstSceneAnimationActive(false);
      return;
    }

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setIsFirstSceneAnimationActive(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [index, isFirstSceneReady]);

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
                      <Scene1 onNext={next} layout={sceneLayout} isHeroActive={isFirstSceneAnimationActive} />
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
