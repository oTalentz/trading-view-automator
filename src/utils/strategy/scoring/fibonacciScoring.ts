
/**
 * Calculates the score for Fibonacci Retracement strategy
 */
export const calculateFibonacciScore = (
  strategyKey: string,
  prices: number[]
): number => {
  if (strategyKey !== "FIBONACCI_RETRACEMENT") return 0;
  
  let score = 0;
  
  // Find local extremes
  const windowSize = 10;
  let localHigh = -Infinity;
  let localLow = Infinity;
  
  for (let i = prices.length - windowSize; i < prices.length; i++) {
    if (i >= 0) {
      localHigh = Math.max(localHigh, prices[i]);
      localLow = Math.min(localLow, prices[i]);
    }
  }
  
  const range = localHigh - localLow;
  const currentPrice = prices[prices.length - 1];
  
  // Check if price is near key Fibonacci levels
  const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
  let nearFibLevel = false;
  
  for (const level of fibLevels) {
    const fibPrice = localLow + (range * level);
    if (Math.abs(currentPrice - fibPrice) / currentPrice < 0.01) {
      nearFibLevel = true;
      break;
    }
  }
  
  if (nearFibLevel) {
    score += 40;
  }
  
  return score;
};
