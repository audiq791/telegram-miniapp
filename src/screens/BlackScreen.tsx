"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "../components/ui";

export default function BlackScreen({
  title,
}: {
  title: string;
}) {
  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-3">
          <IconButton
            aria="back"
            onClick={() => {
              // ВАЖНО: используем history.back()
              // Тогда и кнопка внутри приложения и Android back работают одинаково
              window.history.back();
            }}
          >
            <ArrowLeft size={18} />
          </IconButton>

          <div className="min-w-0">
            <div className="text-[13px] text-zinc-500 leading-none">Переход (тест)</div>
            <div className="text-[17px] font-semibold leading-tight truncate">{title}</div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-zinc-200 p-5 shadow-sm">
          <div className="text-sm text-zinc-600">
            Пока пусто. Здесь позже будет нужный экран.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
