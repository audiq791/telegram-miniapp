"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Fuel, LocateFixed, MapPinned, Navigation } from "lucide-react";
import { IconButton } from "../components/ui";

const stations = [
  { id: "1", name: "BON Fuel Север", x: "24%", y: "28%", price: "57.9 ₽", bonus: "+6%" },
  { id: "2", name: "BON Fuel Центр", x: "52%", y: "46%", price: "56.4 ₽", bonus: "+8%" },
  { id: "3", name: "BON Fuel Юг", x: "72%", y: "64%", price: "58.1 ₽", bonus: "+5%" },
];

export default function FuelMapScreen({ onBack }: { onBack: () => void }) {
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

          <div className="min-w-0">
            <div className="text-[13px] text-zinc-500 leading-none">Сервисы</div>
            <div className="text-[17px] font-semibold leading-tight truncate">Заправка</div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="relative h-[360px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_28%),linear-gradient(180deg,#eef7f2_0%,#e1efe7_100%)]">
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(24,58,53,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(24,58,53,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 360" preserveAspectRatio="none">
              <path
                d="M 10 106 C 80 74, 118 86, 178 126 C 228 160, 266 168, 350 152"
                fill="none"
                stroke="rgba(29,78,216,0.16)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 38 318 C 92 250, 132 226, 190 212 C 252 196, 294 170, 340 102"
                fill="none"
                stroke="rgba(15,118,110,0.15)"
                strokeWidth="22"
                strokeLinecap="round"
              />
              <path
                d="M 52 40 C 92 78, 118 126, 128 180 C 136 226, 120 270, 88 324"
                fill="none"
                stroke="rgba(34,197,94,0.12)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>

            <motion.div
              className="absolute left-[53%] top-[47%] z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20"
              animate={{ scale: [0.9, 1.5, 0.9], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              style={{ width: 110, height: 110 }}
            />

            {stations.map((station, index) => (
              <motion.div
                key={station.id}
                className="absolute z-[3] -translate-x-1/2 -translate-y-1/2"
                style={{ left: station.x, top: station.y }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex flex-col items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-[#183A35] text-white shadow-[0_14px_24px_rgba(24,58,53,0.22)]">
                    <Fuel size={20} />
                  </div>
                  <div className="mt-2 rounded-full border border-white/80 bg-white/92 px-3 py-1.5 text-[11px] font-medium text-zinc-700 shadow-sm">
                    {station.price}
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-4 left-4 right-4 z-[4] rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_34px_rgba(24,58,53,0.12)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.18em] text-emerald-700">Рядом с вами</div>
                  <div className="mt-1 text-[18px] font-semibold text-zinc-900">BON Fuel Центр</div>
                  <div className="mt-1 text-[13px] text-zinc-500">2.1 км • 56.4 ₽/л • бонусами выгоднее</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">
                  +8%
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#183A35] px-4 py-3 text-sm font-medium text-white">
                  <Navigation size={16} />
                  Построить маршрут
                </button>
                <button className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700">
                  <LocateFixed size={16} />
                  Найти рядом
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <MapPinned size={16} className="text-emerald-700" />
              Список станций
            </div>

            <div className="mt-3 grid gap-2">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-900">{station.name}</div>
                    <div className="text-xs text-zinc-500">95 • {station.price} • бонус {station.bonus}</div>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                    Открыто
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
