import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { useAIStrategyOptimizer } from './multiTimeframe/useAIStrategyOptimizer';
import { getSignalHistory } from '@/utils/signalHistoryUtils';

export interface AIInsight {
  key: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'error';
  score: number;
}

export function useAIInsights(symbol: string) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { optimizeStrategy, optimizationResult } = useAIStrategyOptimizer();
  const { t } = useLanguage();

  const generateInsights = () => {
    setIsLoading(true);
    
    try {
      // Get signal history
      const signalHistory = getSignalHistory();
      const symbolSignals = signalHistory.filter(s => s.symbol === symbol);
      
      if (symbolSignals.length < 5) {
        setInsights([{
          key: 'insufficient-data',
          title: t("insufficientData"),
          description: t("needMoreSignalsForInsights"),
          type: 'info',
          score: 0
        }]);
        setIsLoading(false);
        return;
      }
      
      // Run AI optimization if not already done
      if (!optimizationResult) {
        // Pass only the symbol parameter (minSampleSize will use the default value)
        optimizeStrategy(symbol);
      }
      
      // Calculate general metrics
      const completedSignals = symbolSignals.filter(s => s.result);
      const winningSignals = symbolSignals.filter(s => s.result === 'WIN');
      const winRate = completedSignals.length > 0 
        ? (winningSignals.length / completedSignals.length) * 100 
        : 0;
      
      // Generate insights based on data
      const newInsights: AIInsight[] = [];
      
      // Win rate insight
      if (winRate >= 70) {
        newInsights.push({
          key: 'win-rate-excellent',
          title: t("excellentWinRate"),
          description: t("winRateAbove70"),
          type: 'success',
          score: 90
        });
      } else if (winRate >= 55) {
        newInsights.push({
          key: 'win-rate-good',
          title: t("goodWinRate"),
          description: t("winRateAbove55"),
          type: 'success',
          score: 70
        });
      } else if (winRate >= 45) {
        newInsights.push({
          key: 'win-rate-average',
          title: t("averageWinRate"),
          description: t("winRateAverage"),
          type: 'info',
          score: 50
        });
      } else if (completedSignals.length > 0) {
        newInsights.push({
          key: 'win-rate-low',
          title: t("lowWinRate"),
          description: t("winRateBelowAverage"),
          type: 'warning',
          score: 30
        });
      }
      
      // Confidence correlation insight
      const highConfidenceSignals = completedSignals.filter(s => s.confidence >= 85);
      const highConfidenceWins = highConfidenceSignals.filter(s => s.result === 'WIN').length;
      const highConfidenceWinRate = highConfidenceSignals.length > 0 
        ? (highConfidenceWins / highConfidenceSignals.length) * 100 
        : 0;
      
      if (highConfidenceSignals.length >= 5) {
        if (highConfidenceWinRate >= 70) {
          newInsights.push({
            key: 'high-confidence-effective',
            title: t("highConfidenceEffective"),
            description: t("highConfidenceGoodResults"),
            type: 'success',
            score: 85
          });
        } else if (highConfidenceWinRate < 50) {
          newInsights.push({
            key: 'high-confidence-misleading',
            title: t("highConfidenceMisleading"),
            description: t("highConfidencePoorResults"),
            type: 'warning',
            score: 40
          });
        }
      }
      
      // Timeframe insights
      if (optimizationResult && optimizationResult.recommendedTimeframes.length > 0) {
        newInsights.push({
          key: 'optimal-timeframes',
          title: t("optimalTimeframes"),
          description: t("recommendedTimeframes", { 
            timeframes: optimizationResult.recommendedTimeframes.join(', ') 
          }),
          type: 'info',
          score: 75
        });
      }
      
      // Sort insights by score (highest first)
      newInsights.sort((a, b) => b.score - a.score);
      
      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast.error(t("insightsGenerationError"), {
        description: t("tryAgainLater"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize insights when symbol changes
  useEffect(() => {
    if (symbol) {
      generateInsights();
    }
  }, [symbol]);
  
  return {
    insights,
    isLoading,
    generateInsights
  };
}
