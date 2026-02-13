"use client";

import { motion } from "framer-motion";
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
      className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 text-zinc-700 grid place-items-center hover:bg-zinc-50"
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
      whileTap={{ scale: 0.98 }}
      transition={springTap}
      className="h-10 px-4 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm"
    >
      {label}
    </motion.button>
  );
}

export function ActionCard({
  label,
  hint,
  icon,
  onClick,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={springTap}
      className="group rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between shadow-sm hover:shadow-md"
    >
      <div>
        <div className="text-[15px] font-semibold">{label}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{hint}</div>
      </div>

      <div className="h-11 w-11 rounded-2xl bg-white border border-zinc-200 grid place-items-center text-zinc-900 group-hover:border-zinc-300 group-hover:shadow-sm">
        <div className="opacity-90">{icon}</div>
      </div>
    </motion.button>
  );
}

/** активный таб = чёрная заливка */
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
      transition={springTap}
      className={[
        "h-12 rounded-2xl flex items-center justify-center gap-2 border transition px-2",
        active
          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
          : "bg-white text-zinc-900 border-zinc-200",
      ].join(" ")}
    >
      <span className={active ? "opacity-100" : "text-zinc-500"}>{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </motion.button>
  );
}
