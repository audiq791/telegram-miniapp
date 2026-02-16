"use client";

import { useEffect, useState } from 'react';

// Типы iPhone с их характеристиками
type iPhoneModel = {
  name: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  isNonMax: boolean; // true для не-Max моделей
};

// База данных iPhone моделей
const iPhoneModels: iPhoneModel[] = [
  // iPhone SE (1st gen) и iPhone 5/5S
  { name: "iPhone 5/5S/SE", screenWidth: 320, screenHeight: 568, pixelRatio: 2, isNonMax: true },
  // iPhone 6/6S/7/8
  { name: "iPhone 6/7/8", screenWidth: 375, screenHeight: 667, pixelRatio: 2, isNonMax: true },
  // iPhone 6/6S/7/8 Plus
  { name: "iPhone 6/7/8 Plus", screenWidth: 414, screenHeight: 736, pixelRatio: 3, isNonMax: false },
  // iPhone X/XS/11 Pro
  { name: "iPhone X/XS/11 Pro", screenWidth: 375, screenHeight: 812, pixelRatio: 3, isNonMax: true },
  // iPhone XR/11
  { name: "iPhone XR/11", screenWidth: 414, screenHeight: 896, pixelRatio: 2, isNonMax: false },
  // iPhone XS Max/11 Pro Max
  { name: "iPhone XS Max/11 Pro Max", screenWidth: 414, screenHeight: 896, pixelRatio: 3, isNonMax: false },
  // iPhone 12/13/14/15/16 mini
  { name: "iPhone 12/13/14/15/16 mini", screenWidth: 375, screenHeight: 812, pixelRatio: 3, isNonMax: true },
  // iPhone 12/13/14/15/16
  { name: "iPhone 12/13/14/15/16", screenWidth: 390, screenHeight: 844, pixelRatio: 3, isNonMax: true },
  // iPhone 12/13/14/15/16 Pro
  { name: "iPhone 12/13/14/15/16 Pro", screenWidth: 390, screenHeight: 844, pixelRatio: 3, isNonMax: true },
  // iPhone 12/13/14/15/16 Pro Max
  { name: "iPhone 12/13/14/15/16 Pro Max", screenWidth: 428, screenHeight: 926, pixelRatio: 3, isNonMax: false },
  // iPhone 14/15/16 Plus
  { name: "iPhone 14/15/16 Plus", screenWidth: 428, screenHeight: 926, pixelRatio: 3, isNonMax: false },
];

export function useNonMaxiPhone() {
  const [isNonMaxiPhone, setIsNonMaxiPhone] = useState(false);
  const [deviceModel, setDeviceModel] = useState<string>("");

  useEffect(() => {
    const detectiPhoneModel = () => {
      // 1. Проверяем, что это iPhone
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isiPhone = /iPhone/.test(navigator.userAgent);
      
      if (!isIOS || !isiPhone) {
        setIsNonMaxiPhone(false);
        setDeviceModel("Not iPhone");
        return;
      }

      // 2. Получаем характеристики устройства
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const pixelRatio = window.devicePixelRatio;
      
      // 3. Пробуем найти точную модель в базе
      let matchedModel = iPhoneModels.find(model => 
        model.screenWidth === screenWidth && 
        model.screenHeight === screenHeight && 
        Math.abs(model.pixelRatio - pixelRatio) < 0.1
      );
      
      // 4. Если не нашли точную модель, определяем по ширине экрана
      if (!matchedModel) {
        // iPhone не-Max имеют ширину экрана <= 390
        const isNonMaxByWidth = screenWidth <= 390;
        
        // Проверяем масштаб (если увеличено)
        const viewportWidth = window.innerWidth;
        const scale = screenWidth / viewportWidth;
        const isZoomed = scale > 1.1;
        
        // Для отладки сохраняем модель
        setDeviceModel(`Unknown (${screenWidth}x${screenHeight}, ${pixelRatio})`);
        setIsNonMaxiPhone(isNonMaxByWidth && isZoomed);
        return;
      }

      // 5. Для точной модели определяем isNonMax
      setDeviceModel(matchedModel.name);
      setIsNonMaxiPhone(matchedModel.isNonMax);
      
      // 6. Дополнительно проверяем масштаб
      const viewportWidth = window.innerWidth;
      const scale = matchedModel.screenWidth / viewportWidth;
      const isZoomed = scale > 1.1;
      
      // Если масштаб включен, применяем адаптацию даже для Max моделей
      if (isZoomed) {
        setIsNonMaxiPhone(true);
      }
    };

    detectiPhoneModel();
    
    // Слушаем изменения
    window.addEventListener('resize', detectiPhoneModel);
    window.addEventListener('orientationchange', detectiPhoneModel);
    
    return () => {
      window.removeEventListener('resize', detectiPhoneModel);
      window.removeEventListener('orientationchange', detectiPhoneModel);
    };
  }, []);

  return { isNonMaxiPhone, deviceModel };
}