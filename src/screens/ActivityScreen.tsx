"use client";

import { motion, PanInfo } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Repeat, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { IconButton } from "../components/ui";
import { useState, useMemo } from "react";
import { partnersSeed } from "../data/partners";

// ... остальные импорты и типы

export default function ActivityScreen({ onBack }: { onBack: () => void }) {
  // ... весь код без изменений

  // Обработчик свайпа вправо
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onBack();
    }
  };

  return (
    <motion.div
      className="min-h-[100dvh] bg-zinc-50"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
    >
      {/* ... весь остальной JSX */}
    </motion.div>
  );
}