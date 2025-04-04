
import React from 'react';
import { BarChart3, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StrategyInfoProps {
  strategy: string;
  indicators: string[];
  supportResistance?: {
    support: number;
    resistance: number;
  };
}

export function StrategyInfo({ strategy, indicators, supportResistance }: StrategyInfoProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      <h4 className="font-medium mb-1 flex items-center gap-1">
        <BarChart3 className="h-4 w-4" />
        {t("strategy")}: {strategy}
      </h4>
      <div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
          <Layers className="h-4 w-4" />
          {t("basedOn")}:
        </div>
        <ul className="list-disc list-inside text-sm">
          {indicators.map((indicator, index) => (
            <li key={index}>{indicator}</li>
          ))}
        </ul>
      </div>
      
      {supportResistance && (
        <div className="mt-2 text-sm">
          <div className="font-medium">{t("keyLevels")}:</div>
          <div className="flex justify-between mt-1">
            <span className="text-green-600 dark:text-green-400">{t("support")}: {supportResistance.support}</span>
            <span className="text-red-600 dark:text-red-400">{t("resistance")}: {supportResistance.resistance}</span>
          </div>
        </div>
      )}
    </div>
  );
}
