
/**
 * Calculates the score for Ichimoku Cloud strategy
 */
export const calculateIchimokuScore = (
  strategyKey: string,
  prices: number[]
): number => {
  if (strategyKey !== "ICHIMOKU_CLOUD") return 0;
  
  let score = 0;
  
  // Simplified Ichimoku calculation
  const tenkanPeriod = 9;
  const kijunPeriod = 26;
  
  // Calculate Tenkan-sen (Conversion Line)
  let highestHigh = -Infinity;
  let lowestLow = Infinity;
  
  for (let i = prices.length - tenkanPeriod; i < prices.length; i++) {
    if (i >= 0) {
      highestHigh = Math.max(highestHigh, prices[i]);
      lowestLow = Math.min(lowestLow, prices[i]);
    }
  }
  
  const tenkanSen = (highestHigh + lowestLow) / 2;
  
  // Calculate Kijun-sen (Base Line)
  highestHigh = -Infinity;
  lowestLow = Infinity;
  
  for (let i = prices.length - kijunPeriod; i < prices.length; i++) {
    if (i >= 0) {
      highestHigh = Math.max(highestHigh, prices[i]);
      lowestLow = Math.min(lowestLow, prices[i]);
    }
  }
  
  const kijunSen = (highestHigh + lowestLow) / 2;
  
  // Check Tenkan/Kijun Cross
  const currentPrice = prices[prices.length - 1];
  
  if (Math.abs(tenkanSen - kijunSen) / kijunSen < 0.005) {
    score += 30; // Near crossing
  }
  
  // Price relative to Tenkan/Kijun
  if ((tenkanSen > kijunSen && currentPrice > tenkanSen) || 
      (tenkanSen < kijunSen && currentPrice < tenkanSen)) {
    score += 25; // Strong trend confirmation
  }
  
  return score;
};
