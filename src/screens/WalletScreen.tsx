"use client";

import { motion } from "framer-motion";
import {
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";

import { ActionCard, IconButton, PrimaryButton } from "../components/ui";
import PartnersList from "../components/PartnersList";
import SendModal from "../modals/SendModal";
import ReceiveModal from "../modals/ReceiveModal";
import SwapModal from "../modals/SwapModal";
import { partnersSeed, type Partner } from "../data/partners";
import { useNonMaxiPhone } from "../hooks/useNonMaxiPhone";

type WalletScreenProps = {
  onOpenInfo: () => void;
  onOpenMore: () => void;
  onOpenBlank: (title: string) => void;
  onOpenPartnerSite: (url: string, title: string, logo: string, fallbackColor: string) => void;
  selectedPartner: Partner;
  onSelectPartner: (partner: Partner) => void;
  failedImages: Set<string>;
  onImageError: (partnerId: string) => void;
  formatMoney: (n: number) => string;
  isSendModalOpen: boolean;
  setIsSendModalOpen: (open: boolean) => void;
  isReceiveModalOpen: boolean;
  setIsReceiveModalOpen: (open: boolean) => void;
  isSwapModalOpen: boolean;
  setIsSwapModalOpen: (open: boolean) => void;
  handleSend: (data: any) => void;
  handleSwap: (data: any) => void;
};

export default function WalletScreen({
  onOpenInfo,
  onOpenMore,
  onOpenBlank,
  onOpenPartnerSite,
  selectedPartner,
  onSelectPartner,
  failedImages,
  onImageError,
  formatMoney,
  isSendModalOpen,
  setIsSendModalOpen,
  isReceiveModalOpen,
  setIsReceiveModalOpen,
  isSwapModalOpen,
  setIsSwapModalOpen,
  handleSend,
  handleSwap
}: WalletScreenProps) {
  const { isNonMaxiPhone, deviceModel } = useNonMaxiPhone();
  
  // Для отладки можно раскомментировать
  // console.log("Device model:", deviceModel, "isNonMax:", isNonMaxiPhone);

  return (
    <motion.div
      className={`min-h-dvh bg-zinc-50 ${isNonMaxiPhone ? 'iphone-non-max-scale' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold shrink-0">
              B
            </div>
            <div className="min-w-0">
              <div className="text-[13px] text-zinc-500 leading-none">Биржа бонусов</div>
              <div className="text-[15px] font-semibold leading-tight">Кошелёк</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton aria="help" onClick={onOpenInfo}>
              <HelpCircle size={18} />
            </IconButton>
            <IconButton aria="more" onClick={onOpenMore}>
              <MoreHorizontal size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-md px-4 pt-4 pb-28">
        {/* MAIN CARD */}
        <motion.div
          key={selectedPartner.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[28px] bg-white border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-zinc-500">Основной партнёр</div>
                <motion.div
                  key={selectedPartner.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-semibold mt-1 truncate"
                >
                  {selectedPartner.displayName || selectedPartner.name}
                </motion.div>
              </div>
              
              {/* КЛИКАБЕЛЬНЫЙ ЛОГОТИП */}
              <motion.div
                key={selectedPartner.id}
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                whileTap={{ scale: 0.9, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="shrink-0 h-12 w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer active:bg-zinc-50"
                onClick={() => {
                  const urlMap: { [key: string]: string } = {
                    vv: "https://m.vkusvill.ru",
                    dodo: "https://m.dodopizza.ru",
                    cska: "https://pfc-cska.com",
                    wb: "https://m.wildberries.ru",
                    cofix: "https://cofix.ru",
                  };
                  
                  const url = urlMap[selectedPartner.id];
                  if (url) {
                    onOpenPartnerSite(
                      url, 
                      selectedPartner.displayName || selectedPartner.name, 
                      selectedPartner.logo, 
                      selectedPartner.fallbackColor
                    );
                  }
                }}
              >
                {selectedPartner.logo && !failedImages.has(selectedPartner.id) ? (
                  <img 
                    src={selectedPartner.logo} 
                    alt={selectedPartner.displayName || selectedPartner.name}
                    className="w-full h-full object-contain p-1"
                    onError={() => onImageError(selectedPartner.id)}
                  />
                ) : (
                  // ИСПРАВЛЕНО: bg-gradient-to-br → bg-linear-to-br
                  <div className={`w-full h-full bg-linear-to-br ${selectedPartner.fallbackColor}`} />
                )}
              </motion.div>
            </div>

            <div className="mt-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-end justify-between gap-3">
              <div>
                <div className="text-xs text-zinc-500">Баланс</div>
                <motion.div
                  key={selectedPartner.balance}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-3xl font-semibold leading-none mt-1"
                >
                  {formatMoney(selectedPartner.balance)} <span className="text-base font-medium text-zinc-500">{selectedPartner.unit}</span>
                </motion.div>
              </div>
              <PrimaryButton 
                label="Активность" 
                onClick={() => onOpenBlank("Активность")} 
              />
            </div>

            {/* ACTIONS - 4 КНОПКИ */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ActionCard 
                label="Отправить" 
                hint="Перевод" 
                kind="send" 
                onClick={() => setIsSendModalOpen(true)} 
              />
              <ActionCard 
                label="Получить" 
                hint="Входящие" 
                kind="receive" 
                onClick={() => setIsReceiveModalOpen(true)} 
              />
              <ActionCard 
                label="Обменять" 
                hint="Бонусы" 
                kind="swap" 
                onClick={() => setIsSwapModalOpen(true)} 
              />
              <ActionCard 
                label="Списать" 
                hint="Оплата" 
                kind="spend" 
                onClick={() => onOpenBlank("Списать")} 
              />
            </div>
          </div>
          <div className="h-2" />
        </motion.div>

        {/* PARTNERS LIST */}
        <PartnersList
          partners={partnersSeed}
          selectedPartner={selectedPartner}
          onSelectPartner={onSelectPartner}
          failedImages={failedImages}
          onImageError={onImageError}
          formatMoney={formatMoney}
          onOpenBlank={onOpenBlank}
        />
      </div>

      {/* Модальные окна */}
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSend}
        currentBalance={selectedPartner.balance}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
      />

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        onSwap={handleSwap}
        currentBalance={selectedPartner.balance}
        selectedPartner={selectedPartner}
      />
    </motion.div>
  );
}