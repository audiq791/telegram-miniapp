"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "../components/ui";
import ActivityScreen from "./ActivityScreen";
import SpendSettingsScreen from "./SpendSettingsScreen";

export default function BlackScreen({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  // Если это экран активности, показываем ActivityScreen
  if (title === "Активность") {
    return <ActivityScreen onBack={onBack} />;
  }

  // Если это экран настроек списания
  if (title === "Списать") {
    return <SpendSettingsScreen onBack={onBack} />;
  }

  // Для остальных экранов показываем заглушку
  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-3">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>

          <div className="min-w-0">
            <div className="text-[13px] text-zinc-500 leading-none">Переход (тест)</div>
            <div className="text-[17px] font-semibold leading-tight truncate">{title}</div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-zinc-200 p-5 shadow-sm">
          <div className="text-sm text-zinc-600">
            Пока пусто. Здесь позже будет экран &quot;{title}&quot;
          </div>
        </div>
      </div>
    </motion.div>
  );
}