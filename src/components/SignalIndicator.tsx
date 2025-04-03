
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Clock, BarChart3, Layers, LineChart, TimerIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useMarketAnalysis, MarketAnalysisResult } from '@/hooks/useMarketAnalysis';
import { MarketCondition } from '@/utils/technicalAnalysis';

interface SignalIndicatorProps {
  symbol: string;
  interval?: string;
}

export function SignalIndicator({ symbol, interval = "1" }: SignalIndicatorProps) {
  const { analysis, countdown } = useMarketAnalysis(symbol, interval);
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

  // Se não houver análise, mostre um indicador de carregamento
  if (!analysis) {
    return (
      <div className="p-4 border rounded-lg flex items-center justify-center">
        <div className="animate-pulse">{t("analyzingMarket")}</div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg shadow-sm ${
      analysis.direction === 'CALL' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{t("entrySignal")}</h3>
        <div className={`px-2 py-1 rounded text-white ${
          analysis.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {analysis.direction}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {analysis.direction === 'CALL' ? (
          <ArrowUpCircle className="h-6 w-6 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-6 w-6 text-red-500" />
        )}
        <span className="font-medium">
          {analysis.direction === 'CALL' ? t("buySignal") : t("sellSignal")}
        </span>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("symbol")}:</span>
          <span className="font-medium">{symbol}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("entryTime")}:</span>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTime(analysis.entryTime)}</span>
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
          <span className="font-medium">{formatTime(analysis.expiryTime)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("confidence")}:</span>
          <span className={`font-medium ${
            analysis.confidence > 90 ? 'text-green-600 dark:text-green-400' : 
            analysis.confidence > 80 ? 'text-emerald-600 dark:text-emerald-400' : 
            analysis.confidence > 70 ? 'text-yellow-600 dark:text-yellow-400' : 
            'text-orange-600 dark:text-orange-400'
          }`}>{analysis.confidence}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t("marketCondition")}:</span>
          <span className="font-medium">{getMarketConditionDisplay(analysis.marketCondition)}</span>
        </div>
      </div>

      <div className="border-t pt-2 mt-2">
        <h4 className="font-medium mb-1 flex items-center gap-1">
          <BarChart3 className="h-4 w-4" />
          {t("strategy")}: {analysis.strategy}
        </h4>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
            <Layers className="h-4 w-4" />
            {t("basedOn")}:
          </div>
          <ul className="list-disc list-inside text-sm">
            {analysis.indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
        
        {analysis.supportResistance && (
          <div className="mt-2 text-sm">
            <div className="font-medium">{t("keyLevels")}:</div>
            <div className="flex justify-between mt-1">
              <span className="text-green-600 dark:text-green-400">{t("support")}: {analysis.supportResistance.support}</span>
              <span className="text-red-600 dark:text-red-400">{t("resistance")}: {analysis.supportResistance.resistance}</span>
            </div>
          </div>
        )}
        
        <div className="mt-3">
          <div className="text-sm font-medium flex items-center gap-1 mb-1">
            <LineChart className="h-4 w-4" />
            {t("technicalAnalysis")}:
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">RSI</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${analysis.technicalScores.rsi}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">MACD</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${analysis.technicalScores.macd}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Bollinger</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${analysis.technicalScores.bollingerBands}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t("volume")}</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${analysis.technicalScores.volumeTrend}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="text-sm font-medium">{t("trendStrength")}:</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
              <div 
                className={`h-2.5 rounded-full ${
                  analysis.trendStrength > 80 ? 'bg-green-600' : 
                  analysis.trendStrength > 70 ? 'bg-lime-500' : 
                  analysis.trendStrength > 60 ? 'bg-yellow-500' : 'bg-orange-500'
                }`}
                style={{ width: `${analysis.trendStrength}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {t("disclaimer")}
      </div>
    </div>
  );
}
