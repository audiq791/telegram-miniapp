"use client";

import React, { useState } from "react";
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
      <motion.span
        className="inline-flex items-center justify-center shrink-0"
        whileTap={{ y: -1 }}
        transition={{ type: "spring", stiffness: 700, damping: 38 }}
        style={{ lineHeight: 0 }}
      >
        {/* фикс “сжатых” иконок: контейнер стабильного размера */}
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

        {/* Белая таблетка — внутри чёрная иконка */}
        <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center shrink-0 overflow-hidden">
          <AnimatedActionIcon kind={kind} pulseKey={pulseKey} />
        </div>
      </div>
    </motion.button>
  );
}

/* ===========================
   GIF-иконки: делаем бирюзовый элемент ЧЁРНЫМ (ч/б)
   =========================== */

/**
 * Режим "черно-белый": убирает цвет и делает цветные пиксели темнее/чернее.
 * Черный контур останется черным.
 *
 * Если вдруг фон в GIF реально "зашит" белым — он останется белым (ок).
 */
function MonoGif({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-[22px] h-[22px] object-contain"
      style={{
        // ключ: убиваем цвет -> акцент станет черным/темно-серым, контур останется черным
        // подобрано мягко, чтобы белый фон (если есть) не становился грязным
        filter: "grayscale(1) saturate(0) contrast(1.4) brightness(0.85)",
      }}
      draggable={false}
    />
  );
}

/* ===========================
   АНИМАЦИИ ИКОНКИ ВНУТРИ КНОПКИ
   =========================== */

function AnimatedActionIcon({ kind, pulseKey }: { kind: ActionKind; pulseKey: number }) {
  const key = `${kind}-${pulseKey}`;

  if (kind === "send") {
    // самолетик "улетает" внутри таблетки
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
        <motion.span
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: [0, 0.35, 0], scaleX: [0.4, 1, 1] }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 h-[2px] w-3 rounded-full bg-zinc-900/25 origin-right"
        />
        <MonoGif src="/icons/send.gif" alt="send" />
      </motion.div>
    );
  }

  if (kind === "receive") {
    // рука: легкий "пульс" и микро-сдвиг вниз (приятное ощущение получения)
    return (
      <motion.div
        key={key}
        initial={{ y: 0, scale: 1 }}
        animate={{ y: [0, 2, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <MonoGif src="/icons/receive.gif" alt="receive" />
      </motion.div>
    );
  }

  if (kind === "swap") {
    // человечек: "подключение/сеть" — мягкий оборот + масштаб
    return (
      <motion.div
        key={key}
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        <MonoGif src="/icons/exchange.gif" alt="exchange" />
      </motion.div>
    );
  }

  // spend: чек + вниз уходит ТОЛЬКО стрелка
  return <SpendIcon key={key} />;
}

/* ===========================
   СПИСАТЬ: чек статичный + стрелка вниз анимируется
   =========================== */

function SpendIcon() {
  return (
    <motion.div
      className="relative w-[22px] h-[22px] text-zinc-900"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {/* Галочка — НЕ двигается */}
      <svg
        className="absolute inset-0"
        width="22"
        height="22"
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

      {/* Стрелка вниз — двигается вниз и исчезает */}
      <motion.svg
        className="absolute inset-0"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, 0, 7], opacity: [0, 1, 0] }}
        transition={{ duration: 0.42, ease: "easeOut", times: [0, 0.2, 1] }}
      >
        <path
          d="M12 6v9"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        <path
          d="M8.5 12.5 12 16l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

/* Безопасные экспорты, если где-то используются */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
