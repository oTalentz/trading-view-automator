
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { BarChart2 } from 'lucide-react';

// Atualizando a interface para compatibilidade com os dados recebidos
interface TechnicalAnalysisProps {
  technicalScores: {
    rsi?: number;
    macd?: number;
    bollingerBands?: number;
    volumeTrend?: number;
    priceAction?: number;
    overallScore?: number;
    overall?: number;
    trend?: number;
    momentum?: number;
    volatility?: number;
  };
  trendStrength: {
    value: number;
    direction: 'bullish' | 'bearish' | 'neutral';
  } | number;
}

export function TechnicalAnalysis({ 
  technicalScores, 
  trendStrength 
}: TechnicalAnalysisProps) {
  const { t } = useLanguage();
  
  // Normalizar dados técnicos para compatibilidade
  const normalizedScores = {
    overall: technicalScores.overall || technicalScores.overallScore || 0,
    trend: technicalScores.trend || technicalScores.priceAction || 0,
    momentum: technicalScores.momentum || technicalScores.macd || 0,
    volatility: technicalScores.volatility || technicalScores.volumeTrend || 0
  };

  // Normalizar trendStrength para compatibilidade com diferentes formatos
  const normalizedTrendStrength = typeof trendStrength === 'number' 
    ? { value: trendStrength, direction: trendStrength > 60 ? 'bullish' : trendStrength < 40 ? 'bearish' : 'neutral' as 'bullish' | 'bearish' | 'neutral' }
    : trendStrength;
  
  // Helper para determinar a cor baseada no valor
  const getColorClass = (value: number, isPositive = true): string => {
    if (isPositive) {
      if (value >= 80) return 'text-green-600 dark:text-green-400';
      if (value >= 60) return 'text-emerald-600 dark:text-emerald-400';
      if (value >= 40) return 'text-amber-600 dark:text-amber-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (value >= 80) return 'text-red-600 dark:text-red-400';
      if (value >= 60) return 'text-orange-600 dark:text-orange-400';
      if (value >= 40) return 'text-amber-600 dark:text-amber-400';
      return 'text-green-600 dark:text-green-400';
    }
  };
  
  // Helper para determinar a cor da barra de progresso baseada no valor
  const getProgressColorClass = (value: number, isPositive = true): string => {
    if (isPositive) {
      if (value >= 80) return 'bg-green-500';
      if (value >= 60) return 'bg-emerald-500';
      if (value >= 40) return 'bg-amber-500';
      return 'bg-red-500';
    } else {
      if (value >= 80) return 'bg-red-500';
      if (value >= 60) return 'bg-orange-500';
      if (value >= 40) return 'bg-amber-500';
      return 'bg-green-500';
    }
  };
  
  // Helper para determinar a cor do trend strength
  const getTrendStrengthColor = (value: number, direction: string): string => {
    if (direction === 'neutral') return 'text-gray-600 dark:text-gray-400';
    
    const isPositive = direction === 'bullish';
    return getColorClass(value, isPositive);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/20 flex-shrink-0 mt-1">
          <BarChart2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">{t("technicalAnalysis")}</h4>
          
          <div className="grid gap-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{t("overallScore")}</span>
                <span className={`text-xs font-medium ${getColorClass(normalizedScores.overall)}`}>
                  {normalizedScores.overall}%
                </span>
              </div>
              <Progress 
                value={normalizedScores.overall} 
                className="h-1.5"
                // @ts-ignore - progressColorClass é aplicado diretamente no CSS
                indicatorClassName={getProgressColorClass(normalizedScores.overall)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{t("trendScore")}</span>
                <span className={`text-xs font-medium ${getColorClass(normalizedScores.trend)}`}>
                  {normalizedScores.trend}%
                </span>
              </div>
              <Progress 
                value={normalizedScores.trend} 
                className="h-1.5"
                // @ts-ignore - progressColorClass é aplicado diretamente no CSS
                indicatorClassName={getProgressColorClass(normalizedScores.trend)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{t("momentumScore")}</span>
                <span className={`text-xs font-medium ${getColorClass(normalizedScores.momentum)}`}>
                  {normalizedScores.momentum}%
                </span>
              </div>
              <Progress 
                value={normalizedScores.momentum} 
                className="h-1.5"
                // @ts-ignore - progressColorClass é aplicado diretamente no CSS
                indicatorClassName={getProgressColorClass(normalizedScores.momentum)}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">{t("volatilityScore")}</span>
                <span className={`text-xs font-medium ${
                  getColorClass(normalizedScores.volatility, false)
                }`}>
                  {normalizedScores.volatility}%
                </span>
              </div>
              <Progress 
                value={normalizedScores.volatility} 
                className="h-1.5"
                // @ts-ignore - progressColorClass é aplicado diretamente no CSS
                indicatorClassName={getProgressColorClass(normalizedScores.volatility, false)}
              />
            </div>
          </div>
          
          <div className="mt-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{t("trendStrength")}</span>
              <span className={`text-xs font-medium ${
                getTrendStrengthColor(normalizedTrendStrength.value, normalizedTrendStrength.direction)
              }`}>
                {normalizedTrendStrength.value}% - {t(normalizedTrendStrength.direction)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
