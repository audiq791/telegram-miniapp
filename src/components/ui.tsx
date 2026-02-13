"use client";

import React, { useMemo, useState } from "react";
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

/** Нижняя вкладка: активная — чёрная заливка, неактивная — белая */
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
  // “пружинка” для иконки
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
      <motion.span
        className="inline-flex items-center justify-center shrink-0"
        // мягкая логичная анимация: “подпрыгнуть” на тап
        whileTap={{ y: -1 }}
        transition={{ type: "spring", stiffness: 700, damping: 38 }}
        style={{ lineHeight: 0 }}
      >
        {/* Фикс “сжатых” иконок: задаём контейнеру размер */}
        <span className="w-5 h-5 inline-flex items-center justify-center">{icon}</span>
      </motion.span>

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
  const [pulseKey, setPulseKey] = useState(0);

  const trigger = () => {
    // запускаем анимацию иконки
    setPulseKey((v) => v + 1);
    onClick?.();
  };

  return (
    <motion.button
      onClick={trigger}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 text-left hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold truncate">{label}</div>
          <div className="text-[12px] text-zinc-500 truncate">{hint}</div>
        </div>

        {/* “пилюля” белая — иконка чёрная */}
        <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center shrink-0">
          <AnimatedActionIcon kind={kind} pulseKey={pulseKey} />
        </div>
      </div>
    </motion.button>
  );
}

/* ===========================
   АНИМАЦИИ ИКОНОК (как в финтехах/Telegram: коротко, мягко, “живое”)
   =========================== */

function AnimatedActionIcon({ kind, pulseKey }: { kind: ActionKind; pulseKey: number }) {
  // Каждое нажатие меняет key — Framer Motion заново проигрывает анимацию
  const key = `${kind}-${pulseKey}`;

  if (kind === "send") {
    // Самолётик “улетает” вверх-вправо, чуть поворачивается и исчезает → возвращается
    return (
      <motion.div
        key={key}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
        animate={{
          x: [0, 6, 16, 16, 0],
          y: [0, -4, -14, -14, 0],
          rotate: [0, -10, -18, -18, 0],
          opacity: [1, 1, 0, 0, 1],
          scale: [1, 1, 0.98, 0.98, 1],
        }}
        transition={{
          duration: 0.55,
          times: [0, 0.35, 0.6, 0.75, 1],
          ease: ["easeOut", "easeOut", "easeOut", "easeOut", "easeOut"],
        }}
        className="relative"
      >
        {/* небольшой “трейл” */}
        <motion.span
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: [0, 0.35, 0], scaleX: [0.4, 1, 1] }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 h-[2px] w-3 rounded-full bg-zinc-900/25 origin-right"
        />
        <PlaneIcon />
      </motion.div>
    );
  }

  if (kind === "receive") {
    // Стрелка “уходит вниз” (мягкое падение + лёгкий отскок)
    return (
      <motion.div
        key={key}
        initial={{ y: 0, scale: 1 }}
        animate={{ y: [0, 6, 10, 7, 0], scale: [1, 1, 0.99, 1, 1] }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <ReceiveIcon />
      </motion.div>
    );
  }

  if (kind === "swap") {
    // TG-стайл “обмен”: две стрелки, делают оборот (вращение + микро-скейл)
    return (
      <motion.div
        key={key}
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: [0, 180, 360], scale: [1, 1.02, 1] }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <SwapIcon />
      </motion.div>
    );
  }

  // spend: “галочка проставляется” (прорисовка stroke)
  return <AnimatedCheck key={key} />;
}

/* ===========================
   ИКОНКИ (в одном стиле, “премиальные”, тонкая обводка)
   =========================== */

function PlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.4 11.3 21 3l-8.3 17.6-2.2-6.1L3.4 11.3Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M21 3 10.5 14.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReceiveIcon() {
  // “download” стрелка вниз — ближе к финтех-паттернам, чем обычная “стрелка”
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M8.5 10.5 12 14l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 20h12"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SwapIcon() {
  // Telegram-подобные “обмен” стрелки: верхняя → вправо, нижняя → влево
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M15.5 4.5 18 7l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 17H7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M8.5 14.5 6 17l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnimatedCheck() {
  // Рисуем галочку “как будто проставили”
  const length = 40; // примерно для stroke-dash
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <motion.path
        d="M7 12.5 10.2 15.7 17.5 8.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length}
        initial={{ strokeDashoffset: length }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ===========================
   (Если где-то в проекте используется ещё один компонент — безопасный экспорт)
   =========================== */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
