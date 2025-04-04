
/**
 * Calculates the score for MACD Crossover strategy
 */
export const calculateMACDScore = (
  strategyKey: string,
  macdData: any
): number => {
  if (strategyKey !== "MACD_CROSSOVER") return 0;
  
  let score = 0;
  
  score += Math.abs(macdData.histogram) * 15;
  
  // Add bonus for increasing histogram momentum
  if (macdData.previousHistogram && 
      Math.abs(macdData.histogram) > Math.abs(macdData.previousHistogram)) {
    score += 10;
  }
  
  // Add bonus for MACD line and signal line alignment
  const macdSignalDiff = macdData.macdLine - macdData.signalLine;
  if (Math.abs(macdSignalDiff) < 0.0005) { // Very close to crossing
    score += 15;
  }
  
  return score;
};
