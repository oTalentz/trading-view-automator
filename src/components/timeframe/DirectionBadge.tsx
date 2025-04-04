
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DirectionColors, Direction } from '@/utils/colorSystem';

interface DirectionBadgeProps {
  direction: Direction;
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  const { t } = useLanguage();
  
  return (
    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${DirectionColors[direction].bg}`}>
      {direction === 'CALL' ? t("bullish") : 
       direction === 'PUT' ? t("bearish") : t("neutral")}
    </div>
  );
}
