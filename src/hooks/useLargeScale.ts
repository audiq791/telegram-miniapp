"use client";

import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    // Единственный надежный способ: сравнить реальный экран и видимую область
    const checkScale = () => {
      // iPhone с масштабом имеет visual viewport меньше screen
      const screenWidth = window.screen.width;
      const visualWidth = window.visualViewport?.width || window.innerWidth;
      
      // Если видимая область меньше 90% экрана - масштаб включен
      setIsLargeScale(visualWidth < screenWidth * 0.9);
    };

    checkScale();
    window.addEventListener('resize', checkScale);
    return () => window.removeEventListener('resize', checkScale);
  }, []);

  return isLargeScale;
}