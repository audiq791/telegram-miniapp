"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { springTap } from "./motion";

export function IconButton({
  children,
  onClick,
  aria,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  aria: string;
}) {
  return (
    <motion.button
      aria-label={aria}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={springTap}
      className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 text-zinc-900 grid place-items-center hover:bg-zinc-50"
    >
      {children}
    </motion.button>
  );
}

export function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={springTap}
      className="h-11 px-5 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm"
    >
      {label}
    </motion.button>
  );
}

type ActionKind = "send" | "receive" | "swap" | "spend";

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
  const iconControls = useAnimationControls();

  const playIcon = async () => {
    // сброс, чтобы повторные тапы всегда играли
    await iconControls.start("idle");
    await iconControls.start("tap");
  };

  return (
    <motion.button
      onClick={onClick}
      onTap={playIcon} // 🔥 вот это главное: тап по ВСЕЙ кнопке запускает анимацию иконки
      whileTap={{ scale: 0.985 }}
      transition={springTap}
      className="group rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between shadow-sm hover:shadow-md"
    >
      <div className="min-w-0">
        <div className="text-[15px] font-semibold">{label}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{hint}</div>
      </div>

      {/* фиксируем квадрат, чтобы иконки НЕ “сжимались” */}
      <div className="shrink-0 h-11 w-11 rounded-2xl bg-white border border-zinc-200 grid place-items-center text-zinc-900 group-hover:border-zinc-300 group-hover:shadow-sm">
        <AnimatedActionIcon kind={kind} controls={iconControls} />
      </div>
    </motion.button>
  );
}

/** Активный таб = чёрная заливка + анимация иконки по тапу */
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
  const iconControls = useAnimationControls();

  // лёгкая "подпрыгивающая" анимация, когда таб становится активным
  useEffect(() => {
    if (active) {
      iconControls.start("active");
    } else {
      iconControls.start("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const tapIcon = async () => {
    await iconControls.start("idle");
    await iconControls.start("tap");
  };

  return (
    <motion.button
      onClick={onClick}
      onTap={tapIcon}
      whileTap={{ scale: 0.985 }}
      transition={springTap}
      className={[
        "w-full rounded-2xl border transition select-none",
        "px-2 py-2 min-h-[52px]",
        "flex flex-col items-center justify-center gap-1",
        active
          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
          : "bg-white text-zinc-900 border-zinc-200",
      ].join(" ")}
    >
      <motion.span
        className="grid place-items-center leading-none"
        variants={{
          idle: { y: 0, scale: 1, rotate: 0 },
          active: { y: 0, scale: 1.02 },
          tap: { y: [0, -2, 0], scale: [1, 1.06, 1], rotate: [0, -2, 0] },
        }}
        animate={iconControls}
        transition={{ duration: 0.28, ease: "easeInOut" }}
      >
        <span className={active ? "opacity-100" : "text-zinc-500"}>
          {icon}
        </span>
      </motion.span>

      <span className="text-[clamp(11px,2.8vw,12px)] font-semibold leading-none">
        {label}
      </span>
    </motion.button>
  );
}

/* =========================
   Анимированные action-иконки (по тапу всей кнопки)
   ========================= */

function AnimatedActionIcon({
  kind,
  controls,
}: {
  kind: ActionKind;
  controls: ReturnType<typeof useAnimationControls>;
}) {
  if (kind === "send") return <SendPlaneIcon controls={controls} />;
  if (kind === "receive") return <ReceiveDownIcon controls={controls} />;
  if (kind === "swap") return <SwapRotateIcon controls={controls} />;
  return <CheckDrawIcon controls={controls} />;
}

function SendPlaneIcon({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.div
      className="h-6 w-6 text-zinc-900"
      variants={{
        idle: { x: 0, y: 0, rotate: 0, opacity: 1 },
        tap: { x: [0, 10, 0], y: [0, -6, 0], rotate: [0, -10, 0], opacity: [1, 0.85, 1] },
      }}
      animate={controls}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </motion.div>
  );
}

function ReceiveDownIcon({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.div
      className="h-6 w-6 text-zinc-900"
      variants={{
        idle: { y: 0, opacity: 1 },
        tap: { y: [0, 6, 0], opacity: [1, 0.85, 1] },
      }}
      animate={controls}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 21h16" />
      </svg>
    </motion.div>
  );
}

function SwapRotateIcon({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.div
      className="h-6 w-6 text-zinc-900"
      variants={{
        idle: { rotate: 0 },
        tap: { rotate: [0, 180, 360] },
      }}
      animate={controls}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 3h5v5" />
        <path d="M21 3l-7 7" />
        <path d="M8 21H3v-5" />
        <path d="M3 21l7-7" />
      </svg>
    </motion.div>
  );
}

function CheckDrawIcon({
  controls,
}: {
  controls: ReturnType<typeof useAnimationControls>;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-zinc-900"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M20 6L9 17l-5-5"
        variants={{
          idle: { pathLength: 0, opacity: 0.6 },
          tap: { pathLength: [0, 1], opacity: [0.6, 1] },
        }}
        animate={controls}
        transition={{ duration: 0.28, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
