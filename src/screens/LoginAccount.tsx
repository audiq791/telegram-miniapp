"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Headphones,
  LogIn,
  Send,
} from "lucide-react";

interface LoginAccountProps {
  onLogin?: () => void;
  onBack?: () => void;
}

type LayoutTier = "micro" | "compact" | "regular" | "roomy";

type ScreenLayout = {
  tier: LayoutTier;
  shellPadding: string;
  topGap: string;
  formGap: string;
  heroHeight: string;
  coinSize: string;
  centerTokenSize: string;
  glowSize: string;
  titleClass: string;
  hintClass: string;
  fieldClass: string;
  buttonClass: string;
  tertiaryButtonClass: string;
};

function getScreenLayout(viewportHeight: number, viewportWidth: number): ScreenLayout {
  const shortSide = Math.min(viewportHeight, viewportWidth);
  const micro = viewportHeight <= 690 || shortSide <= 330;
  const compact = !micro && (viewportHeight <= 740 || shortSide <= 350);
  const roomy = viewportHeight >= 860 && shortSide >= 390;
  const tier: LayoutTier = micro ? "micro" : compact ? "compact" : roomy ? "roomy" : "regular";

  return {
    tier,
    shellPadding: micro ? "px-4 pt-3 pb-3" : compact ? "px-4 pt-4 pb-4" : roomy ? "px-5 pt-6 pb-5" : "px-4.5 pt-5 pb-4.5",
    topGap: micro ? "gap-2" : compact ? "gap-3" : roomy ? "gap-6" : "gap-4",
    formGap: micro ? "gap-2.5" : compact ? "gap-3" : roomy ? "gap-5" : "gap-4",
    heroHeight: micro ? "h-[104px]" : compact ? "h-[140px]" : roomy ? "h-[220px]" : "h-[180px]",
    coinSize: micro ? "h-8 w-8 text-sm" : compact ? "h-10 w-10 text-lg" : roomy ? "h-14 w-14 text-2xl" : "h-12 w-12 text-xl",
    centerTokenSize: micro ? "h-16 w-16 text-2xl" : compact ? "h-20 w-20 text-3xl" : roomy ? "h-28 w-28 text-5xl" : "h-24 w-24 text-4xl",
    glowSize: micro ? "h-20 w-20" : compact ? "h-24 w-24" : roomy ? "h-36 w-36" : "h-32 w-32",
    titleClass: micro ? "text-[1.25rem] leading-[1.02]" : compact ? "text-[1.55rem] leading-[1.05]" : roomy ? "text-[2.15rem] leading-[1.02]" : "text-[1.8rem] leading-[1.04]",
    hintClass: micro ? "text-[0.68rem]" : compact ? "text-[0.72rem]" : "text-xs",
    fieldClass: micro ? "h-10 text-[0.92rem]" : compact ? "h-11 text-[0.95rem]" : "h-12 text-base",
    buttonClass: micro ? "h-10 text-[0.92rem]" : compact ? "h-11 text-[0.95rem]" : "h-12 text-base",
    tertiaryButtonClass: micro ? "h-9 text-[0.82rem]" : compact ? "h-10 text-[0.9rem]" : "h-11 text-[0.95rem]",
  };
}

function FloatingBonuses({ layout }: { layout: ScreenLayout }) {
  const heroCoins = [
    {
      src: "/logos/vkusvill.svg",
      alt: "VkusVill",
      x: -118,
      y: -54,
      driftX: 22,
      driftY: 12,
      delay: 0,
      duration: 8.4,
      rotate: -8,
      hue: "from-emerald-100 to-emerald-50",
    },
    {
      src: "/logos/dodo.svg",
      alt: "Dodo",
      x: 116,
      y: -46,
      driftX: -24,
      driftY: 18,
      delay: 0.45,
      duration: 9.2,
      rotate: 10,
      hue: "from-orange-100 to-amber-50",
    },
    {
      src: "/logos/cska.svg",
      alt: "CSKA",
      x: 0,
      y: -86,
      driftX: 16,
      driftY: 20,
      delay: 0.9,
      duration: 8.8,
      rotate: -6,
      hue: "from-blue-100 to-sky-50",
    },
    {
      src: "/logos/wildberries.svg",
      alt: "Wildberries",
      x: -96,
      y: 44,
      driftX: 26,
      driftY: -14,
      delay: 0.6,
      duration: 9.6,
      rotate: 7,
      hue: "from-fuchsia-100 to-purple-50",
    },
    {
      src: "/logos/cofix.svg",
      alt: "Cofix",
      x: 102,
      y: 52,
      driftX: -20,
      driftY: -18,
      delay: 1.1,
      duration: 8.6,
      rotate: -9,
      hue: "from-rose-100 to-orange-50",
    },
    {
      src: "/logos/logo1.svg",
      alt: "Partner",
      x: -16,
      y: 72,
      driftX: 18,
      driftY: -16,
      delay: 1.35,
      duration: 9.4,
      rotate: 8,
      hue: "from-cyan-100 to-sky-50",
    },
  ];
  const centerLogoSize =
    layout.tier === "roomy" ? 82 : layout.tier === "compact" ? 56 : layout.tier === "micro" ? 46 : 68;

  return (
    <div className={`relative w-full overflow-hidden ${layout.heroHeight}`}>
      <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),transparent_32%),linear-gradient(135deg,rgba(250,245,255,0.88),rgba(238,242,255,0.88))]" />
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-violet-300/20 blur-2xl" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 220" preserveAspectRatio="none">
        <motion.path
          d="M 86 58 C 126 78, 146 96, 180 110"
          fill="none"
          stroke="rgba(139,92,246,0.18)"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.18, 0.44, 0.18] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 274 58 C 234 78, 214 96, 180 110"
          fill="none"
          stroke="rgba(59,130,246,0.18)"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.16, 0.4, 0.16] }}
          transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        />
        <motion.path
          d="M 180 24 C 180 56, 180 82, 180 110"
          fill="none"
          stroke="rgba(244,114,182,0.16)"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{ pathLength: [0.15, 1, 0.15], opacity: [0.14, 0.34, 0.14] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </svg>

      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ x: "-50%", y: "-50%" }}
      >
        {heroCoins.map((coin, index) => (
          <motion.div
            key={coin.alt}
            className="absolute"
            initial={{ opacity: 0, x: coin.x, y: coin.y, scale: 0.76 }}
            animate={{
              opacity: [0.34, 0.72, 0.62, 0.7, 0.34],
              x: [coin.x, coin.x + coin.driftX, coin.x + coin.driftX * 0.45, coin.x - coin.driftX * 0.3, coin.x],
              y: [coin.y, coin.y + coin.driftY, coin.y - coin.driftY * 0.24, coin.y + coin.driftY * 0.16, coin.y],
              scale: [0.76, 0.82, 0.8, 0.84, 0.76],
              rotate: [coin.rotate, coin.rotate * -0.3, coin.rotate * 0.4, coin.rotate],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <div
              className={`grid place-items-center rounded-full border border-white/90 bg-gradient-to-br shadow-lg ${coin.hue} ${layout.coinSize}`}
              style={{ boxShadow: "0 12px 24px rgba(24,24,27,0.12), inset 0 1px 0 rgba(255,255,255,0.86)" }}
            >
              <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-white/95 shadow-inner">
                <Image
                  src={coin.src}
                  alt={coin.alt}
                  width={28}
                  height={28}
                  className="h-auto w-auto max-h-[60%] max-w-[60%] object-contain"
                />
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.015, 1],
            rotateY: [0, 35, -70, 70, -70],
          }}
          transition={{
            duration: 9.6,
            repeat: Infinity,
            times: [0, 0.14, 0.42, 0.7, 1],
            ease: "easeInOut",
          }}
          className="relative"
          style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        >
          <div className="absolute inset-x-6 bottom-[-10px] h-8 rounded-full bg-violet-400/18 blur-xl" />
          <div className="relative rounded-[28px] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_22px_42px_rgba(76,29,149,0.16)] backdrop-blur-md">
            <div className="text-center text-[0.56rem] font-medium uppercase tracking-[0.2em] text-violet-500">
              Единый вход
            </div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className={`grid place-items-center rounded-3xl bg-[#41e5b8] shadow-xl ${layout.centerTokenSize}`}>
                <svg
                  width={centerLogoSize}
                  height={centerLogoSize}
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 20.5L25.5 9H48V20.5H36.5V43H25.5H14V20.5Z"
                    fill="#102A26"
                  />
                  <path
                    d="M36.5 43L48 31.5V20.5H59V43H36.5Z"
                    fill="#102A26"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="rounded-full bg-violet-50 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-violet-600">
                Phone
              </div>
              <div className="rounded-full bg-sky-50 px-3 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-sky-600">
                Telegram
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className={`absolute left-1/2 top-1/2 rounded-full ${layout.glowSize}`}
        style={{ x: "-50%", y: "-50%" }}
        animate={{
          opacity: [0.12, 0.28, 0.12],
          scale: [0.88, 1.16, 0.88],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_70%)]" />
      </motion.div>
    </div>
  );
}

export default function LoginAccount({ onLogin, onBack }: LoginAccountProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 390, height: 844 });
  const inputRef = useRef<HTMLInputElement>(null);

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

  const layout = getScreenLayout(viewportSize.height, viewportSize.width);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleLogin = () => {
    onLogin?.();
  };

  const handleCompanyClick = () => {
    window.open("https://oemservice.tech/", "_blank");
  };

  const handleSupportClick = async () => {
    const email = "info@oe-media.ru";

    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch {
      alert(`Наш email: ${email}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-zinc-50"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <h1 className={layout.tier === "micro" || layout.tier === "compact" ? "text-xl font-bold text-zinc-900" : "text-2xl font-bold text-zinc-900"}>
              Профиль
            </h1>

            {onBack && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={onBack}
                className={`flex items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 ${
                  layout.tier === "micro" || layout.tier === "compact" ? "h-9 w-9" : "h-10 w-10"
                }`}
                aria-label="Назад"
              >
                <ArrowLeft size={layout.tier === "micro" || layout.tier === "compact" ? 18 : 20} className="text-zinc-700" />
              </motion.button>
            )}
          </div>
        </div>

        <div className={`mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden ${layout.shellPadding}`}>
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div className={`shrink-0 flex flex-col ${layout.topGap}`}>
              <FloatingBonuses layout={layout} />

              <div className={`flex flex-col ${layout.formGap}`}>
                <div className="shrink-0">
                  <p className={`font-bold text-zinc-900 ${layout.titleClass}`}>
                    Войдите или зарегистрируйтесь
                  </p>
                  <p className={`mt-2 text-zinc-400 ${layout.hintClass}`}>
                    Введите номер телефона
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center">
                      <span className="text-base text-zinc-400">+7</span>
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder=""
                      className={`w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                      inputMode="numeric"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 800, damping: 20 }}
                    onClick={handleLogin}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 font-medium text-white transition-colors hover:bg-zinc-800 ${layout.buttonClass}`}
                  >
                    <LogIn size={16} />
                    Войти
                  </motion.button>
                </div>

                <div className={`shrink-0 ${layout.tier === "micro" ? "my-0" : layout.tier === "compact" ? "my-0.5" : "my-1"}`}>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-zinc-200" />
                    <span className="text-xs text-zinc-400">или</span>
                    <div className="h-px flex-1 bg-zinc-200" />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                  onClick={handleLogin}
                  className={`shrink-0 flex w-full items-center justify-center gap-2 rounded-xl bg-[#54A9EB] font-medium text-white transition-colors hover:bg-[#4098E0] ${layout.buttonClass}`}
                >
                  <Send size={16} className="text-white" />
                  Войти через Telegram
                </motion.button>
              </div>
            </div>

            <div className={`grid shrink-0 pt-2 ${layout.tier === "micro" ? "gap-1.5" : layout.tier === "compact" ? "gap-2" : "gap-2.5"}`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={handleSupportClick}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white font-medium transition-colors hover:bg-zinc-50 ${layout.tertiaryButtonClass}`}
              >
                <Headphones size={16} className="text-zinc-600" />
                Техническая поддержка
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={handleCompanyClick}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white font-medium transition-colors hover:bg-zinc-50 ${layout.tertiaryButtonClass}`}
              >
                <Building2 size={16} className="text-zinc-600" />
                О компании
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 z-[200] flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-green-400/50 bg-green-500/90 px-5 py-4 text-white shadow-2xl backdrop-blur-sm"
            >
              <svg className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="flex-1 text-sm font-medium leading-relaxed">
                Адрес электронной почты скопирован
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
