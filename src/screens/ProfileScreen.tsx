"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  LogIn,
  Send
} from "lucide-react";

interface ProfileScreenProps {
  onLogin?: () => void; // добавляем пропс для перехода
}

export default function ProfileScreen({ onLogin }: ProfileScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "");

    let cleaned = digitsOnly.startsWith("7") ? digitsOnly.slice(1) : digitsOnly;
    if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

    setPhoneNumber(cleaned);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && phoneNumber.length > 0) {
      setPhoneNumber(prev => prev.slice(0, -1));
      e.preventDefault();
    }
  };

  const getDisplayNumber = () => {
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

  const handleLogin = () => {
    if (phoneNumber.length === 10) {
      onLogin?.(); // вызываем переход на главный экран
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-50 min-h-screen"
    >
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900">Профиль</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-8">
        <p className="text-xs text-zinc-500 mb-2">Введите номер телефона</p>

        <div className="mb-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className="text-base text-zinc-400">+7</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={getDisplayNumber()}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              placeholder=""
              className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              inputMode="numeric"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            onClick={handleLogin}
            disabled={phoneNumber.length !== 10}
            className="w-full mt-4 py-3 bg-zinc-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:bg-zinc-400"
          >
            <LogIn size={16} />
            Войти
          </motion.button>
        </div>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-xs text-zinc-400">или</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 800, damping: 20 }}
          onClick={handleLogin}
          disabled={phoneNumber.length !== 10}
          className="w-full py-3 bg-[#54A9EB] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4098E0] transition-colors disabled:opacity-50"
        >
          <Send size={16} />
          Войти через Telegram
        </motion.button>
      </div>
    </motion.div>
  );
}