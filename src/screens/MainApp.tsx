"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Handshake,
  UserRound,
  Search,
  HelpCircle,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

import { ActionCard, IconButton, PrimaryButton, TabButton } from "../components/ui";
import BlackScreen from "./BlackScreen";

type Partner = {
  id: string;
  name: string;
  balance: number;
  unit: string;
  logo: string;
  fallbackColor: string;
};

// Генерируем случайные балансы для первых 5 партнеров
const generateRandomBalance = () => Math.floor(Math.random() * 5000) + 100;

const partnersSeed: Partner[] = [
  // ПРИОРИТЕТНЫЕ ПАРТНЕРЫ (со случайными балансами)
  { 
    id: "vv", 
    name: "ВкусВилл", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/vkusvill.svg",
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
  { 
    id: "dodo", 
    name: "DODO PIZZA", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/dodo.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "cska", 
    name: "CSKA", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/cska.svg",
    fallbackColor: "from-blue-400 to-blue-600" 
  },
  { 
    id: "wb", 
    name: "Wildberries", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/wildberries.svg",
    fallbackColor: "from-purple-400 to-purple-600" 
  },
  { 
    id: "cofix", 
    name: "Cofix", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/cofix.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  
  // ОСТАЛЬНЫЕ ПАРТНЕРЫ (с нулевыми балансами)
  { 
    id: "fuel", 
    name: "FUEL", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-fuchsia-500 to-indigo-500" 
  },
  { 
    id: "magnolia", 
    name: "Магнолия", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-lime-400 to-green-600" 
  },
  { 
    id: "piligrim", 
    name: "Пилигрим", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-sky-500 to-blue-700" 
  },
  { 
    id: "cafe12", 
    name: "12 Grand Cafe", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-zinc-700 to-zinc-900" 
  },
  { 
    id: "airo", 
    name: "AIRO", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-slate-600 to-slate-900" 
  },
  { 
    id: "baba", 
    name: "Баба Марта", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-rose-400 to-rose-600" 
  },
  { 
    id: "shashlyk", 
    name: "Шашлычный Дворик", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-orange-400 to-orange-600" 
  },
  { 
    id: "little", 
    name: "Little Caesars Pizza", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/littlecaesars.svg",
    fallbackColor: "from-yellow-400 to-yellow-600" 
  },
  { 
    id: "cecenco", 
    name: "ČEČENCO", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-amber-400 to-amber-600" 
  },
  { 
    id: "coffee", 
    name: "Coffee Bean", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/coffeebean.svg",
    fallbackColor: "from-brown-400 to-brown-600" 
  },
  { 
    id: "dobro", 
    name: "Добро", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-green-400 to-green-600" 
  },
  { 
    id: "ecomarket", 
    name: "Еcomarket", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-teal-400 to-teal-600" 
  },
  { 
    id: "everon", 
    name: "Эверон", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-cyan-400 to-cyan-600" 
  },
  { 
    id: "fly", 
    name: "FLY", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-sky-400 to-sky-600" 
  },
  { 
    id: "gcoin", 
    name: "G-coin", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-indigo-400 to-indigo-600" 
  },
  { 
    id: "halal", 
    name: "Halal Guide", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
  { 
    id: "italian", 
    name: "Итальянец", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-stone-400 to-stone-600" 
  },
  { 
    id: "ku", 
    name: "[KU:] Ramen", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-zinc-400 to-zinc-600" 
  },
  { 
    id: "lpg", 
    name: "LPG", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-purple-400 to-purple-600" 
  },
  { 
    id: "moscow", 
    name: "Moscow Coffee & Food", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-pink-400 to-pink-600" 
  },
  { 
    id: "mpr", 
    name: "МПР", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-gray-400 to-gray-600" 
  },
  { 
    id: "mymy", 
    name: "МУ-МУ", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-slate-400 to-slate-600" 
  },
  { 
    id: "oneprice", 
    name: "OnePriceCoffee", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-amber-400 to-amber-600" 
  },
  { 
    id: "papajohns", 
    name: "Папа Джонс", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/papajohns.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "pomidorka", 
    name: "Помидорка", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-rose-400 to-rose-600" 
  },
  { 
    id: "promille", 
    name: "0.5 Промилле", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-blue-400 to-blue-600" 
  },
  { 
    id: "salvatore", 
    name: "Остерия У Сальваторе", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-stone-400 to-stone-600" 
  },
  { 
    id: "sandwich", 
    name: "Sandwich Hunters", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-yellow-400 to-yellow-600" 
  },
  { 
    id: "shawarma", 
    name: "Shawarma Bar", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-orange-400 to-orange-600" 
  },
  { 
    id: "shuval", 
    name: "Шуваловская", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-teal-400 to-teal-600" 
  },
  { 
    id: "sparta", 
    name: "Sparta Gyros", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-green-400 to-green-600" 
  },
  { 
    id: "yoda", 
    name: "Yoda Thai Food", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-pink-400 to-pink-600" 
  },
  { 
    id: "zakyat", 
    name: "Закят", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

type Route =
  | { name: "home" }
  | { name: "blank"; title: string };

export default function MainApp() {
  const [tab, setTab] = useState<"wallet" | "market" | "partners" | "profile">("wallet");
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [query, setQuery] = useState("");
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedPartner, setSelectedPartner] = useState<Partner>(partnersSeed[0]);
  const [showAllPartners, setShowAllPartners] = useState(false);
  
  // Стек истории для кнопки назад
  const [history, setHistory] = useState<Route[]>([{ name: "home" }]);

  const partners = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return partnersSeed;
    return partnersSeed.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

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
                  : tab === "wallet"
                    ? "Кошелёк"
                    : tab === "market"
                      ? "Маркет"
                      : tab === "partners"
                        ? "Партнёры"
                        : "Профиль"}
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
                    
                    <motion.div
                      key={selectedPartner.id}
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="shrink-0 h-12 w-12 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden"
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
                    <PrimaryButton label="Пополнить" onClick={() => goBlank("Пополнить")} />
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

              {/* SEARCH */}
              <div className="mt-4">
                <div className="h-12 rounded-2xl bg-white border border-zinc-200 px-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-zinc-900/10">
                  <Search size={18} className="text-zinc-400 shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск партнёра…"
                    className="w-full h-full outline-none bg-transparent text-[15px]"
                  />
                </div>
              </div>

              {/* PARTNERS */}
              <div className="mt-3">
                {/* Заголовок "Мои Бонусы" */}
                <div className="text-sm text-zinc-500 px-1 mb-2">
                  Мои Бонусы
                </div>

                {/* Первые 5 партнеров всегда видны */}
                <div className="space-y-2">
                  {partners.slice(0, 5).map((p) => (
                    <motion.button
                      key={p.id}
                      onClick={() => selectPartner(p)}
                      whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
                      transition={{ type: "spring", stiffness: 700, damping: 40 }}
                      className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 flex items-center justify-between gap-3 text-left hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 h-11 w-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                          {p.logo && !failedImages.has(p.id) ? (
                            <img 
                              src={p.logo} 
                              alt={p.name}
                              className="w-full h-full object-contain p-1"
                              onError={() => handleImageError(p.id)}
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${p.fallbackColor}`} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{p.name}</div>
                          <div className="text-xs text-zinc-500">Баланс: {formatMoney(p.balance)} {p.unit}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-semibold">{formatMoney(p.balance)}</div>
                          <div className="text-xs text-zinc-500">{p.unit}</div>
                        </div>
                        <ChevronRight size={18} className="text-zinc-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Кнопка "Все партнеры" - выпадающий список */}
                <div className="mt-2">
                  <motion.button
                    onClick={() => setShowAllPartners(!showAllPartners)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-4 flex items-center justify-between text-left hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-zinc-100 text-zinc-600 grid place-items-center">
                        <Search size={18} />
                      </div>
                      <div>
                        <div className="font-semibold">Все партнеры</div>
                        <div className="text-xs text-zinc-500">{partners.length - 5} партнеров</div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: showAllPartners ? 270 : 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight size={20} className="text-zinc-400" />
                    </motion.div>
                  </motion.button>

                  {/* Выпадающий список со всеми партнерами */}
                  <AnimatePresence>
                    {showAllPartners && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-2">
                          {partners.slice(5).map((p) => (
                            <motion.button
                              key={p.id}
                              onClick={() => selectPartner(p)}
                              whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
                              transition={{ type: "spring", stiffness: 700, damping: 40 }}
                              className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 flex items-center justify-between gap-3 text-left hover:shadow-md"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="shrink-0 h-11 w-11 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden">
                                  {p.logo && !failedImages.has(p.id) ? (
                                    <img 
                                      src={p.logo} 
                                      alt={p.name}
                                      className="w-full h-full object-contain p-1"
                                      onError={() => handleImageError(p.id)}
                                    />
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${p.fallbackColor}`} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold truncate">{p.name}</div>
                                  <div className="text-xs text-zinc-500">Баланс: {formatMoney(p.balance)} {p.unit}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <div className="font-semibold">{formatMoney(p.balance)}</div>
                                  <div className="text-xs text-zinc-500">{p.unit}</div>
                                </div>
                                <ChevronRight size={18} className="text-zinc-400" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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