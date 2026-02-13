"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

// ===========================
// БАЗОВЫЕ КНОПКИ
// ===========================

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

// ===========================
// НИЖНЕЕ МЕНЮ
// ===========================

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

// ===========================
// ACTION CARD (ОТПРАВИТЬ/ПОЛУЧИТЬ/ОБМЕНЯТЬ/СПИСАТЬ)
// ===========================

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
  const [trigger, setTrigger] = React.useState(0);
  const isAnimating = useRef(false);

  const handleClick = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setTrigger((v) => v + 1);
    onClick?.();

    setTimeout(() => {
      isAnimating.current = false;
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
        {/* Текст слева */}
        <div className="min-w-0">
          <div className="text-[15px] font-semibold truncate">{label}</div>
          <div className="text-[12px] text-zinc-500 truncate">{hint}</div>
        </div>

        {/* Белая таблетка (обводка, тень) — без серой заливки, просто иконка */}
        <div className="h-10 w-10 rounded-2xl border border-zinc-200 shadow-sm grid place-items-center shrink-0 overflow-hidden bg-white">
          <AnimatedActionIcon kind={kind} trigger={trigger} />
        </div>
      </div>
    </motion.button>
  );
}

// ===========================
// АНИМИРОВАННЫЕ ИКОНКИ (ТОЛЬКО ПО КЛИКУ)
// ===========================

function Gif({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="w-[28px] h-[28px] object-contain"
    />
  );
}

function AnimatedActionIcon({ kind, trigger }: { kind: ActionKind; trigger: number }) {
  const key = `${kind}-${trigger}`;

  if (kind === "send") {
    return (
      <motion.div
        key={key}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={trigger ? {
          x: [0, 10, 20, 0],
          y: [0, -6, -16, 0],
          rotate: [0, -12, -24, 0],
          opacity: [1, 1, 0, 1],
        } : {}}
        transition={{ duration: 0.3, times: [0, 0.4, 0.7, 1], ease: "easeOut" }}
        className="relative"
      >
        <motion.span
          key={`trail-${trigger}`}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={trigger ? { opacity: [0, 0.4, 0], scaleX: [0.4, 1, 1] } : {}}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 h-[2px] w-3 rounded-full bg-zinc-900/30 origin-right"
        />
        <Gif src="/icons/send.gif" alt="send" />
      </motion.div>
    );
  }

  if (kind === "receive") {
    return (
      <motion.div
        key={key}
        initial={{ scale: 1 }}
        animate={trigger ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Gif src="/icons/receive.gif" alt="receive" />
      </motion.div>
    );
  }

  if (kind === "swap") {
    return (
      <motion.div
        key={key}
        initial={{ rotate: 0, scale: 1 }}
        animate={trigger ? { rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <Gif src="/icons/exchange.gif" alt="exchange" />
      </motion.div>
    );
  }

  // spend
  return <SpendIcon key={key} trigger={trigger} />;
}

function SpendIcon({ trigger }: { trigger: number }) {
  return (
    <div className="relative w-[28px] h-[28px] text-zinc-900">
      {/* галочка статична */}
      <svg
        className="absolute inset-0"
        width="28"
        height="28"
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

      {/* стрелка вниз — анимируется только при клике */}
      <motion.svg
        className="absolute inset-0"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        initial={{ y: 0, opacity: 0 }}
        animate={trigger ? { y: [0, 0, 8], opacity: [0, 1, 0] } : {}}
        transition={{ duration: 0.24, ease: "easeOut", times: [0, 0.2, 1] }}
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

// ===========================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ===========================

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}