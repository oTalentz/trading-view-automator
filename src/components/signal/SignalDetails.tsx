
import React from 'react';
import { Clock, TimerIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MarketCondition } from '@/utils/technicalAnalysis';

interface SignalDetailsProps {
  symbol: string;
  primarySignal: {
    direction: 'CALL' | 'PUT';
    confidence: number;
    entryTime: string;
    expiryTime: string;
    marketCondition: MarketCondition;
  };
  countdown: number;
  overallConfluence: number;
}

export function SignalDetails({ 
  symbol, 
  primarySignal, 
  countdown, 
  overallConfluence 
}: SignalDetailsProps) {
  const { t, language } = useLanguage();
  
  // Formata o tempo para exibição no formato local
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'pt-br' ? 'pt-BR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
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
  
  return (
    <div className="space-y-1 mb-3">
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("symbol")}:</span>
        <span className="font-medium">{symbol}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("entryTime")}:</span>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(primarySignal.entryTime)}</span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("timeLeft")}:</span>
        <span className={`font-medium ${countdown <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : ''}`}>
          <div className="flex items-center gap-1">
            <TimerIcon className="h-4 w-4" />
            <span>{countdown}s</span>
          </div>
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("expiryTime")}:</span>
        <span className="font-medium">{formatTime(primarySignal.expiryTime)}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("confidence")}:</span>
        <span className={`font-medium ${
          primarySignal.confidence > 90 ? 'text-green-600 dark:text-green-400' : 
          primarySignal.confidence > 80 ? 'text-emerald-600 dark:text-emerald-400' : 
          primarySignal.confidence > 70 ? 'text-yellow-600 dark:text-yellow-400' : 
          'text-orange-600 dark:text-orange-400'
        }`}>{primarySignal.confidence}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("marketCondition")}:</span>
        <span className="font-medium">{getMarketConditionDisplay(primarySignal.marketCondition)}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t("confluenceScore")}:</span>
        <span className={`font-medium ${
          overallConfluence > 80 ? 'text-green-600 dark:text-green-400' :
          overallConfluence > 50 ? 'text-amber-600 dark:text-amber-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>{overallConfluence}%</span>
      </div>
    </div>
  );
}
