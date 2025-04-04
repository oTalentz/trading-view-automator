
import React from 'react';
import { LineChart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TechnicalAnalysisProps {
  technicalScores: {
    rsi: number;
    macd: number;
    bollingerBands: number;
    volumeTrend: number;
    priceAction?: number;
    overallScore?: number;
  };
  trendStrength: number;
}

export function TechnicalAnalysis({ technicalScores, trendStrength }: TechnicalAnalysisProps) {
  const { t } = useLanguage();
  
  return (
    <div className="mt-3">
      <div className="text-sm font-medium flex items-center gap-1 mb-1">
        <LineChart className="h-4 w-4" />
        {t("technicalAnalysis")}:
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">RSI</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${technicalScores.rsi}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">MACD</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${technicalScores.macd}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Bollinger</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${technicalScores.bollingerBands}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t("volume")}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${technicalScores.volumeTrend}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="text-sm font-medium">{t("trendStrength")}:</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
          <div 
            className={`h-2.5 rounded-full ${
              trendStrength > 80 ? 'bg-green-600' : 
              trendStrength > 70 ? 'bg-lime-500' : 
              trendStrength > 60 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${trendStrength}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
