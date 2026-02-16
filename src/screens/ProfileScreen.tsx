"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Phone,
  Headphones,
  Building2,
  LogIn,
  ChevronRight,
  LogOut,
  Send
} from "lucide-react";

export default function ProfileScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Форматирование номера при вводе
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Убираем всё кроме цифр
    let cleaned = e.target.value.replace(/\D/g, '');
    
    // Ограничиваем 10 цифрами (без учёта +7)
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }
    
    setPhoneNumber(cleaned);
  };

  // Форматирование для отображения: +7 (123) 456-78-90
  const formatPhoneNumber = () => {
    if (!phoneNumber) return "";
    
    let formatted = "";
    for (let i = 0; i < phoneNumber.length; i++) {
      if (i === 0) {
        formatted += `(${phoneNumber[i]}`;
      } else if (i === 2) {
        formatted += `${phoneNumber[i]}) `;
      } else if (i === 5) {
        formatted += `${phoneNumber[i]}-`;
      } else if (i === 7) {
        formatted += `${phoneNumber[i]}-`;
      } else {
        formatted += phoneNumber[i];
      }
    }
    return formatted;
  };

  // Полный номер для отображения
  const getFullPhoneNumber = () => {
    if (!phoneNumber) return "+7";
    return `+7 ${formatPhoneNumber()}`;
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber("");
  };

  // Для зарегистрированного пользователя
  if (isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-zinc-50 min-h-screen"
      >
        {/* Шапка - большая таблетка */}
        <div className="max-w-md mx-auto px-4 pt-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
            <h1 className="text-2xl font-bold text-zinc-900">Профиль</h1>
            <p className="text-sm text-zinc-500 mt-1">Войдите в аккаунт, чтобы управлять своими бонусами</p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-6">
          {/* Аватар и имя */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">А</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Анна Иванова</h2>
                <p className="text-sm text-zinc-500 mt-1">{getFullPhoneNumber()}</p>
              </div>
            </div>
          </div>

          {/* Секции профиля */}
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-colors"
            >
              <span className="font-medium text-zinc-900">Мои бонусы</span>
              <ChevronRight size={18} className="text-zinc-400" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-colors"
            >
              <span className="font-medium text-zinc-900">История операций</span>
              <ChevronRight size={18} className="text-zinc-400" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
              transition={{ type: "spring", stiffness: 800, damping: 20 }}
              className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-colors"
            >
              <span className="font-medium text-zinc-900">Настройки</span>
              <ChevronRight size={18} className="text-zinc-400" />
            </motion.button>
          </div>

          {/* Кнопка выхода */}
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#fecaca" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            onClick={handleLogout}
            className="w-full mt-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Выйти
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Для незарегистрированного пользователя
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-50 min-h-screen"
    >
      {/* Шапка - большая таблетка с текстом */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-zinc-900">Профиль</h1>
          <p className="text-sm text-zinc-500 mt-1">Войдите в аккаунт, чтобы управлять своими бонусами</p>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Подпись над полем */}
        <p className="text-xs text-zinc-500 mb-2">Введите номер телефона</p>

        {/* Поле ввода телефона */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className={`text-base ${phoneNumber ? 'text-zinc-900' : 'text-zinc-400'}`}>
                +7
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={formatPhoneNumber()}
              onChange={handlePhoneChange}
              placeholder=" (___) ___-__-__"
              className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Phone size={16} className="text-zinc-400" />
            </div>
          </div>

          {/* Кнопка Войти (черная) - с улучшенной анимацией */}
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#18181b" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            onClick={handleLogin}
            className="w-full mt-4 py-3 bg-zinc-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
          >
            <LogIn size={16} />
            Войти
          </motion.button>
        </div>

        {/* Разделитель с текстом */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">или</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Кнопка Войти через Telegram - с улучшенной анимацией */}
        <motion.button
          whileTap={{ scale: 0.95, backgroundColor: "#3390EC" }}
          transition={{ type: "spring", stiffness: 800, damping: 20 }}
          className="w-full py-3 bg-[#54A9EB] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4098E0] transition-colors mb-6"
        >
          <Send size={16} className="text-white" />
          Войти через Telegram
        </motion.button>

        {/* Кнопки внизу - с улучшенной анимацией */}
        <div className="space-y-2">
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full py-3 bg-white border border-zinc-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            <Headphones size={16} className="text-zinc-600" />
            Поддержка
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full py-3 bg-white border border-zinc-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            <Building2 size={16} className="text-zinc-600" />
            О компании
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}