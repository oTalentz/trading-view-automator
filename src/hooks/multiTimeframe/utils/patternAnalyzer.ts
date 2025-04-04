
import { SignalHistoryEntry } from '@/utils/signalHistoryUtils';
import { StrategyOptimizationResult, TimeframePerformance } from '../types/strategyTypes';

/**
 * Analyzes patterns in historical data to find optimal strategy parameters
 * @param winningSignals Array of winning signals
 * @param losingSignals Array of losing signals 
 * @param winRate Overall win rate
 * @returns Optimized strategy parameters
 */
export const analyzePatterns = (
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
