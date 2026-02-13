"use client";

import { motion } from "framer-motion";
import { IconButton } from "../components/ui";
import { ArrowLeft } from "lucide-react";

export default function BlankScreen({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="min-h-[calc(100dvh-0px)] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-3">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div>
            <div className="text-sm text-zinc-500">Переход (тест)</div>
            <div className="text-lg font-semibold">{title}</div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white border border-zinc-200 p-5 shadow-sm">
          <div className="text-sm text-zinc-600">
            Пока пусто. Мы здесь потом сделаем нужный экран.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
