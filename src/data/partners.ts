export type Partner = {
  id: string;
  name: string;
  balance: number;
  unit: string;
  logo: string;
  fallbackColor: string;
};

// Генерируем случайные балансы для первых 5 партнеров
const generateRandomBalance = () => Math.floor(Math.random() * 5000) + 100;

export const partnersSeed: Partner[] = [
  // ПРИОРИТЕТНЫЕ ПАРТНЕРЫ (со случайными балансами)
  { 
    id: "vv", 
    name: "ВкусВилл", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/vkusvill.svg",
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
  { 
    id: "dodo", 
    name: "DODO PIZZA", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/dodo.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "cska", 
    name: "CSKA", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/cska.svg",
    fallbackColor: "from-blue-400 to-blue-600" 
  },
  { 
    id: "wb", 
    name: "Wildberries", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/wildberries.svg",
    fallbackColor: "from-purple-400 to-purple-600" 
  },
  { 
    id: "cofix", 
    name: "Cofix", 
    balance: generateRandomBalance(), 
    unit: "B", 
    logo: "/logos/cofix.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  
  // ОСТАЛЬНЫЕ ПАРТНЕРЫ (с нулевыми балансами) - ВСЕ 28 ШТУК
  { 
    id: "fuel", 
    name: "FUEL", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-fuchsia-500 to-indigo-500" 
  },
  { 
    id: "magnolia", 
    name: "Магнолия", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-lime-400 to-green-600" 
  },
  { 
    id: "piligrim", 
    name: "Пилигрим", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-sky-500 to-blue-700" 
  },
  { 
    id: "cafe12", 
    name: "12 Grand Cafe", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-zinc-700 to-zinc-900" 
  },
  { 
    id: "airo", 
    name: "AIRO", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-slate-600 to-slate-900" 
  },
  { 
    id: "baba", 
    name: "Баба Марта", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-rose-400 to-rose-600" 
  },
  { 
    id: "shashlyk", 
    name: "Шашлычный Дворик", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-orange-400 to-orange-600" 
  },
  { 
    id: "little", 
    name: "Little Caesars Pizza", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/littlecaesars.svg",
    fallbackColor: "from-yellow-400 to-yellow-600" 
  },
  { 
    id: "cecenco", 
    name: "ČEČENCO", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-amber-400 to-amber-600" 
  },
  { 
    id: "coffee", 
    name: "Coffee Bean", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/coffeebean.svg",
    fallbackColor: "from-brown-400 to-brown-600" 
  },
  { 
    id: "dobro", 
    name: "Добро", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-green-400 to-green-600" 
  },
  { 
    id: "ecomarket", 
    name: "Еcomarket", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-teal-400 to-teal-600" 
  },
  { 
    id: "everon", 
    name: "Эверон", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-cyan-400 to-cyan-600" 
  },
  { 
    id: "fly", 
    name: "FLY", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-sky-400 to-sky-600" 
  },
  { 
    id: "gcoin", 
    name: "G-coin", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-indigo-400 to-indigo-600" 
  },
  { 
    id: "halal", 
    name: "Halal Guide", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
  { 
    id: "italian", 
    name: "Итальянец", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-stone-400 to-stone-600" 
  },
  { 
    id: "ku", 
    name: "[KU:] Ramen", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-zinc-400 to-zinc-600" 
  },
  { 
    id: "lpg", 
    name: "LPG", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-purple-400 to-purple-600" 
  },
  { 
    id: "moscow", 
    name: "Moscow Coffee & Food", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-pink-400 to-pink-600" 
  },
  { 
    id: "mpr", 
    name: "МПР", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-gray-400 to-gray-600" 
  },
  { 
    id: "mymy", 
    name: "МУ-МУ", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-slate-400 to-slate-600" 
  },
  { 
    id: "oneprice", 
    name: "OnePriceCoffee", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-amber-400 to-amber-600" 
  },
  { 
    id: "papajohns", 
    name: "Папа Джонс", 
    balance: 0, 
    unit: "B", 
    logo: "/logos/papajohns.svg",
    fallbackColor: "from-red-400 to-red-600" 
  },
  { 
    id: "pomidorka", 
    name: "Помидорка", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-rose-400 to-rose-600" 
  },
  { 
    id: "promille", 
    name: "0.5 Промилле", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-blue-400 to-blue-600" 
  },
  { 
    id: "salvatore", 
    name: "Остерия У Сальваторе", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-stone-400 to-stone-600" 
  },
  { 
    id: "sandwich", 
    name: "Sandwich Hunters", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-yellow-400 to-yellow-600" 
  },
  { 
    id: "shawarma", 
    name: "Shawarma Bar", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-orange-400 to-orange-600" 
  },
  { 
    id: "shuval", 
    name: "Шуваловская", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-teal-400 to-teal-600" 
  },
  { 
    id: "sparta", 
    name: "Sparta Gyros", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-green-400 to-green-600" 
  },
  { 
    id: "yoda", 
    name: "Yoda Thai Food", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-pink-400 to-pink-600" 
  },
  { 
    id: "zakyat", 
    name: "Закят", 
    balance: 0, 
    unit: "B", 
    logo: "", 
    fallbackColor: "from-emerald-400 to-emerald-600" 
  },
];