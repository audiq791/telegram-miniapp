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

      // Несколько способов определения масштаба
      const isLargeDisplay = window.matchMedia('(min-width: 414px)').matches;
      
      // Проверяем размер шрифта (увеличен при масштабировании)
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isZoomed = fontSize > 16; // базовый 16px
      
      // Проверяем соотношение окна к экрану
      const screenWidth = window.screen.width;
      const windowWidth = window.innerWidth;
      const scaleRatio = screenWidth / windowWidth;
      const isScaled = scaleRatio > 1.1; // если масштаб больше 1.1
      
      // Проверяем viewport
      const viewportWidth = window.innerWidth;
      const isNarrowViewport = viewportWidth < 380;

      setIsLargeScale(isLargeDisplay && (isZoomed || isNarrowViewport || isScaled));
    };

    checkScale();
    
    // Слушаем изменения
    window.addEventListener('resize', checkScale);
    window.addEventListener('orientationchange', checkScale);
    
    return () => {
      window.removeEventListener('resize', checkScale);
      window.removeEventListener('orientationchange', checkScale);
    };
  }, []);

  return isLargeScale;
}