"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronUp,
  Headphones,
  LogIn,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import { readLastAuthEmail, writeLastAuthEmail } from "@/lib/auth/storage";

interface LoginAccountProps {
  onLogin?: () => void;
  onBack?: () => void;
}

type LayoutTier = "micro" | "compact" | "regular";

type AuthMessage = {
  type: "error" | "success";
  text: string;
} | null;

function getFriendlyAuthErrorMessage(error: unknown, fallback: string) {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;
  const normalized = raw.toLowerCase();

  if (normalized.includes("уже было недавно отправлено") || normalized.includes("rate")) {
    return "Письмо уже было недавно отправлено. Попробуйте ещё раз чуть позже.";
  }

  if (normalized.includes("уже зарегистрирован") || normalized.includes("already registered")) {
    return "Данный E-Mail уже зарегистрирован. Войдите через пароль.";
  }

  if (normalized.includes("invalid credentials") || normalized.includes("неверная почта")) {
    return "Неверная почта или пароль.";
  }

  if (normalized.includes("код не верный")) {
    return "Код не верный.";
  }

  if (normalized.includes("истёк") || normalized.includes("expired")) {
    return "Срок действия кода истёк. Запросите новый код.";
  }

  return raw || fallback;
}

function getLayout(viewportHeight: number, viewportWidth: number) {
  const shortSide = Math.min(viewportHeight, viewportWidth);
  const tier: LayoutTier =
    viewportHeight <= 700 || shortSide <= 350 ? "micro" : viewportHeight <= 780 ? "compact" : "regular";

  return {
    tier,
    shellPadding: tier === "micro" ? "px-4 pt-3 pb-3" : tier === "compact" ? "px-4 pt-4 pb-4" : "px-5 pt-5 pb-5",
    gap: tier === "micro" ? "gap-3" : "gap-4",
    titleClass: tier === "micro" ? "text-[1.35rem]" : tier === "compact" ? "text-[1.6rem]" : "text-[1.8rem]",
    fieldClass: tier === "micro" ? "h-10 text-[0.92rem]" : "h-12 text-base",
    buttonClass: tier === "micro" ? "h-10 text-[0.92rem]" : "h-12 text-base",
    tertiaryButtonClass: tier === "micro" ? "h-9 text-[0.82rem]" : "h-11 text-[0.95rem]",
  };
}

function Hero() {
  const coins = [
    { src: "/logos/vkusvill.svg", x: -120, y: -28, delay: 0, hue: "from-emerald-100 to-emerald-50" },
    { src: "/logos/dodo.svg", x: 110, y: -36, delay: 0.3, hue: "from-orange-100 to-orange-50" },
    { src: "/logos/cska.svg", x: 0, y: -90, delay: 0.55, hue: "from-blue-100 to-sky-50" },
    { src: "/logos/wildberries.svg", x: -94, y: 44, delay: 0.8, hue: "from-fuchsia-100 to-purple-50" },
    { src: "/logos/cofix.svg", x: 100, y: 52, delay: 1.1, hue: "from-rose-100 to-orange-50" },
  ];

  return (
    <div className="relative h-[180px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),transparent_32%),linear-gradient(135deg,rgba(250,245,255,0.88),rgba(238,242,255,0.88))]">
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-violet-300/20 blur-2xl" />

      <motion.div className="absolute left-1/2 top-1/2" style={{ x: "-50%", y: "-50%" }}>
        {coins.map((coin) => (
          <motion.div
            key={coin.src}
            className="absolute"
            initial={{ x: coin.x, y: coin.y, opacity: 0.35, scale: 0.82 }}
            animate={{
              x: [coin.x, coin.x + 18, coin.x - 12, coin.x],
              y: [coin.y, coin.y + 14, coin.y - 8, coin.y],
              opacity: [0.35, 0.75, 0.45, 0.35],
            }}
            transition={{ duration: 8, delay: coin.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className={`grid h-12 w-12 place-items-center rounded-full border border-white/90 bg-gradient-to-br shadow-lg ${coin.hue}`}
              style={{ boxShadow: "0 12px 24px rgba(24,24,27,0.12), inset 0 1px 0 rgba(255,255,255,0.86)" }}
            >
              <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-white/95 shadow-inner">
                <Image src={coin.src} alt="" width={24} height={24} className="h-auto w-auto max-h-[60%] max-w-[60%] object-contain" />
              </div>
            </div>
          </motion.div>
        ))}

        <div
          className="relative rounded-[28px] border border-white/20 px-4 py-3 shadow-[0_22px_42px_rgba(24,58,53,0.22)] backdrop-blur-md"
          style={{ backgroundColor: "#183A35" }}
        >
          <div className="text-center text-[0.56rem] font-medium uppercase tracking-[0.2em] text-white">
            Единый вход
          </div>
          <div className="mt-2 flex justify-center">
            <div className="grid h-24 w-24 place-items-center rounded-[28px]" style={{ backgroundColor: "#183A35" }}>
              <svg width="98" height="98" viewBox="0 0 1093 959" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M 421.00 916.37 C396.38,915.63 362.28,912.11 339.00,907.91 C290.62,899.17 238.20,875.69 195.06,843.43 C174.66,828.17 157.10,811.43 135.36,786.50 C123.94,773.40 102.77,741.46 94.14,724.29 C76.04,688.28 63.77,650.95 58.03,614.50 C53.88,588.13 53.80,585.93 53.30,492.59 C52.81,400.23 53.22,383.07 56.56,357.44 C63.28,305.92 79.11,261.78 107.48,215.50 C123.61,189.18 137.40,171.86 159.66,149.97 C192.48,117.70 224.30,96.26 270.50,75.27 C289.88,66.47 322.65,56.65 351.00,51.15 C381.57,45.21 372.23,45.50 535.00,45.50 C673.58,45.50 686.73,45.64 701.00,47.30 C748.94,52.87 774.31,58.91 812.00,73.73 C836.18,83.23 864.20,99.67 893.50,121.55 C907.70,132.16 939.30,163.52 952.90,180.51 C970.92,203.02 988.35,231.39 998.96,255.50 C1015.67,293.47 1023.27,319.49 1028.75,357.50 L 1031.35 375.50 L 1031.75 472.00 C1032.02,537.55 1031.79,573.15 1031.02,583.00 C1026.90,636.40 1012.00,685.56 985.96,731.68 C952.89,790.24 910.76,833.29 851.14,869.42 C818.51,889.19 776.80,904.32 736.59,910.97 C702.87,916.54 711.89,916.25 566.00,916.46 C491.48,916.57 426.23,916.53 421.00,916.37 ZM 640.32 721.88 C642.84,720.59 657.71,706.12 721.25,643.16 L 767.00 597.83 L 767.00 467.56 L 767.00 337.29 L 759.35 336.65 C755.14,336.29 733.57,336.00 711.41,336.00 L 671.12 336.00 L 670.58 331.75 C670.28,329.41 669.91,308.07 669.77,284.33 C669.62,260.59 669.12,240.79 668.67,240.33 C667.69,239.35 416.05,239.51 408.18,240.50 L 402.83 241.16 L 342.17 301.17 C308.80,334.18 281.00,362.15 280.38,363.34 C278.76,366.46 277.75,719.71 279.36,720.76 C282.21,722.61 636.73,723.72 640.32,721.88 ZM 863.80 294.00 C863.97,271.17 863.82,249.69 863.47,246.25 L 862.84 240.00 L 814.92 240.00 L 767.00 240.00 L 767.00 287.75 L 767.00 335.50 L 815.25 335.50 L 863.50 335.50 L 863.80 294.00 ZM 375.62 623.88 C375.28,622.16 375.00,572.63 375.00,513.83 C375.00,422.91 375.21,406.50 376.43,404.20 C377.73,401.76 408.52,370.81 434.61,345.72 L 444.72 336.00 L 557.36 336.00 L 670.00 336.00 L 670.00 447.03 L 670.00 558.05 L 645.25 582.28 C631.64,595.60 615.75,611.11 609.94,616.75 L 599.39 627.00 L 487.82 627.00 L 376.25 627.00 L 375.62 623.88 Z"
                  fill="#DCF806"
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
    </div>
  );
}

export default function LoginAccount({ onLogin, onBack }: LoginAccountProps) {
  const [emailModeOpen, setEmailModeOpen] = useState(false);
  const [emailFlowMode, setEmailFlowMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [region, setRegion] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<AuthMessage>(null);
  const [viewportSize, setViewportSize] = useState({ width: 390, height: 844 });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const layout = getLayout(viewportSize.height, viewportSize.width);

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
    const rememberedEmail = readLastAuthEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
  }, []);

  useEffect(() => {
    if (region) return;
    const locale = navigator.language || "";
    const regionFromLocale = locale.includes("-") ? locale.split("-")[1] : "";
    if (regionFromLocale) {
      setRegion(regionFromLocale.toUpperCase());
    }
  }, [region]);

  const openEmailMode = () => {
    setEmailModeOpen((current) => !current);
    setAuthMessage(null);
    window.setTimeout(() => emailInputRef.current?.focus(), 120);
  };

  const handleSwitchEmailFlow = (mode: "login" | "register") => {
    setEmailFlowMode(mode);
    setAuthMessage(null);
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setCodeSent(false);
    setCodeVerified(false);
  };

  const handleEmailPasswordLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthMessage({ type: "error", text: "Введите E-Mail и пароль." });
      return;
    }

    setIsSubmitting(true);
    setAuthMessage(null);

    try {
      const response = await fetch("/api/auth/email/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Неверная почта или пароль.");
      }

      writeLastAuthEmail(email.trim());
      onLogin?.();
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: getFriendlyAuthErrorMessage(error, "Неверная почта или пароль."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!email.trim()) {
      setAuthMessage({ type: "error", text: "Сначала введите E-Mail." });
      return;
    }

    setIsSubmitting(true);
    setAuthMessage(null);

    try {
      const response = await fetch("/api/auth/email/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          region: region.trim() || null,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Не удалось отправить код на почту.");
      }

      writeLastAuthEmail(email.trim());
      setCodeSent(true);
      setCodeVerified(false);
      setAuthMessage({
        type: "success",
        text: "Код отправлен на почту. Введите его ниже и подтвердите адрес.",
      });
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: getFriendlyAuthErrorMessage(error, "Не удалось отправить код на почту."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!email.trim() || !verificationCode.trim()) {
      setAuthMessage({ type: "error", text: "Введите E-Mail и код из письма." });
      return;
    }

    setIsSubmitting(true);
    setAuthMessage(null);

    try {
      const response = await fetch("/api/auth/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          code: verificationCode.trim(),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Код не верный.");
      }

      setCodeVerified(true);
      setAuthMessage({
        type: "success",
        text: "Код подтверждён. Теперь придумайте пароль и завершите регистрацию.",
      });
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: getFriendlyAuthErrorMessage(error, "Код не верный."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!codeVerified) {
      setAuthMessage({ type: "error", text: "Сначала подтвердите код из письма." });
      return;
    }

    if (!password.trim() || password.length < 6) {
      setAuthMessage({ type: "error", text: "Пароль должен содержать минимум 6 символов." });
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage({ type: "error", text: "Пароли не совпадают." });
      return;
    }

    setIsSubmitting(true);
    setAuthMessage(null);

    try {
      const response = await fetch("/api/auth/email/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password,
          confirmPassword,
          region: region.trim() || null,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Не удалось завершить регистрацию.");
      }

      writeLastAuthEmail(email.trim());
      onLogin?.();
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: getFriendlyAuthErrorMessage(error, "Не удалось завершить регистрацию."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTelegramLogin = async () => {
    setIsSubmitting(true);
    setAuthMessage(null);

    try {
      const telegram = (
        window as typeof window & {
          Telegram?: {
            WebApp?: {
              initData?: string;
              ready?: () => void;
            };
          };
        }
      ).Telegram?.WebApp;

      telegram?.ready?.();

      if (!telegram?.initData) {
        throw new Error("Вход через Telegram доступен только внутри Telegram Mini App.");
      }

      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ initData: telegram.initData }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Не удалось войти через Telegram.");
      }

      onLogin?.();
    } catch (error) {
      setAuthMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Не удалось войти через Telegram.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportClick = async () => {
    const supportEmail = "info@oe-media.ru";

    try {
      await navigator.clipboard.writeText(supportEmail);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2000);
    } catch {
      alert(`Наш email: ${supportEmail}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-zinc-50">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <h1 className={layout.tier === "micro" ? "text-xl font-bold text-zinc-900" : "text-2xl font-bold text-zinc-900"}>
              Профиль
            </h1>
            {onBack && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-200"
                aria-label="Назад"
              >
                <ArrowLeft size={20} className="text-zinc-700" />
              </motion.button>
            )}
          </div>
        </div>

        <div className={`mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden ${layout.shellPadding}`}>
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <div className={`flex flex-col ${layout.gap}`}>
              <Hero />

              <div className={`flex flex-col ${layout.gap}`}>
                <div>
                  <p className={`font-bold text-zinc-900 ${layout.titleClass}`}>Войдите или зарегистрируйтесь</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Telegram-вход работает внутри Mini App. Для E-Mail входа используйте код из письма и пароль.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                  onClick={handleTelegramLogin}
                  disabled={isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#54A9EB] font-medium text-white transition-colors hover:bg-[#4098E0] disabled:opacity-60 ${layout.buttonClass}`}
                >
                  <Send size={16} className="text-white" />
                  Войти через Telegram
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 800, damping: 20 }}
                  onClick={openEmailMode}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 transition-colors hover:bg-zinc-50 ${layout.buttonClass}`}
                >
                  <Mail size={16} />
                  Вход по E-Mail
                  {emailModeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.button>

                <AnimatePresence initial={false}>
                  {emailModeOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleSwitchEmailFlow("login")}
                            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${emailFlowMode === "login" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
                          >
                            Вход
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSwitchEmailFlow("register")}
                            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${emailFlowMode === "register" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
                          >
                            Регистрация
                          </button>
                        </div>

                        <div className="mt-3 grid gap-3">
                          <input
                            ref={emailInputRef}
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="E-Mail"
                            className={`w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                            autoCapitalize="none"
                            autoCorrect="off"
                          />

                          {emailFlowMode === "login" ? (
                            <>
                              <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Пароль"
                                className={`w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                              />
                              <button
                                type="button"
                                onClick={handleEmailPasswordLogin}
                                disabled={isSubmitting}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 ${layout.buttonClass}`}
                              >
                                <LogIn size={16} />
                                Войти
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={handleSendEmailCode}
                                disabled={isSubmitting}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 ${layout.buttonClass}`}
                              >
                                <Mail size={16} />
                                Отправить код
                              </button>

                              {codeSent && (
                                <>
                                  <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 8))}
                                    placeholder="Код из письма"
                                    className={`w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                                    inputMode="numeric"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleVerifyEmailCode}
                                    disabled={isSubmitting}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-60 ${layout.buttonClass}`}
                                  >
                                    <ShieldCheck size={16} />
                                    Подтвердить код
                                  </button>
                                </>
                              )}

                              {codeVerified && (
                                <>
                                  <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Придумайте пароль"
                                    className={`w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                                  />
                                  <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Повторите пароль"
                                    className={`w-full rounded-xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${layout.fieldClass}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleCompleteRegistration}
                                    disabled={isSubmitting}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 ${layout.buttonClass}`}
                                  >
                                    <ShieldCheck size={16} />
                                    Создать аккаунт
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {authMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`rounded-2xl border px-4 py-3 text-sm ${authMessage.type === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
                    >
                      {authMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={`grid shrink-0 pt-2 ${layout.gap}`}>
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
                onClick={() => window.open("https://oemservice.tech/", "_blank")}
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
              <p className="flex-1 text-sm font-medium leading-relaxed">Адрес электронной почты скопирован</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
