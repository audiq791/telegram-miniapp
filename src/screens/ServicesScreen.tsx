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

const services = [
  {
    id: "fuel",
    icon: Fuel,
    title: "Заправка",
    description: "Оплата топлива бонусами",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: "avia",
    icon: Plane,
    title: "Авиабилеты",
    description: "Бонусы за перелеты",
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50"
  },
  {
    id: "delivery",
    icon: Package,
    title: "Доставка",
    description: "Бесплатная доставка",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    id: "certificates",
    icon: Gift,
    title: "Сертификаты",
    description: "Подарочные сертификаты",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: "insurance",
    icon: ShieldCheck,
    title: "Страхование",
    description: "Страховка бонусами",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "business",
    icon: Briefcase,
    title: "Бизнес-залы",
    description: "Доступ в VIP-залы",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Мобильная связь",
    description: "Пополнение счета",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    id: "gpt",
    icon: Sparkles,
    title: "GPT Помощник",
    description: "ИИ-ассистент для задач",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    badge: "Powered by Deepseek"
  }
];

export default function ServicesScreen() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Шапка от края до края - без отступа сверху */}
      <div className="bg-white border-b border-zinc-200 w-full">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-zinc-900">Сервисы</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Услуги и преимущества для держателей бонусов
          </p>
        </div>
      </div>

      {/* Плитки вплотную к краям */}
      <div className="px-2 py-4">
        <div className="grid grid-cols-2 gap-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm p-3 text-left relative flex flex-col h-full"
              >
                {/* Верхняя часть с иконкой */}
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl ${service.bgColor} flex items-center justify-center`}>
                    <Icon size={24} className={service.iconColor} />
                  </div>
                </div>

                {/* Текст */}
                <div className="mt-3 flex-1">
                  <h3 className="font-semibold text-zinc-900">{service.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{service.description}</p>
                  
                  {/* Powered by Deepseek под описанием для GPT */}
                  {service.badge && (
                    <p className="text-[8px] text-zinc-400 mt-2">
                      {service.badge}
                    </p>
                  )}
                </div>

                {/* Стрелка для обычных сервисов */}
                {!service.badge && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-zinc-400">
                    <span>Подробнее</span>
                    <ArrowRight size={12} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}