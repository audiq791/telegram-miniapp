"use client";

import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    // Просто проверяем ширину экрана
    const checkScale = () => {
      setIsLargeScale(window.innerWidth < 380);
    };

    checkScale();
    window.addEventListener('resize', checkScale);
    return () => window.removeEventListener('resize', checkScale);
  }, []);

  return isLargeScale;
}