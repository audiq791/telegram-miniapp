"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  CheckCircle, 
  Clock,
  ChevronRight,
  Search,
  Filter,
  X,
  Calendar
} from "lucide-react";
import { IconButton } from "../components/ui";
import { useState, useMemo } from "react";
import { partnersSeed } from "../data/partners";

type Transaction = {
  id: string;
  type: "spend" | "receive" | "exchange";
  amount: number;
  fromPartner?: string;
  toPartner?: string;
  partner?: string;
  date: string;
  timestamp: number;
  status: "completed" | "pending";
};

// Только первые 5 партнеров (с логотипами)
const topPartners = partnersSeed.slice(0, 5).map(p => p.displayName || p.name);

const operationTypes: Array<"spend" | "receive" | "exchange"> = ["spend", "receive", "exchange"];

const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 1, 14);

  for (let i = 1; i <= count; i++) {
    const type = operationTypes[Math.floor(Math.random() * operationTypes.length)];
    
    const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(randomTimestamp);
    const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).replace(' г.', '');

    if (type === "exchange") {
      let fromIndex = Math.floor(Math.random() * topPartners.length);
      let toIndex = Math.floor(Math.random() * topPartners.length);
      
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * topPartners.length);
      }

      transactions.push({
        id: `exchange-${i}`,
        type: "exchange",
        amount: Math.floor(Math.random() * 1000) + 100,
        fromPartner: topPartners[fromIndex],
        toPartner: topPartners[toIndex],
        date: formattedDate,
        timestamp: randomTimestamp,
        status: Math.random() > 0.1 ? "completed" : "pending"
      });
    } else {
      const partner = topPartners[Math.floor(Math.random() * topPartners.length)];
      
      transactions.push({
        id: `${type}-${i}`,
        type: type,
        amount: Math.floor(Math.random() * 2000) + 50,
        partner: partner,
        date: formattedDate,
        timestamp: randomTimestamp,
        status: Math.random() > 0.1 ? "completed" : "pending"
      });
    }
  }
  
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

const allTransactions = generateTransactions(30);

// Функция для получения логотипа партнера
const getPartnerLogo = (partnerName: string) => {
  const partner = partnersSeed.find(p => 
    p.displayName === partnerName || p.name === partnerName
  );
  return partner?.logo || "";
};

// Функция для получения цвета партнера
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
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  const handleImageError = (id: string) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  // Обработчик свайпа вправо
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onBack();
    }
  };

  // Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      if (selectedPartner !== "all") {
        if (tx.type === "exchange") {
          if (tx.fromPartner !== selectedPartner && tx.toPartner !== selectedPartner) return false;
        } else {
          if (tx.partner !== selectedPartner) return false;
        }
      }

      if (selectedType !== "all" && tx.type !== selectedType) return false;

      if (dateRange.start && dateRange.end) {
        const txDate = new Date(tx.timestamp);
        if (txDate < dateRange.start || txDate > dateRange.end) return false;
      }

      return true;
    });
  }, [selectedPartner, selectedType, dateRange]);

  const clearFilters = () => {
    setSelectedPartner("all");
    setSelectedType("all");
    setDateRange({ start: null, end: null });
  };

  const activeFiltersCount = [
    selectedPartner !== "all" ? 1 : 0,
    selectedType !== "all" ? 1 : 0,
    dateRange.start && dateRange.end ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto max-w-md px-4 pt-4 pb-6">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <IconButton aria="back" onClick={onBack}>
              <ArrowLeft size={18} />
            </IconButton>
            <div className="text-xl font-semibold">Активность</div>
          </div>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-zinc-500 flex items-center gap-1 hover:text-zinc-900 transition-colors"
            >
              <X size={16} />
              Сбросить ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Фильтры (упрощенные для демо) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedType === "all" 
                ? "bg-zinc-900 text-white" 
                : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setSelectedType("receive")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedType === "receive" 
                ? "bg-green-600 text-white" 
                : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Начисления
          </button>
          <button
            onClick={() => setSelectedType("spend")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedType === "spend" 
                ? "bg-red-600 text-white" 
                : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Списания
          </button>
          <button
            onClick={() => setSelectedType("exchange")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedType === "exchange" 
                ? "bg-blue-600 text-white" 
                : "bg-white border border-zinc-200 text-zinc-600"
            }`}
          >
            Обмены
          </button>
        </div>

        {/* История операций */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-sm text-zinc-500">
              История операций
            </div>
            <div className="text-xs text-zinc-400">
              {filteredTransactions.length} из {allTransactions.length}
            </div>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 text-center">
              <Filter size={32} className="mx-auto text-zinc-300 mb-3" />
              <p className="text-sm text-zinc-500">Нет операций по выбранным фильтрам</p>
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-zinc-900 font-medium hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4"
              >
                {tx.type === "exchange" ? (
                  // Дизайн для обмена
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
            ))
          )}
        </div>

        {/* Кнопка загрузить еще */}
        {filteredTransactions.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-600 font-medium flex items-center justify-center gap-2"
          >
            Загрузить еще
            <ChevronRight size={16} className="rotate-90" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}