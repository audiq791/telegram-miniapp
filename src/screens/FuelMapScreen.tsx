"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, LocateFixed } from "lucide-react";
import { IconButton } from "../components/ui";

const MAP_URL =
  "https://yandex.ru/map-widget/v1/?mode=search&text=%D0%90%D0%97%D0%A1";
const FALLBACK_URL =
  "https://yandex.ru/maps/?mode=search&text=%D0%90%D0%97%D0%A1";

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
      <div className="mx-auto max-w-md px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>

          <div className="min-w-0 flex-1">
            <div className="text-[13px] text-zinc-500 leading-none">Сервисы</div>
            <div className="text-[17px] font-semibold leading-tight truncate">Заправка</div>
          </div>

          <IconButton aria="external" onClick={() => window.open(FALLBACK_URL, "_blank", "noopener,noreferrer")}>
            <ExternalLink size={18} />
          </IconButton>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-4 py-4">
            <div className="text-[12px] uppercase tracking-[0.18em] text-zinc-500">Интегрированная карта</div>
            <div className="mt-1 text-[18px] font-semibold text-zinc-900">АЗС рядом с вами</div>
            <div className="mt-1 text-[13px] text-zinc-500">
              Внутри приложения открыта карта Яндекс с поиском ближайших заправок.
            </div>
          </div>

          <div className="relative min-h-[calc(100dvh-220px)] bg-zinc-100">
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
              className="h-[calc(100dvh-220px)] min-h-[540px] w-full"
              style={{ border: "none" }}
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-zinc-200 px-4 py-4">
            <button
              onClick={() => window.open(FALLBACK_URL, "_blank", "noopener,noreferrer")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#183A35] px-4 py-3 text-sm font-medium text-white"
            >
              <LocateFixed size={16} />
              Открыть в Яндекс
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
