
import React from 'react';
import { TimeframeAnalysis } from '@/types/timeframeAnalysis';
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MarketCondition } from '@/utils/technicalAnalysis';
import { Progress } from '@/components/ui/progress';

interface TimeframeConfluenceProps {
  timeframes: TimeframeAnalysis[];
  overallConfluence: number;
  confluenceDirection: 'CALL' | 'PUT' | 'NEUTRAL';
  currentTimeframe: string;
}

export function TimeframeConfluence({ 
  timeframes,
  overallConfluence,
  confluenceDirection,
  currentTimeframe 
}: TimeframeConfluenceProps) {
  const { t, language } = useLanguage();

  // Traduz condições de mercado para exibição
  const getMarketConditionDisplay = (condition: MarketCondition): string => {
    if (language === 'pt-br') {
      switch (condition) {
        case MarketCondition.STRONG_TREND_UP: return "Tendência Forte de Alta";
        case MarketCondition.TREND_UP: return "Tendência de Alta";
        case MarketCondition.SIDEWAYS: return "Mercado Lateral";
        case MarketCondition.TREND_DOWN: return "Tendência de Baixa";
        case MarketCondition.STRONG_TREND_DOWN: return "Tendência Forte de Baixa";
        case MarketCondition.VOLATILE: return "Mercado Volátil";
        default: return "Desconhecido";
      }
    } else {
      switch (condition) {
        case MarketCondition.STRONG_TREND_UP: return "Strong Uptrend";
        case MarketCondition.TREND_UP: return "Uptrend";
        case MarketCondition.SIDEWAYS: return "Sideways Market";
        case MarketCondition.TREND_DOWN: return "Downtrend";
        case MarketCondition.STRONG_TREND_DOWN: return "Strong Downtrend";
        case MarketCondition.VOLATILE: return "Volatile Market";
        default: return "Unknown";
      }
    }
  };

  // Função para obter o nome traduzido do ticket
  const getTicketName = (direction: 'CALL' | 'PUT'): string => {
    if (language === 'pt-br') {
      return direction === 'CALL' ? 'ALTA' : 'BAIXA';
    }
    return direction;
  };

  return (
    <div className="border rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> {t("timeframeConfluence")}
        </h3>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
          confluenceDirection === 'CALL' ? 'bg-green-500' : 
          confluenceDirection === 'PUT' ? 'bg-red-500' : 'bg-amber-500'
        }`}>
          {confluenceDirection === 'CALL' ? t("bullish") : 
           confluenceDirection === 'PUT' ? t("bearish") : t("neutral")}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">{t("confluenceLevel")}</span>
          <span className={`text-sm font-medium ${
            overallConfluence > 70 ? 'text-green-600 dark:text-green-400' : 
            overallConfluence > 40 ? 'text-amber-600 dark:text-amber-400' : 
            'text-gray-600 dark:text-gray-400'
          }`}>{overallConfluence}%</span>
        </div>
        <Progress value={overallConfluence} className={
          confluenceDirection === 'CALL' ? 'bg-green-100 dark:bg-green-900/20' :
          confluenceDirection === 'PUT' ? 'bg-red-100 dark:bg-red-900/20' :
          'bg-amber-100 dark:bg-amber-900/20'
        } />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {timeframes.map((tf) => (
          <div 
            key={tf.timeframe}
            className={`border rounded-md p-2 ${
              tf.timeframe === currentTimeframe 
              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : ''
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{tf.label}</span>
              <div className={`flex items-center gap-1 ${
                tf.direction === 'CALL' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
              }`}>
                {tf.direction === 'CALL' 
                  ? <ArrowUpCircle className="h-4 w-4" />
                  : <ArrowDownCircle className="h-4 w-4" />
                }
                <span className="text-xs font-medium">{tf.direction}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {getMarketConditionDisplay(tf.marketCondition)}
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs">{t("confidence")}</span>
              <span className="text-xs font-medium">{tf.confidence}%</span>
            </div>
            <Progress value={tf.confidence} className={`h-1 ${
              tf.direction === 'CALL' 
              ? 'bg-green-100 dark:bg-green-900/20' 
              : 'bg-red-100 dark:bg-red-900/20'
            }`} />
            
            {/* Ticket label at bottom */}
            <div className="mt-2 py-1 text-center border-t">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                tf.direction === 'CALL'
                ? 'bg-green-100 dark:bg-green-800/20 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-400'
              }`}>
                {getTicketName(tf.direction)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {t("confluenceDisclaimer")}
      </div>
    </div>
  );
}
