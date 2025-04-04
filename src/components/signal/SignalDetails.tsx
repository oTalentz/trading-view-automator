
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
        return {bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-300'};
      case MarketCondition.TREND_UP:
        return {bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-800 dark:text-emerald-300'};
      case MarketCondition.SIDEWAYS:
        return {bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-300'};
      case MarketCondition.TREND_DOWN:
        return {bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-800 dark:text-amber-300'};
      case MarketCondition.STRONG_TREND_DOWN:
        return {bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300'};
      case MarketCondition.VOLATILE:
        return {bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-800 dark:text-purple-300'};
      default:
        return {bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-300'};
    }
  };
  
  const marketConditionStyle = getMarketConditionColor(primarySignal.marketCondition);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{t("symbol")}</span>
          <span className="font-medium ml-auto">{symbol.split(':')[1]}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t("confidence")}</span>
            </div>
            <span className={`font-medium ${
              primarySignal.confidence > 90 ? 'text-green-600 dark:text-green-400' : 
              primarySignal.confidence > 80 ? 'text-emerald-600 dark:text-emerald-400' : 
              primarySignal.confidence > 70 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-orange-600 dark:text-orange-400'
            }`}>{primarySignal.confidence}%</span>
          </div>
          <Progress 
            value={primarySignal.confidence} 
            className={
              primarySignal.confidence > 90 ? 'bg-green-100 dark:bg-green-900/20' : 
              primarySignal.confidence > 80 ? 'bg-emerald-100 dark:bg-emerald-900/20' : 
              primarySignal.confidence > 70 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
              'bg-orange-100 dark:bg-orange-900/20'
            }
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t("confluenceScore")}</span>
            </div>
            <span className={`font-medium ${
              overallConfluence > 80 ? 'text-green-600 dark:text-green-400' :
              overallConfluence > 50 ? 'text-amber-600 dark:text-amber-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>{overallConfluence}%</span>
          </div>
          <Progress 
            value={overallConfluence} 
            className={
              overallConfluence > 80 ? 'bg-green-100 dark:bg-green-900/20' : 
              overallConfluence > 50 ? 'bg-amber-100 dark:bg-amber-900/20' : 
              'bg-gray-100 dark:bg-gray-900/20'
            }
          />
        </div>
        
        <div className={`p-2 rounded-lg ${marketConditionStyle.bg}`}>
          <div className="flex items-center">
            <span className="text-sm font-medium text-muted-foreground">{t("marketCondition")}</span>
            <span className={`ml-auto font-medium ${marketConditionStyle.text}`}>{getMarketConditionDisplay(primarySignal.marketCondition)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">{t("entryTime")}</span>
          <span className="ml-auto font-mono">{formatTime(primarySignal.entryTime)}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
          <Clock className="h-5 w-5 text-indigo-500" />
          <span className="text-sm font-medium">{t("expiryTime")}</span>
          <span className="ml-auto font-mono">{formatTime(primarySignal.expiryTime)}</span>
        </div>
        
        <div className={`flex items-center gap-2 p-2 ${
          countdown <= 10 
            ? 'bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 animate-pulse' 
            : 'bg-amber-50 dark:bg-amber-900/10'
        } rounded-lg`}>
          <TimerIcon className={`h-5 w-5 ${
            countdown <= 10 ? 'text-red-500' : 'text-amber-500'
          }`} />
          <span className="text-sm font-medium">{t("timeLeft")}</span>
          <span className="ml-auto font-mono font-bold">
            {countdown}s
          </span>
        </div>
      </div>
    </div>
  );
}
