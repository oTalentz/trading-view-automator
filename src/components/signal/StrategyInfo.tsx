
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
    <div className="mb-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-indigo-100 dark:bg-indigo-900/20 flex-shrink-0 mt-1">
          <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("strategy")}</h4>
          <p className="font-semibold">{strategy}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {indicators.map((indicator, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="font-normal"
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
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("supportResistance")}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/10">
              <span className="text-xs text-green-800 dark:text-green-300">{t("support")}</span>
              <p className="font-mono font-semibold text-green-700 dark:text-green-400">{supportResistance.support}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10">
              <span className="text-xs text-red-800 dark:text-red-300">{t("resistance")}</span>
              <p className="font-mono font-semibold text-red-700 dark:text-red-400">{supportResistance.resistance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
