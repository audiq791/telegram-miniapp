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

const partnersSeed: Partner[] = [
  { 
    id: "vv", 
    name: "ВкусВилл", 
    balance: 1250.50, 
    unit: "B", 
    logo: "/logos/vkusvill.svg",
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
  { 
    id: "dodo", 
    name: "DODO PIZZA", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/dodo.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "cska", 
    name: "CSKA", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/cska.svg",
    fallbackColor: "from-blue-400 to-blue-600" 
  },
  { 
    id: "wb", 
    name: "Wildberries", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/wildberries.svg",
    fallbackColor: "from-purple-400 to-purple-600" 
  },
  { 
    id: "cofix", 
    name: "Cofix", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/cofix.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "fuel", 
    name: "FUEL", 
    balance: 2380.29, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-fuchsia-500 to-indigo-500" 
  },
  { 
    id: "magnolia", 
    name: "Магнолия", 
    balance: 158.14, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-lime-400 to-green-600" 
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
  
  const [history, setHistory] = useState<Route[]>([{ name: "home" }]);

  const partners = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return partnersSeed;
    return partnersSeed.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  const handleImageError = (partnerId: string) => {
    setFailedImages(prev => new Set(prev).add(partnerId));
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
  };

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold shrink-0">
              B
            </div>
            <div className="min-w-0">
              <div className="text-[13px] text-zinc-500 leading-none">Биржа бонусов</div>
              <div className="text-[15px] font-semibold leading-tight truncate">
                {route.name === "blank" ? route.title : "Кошелёк"}
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
              <div className="rounded-[28px] bg-white border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-500">Основной партнёр</div>
                      <div className="text-xl font-semibold mt-1 truncate">ВкусВилл</div>
                    </div>
                    <div className="shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm" />
                  </div>

                  <div className="mt-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs text-zinc-500">Баланс</div>
                      <div className="text-3xl font-semibold leading-none mt-1">
                        {formatMoney(0)} <span className="text-base font-medium text-zinc-500">B</span>
                      </div>
                    </div>
                    <PrimaryButton label="Пополнить" onClick={() => goBlank("Пополнить")} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <ActionCard label="Отправить" hint="Перевод" kind="send" onClick={() => goBlank("Отправить")} />
                    <ActionCard label="Получить" hint="Входящие" kind="receive" onClick={() => goBlank("Получить")} />
                    <ActionCard label="Обменять" hint="Бонусы" kind="swap" onClick={() => goBlank("Обменять")} />
                    <ActionCard label="Списать" hint="Оплата" kind="spend" onClick={() => goBlank("Списать")} />
                  </div>
                </div>

                <div className="h-10 bg-gradient-to-b from-transparent to-zinc-50" />
              </div>

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

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="text-sm text-zinc-500">Партнёры</div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 700, damping: 40 }}
                    onClick={() => goBlank("Все партнёры")}
                    className="text-sm font-semibold text-zinc-900"
                  >
                    Все
                  </motion.button>
                </div>

                {partners.map((p) => (
                  <motion.button
                    key={p.id}
                    onClick={() => goBlank(p.name)}
                    whileTap={{ scale: 0.985 }}
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
                        <div className="text-xs text-zinc-500">Нажмите, чтобы открыть</div>
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