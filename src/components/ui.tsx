"use client";

import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";

// ===========================
// БАЗОВЫЕ КНОПКИ
// ===========================

type IconButtonProps = {
  aria?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ aria, onClick, children, className = "" }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);
      onClick?.();
    };

    return (
      <motion.button
        ref={ref}
        aria-label={aria}
        onClick={handleClick}
        animate={isPressed ? { scale: 0.94, backgroundColor: "#f4f4f5" } : { scale: 1, backgroundColor: "#ffffff" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center text-zinc-900 ${className}`}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';

export function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={isPressed ? { scale: 0.95, backgroundColor: "#27272a" } : { scale: 1, backgroundColor: "#18181b" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="h-11 px-5 sm:h-12 sm:px-6 md:h-14 md:px-8 rounded-2xl bg-zinc-900 text-white font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.18)] text-[clamp(14px,2vw,16px)]"
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
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={isPressed ? { scale: 0.96 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={[
        "w-full rounded-2xl px-3 py-2 flex flex-col items-center justify-center gap-1 border",
        "min-h-[52px] sm:min-h-[60px] md:min-h-[70px]",
        active
          ? "bg-zinc-900 border-zinc-900 text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
          : "bg-white border-zinc-200 text-zinc-900 shadow-sm",
      ].join(" ")}
    >
      <span className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 inline-flex items-center justify-center">
        {icon}
      </span>
      <span className={[
        "font-semibold leading-none",
        "text-[clamp(11px,2.5vw,14px)]",
        "sm:text-[clamp(12px,2vw,15px)]",
        "md:text-[clamp(13px,1.5vw,16px)]"
      ].join(" ")}>
        {label}
      </span>
    </motion.button>
  );
}

// ===========================
// ACTION CARD (4 КНОПКИ: ОТПРАВИТЬ, ПОЛУЧИТЬ, ОБМЕНЯТЬ, СПИСАТЬ)
// ===========================

export type ActionKind = "send" | "receive" | "swap" | "spend";

function Gif({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px] object-contain"
    />
  );
}

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
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onClick?.();
  };

  // Пути к GIF файлам
  const gifSrc = {
    send: "/icons/send.gif",
    receive: "/icons/receive.gif",
    swap: "/icons/exchange.gif",
    spend: "/icons/pay.gif",
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={isPressed ? { scale: 0.98, backgroundColor: "#f4f4f5" } : { scale: 1, backgroundColor: "#ffffff" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 sm:p-5 md:p-6 text-left hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[clamp(14px,2vw,16px)] font-semibold truncate">{label}</div>
          <div className="text-[clamp(11px,1.5vw,13px)] text-zinc-500 truncate">{hint}</div>
        </div>

        {/* Контейнер для гифки */}
        <div className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-2xl border border-zinc-200 shadow-sm grid place-items-center shrink-0 bg-white overflow-hidden">
          <img
            src={gifSrc[kind]}
            alt={kind}
            draggable={false}
            className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px] object-contain"
          />
        </div>
      </div>
    </motion.button>
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
  return <div className={`p-4 sm:p-5 md:p-6 ${className}`}>{children}</div>;
}