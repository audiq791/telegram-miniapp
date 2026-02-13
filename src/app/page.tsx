"use client";

import { useMemo, useState } from "react";

type Partner = {
  id: string;
  name: string;
  balance: number;
  unit: string; // "B" или "б"
  accent?: string; // tailwind class
};

const partnersSeed: Partner[] = [
  { id: "vv", name: "ВкусВилл", balance: 0, unit: "B", accent: "from-emerald-500 to-emerald-600" },
  { id: "fuel", name: "FUEL", balance: 2380.29, unit: "B", accent: "from-indigo-500 to-fuchsia-600" },
  { id: "magnolia", name: "Магнолия", balance: 158.14, unit: "B", accent: "from-lime-500 to-green-600" },
  { id: "piligrim", name: "Пилигрим", balance: 100, unit: "B", accent: "from-sky-500 to-blue-600" },
  { id: "cafe12", name: "12 Grand Cafe", balance: 0, unit: "B", accent: "from-zinc-700 to-zinc-900" },
  { id: "airo", name: "AIRO", balance: 0, unit: "B", accent: "from-slate-600 to-slate-800" },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
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
      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-lg">Биржа бонусов</div>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-[0.98]">
              ?
            </button>
            <button className="h-9 w-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-[0.98]">
              ⋯
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-md px-4 pt-4 pb-24">
        {tab === "wallet" && (
          <>
            {/* Hero card */}
            <div className="rounded-3xl p-4 bg-white border border-zinc-200 shadow-sm overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-zinc-500">Основной партнёр</div>
                  <div className="text-xl font-semibold mt-1">ВкусВилл</div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600" />
              </div>

              <div className="mt-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 flex items-end justify-between">
                <div>
                  <div className="text-sm text-zinc-500">Баланс</div>
                  <div className="text-3xl font-semibold leading-none mt-1">
                    {formatMoney(0)} <span className="text-base font-medium text-zinc-500">B</span>
                  </div>
                </div>
                <button className="h-10 px-4 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]">
                  Пополнить
                </button>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <ActionButton label="Отправить" icon="↗" />
                <ActionButton label="Получить" icon="↙" />
                <ActionButton label="Обменять" icon="⇄" />
                <ActionButton label="Списать" icon="✓" />
              </div>
            </div>

            {/* Search */}
            <div className="mt-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск партнёра…"
                className="w-full h-12 px-4 rounded-2xl bg-white border border-zinc-200 outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>

            {/* Partners list */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="text-sm text-zinc-500">Партнёры</div>
                <button className="text-sm font-medium text-zinc-900">Все</button>
              </div>

              {partners.map((p) => (
                <button
                  key={p.id}
                  className="w-full rounded-2xl bg-white border border-zinc-200 shadow-sm p-3 flex items-center justify-between gap-3 hover:bg-zinc-50 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${p.accent ?? "from-zinc-700 to-zinc-900"}`} />
                    <div className="text-left">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-zinc-500">Нажмите, чтобы открыть</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">{formatMoney(p.balance)}</div>
                    <div className="text-xs text-zinc-500">{p.unit}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "market" && (
          <Section title="Маркет" subtitle="Офферы партнёров, сертификаты и предложения">
            <EmptyState text="Добавим витрину: категории, карточки офферов, фильтры." />
          </Section>
        )}

        {tab === "partners" && (
          <Section title="Партнёры" subtitle="Список брендов и условия обмена">
            <EmptyState text="Сюда вынесем условия, лимиты, коэффициенты и доступные направления обмена." />
          </Section>
        )}

        {tab === "profile" && (
          <Section title="Профиль" subtitle="Настройки и безопасность">
            <EmptyState text="Профиль, роли (админ/менеджер), история операций, поддержка." />
          </Section>
        )}
      </main>

      {/* Bottom Tabs */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-zinc-200"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-md px-3 py-2 grid grid-cols-4 gap-2">
          <TabButton active={tab === "wallet"} onClick={() => setTab("wallet")} label="Кошелёк" icon="⌂" />
          <TabButton active={tab === "market"} onClick={() => setTab("market")} label="Маркет" icon="⧉" />
          <TabButton active={tab === "partners"} onClick={() => setTab("partners")} label="Партнёры" icon="◎" />
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")} label="Профиль" icon="◐" />
        </div>
      </nav>
    </div>
  );
}

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-[0.98] py-3 flex flex-col items-center gap-1">
      <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="text-xs font-medium text-zinc-700">{label}</div>
    </button>
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
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-12 rounded-2xl flex items-center justify-center gap-2 border transition active:scale-[0.99]",
        active ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-900 border-zinc-200",
      ].join(" ")}
    >
      <span className="text-base">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-4 bg-white border border-zinc-200 shadow-sm">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-sm text-zinc-500 mt-1">{subtitle}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
      {text}
    </div>
  );
}
