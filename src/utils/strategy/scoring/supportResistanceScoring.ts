
/**
 * Calculates the score for Support/Resistance strategy
 */
export const calculateSupportResistanceScore = (
  strategyKey: string,
  prices: number[],
  volatility: number
): number => {
  if (strategyKey !== "SUPPORT_RESISTANCE") return 0;
  
  let score = 0;
  const supportResistance = findSupportResistanceLevels(prices);
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2] || currentPrice;
  
  const distanceToSupport = Math.abs(currentPrice - supportResistance.support);
  const distanceToResistance = Math.abs(currentPrice - supportResistance.resistance);
  
  // Higher score when price is near support or resistance
  if (distanceToSupport < volatility || distanceToResistance < volatility) {
    score += 50;
    
    // Bonus for price bouncing off support/resistance
    if (distanceToSupport < volatility && currentPrice > previousPrice) {
      score += 15; // Price bouncing up from support
    } else if (distanceToResistance < volatility && currentPrice < previousPrice) {
      score += 15; // Price bouncing down from resistance
    }
  }
  
  // Detect multiple tests of support/resistance for higher probability
  const recentPrices = prices.slice(-10);
  let supportTests = 0;
  let resistanceTests = 0;
  
  recentPrices.forEach(price => {
    if (Math.abs(price - supportResistance.support) < volatility) supportTests++;
    if (Math.abs(price - supportResistance.resistance) < volatility) resistanceTests++;
  });
  
  if (supportTests > 1 || resistanceTests > 1) {
    score += 15; // Multiple tests increase reliability
  }
  
  return score;
};

// Import necessary functions
import { findSupportResistanceLevels } from '@/utils/technicalAnalysis';
