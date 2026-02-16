"use client";

import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    const checkScale = () => {
      // Проверяем, что это iPhone
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (!isIOS) {
        setIsLargeScale(false);
        return;
      }

      // Определяем масштаб по нескольким параметрам
      const screenWidth = window.screen.width;
      const viewportWidth = window.innerWidth;
      const scale = screenWidth / viewportWidth;
      
      // Проверяем размер шрифта
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isZoomed = fontSize > 16 || scale > 1.1;
      
      // Для iPhone не-Max (ширина экрана <= 390)
      const isNonMaxiPhone = screenWidth <= 390;
      
      // Включаем режим масштаба если:
      // 1. Это iPhone не-Max И
      // 2. Масштаб увеличен
      setIsLargeScale(isNonMaxiPhone && isZoomed);
    };

    checkScale();
    
    window.addEventListener('resize', checkScale);
    window.addEventListener('orientationchange', checkScale);
    
    return () => {
      window.removeEventListener('resize', checkScale);
      window.removeEventListener('orientationchange', checkScale);
    };
  }, []);

  return isLargeScale;
}