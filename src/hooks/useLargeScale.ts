import { useEffect, useState } from 'react';

export function useLargeScale() {
  const [isLargeScale, setIsLargeScale] = useState(false);

  useEffect(() => {
    const checkScale = () => {
      // Проверяем, что это iPhone (iOS)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (!isIOS) {
        setIsLargeScale(false);
        return;
      }

      // Определяем крупный масштаб через matchMedia
      // В iOS крупный масштаб = min-width: 414px и font-scale > 1
      const isLargeDisplay = window.matchMedia('(min-width: 414px)').matches;
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const isLargeFont = fontSize > 16; // базовый 16px, если больше — масштаб увеличен

      setIsLargeScale(isLargeDisplay && isLargeFont);
    };

    checkScale();
    window.addEventListener('resize', checkScale);
    return () => window.removeEventListener('resize', checkScale);
  }, []);

  return isLargeScale;
}