"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight,
  LogOut,
  Copy,
  CreditCard,
  Headphones,
  Settings,
  Building2,
  Check
} from "lucide-react";

const userData = {
  name: "Леван Баазов",
  phone: "9251234567",
  bonAddress: "UQA754XVVal-AHWEwK8t8YzSvGttHiDt1XoUzpY-2XFQWaTN",
  initials: "ЛБ"
};

export default function ProfileScreen() {
  const [copied, setCopied] = useState(false);

  const getDisplayNumber = () => {
    const phone = userData.phone;
    if (!phone) return "";
    
    let formatted = "";
    for (let i = 0; i < phone.length; i++) {
      if (i === 0) {
        formatted += `(${phone[i]}`;
      } else if (i === 2) {
        formatted += `${phone[i]}) `;
      } else if (i === 5) {
        formatted += `${phone[i]}-`;
      } else if (i === 7) {
        formatted += `${phone[i]}-`;
      } else {
        formatted += phone[i];
      }
    }
    return formatted;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.bonAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    console.log("Выход");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-50 min-h-screen flex flex-col"
    >
      <div className="max-w-md mx-auto w-full px-4 py-6 flex-1 flex flex-col">
        {/* Шапка как в ServicesScreen */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 mb-1"
        >
          <h1 className="text-xl font-semibold text-zinc-900">Профиль</h1>
        </motion.div>

        {/* Подпись как в ServicesScreen */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xs text-zinc-500 mb-6"
        >
          Вы успешно авторизованы в системе
        </motion.p>

        {/* Карточка пользователя */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 mb-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-zinc-900 to-zinc-700 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-white">{userData.initials}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{userData.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">+7 {getDisplayNumber()}</p>
            </div>
          </div>

          {/* BON кошелек */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-zinc-50 rounded-xl border border-zinc-200 p-3"
          >
            <div className="text-xs text-zinc-500 mb-1">BON кошелек</div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-xs truncate text-zinc-700" title={userData.bonAddress}>
                {userData.bonAddress}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 800, damping: 20 }}
                onClick={handleCopy}
                className="h-8 px-3 rounded-lg bg-white border border-zinc-200 text-xs font-medium flex items-center gap-1 hover:bg-zinc-50 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" />
                    <span>Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Копировать</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Тонкая линия-разделитель */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent my-6"
        />

        {/* Меню - с анимацией как в ServicesScreen */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">Платежная информация</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <Headphones size={18} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">Техническая Поддержка</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">Настройки</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#e4e4e7" }}
            transition={{ type: "spring", stiffness: 800, damping: 20 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-zinc-600" />
              <span className="font-medium text-zinc-900">О Компании</span>
            </div>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
        </motion.div>

        {/* Кнопка выхода - с той же анимацией */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          whileTap={{ scale: 0.95, backgroundColor: "#fee2e2" }}
          onClick={handleLogout}
          className="w-full mt-6 py-4 rounded-xl border border-red-200 bg-white text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          Выйти
        </motion.button>
      </div>
    </motion.div>
  );
}