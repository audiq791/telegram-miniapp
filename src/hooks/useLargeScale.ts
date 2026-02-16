"use client";

import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    const checkScale = () => {
      // 1. Проверяем, что это iPhone
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (!isIOS) {
        setIsLargeScale(false);
        return;
      }

      // 2. Проверяем масштаб через devicePixelRatio
      const pixelRatio = window.devicePixelRatio;
      const isZoomed = pixelRatio > 2; // На iPhone с масштабом pixelRatio > 2
      
      // 3. Проверяем ширину viewport (при масштабе она уменьшается)
      const viewportWidth = window.innerWidth;
      const isNarrowViewport = viewportWidth < 375; // iPhone SE ширина 375
      
      // 4. Проверяем размер шрифта
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isLargeFont = fontSize > 16;

      // Включаем адаптацию если хотя бы два условия совпадают
      const conditions = [isZoomed, isNarrowViewport, isLargeFont];
      const trueCount = conditions.filter(Boolean).length;
      
      setIsLargeScale(trueCount >= 2);
    };

    checkScale();
    
    // Проверяем при изменении размера и ориентации
    window.addEventListener('resize', checkScale);
    window.addEventListener('orientationchange', checkScale);
    
    return () => {
      window.removeEventListener('resize', checkScale);
      window.removeEventListener('orientationchange', checkScale);
    };
  }, []);

  return isLargeScale;
}