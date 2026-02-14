"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronDown,
  ArrowLeftRight,
  Info,
  Repeat
} from "lucide-react";
import { useState, useEffect } from "react";
import { partnersSeed } from "../data/partners";

type SwapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwap: (data: { fromPartner: string; toPartner: string; amount: number }) => void;
  currentBalance?: number;
  selectedPartner?: typeof partnersSeed[0];
};

const COMMISSION = 0.02; // 2%

export default function SwapModal({ 
  isOpen, 
  onClose, 
  onSwap, 
  currentBalance = 1843,
  selectedPartner: initialPartner 
}: SwapModalProps) {
  const [step, setStep] = useState<"select" | "amount">("select");
  const [fromPartner, setFromPartner] = useState(initialPartner || partnersSeed[0]);
  const [toPartner, setToPartner] = useState(partnersSeed[1]);
  const [amount, setAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [swapDirection, setSwapDirection] = useState<"left" | "right">("left");

  // Доступные партнеры (только первые 5)
  const availablePartners = partnersSeed.slice(0, 5);

  // Анимация при смене шага
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setAmount("");
    }
  }, [isOpen]);

  // Меняем партнеров местами с анимацией
  const swapPartners = () => {
    setSwapDirection(prev => prev === "left" ? "right" : "left");
    setTimeout(() => {
      setFromPartner(toPartner);
      setToPartner(fromPartner);
    }, 150);
  };

  // Выбор партнера "Откуда"
  const handleSelectFrom = (partner: typeof partnersSeed[0]) => {
    if (partner.id === toPartner.id) {
      // Если выбрали того же, что и в "Куда", меняем местами
      setToPartner(fromPartner);
    }
    setFromPartner(partner);
    setShowFromDropdown(false);
  };

  // Выбор партнера "Куда"
  const handleSelectTo = (partner: typeof partnersSeed[0]) => {
    if (partner.id === fromPartner.id) {
      // Нельзя выбрать того же
      return;
    }
    setToPartner(partner);
    setShowToDropdown(false);
  };

  // Расчет комиссии
  const calculateCommission = () => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount * COMMISSION;
  };

  // Расчет получения
  const calculateReceive = () => {
    const numAmount = parseFloat(amount) || 0;
    const commission = numAmount * COMMISSION;
    return numAmount - commission;
  };

  // Расчет баланса после обмена
  const remainingFromBalance = currentBalance - (parseFloat(amount) || 0);
  const remainingToBalance = (parseFloat(amount) || 0) - calculateCommission();

  const handleSwap = () => {
    if (amount && fromPartner && toPartner) {
      onSwap({
        fromPartner: fromPartner.displayName || fromPartner.name,
        toPartner: toPartner.displayName || toPartner.name,
        amount: parseFloat(amount)
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h2 className="text-lg font-semibold">Обмен бонусов</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Контент */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "select" ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Заголовок */}
                    <div className="text-center">
                      <p className="text-sm text-zinc-600">
                        Выберите пару для обмена
                      </p>
                    </div>

                    {/* Партнеры для обмена */}
                    <div className="relative">
                      {/* Откуда */}
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-500 px-1">Откуда</div>
                        <div className="relative">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowFromDropdown(!showFromDropdown)}
                            className="w-full p-4 border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 overflow-hidden">
                                {fromPartner.logo && (
                                  <img src={fromPartner.logo} alt="" className="w-full h-full object-contain p-2" />
                                )}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{fromPartner.displayName || fromPartner.name}</div>
                                <div className="text-xs text-zinc-500">Баланс: {currentBalance} B</div>
                              </div>
                            </div>
                            <ChevronDown size={18} className={`text-zinc-400 transition-transform ${showFromDropdown ? 'rotate-180' : ''}`} />
                          </motion.button>

                          <AnimatePresence>
                            {showFromDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg"
                              >
                                {availablePartners.map(partner => (
                                  <button
                                    key={partner.id}
                                    onClick={() => handleSelectFrom(partner)}
                                    className="w-full p-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                                  >
                                    <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 overflow-hidden">
                                      {partner.logo && (
                                        <img src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                                      )}
                                    </div>
                                    <span className="font-medium">{partner.displayName || partner.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Кнопка обмена местами */}
                      <div className="flex justify-center my-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          animate={{ rotate: swapDirection === "right" ? 180 : 0 }}
                          onClick={swapPartners}
                          className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                        >
                          <ArrowLeftRight size={18} className="text-zinc-600" />
                        </motion.button>
                      </div>

                      {/* Куда */}
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-500 px-1">Куда</div>
                        <div className="relative">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowToDropdown(!showToDropdown)}
                            className="w-full p-4 border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 overflow-hidden">
                                {toPartner.logo && (
                                  <img src={toPartner.logo} alt="" className="w-full h-full object-contain p-2" />
                                )}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{toPartner.displayName || toPartner.name}</div>
                                <div className="text-xs text-zinc-500">Баланс: 0 B</div>
                              </div>
                            </div>
                            <ChevronDown size={18} className={`text-zinc-400 transition-transform ${showToDropdown ? 'rotate-180' : ''}`} />
                          </motion.button>

                          <AnimatePresence>
                            {showToDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg"
                              >
                                {availablePartners
                                  .filter(p => p.id !== fromPartner.id)
                                  .map(partner => (
                                    <button
                                      key={partner.id}
                                      onClick={() => handleSelectTo(partner)}
                                      className="w-full p-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                                    >
                                      <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 overflow-hidden">
                                        {partner.logo && (
                                          <img src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                                        )}
                                      </div>
                                      <span className="font-medium">{partner.displayName || partner.name}</span>
                                    </button>
                                  ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Информация о комиссии */}
                    <div className="p-3 bg-blue-50 rounded-2xl flex items-start gap-2">
                      <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700">
                        Комиссия за обмен составляет 2%. Минимальная сумма обмена - 10 B
                      </p>
                    </div>

                    {/* Кнопка продолжить */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("amount")}
                      className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-medium"
                    >
                      Продолжить
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Информация об обмене */}
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 overflow-hidden">
                            {fromPartner.logo && (
                              <img src={fromPartner.logo} alt="" className="w-full h-full object-contain p-2" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Отдаете</div>
                            <div className="font-medium">{fromPartner.displayName || fromPartner.name}</div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Repeat size={18} className="text-zinc-400" />
                        </motion.div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 overflow-hidden">
                            {toPartner.logo && (
                              <img src={toPartner.logo} alt="" className="w-full h-full object-contain p-2" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500">Получаете</div>
                            <div className="font-medium">{toPartner.displayName || toPartner.name}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Сумма обмена */}
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Сумма обмена</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`0 из ${currentBalance}`}
                          className="w-full p-4 pr-12 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/10 text-[15px] placeholder:text-zinc-300"
                          autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">B</span>
                      </div>
                    </div>

                    {/* Детали обмена */}
                    <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Комиссия (2%)</span>
                        <span className="font-medium text-zinc-900">{calculateCommission().toFixed(2)} B</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Вы получите</span>
                        <span className="font-medium text-blue-600">{calculateReceive().toFixed(2)} B</span>
                      </div>
                      <div className="border-t border-zinc-200 my-2" />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-600">Баланс {fromPartner.displayName}</span>
                          <span className={`font-medium ${remainingFromBalance < 0 ? 'text-red-600' : ''}`}>
                            {remainingFromBalance.toFixed(2)} B
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-zinc-600">Баланс {toPartner.displayName}</span>
                          <span className="font-medium text-green-600">
                            {(parseFloat(amount) ? remainingToBalance : 0).toFixed(2)} B
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep("select")}
                        className="flex-1 py-4 rounded-2xl border border-zinc-200 font-medium hover:bg-zinc-50 transition-colors"
                      >
                        Назад
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSwap}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                        className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white font-medium disabled:opacity-50 disabled:bg-zinc-300"
                      >
                        Обменять
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}