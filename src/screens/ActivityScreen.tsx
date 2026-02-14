"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Repeat, CheckCircle, Clock } from "lucide-react";
import { IconButton } from "../components/ui";

type Transaction = {
  id: string;
  type: "spend" | "receive" | "exchange";
  amount: number;
  partner: string;
  date: string;
  status: "completed" | "pending";
};

// Демо-данные для истории
const demoTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 500,
    partner: "ВкусВилл",
    date: "14 фев 2026",
    status: "completed"
  },
  {
    id: "2",
    type: "spend",
    amount: 350,
    partner: "DODO PIZZA",
    date: "13 фев 2026",
    status: "completed"
  },
  {
    id: "3",
    type: "exchange",
    amount: 200,
    partner: "CSKA → Wildberries",
    date: "12 фев 2026",
    status: "completed"
  },
  {
    id: "4",
    type: "receive",
    amount: 1000,
    partner: "Cofix",
    date: "10 фев 2026",
    status: "completed"
  },
  {
    id: "5",
    type: "spend",
    amount: 150,
    partner: "Кофе",
    date: "9 фев 2026",
    status: "completed"
  },
  {
    id: "6",
    type: "exchange",
    amount: 300,
    partner: "ВкусВилл → DODO",
    date: "8 фев 2026",
    status: "pending"
  },
];

const getIcon = (type: string) => {
  switch(type) {
    case "spend": return <ArrowUpRight size={18} className="text-red-500" />;
    case "receive": return <ArrowDownLeft size={18} className="text-green-500" />;
    case "exchange": return <Repeat size={18} className="text-blue-500" />;
    default: return <Clock size={18} className="text-zinc-400" />;
  }
};

const getTitle = (type: string) => {
  switch(type) {
    case "spend": return "Списание";
    case "receive": return "Начисление";
    case "exchange": return "Обмен";
    default: return "";
  }
};

export default function ActivityScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4">
        {/* Шапка */}
        <div className="flex items-center gap-3 mb-6">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div>
            <div className="text-[13px] text-zinc-500 leading-none">История</div>
            <div className="text-xl font-semibold">Активность</div>
          </div>
        </div>

        {/* Сводка */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-sm">
            <div className="text-xs text-zinc-500">Начислено</div>
            <div className="text-lg font-semibold text-green-600">+1 500</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-sm">
            <div className="text-xs text-zinc-500">Списано</div>
            <div className="text-lg font-semibold text-red-600">-500</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-sm">
            <div className="text-xs text-zinc-500">Обмены</div>
            <div className="text-lg font-semibold text-blue-600">500</div>
          </div>
        </div>

        {/* История транзакций */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-500 px-1 mb-2">
            Последние операции
          </div>
          
          {demoTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-semibold">{getTitle(tx.type)}</div>
                    <div className="text-xs text-zinc-500">{tx.partner}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    tx.type === "spend" ? "text-red-600" : 
                    tx.type === "receive" ? "text-green-600" : 
                    "text-blue-600"
                  }`}>
                    {tx.type === "spend" ? "-" : "+"}{tx.amount} B
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                    {tx.status === "pending" && <Clock size={12} className="text-zinc-400" />}
                    {tx.status === "completed" && <CheckCircle size={12} className="text-green-500" />}
                    {tx.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Кнопка загрузить еще */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 rounded-2xl bg-white border border-zinc-200 shadow-sm text-zinc-600 font-medium"
        >
          Загрузить еще
        </motion.button>
      </div>
    </motion.div>
  );
}