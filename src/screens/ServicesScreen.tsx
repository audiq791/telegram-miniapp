"use client";

import { motion } from "framer-motion";
import { 
  Fuel,
  Plane,
  Package,
  Gift,
  ShieldCheck,
  Briefcase,
  Smartphone,
  Sparkles,
  ArrowRight
} from "lucide-react";

type ServiceItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  badge?: string;
};

const services: ServiceItem[] = [
  {
    id: "fuel",
    icon: <Fuel size={24} />,
    title: "Заправка",
    description: "Оплата топлива бонусами",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: "avia",
    icon: <Plane size={24} />,
    title: "Авиабилеты",
    description: "Бонусы за перелеты",
    color: "text-sky-600",
    bgColor: "bg-sky-50"
  },
  {
    id: "delivery",
    icon: <Package size={24} />,
    title: "Доставка",
    description: "Бесплатная доставка",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    id: "certificates",
    icon: <Gift size={24} />,
    title: "Сертификаты",
    description: "Подарочные сертификаты",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: "insurance",
    icon: <ShieldCheck size={24} />,
    title: "Страхование",
    description: "Страховка бонусами",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "business",
    icon: <Briefcase size={24} />,
    title: "Бизнес-залы",
    description: "Доступ в VIP-залы",
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    id: "mobile",
    icon: <Smartphone size={24} />,
    title: "Мобильная связь",
    description: "Пополнение счета",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    id: "gpt",
    icon: <Sparkles size={24} />,
    title: "GPT Помощник",
    description: "ИИ-ассистент для задач",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    badge: "Powered by Deepseek"
  }
];

export default function ServicesScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-zinc-50"
    >
      {/* Шапка */}
      <div className="bg-white border-b border-zinc-200 px-4 py-6">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-zinc-900">Сервисы</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Услуги и преимущества для держателей бонусов
          </p>
        </div>
      </div>

      {/* Сетка сервисов */}
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98, backgroundColor: "#f4f4f5" }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 text-left hover:shadow-md transition-all group relative"
            >
              {/* Badge для GPT Помощника */}
              {service.badge && (
                <div className="absolute top-2 right-3 text-[8px] text-zinc-400 font-medium">
                  {service.badge}
                </div>
              )}

              <div className={`h-12 w-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-3`}>
                <div className={service.color}>
                  {service.icon}
                </div>
              </div>
              <h3 className="font-semibold text-zinc-900">{service.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{service.description}</p>
              
              {/* Индикатор для остальных */}
              {!service.badge && (
                <div className="flex items-center gap-1 mt-3 text-xs text-zinc-400">
                  <span>Подробнее</span>
                  <ArrowRight size={12} />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}