
import React from 'react';
import { Clock, TimerIcon, BarChart, Activity, ArrowRight, Percent } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MarketCondition } from '@/utils/technicalAnalysis';
import { Progress } from '@/components/ui/progress';

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
  
  // Mapeia condição de mercado para cores
  const getMarketConditionColor = (condition: MarketCondition): {bg: string, text: string} => {
    switch (condition) {
      case MarketCondition.STRONG_TREND_UP:
        return {bg: 'bg-green-500/20', text: 'text-green-400'};
      case MarketCondition.TREND_UP:
        return {bg: 'bg-emerald-500/20', text: 'text-emerald-400'};
      case MarketCondition.SIDEWAYS:
        return {bg: 'bg-blue-500/20', text: 'text-blue-400'};
      case MarketCondition.TREND_DOWN:
        return {bg: 'bg-amber-500/20', text: 'text-amber-400'};
      case MarketCondition.STRONG_TREND_DOWN:
        return {bg: 'bg-red-500/20', text: 'text-red-400'};
      case MarketCondition.VOLATILE:
        return {bg: 'bg-purple-500/20', text: 'text-purple-400'};
      default:
        return {bg: 'bg-gray-500/20', text: 'text-gray-400'};
    }
  };
  
  const marketConditionStyle = getMarketConditionColor(primarySignal.marketCondition);
  
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800/50">
          <Activity className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("symbol")}</span>
          <span className="font-medium ml-auto">{symbol.split(':')[1]}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("confidence")}</span>
            </div>
            <span className={`font-medium ${
              primarySignal.confidence > 90 ? 'text-green-500' : 
              primarySignal.confidence > 80 ? 'text-emerald-500' : 
              primarySignal.confidence > 70 ? 'text-yellow-500' : 
              'text-orange-500'
            }`}>{primarySignal.confidence}%</span>
          </div>
          <Progress 
            value={primarySignal.confidence} 
            className="h-2 bg-gray-200 dark:bg-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t("confluenceScore")}</span>
            </div>
            <span className={`font-medium ${
              overallConfluence > 80 ? 'text-green-500' :
              overallConfluence > 50 ? 'text-amber-500' :
              'text-gray-500'
            }`}>{overallConfluence}%</span>
          </div>
          <Progress 
            value={overallConfluence} 
            className="h-2 bg-gray-200 dark:bg-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{t("entryTime")}</span>
            </div>
            <span className="font-mono text-sm font-bold text-center">{formatTime(primarySignal.entryTime)}</span>
          </div>
          
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{t("expiryTime")}</span>
            </div>
            <span className="font-mono text-sm font-bold text-center">{formatTime(primarySignal.expiryTime)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg flex flex-col ${marketConditionStyle.bg}`}>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t("marketCondition")}</span>
            <span className={`text-sm font-bold ${marketConditionStyle.text}`}>
              {getMarketConditionDisplay(primarySignal.marketCondition)}
            </span>
          </div>
          
          <div className={`flex flex-col p-3 rounded-lg ${
            countdown <= 10 
              ? 'bg-red-500/20 border border-red-500/30 animate-pulse' 
              : 'bg-amber-500/10 border border-amber-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <TimerIcon className={`h-4 w-4 ${countdown <= 10 ? 'text-red-500' : 'text-amber-500'}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{t("timeLeft")}</span>
            </div>
            <span className={`text-center font-mono text-sm font-bold ${
              countdown <= 10 ? 'text-red-500' : 'text-amber-500'
            }`}>
              {countdown}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
