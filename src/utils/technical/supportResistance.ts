
import { calculateMA } from "./movingAverages";

// Find support and resistance levels based on price action
export const findSupportResistanceLevels = (prices: number[]) => {
  if (prices.length < 30) {
    return {
      support: prices[prices.length - 1] * 0.98,
      resistance: prices[prices.length - 1] * 1.02
    };
  }
  
  // Get recent prices for analysis
  const recentPrices = prices.slice(-100);
  const currentPrice = prices[prices.length - 1];
  
  // Find local minimums and maximums
  const minimums: number[] = [];
  const maximums: number[] = [];
  
  for (let i = 2; i < recentPrices.length - 2; i++) {
    // Local minimum
    if (recentPrices[i] < recentPrices[i - 1] && 
        recentPrices[i] < recentPrices[i - 2] && 
        recentPrices[i] < recentPrices[i + 1] && 
        recentPrices[i] < recentPrices[i + 2]) {
      minimums.push(recentPrices[i]);
    }
    
    // Local maximum
    if (recentPrices[i] > recentPrices[i - 1] && 
        recentPrices[i] > recentPrices[i - 2] && 
        recentPrices[i] > recentPrices[i + 1] && 
        recentPrices[i] > recentPrices[i + 2]) {
      maximums.push(recentPrices[i]);
    }
  }
  
  // Use moving average when not enough local extremes
  if (minimums.length < 3 || maximums.length < 3) {
    const ma20 = calculateMA(prices, 20);
    return {
      support: currentPrice < ma20 ? currentPrice * 0.985 : ma20 * 0.99,
      resistance: currentPrice > ma20 ? currentPrice * 1.015 : ma20 * 1.01
    };
  }
  
  // Find the closest support below current price
  minimums.sort((a, b) => b - a); // Sort descending
  let support = minimums[0];
  for (const min of minimums) {
    if (min < currentPrice) {
      support = min;
      break;
    }
  }
  
  // Find the closest resistance above current price
  maximums.sort((a, b) => a - b); // Sort ascending
  let resistance = maximums[0];
  for (const max of maximums) {
    if (max > currentPrice) {
      resistance = max;
      break;
    }
  }
  
  // If no support or resistance found, use percentage-based approach
  if (support >= currentPrice) support = currentPrice * 0.985;
  if (resistance <= currentPrice) resistance = currentPrice * 1.015;
  
  return { support, resistance };
};
