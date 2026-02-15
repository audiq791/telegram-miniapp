"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Handshake,
  UserRound,
} from "lucide-react";

import { TabButton } from "../components/ui";
import WalletScreen from "./WalletScreen";
import MarketScreen from "./MarketScreen";
import ServicesScreen from "./ServicesScreen";
import ProfileScreen from "./ProfileScreen";
import BlackScreen from "./BlackScreen";
import PartnerSiteScreen from "./PartnerSiteScreen";
import InfoModal from "../modals/InfoModal";
import MoreMenu from "../modals/MoreMenu";
import { partnersSeed, type Partner } from "../data/partners";

type Route =
  | { name: "wallet" }
  | { name: "market" }
  | { name: "services" }
  | { name: "profile" }
  | { name: "blank"; title: string }
  | { name: "partner-site"; url: string; title: string; logo: string; fallbackColor: string };

export default function MainApp() {
  const [currentTab, setCurrentTab] = useState<"wallet" | "market" | "services" | "profile">("wallet");
  const [route, setRoute] = useState<Route>({ name: "wallet" });
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner>(partnersSeed[0]);
  
  // Стек истории для кнопки назад
  const [history, setHistory] = useState<Route[]>([{ name: "wallet" }]);

  // Состояния для модальных окон
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleImageError = (partnerId: string) => {
    setFailedImages(prev => new Set(prev).add(partnerId));
  };

  // Функция выбора партнера
  const selectPartner = (partner: Partner) => {
    if (partner.id === selectedPartner.id) return;
    setSelectedPartner(partner);
  };

  // Форматирование денег
  const formatMoney = (n: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  };

  // Обработчики
  const handleSend = (data: { recipient: string; partner: string; amount: number }) => {
    alert(`Перевод ${data.amount} B для ${data.recipient} (${data.partner})`);
  };

  const handleSwap = (data: { fromPartner: string; toPartner: string; amount: number }) => {
    alert(`Обмен ${data.amount} B с ${data.fromPartner} на ${data.toPartner}`);
  };

  // Настройка кнопки назад Telegram
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
      if (history.length > 1) {
        const newHistory = [...history];
        newHistory.pop();
        const previousRoute = newHistory[newHistory.length - 1];
        
        setHistory(newHistory);
        setRoute(previousRoute);
        
        // Обновляем текущий таб если вернулись на главный экран
        if (previousRoute.name === "wallet") setCurrentTab("wallet");
        if (previousRoute.name === "market") setCurrentTab("market");
        if (previousRoute.name === "services") setCurrentTab("services");
        if (previousRoute.name === "profile") setCurrentTab("profile");
      }
    };

    tg.BackButton.onClick(handleBackClick);
    updateBackButton();

    return () => {
      tg.BackButton.offClick(handleBackClick);
    };
  }, [history]);

  // Переходы
  const goToTab = (tab: "wallet" | "market" | "services" | "profile") => {
    const newRoute: Route = { name: tab };
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
    setCurrentTab(tab);
  };

  const goBlank = (title: string) => {
    const newRoute: Route = { name: "blank", title };
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
  };

  const goToPartnerSite = (url: string, title: string, logo: string, fallbackColor: string) => {
    const newRoute: Route = { name: "partner-site", url, title, logo, fallbackColor };
    setHistory(prev => [...prev, newRoute]);
    setRoute(newRoute);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    const previousRoute = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setRoute(previousRoute);
    if (previousRoute.name === "wallet") setCurrentTab("wallet");
    if (previousRoute.name === "market") setCurrentTab("market");
    if (previousRoute.name === "services") setCurrentTab("services");
    if (previousRoute.name === "profile") setCurrentTab("profile");
  };

  const goHome = () => {
    setHistory([{ name: "wallet" }]);
    setRoute({ name: "wallet" });
    setCurrentTab("wallet");
  };

  // Определяем, показывать ли нижнее меню (только на главных экранах)
  const showBottomNav = route.name === "wallet" || route.name === "market" || route.name === "services" || route.name === "profile";

  return (
    <div className="min-h-dvh bg-zinc-50">
      {/* Контент с AnimatePresence */}
      <div className={showBottomNav ? "pb-28" : ""}>
        <AnimatePresence mode="wait">
          {route.name === "wallet" && (
            <WalletScreen
              key="wallet"
              onOpenInfo={() => setIsInfoModalOpen(true)}
              onOpenMore={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              onOpenBlank={goBlank}
              onOpenPartnerSite={goToPartnerSite}
              selectedPartner={selectedPartner}
              onSelectPartner={selectPartner}
              failedImages={failedImages}
              onImageError={handleImageError}
              formatMoney={formatMoney}
              isSendModalOpen={isSendModalOpen}
              setIsSendModalOpen={setIsSendModalOpen}
              isReceiveModalOpen={isReceiveModalOpen}
              setIsReceiveModalOpen={setIsReceiveModalOpen}
              isSwapModalOpen={isSwapModalOpen}
              setIsSwapModalOpen={setIsSwapModalOpen}
              handleSend={handleSend}
              handleSwap={handleSwap}
            />
          )}

          {route.name === "market" && (
            <MarketScreen key="market" onBack={goBack} />
          )}

          {route.name === "services" && (
            <ServicesScreen key="services" onBack={goBack} />
          )}

          {route.name === "profile" && (
            <ProfileScreen key="profile" onBack={goBack} />
          )}

          {route.name === "blank" && (
            <BlackScreen 
              key="blank" 
              title={route.title} 
              onBack={goBack}
            />
          )}

          {route.name === "partner-site" && (
            <PartnerSiteScreen
              key="partner-site"
              url={route.url}
              title={route.title}
              logo={route.logo}
              fallbackColor={route.fallbackColor}
              onBack={goBack}
              onHome={goHome}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Нижнее меню - показываем только на главных экранах */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
              <TabButton
                active={currentTab === "wallet"}
                onClick={() => goToTab("wallet")}
                label="Кошелёк"
                icon={<WalletCards size={18} strokeWidth={1.9} />}
              />
              <TabButton
                active={currentTab === "market"}
                onClick={() => goToTab("market")}
                label="Маркет"
                icon={<ShoppingBag size={18} strokeWidth={1.9} />}
              />
              <TabButton
                active={currentTab === "services"}
                onClick={() => goToTab("services")}
                label="Сервисы"
                icon={<Handshake size={18} strokeWidth={1.9} />}
              />
              <TabButton
                active={currentTab === "profile"}
                onClick={() => goToTab("profile")}
                label="Профиль"
                icon={<UserRound size={18} strokeWidth={1.9} />}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Модальные окна (всегда поверх) */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <MoreMenu
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
      />
    </div>
  );
}