
/**
 * Calculates the score for Bollinger Bands Breakout strategy
 */
export const calculateBollingerScore = (
  strategyKey: string,
  prices: number[],
  bbands: any,
  volatility: number
): number => {
  if (strategyKey !== "BOLLINGER_BREAKOUT") return 0;
  
  let score = 0;
  const currentPrice = prices[prices.length - 1];
  const bandWidth = bbands.upper - bbands.lower;
  const normalizedBandWidth = bandWidth / bbands.middle;
  
  // Bollinger band width scoring - higher score for narrower bands before breakout
  if (normalizedBandWidth < 0.03) {
    score += 25; // Tight bands - potential breakout setup
  } else if (normalizedBandWidth < 0.05) {
    score += 15; // Medium bands
  }
  
  // Price relative to bands
  const distanceToUpper = Math.abs(currentPrice - bbands.upper);
  const distanceToLower = Math.abs(currentPrice - bbands.lower);
  const distanceToMiddle = Math.abs(currentPrice - bbands.middle);
  
  // Higher score when price is near bands
  if (distanceToUpper < volatility || distanceToLower < volatility) {
    score += 50;
  } else if (distanceToMiddle < volatility / 2) {
    score += 20;
  }
  
  return score;
};
