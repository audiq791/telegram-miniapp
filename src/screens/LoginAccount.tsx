"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

type LayoutTier = "compact" | "regular" | "roomy";

type ScreenLayout = {
  tier: LayoutTier;
  shellPadding: string;
  contentGap: string;
  cardGap: string;
  heroHeight: string;
  coinSize: string;
  centerTokenSize: string;
  titleClass: string;
  hintClass: string;
  fieldClass: string;
  buttonClass: string;
  tertiaryButtonClass: string;
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

      const nextScale = Math.min(1, availableHeight / naturalHeight);
      setScale(nextScale);
      setScaledHeight(naturalHeight * nextScale);
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    window.visualViewport?.addEventListener("resize", measure);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.visualViewport?.removeEventListener("resize", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={frameRef} className="min-h-0 flex-1 overflow-hidden">
      <div
        className="mx-auto"
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
            width: scale < 1 ? `${100 / scale}%` : "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function getScreenLayout(viewportHeight: number, viewportWidth: number): ScreenLayout {
  const shortSide = Math.min(viewportHeight, viewportWidth);
  const compact = viewportHeight <= 740 || shortSide <= 350;
  const roomy = viewportHeight >= 860 && shortSide >= 390;
  const tier: LayoutTier = compact ? "compact" : roomy ? "roomy" : "regular";

  return {
    tier,
    shellPadding: compact ? "px-4 pt-4 pb-4" : roomy ? "px-5 pt-6 pb-5" : "px-4.5 pt-5 pb-4.5",
    contentGap: compact ? "gap-3" : roomy ? "gap-6" : "gap-4",
    cardGap: compact ? "gap-3" : roomy ? "gap-5" : "gap-4",
    heroHeight: compact ? "h-[140px]" : roomy ? "h-[220px]" : "h-[180px]",
    coinSize: compact ? "h-10 w-10 text-lg" : roomy ? "h-14 w-14 text-2xl" : "h-12 w-12 text-xl",
    centerTokenSize: compact ? "h-20 w-20 text-3xl" : roomy ? "h-28 w-28 text-5xl" : "h-24 w-24 text-4xl",
    titleClass: compact ? "text-[1.55rem] leading-[1.05]" : roomy ? "text-[2.15rem] leading-[1.02]" : "text-[1.8rem] leading-[1.04]",
    hintClass: compact ? "text-[0.72rem]" : "text-xs",
    fieldClass: compact ? "h-11 text-[0.95rem]" : "h-12 text-base",
    buttonClass: compact ? "h-11 text-[0.95rem]" : "h-12 text-base",
    tertiaryButtonClass: compact ? "h-10 text-[0.9rem]" : "h-11 text-[0.95rem]",
  };
}

function FloatingBonuses({ layout }: { layout: ScreenLayout }) {
  return (
    <div className={`relative w-full ${layout.heroHeight}`}>
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />

      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ x: "-50%", y: "-50%" }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [40, 0, -40, -80],
              x: [0, (i - 3.5) * 20, (i - 3.5) * 25, (i - 3.5) * 15],
              scale: [0.8, 1, 0.9, 0.7],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          >
            <div
              className={`flex items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white shadow-lg ${layout.coinSize}`}
            >
              <span className="font-bold text-zinc-900">B</span>
            </div>
          </motion.div>
        ))}

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`flex items-center justify-center rounded-3xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-2xl ${layout.centerTokenSize}`}
        >
          <span className="font-bold text-white">B</span>
        </motion.div>
      </motion.div>

      <motion.div
        className={`absolute left-1/2 top-1/2 rounded-full ${layout.tier === "roomy" ? "h-36 w-36" : layout.tier === "compact" ? "h-24 w-24" : "h-32 w-32"}`}
        style={{ x: "-50%", y: "-50%" }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#00000020,transparent_70%)]" />
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
            <h1 className={layout.tier === "compact" ? "text-xl font-bold text-zinc-900" : "text-2xl font-bold text-zinc-900"}>
              Профиль
            </h1>

            {onBack && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={onBack}
                className={`flex items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200 ${
                  layout.tier === "compact" ? "h-9 w-9" : "h-10 w-10"
                }`}
                aria-label="Назад"
              >
                <ArrowLeft size={layout.tier === "compact" ? 18 : 20} className="text-zinc-700" />
              </motion.button>
            )}
          </div>
        </div>

        <FitToViewport contentClassName={layout.shellPadding}>
          <div className={`mx-auto flex max-w-md flex-col ${layout.contentGap}`}>
            <div className="shrink-0">
              <FloatingBonuses layout={layout} />
            </div>

            <div className={`flex flex-col ${layout.cardGap}`}>
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

              <div className={`shrink-0 ${layout.tier === "compact" ? "my-0.5" : "my-1"}`}>
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

              <div className={`grid shrink-0 ${layout.tier === "compact" ? "gap-2" : "gap-2.5"}`}>
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
        </FitToViewport>

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
