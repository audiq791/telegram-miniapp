"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Clock,
  BarChart3,
  LineChart,
  CandlestickChart,
  Settings2,
  X,
  ArrowUpDown,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { IconButton } from "../components/ui";

// Типы данных
type Pair = {
  id: string;
  baseAsset: string;
  quoteAsset: string;
  baseName: string;
  quoteName: string;
  baseLogo?: string;
  quoteLogo?: string;
  lastPrice: number;
  priceChange24h: number;
  volume24h: number;
  isFavorite: boolean;
};

type OrderBookItem = {
  price: number;
  amount: number;
  total: number;
};

type OrderType = "limit" | "market";
type OrderSide = "buy" | "sell";

// Демо-данные торговых пар
const PAIRS: Pair[] = [
  {
    id: "BON-USDT",
    baseAsset: "BON",
    quoteAsset: "USDT",
    baseName: "Bonus Token",
    quoteName: "Tether",
    lastPrice: 1.2456,
    priceChange24h: 2.34,
    volume24h: 1245678,
    isFavorite: true,
  },
  {
    id: "BON-RUB",
    baseAsset: "BON",
    quoteAsset: "RUB",
    baseName: "Bonus Token",
    quoteName: "Russian Ruble",
    lastPrice: 98.76,
    priceChange24h: -1.23,
    volume24h: 5678901,
    isFavorite: true,
  },
  {
    id: "VV-BON",
    baseAsset: "VV",
    quoteAsset: "BON",
    baseName: "ВкусВилл",
    quoteName: "Bonus Token",
    lastPrice: 0.5678,
    priceChange24h: 5.67,
    volume24h: 345678,
    isFavorite: false,
  },
  {
    id: "DODO-BON",
    baseAsset: "DODO",
    quoteAsset: "BON",
    baseName: "Додо Пицца",
    quoteName: "Bonus Token",
    lastPrice: 0.1234,
    priceChange24h: -2.45,
    volume24h: 234567,
    isFavorite: false,
  },
  {
    id: "CSKA-BON",
    baseAsset: "CSKA",
    quoteAsset: "BON",
    baseName: "ЦСКА",
    quoteName: "Bonus Token",
    lastPrice: 0.3456,
    priceChange24h: 1.23,
    volume24h: 123456,
    isFavorite: true,
  },
];

// Генерация стакана цен
const generateOrderBook = (basePrice: number, side: "bids" | "asks"): OrderBookItem[] => {
  const items: OrderBookItem[] = [];
  const count = 10;
  
  for (let i = 0; i < count; i++) {
    const priceDelta = side === "bids" 
      ? -0.01 * (i + 1) * Math.random() 
      : 0.01 * (i + 1) * Math.random();
    
    const price = basePrice * (1 + priceDelta);
    const amount = Math.random() * 1000 + 100;
    const total = price * amount;
    
    items.push({
      price: parseFloat(price.toFixed(4)),
      amount: parseFloat(amount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  }
  
  return items;
};

export default function MarketScreen({ onBack }: { onBack: () => void }) {
  const [selectedPair, setSelectedPair] = useState<Pair>(PAIRS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState(selectedPair.lastPrice.toString());
  const [showChartType, setShowChartType] = useState<"line" | "candle">("line");
  
  // Генерация стакана
  const [bids, setBids] = useState<OrderBookItem[]>([]);
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  
  useEffect(() => {
    // Обновляем стакан при смене пары
    setBids(generateOrderBook(selectedPair.lastPrice, "bids"));
    setAsks(generateOrderBook(selectedPair.lastPrice, "asks"));
    setOrderPrice(selectedPair.lastPrice.toString());
  }, [selectedPair]);

  // Фильтрация пар
  const filteredPairs = PAIRS.filter(pair => 
    pair.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.quoteAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.baseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume > 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
    if (volume > 1_000) return `${(volume / 1_000).toFixed(2)}K`;
    return volume.toString();
  };

  const handleCreateOrder = () => {
    console.log(`${orderSide === "buy" ? "Покупка" : "Продажа"} ${selectedPair.baseAsset}`, {
      type: orderType,
      price: orderPrice,
      amount: orderAmount,
    });
    alert(`${orderSide === "buy" ? "Покупка" : "Продажа"} ${orderAmount} ${selectedPair.baseAsset} по цене ${orderPrice} ${selectedPair.quoteAsset}`);
  };

  return (
    <motion.div
      className="min-h-dvh bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="mx-auto max-w-md px-4 pt-4 pb-8">
        {/* Шапка */}
        <div className="flex items-center gap-3 mb-4">
          <IconButton aria="back" onClick={onBack}>
            <ArrowUpDown size={18} />
          </IconButton>
          <div>
            <div className="text-[13px] text-zinc-500 leading-none">Биржа</div>
            <div className="text-xl font-semibold">Маркет</div>
          </div>
        </div>

        {/* Селектор пары */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowPairSelector(!showPairSelector)}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Sparkles size={20} className="text-zinc-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{selectedPair.baseAsset}/{selectedPair.quoteAsset}</div>
                <div className="text-xs text-zinc-500">{selectedPair.baseName} / {selectedPair.quoteName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold">{formatPrice(selectedPair.lastPrice)}</div>
                <div className={`text-xs ${selectedPair.priceChange24h >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {selectedPair.priceChange24h >= 0 ? "+" : ""}{selectedPair.priceChange24h}%
                </div>
              </div>
              <ChevronDown size={18} className={`text-zinc-400 transition-transform ${showPairSelector ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Выпадающий список пар */}
          <AnimatePresence>
            {showPairSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-96 overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-zinc-100 p-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск пары..."
                      className="w-full h-10 pl-9 pr-3 bg-zinc-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </div>
                </div>
                
                {filteredPairs.map(pair => (
                  <button
                    key={pair.id}
                    onClick={() => {
                      setSelectedPair(pair);
                      setShowPairSelector(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Star 
                        size={16} 
                        className={pair.isFavorite ? "text-amber-400 fill-amber-400" : "text-zinc-300"} 
                      />
                      <div>
                        <span className="font-medium">{pair.baseAsset}</span>
                        <span className="text-xs text-zinc-400 ml-1">/{pair.quoteAsset}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(pair.lastPrice)}</div>
                      <div className={`text-xs ${pair.priceChange24h >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {pair.priceChange24h >= 0 ? "+" : ""}{pair.priceChange24h}%
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Стакан цен */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Стакан цен</div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                <Settings2 size={16} className="text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Заголовки */}
          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-zinc-500">
            <div>Цена ({selectedPair.quoteAsset})</div>
            <div className="text-right">Объём ({selectedPair.baseAsset})</div>
            <div className="text-right">Сумма</div>
          </div>

          {/* Продажи (asks) */}
          <div className="space-y-1 mb-2">
            {asks.slice().reverse().map((ask, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-red-600 font-medium">{formatPrice(ask.price)}</div>
                <div className="text-right">{formatVolume(ask.amount)}</div>
                <div className="text-right text-zinc-600">{formatVolume(ask.total)}</div>
              </div>
            ))}
          </div>

          {/* Текущая цена */}
          <div className="py-2 border-y border-zinc-100 my-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Текущая цена</span>
              <span className="text-lg font-semibold text-zinc-900">{formatPrice(selectedPair.lastPrice)}</span>
            </div>
          </div>

          {/* Покупки (bids) */}
          <div className="space-y-1 mt-2">
            {bids.map((bid, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-emerald-600 font-medium">{formatPrice(bid.price)}</div>
                <div className="text-right">{formatVolume(bid.amount)}</div>
                <div className="text-right text-zinc-600">{formatVolume(bid.total)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* График */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">График цены</div>
            <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1">
              <button
                onClick={() => setShowChartType("line")}
                className={`p-1.5 rounded-md transition-colors ${
                  showChartType === "line" ? "bg-white shadow-sm" : "hover:bg-white/50"
                }`}
              >
                <LineChart size={16} className="text-zinc-600" />
              </button>
              <button
                onClick={() => setShowChartType("candle")}
                className={`p-1.5 rounded-md transition-colors ${
                  showChartType === "candle" ? "bg-white shadow-sm" : "hover:bg-white/50"
                }`}
              >
                <CandlestickChart size={16} className="text-zinc-600" />
              </button>
            </div>
          </div>

          {/* Микро-чарт */}
          <div className="h-32 w-full bg-zinc-50 rounded-lg relative overflow-hidden">
            {/* Здесь будет реальный график */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-zinc-400">Загрузка графика...</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
            <span>24ч объём: {formatVolume(selectedPair.volume24h)} {selectedPair.quoteAsset}</span>
            <span>Макс: {formatPrice(selectedPair.lastPrice * 1.05)}</span>
            <span>Мин: {formatPrice(selectedPair.lastPrice * 0.95)}</span>
          </div>
        </div>

        {/* Создание ордера */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setOrderSide("buy")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                orderSide === "buy"
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Купить
            </button>
            <button
              onClick={() => setOrderSide("sell")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                orderSide === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Продать
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setOrderType("limit")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                orderType === "limit"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Лимитный
            </button>
            <button
              onClick={() => setOrderType("market")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                orderType === "market"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Рыночный
            </button>
          </div>

          {orderType === "limit" && (
            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-1 block">Цена ({selectedPair.quoteAsset})</label>
              <div className="relative">
                <input
                  type="text"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-zinc-500 mb-1 block">Количество ({selectedPair.baseAsset})</label>
            <div className="relative">
              <input
                type="text"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-zinc-500">Всего:</span>
            <span className="font-semibold">
              {orderAmount && orderPrice
                ? formatPrice(parseFloat(orderAmount) * parseFloat(orderPrice))
                : "0.00"} {selectedPair.quoteAsset}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.02 }}
            onClick={handleCreateOrder}
            disabled={!orderAmount || parseFloat(orderAmount) <= 0}
            className={`w-full py-4 rounded-xl font-medium text-base transition-colors ${
              orderSide === "buy"
                ? "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-zinc-300"
                : "bg-red-500 text-white hover:bg-red-600 disabled:bg-zinc-300"
            }`}
          >
            {orderSide === "buy" ? "Купить" : "Продать"} {selectedPair.baseAsset}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}