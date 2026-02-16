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

      // Получаем ширину экрана устройства
      const screenWidth = window.screen.width;
      const viewportWidth = window.innerWidth;
      
      // iPhone не-Max имеют ширину экрана 375px или 390px
      const isNonMaxiPhone = screenWidth <= 390;
      
      // Проверяем масштаб (отношение экрана к viewport)
      const scale = screenWidth / viewportWidth;
      const isZoomed = scale > 1.1;
      
      // Проверяем размер шрифта
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isLargeFont = fontSize > 16;
      
      // Включаем адаптацию если:
      // 1. Это iPhone не-Max И
      // 2. Масштаб увеличен ИЛИ шрифт большой
      setIsLargeScale(isNonMaxiPhone && (isZoomed || isLargeFont));
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