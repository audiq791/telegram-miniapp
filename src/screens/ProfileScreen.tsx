"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight,
  LogOut,
  Settings,
  History,
  Award,
  User
} from "lucide-react";

export default function ProfileScreen() {
  const [user] = useState({
    name: "Анна Иванова",
    phone: "+7 (999) 123-45-67",
    bonusBalance: 12500,
    level: "Золотой"
  });

  const handleLogout = () => {
    console.log("Выход из аккаунта");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-zinc-50 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-zinc-900 text-center mb-8">
          Профиль
        </h1>

        {/* Карточка пользователя */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            {/* Аватар */}
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
            
            {/* Имя и телефон */}
            <h2 className="text-xl font-semibold text-zinc-900 mb-1">{user.name}</h2>
            <p className="text-sm text-zinc-500 mb-4">{user.phone}</p>

            {/* Уровень и бонусы */}
            <div className="w-full pt-4 border-t border-zinc-100 flex justify-around">
              <div className="text-center">
                <p className="text-xs text-zinc-500">Уровень</p>
                <p className="font-semibold text-zinc-900 mt-1">{user.level}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">Бонусы</p>
                <p className="font-semibold text-zinc-900 mt-1">{user.bonusBalance.toLocaleString()} B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Меню профиля */}
        <div className="space-y-2 mb-6">
          <motion.button
            whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <Award size={20} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">Мои бонусы</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <History size={20} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">История операций</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">Настройки</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
        </div>

        {/* Кнопка выхода */}
        <motion.button
          whileTap={{ scale: 0.97, backgroundColor: "#fee2e2" }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
          onClick={handleLogout}
          className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Выйти
        </motion.button>
      </div>
    </motion.div>
  );
}