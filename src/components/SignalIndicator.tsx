import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Clock, BarChart3, Layers, LineChart, TimerIcon, Target, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "sonner";
import { useMultiTimeframeAnalysis } from '@/hooks/useMultiTimeframeAnalysis';
import { MarketCondition } from '@/utils/technicalAnalysis';
import { TimeframeConfluence } from '@/components/TimeframeConfluence';

interface SignalIndicatorProps {
  symbol: string;
  interval?: string;
}

export function SignalIndicator({ symbol, interval = "1" }: SignalIndicatorProps) {
  const { analysis, countdown } = useMultiTimeframeAnalysis(symbol, interval);
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

  // Retorna a cor para a qualidade de entrada
  const getEntryQualityColor = (quality: string | undefined) => {
    if (!quality) return 'text-gray-600 dark:text-gray-400';
    
    switch (quality) {
      case 'Excelente': return 'text-green-600 dark:text-green-400 font-bold';
      case 'Muito Bom': return 'text-emerald-600 dark:text-emerald-400 font-semibold';
      case 'Bom': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
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

  // Extrair o sinal principal da análise
  const { primarySignal } = analysis;

  return (
    <div>
      <div className={`p-4 border rounded-lg shadow-sm ${
        primarySignal.direction === 'CALL' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{t("entrySignal")}</h3>
          <div className={`px-2 py-1 rounded text-white ${
            primarySignal.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {primarySignal.direction}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {primarySignal.direction === 'CALL' ? (
            <ArrowUpCircle className="h-6 w-6 text-green-500" />
          ) : (
            <ArrowDownCircle className="h-6 w-6 text-red-500" />
          )}
          <span className="font-medium">
            {primarySignal.direction === 'CALL' ? t("buySignal") : t("sellSignal")}
          </span>
          
          {primarySignal.entryQuality && (
            <span className={`ml-1 ${getEntryQualityColor(primarySignal.entryQuality)}`}>
              ({primarySignal.entryQuality})
            </span>
          )}
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
              analysis.overallConfluence > 80 ? 'text-green-600 dark:text-green-400' :
              analysis.overallConfluence > 50 ? 'text-amber-600 dark:text-amber-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>{analysis.overallConfluence}%</span>
          </div>
          
          {primarySignal.priceTargets && (
            <div className="pt-2 border-t mt-2">
              <div className="text-sm font-medium flex items-center gap-1 mb-1">
                <Target className="h-4 w-4" />
                {t("priceTargets")}:
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {t("target")}: {primarySignal.priceTargets.target}
                </span>
                <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {t("stopLoss")}: {primarySignal.priceTargets.stopLoss}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-2 mt-2">
          <h4 className="font-medium mb-1 flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            {t("strategy")}: {primarySignal.strategy}
          </h4>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {t("basedOn")}:
            </div>
            <ul className="list-disc list-inside text-sm">
              {primarySignal.indicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
          </div>
          
          {primarySignal.supportResistance && (
            <div className="mt-2 text-sm">
              <div className="font-medium">{t("keyLevels")}:</div>
              <div className="flex justify-between mt-1">
                <span className="text-green-600 dark:text-green-400">{t("support")}: {primarySignal.supportResistance.support}</span>
                <span className="text-red-600 dark:text-red-400">{t("resistance")}: {primarySignal.supportResistance.resistance}</span>
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
                  <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${primarySignal.technicalScores.rsi}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">MACD</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${primarySignal.technicalScores.macd}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Bollinger</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${primarySignal.technicalScores.bollingerBands}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t("volume")}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${primarySignal.technicalScores.volumeTrend}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="text-sm font-medium">{t("trendStrength")}:</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
                <div 
                  className={`h-2.5 rounded-full ${
                    primarySignal.trendStrength > 80 ? 'bg-green-600' : 
                    primarySignal.trendStrength > 70 ? 'bg-lime-500' : 
                    primarySignal.trendStrength > 60 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${primarySignal.trendStrength}%` }}
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
      
      <TimeframeConfluence 
        timeframes={analysis.timeframes}
        overallConfluence={analysis.overallConfluence}
        confluenceDirection={analysis.confluenceDirection}
        currentTimeframe={interval}
      />
    </div>
  );
}
