"use client";

import { motion } from "framer-motion";
import { 
  ChevronRight,
  LogOut
} from "lucide-react";

const userData = {
  name: "Анна Иванова",
  phone: "1234567890",
  initials: "А"
};

export default function ProfileScreen() {
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

  const handleLogout = () => {
    console.log("Выход");
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

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{userData.initials}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{userData.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">+7 {getDisplayNumber()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <span className="font-medium text-zinc-900">Мои бонусы</span>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <span className="font-medium text-zinc-900">История операций</span>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 700, damping: 40 }}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-left flex items-center justify-between hover:shadow-md transition-all"
          >
            <span className="font-medium text-zinc-900">Настройки</span>
            <ChevronRight size={18} className="text-zinc-400" />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
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