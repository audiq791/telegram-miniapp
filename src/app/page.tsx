"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Store,
  Users,
  User,
  ArrowUpRight,
  ArrowDownLeft,
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
  accent: string; // tailwind gradient
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

function haptic(type: "light" | "medium" | "success" = "light") {
  const tg = (window as any)?.Telegram?.WebApp;
  const hf = tg?.HapticFeedback;
  if (!hf) return;
  if (type === "success") hf.notificationOccurred("success");
  else hf.impactOccurred(type);
}

export default function Home() {
  const [tab, setTab] = useState<"wallet" | "market" | "partners" | "profile">("wallet");
  const [query, setQuery] = useState("");

  const partners = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return partnersSeed;
    return partnersSeed.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold">
              B
            </div>
            <div>
              <div className="text-[13px] text-zinc-500 leading-none">Биржа бонусов</div>
              <div className="text-[15px] font-semibold leading-tight">Кошелёк</div>
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

      {/* Content */}
      <main className="mx-auto max-w-md px-4 pt-4 pb-24">
        {tab === "wallet" && (
          <>
            {/* Hero */}
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

                  <PrimaryButton
                    onClick={() => haptic("medium")}
                    label="Пополнить"
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ActionCard label="Отправить" hint="перевод" icon={<ArrowUpRight size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Получить" hint="входящие" icon={<ArrowDownLeft size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Обменять" hint="курс" icon={<Repeat2 size={18} />} onClick={() => haptic("medium")} />
                  <ActionCard label="Списать" hint="оплата" icon={<CheckCircle2 size={18} />} onClick={() => haptic("success")} />
                </div>
              </div>

              {/* subtle bottom gradient */}
              <div className="h-10 bg-gradient-to-b from-transparent to-zinc-50" />
            </motion.div>

            {/* Search */}
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

            {/* Partners list */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="text-sm text-zinc-500">Партнёры</div>
                <button
                  onClick={() => haptic("light")}
                  className="text-sm font-semibold text-zinc-900 active:scale-[0.98]"
                >
                  Все
                </button>
              </div>

              {partners.map((p) => (
                <motion.button
                  key={p.id}
                  onClick={() => haptic("light")}
                  whileTap={{ scale: 0.985 }}
                  className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 flex items-center justify-between gap-3 text-left"
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-[28px] p-4 bg-white border border-zinc-200 shadow-sm"
          >
            <div className="text-xl font-semibold">
              {tab === "market" ? "Маркет" : tab === "partners" ? "Партнёры" : "Профиль"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">
              {tab === "market"
                ? "Офферы, сертификаты, предложения"
                : tab === "partners"
                ? "Список брендов и условия обмена"
                : "Настройки, история, поддержка"}
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
              Экран в работе. Скажи, что здесь должно быть — и соберём.
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom tabs */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-zinc-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
          <TabButton active={tab === "wallet"} onClick={() => (haptic("light"), setTab("wallet"))} label="Кошелёк" icon={<Wallet size={18} />} />
          <TabButton active={tab === "market"} onClick={() => (haptic("light"), setTab("market"))} label="Маркет" icon={<Store size={18} />} />
          <TabButton active={tab === "partners"} onClick={() => (haptic("light"), setTab("partners"))} label="Партнёры" icon={<Users size={18} />} />
          <TabButton active={tab === "profile"} onClick={() => (haptic("light"), setTab("profile"))} label="Профиль" icon={<User size={18} />} />
        </div>
      </nav>
    </div>
  );
}

/** Small components */

function IconButton({ children, onClick, aria }: { children: React.ReactNode; onClick?: () => void; aria: string }) {
  return (
    <motion.button
      aria-label={aria}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 text-zinc-700 grid place-items-center hover:bg-zinc-50"
    >
      {children}
    </motion.button>
  );
}

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="h-10 px-4 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm"
    >
      {label}
    </motion.button>
  );
}

function ActionCard({
  label,
  hint,
  icon,
  onClick,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className="rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 p-4 flex items-center justify-between shadow-sm"
    >
      <div>
        <div className="text-[15px] font-semibold">{label}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{hint}</div>
      </div>
      <div className="h-11 w-11 rounded-2xl bg-zinc-900 text-white grid place-items-center">
        {icon}
      </div>
    </motion.button>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={[
        "h-12 rounded-2xl flex items-center justify-center gap-2 border transition",
        active ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" : "bg-white text-zinc-900 border-zinc-200",
      ].join(" ")}
    >
      <span className={active ? "opacity-100" : "text-zinc-500"}>{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </motion.button>
  );
}
