
import { MarketCondition } from '@/utils/technicalAnalysis';
import { MARKET_CONDITION_STRATEGIES, ADVANCED_STRATEGIES } from '@/constants/tradingStrategies';
import { findSupportResistanceLevels, calculateTrendStrength } from '@/utils/technicalAnalysis';

/**
 * Selects the optimal trading strategy based on current market conditions and indicators
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
  
  // Calculate scores for each compatible strategy
  const strategyScores = compatibleStrategies.map(strategyKey => {
    const strategy = ADVANCED_STRATEGIES[strategyKey as keyof typeof ADVANCED_STRATEGIES];
    let score = 0;
    
    // RSI-based scoring
    if (strategyKey === "RSI_DIVERGENCE") {
      score += Math.abs(rsiValue - 50) * 2; // Higher score for extreme RSI values
    }
    
    // MACD-based scoring
    if (strategyKey === "MACD_CROSSOVER") {
      score += Math.abs(macdData.histogram) * 10;
    }
    
    // Bollinger Bands scoring
    if (strategyKey === "BOLLINGER_BREAKOUT") {
      const currentPrice = prices[prices.length - 1];
      const distanceToUpper = Math.abs(currentPrice - bbands.upper);
      const distanceToLower = Math.abs(currentPrice - bbands.lower);
      const distanceToMiddle = Math.abs(currentPrice - bbands.middle);
      
      // Higher score when price is near bands
      if (distanceToUpper < volatility || distanceToLower < volatility) {
        score += 50;
      } else if (distanceToMiddle < volatility / 2) {
        score += 20;
      }
    }
    
    // Support/Resistance scoring
    if (strategyKey === "SUPPORT_RESISTANCE") {
      const supportResistance = findSupportResistanceLevels(prices);
      const currentPrice = prices[prices.length - 1];
      const distanceToSupport = Math.abs(currentPrice - supportResistance.support);
      const distanceToResistance = Math.abs(currentPrice - supportResistance.resistance);
      
      // Higher score when price is near support or resistance
      if (distanceToSupport < volatility || distanceToResistance < volatility) {
        score += 50;
      }
    }
    
    // Trend following scoring
    if (strategyKey === "TREND_FOLLOWING") {
      const { value: trendStrength } = calculateTrendStrength(prices, volume);
      score += trendStrength / 2;
    }
    
    // Add base score for all strategies
    score += 50;
    
    return { key: strategyKey, score, strategy };
  });
  
  // Select the highest scoring strategy
  strategyScores.sort((a, b) => b.score - a.score);
  return strategyScores[0].strategy;
};
