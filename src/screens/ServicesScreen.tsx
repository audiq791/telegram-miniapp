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
    description: "Страховые полисы",
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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Аккуратная таблетка для шапки */}
      <div className="max-w-md mx-auto w-full px-4 pt-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5">
          <h1 className="text-2xl font-bold text-zinc-900">Сервисы</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Услуги и преимущества для держателей бонусов
          </p>
        </div>
      </div>

      {/* Плитки - занимают всё оставшееся место, но не больше */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-0">
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 text-left relative flex flex-col h-full"
              >
                {/* Иконка */}
                <div className={`h-12 w-12 rounded-xl ${service.bgColor} flex items-center justify-center mb-3`}>
                  <Icon size={24} className={service.iconColor} />
                </div>

                {/* Текст */}
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900">{service.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{service.description}</p>
                  
                  {/* Powered by Deepseek под описанием */}
                  {service.badge && (
                    <p className="text-[8px] text-zinc-400 mt-2">
                      {service.badge}
                    </p>
                  )}
                </div>

                {/* Стрелка для всех сервисов */}
                <div className="flex items-center gap-1 mt-3 text-xs text-zinc-400">
                  <span>Подробнее</span>
                  <ArrowRight size={12} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}