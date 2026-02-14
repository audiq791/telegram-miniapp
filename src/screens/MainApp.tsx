"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Handshake,
  UserRound,
  HelpCircle,
  MoreHorizontal,
} from "lucide-react";

import { ActionCard, IconButton, PrimaryButton, TabButton } from "../components/ui";
import PartnersList from "../components/PartnersList";
import BlackScreen from "./BlackScreen";
import { partnersSeed, type Partner } from "../data/partners";

type Route =
  | { name: "home" }
  | { name: "blank"; title: string };

export default function MainApp() {
  const [tab, setTab] = useState<"wallet" | "market" | "partners" | "profile">("wallet");
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner>(partnersSeed[0]);
  
  // Стек истории для кнопки назад
  const [history, setHistory] = useState<Route[]>([{ name: "home" }]);

  const handleImageError = (partnerId: string) => {
    setFailedImages(prev => new Set(prev).add(partnerId));
  };

  // Функция выбора партнера
  const selectPartner = (partner: Partner) => {
    if (partner.id === selectedPartner.id) return;
    
    setSelectedPartner(partner);
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  // Форматирование денег
  const formatMoney = (n: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  };

  // ============================================
  // НАСТРОЙКА КНОПКИ НАЗАД TELEGRAM
  // ============================================
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    const updateBackButton = () => {
      if (history.length > 1) {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    };

    const handleBackClick = () => {
      tg.HapticFeedback.impactOccurred("light");
      
      if (history.length > 1) {
        const newHistory = [...history];
        newHistory.pop();
        const previousRoute = newHistory[newHistory.length - 1];
        
        setHistory(newHistory);
        setRoute(previousRoute);
        
        if (previousRoute.name === "home") {
          setTab("wallet");
        }
      }
    };

    tg.BackButton.onClick(handleBackClick);
    updateBackButton();

    return () => {
      tg.BackButton.offClick(handleBackClick);
    };
  }, [history]);

  const goBlank = (title: string) => {
    const newRoute: Route = { name: "blank", title };
    
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  const goHome = () => {
    setHistory([{ name: "home" }]);
    setRoute({ name: "home" });
    setTab("wallet");
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold shrink-0">
              B
            </div>
            <div className="min-w-0">
              <div className="text-[13px] text-zinc-500 leading-none">Биржа бонусов</div>
              <div className="text-[15px] font-semibold leading-tight truncate">
                {route.name === "blank"
                  ? route.title
                  : "Кошелёк"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton aria="help" onClick={() => {}}>
              <HelpCircle size={18} />
            </IconButton>
            <IconButton aria="more" onClick={() => {}}>
              <MoreHorizontal size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-md">
        <AnimatePresence mode="wait">
          {route.name === "home" ? (
            <motion.main
              key="home"
              className="px-4 pt-4 pb-28"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
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
                        {selectedPartner.name}
                      </motion.div>
                    </div>
                    
                    {/* КЛИКАБЕЛЬНЫЙ ЛОГОТИП */}
                    <motion.div
                      key={selectedPartner.id}
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="shrink-0 h-12 w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => {
                        // Соответствие id партнера и имени файла
                        const fileMap: { [key: string]: string } = {
                          vv: "vkusvill.txt",
                          dodo: "dodo.txt",
                          cska: "cska.txt",
                          wb: "wildberries.txt",
                          cofix: "cofix.txt",
                        };
                        
                        const fileName = fileMap[selectedPartner.id];
                        if (fileName) {
                          // Открываем в новой вкладке
                          window.open(`/partners/${fileName}`, '_blank');
                        }
                        
                        const tg = (window as any).Telegram?.WebApp;
                        tg?.HapticFeedback.impactOccurred("light");
                      }}
                    >
                      {selectedPartner.logo && !failedImages.has(selectedPartner.id) ? (
                        <img 
                          src={selectedPartner.logo} 
                          alt={selectedPartner.name}
                          className="w-full h-full object-contain p-1"
                          onError={() => handleImageError(selectedPartner.id)}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${selectedPartner.fallbackColor}`} />
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
                    <PrimaryButton label="Активность" onClick={() => goBlank("Активность")} />
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ActionCard label="Отправить" hint="Перевод" kind="send" onClick={() => goBlank("Отправить")} />
                    <ActionCard label="Получить" hint="Входящие" kind="receive" onClick={() => goBlank("Получить")} />
                    <ActionCard label="Обменять" hint="Бонусы" kind="swap" onClick={() => goBlank("Обменять")} />
                    <ActionCard label="Списать" hint="Оплата" kind="spend" onClick={() => goBlank("Списать")} />
                  </div>
                </div>

                <div className="h-10 bg-gradient-to-b from-transparent to-zinc-50" />
              </motion.div>

              {/* PARTNERS LIST */}
              <PartnersList
                partners={partnersSeed}
                selectedPartner={selectedPartner}
                onSelectPartner={selectPartner}
                failedImages={failedImages}
                onImageError={handleImageError}
                formatMoney={formatMoney}
                onOpenBlank={goBlank}
              />

            </motion.main>
          ) : (
            <BlackScreen 
              key="blank" 
              title={route.title} 
              onBack={goHome}
            />
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM NAV */}
      {route.name === "home" && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
            <TabButton
              active={tab === "wallet"}
              onClick={() => {
                setTab("wallet");
                goBlank("Кошелёк");
              }}
              label="Кошелёк"
              icon={<WalletCards size={18} strokeWidth={1.9} />}
            />
            <TabButton
              active={tab === "market"}
              onClick={() => {
                setTab("market");
                goBlank("Маркет");
              }}
              label="Маркет"
              icon={<ShoppingBag size={18} strokeWidth={1.9} />}
            />
            <TabButton
              active={tab === "partners"}
              onClick={() => {
                setTab("partners");
                goBlank("Партнёры");
              }}
              label="Партнёры"
              icon={<Handshake size={18} strokeWidth={1.9} />}
            />
            <TabButton
              active={tab === "profile"}
              onClick={() => {
                setTab("profile");
                goBlank("Профиль");
              }}
              label="Профиль"
              icon={<UserRound size={18} strokeWidth={1.9} />}
            />
          </div>
        </nav>
      )}
    </div>
  );
}