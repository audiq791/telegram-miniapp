"use client";

import { motion, PanInfo } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { IconButton } from "../components/ui";
import { useState } from "react";

// Список сайтов, которые можно открывать в iframe
const IFRAME_ALLOWED = [
  "pfc-cska.com",
  "cska.com"
];

export default function PartnerSiteScreen({ 
  url, 
  title,
  logo,
  fallbackColor,
  onBack, 
}: { 
  url: string; 
  title: string;
  logo: string;
  fallbackColor: string;
  onBack: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  
  // Проверяем, можно ли открыть в iframe
  const canUseIframe = IFRAME_ALLOWED.some(site => url.includes(site));

  // Обработчик свайпа вправо
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const isHorizontalSwipe = Math.abs(info.offset.x) > Math.abs(info.offset.y) * 2;
    
    if (isHorizontalSwipe && info.offset.x > 100) {
      onBack();
    }
  };

  // Если можно открыть в iframe (только ЦСКА)
  if (canUseIframe) {
    return (
      <motion.div
        className="min-h-dvh bg-white flex flex-col"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        dragPropagation={false}
        dragMomentum={false}
      >
        {/* Шапка: только назад и внешний браузер */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <IconButton aria="back" onClick={onBack}>
                <ArrowLeft size={18} />
              </IconButton>
              <div className="font-semibold truncate max-w-37.5">{title}</div>
            </div>
            
            <IconButton aria="external" onClick={() => window.open(url, '_blank')}>
              <ExternalLink size={18} />
            </IconButton>
          </div>
        </div>

        {/* Индикатор загрузки */}
        {iframeLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          </div>
        )}

        {/* WebView iframe для ЦСКА */}
        <iframe
          src={url}
          className="flex-1 w-full"
          onLoad={() => setIframeLoading(false)}
          style={{ border: 'none' }}
        />
      </motion.div>
    );
  }

  // Для остальных партнеров показываем красивый экран с лого и кнопкой
  return (
    <motion.div
      className="min-h-dvh bg-zinc-50 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      dragPropagation={false}
      dragMomentum={false}
    >
      {/* Шапка: только назад */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <IconButton aria="back" onClick={onBack}>
            <ArrowLeft size={18} />
          </IconButton>
          <div className="font-semibold truncate">{title}</div>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Большой логотип */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-3xl bg-white border border-zinc-200 shadow-lg flex items-center justify-center overflow-hidden">
            {logo && !imageError ? (
              <img 
                src={logo} 
                alt={title}
                className="w-full h-full object-contain p-3"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full bg-linear-to-br ${fallbackColor}`} />
            )}
          </div>
        </motion.div>

        {/* Название партнера */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          {title}
        </motion.h2>

        {/* Описание */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-zinc-500 text-center mb-8"
        >
          Перейдите на сайт партнера чтобы узнать больше о бонусах и акциях
        </motion.p>

        {/* Кнопка перехода на сайт */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open(url, '_blank')}
          className="w-full max-w-sm bg-zinc-900 text-white rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-zinc-800 transition-colors"
        >
          Перейти на сайт {title}
          <ExternalLink size={18} />
        </motion.button>

        {/* Дополнительная информация */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-zinc-400 mt-6 text-center"
        >
          Сайт откроется во внешнем браузере
        </motion.p>
      </div>
    </motion.div>
  );
}