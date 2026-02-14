"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  ChevronRight,
  ChevronDown,
  Calendar,
  Filter,
  X
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

// Генерируем 30 операций с разными партнерами (только те, у кого есть логотип)
const partnersWithLogos = partnersSeed.filter(p => p.logo);
const operationTypes: Array<"spend" | "receive" | "exchange"> = ["spend", "receive", "exchange"];

const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const startDate = new Date(2026, 0, 1); // 1 января 2026
  const endDate = new Date(2026, 1, 14); // 14 февраля 2026

  for (let i = 1; i <= count; i++) {
    const type = operationTypes[Math.floor(Math.random() * operationTypes.length)];
    const randomPartner = partnersWithLogos[Math.floor(Math.random() * partnersWithLogos.length)];
    const randomPartner2 = partnersWithLogos[Math.floor(Math.random() * partnersWithLogos.length)];
    
    // Случайная дата между startDate и endDate
    const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(randomTimestamp);
    
    const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).replace(' г.', '');

    if (type === "exchange") {
      transactions.push({
        id: `exchange-${i}`,
        type: "exchange",
        amount: Math.floor(Math.random() * 1000) + 100,
        fromPartner: randomPartner.displayName || randomPartner.name,
        toPartner: randomPartner2.displayName || randomPartner2.name,
        date: formattedDate,
        timestamp: randomTimestamp,
        status: Math.random() > 0.1 ? "completed" : "pending"
      });
    } else {
      transactions.push({
        id: `${type}-${i}`,
        type: type,
        amount: Math.floor(Math.random() * 2000) + 50,
        partner: randomPartner.displayName || randomPartner.name,
        date: formattedDate,
        timestamp: randomTimestamp,
        status: Math.random() > 0.1 ? "completed" : "pending"
      });
    }
  }
  
  // Сортируем по дате (сначала новые)
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

// Компонент фильтра по партнеру
const PartnerFilter = ({ 
  selectedPartner, 
  onPartnerChange,
  partners 
}: { 
  selectedPartner: string;
  onPartnerChange: (partner: string) => void;
  partners: typeof partnersSeed;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-all"
      >
        <span className="text-sm font-medium truncate">
          {selectedPartner === "all" ? "Все партнеры" : selectedPartner}
        </span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
          >
            <button
              onClick={() => {
                onPartnerChange("all");
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 transition-colors"
            >
              Все партнеры
            </button>
            {partnersWithLogos.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  onPartnerChange(p.displayName || p.name);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded bg-white border border-zinc-200 overflow-hidden">
                  {p.logo && (
                    <img src={p.logo} alt="" className="w-full h-full object-contain" />
                  )}
                </div>
                <span>{p.displayName || p.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Компонент фильтра по типу операции
const TypeFilter = ({ 
  selectedType, 
  onTypeChange 
}: { 
  selectedType: string;
  onTypeChange: (type: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const types = [
    { value: "all", label: "Все операции" },
    { value: "receive", label: "Начисления" },
    { value: "spend", label: "Списания" },
    { value: "exchange", label: "Обмены" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-all"
      >
        <span className="text-sm font-medium truncate">
          {types.find(t => t.value === selectedType)?.label}
        </span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg"
          >
            {types.map(t => (
              <button
                key={t.value}
                onClick={() => {
                  onTypeChange(t.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Компонент фильтра по дате
const DateFilter = ({ 
  dateRange, 
  onDateRangeChange 
}: { 
  dateRange: { start: Date | null; end: Date | null };
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState<Date | null>(dateRange.start);
  const [tempEnd, setTempEnd] = useState<Date | null>(dateRange.end);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const presets = [
    { label: "Неделя", days: 7 },
    { label: "Месяц", days: 30 },
    { label: "Квартал", days: 90 },
    { label: "Год", days: 365 },
  ];

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setTempStart(start);
    setTempEnd(end);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleApply = () => {
    onDateRangeChange({ start: tempStart, end: tempEnd });
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStart(null);
    setTempEnd(null);
    onDateRangeChange({ start: null, end: null });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 bg-white border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-2 text-sm font-medium truncate">
          <Calendar size={16} className="text-zinc-400" />
          <span>
            {dateRange.start && dateRange.end
              ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
              : "Все время"}
          </span>
        </div>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-96 mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg p-4 right-0"
          >
            {/* Быстрые пресеты */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presets.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset.days)}
                  className="px-3 py-2 bg-zinc-100 rounded-xl text-xs font-medium hover:bg-zinc-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Календарь (упрощенный) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  className="p-1 hover:bg-zinc-100 rounded-lg"
                >
                  ←
                </button>
                <span className="font-medium">
                  {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  className="p-1 hover:bg-zinc-100 rounded-lg"
                >
                  →
                </button>
              </div>

              {/* Поля для ручного ввода */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={tempStart ? formatDate(tempStart).split('.').reverse().join('-') : ''}
                  onChange={(e) => setTempStart(e.target.value ? new Date(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-sm"
                  placeholder="С"
                />
                <input
                  type="date"
                  value={tempEnd ? formatDate(tempEnd).split('.').reverse().join('-') : ''}
                  onChange={(e) => setTempEnd(e.target.value ? new Date(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-sm"
                  placeholder="По"
                />
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Сбросить
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Применить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

  // Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      // Фильтр по партнеру
      if (selectedPartner !== "all") {
        if (tx.type === "exchange") {
          if (tx.fromPartner !== selectedPartner && tx.toPartner !== selectedPartner) return false;
        } else {
          if (tx.partner !== selectedPartner) return false;
        }
      }

      // Фильтр по типу операции
      if (selectedType !== "all" && tx.type !== selectedType) return false;

      // Фильтр по дате
      if (dateRange.start && dateRange.end) {
        const txDate = new Date(tx.timestamp);
        if (txDate < dateRange.start || txDate > dateRange.end) return false;
      }

      return true;
    });
  }, [selectedPartner, selectedType, dateRange]);

  // Сброс фильтров
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
              Сбросить фильтры ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Фильтры */}
        <div className="space-y-2 mb-6">
          <PartnerFilter
            selectedPartner={selectedPartner}
            onPartnerChange={setSelectedPartner}
            partners={partnersSeed}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <TypeFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <DateFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
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
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}