"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Home } from "lucide-react";
import { IconButton } from "../components/ui";
import { useState } from "react";

export default function WebViewScreen({ 
  url, 
  title, 
  onBack, 
  onHome 
}: { 
  url: string; 
  title: string;
  onBack: () => void;
  onHome: () => void;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <motion.div
      className="min-h-[100dvh] bg-white flex flex-col"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      {/* Шапка с кнопками */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <IconButton aria="back" onClick={onBack}>
              <ArrowLeft size={18} />
            </IconButton>
            <div className="font-semibold truncate max-w-[150px]">{title}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconButton aria="home" onClick={onHome}>
              <Home size={18} />
            </IconButton>
            <IconButton aria="external" onClick={() => window.open(url, '_blank')}>
              <ExternalLink size={18} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Индикатор загрузки */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        </div>
      )}

      {/* WebView iframe */}
      <iframe
        src={url}
        className="flex-1 w-full"
        onLoad={() => setLoading(false)}
        style={{ border: 'none' }}
      />
    </motion.div>
  );
}