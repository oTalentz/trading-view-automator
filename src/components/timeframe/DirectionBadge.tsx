
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DirectionBadgeProps {
  direction: 'CALL' | 'PUT' | 'NEUTRAL';
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
      direction === 'CALL' ? 'bg-green-500' : 
      direction === 'PUT' ? 'bg-red-500' : 'bg-amber-500'
    }`}>
      {direction === 'CALL' ? t("bullish") : 
       direction === 'PUT' ? t("bearish") : t("neutral")}
    </div>
  );
}
