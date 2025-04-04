
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MARKET_CONDITION_STRATEGIES } from '@/constants/tradingStrategies';
import { scoreStrategies } from './scoring/strategyScorer';

/**
 * Selects the optimal trading strategy based on current market conditions and indicators
 * with enhanced historical performance analysis
 */
export const selectStrategy = (
  marketCondition: MarketCondition, 
  prices: number[], 
  volume: number[],
  rsiValue: number, 
  macdData: any,
  bbands: any,
  volatility: number
) => {
  // Get compatible strategies for current market condition
  const compatibleStrategies = MARKET_CONDITION_STRATEGIES[marketCondition] || 
    MARKET_CONDITION_STRATEGIES.SIDEWAYS; // Default to sideways if condition not found
  
  // Calculate scores for each compatible strategy with enhanced algorithm
  const strategyScores = scoreStrategies(
    compatibleStrategies,
    prices,
    volume,
    rsiValue,
    macdData,
    bbands,
    volatility
  );
  
  // Select the highest scoring strategy
  strategyScores.sort((a, b) => b.score - a.score);
  return strategyScores[0].strategy;
};
