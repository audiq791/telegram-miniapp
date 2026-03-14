"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "../components/ui";

const MAP_URL =
  "https://yandex.ru/map-widget/v1/?mode=search&text=%D0%90%D0%97%D0%A1";

export default function FuelMapScreen({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      className="min-h-100dvh bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="relative min-h-100dvh overflow-hidden bg-white">
        <div className="absolute left-4 top-4 z-[10]">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
        </div>

        {isLoading && (
          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#183A35]" />
              <div className="text-sm text-zinc-500">Загружаем карту заправок…</div>
            </div>
          </div>
        )}

        <iframe
          title="Карта заправок"
          src={MAP_URL}
          className="min-h-100dvh w-full"
          style={{ border: "none" }}
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </motion.div>
  );
}
