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
  
  // ОСТАЛЬНЫЕ ПАРТНЕРЫ (с нулевыми балансами)
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
  // ... остальные партнеры (можно сократить для краткости)
];