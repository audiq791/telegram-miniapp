"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Phone,
  LogIn,
  Send
} from "lucide-react";

interface OnboardingProfileScreenProps {
  onComplete: () => void;
}

export default function OnboardingProfileScreen({ onComplete }: OnboardingProfileScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center justify-center px-4"
    >
      <h1 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
        Войдите в аккаунт
      </h1>

      <div className="w-full max-w-md">
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
              placeholder=""
              className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              inputMode="numeric"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#27272a" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            onClick={onComplete}
            className="w-full mt-4 py-3 bg-zinc-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
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
          whileTap={{ scale: 0.95, backgroundColor: "#3390EC" }}
          transition={{ type: "spring", stiffness: 800, damping: 20 }}
          onClick={onComplete}
          className="w-full py-3 bg-[#54A9EB] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4098E0] transition-colors"
        >
          <Send size={16} className="text-white" />
          Войти через Telegram
        </motion.button>
      </div>
    </motion.div>
  );
}