"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Headphones,
  Building2,
  LogIn,
  Send
} from "lucide-react";

interface LoginAccountProps {
  onLogin?: () => void;
}

// Анимация летающих бонусов
function FloatingBonuses() {
  return (
    <div className="relative h-48 w-full mb-8">
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#00000012_1px,transparent_1px)] bg-size-[18px_18px]" />

      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ x: "-50%", y: "-50%" }}
      >
        {/* Летающие монетки B */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [40, 0, -40, -80],
              x: [0, (i - 3.5) * 20, (i - 3.5) * 25, (i - 3.5) * 15],
              scale: [0.8, 1, 0.9, 0.7],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          >
            <div className="h-12 w-12 rounded-2xl bg-white border-2 border-zinc-200 shadow-lg flex items-center justify-center">
              <span className="text-xl font-bold text-zinc-900">B</span>
            </div>
          </motion.div>
        ))}

        {/* Центральный элемент */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="h-24 w-24 rounded-3xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-2xl flex items-center justify-center"
        >
          <span className="text-4xl font-bold text-white">B</span>
        </motion.div>
      </motion.div>

      {/* Пульсирующее свечение */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-32 w-32 rounded-full"
        style={{ x: "-50%", y: "-50%" }}
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#00000020,transparent_70%)]" />
      </motion.div>
    </div>
  );
}

export default function LoginAccount({ onLogin }: LoginAccountProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Только цифры, максимум 10
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleLogin = () => {
    onLogin?.();
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

      {/* Анимация */}
      <div className="max-w-md mx-auto px-4 mt-8">
        <FloatingBonuses />
      </div>

      <div className="max-w-md mx-auto px-4" style={{ marginTop: "190px" }}>
        <p className="text-4xl font-bold text-zinc-900 mb-2">Войдите или зарегистрируйтесь</p>
        <p className="text-xs text-zinc-400 mb-4">Введите номер телефона</p>

        <div className="mb-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className="text-base text-zinc-400">+7</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder=""
              className="w-full h-12 pl-12 pr-4 bg-white border border-zinc-200 rounded-xl text-base outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
              inputMode="numeric"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            onClick={handleLogin}
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
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 800, damping: 20 }}
          onClick={handleLogin}
          className="w-full py-3 bg-[#54A9EB] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4098E0] transition-colors"
        >
          <Send size={16} className="text-white" />
          Войти через Telegram
        </motion.button>

        <div className="space-y-2 mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full py-3 bg-white border border-zinc-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            <Headphones size={16} className="text-zinc-600" />
            Поддержка
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
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