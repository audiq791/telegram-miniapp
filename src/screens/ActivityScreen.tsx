"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Repeat, ChevronRight } from "lucide-react";
import { IconButton } from "../components/ui";
import { useState } from "react";
import { partnersSeed } from "../data/partners";

type Transaction = {
  id: string;
  type: "spend" | "receive" | "exchange";
  amount: number;
  fromPartner?: string;  // для обмена
  toPartner?: string;    // для обмена
  partner?: string;      // для обычных операций
  date: string;
  status: "completed" | "pending";
};

// Демо-данные для истории
const demoTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 500,
    partner: "ВкусВилл",
    date: "14 фев 2026",
    status: "completed"
  },
  {
    id: "2",
    type: "spend",
    amount: 350,
    partner: "Додо Пицца",
    date: "13 фев 2026",
    status: "completed"
  },
  {
    id: "3",
    type: "exchange",
    amount: 200,
    fromPartner: "ЦСКА",
    toPartner: "Wildberries",
    date: "12 фев 2026",
    status: "completed"
  },
  {
    id: "4",
    type: "receive",
    amount: 1000,
    partner: "Cofix",
    date: "10 фев 2026",
    status: "completed"
  },
  {
    id: "5",
    type: "spend",
    amount: 150,
    partner: "Кофе",
    date: "9 фев 2026",
    status: "completed"
  },
  {
    id: "6",
    type: "exchange",
    amount: 300,
    fromPartner: "ВкусВилл",
    toPartner: "Додо Пицца",
    date: "8 фев 2026",
    status: "pending"
  },
];

// Функция для получения логотипа партнера
const getPartnerLogo = (partnerName: string) => {
  const partner = partnersSeed.find(p => 
    p.displayName === partnerName || p.name === partnerName
  );
  return partner?.logo || "";
};

// Функция для получения цвета партнера (на случай если нет лого)
const getPartnerColor = (partnerName: string) => {
  const partner = partnersSeed.find(p => 
    p.displayName === partnerName || p.name === partnerName
  );
  return partner?.fallbackColor || "from-gray-400 to-gray-600";
};

const getTypeIcon = (type: string) => {
  switch(type) {
    case "spend": return <ArrowUpRight size={16} className="text-red-500" />;
    case "receive": return <ArrowDownLeft size={16} className="text-green-500" />;
    case "exchange": return <Repeat size={16} className="text-blue-500" />;
    default: return null;
  }
};

const getTypeText = (type: string) => {
  switch(type) {
    case "spend": return "Списание";
    case "receive": return "Начисление";
    case "exchange": return "Обмен";
    default: return "";
  }
};

export default function ActivityScreen({ onBack }: { onBack: () => void }) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4">
        {/* Шапка */}
        <div className="flex items-center gap-3 mb-6">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div className="text-xl font-semibold">Активность</div>
        </div>

        {/* История операций */}
        <div className="space-y-3">
          <div className="text-sm text-zinc-500 px-1 mb-2">
            История операций
          </div>
          
          {demoTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4"
            >
              {tx.type === "exchange" ? (
                // Специальный дизайн для обмена - два логотипа с иконкой между
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* Первый партнер */}
                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                      {getPartnerLogo(tx.fromPartner || "") && !imageErrors.has(`from-${tx.id}`) ? (
                        <img 
                          src={getPartnerLogo(tx.fromPartner || "")} 
                          alt={tx.fromPartner}
                          className="w-full h-full object-contain p-1.5"
                          onError={() => handleImageError(`from-${tx.id}`)}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getPartnerColor(tx.fromPartner || "")}`} />
                      )}
                    </div>

                    {/* Иконка обмена по середине */}
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center -mx-1 z-10">
                      <Repeat size={12} className="text-blue-600" />
                    </div>

                    {/* Второй партнер */}
                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                      {getPartnerLogo(tx.toPartner || "") && !imageErrors.has(`to-${tx.id}`) ? (
                        <img 
                          src={getPartnerLogo(tx.toPartner || "")} 
                          alt={tx.toPartner}
                          className="w-full h-full object-contain p-1.5"
                          onError={() => handleImageError(`to-${tx.id}`)}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getPartnerColor(tx.toPartner || "")}`} />
                      )}
                    </div>

                    <div className="ml-2">
                      <div className="font-semibold flex items-center gap-1">
                        {getTypeText(tx.type)}
                        {getTypeIcon(tx.type)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {tx.fromPartner} → {tx.toPartner}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-blue-600">
                      {tx.amount} B
                    </div>
                    <div className="text-xs text-zinc-500">
                      {tx.date}
                    </div>
                  </div>
                </div>
              ) : (
                // Обычный дизайн для начислений и списаний
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Логотип партнера */}
                    <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                      {getPartnerLogo(tx.partner || "") && !imageErrors.has(tx.id) ? (
                        <img 
                          src={getPartnerLogo(tx.partner || "")} 
                          alt={tx.partner}
                          className="w-full h-full object-contain p-1.5"
                          onError={() => handleImageError(tx.id)}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getPartnerColor(tx.partner || "")}`} />
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {getTypeText(tx.type)}
                        {getTypeIcon(tx.type)}
                      </div>
                      <div className="text-xs text-zinc-500">{tx.partner}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-semibold ${
                      tx.type === "spend" ? "text-red-600" : "text-green-600"
                    }`}>
                      {tx.type === "spend" ? "-" : "+"}{tx.amount} B
                    </div>
                    <div className="text-xs text-zinc-500">{tx.date}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Кнопка загрузить еще */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-600 font-medium flex items-center justify-center gap-2"
        >
          Загрузить еще
          <ChevronRight size={16} className="rotate-90" />
        </motion.button>
      </div>
    </motion.div>
  );
}