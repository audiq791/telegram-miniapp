"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  UserRound,
  HelpCircle,
  MoreHorizontal,
  Layers,
} from "lucide-react";

import { ActionCard, IconButton, PrimaryButton, TabButton } from "../components/ui";
import PartnersList from "../components/PartnersList";
import BlackScreen from "./BlackScreen";
import PartnerSiteScreen from "./PartnerSiteScreen";
import ServicesScreen from "./ServicesScreen";
import ProfileScreen from "./ProfileScreen";
import MarketScreen from "./MarketScreen"; // ← ДОБАВЛЕН ИМПОРТ
import SendModal from "../modals/SendModal";
import ReceiveModal from "../modals/ReceiveModal";
import SwapModal from "../modals/SwapModal";
import InfoModal from "../modals/InfoModal";
import MoreMenu from "../modals/MoreMenu";
import { partnersSeed, type Partner } from "../data/partners";

type Route =
  | { name: "home" }
  | { name: "blank"; title: string; fromTab: "wallet" | "market" | "services" | "profile" }
  | { name: "partner-site"; url: string; title: string; logo: string; fallbackColor: string };

export default function MainApp() {
  const [tab, setTab] = useState<"wallet" | "market" | "services" | "profile">("wallet");
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner>(partnersSeed[0]);
  
  const [history, setHistory] = useState<Route[]>([{ name: "home" }]);

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isKeyboard = window.innerHeight < 500;
      setKeyboardVisible(isKeyboard);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkPlatform = () => {
      const userAgent = window.navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(userAgent);
      setIsIOS(ios);
    };
    checkPlatform();
  }, []);

  const handleImageError = (partnerId: string) => {
    setFailedImages(prev => new Set(prev).add(partnerId));
  };

  const selectPartner = (partner: Partner) => {
    if (partner.id === selectedPartner.id) return;
    setSelectedPartner(partner);
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  const formatMoney = (n: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  };

  const handleSend = (data: { recipient: string; partner: string; amount: number }) => {
    console.log("Отправка:", data);
    alert(`Перевод ${data.amount} B для ${data.recipient} (${data.partner})`);
  };

  const handleSwap = (data: { fromPartner: string; toPartner: string; amount: number }) => {
    console.log("Обмен:", data);
    alert(`Обмен ${data.amount} B с ${data.fromPartner} на ${data.toPartner}`);
  };

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
    const newRoute: Route = { 
      name: "blank", 
      title, 
      fromTab: tab
    };
    
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  const goToPartnerSite = (url: string, title: string, logo: string, fallbackColor: string) => {
    const newRoute: Route = { name: "partner-site", url, title, logo, fallbackColor };
    
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  const goBack = () => {
    if (history.length <= 1) return;
    
    const newHistory = [...history];
    newHistory.pop();
    const previousRoute = newHistory[newHistory.length - 1];
    
    setHistory(newHistory);
    setRoute(previousRoute);
    
    if (previousRoute.name === "home") {
      const lastBlank = [...history].reverse().find(r => r.name === "blank") as 
        | { name: "blank"; fromTab: "wallet" | "market" | "services" | "profile" }
        | undefined;
      
      if (lastBlank) {
        setTab(lastBlank.fromTab);
      } else {
        setTab("wallet");
      }
    }
  };

  const goHome = () => {
    setHistory([{ name: "home" }]);
    setRoute({ name: "home" });
    setTab("wallet");
    
    const tg = (window as any).Telegram?.WebApp;
    tg?.HapticFeedback.impactOccurred("light");
  };

  const showNavbar = route.name === "home";

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
                {route.name === "blank" || route.name === "partner-site"
                  ? route.title
                  : tab === "wallet"
                    ? "Кошелёк"
                    : tab === "market"
                      ? "Маркет"
                      : tab === "services"
                        ? "Сервисы"
                        : "Профиль"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton 
              aria="help" 
              onClick={() => {
                const tg = (window as any).Telegram?.WebApp;
                tg?.HapticFeedback.impactOccurred("light");
                setIsInfoModalOpen(true);
              }}
            >
              <HelpCircle size={18} />
            </IconButton>
            <IconButton 
              aria="more" 
              onClick={() => {
                const tg = (window as any).Telegram?.WebApp;
                tg?.HapticFeedback.impactOccurred("light");
                setIsMoreMenuOpen(!isMoreMenuOpen);
              }}
            >
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
              key={tab}
              className="px-4 pt-4 pb-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* Кошелек */}
              {tab === "wallet" && (
                <>
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
                              goToPartnerSite(
                                url, 
                                selectedPartner.displayName || selectedPartner.name, 
                                selectedPartner.logo, 
                                selectedPartner.fallbackColor
                              );
                            }
                            
                            const tg = (window as any).Telegram?.WebApp;
                            tg?.HapticFeedback.impactOccurred("light");
                          }}
                        >
                          {selectedPartner.logo && !failedImages.has(selectedPartner.id) ? (
                            <img 
                              src={selectedPartner.logo} 
                              alt={selectedPartner.displayName || selectedPartner.name}
                              className="w-full h-full object-contain p-1"
                              onError={() => handleImageError(selectedPartner.id)}
                            />
                          ) : (
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
                          onClick={() => {
                            const tg = (window as any).Telegram?.WebApp;
                            tg?.HapticFeedback.impactOccurred("light");
                            goBlank("Активность");
                          }} 
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <ActionCard label="Отправить" hint="Перевод" kind="send" onClick={() => setIsSendModalOpen(true)} />
                        <ActionCard label="Получить" hint="Входящие" kind="receive" onClick={() => setIsReceiveModalOpen(true)} />
                        <ActionCard label="Обменять" hint="Бонусы" kind="swap" onClick={() => setIsSwapModalOpen(true)} />
                        <ActionCard label="Списать" hint="Оплата" kind="spend" onClick={() => goBlank("Списать")} />
                      </div>
                    </div>
                    <div className="h-2" />
                  </motion.div>

                  <PartnersList
                    partners={partnersSeed}
                    selectedPartner={selectedPartner}
                    onSelectPartner={selectPartner}
                    failedImages={failedImages}
                    onImageError={handleImageError}
                    formatMoney={formatMoney}
                    onOpenBlank={goBlank}
                  />
                </>
              )}

              {/* Маркет — ТЕПЕРЬ НАСТОЯЩИЙ */}
              {tab === "market" && (
                <MarketScreen onBack={goBack} />
              )}

              {/* Сервисы */}
              {tab === "services" && (
                <ServicesScreen onServiceClick={(title) => goBlank(title)} />
              )}

              {/* Профиль */}
              {tab === "profile" && (
                <ProfileScreen />
              )}
            </motion.main>
          ) : route.name === "blank" ? (
            <BlackScreen 
              key="blank" 
              title={route.title} 
              onBack={goBack}
            />
          ) : (
            <PartnerSiteScreen
              key="partner-site"
              url={route.url}
              title={route.title}
              logo={route.logo}
              fallbackColor={route.fallbackColor}
              onBack={goBack}
            />
          )}
        </AnimatePresence>
      </div>

      {/* НАВБАР */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200"
            style={{ 
              paddingBottom: isIOS ? "calc(env(safe-area-inset-bottom, 0px) + 14px)" : "0px",
            }}
          >
            <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
              <TabButton active={tab === "wallet"} onClick={() => setTab("wallet")} label="Кошелёк" icon={<WalletCards size={18} strokeWidth={1.9} />} />
              <TabButton active={tab === "market"} onClick={() => setTab("market")} label="Маркет" icon={<ShoppingBag size={18} strokeWidth={1.9} />} />
              <TabButton active={tab === "services"} onClick={() => setTab("services")} label="Сервисы" icon={<Layers size={18} strokeWidth={1.9} />} />
              <TabButton active={tab === "profile"} onClick={() => setTab("profile")} label="Профиль" icon={<UserRound size={18} strokeWidth={1.9} />} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* МОДАЛЬНЫЕ ОКНА */}
      <SendModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} onSend={handleSend} currentBalance={selectedPartner.balance} />
      <ReceiveModal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} />
      <SwapModal isOpen={isSwapModalOpen} onClose={() => setIsSwapModalOpen(false)} onSwap={handleSwap} currentBalance={selectedPartner.balance} selectedPartner={selectedPartner} />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
      <MoreMenu isOpen={isMoreMenuOpen} onClose={() => setIsMoreMenuOpen(false)} />
    </div>
  );
}