
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { MarketCondition } from '@/utils/technicalAnalysis';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';

interface TimeframeCardProps {
  timeframeData: TimeframeAnalysis;
  isCurrentTimeframe: boolean;
  getMarketConditionDisplay: (condition: MarketCondition) => string;
  getTicketName: (direction: 'CALL' | 'PUT' | 'NEUTRAL') => string;
}

export function TimeframeCard({ 
  timeframeData, 
  isCurrentTimeframe,
  getMarketConditionDisplay,
  getTicketName
}: TimeframeCardProps) {
  const { t } = useLanguage();
  const { direction, label, marketCondition, confidence, timeframe } = timeframeData;

  return (
    <div 
      className={`border rounded-md p-2 ${
        isCurrentTimeframe 
          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : ''
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{label}</span>
        <div className={`flex items-center gap-1 ${
          direction === 'CALL' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {direction === 'CALL' 
            ? <ArrowUpCircle className="h-4 w-4" />
            : <ArrowDownCircle className="h-4 w-4" />
          }
          <span className="text-xs font-medium">{direction}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        {getMarketConditionDisplay(marketCondition)}
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs">{t("confidence")}</span>
        <span className="text-xs font-medium">{confidence}%</span>
      </div>
      <Progress value={confidence} className={`h-1 ${
        direction === 'CALL' 
          ? 'bg-green-100 dark:bg-green-900/20' 
          : 'bg-red-100 dark:bg-red-900/20'
      }`} />
      
      {/* Ticket label at bottom */}
      <div className="mt-2 py-1 text-center border-t">
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          direction === 'CALL'
            ? 'bg-green-100 dark:bg-green-800/20 text-green-700 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-400'
        }`}>
          {getTicketName(direction)}
        </span>
      </div>
    </div>
  );
}
