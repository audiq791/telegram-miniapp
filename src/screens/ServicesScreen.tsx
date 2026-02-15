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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Шапка прикреплена к верху */}
      <div className="bg-white border-b border-zinc-200 w-full flex-shrink-0">
        <div className="px-3 py-4">
          <h1 className="text-2xl font-bold text-zinc-900">Сервисы</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Услуги и преимущества для держателей бонусов
          </p>
        </div>
      </div>

      {/* Плитки вплотную к шапке и краям */}
      <div className="flex-1 px-1.5 pt-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-white rounded-lg border border-zinc-200 shadow-sm p-3 text-left relative flex flex-col h-full"
              >
                {/* Иконка */}
                <div className={`h-11 w-11 rounded-lg ${service.bgColor} flex items-center justify-center`}>
                  <Icon size={22} className={service.iconColor} />
                </div>

                {/* Текст */}
                <div className="mt-2.5 flex-1">
                  <h3 className="font-semibold text-zinc-900 text-sm">{service.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{service.description}</p>
                  
                  {/* Powered by Deepseek под описанием */}
                  {service.badge && (
                    <p className="text-[7px] text-zinc-400 mt-1.5">
                      {service.badge}
                    </p>
                  )}
                </div>

                {/* Стрелка для всех сервисов */}
                <div className="flex items-center gap-0.5 mt-2 text-[10px] text-zinc-400">
                  <span>Подробнее</span>
                  <ArrowRight size={10} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}