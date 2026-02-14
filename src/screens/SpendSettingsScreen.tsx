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
import { useState, useEffect } from "react";
import { IconButton } from "../components/ui";
import { partnersSeed } from "../data/partners";

// Фиксированный адрес кошелька
const WALLET_ADDRESS = "UQA754XVVal-AHWEwK8t8YzSvGttHiDt1XoUzpY-2XFQWaTN";

type SpendSettingsScreenProps = {
  onBack: () => void;
};

export default function SpendSettingsScreen({ onBack }: SpendSettingsScreenProps) {
  const [selectedMode, setSelectedMode] = useState<"auto" | "selected" | "manual">(() => {
    // Загружаем сохраненные настройки при инициализации
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
  
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Доступные партнеры (первые 5)
  const availablePartners = partnersSeed.slice(0, 5);

  // Автоматическое сохранение при любых изменениях
  useEffect(() => {
    const settings = {
      mode: selectedMode,
      selectedPartners: selectedMode === "selected" ? selectedPartners : []
    };
    
    localStorage.setItem('spendSettings', JSON.stringify(settings));
    
    // Показываем уведомление о сохранении
    setShowSaveNotification(true);
    const timer = setTimeout(() => setShowSaveNotification(false), 2000);
    
    // Логируем в консоль для отладки
    console.log("Настройки сохранены:", settings);
    
    return () => clearTimeout(timer);
  }, [selectedMode, selectedPartners]);

  // Выбор/отмена выбора партнера
  const togglePartner = (partnerId: string) => {
    setSelectedPartners(prev => 
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
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

  // Смена режима с автоматическим сохранением
  const handleModeChange = (mode: "auto" | "selected" | "manual") => {
    setSelectedMode(mode);
    // Если переключаемся на режим "selected", открываем список партнеров
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
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${
              selectedMode === "selected" ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-zinc-600" />
                    <h3 className="font-semibold">Автоматическое списание выбранных бонусов</h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Если эта функция включена, то при оплате картой будут списывать только бонусы выбранных вами партнеров.
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleModeChange("selected")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    selectedMode === "selected" ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                >
                  <motion.div
                    animate={{ x: selectedMode === "selected" ? 24 : 0 }}
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Выпадающий список партнеров */}
              <AnimatePresence>
                {selectedMode === "selected" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 space-y-3"
                  >
                    {/* Кнопка для открытия списка */}
                    <button
                      onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
                      className="w-full p-3 border border-zinc-200 rounded-xl flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors relative"
                    >
                      <span className="text-sm text-zinc-600">
                        {selectedPartners.length === 0 
                          ? "Выберите партнеров" 
                          : `Выбрано ${selectedPartners.length} партнеров`}
                      </span>
                      <ChevronDown size={16} className={`text-zinc-400 transition-transform ${showPartnerDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Выпадающий список */}
                    <div className="relative">
                      <AnimatePresence>
                        {showPartnerDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                            style={{ top: 0 }}
                          >
                            {availablePartners.map(partner => (
                              <button
                                key={partner.id}
                                onClick={() => togglePartner(partner.id)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors"
                              >
                                <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0">
                                  {partner.logo && (
                                    <img src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                                  )}
                                </div>
                                <span className="flex-1 text-left font-medium">{partner.displayName || partner.name}</span>
                                {selectedPartners.includes(partner.id) && (
                                  <Check size={16} className="text-green-500 shrink-0" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Выбранные партнеры */}
                    {selectedPartners.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availablePartners
                          .filter(p => selectedPartners.includes(p.id))
                          .map(partner => (
                            <div
                              key={partner.id}
                              className="px-3 py-1.5 bg-zinc-100 rounded-full text-xs flex items-center gap-1"
                            >
                              <span>{partner.displayName || partner.name}</span>
                              <button
                                onClick={() => togglePartner(partner.id)}
                                className="ml-1 text-zinc-500 hover:text-zinc-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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