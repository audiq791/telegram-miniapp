"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

type IconButtonProps = {
  aria?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export function IconButton({ aria, onClick, children }: IconButtonProps) {
  return (
    <motion.button
      aria-label={aria}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center text-zinc-900"
    >
      {children}
    </motion.button>
  );
}

export function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      className="h-11 px-5 rounded-2xl bg-zinc-900 text-white font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.18)] active:shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
    >
      {label}
    </motion.button>
  );
}

/** Нижняя вкладка: активная — чёрная заливка */
export function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className={[
        "h-12 rounded-2xl px-3 flex items-center justify-center gap-2 border",
        active
          ? "bg-zinc-900 border-zinc-900 text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
          : "bg-white border-zinc-200 text-zinc-900 shadow-sm",
      ].join(" ")}
    >
      <span className="w-5 h-5 inline-flex items-center justify-center">{icon}</span>
      <span className="text-[13px] font-semibold leading-none">{label}</span>
    </motion.button>
  );
}

export type ActionKind = "send" | "receive" | "swap" | "spend";

export function ActionCard({
  label,
  hint,
  kind,
  onClick,
}: {
  label: string;
  hint: string;
  kind: ActionKind;
  onClick?: () => void;
}) {
  const animating = useRef(false);
  const [trigger, setTrigger] = React.useState(0);

  const handleClick = () => {
    if (animating.current) return;
    animating.current = true;
    setTrigger((v) => v + 1);
    onClick?.();

    // через 300 мс разрешаем снова (длина анимации)
    setTimeout(() => {
      animating.current = false;
    }, 300);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 text-left hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold truncate">{label}</div>
          <div className="text-[12px] text-zinc-500 truncate">{hint}</div>
        </div>

        {/* УБРАЛИ серую заливку: прозрачный фон, только иконка */}
        <div className="h-10 w-10 grid place-items-center shrink-0 overflow-hidden">
          <AnimatedActionIcon kind={kind} trigger={trigger} />
        </div>
      </div>
    </motion.button>
  );
}

/* ===========================
   GIF: делаем цветной акцент ЧЁРНЫМ → ч/б
   =========================== */

function MonoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="w-[32px] h-[32px] object-contain" // ЕЩЁ КРУПНЕЕ
      style={{
        // убиваем цвет полностью
        filter: "grayscale(1) saturate(0) contrast(1.8) brightness(0.7)",
      }}
    />
  );
}

/* ===========================
   АНИМАЦИИ: только по клику, однократно
   =========================== */

function AnimatedActionIcon({ kind, trigger }: { kind: ActionKind; trigger: number }) {
  // ключ меняется только при клике
  const key = `${kind}-${trigger}`;

  if (kind === "send") {
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{
          x: [0, 12, 22, 0],
          y: [0, -8, -20, 0],
          rotate: [0, -15, -28, 0],
          opacity: [1, 1, 0, 1],
          scale: [1, 1, 0.96, 1],
        }}
        transition={{
          duration: 0.3,
          times: [0, 0.4, 0.7, 1],
          ease: "easeOut",
        }}
        className="relative"
      >
        <motion.span
          key={`trail-${trigger}`}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: [0, 0.5, 0], scaleX: [0.4, 1, 1] }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 h-[2px] w-3 rounded-full bg-zinc-900/20 origin-right"
        />
        <MonoGif src="/icons/send.gif" alt="send" />
      </motion.div>
    );
  }

  if (kind === "receive") {
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <MonoGif src="/icons/receive.gif" alt="receive" />
      </motion.div>
    );
  }

  if (kind === "swap") {
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <MonoGif src="/icons/exchange.gif" alt="exchange" />
      </motion.div>
    );
  }

  // spend
  return <SpendIcon key={key} />;
}

function SpendIcon() {
  return (
    <div className="relative w-[32px] h-[32px] text-zinc-900">
      <svg
        className="absolute inset-0"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 12.5 10.2 15.7 17.5 8.4"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <motion.svg
        className="absolute inset-0"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, 0, 10], opacity: [0, 1, 0] }}
        transition={{ duration: 0.26, ease: "easeOut", times: [0, 0.15, 1] }}
      >
        <path d="M12 6v9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <path
          d="M8.5 12.5 12 16l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}

/* Безопасные экспорты */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}