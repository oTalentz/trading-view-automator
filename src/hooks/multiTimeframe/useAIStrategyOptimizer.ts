
import { useState } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory } from '@/utils/signalHistoryUtils';
import { cacheService } from '@/utils/cacheSystem';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';
import { analyzePatterns } from './utils/patternAnalyzer';
import { enhanceAnalysisWithAI as enhanceAnalysis } from './utils/analysisEnhancer';
import { StrategyOptimizationResult, UseAIStrategyOptimizerReturn } from './types/strategyTypes';

/**
 * Hook that uses AI to analyze past performance and optimize trading strategies
 */
export function useAIStrategyOptimizer(): UseAIStrategyOptimizerReturn {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<StrategyOptimizationResult | null>(null);
  const { t } = useLanguage();

  /**
   * Analyzes historical signals to detect patterns and optimize strategy parameters
   * @param symbol The symbol to optimize for (e.g. 'EUR/USD')
   * @returns Optimization result with strategy adjustments
   */
  const optimizeStrategy = (symbol: string): StrategyOptimizationResult | null => {
    const minSampleSize = 10; // Default value moved here
    setIsOptimizing(true);

    try {
      // Check cache first to avoid unnecessary recalculations
      const cacheKey = cacheService.generateKey('ai-optimization', { symbol });
      const cachedResult = cacheService.get<StrategyOptimizationResult>(cacheKey);
      
      if (cachedResult) {
        setOptimizationResult(cachedResult);
        setIsOptimizing(false);
        return cachedResult;
      }

      // Get historical signal data
      const signalHistory = getSignalHistory();
      const symbolSignals = signalHistory.filter(signal => signal.symbol === symbol);
      
      // Only proceed if we have enough data
      if (symbolSignals.length < minSampleSize) {
        toast.warning(t("insufficientData"), {
          description: t("needMoreSignals", { count: minSampleSize }),
        });
        setIsOptimizing(false);
        return null;
      }

      // Split signals into winning and losing trades
      const winningSignals = symbolSignals.filter(signal => signal.result === 'WIN');
      const losingSignals = symbolSignals.filter(signal => signal.result === 'LOSS');
      
      // Calculate win rate
      const completedSignals = winningSignals.length + losingSignals.length;
      const winRate = completedSignals > 0 ? (winningSignals.length / completedSignals) * 100 : 0;
      
      // Analyze patterns in winning vs losing trades
      const optimizedResult = analyzePatterns(winningSignals, losingSignals, winRate);
      
      // Cache the result for 24 hours (optimization doesn't need to run frequently)
      cacheService.set(cacheKey, optimizedResult, 24 * 60 * 60);
      
      setOptimizationResult(optimizedResult);
      setIsOptimizing(false);
      
      return optimizedResult;
    } catch (error) {
      console.error('Error in AI strategy optimization:', error);
      toast.error(t("optimizationError"), {
        description: t("tryAgainLater"),
      });
      setIsOptimizing(false);
      return null;
    }
  };

  /**
   * Apply AI optimizations to the current analysis
   * @param analysis The current analysis result
   * @returns Enhanced analysis with AI optimizations
   */
  const enhanceAnalysisWithAI = (
    analysis: MultiTimeframeAnalysisResult | null
  ): MultiTimeframeAnalysisResult | null => {
    return enhanceAnalysis(analysis, optimizationResult);
  };

  return {
    optimizeStrategy,
    enhanceAnalysisWithAI,
    isOptimizing,
    optimizationResult
  };
}
