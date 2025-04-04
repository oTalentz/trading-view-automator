
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowUpDown, BarChart4 } from 'lucide-react';

interface StrategyInfoProps {
  strategy: string;
  indicators: string[];
  supportResistance: {
    support: number;
    resistance: number;
  };
}

export function StrategyInfo({ 
  strategy, 
  indicators, 
  supportResistance 
}: StrategyInfoProps) {
  const { t } = useLanguage();
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-indigo-100 dark:bg-indigo-900/20 flex-shrink-0 mt-1">
          <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t("strategy")}</h4>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{strategy}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {indicators.map((indicator, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal border-0"
              >
                {indicator}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/20 flex-shrink-0 mt-1">
          <ArrowUpDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t("supportResistance")}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
              <span className="text-xs text-green-800 dark:text-green-300 block mb-1">{t("support")}</span>
              <p className="font-mono font-bold text-green-700 dark:text-green-400 text-center">{supportResistance.support}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <span className="text-xs text-red-800 dark:text-red-300 block mb-1">{t("resistance")}</span>
              <p className="font-mono font-bold text-red-700 dark:text-red-400 text-center">{supportResistance.resistance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
