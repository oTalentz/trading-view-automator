
import { MarketCondition } from '@/utils/technicalAnalysis';
import { ADVANCED_STRATEGIES } from '@/constants/tradingStrategies';
import { analyzeHistoricalPerformance } from '../strategyHistoricalAnalyzer';
import * as scoringFunctions from './index';

/**
 * Calculates scores for each applicable strategy
 */
export const scoreStrategies = (
  compatibleStrategies: string[],
  prices: number[],
  volume: number[],
  rsiValue: number,
  macdData: any,
  bbands: any,
  volatility: number
) => {
  return compatibleStrategies.map(strategyKey => {
    const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
    let score = 0;
    
    // Apply individual scoring functions
    score += scoringFunctions.calculateRSIScore(strategyKey, rsiValue);
    score += scoringFunctions.calculateMACDScore(strategyKey, macdData);
    score += scoringFunctions.calculateBollingerScore(strategyKey, prices, bbands, volatility);
    score += scoringFunctions.calculateSupportResistanceScore(strategyKey, prices, volatility);
    score += scoringFunctions.calculateTrendFollowingScore(strategyKey, prices, volume);
    score += scoringFunctions.calculateFibonacciScore(strategyKey, prices);
    score += scoringFunctions.calculateIchimokuScore(strategyKey, prices);
    
    // Analyze historical performance for additional scoring
    const historicalPerformance = analyzeHistoricalPerformance(strategyKey, prices, volume);
    score += historicalPerformance.performanceBonus;
    
    // Add base score for all strategies
    score += 50;
    
    return { 
      key: strategyKey, 
      score, 
      strategy: {
        ...strategy,
        historicalPerformance: historicalPerformance
      }
    };
  });
};
