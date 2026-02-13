"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Handshake,
  UserRound,
  Send,
  Download,
  Repeat2,
  CheckCircle2,
  Search,
  HelpCircle,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

type Partner = {
  id: string;
  name: string;
  balance: number;
  unit: string;
  accent: string;
};

const partnersSeed: Partner[] = [
  { id: "vv", name: "ВкусВилл", balance: 0, unit: "B", accent: "from-emerald-400 to-emerald-600" },
  { id: "fuel", name: "FUEL", balance: 2380.29, unit: "B", accent: "from-fuchsia-500 to-indigo-500" },
  { id: "magnolia", name: "Магнолия", balance: 158.14, unit: "B", accent: "from-lime-400 to-green-600" },
  { id: "piligrim", name: "Пилигрим", balance: 100, unit: "B", accent: "from-sky-500 to-blue-700" },
  { id: "cafe12", name: "12 Grand Cafe", balance: 0, unit: "B", accent: "from-zinc-700 to-zinc-900" },
  { id: "airo", name: "AIRO", balance: 0, unit: "B", accent: "from-slate-600 to-slate-900" },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

// Safe Telegram typings
type TgHaptic = {
  impactOccurred?: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  notificationOccurred?: (type: "error" | "success" | "warning") => void;
};
type TgWebApp = {
  HapticFeedback?: TgHaptic;
};

function getTg(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { Telegram?: { WebApp?: TgWebApp } };
  return w.Telegram?.WebApp ?? null;
}

function haptic(type: "light" | "medium" | "success" = "light") {
  const tg = getTg();
  const hf = tg?.HapticFeedback;
  if (!hf) return;
  if (type === "success") hf.notificationOccurred?.("success");
  else hf.impactOccurred?.(type);
}

const springTap = { type: "spring", stiffness: 700, damping: 40 } as const;

export default function Page() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      {!showOnboarding && <MainApp />}
    </>
  );
}

/* ---------------------- Onboarding ---------------------- */

function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="h-full flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              if (swipe < -70 && index < 1) {
                haptic("light");
                setIndex(1);
              } else if (swipe > 70 && index > 0) {
                haptic("light");
                setIndex(0);
              }
            }}
          >
            <div className="w-full shrink-0 px-6 pt-10">
              <OnboardSceneDigitize />
              <OnboardText title="Деньги → Бонусы" subtitle="Оцифровывайте покупки и превращайте их в бонусы партнёров." />
            </div>

            <div className="w-full shrink-0 px-6 pt-10">
              <OnboardSceneSwap />
              <OnboardText title="Обмен внутри партнёров" subtitle="Меняйте бонусы между брендами — быстро, красиво и прозрачно." />
            </div>
          </motion.div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Dot active={index === 0} />
            <Dot active={index === 1} />
          </div>

          <motion.button
            whileTap={{ scale: 0.985 }}
            transition={springTap}
            onClick={() => {
              haptic("success");
              if (index === 0) setIndex(1);
              else onDone();
            }}
            className="w-full h-12 rounded-2xl bg-zinc-900 text-white font-semibold shadow-sm"
          >
            {index === 0 ? "Продолжить" : "Начать"}
          </motion.button>

          <div className="text-center text-xs text-zinc-400 mt-3">Свайпните вправо, чтобы увидеть следующий шаг</div>
        </div>
      </div>
    </motion.div>
  );
}

function Dot({ active }: { active: boolean }) {
  return <div className={["h-2 rounded-full transition-all", active ? "w-6 bg-zinc-900" : "w-2 bg-zinc-300"].join(" ")} />;
}

function OnboardText({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-6 max-w-md">
      <div className="text-2xl font-semibold tracking-tight">{title}</div>
      <div className="text-sm text-zinc-500 mt-2 leading-relaxed">{subtitle}</div>
    </div>
  );
}

function OnboardSceneDigitize() {
  return (
    <div className="mt-6 rounded-[28px] border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm">
      <div className="relative h-[340px] w-full">
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />

        <motion.div className="absolute left-1/2 top-[62%]" style={{ x: "-50%", y: "-50%" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [40, 0, -60, -120],
                x: [0, (i - 2.5) * 16, (i - 2.5) * 22, (i - 2.5) * 10],
                scale: [0.9, 1, 0.85, 0.6],
                filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(2px)"],
              }}
              transition={{ duration: 2.6, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }}
            >
              <Coin />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[42%]"
          style={{ x: "-50%", y: "-50%" }}
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: [0.9, 1.02, 1], opacity: [0.9, 1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <TokenB />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[42%] h-40 w-40 rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#00000010,transparent_60%)]" />
        </motion.div>
      </div>
    </div>
  );
}

function OnboardSceneSwap() {
  return (
    <div className="mt-6 rounded-[28px] border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm">
      <div className="relative h-[340px] w-full">
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#00000012_1px,transparent_1px)] [background-size:18px_18px]" />

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative h-44 w-44">
            <OrbitToken className="absolute left-1/2 top-0" style={{ x: "-50%" }} label="B" />
            <OrbitToken className="absolute right-0 top-1/2" style={{ y: "-50%" }} label="VV" />
            <OrbitToken className="absolute left-1/2 bottom-0" style={{ x: "-50%" }} label="FUEL" />
            <OrbitToken className="absolute left-0 top-1/2" style={{ y: "-50%" }} label="MG" />
          </div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 h-52 w-52 rounded-full border border-zinc-200"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [0.92, 1.02, 0.92], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-14 w-14 rounded-2xl bg-zinc-900 text-white grid place-items-center shadow-sm">
            <Repeat2 size={20} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OrbitToken({
  className,
  style,
  label,
}: {
  className?: string;
  style?: React.CSSProperties;
  label: string;
}) {
  return (
    <motion.div className={className} style={style} animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
      <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-200 shadow-sm grid place-items-center">
        <div className="text-xs font-semibold text-zinc-900">{label}</div>
      </div>
    </motion.div>
  );
}

function Coin() {
  return (
    <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 shadow-sm grid place-items-center">
      <div className="h-7 w-7 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#f4f4f5)] border border-zinc-200 grid place-items-center">
        <div className="text-[10px] font-bold text-zinc-700">₽</div>
      </div>
    </div>
  );
}

function TokenB() {
  return (
    <div className="h-28 w-28 rounded-[28px] bg-white border border-zinc-200 shadow-sm grid place-items-center">
      <div className="h-20 w-20 rounded-3xl bg-zinc-900 text-white grid place-items-center">
        <div className="text-3xl font-bold">B</div>
      </div>
      <div className="mt-3 text-[11px] text-zinc-500">bonus</div>
    </div>
  );
}

/* ---------------------- Main App ---------------------- */

function MainApp() {
  const [tab, setTab] = useState<"wallet" | "market" | "partners" | "profile">("wallet");
  const [query, setQuery] = useState("");

  const partners = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return partnersSeed;
    return partnersSeed.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold">B</div>
            <div>
              <div className="text-[13px] text-zinc-500 leading-none">Биржа бонусов</div>
              <div className="text-[15px] font-semibold leading-tight">
                {tab === "wallet" ? "Кошелёк" : tab === "market" ? "Маркет" : tab === "partners" ? "Партнёры" : "Профиль"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton aria="help" onClick={() => haptic("light")}>
              <HelpCircle size={18} />
            </IconButton>
            <IconButton aria="more" onClick={() => haptic("light")}>
              <MoreHorizontal size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-4 pb-28">
        {tab === "wallet" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-[28px] bg-white border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-zinc-500">Основной партнёр</div>
                    <div className="text-xl font-semibold mt-1">ВкусВилл</div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm" />
                </div>

                <div className="mt-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-zinc-500">Баланс</div>
                    <div className="text-3xl font-semibold leading-none mt-1">
                      {formatMoney(0)} <span className="text-base font-medium text-zinc-500">B</span>
                    </div>
                  </div>

                  <PrimaryButton label="Пополнить" onClick={() => haptic("medium")} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ActionCard label="Отправить" hint="перевод" icon={<Send size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Получить" hint="входящие" icon={<Download size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Обменять" hint="курс" icon={<Repeat2 size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Списать" hint="оплата" icon={<CheckCircle2 size={18} />} onClick={() => haptic("success")} />
                </div>
              </div>

              <div className="h-10 bg-gradient-to-b from-transparent to-zinc-50" />
            </motion.div>

            <div className="mt-4">
              <div className="h-12 rounded-2xl bg-white border border-zinc-200 px-3 flex items-center gap-2 focus-within:ring-2 focus-within:ring-zinc-900/10">
                <Search size={18} className="text-zinc-400" />
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
                <motion.button whileTap={{ scale: 0.98 }} transition={springTap} onClick={() => haptic("light")} className="text-sm font-semibold text-zinc-900">
                  Все
                </motion.button>
              </div>

              {partners.map((p) => (
                <motion.button
                  key={p.id}
                  onClick={() => haptic("light")}
                  whileTap={{ scale: 0.985 }}
                  transition={springTap}
                  className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 flex items-center justify-between gap-3 text-left hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${p.accent} shadow-sm`} />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-zinc-500">Нажмите, чтобы открыть</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold">{formatMoney(p.balance)}</div>
                      <div className="text-xs text-zinc-500">{p.unit}</div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {tab !== "wallet" && (
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="rounded-[28px] p-4 bg-white border border-zinc-200 shadow-sm">
            <div className="text-xl font-semibold">{tab === "market" ? "Маркет" : tab === "partners" ? "Партнёры" : "Профиль"}</div>
            <div className="text-sm text-zinc-500 mt-1">
              {tab === "market" ? "Офферы, сертификаты, предложения" : tab === "partners" ? "Список брендов и условия обмена" : "Настройки, история, поддержка"}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
              Экран в работе. Скажи, что здесь должно быть — и соберём.
            </div>
          </motion.div>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto max-w-md px-3 py-2">
          <div className="relative grid grid-cols-4 gap-2 rounded-3xl p-2 bg-zinc-50 border border-zinc-200 shadow-sm">
            <TabButton active={tab === "wallet"} onClick={() => (haptic("light"), setTab("wallet"))} label="Кошелёк" icon={<WalletCards size={18} />} />
            <TabButton active={tab === "market"} onClick={() => (haptic("light"), setTab("market"))} label="Маркет" icon={<ShoppingBag size={18} />} />
            <TabButton active={tab === "partners"} onClick={() => (haptic("light"), setTab("partners"))} label="Партнёры" icon={<Handshake size={18} />} />
            <TabButton active={tab === "profile"} onClick={() => (haptic("light"), setTab("profile"))} label="Профиль" icon={<UserRound size={18} />} />
          </div>
        </div>
      </nav>
    </div>
  );
}

function IconButton({ children, onClick, aria }: { children: React.ReactNode; onClick?: () => void; aria: string }) {
  return (
    <motion.button
      aria-label={aria}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={springTap}
      className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 text-zinc-700 grid place-items-center hover:bg-zinc-50"
    >
      {children}
    </motion.button>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.98 }} transition={springTap} className="h-10 px-4 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm">
      {label}
    </motion.button>
  );
}

function ActionCard({ label, hint, icon, onClick }: { label: string; hint: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.985 }} transition={springTap} className="group rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between shadow-sm hover:shadow-md">
      <div>
        <div className="text-[15px] font-semibold">{label}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{hint}</div>
      </div>
      <div className="h-11 w-11 rounded-2xl bg-white border border-zinc-200 grid place-items-center text-zinc-900 group-hover:border-zinc-300 group-hover:shadow-sm">
        <div className="opacity-90">{icon}</div>
      </div>
    </motion.button>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.98 }} transition={springTap} className="relative h-12 rounded-2xl flex items-center justify-center gap-2 px-2 overflow-hidden">
      {active && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-2xl bg-white border border-zinc-200 shadow-sm" transition={springTap} />}
      <span className={`relative ${active ? "text-zinc-900" : "text-zinc-500"}`}>{icon}</span>
      <span className={`relative text-sm font-semibold ${active ? "text-zinc-900" : "text-zinc-600"}`}>{label}</span>
    </motion.button>
  );
}
