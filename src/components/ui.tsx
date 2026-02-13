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
  const [pulse, setPulse] = useState(0);

  const trigger = () => {
    setPulse((v) => v + 1);
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

        {/* УБРАЛИ серую заливку: делаем чистый белый “значок-бэйдж” */}
        <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center shrink-0 overflow-hidden">
          <AnimatedActionIcon kind={kind} pulse={pulse} />
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
      className="w-[28px] h-[28px] object-contain" // УВЕЛИЧИЛИ
      style={{
        // более “жёстко” убиваем цвет, чтобы бирюза стала чёрной
        filter: "grayscale(1) saturate(0) contrast(1.6) brightness(0.75)",
      }}
    />
  );
}

/* ===========================
   АНИМАЦИИ: только по клику, быстрее
   =========================== */

function AnimatedActionIcon({ kind, pulse }: { kind: ActionKind; pulse: number }) {
  // Важно: анимация срабатывает только при изменении key (по клику)
  const key = `${kind}-${pulse}`;

  if (kind === "send") {
    // быстрое “улетание” самолётика
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{
          x: [0, 10, 18, 0],
          y: [0, -6, -16, 0],
          rotate: [0, -12, -22, 0],
          opacity: [1, 1, 0, 1],
          scale: [1, 1, 0.98, 1],
        }}
        transition={{
          duration: 0.32, // быстрее
          times: [0, 0.45, 0.7, 1],
          ease: "easeOut",
        }}
        className="relative"
      >
        <motion.span
          key={`trail-${pulse}`}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: [0, 0.45, 0], scaleX: [0.4, 1, 1] }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 h-[2px] w-3 rounded-full bg-zinc-900/20 origin-right"
        />
        <MonoGif src="/icons/send.gif" alt="send" />
      </motion.div>
    );
  }

  if (kind === "receive") {
    // рука: быстрый “пульс” (без постоянной анимации)
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <MonoGif src="/icons/receive.gif" alt="receive" />
      </motion.div>
    );
  }

  if (kind === "swap") {
    // человечек: быстрый “клик” с лёгким качом
    return (
      <motion.div
        key={key}
        initial={false}
        animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 0.26, ease: "easeOut" }}
      >
        <MonoGif src="/icons/exchange.gif" alt="exchange" />
      </motion.div>
    );
  }

  // spend
  return <SpendIcon key={key} />;
}

function SpendIcon() {
  // Галочка статична, вниз уходит только стрелка (быстро)
  return (
    <div className="relative w-[28px] h-[28px] text-zinc-900">
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

      <motion.svg
        className="absolute inset-0"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, 0, 8], opacity: [0, 1, 0] }}
        transition={{ duration: 0.28, ease: "easeOut", times: [0, 0.15, 1] }}
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
