"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { IconButton } from "../components/ui";
import { useState } from "react";

const ALLOWED_SITES = ["pfc-cska.com", "cska.com"];

export default function WebViewScreen({ 
  url, 
  title, 
  onBack 
}: { 
  url: string; 
  title: string;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const isAllowed = ALLOWED_SITES.some(site => url.includes(site));

  if (!isAllowed) {
    return (
      <motion.div
        className="min-h-dvh bg-white flex flex-col"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <IconButton aria="back" onClick={onBack}>
              <ArrowLeft size={18} />
            </IconButton>
            <div className="font-semibold truncate">{title}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Сайт не открывается внутри приложения</h3>
          <p className="text-sm text-zinc-500 mb-6">
            {title} запрещает открывать свой сайт в iframe по соображениям безопасности.
          </p>
          <button
            onClick={() => window.open(url, '_blank')}
            className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-semibold flex items-center gap-2"
          >
            Открыть в браузере
            <ExternalLink size={18} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-dvh bg-white flex flex-col"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <IconButton aria="back" onClick={onBack}>
              <ArrowLeft size={18} />
            </IconButton>
            <div className="font-semibold truncate">{title}</div>
          </div>
          <IconButton aria="external" onClick={() => window.open(url, '_blank')}>
            <ExternalLink size={18} />
          </IconButton>
        </div>
      </div>

      {loading && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      )}

      <iframe
        src={url}
        className="flex-1 w-full"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{ border: 'none' }}
      />

      {error && (
        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Не удалось загрузить сайт</h3>
          <p className="text-sm text-zinc-500 mb-6 text-center">
            Возможно, сайт временно недоступен.
          </p>
          <button
            onClick={() => window.open(url, '_blank')}
            className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-semibold flex items-center gap-2"
          >
            Открыть в браузере
            <ExternalLink size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
}