"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard,
  Layers,
  QrCode,
  Check,
  ChevronDown,
  Info,
  CheckCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { IconButton } from "../components/ui";
import { partnersSeed } from "../data/partners";

// Фиксированный адрес кошелька
const WALLET_ADDRESS = "UQA754XVVal-AHWEwK8t8YzSvGttHiDt1XoUzpY-2XFQWaTN";

type SpendSettingsScreenProps = {
  onBack: () => void;
};

// Функция форматирования баланса
const formatBalance = (balance: number) => {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
};

export default function SpendSettingsScreen({ onBack }: SpendSettingsScreenProps) {
  const [selectedMode, setSelectedMode] = useState<"auto" | "selected" | "manual">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spendSettings');
      return saved ? JSON.parse(saved).mode : "manual";
    }
    return "manual";
  });
  
  const [selectedPartners, setSelectedPartners] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spendSettings');
      return saved ? JSON.parse(saved).selectedPartners : [];
    }
    return [];
  });

  // Временное состояние для выбора в dropdown
  const [tempSelectedPartners, setTempSelectedPartners] = useState<string[]>([]);
  
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Доступные партнеры (первые 5) с балансами
  const availablePartners = partnersSeed.slice(0, 5).map(partner => ({
    ...partner,
    balance: partner.balance
  }));

  // Автоматическое сохранение
  useEffect(() => {
    const settings = {
      mode: selectedMode,
      selectedPartners: selectedMode === "selected" ? selectedPartners : []
    };
    
    localStorage.setItem('spendSettings', JSON.stringify(settings));
    
    setShowSaveNotification(true);
    const timer = setTimeout(() => setShowSaveNotification(false), 2000);
    
    return () => clearTimeout(timer);
  }, [selectedMode, selectedPartners]);

  // Обновление позиции dropdown
  useEffect(() => {
    if (showPartnerDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      
      // Инициализируем временное состояние текущими выбранными
      setTempSelectedPartners(selectedPartners);
    }
  }, [showPartnerDropdown, selectedPartners]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowPartnerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Выбор/отмена выбора партнера (временный)
  const toggleTempPartner = (partnerId: string) => {
    setTempSelectedPartners(prev => 
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  // Выбор всех
  const selectAllTemp = () => {
    setTempSelectedPartners(availablePartners.map(p => p.id));
  };

  // Очистка всех
  const clearAllTemp = () => {
    setTempSelectedPartners([]);
  };

  // Сохранение выбора
  const handleSaveSelection = () => {
    setSelectedPartners(tempSelectedPartners);
    setShowPartnerDropdown(false);
  };

  // Отмена выбора
  const handleCancelSelection = () => {
    setTempSelectedPartners(selectedPartners);
    setShowPartnerDropdown(false);
  };

  // Копирование адреса
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Смена режима
  const handleModeChange = (mode: "auto" | "selected" | "manual") => {
    setSelectedMode(mode);
    if (mode === "selected") {
      setShowPartnerDropdown(true);
    }
  };

  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4 pb-8">
        {/* Шапка */}
        <div className="flex items-center gap-3 mb-6">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div>
            <div className="text-[13px] text-zinc-500 leading-none">Настройки</div>
            <div className="text-xl font-semibold">Списание бонусов</div>
          </div>
        </div>

        {/* Уведомление о сохранении */}
        <AnimatePresence>
          {showSaveNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-green-50 rounded-xl flex items-center gap-2"
            >
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-700">Настройки сохранены</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Основной контент */}
        <div className="space-y-4">
          {/* Режим 1: Автоматическое списание всех */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
              selectedMode === "auto" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-zinc-600" />
                    <h3 className="font-semibold">Автоматическое списание всех бонусов</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Если эта функция включена, то при оплате картой, бонусы будут списываться автоматически у наших партнеров.
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleModeChange("auto")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    selectedMode === "auto" ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                >
                  <motion.div
                    animate={{ x: selectedMode === "auto" ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

         {/* Режим 2: Автоматическое списание выбранных */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className={`bg-white rounded-2xl border shadow-sm overflow-visible transition-colors ${
    selectedMode === "selected" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
  }`}
>
  <div className="p-4">
    <div className="flex items-start justify-between gap-4">
      {/* ... содержимое без изменений ... */}
    </div>

    {/* Контейнер с overflow-visible для dropdown */}
    <div className="relative mt-4">
      {/* Кнопка для открытия списка */}
      <button
        ref={buttonRef}
        onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
        className="w-full p-3 border border-zinc-200 rounded-xl flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors"
      >
        <span className="text-sm text-zinc-600">
          {selectedPartners.length === 0 
            ? "Выберите партнеров" 
            : `Выбрано ${selectedPartners.length} из ${availablePartners.length}`}
        </span>
        <motion.div
          animate={{ rotate: showPartnerDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-zinc-400" />
        </motion.div>
      </button>

      {/* Выпадающий список - теперь absolute внутри relative контейнера */}
      <AnimatePresence>
        {showPartnerDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden"
            style={{
              top: "100%",
              left: 0,
              marginTop: "4px",
              transformOrigin: "top"
            }}
          >
            {/* Заголовок списка */}
            <div className="sticky top-0 bg-white border-b border-zinc-100 p-3 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Выберите партнеров</span>
              <div className="flex gap-2">
                <button
                  onClick={selectAllTemp}
                  className="text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Все
                </button>
                <button
                  onClick={clearAllTemp}
                  className="text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Очистить
                </button>
              </div>
            </div>

            {/* Список партнеров */}
            <div className="max-h-60 overflow-y-auto p-2">
              {availablePartners.map((partner, index) => (
                <motion.button
                  key={partner.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => toggleTempPartner(partner.id)}
                  className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-zinc-50 transition-colors group"
                >
                  {/* Логотип */}
                  <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 overflow-hidden shadow-sm group-hover:shadow transition-shadow">
                    {partner.logo && (
                      <img src={partner.logo} alt="" className="w-full h-full object-contain p-1.5" />
                    )}
                  </div>

                  {/* Название и баланс */}
                  <div className="flex-1 text-left">
                    <div className="font-medium">{partner.displayName || partner.name}</div>
                    <div className="text-xs text-zinc-500">
                      Баланс: {formatBalance(partner.balance)} B
                    </div>
                  </div>

                  {/* Кастомный чекбокс */}
                  <div className="relative">
                    <motion.div
                      animate={tempSelectedPartners.includes(partner.id) ? "selected" : "unselected"}
                      variants={{
                        selected: { scale: 1, opacity: 1 },
                        unselected: { scale: 0.8, opacity: 0.6 }
                      }}
                      className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors"
                      style={{
                        borderColor: tempSelectedPartners.includes(partner.id) ? "#18181b" : "#e4e4e7",
                        backgroundColor: tempSelectedPartners.includes(partner.id) ? "#18181b" : "transparent"
                      }}
                    >
                      {tempSelectedPartners.includes(partner.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Кнопки Отмена и Сохранить */}
            <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-3 flex gap-2">
              <button
                onClick={handleCancelSelection}
                className="flex-1 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveSelection}
                className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Выбранные партнеры (чипсы) */}
      {selectedPartners.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-3"
        >
          {availablePartners
            .filter(p => selectedPartners.includes(p.id))
            .map(partner => (
              <motion.div
                key={partner.id}
                layout
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="px-3 py-1.5 bg-zinc-100 rounded-full text-xs flex items-center gap-1"
              >
                <span>{partner.displayName || partner.name}</span>
                <button
                  onClick={() => {
                    setSelectedPartners(prev => prev.filter(id => id !== partner.id));
                  }}
                  className="ml-1 w-4 h-4 rounded-full hover:bg-zinc-200 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  </div>
</motion.div>

          {/* Режим 3: Самостоятельное списание */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
              selectedMode === "manual" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-zinc-600" />
                    <h3 className="font-semibold">Самостоятельное списание бонусов</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Бонусы могут быть списаны только при предъявлении QR кода.
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleModeChange("manual")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    selectedMode === "manual" ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                >
                  <motion.div
                    animate={{ x: selectedMode === "manual" ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* QR-код и адрес */}
              <AnimatePresence>
                {selectedMode === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 space-y-4"
                  >
                    {/* QR-код */}
                    <div className="flex justify-center">
                      <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(WALLET_ADDRESS)}`}
                          alt="QR Code"
                          className="w-40 h-40"
                        />
                      </div>
                    </div>

                    {/* Адрес кошелька */}
                    <div className="space-y-2">
                      <div className="text-xs text-zinc-500 px-1">Адрес кошелька</div>
                      <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                        <div className="flex-1 font-mono text-xs truncate" title={WALLET_ADDRESS}>
                          {WALLET_ADDRESS}
                        </div>
                        <button
                          onClick={handleCopy}
                          className="h-8 px-3 rounded-lg bg-white border border-zinc-200 text-xs font-medium hover:bg-zinc-50 transition-colors flex items-center gap-1"
                        >
                          {copied ? (
                            <>
                              <Check size={14} className="text-green-500" />
                              <span>Скопировано</span>
                            </>
                          ) : (
                            "Копировать"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Информационное сообщение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-3 bg-blue-50 rounded-xl flex items-start gap-2"
          >
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Только один режим списания может быть активен одновременно. 
              Все изменения сохраняются автоматически.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}