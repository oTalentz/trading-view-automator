
/**
 * Calculates the score for Trend Following strategy
 */
export const calculateTrendFollowingScore = (
  strategyKey: string,
  prices: number[],
  volume: number[]
): number => {
  if (strategyKey !== "TREND_FOLLOWING") return 0;
  
  let score = 0;
  const trendStrengthResult = calculateTrendStrength(prices, volume);
  const trendStrength = trendStrengthResult.value;
  
  // Base score from trend strength
  score += trendStrength / 2;
  
  // Analyze price momentum to confirm trend
  const recentPrices = prices.slice(-5);
  let consistentDirection = true;
  
  // Determine direction from recent price movements
  const priceDirection = recentPrices[recentPrices.length - 1] > recentPrices[0] ? 'bullish' : 'bearish';
  
  for (let i = 1; i < recentPrices.length; i++) {
    if (priceDirection === 'bullish' && recentPrices[i] < recentPrices[i-1]) {
      consistentDirection = false;
      break;
    } else if (priceDirection === 'bearish' && recentPrices[i] > recentPrices[i-1]) {
      consistentDirection = false;
      break;
    }
  }
  
  if (consistentDirection) {
    score += 20; // Bonus for consistent price direction
  }
  
  // Volume confirmation for trend
  const recentVolume = volume.slice(-5);
  let volumeIncreasing = true;
  
  for (let i = 1; i < recentVolume.length; i++) {
    if (recentVolume[i] < recentVolume[i-1] * 0.8) {
      volumeIncreasing = false;
      break;
    }
  }
  
  if (volumeIncreasing) {
    score += 15; // Bonus for increasing volume
  }
  
  return score;
};

// Import necessary functions
import { calculateTrendStrength } from '@/utils/technicalAnalysis';
