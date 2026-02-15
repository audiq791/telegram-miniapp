"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type Partner } from "../data/partners";

type PartnersListProps = {
  partners: Partner[];
  selectedPartner: Partner;
  onSelectPartner: (partner: Partner) => void;
  failedImages: Set<string>;
  onImageError: (partnerId: string) => void;
  formatMoney: (n: number) => string;
  onOpenBlank: (title: string) => void;
};

export default function PartnersList({
  partners,
  selectedPartner,
  onSelectPartner,
  failedImages,
  onImageError,
  formatMoney,
}: PartnersListProps) {
  const [query, setQuery] = useState("");
  const [showAllPartners, setShowAllPartners] = useState(false);

  // Фильтруем партнеров по поиску
  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Первые 5 партнеров (с балансами) - всегда видны
  const topPartners = partners.slice(0, 5);
  
  // Остальные партнеры (с нулевыми балансами) - все 28 штук
  const otherPartners = partners.slice(5);

  return (
    <div>
      {/* SEARCH */}
      <div className="mt-4">
        <div className="h-12 rounded-2xl bg-white border border-zinc-200 px-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-zinc-900/10">
          <Search size={18} className="text-zinc-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск партнёра…"
            className="w-full h-full outline-none bg-transparent text-[15px]"
          />
        </div>
      </div>

      {/* PARTNERS */}
      <div className="mt-3">
        {/* Заголовок "Мои Бонусы" */}
        <div className="text-sm text-zinc-500 px-1 mb-2">
          Мои Бонусы
        </div>

        {/* Первые 5 партнеров всегда видны */}
        <div className="space-y-2">
          {topPartners.map((p) => (
            <PartnerItem
              key={p.id}
              partner={p}
              isSelected={selectedPartner.id === p.id}
              onSelect={onSelectPartner}
              failedImages={failedImages}
              onImageError={onImageError}
              formatMoney={formatMoney}
            />
          ))}
        </div>

        {/* Если есть остальные партнеры, показываем кнопку "Все партнеры" */}
        {otherPartners.length > 0 && (
          <div className="mt-2">
            <motion.button
              onClick={() => setShowAllPartners(!showAllPartners)}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 flex items-center justify-between text-left hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-zinc-600 grid place-items-center">
                  <Search size={18} />
                </div>
                <div>
                  <div className="font-semibold">Все партнеры</div>
                  <div className="text-xs text-zinc-500">{otherPartners.length} партнеров</div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showAllPartners ? 270 : 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} className="text-zinc-400" />
              </motion.div>
            </motion.button>

            {/* Выпадающий список со ВСЕМИ остальными партнерами */}
            <AnimatePresence>
              {showAllPartners && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="space-y-2 pt-2">
                    {otherPartners.map((p) => (
                      <PartnerItem
                        key={p.id}
                        partner={p}
                        isSelected={selectedPartner.id === p.id}
                        onSelect={onSelectPartner}
                        failedImages={failedImages}
                        onImageError={onImageError}
                        formatMoney={formatMoney}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Отдельный компонент для элемента партнера
function PartnerItem({
  partner,
  isSelected,
  onSelect,
  failedImages,
  onImageError,
  formatMoney,
}: {
  partner: Partner;
  isSelected: boolean;
  onSelect: (partner: Partner) => void;
  failedImages: Set<string>;
  onImageError: (partnerId: string) => void;
  formatMoney: (n: number) => string;
}) {
  return (
    <motion.button
      onClick={() => onSelect(partner)}
      whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
      transition={{ type: "spring", stiffness: 700, damping: 40 }}
      className={`w-full rounded-2xl border shadow-sm p-3 flex items-center justify-between gap-3 text-left hover:shadow-md ${
        isSelected 
          ? "bg-zinc-50 border-zinc-300" 
          : "bg-white border-zinc-200"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 h-11 w-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
          {partner.logo && !failedImages.has(partner.id) ? (
            <img 
              src={partner.logo} 
              alt={partner.displayName || partner.name}
              className="w-full h-full object-contain p-1"
              onError={() => onImageError(partner.id)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${partner.fallbackColor}`} />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{partner.displayName || partner.name}</div>
          <div className="text-xs text-zinc-500">{partner.category}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-xs text-zinc-500 mb-0.5">Баланс</div>
          <div className="font-semibold">
            {formatMoney(partner.balance)} <span className="text-sm font-medium text-zinc-500">B</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-zinc-400" />
      </div>
    </motion.button>
  );
}