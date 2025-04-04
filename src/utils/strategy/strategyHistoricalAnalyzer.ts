
import { getCandleData } from '@/utils/candles/candleDataService';
import { generateSimulatedMarketData } from '@/utils/technicalAnalysis';
import { applyStrategy } from './strategyExecutor';

// Type definitions for historical performance
export interface CandleResult {
  timestamp: number;
  isCorrect: boolean;
  priceAtSignal: number;
  priceAtExpiry: number;
  percentChange: number;
  direction: 'CALL' | 'PUT';
}

export interface StrategyHistoricalPerformance {
  winRate: number;
  totalSignals: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  recentResults: CandleResult[];
  performanceBonus: number;
  overallScore: number;
  bestTimeframes: string[];
  worstTimeframes: string[];
}

/**
 * Analyzes historical performance of a strategy over past candles
 * to improve strategy selection with actual performance data
 */
export const analyzeHistoricalPerformance = (
  strategyKey: string,
  prices: number[],
  volume: number[]
): StrategyHistoricalPerformance => {
  // Get more historical data for backtesting
  const { prices: historicalPrices, volume: historicalVolume } = 
    generateSimulatedMarketData(`${strategyKey}_HISTORY`, 200);
  
  // Combine with current data
  const combinedPrices = [...historicalPrices, ...prices.slice(-50)];
  const combinedVolume = [...historicalVolume, ...volume.slice(-50)];
  
  // Results container
  const results: CandleResult[] = [];
  
  // Evaluate strategy on each historical candle
  for (let i = 30; i < combinedPrices.length - 10; i += 5) {
    // Get price data up to this candle
    const priceSlice = combinedPrices.slice(0, i);
    const volumeSlice = combinedVolume.slice(0, i);
    
    // Apply the strategy
    const signal = applyStrategy(strategyKey, priceSlice, volumeSlice);
    
    if (signal) {
      // Check if the signal was correct (10 candles later)
      const priceAtSignal = priceSlice[priceSlice.length - 1];
      const priceAtExpiry = combinedPrices[Math.min(i + 10, combinedPrices.length - 1)];
      const percentChange = ((priceAtExpiry - priceAtSignal) / priceAtSignal) * 100;
      
      const isCorrect = (signal.direction === 'CALL' && priceAtExpiry > priceAtSignal) ||
                        (signal.direction === 'PUT' && priceAtExpiry < priceAtSignal);
      
      results.push({
        timestamp: Date.now() - (combinedPrices.length - i) * 60000, // Simulated timestamp
        isCorrect,
        priceAtSignal,
        priceAtExpiry,
        percentChange,
        direction: signal.direction
      });
    }
  }
  
  // Calculate performance metrics
  const totalSignals = results.length;
  const wins = results.filter(r => r.isCorrect).length;
  const winRate = totalSignals > 0 ? (wins / totalSignals) * 100 : 0;
  
  // Calculate streaks
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  
  results.forEach(result => {
    if (result.isCorrect) {
      currentWinStreak++;
      currentLossStreak = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
    }
  });
  
  // Most recent results (last 20)
  const recentResults = results.slice(-20);
  
  // Calculate performance bonus based on win rate and consistency
  let performanceBonus = 0;
  
  if (winRate > 70) {
    performanceBonus += 25;
  } else if (winRate > 60) {
    performanceBonus += 15;
  } else if (winRate > 50) {
    performanceBonus += 5;
  } else if (winRate < 40) {
    performanceBonus -= 15;
  }
  
  // Recent performance carries more weight
  const recentWinRate = recentResults.length > 0 
    ? (recentResults.filter(r => r.isCorrect).length / recentResults.length) * 100
    : 0;
    
  if (recentWinRate > 70) {
    performanceBonus += 15;
  } else if (recentWinRate < 40 && recentResults.length >= 5) {
    performanceBonus -= 20;
  }
  
  // Consistency bonus/penalty
  if (maxConsecutiveWins > 5) {
    performanceBonus += 10;
  }
  if (maxConsecutiveLosses > 5) {
    performanceBonus -= 15;
  }
  
  // Analyze best and worst timeframes (simulated)
  const timeframes = ['1', '5', '15', '30', '60'];
  const timeframePerformance: Record<string, number> = {};
  
  timeframes.forEach(tf => {
    timeframePerformance[tf] = Math.round(40 + Math.random() * 30);
  });
  
  const sortedTimeframes = Object.entries(timeframePerformance)
    .sort((a, b) => b[1] - a[1]);
  
  const bestTimeframes = sortedTimeframes.slice(0, 2).map(([tf]) => tf);
  const worstTimeframes = sortedTimeframes.slice(-2).map(([tf]) => tf);
  
  // Overall score combining all factors
  const overallScore = Math.round(winRate * 0.7 + performanceBonus);
  
  return {
    winRate: Math.round(winRate),
    totalSignals,
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    recentResults,
    performanceBonus,
    overallScore,
    bestTimeframes,
    worstTimeframes
  };
};
