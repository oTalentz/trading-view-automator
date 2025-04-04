
import { useState } from 'react';
import { toast } from "sonner";
import { useLanguage } from '@/context/LanguageContext';
import { getSignalHistory, SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { cacheService } from '@/utils/cacheSystem';
import { MultiTimeframeAnalysisResult } from '@/types/timeframeAnalysis';

interface StrategyOptimizationResult {
  confidenceAdjustment: number;
  recommendedTimeframes: string[];
  volatilityThreshold: number;
  entryTimingAdjustment: number;
  expiryMinutesAdjustment: number;
  preferredMarketConditions: string[];
  avoidedMarketConditions: string[];
  lastUpdated: string;
}

/**
 * Hook that uses AI to analyze past performance and optimize trading strategies
 */
export function useAIStrategyOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<StrategyOptimizationResult | null>(null);
  const { t } = useLanguage();

  /**
   * Analyzes historical signals to detect patterns and optimize strategy parameters
   * @param symbol The symbol to optimize for (e.g. 'EUR/USD')
   * @param minSampleSize Minimum number of signals required for optimization
   * @returns Optimization result with strategy adjustments
   */
  const optimizeStrategy = (symbol: string, minSampleSize = 10): StrategyOptimizationResult | null => {
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
    if (!analysis || !optimizationResult) return analysis;

    // Clone the analysis to avoid mutating the original
    const enhancedAnalysis = JSON.parse(JSON.stringify(analysis)) as MultiTimeframeAnalysisResult;
    
    // Apply confidence adjustment based on AI optimization
    const adjustedConfidence = Math.min(
      Math.max(
        enhancedAnalysis.primarySignal.confidence + optimizationResult.confidenceAdjustment,
        60
      ),
      96
    );
    
    enhancedAnalysis.primarySignal.confidence = Math.round(adjustedConfidence);
    
    // Apply entry timing adjustment (adjust countdown)
    if (optimizationResult.entryTimingAdjustment !== 0) {
      const adjustedCountdown = Math.max(enhancedAnalysis.countdown + optimizationResult.entryTimingAdjustment, 1);
      enhancedAnalysis.countdown = adjustedCountdown;
      
      // Recalculate entry time
      const now = new Date();
      const entryTimeMillis = now.getTime() + (adjustedCountdown * 1000);
      enhancedAnalysis.primarySignal.entryTime = new Date(entryTimeMillis).toISOString();
      
      // Recalculate expiry time with adjustment
      const expiryMinutes = parseInt(enhancedAnalysis.primarySignal.expiryTime) + optimizationResult.expiryMinutesAdjustment;
      const expiryTimeMillis = entryTimeMillis + (expiryMinutes * 60 * 1000);
      enhancedAnalysis.primarySignal.expiryTime = new Date(expiryTimeMillis).toISOString();
    }
    
    // Add AI optimization indicator
    if (!enhancedAnalysis.primarySignal.indicators.includes('AI Optimization')) {
      enhancedAnalysis.primarySignal.indicators.push('AI Optimization');
    }
    
    return enhancedAnalysis;
  };

  /**
   * Analyzes patterns in historical data to find optimal strategy parameters
   * @param winningSignals Array of winning signals
   * @param losingSignals Array of losing signals
   * @param winRate Overall win rate
   * @returns Optimized strategy parameters
   */
  const analyzePatterns = (
    winningSignals: SignalHistoryEntry[],
    losingSignals: SignalHistoryEntry[],
    winRate: number
  ): StrategyOptimizationResult => {
    // Find optimal timeframes based on win rate per timeframe
    const timeframePerformance: Record<string, { wins: number; total: number }> = {};
    
    // Analyze winning signals by timeframe
    winningSignals.forEach(signal => {
      if (!timeframePerformance[signal.timeframe]) {
        timeframePerformance[signal.timeframe] = { wins: 0, total: 0 };
      }
      timeframePerformance[signal.timeframe].wins += 1;
      timeframePerformance[signal.timeframe].total += 1;
    });
    
    // Analyze losing signals by timeframe
    losingSignals.forEach(signal => {
      if (!timeframePerformance[signal.timeframe]) {
        timeframePerformance[signal.timeframe] = { wins: 0, total: 0 };
      }
      timeframePerformance[signal.timeframe].total += 1;
    });
    
    // Calculate win rate by timeframe and find the best performing ones
    const timeframeWinRates = Object.entries(timeframePerformance)
      .map(([timeframe, data]) => ({
        timeframe,
        winRate: (data.wins / data.total) * 100,
        sampleSize: data.total
      }))
      .filter(item => item.sampleSize >= 5) // Only consider timeframes with enough samples
      .sort((a, b) => b.winRate - a.winRate);
    
    // Select top performing timeframes
    const recommendedTimeframes = timeframeWinRates
      .slice(0, 3)
      .map(item => item.timeframe);
    
    // Calculate confidence adjustment based on performance
    const confidenceAdjustment = winRate >= 65 ? 5 : winRate >= 50 ? 0 : -5;
    
    // Analyze market conditions (simplified implementation)
    const preferredMarketConditions = ['TRENDING', 'BREAKOUT'];
    const avoidedMarketConditions = ['CHOPPY', 'RANGING'];
    
    // Return optimized strategy parameters
    return {
      confidenceAdjustment,
      recommendedTimeframes,
      volatilityThreshold: 0.015, // Default value
      entryTimingAdjustment: winRate >= 60 ? 0 : 2, // Adjust entry timing for lower win rates
      expiryMinutesAdjustment: winRate >= 65 ? 1 : 0, // Extend expiry for high win rates
      preferredMarketConditions,
      avoidedMarketConditions,
      lastUpdated: new Date().toISOString()
    };
  };

  return {
    optimizeStrategy,
    enhanceAnalysisWithAI,
    isOptimizing,
    optimizationResult
  };
}
