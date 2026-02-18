"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  ChevronDown,
  CandlestickChart,
  Settings2,
  ArrowUpDown,
  Sparkles,
  Zap
} from "lucide-react";
import { IconButton } from "../components/ui";

// Типы данных
type Pair = {
  id: string;
  baseAsset: string;
  quoteAsset: string;
  baseName: string;
  quoteName: string;
  lastPrice: number;
  priceChange24h: number;
  volume24h: number;
  isFavorite: boolean;
};

type OrderBookItem = {
  price: number;
  amount: number;
  total: number;
  depth: number;
};

type OrderType = "limit" | "market";
type OrderSide = "buy" | "sell";
type Timeframe = "1h" | "24h" | "7d" | "30d";

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
];

// Генерация данных для свечного графика с реалистичными значениями
const generateCandleData = (count: number, basePrice: number) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < count; i++) {
    const trend = Math.sin(i * 0.5) * 0.02;
    const volatility = 0.03;
    
    const open = currentPrice;
    const change = (Math.random() - 0.5 + trend) * volatility * currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice;
    
    data.push({
      time: i,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000 + 100,
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Генерация стакана цен
const generateOrderBook = (basePrice: number, side: "bids" | "asks"): OrderBookItem[] => {
  const items: OrderBookItem[] = [];
  const count = 12;
  const maxDepth = 100;
  
  for (let i = 0; i < count; i++) {
    const priceDelta = side === "bids" 
      ? -0.01 * (i + 1) * (0.8 + Math.random() * 0.4)
      : 0.01 * (i + 1) * (0.8 + Math.random() * 0.4);
    
    const price = basePrice * (1 + priceDelta);
    const amount = Math.random() * 1000 + 200;
    const total = price * amount;
    const depth = (maxDepth - i * (maxDepth / count)) * (0.7 + Math.random() * 0.3);
    
    items.push({
      price: parseFloat(price.toFixed(4)),
      amount: parseFloat(amount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      depth,
    });
  }
  
  return side === "bids" 
    ? items.sort((a, b) => b.price - a.price)
    : items.sort((a, b) => a.price - b.price);
};

// Компонент свечного графика
function CandleChart({ data, height = 168 }: { data: any[]; height?: number }) {
  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const range = maxPrice - minPrice || 1;
  
  const getY = (price: number) => ((maxPrice - price) / range) * height;
  
  return (
    <div className="relative w-full h-full">
      {data.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const highY = getY(candle.high);
        const lowY = getY(candle.low);
        const openY = getY(candle.open);
        const closeY = getY(candle.close);
        
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = bodyBottom - bodyTop;
        const xPos = (i / data.length) * 100;
        const width = 80 / data.length;
        
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${xPos}%`,
              width: `${width}%`,
              height: '100%',
              transform: 'translateX(-40%)',
            }}
          >
            {/* Верхний фитиль */}
            <motion.div
              className={`absolute w-0.5 ${isGreen ? 'bg-emerald-500/40' : 'bg-rose-500/40'}`}
              style={{
                height: highY - bodyTop,
                top: highY,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.05 + 0.2 }}
            />
            
            {/* Тело свечи */}
            <motion.div
              className={`absolute w-3/4 ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'} rounded-sm`}
              style={{
                height: bodyHeight,
                top: bodyTop,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
            />
            
            {/* Нижний фитиль */}
            <motion.div
              className={`absolute w-0.5 ${isGreen ? 'bg-emerald-500/40' : 'bg-rose-500/40'}`}
              style={{
                height: bodyBottom - lowY,
                top: bodyBottom,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.05 + 0.2 }}
            />
            
            {/* Пульсация */}
            <motion.div
              className={`absolute w-full h-full ${isGreen ? 'bg-emerald-500/5' : 'bg-rose-500/5'}`}
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function MarketScreen({ onBack }: { onBack: () => void }) {
  const [selectedPair, setSelectedPair] = useState<Pair>(PAIRS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("limit");
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState(selectedPair.lastPrice.toString());
  const [timeframe, setTimeframe] = useState<Timeframe>("24h");
  
  const candleData = useMemo(() => 
    generateCandleData(30, selectedPair.lastPrice), [selectedPair, timeframe]);
  
  const [bids, setBids] = useState<OrderBookItem[]>([]);
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  
  useEffect(() => {
    setBids(generateOrderBook(selectedPair.lastPrice, "bids"));
    setAsks(generateOrderBook(selectedPair.lastPrice, "asks"));
    setOrderPrice(selectedPair.lastPrice.toString());
  }, [selectedPair]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBids(prev => generateOrderBook(selectedPair.lastPrice, "bids"));
      setAsks(prev => generateOrderBook(selectedPair.lastPrice, "asks"));
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedPair]);

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
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPairSelector(!showPairSelector)}
            className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{selectedPair.baseAsset}/{selectedPair.quoteAsset}</div>
                <div className="text-xs text-zinc-500">{selectedPair.baseName} / {selectedPair.quoteName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold">{formatPrice(selectedPair.lastPrice)}</div>
                <motion.div 
                  className={`text-xs ${selectedPair.priceChange24h >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  key={selectedPair.priceChange24h}
                >
                  {selectedPair.priceChange24h >= 0 ? "+" : ""}{selectedPair.priceChange24h}%
                </motion.div>
              </div>
              <ChevronDown size={18} className={`text-zinc-400 transition-transform ${showPairSelector ? "rotate-180" : ""}`} />
            </div>
          </motion.button>

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
                  <motion.button
                    key={pair.id}
                    whileHover={{ backgroundColor: "#f4f4f5" }}
                    onClick={() => {
                      setSelectedPair(pair);
                      setShowPairSelector(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between transition-colors"
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
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* График */}
        <motion.div 
          className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">График</span>
              <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-0.5">
                {["1h", "24h", "7d", "30d"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf as Timeframe)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      timeframe === tf ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-1.5 rounded-md bg-zinc-100">
              <CandlestickChart size={16} className="text-zinc-600" />
            </div>
          </div>

          {/* Свечной график */}
          <div className="relative h-44 w-full border border-zinc-100 rounded-lg bg-zinc-50/50 overflow-hidden">
            {/* Сетка */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="border-b border-zinc-200/30 w-full h-0" />
                ))}
              </div>
              <div className="absolute inset-0 flex justify-between pointer-events-none px-2">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-l border-zinc-200/30 h-full w-0" />
                ))}
              </div>
            </div>

            {/* Свечи */}
            <div className="absolute inset-0 px-2 py-1">
              <CandleChart data={candleData} height={168} />
            </div>
          </div>

          {/* Информация под графиком */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-zinc-500">Open</span>
                <span className="ml-2 font-medium">{formatPrice(candleData[0]?.open || 0)}</span>
              </div>
              <div>
                <span className="text-zinc-500">High</span>
                <span className="ml-2 font-medium text-emerald-600">
                  {formatPrice(Math.max(...candleData.map(d => d.high)))}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Low</span>
                <span className="ml-2 font-medium text-rose-600">
                  {formatPrice(Math.min(...candleData.map(d => d.low)))}
                </span>
              </div>
            </div>
            <div className="text-zinc-500">
              Vol: {formatVolume(selectedPair.volume24h)} {selectedPair.quoteAsset}
            </div>
          </div>
        </motion.div>

        {/* Стакан цен */}
        <motion.div 
          className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Стакан цен</div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-zinc-400"
              >
                <Zap size={14} />
              </motion.div>
              <button className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                <Settings2 size={16} className="text-zinc-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-zinc-500">
            <div>Цена ({selectedPair.quoteAsset})</div>
            <div className="text-right">Объём ({selectedPair.baseAsset})</div>
            <div className="text-right">Сумма</div>
          </div>

          {/* Продажи */}
          <div className="space-y-1 mb-2">
            {asks.map((ask, i) => (
              <motion.div
                key={i}
                className="relative grid grid-cols-3 gap-2 text-xs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <motion.div
                  className="absolute right-0 h-full bg-rose-500/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${ask.depth}%` }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{ borderRadius: '4px 0 0 4px' }}
                />
                <div className="relative text-rose-600 font-medium z-10">{formatPrice(ask.price)}</div>
                <div className="relative text-right z-10">{formatVolume(ask.amount)}</div>
                <div className="relative text-right text-zinc-600 z-10">{formatVolume(ask.total)}</div>
              </motion.div>
            ))}
          </div>

          {/* Текущая цена */}
          <motion.div 
            className="py-2 border-y border-zinc-100 my-2"
            animate={{ 
              scale: [1, 1.02, 1],
              backgroundColor: ["transparent", "#f4f4f5", "transparent"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Текущая цена</span>
              <motion.span 
                className="text-lg font-semibold text-zinc-900"
                key={selectedPair.lastPrice}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {formatPrice(selectedPair.lastPrice)}
              </motion.span>
            </div>
          </motion.div>

          {/* Покупки */}
          <div className="space-y-1 mt-2">
            {bids.map((bid, i) => (
              <motion.div
                key={i}
                className="relative grid grid-cols-3 gap-2 text-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <motion.div
                  className="absolute left-0 h-full bg-emerald-500/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${bid.depth}%` }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{ borderRadius: '0 4px 4px 0' }}
                />
                <div className="relative text-emerald-600 font-medium z-10">{formatPrice(bid.price)}</div>
                <div className="relative text-right z-10">{formatVolume(bid.amount)}</div>
                <div className="relative text-right text-zinc-600 z-10">{formatVolume(bid.total)}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-between text-xs text-zinc-500">
            <span>Спред</span>
            <span className="font-medium text-zinc-700">
              {formatPrice(asks[0]?.price - bids[0]?.price)} ({((asks[0]?.price - bids[0]?.price) / selectedPair.lastPrice * 100).toFixed(2)}%)
            </span>
          </div>
        </motion.div>

        {/* Создание ордера */}
        <motion.div 
          className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderSide("buy")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                orderSide === "buy"
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Купить
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderSide("sell")}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                orderSide === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Продать
            </motion.button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderType("limit")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                orderType === "limit"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Лимитный
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOrderType("market")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                orderType === "market"
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Рыночный
            </motion.button>
          </div>

          {orderType === "limit" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <label className="text-xs text-zinc-500 mb-1 block">Цена ({selectedPair.quoteAsset})</label>
              <div className="relative">
                <input
                  type="text"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
            </motion.div>
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
            <motion.span 
              className="font-semibold"
              key={orderAmount + orderPrice}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.2 }}
            >
              {orderAmount && orderPrice
                ? formatPrice(parseFloat(orderAmount) * parseFloat(orderPrice))
                : "0.00"} {selectedPair.quoteAsset}
            </motion.span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
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
        </motion.div>
      </div>
    </motion.div>
  );
}