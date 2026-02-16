"use client";

import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    const checkScale = () => {
      // iOS увеличивает масштаб через изменение размеров окна
      const screenWidth = window.screen.width;
      const windowWidth = window.innerWidth;
      
      // Если ширина окна заметно меньше ширины экрана — значит включён масштаб
      const scale = screenWidth / windowWidth;
      
      // Порог: если масштаб больше 1.15 — значит реально крупно
      setIsLargeScale(scale > 1.15);
    };

    checkScale();
    
    // Проверяем при изменении размера (поворот экрана и т.д.)
    window.addEventListener('resize', checkScale);
    
    return () => window.removeEventListener('resize', checkScale);
  }, []);

  return isLargeScale;
}