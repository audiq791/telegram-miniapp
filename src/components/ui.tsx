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
      className="h-11 px-5 rounded-2xl bg-zinc-900 text-white font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
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
      <span className="w-5 h-5 inline-flex items-center justify-center">
        {icon}
      </span>
      <span className="text-[13px] font-semibold leading-none">
        {label}
      </span>
    </motion.button>
  );
}

// ===========================
// ACTION CARD
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
    }, 280);
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

        <div className="h-11 w-11 rounded-2xl border border-zinc-200 shadow-sm grid place-items-center shrink-0 bg-white overflow-hidden">
          <AnimatedActionIcon kind={kind} trigger={trigger} />
        </div>
      </div>
    </motion.button>
  );
}

// ===========================
// АНИМАЦИИ
// ===========================

function Gif({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="w-[30px] h-[30px] object-contain"
    />
  );
}

function AnimatedActionIcon({ kind, trigger }: { kind: ActionKind; trigger: number }) {
  const key = `${kind}-${trigger}`;

  if (kind === "send") {
    return (
      <motion.div
        key={key}
        animate={
          trigger
            ? {
                x: [0, 12, 20, 0],
                y: [0, -6, -14, 0],
                rotate: [0, -15, -25, 0],
              }
            : {}
        }
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <Gif src="/icons/send.gif" alt="send" />
      </motion.div>
    );
  }

  if (kind === "receive") {
    return (
      <motion.div
        key={key}
        animate={trigger ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Gif src="/icons/receive.gif" alt="receive" />
      </motion.div>
    );
  }

  if (kind === "swap") {
    return (
      <motion.div
        key={key}
        animate={trigger ? { rotate: [0, 12, -10, 0] } : {}}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <Gif src="/icons/exchange.gif" alt="exchange" />
      </motion.div>
    );
  }

  // spend → твой pay.gif
  return (
    <motion.div
      key={key}
      animate={trigger ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Gif src="/icons/pay.gif" alt="spend" />
    </motion.div>
  );
}

// ===========================
// ВСПОМОГАТЕЛЬНЫЕ
// ===========================

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
