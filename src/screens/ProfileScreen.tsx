"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Headphones,
  LogOut,
  Settings,
} from "lucide-react";

const userData = {
  name: "Леван Баазов",
  phone: "9251234567",
  bonAddress: "UQA754XVVal-AHWEwK8t8YzSvGttHiDt1XoUzpY-2XFQWaTN",
  initials: "ЛБ",
};

function formatPhone(phone: string) {
  if (!phone) return "";

  let formatted = "";
  for (let index = 0; index < phone.length; index += 1) {
    if (index === 0) {
      formatted += `(${phone[index]}`;
    } else if (index === 2) {
      formatted += `${phone[index]}) `;
    } else if (index === 5 || index === 7) {
      formatted += `${phone[index]}-`;
    } else {
      formatted += phone[index];
    }
  }

  return formatted;
}

export default function ProfileScreen({ onLogout }: { onLogout?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.bonAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      onLogout?.();
      setIsLoggingOut(false);
    }
  };

  const tapAnimation = {
    scale: 0.95,
    backgroundColor: "#e4e4e7",
    transition: { duration: 0.01 },
  };

  const logoutTapAnimation = {
    scale: 0.95,
    backgroundColor: "#fee2e2",
    transition: { duration: 0.01 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-zinc-50"
    >
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <h1 className="text-xl font-semibold text-zinc-900">Профиль</h1>
          <p className="mt-1 text-xs text-zinc-500">Вы успешно авторизованы в системе</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-zinc-900 to-zinc-700 shadow-sm">
              <span className="text-2xl font-bold text-white">{userData.initials}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">{userData.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">+7 {formatPhone(userData.phone)}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
          >
            <div className="mb-1 text-xs text-zinc-500">BON кошелек</div>
            <div className="flex items-center justify-between gap-2">
              <div className="truncate font-mono text-xs text-zinc-700" title={userData.bonAddress}>
                {userData.bonAddress}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.01 }}
                onClick={handleCopy}
                className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium transition-colors hover:bg-zinc-50"
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

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="my-6 h-px bg-linear-to-r from-transparent via-zinc-300 to-transparent"
        />

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {[
            { icon: CreditCard, label: "Платежная информация" },
            { icon: Headphones, label: "Техническая поддержка" },
            { icon: Settings, label: "Настройки" },
            { icon: Building2, label: "О компании" },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileTap={tapAnimation}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-zinc-600" />
                <span className="font-medium text-zinc-900">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-zinc-400" />
            </motion.button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          whileTap={logoutTapAnimation}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-4 font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          <LogOut size={18} />
          {isLoggingOut ? "Выходим..." : "Выйти"}
        </motion.button>
      </div>
    </motion.div>
  );
}
