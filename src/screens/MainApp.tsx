"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  WalletCards,
  ShoppingBag,
  Handshake,
  UserRound,
} from "lucide-react";

import { ActionCard, PrimaryButton, TabButton } from "../components/ui";
import BlackScreen from "./BlackScreen";

export default function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<"main" | "blank">("main");
  const [blankTitle, setBlankTitle] = useState("");

  // Telegram WebApp API - максимально просто
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Показываем приложение
    tg.ready();
    tg.expand();

    // Кнопка назад - всегда скрыта в начале
    tg.BackButton.hide();

    // Обработчик кнопки назад
    tg.BackButton.onClick(() => {
      // Просто возвращаемся на главный экран
      setCurrentScreen("main");
      setBlankTitle("");
      
      // Скрываем кнопку назад
      tg.BackButton.hide();
      
      // Легкая вибрация
      tg.HapticFeedback.impactOccurred("light");
    });

    return () => {
      tg.BackButton.offClick();
    };
  }, []);

  // Следим за экраном
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    if (currentScreen === "blank") {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  }, [currentScreen]);

  const openBlank = (title: string) => {
    const tg = (window as any).Telegram?.WebApp;
    
    setCurrentScreen("blank");
    setBlankTitle(title);
    
    tg?.HapticFeedback.impactOccurred("light");
  };

  const closeBlank = () => {
    const tg = (window as any).Telegram?.WebApp;
    
    setCurrentScreen("main");
    setBlankTitle("");
    
    tg?.HapticFeedback.impactOccurred("light");
  };

  // Главный экран
  if (currentScreen === "main") {
    return (
      <div className="min-h-dvh bg-zinc-50">
        {/* Шапка */}
        <div className="bg-white/80 backdrop-blur border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-white grid place-items-center font-semibold">
              B
            </div>
            <div>
              <div className="text-[13px] text-zinc-500">Биржа бонусов</div>
              <div className="text-[15px] font-semibold">Кошелёк</div>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4 pb-28">
          {/* Карточка баланса */}
          <div className="rounded-[28px] bg-white border border-zinc-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-zinc-500">Основной партнёр</div>
                <div className="text-xl font-semibold">ВкусВилл</div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600" />
            </div>

            <div className="mt-4 bg-zinc-50 rounded-2xl p-4 flex justify-between items-end">
              <div>
                <div className="text-xs text-zinc-500">Баланс</div>
                <div className="text-3xl font-semibold">0 <span className="text-base text-zinc-500">B</span></div>
              </div>
              <PrimaryButton label="Пополнить" onClick={() => openBlank("Пополнить")} />
            </div>

            {/* Кнопки действий */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <ActionCard label="Отправить" hint="перевод" kind="send" onClick={() => openBlank("Отправить")} />
              <ActionCard label="Получить" hint="входящие" kind="receive" onClick={() => openBlank("Получить")} />
              <ActionCard label="Обменять" hint="курс" kind="swap" onClick={() => openBlank("Обменять")} />
              <ActionCard label="Списать" hint="оплата" kind="spend" onClick={() => openBlank("Списать")} />
            </div>
          </div>
        </div>

        {/* Нижнее меню */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-zinc-200 px-3 py-2">
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            <TabButton active={true} onClick={() => {}} label="Кошелёк" icon={<WalletCards size={18} />} />
            <TabButton active={false} onClick={() => openBlank("Маркет")} label="Маркет" icon={<ShoppingBag size={18} />} />
            <TabButton active={false} onClick={() => openBlank("Партнёры")} label="Партнёры" icon={<Handshake size={18} />} />
            <TabButton active={false} onClick={() => openBlank("Профиль")} label="Профиль" icon={<UserRound size={18} />} />
          </div>
        </div>
      </div>
    );
  }

  // Второй экран
  return <BlackScreen title={blankTitle} onBack={closeBlank} />;
}