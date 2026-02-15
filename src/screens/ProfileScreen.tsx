"use client";

import { motion } from "framer-motion";
import { IconButton } from "../components/ui";
import { ArrowLeft } from "lucide-react";

export default function ProfileScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4 pb-28">
        {/* Шапка */}
        <div className="flex items-center gap-3 mb-6">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div>
            <div className="text-[13px] text-zinc-500 leading-none">Раздел</div>
            <div className="text-xl font-semibold">Профиль</div>
          </div>
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm text-center">
          <p className="text-zinc-500">Здесь будет контент профиля</p>
        </div>
      </div>
    </motion.div>
  );
}